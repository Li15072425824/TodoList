# 在 TodoList 项目中直接引入 ACP：可行性分析与助力报告

> 调研日期：2026-09-23 ｜ 基于 TodoList 仓库现状 + ACP 官方文档（agentclientprotocol.com）+ Zed 官方文档
> 前置阅读：`talk/ACP在okrgoal项目中的用法与提效指南.md`（ACP 协议基础不再重复）

---

## 一、先看清 TodoList 的项目性质（这决定了引入方式）

TodoList 不是一个典型的"业务代码仓库"，而是一个**个人工作台 + 多个子项目 + 自动化流水线**的混合体：

| 组成 | 性质 | 与 agent 的关系 |
|---|---|---|
| `vue3-todolist/` | Vue3 + Vite + Jest + alova + Upstash Redis 的真实应用，带 openspec、husky | **代码开发**（和 okrgoal 同类） |
| `zsxq/` | 知识星球 → 公众号草稿箱的全自动内容流水线（fetch → 提炼 → 配图 → md2html → publish_draft.py） | **日常运行的自动化管道** |
| `money/` | 微信/支付宝账单分析报告 | **定期分析产出** |
| `PPT/`、`talk/` | 调研报告归档 | **研究产出** |
| `.claude/workflows/deep-research.js` | 多 agent 并行深研 workflow（Scope→Search→Fetch→Verify→Synthesize） | **已有的 agent 编排资产** |
| `websearch.py` | 本地搜索/抓取工具（WebSearch 的替代品） | agent 的基础设施 |
| `magicBox/`、`three/`、`tool/` | 单文件 HTML 实验 | 轻量代码 |

**关键判断**：TodoList 里"代码开发"只占一小部分，更大的价值在**自动化管道的驱动、研究任务的编排、多项目并行的管理**。所以引入 ACP 的方式应该和 okrgoal（IDE 内写业务代码为主）明显不同——**ACP 在这里的最大价值不是"diff 审批"，而是把散落的工作流收进一个统一的 agent 驾驶舱**。

---

## 二、结论先行：值得引入，但分三档

| 档位 | 判断 | 内容 |
|---|---|---|
| ✅ **高价值，建议引入** | Obsidian 驾驶舱 + 多项目并行 session | TodoList 的"工作台"属性和 Obsidian ACP 插件天然匹配 |
| ⚠️ **有价值，按需引入** | vue3-todolist 的 IDE 内开发、zsxq 流水线的 agent 化巡检 | 复用 okrgoal 报告里的场景 1/4，收益中等 |
| ❌ **不建议强行引入** | 把 websearch.py / deep-research workflow 改造成 ACP 协议实现 | 它们已经是好用的内部资产，套协议只有成本没有增量 |

---

## 三、具体可以怎么用（按你的实际工作流映射）

### 3.1 Obsidian ACP 驾驶舱——最贴合 TodoList 定位的用法 ⭐

你已经有 `07_work/{项目}/{MMDD}/{HHMM}-{标题}.md` 的对话归档体系，且本仓库的报告都要归档。ACP 生态里 Obsidian 已有多个插件可直接用：

- **Agent Client** / **Agent Console**（多 session 标签页、可恢复可搜索的会话）
- **Obsidian Harness**：把 Obsidian 变成 ACP agent 的驾驶舱（Claude Code / Codex / Gemini CLI / Pi），**每个 agent session 是一个 `.session` vault 文件**

引入后的实际形态：

```
Obsidian（你的知识库 = 你已经每天打开的软件）
   └── ACP 插件
        ├── session 1：Claude Code @ TodoList —— 写调研报告（本仓库 CLAUDE.md 约束照常生效）
        ├── session 2：Claude Code @ vue3-todolist —— 迭代功能
        └── session 3：Claude Code @ okrgoal —— 业务开发
   所有 session 自动落在 vault 里，可搜索、可续接、天然完成你的归档需求
```

**助力点**：
- 你的"每轮对话归档到 Obsidian"约定从"靠 AI 自觉 + Stop hook 兜底"升级为**协议层原生能力**（session 文件本身就是 vault 文件）；
- `07_work/` 的目录约定可以用 Obsidian 插件的模板/quick prompt 固化，不再依赖每轮手动 Write；
- 多项目并行时不再开 3 个终端窗口。

### 3.2 zsxq 内容流水线：从"纯脚本定时跑"升级为"agent 巡检 + 异常接管"

现状：`fetch_digests.sh → pipeline.sh（豆包提炼标题→Pexels 配图）→ md2html.py → publish_draft.py`，一条命令/定时跑。

引入 ACP 后的增量（用 CompozyOS、openclaw 这类支持定时/循环任务的 ACP agent OS）：

- **每日跑完后 agent 自动质检**：检查封面图是否降级到占位图、草稿是否成功入箱、正文排版有没有 markdown 残留，异常时在 Obsidian/飞书里给你一条带原因的报告；
- **内容把关前置**：agent 在推草稿前先读一遍当期精选，标记"这条质量不高/和上期重复"，你只审被标记的；
- **豆包环节可替换**：标题→英文关键词这一步本来就是在调一个模型，换成你已有订阅的 agent（Claude/Gemini）少一处外部依赖；
- **诚实评估**：如果流水线近期没出过错，这项的紧急度低——它是"锦上添花"，优先级排在 3.1 之后。

### 3.3 vue3-todolist 开发：直接复用 okrgoal 方案

`vue3-todolist` 是标准的 Vue3 + Jest 工程，okrgoal 报告里的**场景 1（IDE 内联 diff + 权限审批）**原样适用：Zed/JetBrains/VS Code 装 Claude Agent → 打开 `TodoList/vue3-todolist` → 日常迭代。它还有 `openspec/`，agent 的 Plan 卡片展示和你的 spec 流程是对应的。投入 5 分钟，无额外学习成本。

### 3.4 调研/报告类工作：多 agent 并行是真正的加速器

本仓库的日常就是产出调研报告（`PPT/`、`talk/` 已有 5 份）：

- **并行分工**：deep-research workflow（你已有的编排资产）负责搜集+验证 → 一个 agent 起草报告 → 另一个 agent 做"完整性批评者"（检查来源覆盖、结论是否被证据支撑）→ 你只做终审；
- **模型混搭**：搜索/抽取类粗活交给便宜 agent（Gemini/Qwen），综合写作留给 Claude——ACP 让这种混搭不用换工具；
- `websearch.py` 作为 MCP server 注册（`claude mcp add`，stdio 一行配置）即可让所有 ACP agent 共享你的本地搜索通道，**这是 TodoList 里性价比最高的一处配置**。

### 3.5 不建议做的事（明确划界）

- **不要**把 `websearch.py`、`deep-research.js` 重写成 ACP agent 来"支持协议"——ACP 是给"编辑器↔agent"用的，你的工具是给 agent 用的，层级不同，保持 MCP/CLI 形态最合理；
- **不要**为了 ACP 重构 zsxq 的 shell 管道——脚本已经是稳定资产，agent 做巡检和接管即可（3.2），替代是本末倒置；
- **不要**现在就碰 ACP remote agent（v2 的云端托管部分还在完善），你全是本地场景，用不上。

---

## 四、提效收益量化（对照现状）

| 工作流 | 现状 | 引入 ACP 后 | 预估收益 |
|---|---|---|---|
| 对话归档（07_work/） | 每轮 AI 手动 Write + hook 兜底，依赖自觉 | Obsidian Harness：session 即 vault 文件 | 归档可靠性 ↑，零手动 |
| 多项目并行 | 多终端窗口，上下文互不可见 | 多 session 并列 + 可恢复可搜索 | 切换成本 ↓，漏接的活 ↓ |
| zsxq 流水线 | 纯脚本，出错靠发现 | agent 每日质检 + 异常接管 | 异常发现时间从"天"级到"分钟"级 |
| 调研报告 | 单 agent 串行 | 搜集/起草/审校三角色并行 | 单篇报告墙钟时间约 ↓40–50% |
| vue3-todolist 开发 | 终端 Claude Code | IDE 内联 diff | 同 okrgoal 结论：10–20% 操作时间 |

**总投入**：Obsidian 插件安装 + websearch.py 注册 MCP + （可选）vue3-todolist 的 Zed adapter，合计 **1 小时以内**；不改动任何现有代码。

---

## 五、落地路径（建议顺序）

```
第 1 步（30 分钟，收益最大）
  Obsidian 安装 Agent Client 或 Obsidian Harness 插件
  → 配置 Claude Code 作为 ACP agent，工作目录指向 /Users/lixing/WorkRep/TodoList
  → 验证：新 session 能读到本仓库 CLAUDE.md 约束，session 文件落在 vault

第 2 步（10 分钟）
  websearch.py 注册为 MCP server（claude mcp add websearch -- python3 /Users/lixing/WorkRep/TodoList/websearch.py）
  → 所有 ACP agent 共享本地搜索能力

第 3 步（按需）
  a. vue3-todolist：Zed ACP Registry 装 Claude Agent（同 okrgoal）
  b. zsxq 流水线：加一层 agent 每日质检（CompozyOS/定时 cron 触发 ACP agent），
     先跑两周人工对比质检报告质量，再决定是否自动化异常接管

第 4 步（远期，可选）
  调研工作流固化：deep-research workflow + 起草 agent + 审校 agent 的三段式
  做成 Obsidian 里的 quick prompt，一键触发
```

---

## 六、与 okrgoal 报告的关系（一页对比）

| 维度 | okrgoal | TodoList（本报告） |
|---|---|---|
| 项目性质 | 单一 Next.js 业务应用 | 工作台 + 多子项目 + 自动化管道 |
| ACP 主要角色 | IDE 里的编码 agent | **知识库驾驶舱 + 自动化巡检 + 研究编排** |
| 首选客户端 | Zed / JetBrains / VS Code | **Obsidian**（插件生态） |
| 首要收益 | diff 内联审批、提效 10–20% | 归档自动化、多 session 并行、报告提速约一半 |
| 接入成本 | 5 分钟 | ≤1 小时（含 MCP 注册） |
| 风险 | 无配置迁移 | 同左；流水线部分只做增量不重构 |

两个项目可以共用同一套 ACP agent 配置（同一个 Claude Code 登录态、同一个 websearch MCP），一次接入两处受益。

---

## 参考来源

- ACP 官方文档：https://agentclientprotocol.com （Clients / Agents / Architecture / llms.txt）
- Zed External Agents：https://zed.dev/docs/ai/external-agents
- Obsidian ACP 插件：Agent Client（RAIT-09）、Agent Console、Copilot for Obsidian、Obsidian Harness（vlln）
- 定时/循环 agent OS：CompozyOS（compozy/compozy）、AgentConnect（Slack/飞书/GitHub 集成）
- 本仓库现状：`zsxq/README.md`、`.claude/workflows/deep-research.js`、`vue3-todolist/package.json`
