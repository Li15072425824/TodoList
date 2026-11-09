# 岚图（Voyah）数字化 UI/UE 设计规范

> **来源**：MasterGo《岚图数字化UI/UE规范》设计稿「全局UI样式标准」页（间距 / 线条 / 图标 / 按钮 / 字体 / 色彩 六个 frame），逐图层提取的标注值，非二次推测。
> **用途**：生成 demo / 原型时的唯一视觉依据。配套 token 见 `assets/tokens.css`（`--vx-*`），组件用法见 `references/components.md`。
> 设计稿链接：https://mastergo.com/file/192726801132881?page_id=M （全局UI样式标准页）

---

## 1. 色彩 Color

### 1.1 品牌主色（B端系统主色序列）

| Token | 值 | 用途 |
|---|---|---|
| `--vx-primary` | `#3773DB` | 主色·常规（按钮、链接、选中态、强调） |
| `--vx-primary-hover` | `#568EEE` | 主色·悬停（变浅） |
| `--vx-primary-active` | `#1C5AC4` | 主色·深色/按下（变深） |
| `--vx-primary-bg` | `#ECF3FF` | 主色·浅色底（选中背景、信息提示底） |

### 1.2 中立色 · 文字（四级 + 禁用）

| 层级 | 值 | Token | 用途 |
|---|---|---|---|
| 页面大标题 | `#111111` | `--vx-text-title` | 页面主标题、重要数据 |
| 默认正文 | `#333333` | `--vx-text-primary` | 正文、按钮文字（次要按钮） |
| 辅助类文字 | `#666666` | `--vx-text-secondary` | 次要说明、反白按钮文字 |
| 提示性文字 | `#999999` | `--vx-text-caption` | 备注、时间戳、占位提示 |
| 禁用/置灰 | `#C1C1C1` | `--vx-text-disabled` | 禁用态文字、置灰 |

特殊情况可使用 `#222` `#444` `#555` `#888` 等过渡灰，但不得使用纯黑 `#000`。

### 1.3 中立色 · 线条（五级，颜色越深可操作性越强）

| 级别 | 值 | Token | 用途 |
|---|---|---|---|
| 一级 | `#EBEBEB` | `--vx-line-1` | 组件边框、分割线（最弱） |
| 二级 | `#DEDEDE` | `--vx-line-2` | 表单边框、次要按钮边框 |
| 三级 | `#888888` | `--vx-line-3` | 可操作元素边框（如输入框 hover 前的提示线） |
| 四级 | `#737373` | `--vx-line-4` | 组件边框 hover（强提示） |
| 五级 | `#3773DB` | `--vx-line-5` | 强调边框（选中/主色描边） |

线宽：实线 `line1` 0.5px / 1px、`line2` 2px、`line3` 3px；另有虚线（dashed，2,2）。常规 UI 用 1px。

### 1.4 中立色 · 填充

| Token | 值 | 用途 |
|---|---|---|
| `--vx-fill-1` | `#FAFAFA` | 提示框底色、禁用按钮底色、次要按钮底色 |
| `--vx-fill-2` | `#F3F4F7` | 页面内容区块底色 |
| `--vx-fill-3` | `#F5F5F5` | 标签背景、下拉选中背景、页面底色 |

### 1.5 语义色板（各 4 级：1浅 2中 3主 4深）

| 语义 | 1 浅底 | 2 中 | 3 主 | 4 深 |
|---|---|---|---|---|
| 成功 success | `#E3F8E8` | `#A8E1A6` | `#00D115` | `#00A611` |
| 警告 warning | `#FFF1DB` | `#FFD77E` | `#FFA800` | `#EA8C00` |
| 错误 error | `#FCEBEA` | `#FDA2A4` | `#FF2020` | `#CF2E2E` |
| 帮助 help | `#E8F6F9` | `#6EACB4` | `#54A7B2` | `#38929F` |
| 紫色 purple | `#F5EFFF` | `#D0B0FF` | `#8F44FF` | `#5000C8` |

对应 token：`--vx-success-bg / -border / 主色本体 / -dark`（warning/error/help/purple 同构）。

---

## 2. 字体 Typography

### 2.1 字体族

| 类别 | 首选 | 备选 |
|---|---|---|
| 中文 | PingFang SC（Mac/iOS 系统） | Microsoft YaHei（Windows 系统） |
| 英文 | Helvetica Neue | Arial |
| 数字展示 | D-DIN | HarmonyOS Sans / Inter |

Web 通用栈：`-apple-system, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`（见 `--vx-font-family`）。大数字展示（KPI、仪表盘）可用 `--vx-font-family-number: "D-DIN", "HarmonyOS Sans", Inter, sans-serif`。

### 2.2 字号 / 行高（文字层级）

| 文字层级 | 字号 | 推荐行高 | 倍数 | 使用场景 |
|---|---|---|---|---|
| 页面大标题 | 18~24px | 32~40px | 1.6~1.7 | 页面顶部标题、重要数据展示 |
| 模块小标题 | 16px | 24~28px | 1.5~1.75 | 卡片标题、弹窗标题 |
| 正文（主字号） | 14px | 22px | 1.57 | 表单、表格、按钮、常规段落、左侧导航栏 |
| 辅助说明 | 12~13px | 20px | 1.5~1.67 | 提示文字、备注、时间戳 |
| 大段描述 | 14~16px | 24~28px | 1.6~1.75 | 帮助文档、详情页说明 |

### 2.3 字重

仅三种：**Regular 400 / Medium 500 / Bold 600**。按钮、气泡等强调文字用 500-600。

---

## 3. 间距 Spacing

### 3.1 基本规则

> **Sn = 4px × n（n 为正整数）**。所有组件的尺寸与距离均取 4 的倍数，避免出现 6、9、11 等非 4 倍数值。
> 相关性越强的元素之间间距越小。

| S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | … | S20 |
|---|---|---|---|---|---|---|---|---|---|
| 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | … | 80 |

**最常用四种：S6(24px)、S4(16px)、S3(12px)、S2(8px)**。

### 3.2 组件级建议

- 组件之间间距：**8px**
- 输入框内容 padding：**12px**
- 按钮左右 padding：**16px**

### 3.3 页面 / 弹窗 Padding

| 区域 | 左 | 右 | 上 | 下 |
|---|---|---|---|---|
| 导航 | 24 | 24 | — | — |
| 页面内容 | 24 | 24 | 16 | 24 |
| 弹窗 | 24 | 24 | — | — |
| 卡片 | 16 | 16 | 16 | 16 |
| 输入框内容 | 12 | 12 | 6 | 6 |

对应 token：`--vx-space-1..8` = 4/8/12/16/20/24/28/32px（语义别名 `--vx-space-xxs..xxl`）。

---

## 4. 按钮 Buttons

### 4.1 类型

主要按钮（Primary）、次要按钮（Secondary）、线框按钮（Outline）、危险操作（Danger）、提示按钮（Prompt）、反白按钮（Whiteline）、文字链接（Text-link，主色/深色两种）、虚线按钮（Dashed）。

> 主要与次要按钮共同出现时，**主要按钮在左侧**。

### 4.2 尺寸

| 尺寸 | 高度 | 左右 padding | 圆角 |
|---|---|---|---|
| Large | 40px | 16px（文字+16px×2） | 6px |
| Middle（默认） | 32px | 16px | 6px |
| Small | 24px | 8px（文字+8px×2） | 4px |

### 4.3 图标+文本按钮

icon 尺寸与字体一致，与文字间隔 4px：

| 尺寸 | icon | icon-右 | 下 | 左右 |
|---|---|---|---|---|
| Large | 12px | 8px | 4px | 16px |
| Middle | 8px | 6px | 4px | 16px |
| Small | 8px | 2px | 4px | 8px |

### 4.4 状态矩阵（Normal / Hover / Click / Disabled）

格式：text 文字色 / fill 填充色 / border 边框色。

| 按钮 | Normal | Hover | Click | Disabled |
|---|---|---|---|---|
| 主要 | `#FFF` / `#3773DB` / — | `#FFF` / `#568EEE` / — | `#FFF` / `#1C5AC4` / — | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 次要 | `#333333` / `#FAFAFA` / `#DEDEDE` | `#568EEE` / 透明 / `#568EEE` | `#1C5AC4` / 透明 / `#1C5AC4` | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 线框 | `#1F56E8` / 透明 / `#3773DB` | `#568EEE` / 透明 / `#568EEE` | `#1C5AC4` / 透明 / `#1C5AC4` | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 危险 | `#FFF` / `#FF2020` / — | `#FFF` / `#FF8A5D` / — | `#FFF` / `#CF2E2E` / — | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 提示 | `#FFF` / `#FFA800` / — | `#FFF` / `#FFA800` / — | `#FFF` / `#EA8C00` / — | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 反白 | `#666666` / `#FAFAFA` / `#DEDEDE` | `#568EEE` / `#FAFAFA` / `#568EEE` | `#1C5AC4` / `#FFF` / `#1C5AC4` | `#C1C1C1` / `#FAFAFA` / `#DEDEDE` |
| 文字链接(主色) | `#3773DB` | `#6691DB` | `#1C5AC4` | `#C1C1C1` |
| 文字链接(深色) | `#333333` | `#6691DB` | `#1C5AC4` | `#C1C1C1` |

规律：**Hover 统一变浅为 `#568EEE` 系（危险例外 `#FF8A5D`，提示不变），Click 统一变深为 `#1C5AC4` 系（危险 `#CF2E2E`，提示 `#EA8C00`），Disabled 统一 `#C1C1C1/#FAFAFA/#DEDEDE`**。文字链接 hover `#6691DB` 是介于常规与 hover 之间的独立值。

---

## 5. 图标 Icons

### 5.1 分类（设计稿「图标」frame）

| 库 | 风格 | 用途 |
|---|---|---|
| **单色图标库** | 24×24 线性描边图标（1~1.5px stroke，`#333333`/currentColor），按语义分组：基础、安全&防护、办公&文档、编辑、系统… | 界面通用图标（导航、按钮、状态、操作） |
| **深浅渐变图标** | 彩色渐变填充，语义命名（零部件采购、报价方案、车辆返修、隐患排查、培训审批、自动化物流、整车制造、质量管控、售后查询、礼遇商城、设备领用、需求提报、数字化营销、网络权限、研发管控、智能驾驶、商标注册、法务合规、公司用印、案件诉讼、授权委托、一卡通、停车位申请、党群工作…） | 业务模块入口、工作台卡片 |
| **抽象性图标** | 几何抽象图形 | 装饰、loading、空状态插画元素 |
| **文件格式图标** | 彩色：pdf / csv / docx / png·jpg / md / ppt / pptx / zip / xlsx / txt / word / rar | 附件、文件列表 |

### 5.2 尺寸规则

- 图标基准尺寸 **24×24px**（单色库全部为 24 网格）
- 按钮内 icon 与字体同尺寸：Large 12px / Middle 8px / Small 8px（见 §4.3）
- 导航/菜单常用 16~20px，列表行内 16px，空状态插画 48~80px

### 5.3 获取方式

1. **设计稿直接导出**：打开 MasterGo 设计稿「全局UI样式标准 → 图标」frame，选中目标图标 → 右侧「导出」面板 → 选 SVG（优先）或 PNG，倍率 2x/4x → 导出图标。图标按中文语义命名（如「停车位申请」「党群工作」），图层树搜索中文名可直接定位。
2. **代码内联**：单色线性图标建议内联 SVG 并用 `currentColor` 继承文字色，便于 hover/禁用变色。
3. 备选开源库：Ant Design Icons（与组件库同源）风格接近，仅当设计稿缺图标时使用，需保持 24 网格、1.5px 线性风格。

---

## 6. 通用交互状态规律

所有可交互元素的态色遵循同一梯度（除语义色按钮外）：

| 态 | 规律 | 值 |
|---|---|---|
| Normal | 主色常规 | `#3773DB` |
| Hover | 变浅 | `#568EEE`（链接 `#6691DB`） |
| Active/Click | 变深 | `#1C5AC4` |
| Disabled | 置灰 | 文字 `#C1C1C1` / 底 `#FAFAFA` / 边 `#DEDEDE` |
| 选中底 | 主色浅底 | `#ECF3FF` |

边框 hover 梯度：`#DEDEDE → #737373 → #3773DB(focus)`。

---

## 7. Token 对照速查（--vx-*）

| Token | 值 | 来源标注 |
|---|---|---|
| `--vx-primary` / `-hover` / `-active` / `-bg` | `#3773DB` / `#568EEE` / `#1C5AC4` / `#ECF3FF` | B端系统主色序列 |
| `--vx-primary-visited`（链接 hover 备用） | `#6691DB` | 文字链接 Hover |
| `--vx-text-title/primary/secondary/caption/disabled` | `#111` / `#333` / `#666` / `#999` / `#C1C1C1` | 字体颜色 5 种 |
| `--vx-line-1/2/3/4/5` | `#EBEBEB` / `#DEDEDE` / `#888888` / `#737373` / `#3773DB` | 线条颜色五级 |
| `--vx-fill-1/2/3` | `#FAFAFA` / `#F3F4F7` / `#F5F5F5` | 填充 |
| `--vx-space-1..8` | 4/8/12/16/20/24/28/32px | Sn=4n |
| `--vx-btn-danger-hover` | `#FF8A5D` | 危险按钮 Hover 填充 |
| `--vx-btn-warning` / `-active` | `#FFA800` / `#EA8C00` | 提示按钮 |
| `--vx-outline-text` | `#1F56E8` | 线框按钮文字色 |
| 控件高度 sm/md/lg | 24/32/40px | 按钮尺寸 |
| 圆角 sm/md/lg | 4/6/8px | 按钮小/大、卡片 |
