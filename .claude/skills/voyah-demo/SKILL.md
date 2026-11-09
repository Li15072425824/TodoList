---
name: voyah-demo
description: 按岚图（Voyah）UI/UE 规范生成 demo HTML 页面。当用户要求生成 demo / 原型 / 示例页面 / 界面示意（HTML）时必须使用本 skill，确保产出符合 Voyah Design 设计规范。
---

# Voyah Demo 生成规范

本 skill 将两份设计规范落地为可直接引用的本地资产：

1. **MasterGo《岚图数字化UI/UE规范》设计稿**（主色序列、中立色、语义色板、字体、间距、线条、按钮状态、图标）
2. **Voyah Design 组件库**（voyah-design，antd/Ant Design X 主题，基础组件 + AI 对话组件）

> 完整设计规范（含间距 Sn=4n 规则、按钮四态色值矩阵、图标库使用与导出方式）见 `references/design.md`，样式取值有疑问时以它为准。

## 使用步骤（必须按顺序执行）

1. **复制样式文件**：把本 skill 目录下的 `assets/tokens.css` 复制到 demo 输出目录（与 HTML 同级），并在 HTML `<head>` 中 `<link rel="stylesheet" href="./tokens.css" />`。
2. **读组件参考**：读 `references/components.md`，按其中的 `vx-*` 类名和 HTML 片段组装页面。
3. **生成 demo HTML**：单文件优先（HTML + 内联 `<style>` 布局代码），引入 tokens.css。

## 硬性规则

- **颜色只允许用 `var(--vx-*)`**，不得出现 tokens.css 之外的硬编码色值（白色 `#fff`/透明除外）
- 主色恒为 `--vx-primary`（#3773DB）：hover 用 `--vx-primary-hover`（变浅），按下用 `--vx-primary-active`（变深），浅底用 `--vx-primary-bg`
- 文字分四级：标题 `--vx-text-title`(#111) → 正文 `#333` → 次要 `#666` → 说明 `#999`，不要用纯黑
- 边框分两档：组件边框/分割线 `--vx-line-1`，表单边框 `--vx-line-2`
- 间距按 4px 网格（Sn=4n）：组件间 8px、输入框内容 12px、按钮左右 16px、卡片 16px、页面/弹窗 24px
- 交互态色：hover 变浅、点击变深、禁用统一 `#C1C1C1/#FAFAFA/#DEDEDE`；完整矩阵见 design.md §4.4
- 需要图标时：单色线性图标内联 24×24 SVG + `currentColor`；业务彩色图标从 MasterGo 图标库导出（design.md §5）
- 圆角按组件类型：Button/Input 6px、Card/会话项 8px、气泡/Prompts 12px、Switch 胶囊、Sender 20px
- 页面底色 `--vx-bg-layout`，内容区白底卡片；正文字号 14px，控件高度默认 32px
- AI 对话类 demo 必须用 Bubble（AI 灰底左对齐 / 用户主色右对齐）+ Sender + Conversations 布局，参考 components.md 的「标准 AI 对话页面骨架」
- 不要引入外部 UI 框架（Bootstrap/Tailwind 等）；少量布局 CSS 写在 demo 内联 `<style>` 里

## 组件覆盖范围

- 基础：Button、Input、Card、Tag、Alert、Switch、Checkbox、Radio、Avatar、Badge、Tabs、Segmented、Notification
- AI 对话：Bubble、Sender、Conversations、Welcome、Prompts、ThoughtChain
- 未覆盖的组件（Table、Form、DatePicker 等）：用上述 token 自行组合，视觉规则同上（白底 + line-1 边框 + 8px 圆角 + 12/16px 内边距）

## Token 来源说明

tokens.css 中的值：主色序列、文字四级、线条、填充、语义色板取自 MasterGo 设计稿标注；控件高度、阴影、圆角梯度、Sender/Bubble 等组件细部取自组件库站点实测。两处不一致时（如 hover 色）取设计稿值，并在 tokens.css 注释中保留了组件库实测值。
