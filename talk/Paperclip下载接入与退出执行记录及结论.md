# Paperclip 下载、接入与退出执行记录及结论

> 日期：2026-09-28
> 结论先行：**Paperclip 适合"多 agent、7×24 自治运转"的中台场景；对当前"少量 agent、少量任务"的使用方式过重，已停止后台运行并退出，数据保留可随时恢复。**

---

## 一、执行过程

### 1. 下载与安装

| 步骤 | 内容 | 结果 |
|---|---|---|
| 克隆 | `github.com/paperclipai/paperclip` → `~/WorkRep/paperclip` | ✅ |
| Node 版本 | 项目要求 ≥24.11，本机默认 v22.14 → 切 nvm 的 v24.21.0 | ✅ |
| 依赖安装 | `pnpm install`（约 3.5 分钟，monorepo 较大） | ✅ |
| Rust 工具链 | 构建 runner 原生二进制需要 cargo → rustup 安装 1.98.1 并编译 | ✅ |
| 初始化 | `paperclipai onboard --yes`，数据库迁移 283 个 migration，Agent JWT 设置完成 | ✅ |
| 首次运行 | `pnpm dev`，内嵌 Postgres，服务地址 `http://127.0.0.1:3100` | ✅ |

### 2. 接入本地 Claude Code

- 在用户创建的公司 **lixing**（`e66cf520-47fa-4dee-976f-d0416db6f884`）下，通过 CLI 创建 agent：
  - 名称 `Claude Code`，ID `674b7d56-ad4a-4c23-b362-41607d5254d0`
  - adapter 类型 `claude_local`（Claude ACP 引擎），工作目录 `/Users/lixing/WorkRep/paperclip-workspace/claude-agent`
- 官方环境探针（`adapter test-environment`）全部通过：ACP 引擎、工作目录、Node 版本、订阅登录（无 API Key，走本机 Claude 订阅）均 OK
- 用户随后在 UI 创建了 issue（LIX-3）实际试用

### 3. 注册后台服务（后已撤销）

- `paperclipai service install` 注册为 macOS launchd 服务（`ing.paperclip.paperclipai`），开机自启
- **踩坑**：launchd 起不来——plist 调用 `~/.local/bin/paperclipai`，但源码运行方式下该文件不存在；执行 `pnpm paperclipai install` 安装托管版 CLI（npm 下载约 2.7G）后服务正常拉起

### 4. 发现的核心问题（后台服务模式下 agent 跑不了）

- LIX-3 运行失败，ACP 报 `auth_required`（UI 显示 "ACP agent reported a terminal access failure"）
- **根因**：launchd 后台进程默认访问不了 macOS 钥匙串，而你本机 Claude Code 的订阅凭据存在钥匙串里 → 后台服务里的 agent 拿不到认证。终端里手动跑 `pnpm dev` 则没有此问题
- 尝试 Paperclip 官方补救方案（`agent claude-login` 给 agent 独立做 OAuth 登录）时又撞上第二个环境问题：托管 CLI 的服务进程 PATH 里没有 `claude` 命令，直接 500

### 5. 退出（本轮执行）

- `paperclipai service stop` + `paperclipai service uninstall`
- 验证：launchd 条目移除、plist 删除、3100 端口关闭
- **数据全部保留**：`~/.paperclip/instances/default/`（数据库、公司、agent 配置、issue），源码在 `~/WorkRep/paperclip`

---

## 二、最终结论

### Paperclip 是什么、适合谁

它是一个 **AI agent 组织的中台**：org chart、预算管控、心跳调度（30s 一轮）、治理审批、成本看板。README 的定位很直白——"如果 OpenClaw 是员工，Paperclip 就是公司"。它解决的是：

- 同时开 20 个 Claude Code 终端跟踪不过来
- 需要多个不同来源的 agent（Claude / Codex / Cursor / OpenClaw）朝同一个业务目标 7×24 自治协作
- 需要预算、审批、审计这类"公司级"治理

### 为什么不适合当前的使用方式

1. **规模不匹配**：agent 只有 1 个、任务零星。中台的全部价值（编排、org chart、预算、心跳治理）都建立"多员工"前提上；单 agent 场景下这些全是纯开销——装依赖 3.5 分钟、Rust 编译、2.7G 托管 CLI、常驻内嵌 Postgres
2. **使用路径长**：完成一件事要 走 UI → 建 goal/issue → 指派 agent → 等心跳唤醒 → 看仪表盘。对比直接在终端对 Claude Code 说一句话，多了一整套仪式
3. **本地订阅认证有坑**：macOS 下 launchd 后台服务读不到钥匙串凭据，官方的 agent 登录方案在当前环境又因 PATH 问题受阻。后台常驻 + 订阅登录这条组合链路不够顺

### 后续建议

- **日常**：直接用 Claude Code CLI（现状即可），结论/产出落到本地文件管理
- **如果未来 agent 数量、并行任务真的多起来**：Paperclip 值得再捡起来。恢复方式：
  ```bash
  cd ~/WorkRep/paperclip && pnpm dev   # 终端前台跑（避开 launchd 钥匙串问题）
  ```
  公司、agent、issue 数据都在，`pnpm dev` 起来即可接着用；或重装后台服务前先解决 `agent claude-login` 的 PATH 问题
- **观察到的值得借鉴的点**：它的"issue → agent 心跳认领 → 会话跨心跳持久化 → 治理审批"模型，以及 ACP 协议接入方式（参考 `talk/` 目录下已有的 ACP 相关文档）

---

## 三、环境现状

| 资源 | 状态 |
|---|---|
| 后台服务 | ❌ 已卸载 |
| 源码仓库 | `~/WorkRep/paperclip`（保留） |
| Paperclip 数据 | `~/.paperclip/`（保留，公司 lixing + Claude Code agent 均在） |
| 托管 CLI | `~/.local/bin/paperclipai` + `~/.paperclip/cli/`（约 2.7G，如彻底不用可删） |
| Rust 工具链 | `~/.cargo`（保留，其他项目可能用到） |
| agent 工作目录 | `~/WorkRep/paperclip-workspace/claude-agent`（空目录，可删） |
