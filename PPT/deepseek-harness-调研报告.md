# DeepSeek Harness（dsh）使用与方案调研报告

> 调研方式：深度研究工作流（100 个子代理：分角度检索 → 15 个一手来源抓取 → 声明提取 → 每条声明 3 票对抗验证 → 综合）
> 调研时间：2026-09-22 · 所有结论均经 3-0 一致票验证通过，来源以官方一手资料为主

## 一、DeepSeek Harness 是什么

**DeepSeek Harness（CLI 命令名 `dsh`）是 DeepSeek 官方开源的智能体运行框架**，GitHub 仓库为 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)：

- **官方归属**：位于 deepseek-ai 官方组织下（与 DeepSeek-V3/R1 同一 org），MIT 许可证（Copyright (c) 2026 DeepSeek），npm 包 `@deepseek-ai/dsh` 由 DeepSeek 维护者发布
- **基本盘**：主语言 TypeScript，口号 **"Everything is a Plugin"**，构建在 [Cordis](https://github.com/cordiverse/cordis) 插件框架之上
- **热度与阶段**：约 23.2 万 stars，2026-08-13 创建，README 标注 **developer preview**（官方明确警告会有 breaking changes），文档站为 [deepseek-harness.github.io](https://deepseek-harness.github.io/deepseek-harness/en/)（Guide / SDK / Automation / Integrations / Reference 板块）
- ⚠️ 注意：对创建仅 5 周的仓库而言 stars 数字异常高，且验证时 WebSearch 受限（403），未能独立交叉核对

## 二、安装、配置与使用

两条安装使用路径：

### 1. Node / npm（Web UI 入口）

```bash
# 装好 Node.js 后
npx @deepseek-ai/dsh web
```

- 启动 Web UI，默认监听 `http://127.0.0.1:3080` 并自动打开浏览器
- 也可 clone 仓库后 `pnpm install` / `build` / `dsh web` 从源码运行
- Web UI 中 **Settings → Models** 填入 DeepSeek API key，保存后立即生效、无需重启
- dsh 以启动目录为默认文件系统位置；新建会话在手动添加工作区前输入框不可用
- Agent 能力：读取/编辑工作区文件、执行命令、委派子任务、维护计划；**权限策略要求批准的操作会先征求用户确认**

### 2. Python SDK

```bash
pip install deepseek-harness-sdk   # 需要 Python 3.10+
```

- 支持 Linux x64/arm64、macOS arm64、Windows x64，自带平台原生运行时 wheel 和 `dsh` 命令，**无需系统 Node.js**
- 配置通过 `DEEPSEEK_API_KEY` / 可选 `DEEPSEEK_BASE_URL` 环境变量传入
- 示例：

```python
DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    max_tokens=49_152,
    ...
)
```

## 三、架构设计与核心方案

### 1. 一切皆插件（Everything is a Plugin）

- **dsh 没有任何特权核心**：运行时是启动时按有序层组合出的 Cordis 插件树——模型适配器、工具注册表、会话日志乃至 agent loop 本身，都是可从配置替换的插件
- 扩展方式是在插件树旁挂载新插件；注册项是插件卸载时自动回卷（unwind）的 effect
- 官方原文：*"There is no privileged core to patch: you extend dsh by mounting a plugin beside the others, and registrations are effects that unwind when their plugin unloads"*

### 2. Profile + Bundle 分层组合

- 内置五种 profile：**web、headless、sdk、sdk-minimal、acp**，用 `dsh --profile <name>` 选择
- 按序叠加 bundle 与补丁文件构成插件树：profile 的 `cordis.patch.yml` → home 级 patch → `--patch` 覆盖
- **dsh-base** 是共享首层（模型适配器、工具、持久化、sandbox 与审批策略、设置、凭证、遥测）
- 可用 `dsh --profile web --dump-config` 查看实际启动树；**dsh-sdk-minimal 是刻意例外**，不应用 dsh-base

### 3. Agentic Loop：turn / step 两层抽象

- **step** = 一次模型请求 + 它调用的工具
- **turn** = 零个或多个 step（在首个输入被认领前开启、无欠账时关闭）
- turn/start → turn/end 的流程：prompt 段与工具 schema 组装 → agent/request 准备调用 → llm/stream 流式输出 → tool/call 执行与 tool/result 返回

### 4. 会话与上下文管理

- **可持久化的 session 事件**：`turn/*`、`step/*`、`system/message`、`user/message`、`assistant/message`、`tool/*`
- 会话以**未压缩 JSONL** 存于 `<dsh_home>/sessions`
- **sdk-minimal profile 默认配置**：系统提示词回退为 "You are a helpful software engineer assistant."；模型面向工具为持久 bash（Windows 为 pwsh）；shell 超时 300 秒；默认不启用运行时上下文压缩
- ⚠️ 缺口：除 sdk-minimal 外，web/headless/sdk profile 的上下文压缩（compaction）与 Memory MCP 记忆集成机制在官方文档中未被本次验证覆盖

## 四、与其他 harness 的关系：主要是"模型后端"

DeepSeek API 同时兼容 **OpenAI 与 Anthropic 两种 API 格式**，这是它与 Claude Code、Copilot 等生态对接的核心手段：

| 接入方式 | 配置 |
|---|---|
| OpenAI 格式 | `base_url = https://api.deepseek.com` |
| Anthropic 格式 | `base_url = https://api.deepseek.com/anthropic` |

- **Claude Code 接入**：只需配置 `ANTHROPIC_BASE_URL` 与 `ANTHROPIC_AUTH_TOKEN` 等环境变量，无需写代码
- **模型名自动映射**（服务端按前缀完成）：`claude-opus*` → deepseek-v4-pro（按 V4 Pro 价格计费）；`claude-haiku*` / `claude-sonnet*` → deepseek-flash
- 官方推荐：主模型 `deepseek-flash[1m]`（长上下文），子代理模型 `deepseek-flash`（`CLAUDE_CODE_SUBAGENT_MODEL`）
- 集成清单还覆盖：Codex、GitHub Copilot、OpenCode、OpenClaw、Hermes、Reasonix、WorkBuddy/CodeBuddy、Qoder（部分可能来自社区贡献流程，官方支持程度不一；Copilot 经 VS Code 扩展中转而非原生）
- 验证者曾以无效 key 实际探测两个端点，均返回 DeepSeek 鉴权错误 JSON，证明端点真实

> ⚠️ **重要缺口**：本次调研未找到 dsh 与 Claude Code、OpenHands、SWE-agent 在 SWE-bench 或真实任务上的任何定量正面对比（无论官方还是第三方）。二者的关系目前只覆盖"互操作/接入"维度。

## 五、实际应用案例

**DeepSeek Harness minimal mode 已被官方用于自家模型的公开基准评测**：

- 2026-07-31：V4-Flash 发布时的官方 Code Agent 评测使用（当时标注 "to be released soon"）
- 2026-08-21：V4-Flash-Vision-Exp 发布时，已成为 **DeepSeek 全家族模型 Code Agent 文本任务评测的标准框架**（去掉待发布标注）
- 评测配置统一为：max effort level、topp=0.95、temperature=1.0

## 六、结论与开放问题

**一句话总结**：DeepSeek Harness 是 DeepSeek 官方 2026 年 8 月开源的智能体运行框架，以 Cordis 插件树 + "Everything is a Plugin" 为核心架构（turn/step 两层 agentic loop、五种 profile、JSONL 会话持久化），提供 Node Web UI 与 Python SDK 两种使用路径，对外则以 OpenAI/Anthropic 兼容端点充当 Claude Code 等第三方 harness 的模型后端，并已用于自家模型的 Code Agent 基准评测。

**开放问题（后续跟踪点）**：

1. dsh 与 Claude Code / OpenHands / SWE-agent 在 SWE-bench 等基准上的定量对比（目前完全缺失）
2. web/headless/sdk profile 的上下文压缩与 Memory MCP 记忆集成的具体配置与工作机制
3. 何时转正（GA）、商业模式（免费开源 vs 配套 API 收费）与生产级稳定性承诺
4. Cordis（源自 Koishi 生态）之上的社区插件生态现状：第三方插件 / MCP 工具的实际数量与质量

## 七、可靠性与时效性说明（Caveats）

- **来源结构单一**：所有验证均基于 DeepSeek 自家仓库、官方文档与官方公告——一手但"自我描述"性质，agent 能力与性能未经第三方基准或独立评测印证；验证过程中 WebSearch 全程被拒（403），无法做外部反向查证
- **时效性强**：项目为 developer preview（0.1.5-rc 阶段），官方明确警告 breaking changes，本报告内容截至 2026-09-22，接口与文档可能快速变化

## 参考来源

1. https://github.com/deepseek-ai/deepseek-harness （README、LICENSE、docs/architecture.md、docs/glossary.md）
2. https://deepseek-harness.github.io/deepseek-harness/en/ （Guide/Quickstart、Reference）
3. https://api-docs.deepseek.com/ （官方 API 文档）
4. https://api-docs.deepseek.com/quick_start/agent_integrations/ （Agent 集成章节，含 claude_code 页）
5. https://api-docs.deepseek.com/guides/anthropic_api （Anthropic 兼容格式）
6. https://api-docs.deepseek.com/updates （changelog：V4-Flash / V4-Flash-Vision-Exp 评测框架沿革）
7. https://pypi.org/pypi/deepseek-harness-sdk/json （Python SDK 元数据）
