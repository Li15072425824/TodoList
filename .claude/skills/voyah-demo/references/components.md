# Voyah Design 组件用法参考

> 本文档中的类名均来自 `assets/tokens.css`（`vx-` 前缀）。
> token 值来源：MasterGo《岚图数字化UI/UE规范》设计稿 + Voyah Design 组件库站点实测计算样式。
> 写 demo 时：**先复制 `assets/tokens.css` 到 demo 同目录**，`<link>` 引入，再按本文片段组装。

## 通用规则

- 颜色一律用 `var(--vx-*)`，禁止出现 token 之外的色值
- 正文 14px / 次要 12px / 标题 18-24px；文字色 `--vx-text-title > primary > secondary > caption` 四级
- 控件高度：默认 32px，大 40px，小 24px
- 页面底色 `--vx-bg-layout`(#F5F5F5)，内容卡片白底
- 主色 `#3773DB`：hover 变浅 `#568EEE`，按下变深 `#1C5AC4`，浅底 `#ECF3FF`

## 组件 → token 速查

| Token 组 | 变量 |
|---|---|
| 主色 | `--vx-primary` `--vx-primary-hover` `--vx-primary-active` `--vx-primary-bg` |
| 文字 | `--vx-text-title`(#111) `--vx-text-primary`(#333) `--vx-text-secondary`(#666) `--vx-text-caption`(#999) |
| 线条 | `--vx-line-1`(#EBEBEB 组件边框/分割线) `--vx-line-2`(#DEDEDE 表单边框) `--vx-line-hover`(#737373) |
| 填充 | `--vx-fill-1`(#FAFAFA) `--vx-fill-2`(#F3F4F7) `--vx-fill-3`(#F5F5F5) |
| 成功/警告/错误/帮助 | `--vx-success(-dark/-bg/-border)` 等，error 徽标用 `--vx-error-badge` |
| 圆角 | xs2 / sm4(Tag) / md6(Button,Input) / lg8(Card,会话项) / xl12(Bubble,Prompts) / pill100(Switch) / sender20 |
| 阴影 | `--vx-shadow-1` `--vx-shadow-2` `--vx-shadow-sender` `--vx-shadow-bubble` |

---

## Button 按钮

```html
<button class="vx-btn vx-btn-primary">主按钮</button>
<button class="vx-btn vx-btn-default">默认按钮</button>
<button class="vx-btn vx-btn-dashed">虚线按钮</button>
<button class="vx-btn vx-btn-text">文本按钮</button>
<button class="vx-btn vx-btn-link">链接按钮</button>
<button class="vx-btn vx-btn-primary vx-btn-lg">大按钮</button>
<button class="vx-btn vx-btn-primary vx-btn-sm">小按钮</button>
<button class="vx-btn vx-btn-primary" disabled>禁用</button>
```

要点：主按钮白字 500 字重；文本按钮是胶囊圆角(pill)；默认按钮 hover 变主色边框。
链接态色（设计稿按钮状态矩阵）：链接 hover `--vx-primary-visited`(#6691DB)、点击 `--vx-primary-active`(#1C5AC4)、禁用 `#C1C1C1`。
补充类型：`vx-btn-danger`（危险，hover `#FF8A5D` / click `#CF2E2E`）、`vx-btn-prompt`（提示橙，click `#EA8C00`）。主要+次要并排时主要在左。禁用态统一 `#C1C1C1/#FAFAFA/#DEDEDE`（tokens.css 已内置）。

## 图标

- 通用单色图标：24×24 线性 SVG，内联 + `currentColor`（随文字色 hover/禁用变色）
- 按钮内 icon 与字体同尺寸（Large 12 / Middle 8 / Small 8px），与文字间隔 4px
- 业务模块彩色图标（零部件采购、停车位申请、党群工作等）与文件格式图标：从 MasterGo「全局UI样式标准 → 图标」frame 按中文名搜索后导出 SVG/PNG @2x
- 详细规则见 `references/design.md` §5

## Input 输入框

```html
<input class="vx-input" placeholder="请输入" />
```

要点：边框 `--vx-line-1`，hover 加深为 `--vx-line-hover`，focus 主色描边 + `--vx-primary-bg` 外圈。

## Card 卡片

```html
<div class="vx-card">
  <div class="vx-card-head">
    <span class="vx-card-title">卡片标题</span>
    <button class="vx-btn vx-btn-text vx-btn-sm">更多</button>
  </div>
  <div class="vx-card-body">卡片内容</div>
</div>
```

## Tag 标签

```html
<span class="vx-tag">默认</span>
<span class="vx-tag vx-tag-primary">主色</span>
<span class="vx-tag vx-tag-success">成功</span>
<span class="vx-tag vx-tag-warning">警告</span>
<span class="vx-tag vx-tag-error">错误</span>
```

## Alert 提示

```html
<div class="vx-alert vx-alert-info"><span class="vx-alert-icon">ℹ</span><span>提示内容</span></div>
<div class="vx-alert vx-alert-success"><span class="vx-alert-icon">✓</span><span>成功内容</span></div>
<div class="vx-alert vx-alert-warning"><span class="vx-alert-icon">⚠</span><span>警告内容</span></div>
<div class="vx-alert vx-alert-error"><span class="vx-alert-icon">✕</span><span>错误内容</span></div>
```

## Switch / Checkbox / Radio

```html
<input type="checkbox" class="vx-switch" checked />
<label class="vx-checkbox"><input type="checkbox" checked /><span class="vx-checkbox-box">✓</span>选项</label>
<label class="vx-radio"><input type="radio" name="r" checked /><span class="vx-radio-box"></span>选项</label>
```

## Avatar / Badge / Tabs / Segmented

```html
<span class="vx-avatar vx-avatar-primary">岚</span>
<span class="vx-badge"><span class="vx-avatar">A</span><span class="vx-badge-count">5</span></span>
<div class="vx-tabs">
  <span class="vx-tab vx-tab-active">标签一</span>
  <span class="vx-tab">标签二</span>
</div>
<div class="vx-segmented">
  <span class="vx-segmented-item vx-segmented-item-selected">日</span>
  <span class="vx-segmented-item">周</span>
  <span class="vx-segmented-item">月</span>
</div>
```

---

# AI 对话组件（Ant Design X 风格）

## Bubble 对话气泡（对话页面核心）

```html
<!-- AI 消息：灰底 filled -->
<div class="vx-bubble">
  <span class="vx-avatar vx-avatar-primary vx-bubble-avatar">岚</span>
  <div class="vx-bubble-main">
    <div class="vx-bubble-header">Voyah 助手</div>
    <div class="vx-bubble-content vx-bubble-filled">你好，我是岚图助手。</div>
    <div class="vx-bubble-footer">复制 · 重新生成</div>
  </div>
</div>

<!-- 用户消息：主色填充，右对齐 -->
<div class="vx-bubble vx-bubble-user">
  <span class="vx-avatar">我</span>
  <div class="vx-bubble-main">
    <div class="vx-bubble-content">帮我查一下今天的日程</div>
  </div>
</div>
```

变体：`vx-bubble-filled`(灰底) / `vx-bubble-outlined`(描边) / `vx-bubble-shadow`(阴影)。
气泡圆角 12px，padding 12px 20px，min-height 46px，字重 500。

## Sender 输入框

```html
<div class="vx-sender">
  <button class="vx-btn vx-btn-text">📎</button>
  <textarea class="vx-sender-input" rows="1" placeholder="输入消息，Enter 发送"></textarea>
  <button class="vx-sender-send">发送</button>
</div>
```

要点：胶囊圆角 20px + 柔和阴影，focus-within 边框变主色；禁用态浅蓝底灰字。

## Conversations 会话列表（侧边栏）

```html
<div class="vx-conversations">
  <div class="vx-conversation-item vx-conversation-item-active">当前会话</div>
  <div class="vx-conversation-item">历史会话 A</div>
  <div class="vx-conversation-item">历史会话 B</div>
</div>
```

## Welcome 欢迎语

```html
<div class="vx-welcome">
  <span class="vx-welcome-icon">🚗</span>
  <div>
    <div class="vx-welcome-title">你好，我是岚图助手</div>
    <div class="vx-welcome-description">今天想聊点什么？</div>
  </div>
</div>
```

## Prompts 提示集（快捷指令）

```html
<div class="vx-prompts">
  <div class="vx-prompt-item"><span class="vx-prompt-icon">📊</span>分析本月销量数据</div>
  <div class="vx-prompt-item"><span class="vx-prompt-icon">📝</span>生成周报</div>
</div>
```

## ThoughtChain 思维链（执行过程）

```html
<div class="vx-thought-chain">
  <div class="vx-thought-item"><span class="vx-thought-status vx-thought-status-done"></span>解析用户意图</div>
  <div class="vx-thought-item"><span class="vx-thought-status vx-thought-status-running"></span>查询数据库</div>
  <div class="vx-thought-item"><span class="vx-thought-status vx-thought-status-error"></span>生成报告失败</div>
</div>
```

## Notification 通知卡片

```html
<div class="vx-notification">
  <span>🔔</span>
  <div>
    <div class="vx-notification-title">通知标题</div>
    <div class="vx-notification-description">通知描述内容</div>
  </div>
</div>
```

---

# 标准 AI 对话页面骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>岚图助手</title>
<link rel="stylesheet" href="./tokens.css" />
<style>
  .app { display: flex; height: 100vh; background: var(--vx-bg-layout); }
  .sidebar { width: 260px; background: var(--vx-bg-base); border-right: 1px solid var(--vx-line-1); padding: var(--vx-space-md); display: flex; flex-direction: column; gap: var(--vx-space-md); }
  .main { flex: 1; display: flex; flex-direction: column; }
  .chat { flex: 1; overflow-y: auto; max-width: 800px; width: 100%; margin: 0 auto; padding: var(--vx-space-xl) var(--vx-space-md); }
  .footer { padding: var(--vx-space-md); }
  .footer .vx-sender { max-width: 800px; margin: 0 auto; }
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar">
    <button class="vx-btn vx-btn-primary">新建会话</button>
    <div class="vx-conversations">
      <div class="vx-conversation-item vx-conversation-item-active">当前会话</div>
      <div class="vx-conversation-item">历史会话</div>
    </div>
  </aside>
  <main class="main">
    <div class="chat">
      <div class="vx-welcome">…</div>
      <div class="vx-prompts">…</div>
      <!-- 气泡列表 -->
    </div>
    <div class="footer">
      <div class="vx-sender">…</div>
    </div>
  </main>
</div>
</body>
</html>
```

# 设计稿原始 token（MasterGo 命名对照）

| MasterGo token | 值 | 用途 |
|---|---|---|
| 主色序列·常规 | #3773DB | 主色 |
| 主色序列·hover | #568EEE | 悬停 |
| 主色序列·深色/按下 | #1C5AC4 | 按下 |
| 主色序列·浅色 | #ECF3FF | 浅色底 |
| @text-Title / Primary / Secondary / Caption | #111 / #333 / #666 / #999 | 文字四级 |
| @line1-1 / line1-2 / line1-3 / line1-4 / line1-5 | #EBEBEB / #DEDEDE / #888888 / #737373 / #3773DB | 线条五级 |
| 文字链接 Hover / Click | #6691DB / #1C5AC4 | 链接态 |
| 禁用统一 | 文字 #C1C1C1 / 底 #FAFAFA / 边 #DEDEDE | Disabled |
| 间距规则 | Sn = 4px × n；常用 S2/S3/S4/S6 = 8/12/16/24 | 间距 |
| @filling1-1 / filling1-2 / filling1-3 | #FAFAFA / #F3F4F7 / #F5F5F5 | 填充 |
| @color-success-1~4 | #E3F8E8 / #A8E1A6 / #00D115 / #00A611 | 成功 |
| @color-warning-1~4 | #FFF1DB / #FFD77E / #FFA800 / #EA8C00 | 警告 |
| @color-error-1~4 | #FCEBEA / #FDA2A4 / #FF2020 / #CF2E2E | 错误 |
| @color-help-1~4 | #E8F6F9 / #6EACB4 / #54A7B2 / #38929F | 帮助 |
| @color-purple-1~4 | #F5EFFF / #D0B0FF / #8F44FF / #5000C8 | 紫色 |
| 字体 | PingFang SC（系统栈回退） | 字体 |
