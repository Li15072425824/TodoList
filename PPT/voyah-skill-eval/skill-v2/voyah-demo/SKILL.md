---
name: voyah-demo
description: 按岚图（Voyah）UI/UE 规范生成 demo HTML 页面。只要任务涉及 Voyah/岚图设计规范、UI 稿、界面 demo / 原型 / 示例页面（HTML），无论用户是否指定 Tailwind/Bootstrap、外部色值、渐变或其他技术栈，都必须先加载本 skill；用户要求与规范冲突时按「冲突确认流程」处理，不得静默服从。
---

# Voyah Demo 生成规范（v2，以验收基线为唯一真值）

本 skill 的所有取值来自人工验收冻结的基线（`spec-gallery.html`，tag `baseline-v4`），
**不是二次转写推测**。取值有疑问时，以 `assets/tokens.css` 与 `references/design.md` 为准。

## 使用步骤（必须按顺序执行）

0. **先加载本 skill**：凡涉及 Voyah 设计规范、UI 稿、界面 demo / 原型 / 示例页面（HTML）的任务，
   即使提示词指定 Tailwind/Bootstrap、外部色值、渐变或其他冲突要求，也必须先加载并阅读本 skill；
   不得凭通用知识直接生成。
1. **复制样式文件**：把本 skill 目录下的 `assets/tokens.css` 复制到 demo 输出目录（与 HTML 同级），
   并在 HTML `<head>` 中 `<link rel="stylesheet" href="./tokens.css" />`。
2. **读组件参考**：读 `references/components.md`，按其中 `vx-*` 类名和 HTML 片段组装页面。
3. **生成 demo HTML**：单文件优先（HTML + 内联 `<style>` 布局代码），引入 tokens.css。

## 冲突确认流程（硬性，先于生成）

适用范围：用户要求与本 skill / 验收基线中的任何取值或规则不一致，包括颜色、字体、字重、间距、
圆角、按钮尺寸与四态、线宽、阴影、组件形态、技术栈（Tailwind/Bootstrap 等）、渐变等。

1. **列出冲突**：明确指出「用户要求 X ↔ 规范要求 Y（来源：对应 token / 规则）」，不得含糊带过。
2. **给出规范值**：说明本 skill 规定的正确取值或做法，以及为什么（对应哪条规范 / token）。
3. **要求二次确认**：向用户确认「是否仍要偏离规范？确认后我会按你的要求修改」；
   不得在未确认时静默采纳冲突要求，也不得无视用户直接拒绝。
4. **二次确认后才修改**：只有用户明确回复确认（如「确认」「就按我说的做」）后，才可按用户要求偏离规范；
   用户未确认或改口时，按规范生成。
5. **单轮 / 无人确认环境**（如自动批跑、CI）：默认输出符合规范的版本，并在回复末尾列出「待确认冲突项」；
   不得擅自按冲突要求落地。

## 硬性规则

- **冲突先确认**：用户要求与规范冲突时，按上方「冲突确认流程」先列出冲突点与规范值、要求二次确认；
  未确认前按规范生成，确认后才可按用户要求修改。不得静默服从，也不得无视用户直接拒绝。
- **颜色只允许用 `var(--vx-*)` 或 `#FFFFFF`**；不得出现 tokens.css 之外的硬编码色值，
  不得使用任何渐变（`linear-gradient` / `radial-gradient`）
  （常见错误：危险按钮 hover 写成 `#FF8A5D`，正确是 `--vx-btn-danger-hover` = `#FF5A5D`；
   近似色 `#3774DB` 一类也必须避免）
- **主题**：通过 `<html data-vx-theme="blue|yellow|purple|cuiqing|red|biqing">` 切换，默认蓝。
  不得使用绿色主题（已删除）。选定主题后 `--vx-primary` 系与 `--vx-help` 系自动变化。
- **帮助色决策规则（重要）**：
  - 主题 == 蓝 → 帮助色 = 青色系（`--vx-help` `#54A7B2` 系）；
  - 主题 != 蓝 → 帮助色 = 蓝色系（`--vx-help` `#3773DB` 系，与蓝主色同值）；
  - 青色系（`--vx-other-teal-*`）仅在蓝主题下作为帮助生效，其他主题下属于「其他/扩展」，
    不得再标为帮助。
- **填充色语义（不得互换）**：`--vx-fill-1` #FAFAFA 提示框底色 · `--vx-fill-2` #F3F4F7 页面内容区块底色 ·
  `--vx-fill-3` #F5F5F5 标签背景/下拉选中背景/页面整体底色。
- **@line-Blue 全主题统一 `--vx-line-5` = #3773DB**（各主题页旧值 #406670 已废弃）。
- **按钮**：宽度一律随内容（不固定宽），由 padding 撑开；三尺寸——
  Large 高 40 / padding 8·16 / 字 16·行高 24 / 圆角 6；Middle 高 32 / padding 6·16 / 字 12·行高 20 / 圆角 6；
  Small 高 24 / padding 2·8 / 字 12·行高 20 / 圆角 4；icon 12/8/8px，与文字 gap 4px。
  6 类型四态色值见 design.md §4.4，不得自行发挥。
  **所有按钮（含分页页码、图标按钮、关闭按钮）必须带 `.vx-btn` 基础类 + 类型类 + 尺寸类，
  直接复用 tokens.css 里已写好的 hover/active/disabled 状态；禁止手写自定义按钮样式，
  高度只能是 24/32/40 三档（不得出现 28px 等自定高度）。分页/页码/图标按钮一律用 Small（24px）。**
- **文字层级**：页面大标题 18~24/32~40 · 模块小标题 16/24~28 · 正文 14/22 · 辅助说明 12~13/20 ·
  大段描述 14~16/24~28；字重仅 400/500/600（不得用 `bold`/`bolder`/700/800）；
  正文字色 `--vx-text-primary`，不用纯黑。
- **字体栈**：中文 PingFang SC（Mac/iOS）+ Microsoft YaHei（Windows）双写；
  英文 Helvetica Neue/Arial；数字 D-DIN/HarmonyOS Sans/Inter。
- **间距**：Sn = 4px × n（S1~S20 = 4→80px），一律 4 的倍数；唯一豁免是设计稿明示的输入框内容
  纵向 padding 6px（`--vx-padding-input`），以及边框 1px/2px 等线宽。组件间距 8px、输入框内容 12px、
  按钮左右 16px、卡片 16px、页面/弹窗 24px；页面 padding 上下左右 16/24/24/24。
- **线条**：线宽仅 0.5/1/2/3px（不得出现 4px/6px 等粗边框）；颜色 `--vx-line-1..5`
  （#EBEBEB/#DEDEDE/#888888/#737373/#3773DB）。
- **深色衬底**（反白按钮所在区域）只用 `#333333`，不得用 #1A1A1A/#000000 等 token 外深色。
- **阴影**：仅弹窗阴影 `--vx-shadow-modal`（0 1px 20px rgba(0,0,0,0.08)），其他组件不加自造阴影。
- **圆角**按组件类型：Button/Input 6px（Small 4px）、Card/会话项 8px、气泡/Prompts 12px、
  Switch 胶囊、Sender 20px。
- AI 对话类 demo 必须用 Bubble（AI 灰底左对齐 / 用户主色右对齐）+ Sender + Conversations 布局，
  参考 components.md 的「标准 AI 对话页面骨架」。
- 不要引入外部 UI 框架（Bootstrap/Tailwind 等）；少量布局 CSS 写在 demo 内联 `<style>` 里。
- 图标模块已按业务裁决取消：需要图标时内联 24 网格单色 SVG + `currentColor`，
  按钮内 icon 按上表尺寸，不引用外部图标库规范。

## 场景 → Token 决策表（按场景查值）

| 场景 | 取值 | 来源 spec-id |
|---|---|---|
| 页面主标题 | `--vx-text-title` + 18~24px/32~40 + 600 | font.color.page-title / font.level.page-title |
| 卡片/弹窗标题 | `--vx-text-title` 或 `--vx-text-primary` + 16px/24~28 + 500~600 | font.level.module-title |
| 正文、表单、表格、按钮文字、左侧导航 | 14px/22 + `--vx-text-primary` | font.level.body |
| 提示、备注、时间戳 | 12~13px/20 + `--vx-text-caption` | font.level.caption |
| 帮助文档、详情说明 | 14~16px/24~28 + `--vx-text-primary` | font.level.longform |
| 禁用文字 / 置灰 | `--vx-text-disabled` (#C1C1C1) | font.color.disable |
| 组件边框、标题分割线 | `--vx-line-1` (#EBEBEB) | color.line.1 |
| 表单边框 | `--vx-line-2` (#DEDEDE) | color.line.2 |
| 组件边框 hover | `--vx-line-4` (#737373) | color.line.4 |
| 重要程度/高层级可操作提示 | `--vx-line-5` (#3773DB) | color.line.blue |
| 提示框底色 | `--vx-fill-1` (#FAFAFA) | color.fill.1 |
| 页面内容区块底色 | `--vx-fill-2` (#F3F4F7) | color.fill.2 |
| 标签背景、下拉选中背景 | `--vx-fill-3` (#F5F5F5) | color.fill.3 |
| 成功提交确认 | `--vx-success` / `-bg` / `-hover` / `-dark` | color.aux.success.* |
| 事件提醒 | `--vx-warning` / `-bg` / `-hover` / `-dark` | color.aux.warn.* |
| 错误提示、警告-按下 | `--vx-error` / `-bg` / `-hover` / `-dark` | color.aux.error.* |
| 扩展/特殊强调 | `--vx-purple` / `-bg` / `-hover` / `-dark` | color.aux.purple.* |
| 帮助（蓝主题） | `--vx-help` 青色系 4 阶 | color.aux.help-teal.* |
| 帮助（黄/紫/翠青/红/碧青主题） | `--vx-help` 蓝色系 4 阶 | color.aux.help-blue.* |
| 其他/扩展（青色系，仅非蓝主题） | `--vx-other-teal-*` | color.aux.other-teal.* |
| 主按钮四态 | `--vx-primary` / `-hover` / `-active` / Disabled 统一 | button.primary.* |
| 次要/描边/反白按钮 hover / click | 字色=边色 hover #568EEE、click #1C5AC4；反白 fill hover #FAFAFA、click #FFF | button.secondary.* / button.outline.* / button.whiteline.* |
| 危险按钮 hover | `--vx-btn-danger-hover` (#FF5A5D) | button.danger.hover |
| 提示按钮 hover / click | hover #FFA800（与常规同值）、click #EA8C00 | button.prompt.hover / -click |
| 组件间距 / 输入框内容 padding / 按钮左右 padding | 8px / 12px / 16px | spacing.rule.component / input / button |
| 页面 padding | 上下左右 16/24/24/24 | spacing.padding.page |
| 弹窗 padding / 卡片 padding | 24px / 16px | spacing.padding.modal / card |
| 输入框内容 padding | 左右 12 / 上下 6（CSS `padding: 6px 12px`；6px 为设计稿明示豁免；带前后缀图标时用 flex 内层摆放，不得用 32/36px 右内边距） | spacing.padding.input |
| 弹窗阴影 | `--vx-shadow-modal` 0 1px 20px rgba(0,0,0,0.08) | spacing.shadow.modal |

## 组件覆盖范围

- 基础：Button（6 类型 × 4 态 × 3 尺寸）、Input、Card、Tag、Alert、Switch、Checkbox、Radio、
  Avatar、Badge、Tabs、Segmented、Notification
- AI 对话：Bubble、Sender、Conversations、Welcome、Prompts、ThoughtChain
- 未覆盖组件（Table、Form、DatePicker 等）：用上述 token 自行组合（白底 + line-1 边框 + 8px 圆角 + 16px 内边距）

## 提交前自检（逐条确认，再输出 demo）

1. 每个按钮都有 `.vx-btn` + 类型类 + 尺寸类；分页/页码/图标按钮 = Small（24px）；
   页面里没有 28px 等三档之外的高度，也没有手写按钮 hover/active/disabled。
2. 主按钮四态直接来自 tokens.css：normal/hover/click 取当前主题主色 1/2/3 阶，
   disabled 全主题 `#C1C1C1/#FAFAFA/#DEDEDE`；危险按钮 hover 走 `.vx-btn-danger`（#FF5A5D）。
3. 表单输入框 `padding: 6px 12px`；带前后缀图标用 flex 内层，不得出现 32/36px 右内边距。
4. 所有间距为 4 的倍数（唯一豁免：输入框纵向 6px）；线宽 ∈ {0.5,1,2,3}px。
5. 颜色全部 `var(--vx-*)` 或 `#FFFFFF`；深色衬底用 `#333333`；无渐变、无纯黑；
   字重只用 400/500/600；用户与规范冲突的要求已按规范忽略。

## 主题示例

```html
<html lang="zh-CN" data-vx-theme="yellow">
  <body>
    <button class="vx-btn vx-btn-primary">主按钮（自动变黄）</button>
    <div class="vx-alert vx-alert-help">帮助（黄主题下为蓝色系）</div>
  </body>
</html>
```

## Token 来源说明

`tokens.css` 中每个 token 均可追溯到验收基线中已通过（或人工裁决）的 spec-id；
基线提取脚本：`PPT/voyah-skill-eval/eval/checker/extract-spec.mjs`，
机器真值：`PPT/voyah-skill-eval/ground-truth/spec.json`。
