---
name: research-report
description: 深度调研一个话题并把所有产出归档到 PPT 目录的标准工作流。当用户要求"调研 / 深度研究 / 分析成本收益 / 核实说法"并沉淀为报告时使用。明确产出每个文件存放的路径，全流程步骤均在此可见。
---

# 深度调研 → 报告归档（PPT 目录标准工作流）

对任意话题做深度调研（多信源搜索 + 对抗验证），并把**所有产出归档到 `/Users/lixing/WorkRep/TodoList/PPT/` 下该主题的同一个文件夹内**。本 skill 是经实战验证（2026-09-23 黄陂徒步团成本收益调研）的标准流程，按步骤执行，不要跳步。

## 文件存放约定（先记住，最后要核对）

```
PPT/<topic-slug>/                 ← 每个调研主题一个文件夹，英文 kebab-case 命名
├── 调研报告.md                    ← 最终汇总报告（必产出）
├── notes/                        ← 逐条 claim 核验记录（本次调研过程产物）
│   └── HHMM-核验<标题>.md
└── ppt/index.html                ← 可选：网页翻页 PPT（用户要求才生成，走 article-to-ppt）
```

参考已有案例：`PPT/huangpi-tuduituan/`（调研报告 + notes/）、`PPT/deepseek-harness/`、`PPT/luck-ai-native-org/`（这两个含 ppt/index.html）。

## Step 1 · 明确调研问题

- 用户问题不够具体（缺地域、缺规模、缺约束）时，先 AskUserQuestion 问 2–3 个问题收敛范围，不要直接开跑。
- 把收敛后的问题整理成一段完整的 args：背景 + 需要查证的关键数据点（编号列出）+ 最终要推算/回答什么。

## Step 2 · 创建主题文件夹

```bash
mkdir -p /Users/lixing/WorkRep/TodoList/PPT/<topic-slug>/notes
```

topic-slug 用主题的英文短名（如 `huangpi-tuduituan`、`deepseek-harness`）。

## Step 3 · 搜索工具：优先用本地 websearch.py

**内置 WebSearch/WebFetch 在本环境不可用**（方舟网关 403：未开通联网搜索；WebFetch 还需访问 claude.ai 做域名校验，本地网络不通）。所有联网搜索/抓取一律用本地工具 `/Users/lixing/WorkRep/TodoList/websearch.py`（零依赖，纯标准库）：

```bash
# 全网搜索（cn.bing.com，返回标题/链接/摘要；--json 供程序解析）
python3 /Users/lixing/WorkRep/TodoList/websearch.py search "查询词" -n 10 --json

# 抓取任意网页正文（自动剥离 script/style/导航，--max-chars 控制长度）
python3 /Users/lixing/WorkRep/TodoList/websearch.py fetch "https://..." --max-chars 8000
```

- deep-research 工作流的子代理搜索/抓取也走这个命令（在子代理 prompt 里给出上述命令），不要让子代理用 WebSearch。
- 命中 Bing 风控（脚本会报"触发风控页"）时：稍等重试或换查询词；频繁触发则给脚本加 Baidu/Sogou 备用源。
- 子代理产生的临时文件一律写 `/tmp/`（见 Step 4 末尾的教训）。

## Step 4 · 跑 deep-research 工作流

用 Workflow 工具调用内置 `deep-research` 工作流（后台运行，完成会收到通知）：

```
Workflow({ name: "deep-research", args: "<Step 1 整理好的调研问题>" })
```

- 工作流自动完成：分角度并行搜索 → 抓取信源 → 提取 claim → 3 票对抗验证 → 汇总带引用的结果。
- 若会话中断，用返回的 `scriptPath` + `resumeFromRunId` 恢复，已完成的 agent 走缓存。
- 结果为空/异常时，先读 journal.jsonl（transcript dir 下）再诊断，不要假设 agent 返回了内容。
- **子代理 curl 抓取的缓存一律写 `/tmp/`，严禁写到工作目录根**——否则会在仓库根留下一堆搜索页快照垃圾（2026-09-23 实战教训，一次调研留了 27 个 html）。

## Step 5 · 逐条核验记录落盘到 notes/

对工作流结果里的关键 claim（尤其是要进报告推算的数字），逐条写核验记录：

- **路径**：`PPT/<topic-slug>/notes/HHMM-核验<主题>.md`（HHMM = 当前本地时间，`date +%H%M`；重名加 `-2` 后缀）
- **frontmatter**（沿用 Obsidian 归档约定）：

```markdown
---
created: YYYY-MM-DD HH:mm
project: TodoList
type: dialogue
tags: [2-3 个关键词]
session_id: unknown
saved_by: ai
---
```

- **正文**：用户提问/被核验主张原文 + 核验过程与结论（成立 / refuted / 置信度、来源链接）。
- 若中途做了相关 Obsidian 归档（`07_work/<项目>/MMDD/`），把属于本主题的一并**移动**进 notes/ 汇总；不属于本主题的（检查内容确认）留在原地并告知用户。

## Step 6 · 写汇总报告 调研报告.md

路径：`PPT/<topic-slug>/调研报告.md`。固定章节结构：

```markdown
# <主题>深度调研报告
> 调研日期 ｜ 方法（deep-research：N 个子代理并行搜索 → 抓取 → 对抗验证 → 汇总）｜ 指向 notes/

## 一、调研对象        ← 是什么、关键参数
## 二、核心发现        ← 分项数据表（单价/合计/置信度），逐项给验证置信度
## 三、推算/结论       ← 基于发现做的推算表（不同情形对比）
## 四、已否决的说法    ← 对抗验证未通过的 claim 及票数
## 五、主要不确定性    ← 影响结论可信度的 caveats
## 六、待解问题        ← open questions
## 七、主要信源        ← 信源表（URL/类型/用途）
## 八、总结            ← 一段话可执行结论
```

要求：数字一律带区间和置信度；被否决的说法必须列出，防止后续误引。

## Step 7 · 收尾核对

- [ ] 所有文件都在 `PPT/<topic-slug>/` 同一个文件夹内（报告 + notes/ + 可选 ppt/）
- [ ] 调研报告.md 的章节齐全、信源链接可用
- [ ] 向用户汇报最终目录树
- [ ] 按全局约定把本轮对话归档到 Obsidian（07_work/<项目>/MMDD/）

## Step 8 · 可选：生成网页 PPT

仅当用户要求时执行：用 `article-to-ppt` skill 把 调研报告.md 转成 `PPT/<topic-slug>/ppt/index.html`（电子杂志风 HTML 翻页 PPT）。生成前问清风格/页数/用途。
