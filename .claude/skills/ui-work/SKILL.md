---
name: ui-work
description: 按岚图（Voyah）UI/UE 规范生成 Work 工作台色系（青绿色系，主色 #419F93）的 demo HTML 页面。当用户要求生成该色系的 demo / 原型 / 示例页面（如数据产品矩阵原型中的 DataWorks 相关页面）时必须使用本 skill。
---

# DataWorks Demo 生成规范（Work 工作台色系）

本 skill 是 `voyah-demo`（蓝色主版 #3773DB）的**Work 工作台色系变体**。主色序列取自《岚图数据产品矩阵》原型调色板，交互态方向、中立色、语义色板、字体、间距、圆角、组件全部沿用 Voyah Design 规范。

## 色系定位

| Skill | 色系 | 主色 | 适用场景 |
|---|---|---|---|
| voyah-demo | 标准蓝 | #3773DB | 通用 Voyah 系统页面 |
| **ui-work** | 青绿 | #419F93 | Work 工作台（数据工坊/开发工作台类页面） |
| ui-guard | 青蓝绿 | #41969F | 安全防护类页面 |
| ui-ops | 蓝灰 | #41809F | 运维管控类页面 |
| ui-agent | 深蓝灰 | #416A9F | 智能体/Agent 类页面 |

## 使用步骤（必须按顺序执行）

1. **复制样式文件**：把本 skill 目录下的 `assets/tokens.css` 复制到 demo 输出目录（与 HTML 同级），并在 HTML `<head>` 中 `<link rel="stylesheet" href="./tokens.css" />`。
2. **读组件参考**：读 `references/components.md`，按其中的 `vx-*` 类名和 HTML 片段组装页面。
3. **生成 demo HTML**：单文件优先（HTML + 内联 `<style>` 布局代码），引入 tokens.css。

## 硬性规则

- **颜色只允许用 `var(--vx-*)`**，不得出现 tokens.css 之外的硬编码色值（白色 `#fff`/透明除外）
- 主色恒为 `--vx-primary`（#419F93）：hover 用 `--vx-primary-hover`（#67B2A9，变浅），按下用 `--vx-primary-active`（#38897E，变深），浅底用 `--vx-primary-bg`（#E8F3F2）
- 更深档 `--vx-primary-deep`（#30766D）仅用于 pressed 强调或渐变端点，不作为常规交互态
- 文字分四级：标题 `--vx-text-title`(#111) → 正文 `#333` → 次要 `#666` → 说明 `#999`，不要用纯黑
- 边框分两档：组件边框/分割线 `--vx-line-1`，表单边框 `--vx-line-2`；主色系强调边框用 `--vx-primary-line`（#B7DBD6）或 `--vx-line-5`
- 间距按 4px 网格（Sn=4n）：组件间 8px、输入框内容 12px、按钮左右 16px、卡片 16px、页面/弹窗 24px
- 交互态色：**hover 变浅、点击变深**（此方向来自 Voyah 规范，与原型实际实现相反，以本 skill 为准）、禁用统一 `#C1C1C1/#FAFAFA/#DEDEDE`；完整矩阵见 design.md §4.4
- 需要图标时：单色线性图标内联 24×24 SVG + `currentColor`；业务彩色图标从 MasterGo 图标库导出（design.md §5）
- 圆角按组件类型：Button/Input 6px、Card/会话项 8px、气泡/Prompts 12px、Switch 胶囊、Sender 20px
- 页面底色 `--vx-bg-layout`(#F5F5F5)，内容区白底卡片；正文字号 14px，控件高度默认 32px
- AI 对话类 demo 必须用 Bubble（AI 灰底左对齐 / 用户主色右对齐）+ Sender + Conversations 布局，参考 components.md 的「标准 AI 对话页面骨架」
- 不要引入外部 UI 框架（Bootstrap/Tailwind 等）；少量布局 CSS 写在 demo 内联 `<style>` 里

## 组件覆盖范围

与 `voyah-demo` 完全一致（基础组件 + AI 对话组件，`vx-*` 类名），见 references/components.md。未覆盖的组件用 token 自行组合：白底 + line-1 边框 + 8px 圆角 + 12/16px 内边距。

## 与原型的关系说明

原色来源原型（岚图数据产品矩阵-路演版）中该色系的三档色为 #419F93 / #38897E / #30766D，原型将第二档用作 hover（加深方向，违反 Voyah「hover 变浅」规则）。本 skill 已修正：hover 取「常规色向白色混合 20%」的变浅值 #67B2A9，active 沿用原型深档 #38897E。若后续原型调色板更新，同步更新本 skill 的 tokens.css。
