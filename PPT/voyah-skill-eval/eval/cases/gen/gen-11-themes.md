# GEN-11 六主题矩阵页

covers: [color.theme.*, color.aux.help-teal.*, color.aux.help-blue.*, color.aux.other-teal.*, color.line.blue]

请生成一个「品牌主题预览」demo(单个 HTML 文件),包含:
- 顶部主题切换条:蓝 / 黄 / 紫 / 翠青 / 红 / 碧青 六个主题按钮(不要绿色)
- 每个主题一张卡片(共 6 张):展示该主题主色 4 阶(常规/hover/深色/浅色)、帮助色板 4 阶、一行 @line-Blue、主按钮与帮助 Alert
- 蓝主题卡片:帮助色必须使用青色系
- 黄/紫/翠青/红/碧青卡片:帮助色必须使用蓝色系;青色系色板单独标注为「其他(扩展)」,不得标为帮助
- 若为某主题提供了 11 级色阶,以横向色条展示(翠青色阶缺失可省略并注明)
要求:严格遵循岚图 Voyah UI/UE 设计规范,主题通过 data-vx-theme 切换,不得使用绿色主题。
