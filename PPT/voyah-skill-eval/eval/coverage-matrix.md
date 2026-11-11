# 覆盖矩阵（spec.json → 用例 → 断言）

> 由 `eval/checker/coverage-report.mjs` 自动生成，请勿手改。
> 机器真值：`ground-truth/spec.json`（tag baseline-v4，227 个叶子；蓝视图 142 个 + 6 主题变体）。
> 覆盖率：**227/227 = 100.0%**

## 用例索引

| 用例 | 类型 | 覆盖叶子数 | 文件 |
|---|---|---|---|
| gen-01-form | gen | 20 | `eval/cases/gen/gen-01-form.md` |
| gen-02-aichat | gen | 15 | `eval/cases/gen/gen-02-aichat.md` |
| gen-03-dashboard | gen | 12 | `eval/cases/gen/gen-03-dashboard.md` |
| gen-04-modal | gen | 38 | `eval/cases/gen/gen-04-modal.md` |
| gen-05-alerts | gen | 23 | `eval/cases/gen/gen-05-alerts.md` |
| gen-06-empty-icons | gen | 6 | `eval/cases/gen/gen-06-empty-icons.md` |
| gen-07-list-tags | gen | 9 | `eval/cases/gen/gen-07-list-tags.md` |
| gen-08-dark-whiteline | gen | 7 | `eval/cases/gen/gen-08-dark-whiteline.md` |
| gen-09-longform | gen | 21 | `eval/cases/gen/gen-09-longform.md` |
| gen-10-mixed-density | gen | 44 | `eval/cases/gen/gen-10-mixed-density.md` |
| gen-11-themes | gen | 106 | `eval/cases/gen/gen-11-themes.md` |
| adv-01-red | adversarial | 4 | `eval/cases/adversarial/adv-01-red.md` |
| adv-02-spacing | adversarial | 3 | `eval/cases/adversarial/adv-02-spacing.md` |
| adv-03-tailwind | adversarial | 0 | `eval/cases/adversarial/adv-03-tailwind.md` |
| adv-04-gradient | adversarial | 5 | `eval/cases/adversarial/adv-04-gradient.md` |
| adv-05-semantic | adversarial | 2 | `eval/cases/adversarial/adv-05-semantic.md` |
| adv-06-approx | adversarial | 2 | `eval/cases/adversarial/adv-06-approx.md` |
| kb-01 | knowledge | 8 | `eval/cases/knowledge/kb-01.json` |
| kb-02 | knowledge | 1 | `eval/cases/knowledge/kb-02.json` |
| kb-03 | knowledge | 1 | `eval/cases/knowledge/kb-03.json` |
| kb-04 | knowledge | 1 | `eval/cases/knowledge/kb-04.json` |
| kb-05 | knowledge | 4 | `eval/cases/knowledge/kb-05.json` |
| kb-06 | knowledge | 1 | `eval/cases/knowledge/kb-06.json` |
| kb-07 | knowledge | 1 | `eval/cases/knowledge/kb-07.json` |
| kb-08 | knowledge | 1 | `eval/cases/knowledge/kb-08.json` |
| kb-09 | knowledge | 2 | `eval/cases/knowledge/kb-09.json` |
| kb-10 | knowledge | 3 | `eval/cases/knowledge/kb-10.json` |
| kb-11 | knowledge | 2 | `eval/cases/knowledge/kb-11.json` |
| kb-12 | knowledge | 2 | `eval/cases/knowledge/kb-12.json` |
| kb-13 | knowledge | 3 | `eval/cases/knowledge/kb-13.json` |
| kb-14 | knowledge | 3 | `eval/cases/knowledge/kb-14.json` |
| kb-15 | knowledge | 5 | `eval/cases/knowledge/kb-15.json` |
| kb-16 | knowledge | 2 | `eval/cases/knowledge/kb-16.json` |
| kb-17 | knowledge | 1 | `eval/cases/knowledge/kb-17.json` |
| kb-18 | knowledge | 1 | `eval/cases/knowledge/kb-18.json` |
| kb-19 | knowledge | 6 | `eval/cases/knowledge/kb-19.json` |
| kb-20 | knowledge | 1 | `eval/cases/knowledge/kb-20.json` |
| kb-21 | knowledge | 2 | `eval/cases/knowledge/kb-21.json` |
| kb-22 | knowledge | 1 | `eval/cases/knowledge/kb-22.json` |
| kb-23 | knowledge | 1 | `eval/cases/knowledge/kb-23.json` |
| kb-24 | knowledge | 1 | `eval/cases/knowledge/kb-24.json` |
| kb-25 | knowledge | 6 | `eval/cases/knowledge/kb-25.json` |

## 叶子明细

| spec-id | 组 | 取值/场景 | 冻结状态 | 覆盖用例 | 断言 |
|---|---|---|---|---|---|
| **色彩 — 中立色 · 文字(5 级)** | | | | | |
| `color.text.title` | 中立色 · 文字(5 级) | 标题 | 通过✔ | gen-01-form, gen-03-dashboard, gen-08-dark-whiteline, gen-10-mixed-density | 填色 = #111111（@text-Title） |
| `color.text.primary` | 中立色 · 文字(5 级) | 正文 | 通过✔ | gen-01-form, gen-03-dashboard, gen-09-longform, gen-10-mixed-density | 填色 = #333333（@text-Primary） |
| `color.text.secondary` | 中立色 · 文字(5 级) | 次要文字;默认图形 icon hover(按批注补) | 通过✔ | gen-07-list-tags, gen-10-mixed-density, adv-06-approx | 填色 = #666666（@text-Secondary） |
| `color.text.caption` | 中立色 · 文字(5 级) | 说明文字(辅助说明) | 通过✔ | gen-01-form, gen-03-dashboard, gen-06-empty-icons, gen-10-mixed-density, kb-10 | 填色 = #999999（@text-Caption） |
| `color.text.disable` | 中立色 · 文字(5 级) | 禁用文字;默认图形 icon | 通过✔ | gen-01-form, gen-06-empty-icons, gen-10-mixed-density | 填色 = #C1C1C1（@text-Disable） |
| `color.line.1` | 中立色 · 线条(色页 4 档;line-Blue 随主题变化,见 Q9) | 组件边框、标题分割线(最弱) | 通过✔ | gen-01-form, gen-02-aichat, gen-05-alerts, gen-06-empty-icons, gen-07-list-tags | 填色 = #EBEBEB（@line1-1） |
| `color.line.2` | 中立色 · 线条(色页 4 档;line-Blue 随主题变化,见 Q9) | 表单边框 | 通过✔ | gen-01-form, gen-02-aichat, kb-09 | 填色 = #DEDEDE（@line1-2） |
| `color.line.4` | 中立色 · 线条(色页 4 档;line-Blue 随主题变化,见 Q9) | 组件边框 Hover 效果 | 通过✔ | gen-01-form, kb-09 | 填色 = #737373（@line1-4） |
| `color.line.blue` | 中立色 · 线条(色页 4 档;line-Blue 随主题变化,见 Q9) | 较重要程度 / 高层级、可操作提示(最强) | 通过✔ | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue） |
| `color.fill.1` | 中立色 · 填充(3 级,语义已按批注修正) | 提示框底色、提示文字背景 | 通过✔ | gen-01-form, gen-07-list-tags, kb-08 | 填色 = #FAFAFA（@filling1-1） |
| `color.fill.2` | 中立色 · 填充(3 级,语义已按批注修正) | 页面内容区块底色(按批注修正;黄色页同) | 通过✔ | gen-07-list-tags, kb-06 | 填色 = #F3F4F7（@filling1-2） |
| `color.fill.3` | 中立色 · 填充(3 级,语义已按批注修正) | 标签背景、下拉选中背景(按批注修正;黄色页同) | 通过✔ | gen-02-aichat, gen-03-dashboard, gen-07-list-tags, kb-07 | 填色 = #F5F5F5（@filling1-3） |
| `color.aux.success.1` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 提交确认等成功状态 | 通过✔ | gen-05-alerts | 填色 = #E3F8E8（成功-1 浅色） |
| `color.aux.success.2` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 提交确认等成功状态 | 通过✔ | gen-05-alerts | 填色 = #A8E1A6（成功-2 hover） |
| `color.aux.success.3` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 提交确认等成功状态 | 通过✔ | gen-05-alerts, adv-05-semantic | 填色 = #00D115（成功-3 常规） |
| `color.aux.success.4` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 提交确认等成功状态 | 通过✔ | gen-05-alerts | 填色 = #00A611（成功-4 深色/按下） |
| `color.aux.warn.1` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 事件提醒 | 通过✔ | gen-05-alerts, gen-07-list-tags | 填色 = #FFF1DB（警告-弱(提醒)-1 浅色） |
| `color.aux.warn.2` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 事件提醒 | 通过✔ | gen-05-alerts | 填色 = #FFD77E（警告-弱(提醒)-2 hover） |
| `color.aux.warn.3` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 事件提醒 | 通过✔ | gen-05-alerts, gen-07-list-tags | 填色 = #FFA800（警告-弱(提醒)-3 常规） |
| `color.aux.warn.4` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 事件提醒 | 通过✔ | gen-05-alerts | 填色 = #EA8C00（警告-弱(提醒)-4 深色/按下） |
| `color.aux.error.1` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 错误提示、警告-按下 | 通过✔ | gen-05-alerts | 填色 = #FCEBEA（错误(警告-强)-1 浅色） |
| `color.aux.error.2` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 错误提示、警告-按下 | 通过✔ | gen-05-alerts | 填色 = #FDA2A4（错误(警告-强)-2 hover） |
| `color.aux.error.3` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 错误提示、警告-按下 | 通过✔ | gen-03-dashboard, gen-05-alerts, adv-05-semantic | 填色 = #FF2020（错误(警告-强)-3 常规） |
| `color.aux.error.4` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 错误提示、警告-按下 | 通过✔ | gen-05-alerts | 填色 = #CF2E2E（错误(警告-强)-4 深色/按下） |
| `color.aux.purple.1` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 扩展色 | 通过✔ | gen-05-alerts | 填色 = #F5EFFF（紫(其他/扩展)-1 浅色） |
| `color.aux.purple.2` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 扩展色 | 通过✔ | gen-05-alerts | 填色 = #D0B0FF（紫(其他/扩展)-2 hover） |
| `color.aux.purple.3` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 扩展色 | 通过✔ | gen-05-alerts | 填色 = #8F44FF（紫(其他/扩展)-3 常规） |
| `color.aux.purple.4` | 辅助色 · 全主题共享(4 组 × 4 阶:浅 / hover / 常规 / 深色·按下) | 扩展色 | 通过✔ | gen-05-alerts | 填色 = #5000C8（紫(其他/扩展)-4 深色/按下） |
| **线条 — 线宽 × 实线** | | | | | |
| `line.width.0.5.solid` | 线宽 × 实线 | 最细分隔(浅色场景) | 通过✔ | gen-09-longform | 线宽 0.5pxpx solid |
| `line.width.1.solid` | 线宽 × 实线 | 标准边框/分割线(默认) | 通过✔ | gen-09-longform | 线宽 1pxpx solid |
| `line.width.2.solid` | 线宽 × 实线 | 强调分割 | 通过✔ | gen-09-longform | 线宽 2pxpx solid |
| `line.width.3.solid` | 线宽 × 实线 | 最强分割/选中指示 | 通过✔ | gen-09-longform | 线宽 3pxpx solid |
| `line.width.0.5.dashed` | 线宽 × 虚线 | 弱提示性分隔 | 通过✔ | gen-09-longform | 线宽 0.5pxpx dashed |
| `line.width.1.dashed` | 线宽 × 虚线 | 拖放区/占位边界等 | 通过✔ | gen-09-longform | 线宽 1pxpx dashed |
| `line.width.2.dashed` | 线宽 × 虚线 | 强调虚线 | 通过✔ | gen-09-longform | 线宽 2pxpx dashed |
| `line.width.3.dashed` | 线宽 × 虚线 | 最强虚线 | 通过✔ | gen-09-longform | 线宽 3pxpx dashed |
| `line.color.1` | 分割线颜色 5 级(1px 实线示例) | 组件边框、标题分割线 | 通过✔ | gen-01-form, gen-09-longform | 线宽 1pxpx solid |
| `line.color.2` | 分割线颜色 5 级(1px 实线示例) | 表单边框 | 通过✔ | gen-01-form, gen-09-longform | 线宽 1pxpx solid |
| `line.color.3` | 分割线颜色 5 级(1px 实线示例) | 默认图形 icon | 通过✔ | gen-01-form, gen-09-longform | 线宽 1pxpx solid |
| `line.color.4` | 分割线颜色 5 级(1px 实线示例) | 组件边框 Hover | 通过✔ | gen-01-form, gen-09-longform | 线宽 1pxpx solid |
| `line.color.5` | 分割线颜色 5 级(1px 实线示例) | 较重要/高层级可操作提示 | 通过✔ | gen-09-longform, kb-01 | 线宽 1pxpx solid |
| `line.divider.h` | 文字分割线 | 标题下方水平短线 | 通过✔ | gen-09-longform | 分割线 {"type":"divider","kind":"horizontal","raw":"74px × 1px #DEDEDE"} |
| `line.divider.v` | 文字分割线 | 相邻操作之间垂直短线 | 通过✔ | gen-09-longform | 分割线 {"type":"divider","kind":"vertical","raw":"1px × 12px #DEDEDE"} |
| **字体 — 字体族** | | | | | |
| `font.family.cn` | 字体族 | 全部中文文本(按批注补 Windows 默认字体) | 通过✔ | kb-13 | 字体  / w |
| `font.family.en` | 字体族 | 英文文本 | 通过✔ | kb-13 | 字体  / w |
| `font.family.num` | 字体族 | 数字展示(数据看板/指标) | 通过✔ | gen-03-dashboard, kb-13 | 字体  / w |
| `font.weight.400` | 字重(仅三档) | 正文默认字重 | 通过✔ | gen-10-mixed-density, adv-04-gradient, kb-14 | 字体  / w |
| `font.weight.500` | 字重(仅三档) | 小标题/按钮/强调 | 通过✔ | gen-10-mixed-density, adv-04-gradient, kb-14 | 字体  / w |
| `font.weight.600` | 字重(仅三档) | 页面大标题/数字强调 | 通过✔ | gen-10-mixed-density, adv-04-gradient, kb-14 | 字体  / w |
| `font.level.page-title` | 五级文字层级(真实例句 + 使用场景) | 页面顶部标题、重要数据展示 | 通过✔ | gen-01-form, gen-03-dashboard, gen-08-dark-whiteline, gen-09-longform, gen-10-mixed-density, kb-11 | 字体  / w |
| `font.level.module-title` | 五级文字层级(真实例句 + 使用场景) | 卡片标题、弹窗标题 | 通过✔ | gen-04-modal, gen-09-longform, gen-10-mixed-density | 字体  / w |
| `font.level.body` | 五级文字层级(真实例句 + 使用场景) | 表单、表格、按钮、常规段落、左侧导航栏 | 通过✔ | gen-01-form, gen-02-aichat, gen-03-dashboard, gen-04-modal, gen-05-alerts, gen-07-list-tags, gen-10-mixed-density, kb-12 | 字体  / w |
| `font.level.caption` | 五级文字层级(真实例句 + 使用场景) | 提示文字、备注、时间戳 | 通过✔ | gen-01-form, gen-02-aichat, gen-03-dashboard, gen-05-alerts, gen-06-empty-icons, gen-07-list-tags, gen-09-longform, gen-10-mixed-density, kb-10 | 字体  / w |
| `font.level.longform` | 五级文字层级(真实例句 + 使用场景) | 帮助文档、详情页说明 | 通过✔ | gen-09-longform, gen-10-mixed-density | 字体  / w |
| `font.color.page-title` | 字体颜色 → 场景映射 | 页面大标题 | 通过✔ | gen-03-dashboard, gen-10-mixed-density, kb-11 | 填色 = #111111（#111111 → 页面大标题） |
| `font.color.body` | 字体颜色 → 场景映射 | 默认正文文字 | 通过✔ | gen-10-mixed-density, kb-12 | 填色 = #333333（#333333 → 默认正文） |
| `font.color.aux` | 字体颜色 → 场景映射 | 辅助类文字 | 通过✔ | gen-10-mixed-density | 填色 = #666666（#666666 → 辅助类文字） |
| `font.color.hint` | 字体颜色 → 场景映射 | 提示性文字 | 通过✔ | gen-10-mixed-density, kb-10 | 填色 = #999999（#999999 → 提示性文字） |
| `font.color.disable` | 字体颜色 → 场景映射 | 禁用 / 置灰 | 通过✔ | gen-10-mixed-density | 填色 = #C1C1C1（#C1C1C1 → 禁用/置灰） |
| `font.color.special` | 字体颜色 → 场景映射 | 特殊情况允许使用(设计稿原文注明) | 通过✔ | gen-10-mixed-density | 字体  / w |
| **按钮 — 3 尺寸规格(按批注修正:宽度不固定,padding 撑开)** | | | | | |
| `button.size.large` | 3 尺寸规格(按批注修正:宽度不固定,padding 撑开) | 页面主操作 | 通过✔ | gen-04-modal, kb-19 | h undefinedpx · padding undefined · 字号/行高 undefined · 圆角 undefinedpx |
| `button.size.middle` | 3 尺寸规格(按批注修正:宽度不固定,padding 撑开) | 常规场景默认 | 通过✔ | gen-04-modal, kb-19 | h undefinedpx · padding undefined · 字号/行高 undefined · 圆角 undefinedpx |
| `button.size.small` | 3 尺寸规格(按批注修正:宽度不固定,padding 撑开) | 紧凑场景 | 通过✔ | gen-04-modal, kb-19 | h undefinedpx · padding undefined · 字号/行高 undefined · 圆角 undefinedpx |
| `button.variant.icon-large` | icon + 文本变体(按批注:icon 12/8/8px,与文字 gap 4px) | 图标+文本 Large | 通过✔ | gen-04-modal, kb-19 | icon 12×12 · gap 4px |
| `button.variant.icon-middle` | icon + 文本变体(按批注:icon 12/8/8px,与文字 gap 4px) | 图标+文本 Middle | 通过✔ | gen-04-modal, kb-19 | icon 8×8 · gap 4px |
| `button.variant.icon-small` | icon + 文本变体(按批注:icon 12/8/8px,与文字 gap 4px) | 图标+文本 Small | 通过✔ | gen-04-modal, kb-19 | icon 8×8 · gap 4px |
| `button.primary.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 主要 Primary按钮 Normal 态 | 通过✔ | gen-01-form, gen-02-aichat, gen-04-modal, gen-06-empty-icons, adv-04-gradient | text/fill/border = #fff / #3773DB / #3773DB |
| `button.primary.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 主要 Primary按钮 Hover 态 | 通过✔ | gen-04-modal | text/fill/border = #fff / #568EEE / #568EEE |
| `button.primary.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 主要 Primary按钮 Click 态 | 通过✔ | gen-04-modal | text/fill/border = #fff / #1C5AC4 / #1C5AC4 |
| `button.primary.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 主要 Primary按钮 Disabled 态 | 通过✔ | gen-04-modal, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| `button.secondary.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 次要 Secondary按钮 Normal 态 | 通过✔ | gen-01-form, gen-02-aichat, gen-04-modal, gen-06-empty-icons | text/fill/border = #333333 / #FAFAFA / #DEDEDE |
| `button.secondary.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 次要 Secondary按钮 Hover 态 ✎ 按批注修正:字色=边色 #568EEE(Q7 已裁决),待复核 | 裁决✘ | gen-04-modal, kb-22 | text/fill/border = #568EEE / #FFFFFF / #568EEE |
| `button.secondary.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 次要 Secondary按钮 Click 态 ✎ 按批注修正:字色=边色 #1C5AC4,fill #FFF,待复核 | 裁决✘ | gen-04-modal, kb-23 | text/fill/border = #1C5AC4 / #FFFFFF / #1C5AC4 |
| `button.secondary.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 次要 Secondary按钮 Disabled 态 | 通过✔ | gen-04-modal, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| `button.outline.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 描边 Outline按钮 Normal 态 | 通过✔ | gen-04-modal | text/fill/border = #1F56E8 / #fff / #3773DB |
| `button.outline.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 描边 Outline按钮 Hover 态 ✎ 按批注修正:字色=边色 #568EEE(Q7 已裁决),待复核 | 裁决✘ | gen-04-modal | text/fill/border = #568EEE / #fff / #568EEE |
| `button.outline.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 描边 Outline按钮 Click 态 ✎ 按批注修正:字色=边色 #1C5AC4,fill #FFF,待复核 | 裁决✘ | gen-04-modal | text/fill/border = #1C5AC4 / #fff / #1C5AC4 |
| `button.outline.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 描边 Outline按钮 Disabled 态 | 通过✔ | gen-04-modal, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| `button.danger.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 危险 Danger按钮 Normal 态 | 通过✔ | gen-04-modal | text/fill/border = #fff / #FF2020 / #FF2020 |
| `button.danger.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 危险 Danger按钮 Hover 态 ⚠ Q1 已裁决 #FF5A5D | 通过✔ | gen-04-modal, kb-20 | text/fill/border = #fff / #FF5A5D / #FF5A5D |
| `button.danger.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 危险 Danger按钮 Click 态 | 通过✔ | gen-04-modal | text/fill/border = #fff / #CF2E2E / #CF2E2E |
| `button.danger.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 危险 Danger按钮 Disabled 态 | 通过✔ | gen-04-modal, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| `button.prompt.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 提示 Prompt按钮 Normal 态 | 通过✔ | gen-04-modal, kb-21 | text/fill/border = #fff / #FFA800 / #FFA800 |
| `button.prompt.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 提示 Prompt按钮 Hover 态 ✎ Q8 已裁决:hover=#FFA800(标注值优先,#FFC24D 废弃),待复核 | 裁决✘ | gen-04-modal, kb-21 | text/fill/border = #fff / #FFA800 / #FFA800 |
| `button.prompt.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 提示 Prompt按钮 Click 态 | 通过✔ | gen-04-modal | text/fill/border = #fff / #EA8C00 / #EA8C00 |
| `button.prompt.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 提示 Prompt按钮 Disabled 态 | 通过✔ | gen-04-modal, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| `button.whiteline.normal` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 反白 Whiteline(深底)按钮 Normal 态 | 裁决✘ | gen-04-modal, gen-08-dark-whiteline, kb-24 | text/fill/border = #666666 / #FAFAFA / #DEDEDE |
| `button.whiteline.hover` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 反白 Whiteline(深底)按钮 Hover 态 ✎ 按批注修正:字色=边色 #568EEE(Q7 已裁决),待复核 | 裁决✘ | gen-04-modal, gen-08-dark-whiteline | text/fill/border = #568EEE / #FAFAFA / #568EEE |
| `button.whiteline.click` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 反白 Whiteline(深底)按钮 Click 态 ✎ 按批注修正:字色=边色 #1C5AC4,fill #FFF,待复核 | 裁决✘ | gen-04-modal, gen-08-dark-whiteline | text/fill/border = #1C5AC4 / #FFFFFF / #1C5AC4 |
| `button.whiteline.disabled` | 6 类型 × 4 态矩阵(Middle 规格;上轮渲染与 UI 稿差距大,已按新规格重做,全部重置为未填写待复检) | 反白 Whiteline(深底)按钮 Disabled 态 | 通过✔ | gen-04-modal, gen-08-dark-whiteline, kb-25 | text/fill/border = #C1C1C1 / #FAFAFA / #DEDEDE |
| **间距 — 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距)** | | | | | |
| `spacing.s1` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 1 档 | 通过✔ | gen-10-mixed-density | 4px |
| `spacing.s2` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 2 档 | 通过✔ | gen-10-mixed-density, kb-15 | 8px |
| `spacing.s3` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 3 档 | 通过✔ | gen-10-mixed-density | 12px |
| `spacing.s4` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 4 档 | 通过✔ | gen-10-mixed-density | 16px |
| `spacing.s5` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 5 档 | 通过✔ | gen-10-mixed-density | 20px |
| `spacing.s6` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 6 档 | 通过✔ | gen-10-mixed-density, adv-02-spacing, kb-15 | 24px |
| `spacing.s7` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 7 档 | 通过✔ | gen-10-mixed-density | 28px |
| `spacing.s8` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 8 档 | 通过✔ | gen-10-mixed-density | 32px |
| `spacing.s9` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 9 档 | 通过✔ | gen-10-mixed-density | 36px |
| `spacing.s10` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 10 档 | 通过✔ | gen-10-mixed-density | 40px |
| `spacing.s11` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 11 档 | 通过✔ | gen-10-mixed-density | 44px |
| `spacing.s12` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 12 档 | 通过✔ | gen-10-mixed-density | 48px |
| `spacing.s13` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 13 档 | 通过✔ | gen-10-mixed-density | 52px |
| `spacing.s14` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 14 档 | 通过✔ | gen-10-mixed-density | 56px |
| `spacing.s15` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 15 档 | 通过✔ | gen-10-mixed-density | 60px |
| `spacing.s16` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 16 档 | 通过✔ | gen-10-mixed-density | 64px |
| `spacing.s17` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 17 档 | 通过✔ | gen-10-mixed-density | 68px |
| `spacing.s18` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 18 档 | 通过✔ | gen-10-mixed-density | 72px |
| `spacing.s19` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 19 档 | 通过✔ | gen-10-mixed-density | 76px |
| `spacing.s20` | 间距梯度 S1~S20(Sn = 4×n,即 4px→80px;红色标尺即实际间距) | 间距梯度第 20 档 | 通过✔ | gen-10-mixed-density | 80px |
| `spacing.common.s6` | 常用尺寸(按元素亲密性取值) | 最常用组件间距 | 通过✔ | gen-02-aichat, gen-10-mixed-density, kb-15 | 24px |
| `spacing.common.s4` | 常用尺寸(按元素亲密性取值) | 区块间较大间距 | 通过✔ | gen-02-aichat, gen-10-mixed-density, adv-02-spacing | 16px |
| `spacing.common.s3` | 常用尺寸(按元素亲密性取值) | 输入框内容 padding 等 | 通过✔ | gen-02-aichat, gen-10-mixed-density | 12px |
| `spacing.common.s2` | 常用尺寸(按元素亲密性取值) | 紧凑元素间距(图标与文字等) | 通过✔ | gen-02-aichat, gen-10-mixed-density, kb-15 | 8px |
| `spacing.rule.component` | 建议值(设计稿原文) | 组件之间统一用 8px(S2) | 通过✔ | adv-02-spacing, kb-15 | 8px |
| `spacing.rule.input` | 建议值(设计稿原文) | 输入框内容与边框间距(S3) | 通过✔ | gen-01-form, kb-16 | 12px |
| `spacing.rule.button` | 建议值(设计稿原文) | 按钮内文字左右留白(S4;与按钮批注 padding 16px 一致) | 通过✔ | gen-04-modal | 16px |
| `spacing.padding.page` | 页面/弹窗/卡片/输入框 Padding(L/R/T/B,渲染为示意框) | 页面级容器内边距 | 通过✔ | gen-01-form, gen-03-dashboard, gen-08-dark-whiteline, gen-09-longform, kb-17 | L24 R24 T16 B24 |
| `spacing.padding.modal` | 页面/弹窗/卡片/输入框 Padding(L/R/T/B,渲染为示意框) | 弹窗内容内边距 | 通过✔ | gen-04-modal | L24 R24(T/B 未标注) |
| `spacing.padding.card` | 页面/弹窗/卡片/输入框 Padding(L/R/T/B,渲染为示意框) | 卡片内边距 | 通过✔ | gen-01-form, gen-03-dashboard | 16 × 4 边 |
| `spacing.padding.input` | 页面/弹窗/卡片/输入框 Padding(L/R/T/B,渲染为示意框) | ⚠ 6px 为设计稿故意展示的非 4 倍数豁免示例 | 通过✔ | kb-16 | L12 R12 T6 B6 |
| `spacing.shadow.modal` | 其他 | 弹窗投影 | 通过✔ | gen-04-modal, gen-10-mixed-density, adv-04-gradient, kb-18 | box-shadow {"type":"shadow","shadow":"0px 1px 20px 0px rgba(0,0,0,0.08)"} |
| **色彩 — 帮助色板(当前主题:蓝 → 青色系帮助(=翠青主色同值))** | | | | | |
| `color.aux.help-teal.1` | 帮助色板(当前主题:蓝 → 青色系帮助(=翠青主色同值)) | 蓝 主题帮助色 1 浅色 | 通过✔ | gen-05-alerts, gen-11-themes | 填色 = #E8F6F9（帮助-1 浅色） |
| `color.aux.help-teal.2` | 帮助色板(当前主题:蓝 → 青色系帮助(=翠青主色同值)) | 蓝 主题帮助色 2 hover ⚠ Q3 色块实际填充 #A6D2D8,标注 #6EACB4(按批注采用标注值) | 裁决·未填 | gen-05-alerts, gen-11-themes, kb-04 | 填色 = #6EACB4（帮助-2 hover） |
| `color.aux.help-teal.3` | 帮助色板(当前主题:蓝 → 青色系帮助(=翠青主色同值)) | 蓝 主题帮助色 3 常规 | 通过✔ | gen-05-alerts, gen-11-themes, kb-02 | 填色 = #54A7B2（帮助-3 常规） |
| `color.aux.help-teal.4` | 帮助色板(当前主题:蓝 → 青色系帮助(=翠青主色同值)) | 蓝 主题帮助色 4 深色/按下 | 裁决·未填 | gen-05-alerts, gen-11-themes | 填色 = #38929F（帮助-4 深色/按下） |
| `color.theme.blue.1` | 主题主色序列(当前:蓝) | 主题「蓝」主色 常规 态 | 通过✔ | gen-02-aichat, gen-04-modal, gen-11-themes, adv-01-red, adv-06-approx | 填色 = #3773DB（蓝-常规） |
| `color.theme.blue.2` | 主题主色序列(当前:蓝) | 主题「蓝」主色 hover 态 | 通过✔ | gen-02-aichat, gen-04-modal, gen-11-themes, adv-01-red | 填色 = #568EEE（蓝-hover） |
| `color.theme.blue.3` | 主题主色序列(当前:蓝) | 主题「蓝」主色 深色/按下 态 | 通过✔ | gen-02-aichat, gen-04-modal, gen-11-themes, adv-01-red | 填色 = #1C5AC4（蓝-深色/按下） |
| `color.theme.blue.4` | 主题主色序列(当前:蓝) | 主题「蓝」主色 浅色 态 | 通过✔ | gen-02-aichat, gen-11-themes, adv-01-red | 填色 = #ECF3FF（蓝-浅色） |
| `color.theme.blue.ladder.1` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 1 级 | 裁决·未填 | gen-11-themes | 填色 = #CBDBF7（色阶 1） |
| `color.theme.blue.ladder.2` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 2 级 | 裁决·未填 | gen-11-themes | 填色 = #B3CBF4（色阶 2） |
| `color.theme.blue.ladder.3` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 3 级 | 裁决·未填 | gen-11-themes | 填色 = #9EBCF0（色阶 3） |
| `color.theme.blue.ladder.4` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 4 级 | 裁决·未填 | gen-11-themes | 填色 = #7CA5ED（色阶 4） |
| `color.theme.blue.ladder.5` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 5 级 | 裁决·未填 | gen-11-themes | 填色 = #6090E2（色阶 5） |
| `color.theme.blue.ladder.6` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 6 级 | 裁决·未填 | gen-11-themes | 填色 = #3773DB（色阶 6） |
| `color.theme.blue.ladder.7` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 7 级 | 裁决·未填 | gen-11-themes | 填色 = #2662CA（色阶 7） |
| `color.theme.blue.ladder.8` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 8 级 | 裁决·未填 | gen-11-themes | 填色 = #1B56BC（色阶 8） |
| `color.theme.blue.ladder.9` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 9 级 | 裁决·未填 | gen-11-themes | 填色 = #2553A5（色阶 9） |
| `color.theme.blue.ladder.10` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 10 级 | 裁决·未填 | gen-11-themes | 填色 = #1C4692（色阶 10） |
| `color.theme.blue.ladder.11` | 主色调色阶(当前:蓝,11 级) | 蓝 主色调色阶第 11 级 | 裁决·未填 | gen-11-themes | 填色 = #133A81（色阶 11） |
| `color.theme.blue.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决·未填 | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
| `color.aux.help-blue.1` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题帮助色 1 浅色 | 通过✔ | gen-11-themes | 填色 = #ECF3FF（帮助-1 浅色） |
| `color.aux.help-blue.2` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题帮助色 2 hover | 通过✔ | gen-11-themes | 填色 = #B3CBF4（帮助-2 hover） |
| `color.aux.help-blue.3` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题帮助色 3 常规 | 通过✔ | gen-11-themes, kb-03 | 填色 = #3773DB（帮助-3 常规） |
| `color.aux.help-blue.4` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题帮助色 4 深色/按下 | 通过✔ | gen-11-themes | 填色 = #1C5AC4（帮助-4 深色/按下） |
| `color.aux.other-teal.yellow.1` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes, kb-05 | 填色 = #E8F6F9（其他(青色系)-1 浅色） |
| `color.aux.other-teal.yellow.2` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes, kb-05 | 填色 = #6EACB4（其他(青色系)-2 hover） |
| `color.aux.other-teal.yellow.3` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes, kb-05 | 填色 = #54A7B2（其他(青色系)-3 常规） |
| `color.aux.other-teal.yellow.4` | 帮助色板(当前主题:黄 → 蓝色系帮助) | 黄 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes, kb-05 | 填色 = #38929F（其他(青色系)-4 深色/按下） |
| `color.theme.yellow.1` | 主题主色序列(当前:黄) | 主题「黄」主色 常规 态 | 通过✔ | gen-11-themes | 填色 = #FFD400（黄-常规） |
| `color.theme.yellow.2` | 主题主色序列(当前:黄) | 主题「黄」主色 hover 态 | 通过✔ | gen-11-themes | 填色 = #FFE355（黄-hover） |
| `color.theme.yellow.3` | 主题主色序列(当前:黄) | 主题「黄」主色 深色/按下 态 | 通过✔ | gen-11-themes | 填色 = #F6B41A（黄-深色/按下） |
| `color.theme.yellow.4` | 主题主色序列(当前:黄) | 主题「黄」主色 浅色 态 | 通过✔ | gen-11-themes | 填色 = #FFF3B6（黄-浅色） |
| `color.theme.yellow.ladder.1` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 1 级 | 裁决·未填 | gen-11-themes | 填色 = #FFF4BC（色阶 1） |
| `color.theme.yellow.ladder.2` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 2 级 | 裁决·未填 | gen-11-themes | 填色 = #FFEFA1（色阶 2） |
| `color.theme.yellow.ladder.3` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 3 级 | 裁决·未填 | gen-11-themes | 填色 = #FFE876（色阶 3） |
| `color.theme.yellow.ladder.4` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 4 级 | 裁决·未填 | gen-11-themes | 填色 = #FFE14A（色阶 4） |
| `color.theme.yellow.ladder.5` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 5 级 | 裁决·未填 | gen-11-themes | 填色 = #FFD500（色阶 5） |
| `color.theme.yellow.ladder.6` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 6 级 | 裁决·未填 | gen-11-themes | 填色 = #FFC300（色阶 6） |
| `color.theme.yellow.ladder.7` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 7 级 | 裁决·未填 | gen-11-themes | 填色 = #F6B41A（色阶 7） |
| `color.theme.yellow.ladder.8` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 8 级 | 裁决·未填 | gen-11-themes | 填色 = #EBAA11（色阶 8） |
| `color.theme.yellow.ladder.9` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 9 级 | 裁决·未填 | gen-11-themes | 填色 = #E19E04（色阶 9） |
| `color.theme.yellow.ladder.10` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 10 级 | 裁决·未填 | gen-11-themes | 填色 = #D19300（色阶 10） |
| `color.theme.yellow.ladder.11` | 主色调色阶(当前:黄,11 级) | 黄 主色调色阶第 11 级 | 裁决·未填 | gen-11-themes | 填色 = #C58A00（色阶 11） |
| `color.theme.yellow.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决·未填 | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
| `color.aux.other-teal.purple.1` | 帮助色板(当前主题:紫 → 蓝色系帮助) | 紫 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #E8F6F9（其他(青色系)-1 浅色） |
| `color.aux.other-teal.purple.2` | 帮助色板(当前主题:紫 → 蓝色系帮助) | 紫 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #6EACB4（其他(青色系)-2 hover） |
| `color.aux.other-teal.purple.3` | 帮助色板(当前主题:紫 → 蓝色系帮助) | 紫 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #54A7B2（其他(青色系)-3 常规） |
| `color.aux.other-teal.purple.4` | 帮助色板(当前主题:紫 → 蓝色系帮助) | 紫 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #38929F（其他(青色系)-4 深色/按下） |
| `color.theme.purple.1` | 主题主色序列(当前:紫) | 主题「紫」主色 常规 态 | 通过✔ | gen-11-themes | 填色 = #8F44FF（紫-常规） |
| `color.theme.purple.2` | 主题主色序列(当前:紫) | 主题「紫」主色 hover 态 | 通过✔ | gen-11-themes | 填色 = #9660E5（紫-hover） |
| `color.theme.purple.3` | 主题主色序列(当前:紫) | 主题「紫」主色 深色/按下 态 | 通过✔ | gen-11-themes | 填色 = #5000C8（紫-深色/按下） |
| `color.theme.purple.4` | 主题主色序列(当前:紫) | 主题「紫」主色 浅色 态 | 通过✔ | gen-11-themes | 填色 = #F5EFFF（紫-浅色） |
| `color.theme.purple.ladder.1` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 1 级 | 裁决·未填 | gen-11-themes | 填色 = #F5EFFF（色阶 1） |
| `color.theme.purple.ladder.2` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 2 级 | 裁决·未填 | gen-11-themes | 填色 = #E9DAFF（色阶 2） |
| `color.theme.purple.ladder.3` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 3 级 | 裁决·未填 | gen-11-themes | 填色 = #CDADFC（色阶 3） |
| `color.theme.purple.ladder.4` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 4 级 | 裁决·未填 | gen-11-themes | 填色 = #B481FF（色阶 4） |
| `color.theme.purple.ladder.5` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 5 级 | 裁决·未填 | gen-11-themes | 填色 = #9E5FFC（色阶 5） |
| `color.theme.purple.ladder.6` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 6 级 | 裁决·未填 | gen-11-themes | 填色 = #8F44FF（色阶 6） |
| `color.theme.purple.ladder.7` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 7 级 | 裁决·未填 | gen-11-themes | 填色 = #7F2AFF（色阶 7） |
| `color.theme.purple.ladder.8` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 8 级 | 裁决·未填 | gen-11-themes | 填色 = #7315FF（色阶 8） |
| `color.theme.purple.ladder.9` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 9 级 | 裁决·未填 | gen-11-themes | 填色 = #5F02E8（色阶 9） |
| `color.theme.purple.ladder.10` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 10 级 | 裁决·未填 | gen-11-themes | 填色 = #5000C8（色阶 10） |
| `color.theme.purple.ladder.11` | 主色调色阶(当前:紫,11 级) | 紫 主色调色阶第 11 级 | 裁决·未填 | gen-11-themes | 填色 = #4200A5（色阶 11） |
| `color.theme.purple.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决·未填 | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
| `color.theme.cuiqing.1` | 主题主色序列(当前:翠青) | 主题「翠青」主色 常规 态 | 通过✔ | gen-11-themes | 填色 = #54A7B2（翠青-常规） |
| `color.theme.cuiqing.2` | 主题主色序列(当前:翠青) | 主题「翠青」主色 hover 态 | 通过✔ | gen-11-themes | 填色 = #6EACB4（翠青-hover） |
| `color.theme.cuiqing.3` | 主题主色序列(当前:翠青) | 主题「翠青」主色 深色/按下 态 | 通过✔ | gen-11-themes | 填色 = #2A7F8C（翠青-深色/按下） |
| `color.theme.cuiqing.4` | 主题主色序列(当前:翠青) | 主题「翠青」主色 浅色 态 | 通过✔ | gen-11-themes | 填色 = #E8F6F9（翠青-浅色） |
| `color.theme.cuiqing.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决·未填 | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
| `color.aux.other-teal.red.1` | 帮助色板(当前主题:红 → 蓝色系帮助) | 红 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #E8F6F9（其他(青色系)-1 浅色） |
| `color.aux.other-teal.red.2` | 帮助色板(当前主题:红 → 蓝色系帮助) | 红 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #6EACB4（其他(青色系)-2 hover） |
| `color.aux.other-teal.red.3` | 帮助色板(当前主题:红 → 蓝色系帮助) | 红 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #54A7B2（其他(青色系)-3 常规） |
| `color.aux.other-teal.red.4` | 帮助色板(当前主题:红 → 蓝色系帮助) | 红 主题下的其他/扩展色(青色系) | 裁决·未填 | gen-11-themes | 填色 = #38929F（其他(青色系)-4 深色/按下） |
| `color.theme.red.1` | 主题主色序列(当前:红) | 主题「红」主色 常规 态 | 通过✔ | gen-11-themes | 填色 = #D82128（红-常规） |
| `color.theme.red.2` | 主题主色序列(当前:红) | 主题「红」主色 hover 态 | 通过✔ | gen-11-themes | 填色 = #E85E63（红-hover） |
| `color.theme.red.3` | 主题主色序列(当前:红) | 主题「红」主色 深色/按下 态 | 通过✔ | gen-11-themes | 填色 = #AA0209（红-深色/按下） |
| `color.theme.red.4` | 主题主色序列(当前:红) | 主题「红」主色 浅色 态 | 通过✔ | gen-11-themes | 填色 = #FFDADA（红-浅色） |
| `color.theme.red.ladder.1` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 1 级 | 裁决·未填 | gen-11-themes | 填色 = #FFDADA（色阶 1） |
| `color.theme.red.ladder.2` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 2 级 | 裁决·未填 | gen-11-themes | 填色 = #FFBFC2（色阶 2） |
| `color.theme.red.ladder.3` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 3 级 | 裁决·未填 | gen-11-themes | 填色 = #F7A2A6（色阶 3） |
| `color.theme.red.ladder.4` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 4 级 | 裁决·未填 | gen-11-themes | 填色 = #E8787D（色阶 4） |
| `color.theme.red.ladder.5` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 5 级 | 裁决·未填 | gen-11-themes | 填色 = #E55359（色阶 5） |
| `color.theme.red.ladder.6` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 6 级 | 裁决·未填 | gen-11-themes | 填色 = #D82128（色阶 6） |
| `color.theme.red.ladder.7` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 7 级 | 裁决·未填 | gen-11-themes | 填色 = #C4181F（色阶 7） |
| `color.theme.red.ladder.8` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 8 级 | 裁决·未填 | gen-11-themes | 填色 = #B5131A（色阶 8） |
| `color.theme.red.ladder.9` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 9 级 | 裁决·未填 | gen-11-themes | 填色 = #AA0209（色阶 9） |
| `color.theme.red.ladder.10` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 10 级 | 裁决·未填 | gen-11-themes | 填色 = #9C050B（色阶 10） |
| `color.theme.red.ladder.11` | 主色调色阶(当前:红,11 级) | 红 主色调色阶第 11 级 | 裁决·未填 | gen-11-themes | 填色 = #900C12（色阶 11） |
| `color.theme.red.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决·未填 | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
| `color.theme.biqing.1` | 主题主色序列(当前:碧青) | 主题「碧青」主色 常规 态 | 通过✔ | gen-11-themes | 填色 = #406670（碧青-常规） |
| `color.theme.biqing.2` | 主题主色序列(当前:碧青) | 主题「碧青」主色 hover 态 | 通过✔ | gen-11-themes | 填色 = #66828A（碧青-hover） |
| `color.theme.biqing.3` | 主题主色序列(当前:碧青) | 主题「碧青」主色 深色/按下 态 | 通过✔ | gen-11-themes | 填色 = #325862（碧青-深色/按下） |
| `color.theme.biqing.4` | 主题主色序列(当前:碧青) | 主题「碧青」主色 浅色 态 | 通过✔ | gen-11-themes | 填色 = #C5E7F0（碧青-浅色） |
| `color.theme.biqing.ladder.1` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 1 级 | 通过✔ | gen-11-themes | 填色 = #C5E7F0（色阶 1） |
| `color.theme.biqing.ladder.2` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 2 级 | 通过✔ | gen-11-themes | 填色 = #A6CFDB（色阶 2） |
| `color.theme.biqing.ladder.3` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 3 级 | 通过✔ | gen-11-themes | 填色 = #87B3BF（色阶 3） |
| `color.theme.biqing.ladder.4` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 4 级 | 通过✔ | gen-11-themes | 填色 = #66939F（色阶 4） |
| `color.theme.biqing.ladder.5` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 5 级 | 通过✔ | gen-11-themes | 填色 = #527D89（色阶 5） |
| `color.theme.biqing.ladder.6` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 6 级 | 通过✔ | gen-11-themes | 填色 = #406670（色阶 6） |
| `color.theme.biqing.ladder.7` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 7 级 | 通过✔ | gen-11-themes | 填色 = #3B5F69（色阶 7） |
| `color.theme.biqing.ladder.8` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 8 级 | 通过✔ | gen-11-themes | 填色 = #325862（色阶 8） |
| `color.theme.biqing.ladder.9` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 9 级 | 通过✔ | gen-11-themes | 填色 = #2E505A（色阶 9） |
| `color.theme.biqing.ladder.10` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 10 级 | 通过✔ | gen-11-themes | 填色 = #264852（色阶 10） |
| `color.theme.biqing.ladder.11` | 主色调色阶(当前:碧青,11 级) | 碧青 主色调色阶第 11 级 | 通过✔ | gen-11-themes | 填色 = #1E3D46（色阶 11） |
| `color.theme.biqing.line-blue` | 该主题页线条行(line-Blue 已按 Q9 裁决统一 #3773DB) | 该主题页「较重要程度/高层级」线条色 | 裁决✘ | gen-11-themes, kb-01 | 填色 = #3773DB（@line-Blue(该主题页)） |
