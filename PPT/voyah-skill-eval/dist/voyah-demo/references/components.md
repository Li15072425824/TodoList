# Voyah Design 组件用法参考（v2）

> 本文档类名均来自 `assets/tokens.css`（`vx-` 前缀）。
> token 值来源：人工验收冻结基线（spec.json，tag baseline-v4）。
> 写 demo 时：**先复制 `assets/tokens.css` 到 demo 同目录**，`<link>` 引入，再按本文片段组装。

## 通用规则

- 颜色一律用 `var(--vx-*)` 或 `#FFFFFF`，禁止出现 token 之外的色值
- 正文字号 14px/22；辅助说明 12~13px/20；模块标题 16px/24~28；页面标题 18~24px/32~40
- 控件高度：默认 32px，大 40px，小 24px；按钮宽度随内容
- 页面底色 `--vx-bg-layout`(#F5F5F5)，内容卡片白底
- 主题：`<html data-vx-theme="blue|yellow|purple|cuiqing|red|biqing">`，默认 blue
- 帮助色：蓝主题=青色系；非蓝主题=蓝色系（`--vx-help` 自动切换）；青色系在非蓝主题归「其他」

## 组件 → token 速查

| Token 组 | 变量 |
|---|---|
| 主题主色 | `--vx-primary` `--vx-primary-hover` `--vx-primary-active` `--vx-primary-bg` |
| 文字 | `--vx-text-title`(#111111) `--vx-text-primary`(#333333) `--vx-text-secondary`(#666666) `--vx-text-caption`(#999999) `--vx-text-disabled`(#C1C1C1) |
| 线条 | `--vx-line-1`(#EBEBEB) `--vx-line-2`(#DEDEDE) `--vx-line-3`(#888888) `--vx-line-4`(#737373) `--vx-line-5`(#3773DB) |
| 填充 | `--vx-fill-1`(#FAFAFA 提示框底) `--vx-fill-2`(#F3F4F7 页面区块底) `--vx-fill-3`(#F5F5F5 标签/下拉选中) |
| 辅助色 | `--vx-success(-bg/-hover/-dark)`、`--vx-warning(...)`、`--vx-error(...)`、`--vx-purple(...)` |
| 帮助 | `--vx-help(-bg/-hover/-active)`；其他(青色) `--vx-other-teal-*` |
| 圆角 | xs2 / sm4(Small 按钮,Tag) / md6(Button,Input) / lg8(Card,会话项) / xl12(Bubble,Prompts) / pill100(Switch) / sender20 |
| 阴影 | 仅 `--vx-shadow-modal`（弹窗） |

---

## Button 按钮

```html
<!-- 6 类型（宽度随内容） -->
<button class="vx-btn vx-btn-primary">主要按钮</button>
<button class="vx-btn vx-btn-secondary">次要按钮</button>
<button class="vx-btn vx-btn-outline">描边按钮</button>
<button class="vx-btn vx-btn-danger">危险按钮</button>
<button class="vx-btn vx-btn-prompt">提示按钮</button>
<!-- 反白按钮仅用于深色衬底区域 -->
<div style="background:#333333;padding:16px"><button class="vx-btn vx-btn-whiteline">反白按钮</button></div>

<!-- 3 尺寸 -->
<button class="vx-btn vx-btn-primary vx-btn-lg">Large</button>
<button class="vx-btn vx-btn-primary">Middle</button>
<button class="vx-btn vx-btn-primary vx-btn-sm">Small</button>

<!-- icon + 文本（gap 4px） -->
<button class="vx-btn vx-btn-primary vx-btn-lg"><svg class="vx-btn-icon" viewBox="0 0 24 24"></svg>按钮</button>
<button class="vx-btn vx-btn-primary"><svg class="vx-btn-icon" viewBox="0 0 24 24"></svg>按钮</button>

<!-- 禁用 -->
<button class="vx-btn vx-btn-primary" disabled>禁用</button>

<!-- 分页 / 页码：一律 Small（24px） -->
<div class="vx-pagination">
  <button class="vx-btn vx-btn-secondary vx-btn-sm">‹</button>
  <button class="vx-btn vx-btn-secondary vx-btn-sm">1</button>
  <button class="vx-btn vx-btn-primary vx-btn-sm">2</button>
  <button class="vx-btn vx-btn-secondary vx-btn-sm">›</button>
</div>

<!-- 图标按钮（如关闭）：Small，24px -->
<button class="vx-btn vx-btn-secondary vx-btn-sm vx-btn-icon-only" aria-label="关闭">✕</button>
```

要点：**所有按钮都必须带 `.vx-btn` + 类型类 + 尺寸类**，状态（hover/active/disabled）由 tokens.css
提供，禁止手写自定义按钮样式或自定义高度（只能 24/32/40）。主要+次要并排时主要按钮在左；
hover 字/边=#568EEE，click 字/边=#1C5AC4（危险 hover #FF5A5D，提示 hover=常规 #FFA800）；
禁用统一 `#C1C1C1/#FAFAFA/#DEDEDE`。分页页码、图标按钮一律 Small。非蓝主题下主按钮
normal/hover/click 自动取该主题主色 1/2/3 阶（由 `--vx-primary` 系 token 生效）。

## Input 输入框

```html
<input class="vx-input" placeholder="请输入" />
```

要点：边框 `--vx-line-2`(#DEDEDE)，hover `--vx-line-4`(#737373)，focus 主色边框；
内容 padding 固定 **`6px 12px`（上下 6、左右 12；6px 为设计稿豁免）**。带前后缀图标时
用 flex 内层把图标放进输入框容器，不要用 32/36px 右内边距来让位。

## Card 卡片

```html
<div class="vx-card">
  <div class="vx-card-head">
    <span class="vx-card-title">卡片标题</span>
    <button class="vx-btn vx-btn-secondary vx-btn-sm">更多</button>
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
<div class="vx-alert vx-alert-help"><span class="vx-alert-icon">?</span><span>帮助内容（蓝主题=青色系，非蓝主题=蓝色系）</span></div>
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

变体：`vx-bubble-filled`（`--vx-fill-3`）/ `vx-bubble-outlined`（`--vx-line-1` 描边）。
气泡圆角 12px，padding 12/20，正文 14/22。

## Sender 输入框

```html
<div class="vx-sender">
  <button class="vx-btn vx-btn-secondary vx-btn-sm">附件</button>
  <textarea class="vx-sender-input" rows="1" placeholder="输入消息，Enter 发送"></textarea>
  <button class="vx-sender-send">发送</button>
</div>
```

要点：20px 胶囊圆角，边框 `--vx-line-2`，focus-within 变主色；禁用浅灰底灰字。

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
<html lang="zh-CN" data-vx-theme="blue">
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
| 主色序列（蓝） | #3773DB / #568EEE / #1C5AC4 / #ECF3FF | 常规 / hover / 按下 / 浅底 |
| @text-Title / Primary / Secondary / Caption / Disable | #111111 / #333333 / #666666 / #999999 / #C1C1C1 | 文字 5 级 |
| @line1-1 / line1-2 / line1-3 / line1-4 / @line-Blue | #EBEBEB / #DEDEDE / #888888 / #737373 / #3773DB | 线条 5 级（line-Blue 全主题统一） |
| @filling1-1 / filling1-2 / filling1-3 | #FAFAFA / #F3F4F7 / #F5F5F5 | 提示框底 / 页面区块底 / 标签与下拉选中 |
| @color-success-1~4 | #E3F8E8 / #A8E1A6 / #00D115 / #00A611 | 成功 |
| @color-warning-1~4 | #FFF1DB / #FFD77E / #FFA800 / #EA8C00 | 警告 |
| @color-error-1~4 | #FCEBEA / #FDA2A4 / #FF2020 / #CF2E2E | 错误 |
| @color-help（蓝主题） | #E8F6F9 / #6EACB4 / #54A7B2 / #38929F | 帮助（青色系） |
| @color-help（非蓝主题） | #ECF3FF / #B3CBF4 / #3773DB / #1C5AC4 | 帮助（蓝色系） |
| @color-purple-1~4 | #F5EFFF / #D0B0FF / #8F44FF / #5000C8 | 紫色（其他/扩展） |
| 间距规则 | Sn = 4px × n；常用 S2/S3/S4/S6 = 8/12/16/24 | 间距 |
