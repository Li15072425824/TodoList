# 星球精选 → 微信公众号 · 自动化内容流水线

## 项目在做什么

把知识星球「白诗诗的成长社群」的精选内容，自动加工成一篇排版好的微信公众号文章，每天一条命令（或定时）直接送进公众号**草稿箱**，人工只做最后一道审核。

```
知识星球 digests 接口
        │
        ▼
┌─────────────────┐   ① 拉取最新 20 条精选（talk 帖子 / q&a 问答）
│ fetch_digests.sh │      转存为 Markdown 归档
└─────────────────┘
        │  白诗诗成长社群-精选.md
        ▼
┌─────────────────┐   ② 截取最新 TOPIC_COUNT 条作为本期文章
│   pipeline.sh    │   ③ 豆包把标题提炼成英文关键词
│    （编排）      │      → Pexels 按关键词搜无版权配图
└─────────────────┘      （降级链：Pexels→picsum→渐变占位图）
        │  daily/日期/{article.md, cover.jpg}
        ▼
┌─────────────────┐   ④ Markdown → 公众号内联样式 HTML
│publish_draft.py │      封面上传永久素材 → 调草稿箱 API
└─────────────────┘
        │
        ▼
   微信公众号「草稿箱」 ← 人工审核后手动发布
```

## 最终产出

**每天运行一次，得到两样东西：**

1. **公众号草稿箱里的一篇成品文章**
   - 标题：当日最新一条精选的标题
   - 内容：内联样式排版好的 HTML（标题/引用/正文/分隔线，适配手机阅读）
   - 封面：与文章主题匹配的无版权图片（Pexels，1200×627）
   - 打开公众号后台「草稿箱」即可预览、修改、发布

2. **本地留档 `daily/日期/` 目录**
   - `article.md` —— 本期文章的 Markdown 原稿
   - `article.html` —— 转换后的公众号排版 HTML
   - `cover.jpg` —— 当日封面图
   - 累积下来就是一份按日期归档的星球精选内容库

另有常驻归档文件 `白诗诗成长社群-精选.md`：每次执行都重新拉取，永远保持最新 20 条精选。

**去重机制**：`published_ids.txt` 记录所有已成功推送的 `topic_id`。每次运行只从最新精选中挑「未推送过」的条目，已推送的永不重复生成；推送失败不记账，下次自动重试；没有新内容时优雅退出（适合挂 cron）。

## 文件结构

```
zsxq/
├── README.md                  ← 本文件
├── fetch_digests.sh           拉取星球精选 → Markdown
├── 白诗诗成长社群-精选.md      最新 20 条精选（每次覆盖更新）
├── published_ids.txt          已推送的 topic_id 清单（去重用，勿删）
├── daily/                     每日产物归档
│   └── 2026-09-22/
│       ├── article.md / article.html / cover.jpg
└── wechat/
    ├── README.md              微信配置详细说明 + 报错对照表
    ├── pipeline.sh            ★ 每日入口：一条命令跑完全流程
    ├── config.env             ★ 凭证与配置（APP_ID/SECRET、Pexels Key 等）
    ├── gen_cover.sh           封面生成：豆包关键词 → Pexels 搜图
    ├── placeholder_cover.py   零依赖渐变占位图（兜底）
    ├── md2html.py             Markdown → 公众号内联样式 HTML
    └── publish_draft.py       上传封面素材 + 创建草稿
```

## 使用方式

```bash
# 每天执行（首次需按 wechat/README.md 完成配置）
/Users/lixing/WorkRep/TodoList/zsxq/wechat/pipeline.sh
```

稳定后可挂 crontab 定时（示例：每天 8:30）：

```
30 8 * * * /Users/lixing/WorkRep/TodoList/zsxq/wechat/pipeline.sh >> /tmp/zsxq_pipeline.log 2>&1
```

## 关键配置（wechat/config.env）

| 配置 | 说明 |
|---|---|
| `APP_ID` / `APP_SECRET` | 公众号 API 凭证，且本机 IP 须在公众号后台白名单 |
| `AUTHOR` | 文章作者名 |
| `TOPIC_COUNT` | 每期收录的精选条数（1 = 单篇主题文章） |
| `IMAGE_API_KEY` | Pexels Key，有则按关键词搜图，无则随机图 |
| `IMAGE_MODE` | `auto`(默认) / `ai` / `placeholder` |

## 已知局限

- **动态 IP**：家庭宽带公网 IP 会漂移，IP 变化后需更新公众号白名单（长期方案：固定 IP 云服务中转推送）
- **配图匹配度**：关键词搜索命中主题，但图片调性依赖 Pexels 图库，偶尔不如 AI 生成精准（`IMAGE_MODE=ai` + 方舟 API Key 可切换）
- **星球凭证**：`fetch_digests.sh` 里的 cookie/签名取自浏览器，过期需重新复制
- **未认证订阅号**没有草稿箱 API 权限（当前账号已验证可用）
