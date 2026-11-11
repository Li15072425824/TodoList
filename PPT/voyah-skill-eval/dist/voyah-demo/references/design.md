# 岚图（Voyah）数字化 UI/UE 设计规范（v2）

> **来源**：MasterGo《岚图数字化UI/UE规范》12 模块逐图层还原 → 人工三轮检核冻结的验收基线
> （`PPT/voyah-skill-eval/ground-truth/spec-gallery.html`，tag `baseline-v4`；机器真值 `spec.json`）。
> **用途**：生成 demo / 原型时的唯一视觉依据。token 见 `assets/tokens.css`，组件用法见 `references/components.md`。
> 设计稿链接：https://mastergo.com/file/192726801132881?page_id=M

---

## 0. 主题体系（总则）

- 系统提供 **6 套主题**：蓝 / 黄 / 紫 / 翠青 / 红 / 碧青（**绿色已删除**）。
- 选定主题后，该主题的 **主色序列** 与 **帮助色板** 生效；中立色、辅助色（成功/警告/错误/紫）全主题共享。
- 辅助色中**唯一随主题变化的是「帮助」组**：
  - 青色系帮助**仅在蓝主题**下作为「帮助」生效；
  - 其他主题 → 帮助 = 蓝色系（与蓝主色同值）；青色系色板归属「其他/扩展」。

```
主题 == 蓝   → 帮助 = 青色系   (#E8F6F9 / #6EACB4 / #54A7B2 / #38929F)
主题 != 蓝   → 帮助 = 蓝色系   (#ECF3FF / #B3CBF4 / #3773DB / #1C5AC4)
青色系在非蓝主题 → 「其他」(--vx-other-teal-*)
```

在 HTML 上使用 `<html data-vx-theme="blue|yellow|purple|cuiqing|red|biqing">` 切换。

---

## 1. 色彩 Color

### 1.1 主题主色序列（6 套 × 4 阶：常规 / hover / 深色·按下 / 浅色）

| 主题 | 常规 | hover | 深色/按下 | 浅色 |
|---|---|---|---|---|
| 蓝 | `#3773DB` | `#568EEE` | `#1C5AC4` | `#ECF3FF` |
| 黄 | `#FFD400` | `#FFE355` | `#F6B41A` | `#FFF3B6` |
| 紫 | `#8F44FF` | `#9660E5` | `#5000C8` | `#F5EFFF` |
| 翠青 | `#54A7B2` | `#6EACB4` | `#2A7F8C` | `#E8F6F9` |
| 红 | `#D82128` | `#E85E63` | `#AA0209` | `#FFDADA` |
| 碧青 | `#406670` | `#66828A` | `#325862` | `#C5E7F0` |

### 1.2 主色调色阶（11 级，场景调配用；常规=第 6 阶）

| 主题 | 11 级色阶（浅→深） |
|---|---|
| 蓝 | #CBDBF7 #B3CBF4 #9EBCF0 #7CA5ED #6090E2 **#3773DB** #2662CA #1B56BC #2553A5 #1C4692 #133A81 |
| 黄 | #FFF4BC #FFEFA1 #FFE876 #FFE14A **#FFD500** #FFC300 #F6B41A #EBAA11 #E19E04 #D19300 #C58A00 |
| 紫 | #F5EFFF #E9DAFF #CDADFC #B481FF #9E5FFC **#8F44FF** #7F2AFF #7315FF #5F02E8 #5000C8 #4200A5 |
| 红 | #FFDADA #FFBFC2 #F7A2A6 #E8787D #E55359 **#D82128** #C4181F #B5131A #AA0209 #9C050B #900C12 |
| 碧青 | #C5E7F0 #A6CFDB #87B3BF #66939F #527D89 **#406670** #3B5F69 #325862 #2E505A #264852 #1E3D46 |
| 翠青 | ⚠ 还原缺失（设计稿色阶行未被还原），如需对照 MasterGo 原稿补 |

规律：常规色位于第 6 阶；hover/按下色**不在色阶内**。

### 1.3 中立色 · 文字 5 级（全主题共享）

| Token | 值 | 用途 |
|---|---|---|
| `--vx-text-title` | `#111111` | 标题 |
| `--vx-text-primary` | `#333333` | 正文 |
| `--vx-text-secondary` | `#666666` | 次要文字；默认图形 icon hover |
| `--vx-text-caption` | `#999999` | 说明文字（辅助说明/提示/备注/时间戳） |
| `--vx-text-disabled` | `#C1C1C1` | 禁用文字；默认图形 icon |

特殊情况可用 `#222222` `#444444` `#555555` `#888888`；不得使用纯黑 `#000000`。

### 1.4 中立色 · 线条（5 级，颜色越深重要性/可操作性越强）

| Token | 值 | 用途 |
|---|---|---|
| `--vx-line-1` | `#EBEBEB` | 组件边框、标题分割线（最弱） |
| `--vx-line-2` | `#DEDEDE` | 表单边框 |
| `--vx-line-3` | `#888888` | 默认图形 icon 描边 |
| `--vx-line-4` | `#737373` | 组件边框 hover |
| `--vx-line-5` | `#3773DB` | @line-Blue 较重要程度/高层级可操作提示（**全主题统一**，Q9 裁决） |

线宽：实线 0.5/1/2/3px；虚线 0.5/1/2/3px。常规 UI 用 1px。
文字分割线：水平 74×1px `#DEDEDE`；垂直 1×12px `#DEDEDE`。

### 1.5 中立色 · 填充 3 级（语义按人工裁决修正，不得互换）

| Token | 值 | 用途 |
|---|---|---|
| `--vx-fill-1` | `#FAFAFA` | 提示框底色、提示文字背景 |
| `--vx-fill-2` | `#F3F4F7` | 页面内容区块底色 |
| `--vx-fill-3` | `#F5F5F5` | 标签背景、下拉选中背景、页面整体底色 |

### 1.6 辅助色 4 组（全主题共享；阶次：1 浅 / 2 hover / 3 常规 / 4 深色·按下）

| 组 | 浅底 | hover | 常规 | 深色 | 场景 |
|---|---|---|---|---|---|
| 成功 | `#E3F8E8` | `#A8E1A6` | `#00D115` | `#00A611` | 提交确认等成功状态 |
| 警告-弱 | `#FFF1DB` | `#FFD77E` | `#FFA800` | `#EA8C00` | 事件提醒 |
| 错误 | `#FCEBEA` | `#FDA2A4` | `#FF2020` | `#CF2E2E` | 错误提示、警告-按下 |
| 紫（其他/扩展） | `#F5EFFF` | `#D0B0FF` | `#8F44FF` | `#5000C8` | 扩展色 |

### 1.7 帮助色板（随主题变化）

| 主题 | 浅底 | hover | 常规 | 深色 |
|---|---|---|---|---|
| 蓝（青色系） | `#E8F6F9` | `#6EACB4` | `#54A7B2` | `#38929F` |
| 非蓝（蓝色系） | `#ECF3FF` | `#B3CBF4` | `#3773DB` | `#1C5AC4` |

青色系 #E8F6F9/#6EACB4/#54A7B2/#38929F 在非蓝主题下归「其他」（`--vx-other-teal-*`）。

---

## 2. 字体 Typography

### 2.1 字体族

| 类别 | 首选 | 备选 |
|---|---|---|
| 中文 | PingFang SC（Mac/iOS） | Microsoft YaHei 微软雅黑（Windows） |
| 英文 | Helvetica Neue | Arial |
| 数字展示 | D-DIN | HarmonyOS Sans / Inter |

字体栈：`-apple-system, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`。
大数字（KPI/仪表盘）可用 `--vx-font-family-number`。

### 2.2 五级文字层级

| 层级 | 字号/行高 | 使用场景 |
|---|---|---|
| 页面大标题 | 18~24px / 32~40px | 页面顶部标题、重要数据展示 |
| 模块小标题 | 16px / 24~28px | 卡片标题、弹窗标题 |
| 正文（主字号） | 14px / 22px | 表单、表格、按钮、常规段落、左侧导航栏 |
| 辅助说明 | 12~13px / 20px | 提示文字、备注、时间戳 |
| 大段描述 | 14~16px / 24~28px | 帮助文档、详情页说明 |

### 2.3 字重

仅三档：**400 Regular / 500 Medium / 600 Bold**。

---

## 3. 间距 Spacing

### 3.1 基本规则

> **Sn = 4px × n**，S1~S20 = 4→80px。除设计稿明示的输入框纵向 6px 与 0.5~3px 线宽外，
> 不得出现非 4 倍数间距（禁用 5、7、9、10、11、15 等）。

常用：S6=24 / S4=16 / S3=12 / S2=8。

### 3.2 组件级建议

- 组件之间间距：**8px**（S2）
- 输入框内容 padding：**12px**（S3）
- 按钮左右 padding：**16px**（S4）

### 3.3 页面 / 弹窗 / 卡片 / 输入框 Padding（L/R/T/B）

| 区域 | 值 |
|---|---|
| 页面内容 | 24 / 24 / 16 / 24（`--vx-padding-page`） |
| 弹窗 | 24 / 24（T/B 未标注，取 24） |
| 卡片 | 16 / 16 / 16 / 16 |
| 输入框内容 | 12 / 12 / **6 / 6**（CSS `padding: 6px 12px`；6px 为设计稿故意展示的豁免） |

弹窗阴影：`0px 1px 20px 0px rgba(0, 0, 0, 0.08)`（`--vx-shadow-modal`）。

---

## 4. 按钮 Buttons

### 4.1 类型与规则

主要 Primary / 次要 Secondary / 描边 Outline / 危险 Danger / 提示 Prompt / 反白 Whiteline（深色衬底使用）。
主次按钮并排时主要按钮在左。**宽度一律随内容，由 padding 撑开，不固定宽。**

### 4.2 尺寸规格（按人工批注修正）

| 尺寸 | 高度 | padding | 字号/行高 | 圆角 | icon |
|---|---|---|---|---|---|
| Large | 40px | 8px 16px | 16px / 24px | 6px | 12px，gap 4px |
| Middle（默认） | 32px | 6px 16px | 12px / 20px | 6px | 8px，gap 4px |
| Small | 24px | 2px 8px | 12px / 20px | 4px | 8px，gap 4px |

### 4.3 状态矩阵（text / fill / border）

| 按钮 | Normal | Hover | Click | Disabled |
|---|---|---|---|---|
| 主要 | `#FFF` / `#3773DB` / `#3773DB` | `#FFF` / `#568EEE` / `#568EEE` | `#FFF` / `#1C5AC4` / `#1C5AC4` | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 次要 | `#333333` / `#FAFAFA` / `#DEDEDE` | `#568EEE` / `#FFFFFF` / `#568EEE` | `#1C5AC4` / `#FFFFFF` / `#1C5AC4` | 同上 |
| 描边 | `#1F56E8` / `#FFFFFF` / `#3773DB` | `#568EEE` / `#FFFFFF` / `#568EEE` | `#1C5AC4` / `#FFFFFF` / `#1C5AC4` | 同上 |
| 危险 | `#FFF` / `#FF2020` / `#FF2020` | `#FFF` / `#FF5A5D` / `#FF5A5D` | `#FFF` / `#CF2E2E` / `#CF2E2E` | 同上 |
| 提示 | `#FFF` / `#FFA800` / `#FFA800` | `#FFF` / `#FFA800` / `#FFA800` | `#FFF` / `#EA8C00` / `#EA8C00` | 同上 |
| 反白 | `#666666` / `#FAFAFA` / `#DEDEDE` | `#568EEE` / `#FAFAFA` / `#568EEE` | `#1C5AC4` / `#FFFFFF` / `#1C5AC4` | 同上 |

规律：非语义按钮 hover 统一 `#568EEE`（字=边）、click 统一 `#1C5AC4`（字=边）；
危险 hover 例外 `#FF5A5D`（Q1 裁决，旧值 `#FF8A5D` 废弃）；提示 hover 与常规同值 `#FFA800`
（Q8 裁决，旧值 `#FFC24D` 废弃）；Disabled 统一 `#C1C1C1` / `#FAFAFA` / `#DEDEDE`。

> 上表主按钮列为**蓝主题**取值。非蓝主题下，主要按钮 normal/hover/click 自动取该主题主色
> 1/2/3 阶（黄 #FFD400/#FFE355/#F6B41A、紫 #8F44FF/#9660E5/#5000C8、翠青 #54A7B2/#6EACB4/#2A7F8C、
> 红 #D82128/#E85E63/#AA0209、碧青 #406670/#66828A/#325862），disabled 仍为统一灰。

---

## 5. 图标 Icons（模块已取消）

图标模块按业务裁决取消还原与检核，不再提供图标库清单。生成 demo 时如需图标：
内联 24 网格单色 SVG + `currentColor`；按钮内 icon 按 §4.2（12/8/8px，gap 4px）。

---

## 6. 通用交互状态规律

| 态 | 规律 | 值 |
|---|---|---|
| Normal | 主题主色常规 | `--vx-primary`（蓝 `#3773DB`） |
| Hover | 变浅 | 蓝 `#568EEE`（其余主题见 §1.1） |
| Active/Click | 变深 | 蓝 `#1C5AC4` |
| Disabled | 置灰 | 文字 `#C1C1C1` / 底 `#FAFAFA` / 边 `#DEDEDE` |
| 选中底 | 主色浅底 | `--vx-primary-bg`（蓝 `#ECF3FF`） |

边框 hover 梯度：`#DEDEDE → #737373 → #3773DB`（focus）。

---

## 7. 遗留说明

| 项 | 现状 |
|---|---|
| Q2 filling1-2 实际填充 `#F2F3F7` vs 标注 `#F3F4F7` | 以标注 `#F3F4F7` 为准（已冻结） |
| Q3 青色帮助 hover `#A6D2D8` vs `#6EACB4` | 采用 `#6EACB4`（人工裁决） |
| Q5 规范页排版色（#4D5559 等） | 属于规范文档自身排版色，不是产品 token，禁止使用 |
| 翠青 11 级色阶 | 设计稿还原缺失，如需对照原稿补 |
| 绿色主题 | 已删除 |
