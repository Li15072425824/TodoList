---
name: article-to-ppt
description: 将用户丢进来的文章链接（微信公众号等）或文本转化为电子杂志风 HTML 翻页 PPT。当用户给一个 URL 并要求"转成 PPT / 做成 slides / 沉淀为演示文稿"时使用。
---

# 文章 → 电子杂志风 PPT

把一篇文章转化为单文件 HTML 横向翻页 PPT，突出核心亮点。底层引擎是 `guizang-ppt-skill`（位于 `/Users/lixing/.claude/skills/guizang-ppt-skill`），本 skill 是经过实战验证的**标准工作流**，按步骤执行即可，不要跳步。

## Step 1 · 抓取文章正文

WebFetch 对 `mp.weixin.qq.com` 等域名常被拦截，**直接用 curl + python 提取**（已验证可用）：

```bash
curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" "<URL>" -o /tmp/wx_article.html
```

```python
# /tmp/extract.py — 提取标题/作者/时间/正文
import re, html, datetime
raw = open('/tmp/wx_article.html', encoding='utf-8').read()
m = re.search(r'<h1[^>]*id="activity-name"[^>]*>(.*?)</h1>', raw, re.S)
print("TITLE:", html.unescape(m.group(1)).strip() if m else "N/A")
m = re.search(r'id="js_name"[^>]*>(.*?)</', raw, re.S)
print("AUTHOR:", html.unescape(m.group(1)).strip() if m else "N/A")
m = re.search(r'<div class="rich_media_content[^"]*"[^>]*>(.*?)</div>\s*<script', raw, re.S) or re.search(r'id="js_content"[^>]*>(.*)', raw, re.S)
content = m.group(1) if m else ""
content = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', content, flags=re.S)
content = re.sub(r'<br\s*/?>', '\n', content)
content = re.sub(r'</(p|section|div|h1|h2|h3|h4|li|tr)>', '\n', content)
content = re.sub(r'<[^>]+>', '', content)
lines = [l.strip() for l in html.unescape(content).split('\n') if l.strip()]
open('/tmp/wx_article.txt', 'w').write('\n'.join(lines))
```

**通读全文再动工**——提炼"关键要点"、金句、硬数据、结构，这是 PPT 质量的来源。

## Step 2 · 用 AskUserQuestion 对齐三件事

只问三个问题，不要更多：

1. **风格**：A 电子杂志风（默认推荐）还是 B 瑞士国际主义风？——决定用哪套 template/layouts/themes
2. **页数**：15 页左右（推荐）/ 10 页精简 / 20 页详尽
3. **用途**：个人学习 / 对外分享 / 笔记存档——决定语言风格

本 skill 默认走**风格 A**；风格 B 需另读 guizang-ppt-skill 的 swiss 系列 references，此处不展开。

## Step 3 · 搭项目骨架

```bash
mkdir -p <项目名>/ppt/{images,assets}
cp /Users/lixing/.claude/skills/guizang-ppt-skill/assets/template.html <项目名>/ppt/index.html
cp /Users/lixing/.claude/skills/guizang-ppt-skill/assets/motion.min.js <项目名>/ppt/assets/
```

**必改两处**（容易漏）：
- `<title>[必填]...` → 实际标题
- `:root` 主题色块 → 按 guizang-ppt-skill/references/themes.md 整体替换 6 行。选色参考：AI/科技/数据 → 🌊 靛蓝瓷；商业通用 → 🖋 墨水经典；人文 → 🌿 森林墨。**一套 deck 只用一套主题**。

动手前先 Read 模板确认类名（h-hero / h-xl / lead / kicker / stat-card / pipeline / rowline / pillar / callout / grid-* 等都在模板 `<style>` 里，不要发明新类）。

## Step 4 · 内容规划（先列表后写码）

按**三幕叙事弧**规划每页，列一张表再写 HTML：

```
封面(hero dark) → 数据大字报(light) → 幕封(hero light) → 正文页(light/dark 交替) → 幕封(hero dark) → … → 大引用收束(dark) → 封底问题(hero dark)
```

硬规则（生成后 `grep -o 'class="slide[^"]*"' index.html` 自检）：
- 每页必带 `light` / `dark` / `hero light` / `hero dark` 之一
- 禁止连续 3 页同主题；hero 页每 3-4 页一个；必须有 ≥1 个 hero light + ≥1 个 hero dark + 若干正文 dark 页
- 正文页布局轮换：数据大字报(grid-6 + stat-card)、pillar 三列、Before/After 对比(directional)、rowline 表格、pipeline 流程(data-animate="pipeline")、大引用(data-animate="quote")
- **金句直接用原文，出处标说话人**；数据必须来自文章，不编造
- chrome 左上是稳定栏目名、kicker 是本页钩子，两者不重复

## Step 5 · 逐页核对（必做）

加两个调试参数后用 headless Chrome 截图核对（这两个参数在 Step 3 就该加到 index.html 的导航脚本末尾）：

```js
/* 支持 #页码 直达 */
const __h=parseInt(location.hash.slice(1));
if(!isNaN(__h)&&__h>=1&&__h<=total)setTimeout(()=>go(__h-1),760);  // 必须 setTimeout，go(0) 有 760ms 翻页锁
/* ?static=1 静态模式核对版式 */
if(new URLSearchParams(location.search).has('static'))window.__setLowPowerMode(true,{persist:false});
```

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --screenshot=/tmp/ppt_p<N>.png --window-size=1920,1080 --virtual-time-budget=6000 \
  "file://<绝对路径>/index.html?static=1#<N>"
```

然后 Read 截图逐页看。**已知坑（本项目踩过）**：
- callout / 末尾内容块与底部 foot 重叠 → 收紧 `margin-top:5vh→3vh`、`padding:2vh 2.4vw`，逐页检查
- pipeline 页步骤默认 opacity:.15 等待手动推进，static 截图偏淡是**正常交互设计**，不是 bug
- 非 static 截图可能因动效时序显示空白，一律用 `?static=1` 核对
- 中文大标题 ≤ 8 字/行需 inline 降字号（如 6.6vw），过长标题拆两行
- 数据页 stat-nb 数字 2-3 字符为宜，单位用 `.stat-unit`

## Step 6 · 交付

`open index.html` 打开预览，报告里给出：文件路径、页面结构表、操作说明（← → 翻页 / ESC 索引 / B 静态 / #页码直达）。

## 项目文件约定

```
<项目名>/            # 用文章主题的短英文 kebab-case
└── ppt/
    ├── index.html   # 单文件 deck
    ├── assets/motion.min.js
    └── images/      # 若有配图，命名 {页号}-{语义}.{ext}
```
