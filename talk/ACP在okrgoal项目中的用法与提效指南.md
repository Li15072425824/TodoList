# ACP（Agent Client Protocol）：在 okrgoal 项目中的最终用法与提效指南

> 调研日期：2026-09-23 ｜ 基于 okrgoal 项目现状 + ACP 官方文档（agentclientprotocol.com）+ Zed 官方文档

---

## 一、ACP 是什么（一分钟版）

**Agent Client Protocol（ACP）** 是由 Zed 发起、正在快速成为行业标准的开放协议，用来**标准化「代码编辑器/IDE」与「coding agent（如 Claude Code、Codex、Gemini CLI）」之间的通信**。它的定位类似 LSP（Language Server Protocol）之于语言服务：

- **之前**：每个编辑器要为每个 agent 单独写集成（Claude Code 只有终端 TUI，接进 IDE 全靠各家的私有插件）；
- **之后**：agent 只要实现 ACP，就能接入所有支持 ACP 的编辑器；编辑器只要支持 ACP，就能用上整个 agent 生态。

**技术形态**：
- 本地 agent：编辑器按需把 agent 作为**子进程**拉起，走 **JSON-RPC over stdio**；
- 远程 agent：走 HTTP/WebSocket（v2 正在完善中）；
- 尽量复用 MCP 的 JSON 类型，但补充了 agent 场景专属的 UX 元素：**diff 展示、工具调用权限审批、执行计划（Plan）展示、slash commands、多 session 管理**。

一句话理解：**MCP 解决"agent 接工具"的问题，ACP 解决"agent 接界面"的问题。**

---

## 二、你现在的状态：离 ACP 只差"最后一公里"

看 okrgoal 项目的配置，你已经把 agent 基础设施搭得很完整了：

| 已有设施 | 说明 |
|---|---|
| `CLAUDE.md` | 项目级约束（对话追踪、CONV 门槛、计划文件规范） |
| `mcp/conversation-tracker` | 自建 MCP：对话记录追踪 |
| `mcp/lint-runner` | 自建 MCP：lint 执行 |
| `.claude/skills/frontend-design` | 自建 skill |
| `.claude/hooks` | Claude Code hooks |
| `openspec/` | spec 驱动开发流程 |
| husky `prepush`（lint + test:enforce） | 提交前质量门禁 |
| `scripts/deploy.mjs`、`run_eval.js`、`src/cli/api-agent-cli.ts` | 自建部署/评估/agent CLI |

**关键认知**：ACP 不取代以上任何东西。你的 CLAUDE.md、MCP servers、skills、hooks 全部原样生效——因为跑在 ACP 后面的就是同一个 Claude Code 进程。ACP 改变的只是**你在哪里、以什么界面和它交互**。

---

## 三、最终你可以怎么用 ACP（按投入产出排序）

### 场景 1：在 IDE 里原生使用 Claude Code（核心收益，第一步就做）

你目前用 Claude Code 大概率是终端 TUI。接入 ACP 后，在 **Zed / JetBrains AI Assistant / VS Code（ACP Pro、Multicoder 等扩展）** 里，Claude Code 变成编辑器面板里的一个"外部 agent"：

- 在编辑器内直接看 agent 改动的 **diff 并逐块批准/拒绝**，不用切窗口；
- 工具调用（跑 `npm run lint`、`vitest`、`deploy.mjs`）的**权限审批内联在编辑器里**；
- agent 的执行计划（对应你 openspec 的 spec 思路）以结构化 Plan 卡片展示、可实时更新；
- **auth 完全复用 Claude Code 自己的**（`/login` 走 API key 或 Claude Code 账号），Zed 不另收费；CLAUDE.md、MCP 配置照样被读取。

**落地（Zed 为例，5 分钟）**：
1. 命令面板执行 `zed: acp registry`（或 Agent Settings → External Agents → Add Agent）；
2. 从 Registry 安装 **Claude Agent**（底层即 `@zed-industries/claude-agent-acp` 适配器）；
3. 在 Agent Panel 新建 Claude Agent thread，`/login` 完成认证；
4. 打开 okrgoal 项目即可使用——你现有的 `mcp/lint-runner`、skills 全部生效。

**对 okrgoal 的直接提效**：antd 页面样式迭代、ECharts 图表调整这类高频"改→看→再改"循环，diff 内联审批省掉终端/编辑器/浏览器三头切换；配合你 CLAUDE.md 里的 "S 档豁免"规则，小改动可以更快闭环。

### 场景 2：多 agent 并行——一个编辑器里同时用 Claude Code + Codex + Gemini + Qwen

这是 ACP 相比"裸用 Claude Code"**最大的增量**。因为协议统一了：

- 同一个编辑器面板里并行开多个 agent session，各跑各的 train of thought；
- 典型分工：**Claude Code 写实现，另一个 agent 写测试/review**（正好补 okrgoal 的 `test:enforce` 门禁）；或同一任务让两个 agent 各做一版再对比（你的 `run_eval.js` 思路延伸到代码任务）；
- 配合 git worktree 隔离并行的 session（如 VS Code 的 Exo 扩展就专做这件事：并行 session + worktree 隔离 + 原生 diff 审批）；
- agent 之间可以互为 reviewer：Claude Code 产出 → Codex 审查 → 你只看汇总。

### 场景 3：把 agent 接进 Obsidian——打通你的知识库工作流

你的全局工作流强依赖 Obsidian vault（对话归档到 `07_work/`）。ACP 生态里 Obsidian 已有多个成熟插件：

- **Agent Client**、**Agent Console**（多 session 标签页工作区）、**Copilot for Obsidian**（跑 OpenCode/Codex，带 vault 上下文）、**Obsidian Harness**（每个 agent session 是一个 `.session` vault 文件）；
- 实际用法：在 Obsidian 里直接让 ACP agent **读写你的对话归档、整理 OKR 笔记、汇总 okrgoal 的 CONV 索引**；
- 这甚至可能取代你 `mcp/conversation-tracker` 的一部分手动流程——session 本身成为 vault 里的一等文件，可搜索、可恢复。

### 场景 4：团队与自动化（远期）

- **AgentConnect** 等平台把 ACP agent 接入 Slack / 飞书 / GitHub：code review 请求自动到群里；
- **CompozyOS** 等 "agent OS" 让 ACP agent 跑定时任务/循环任务：例如每天自动跑一遍 `npm run lint && npm run test:enforce`、巡检 Sentry 报错并提修复 PR；
- okrgoal 的 `devops/`、`nginx/`、部署脚本都可以交给 ACP agent 做成半自动巡检流程。

### 场景 5：把 agent 能力嵌进你自己的产品（如果 okrgoal 要做 AI 功能）

ACP 生态有官方 SDK（TypeScript/Rust，`@zed-industries/agent-client-sdk`）。你的 `src/cli/api-agent-cli.ts` 说明项目已有 agent CLI 雏形——如果想给 OKR 后台加"AI 助手"（比如：分析 OKR 完成率、自动写周报），ACP 提供了一条标准路：

- 把 Claude（或任意 ACP agent）作为后端子进程/远程 agent 接入；
- 前端直接复用协议内置的 diff、权限、Plan 等 UX 元素，不用自研对话 UI 的审批体系。

---

## 四、提效收益总结

| 环节 | 现状 | 接入 ACP 后 |
|---|---|---|
| 代码修改审批 | 终端里看文字 diff | 编辑器内联 diff + 逐块批准 |
| lint/test 门禁 | prepush 时才发现问题 | agent 调用 lint-runner MCP 的结果实时内联展示，改完即验证 |
| 单 agent 排队干活 | 一个终端一个 session | 多 session 并行 + worktree 隔离 |
| 工具选型 | 锁定单一 agent | Claude/Codex/Gemini/Qwen 随时切换、互为备份（不被单一厂商锁定） |
| 知识库（Obsidian） | AI 归档靠 hooks 兜底 | agent 原生住进 vault，归档/整理自动化 |
| 界面投入 | 零（用 TUI） | 5 分钟装 adapter，配置零迁移 |

**量级估计**：场景 1 是纯增益（约 5 分钟接入成本），主要省在"上下文切换 + diff 审批"上，日常开发预计省 10–20% 操作时间；场景 2 的多 agent 并行在并行任务多的时候收益更大（等一个 agent 跑测试的同时让另一个改另一个模块）。

---

## 五、建议的落地路径

```
第 1 步（今天，5 分钟）
  Zed / JetBrains / VS Code 任选一个你常用的 IDE，
  从 ACP Registry 安装 Claude Agent → /login → 在 okrgoal 项目里跑通第一个任务
  （验证：CLAUDE.md 约束生效、mcp/lint-runner 可用、diff 内联审批可用）

第 2 步（本周）
  加装第二个 agent（Codex 或 Gemini CLI），试"一个写、一个审"的分工，
  并在两个并行 session 里各跑一个 okrgoal 模块改动（worktree 隔离）

第 3 步（本月，可选）
  Obsidian 装 ACP 插件，把对话归档/笔记整理交给 agent；
  评估把 ACP agent 接入飞书/Slack 做团队协作；
  若 okrgoal 有 AI 功能规划，用 @zed-industries/agent-client-sdk 做技术预研
```

---

## 六、注意事项

1. **ACP 是协议，不是新工具**：你不需要改任何现有配置；adapter 只是给 Claude Code 套了一层标准接口。
2. **v1/v2 并存**：v2（远程 agent 支持增强）已发布且有迁移指南，本地 stdio 场景 v1/v2 体验一致，现阶段无需关心版本。
3. **计费与数据**：External Agent 模式下，auth/计费/数据归属完全在 agent 侧（Anthropic），编辑器不收费、不碰你的对话数据。
4. **remote agent 仍在完善**：云端托管 agent 的 ACP 支持是进行中状态，本地使用已完全成熟。
5. **生态注意甄别**：Clients/Agents 列表里大量是社区项目，生产使用优先选官方支持度高的：Zed、JetBrains AI Assistant、Claude（claude-agent-acp）、Codex（codex-acp）、Gemini CLI。

---

## 参考来源

- ACP 官方文档：https://agentclientprotocol.com （Introduction / Architecture / Clients / Agents / llms.txt）
- Zed External Agents 文档：https://zed.dev/docs/ai/external-agents
- Claude 的 ACP 适配器：https://github.com/zed-industries/claude-agent-acp
- Codex 的 ACP 适配器：https://github.com/agentclientprotocol/codex-acp
