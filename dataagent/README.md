# DataAgent 项目文档

本目录用于跟踪 DataAgent 产品（指标本体驱动的数据分析智能体）的理解、调研与讨论。

> DataAgent 是产品侧给到的可参考原型，核心主张：以**指标本体（Metric Ontology）作为唯一权威语义层**，让 Agent 问数、归因、看板、对外 API/MCP 共用同一套指标口径。

## 目录结构

```
dataagent/
├── README.md            # 本文件：项目说明 + 目录约定
├── materials/           # 入库材料（原型、文档等原始文件副本）
│   └── 入库记录.md       # 每份材料的入库时间、来源、用途
└── discussions/         # 每次与 AI 讨论 DataAgent 的记录
    └── 2026-11-05-原型核心讲解.md
```

## 约定

- 每次讨论 DataAgent 相关内容，都在 `discussions/` 下新增一份记录（`YYYY-MM-DD-主题.md`），总结本轮讨论结论。
- 产品/外部给到的每一份参考文件，拷贝到 `materials/`，并在 `入库记录.md` 登记来源与入库时间。
- Obsidian 归档照常进行，但那只是额外副本；本目录是 DataAgent 项目的正式知识库。
