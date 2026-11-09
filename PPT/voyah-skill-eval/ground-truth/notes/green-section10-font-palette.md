# 绿色模块 section 10 回补(蒙版组-字体色板,真实 DSL)

字体 5 级 token(与设计稿一致):
- @text-Title #111
- @text-Primary #333
- @text-Secondary #666
- @text-Caption #999
- @text-Disable #C1C1C1(标注"默认图形icon"/#C1C1C1,另有"默认图形icon hover"标注)

SVG 占位符:S10#0~S10#4(40x40 色块图形),applyDesign 缓存键 svgKey 前缀 S10。

# 绿色模块 section 11 回补
- 分区标题文字「字体」,18px PingFang SC,#4A4A4A。

# 绿色模块 section 12 回补(Group 21-帮助色板,真实 DSL)
帮助色 4 阶(@color-help-*),在绿色主题页中仍为固定蓝色系,不随主题变化:
- @color-help-1 #ECF3FF(浅色)
- @color-help-2 #B3CBF4(hover)
- @color-help-3 #3773DB(常规)
- @color-help-4 #1C5AC4(深色/按下)

⚠️ 与现有测试用例文档 TC-1 速查表「帮助 #54A7B2 系」不一致,与 tokens.css --vx-help 系也不一致。
待对照色彩-蓝色模块的「帮助」定义确认:蓝色主题页帮助色可能为 #54A7B2 系(语义色),而此处的 @color-help 实际指「主色/帮助链接色」。列入一致性审计待裁决项。

# 绿色模块 section 13 回补(Group 23-「警告-强」= 错误色板,真实 DSL)
- @color-error-1 #FCEBEA(浅色)
- @color-error-2 #FDA2A4(hover)
- @color-rerror-3 #FF2020(常规;设计稿 token 名原文拼写为 rerror,保留记录)
- @color-error-4 #CF2E2E(深色/按下,token「警告-按下」)
- 分区标题「警告-强」18px #373D41

# 绿色模块 section 14 回补(Group 24-「警告-弱」= 警告色板,真实 DSL)
- @color-warning-1 #FFF1DB(浅色)
- @color-warning-2 #FFD77E(hover)
- @color-warning-3 #FFA800(常规,token「提醒色-事件提醒的颜色」)
- @color-warning-4 #EA8C00(深色/按下,token「提醒-按下」)
- 分区标题「警告-弱」

# 通用发现(审计用)
1. 设计稿语义分区命名:错误=「警告-强」、警告=「警告-弱」、帮助=蓝色 4 阶。
2. 规范页自身排版色(#4D5559 标注文字/#9B9EA0 hex 标注/#373D41 分区标题/#4A4A4A 标题)是文档 UI 色,不属于产品 token,白名单不应收录。
3. 绿色 5 个缺失 section(10~14)已全部回补真实 DSL,要点如上;补绘区域在 gallery 构建时以此为准校正。
