# 星球精选 → 微信公众号草稿箱 · 每日流水线

```
fetch_digests.sh          拉取星球精选 → 白诗诗成长社群-精选.md
pipeline.sh               每日编排：拉取 → 截取 → 配图 → 推草稿
wechat/config.env         ★ 需要你填：APP_ID / APP_SECRET / AUTHOR
wechat/gen_cover.sh       Seedream AI 封面生成
wechat/md2html.py         Markdown → 公众号内联样式 HTML
wechat/publish_draft.py   上传封面素材 + 创建草稿
daily/YYYY-MM-DD/         每天跑完的产物（article.md / cover.jpg / article.html）
```

## 首次配置

1. **arkcli 重新登录**（图像生成用）：终端执行 `arkcli auth login volc-sso`
2. **公众号 IP 白名单**：公众号后台 → 设置与开发 → 基本配置 → IP 白名单 →
   添加本机出口 IP（浏览器访问 cip.cc 查看；家庭宽带 IP 会变，变了要更新）
3. **填凭证**：编辑 `wechat/config.env`，填入 APP_ID、APP_SECRET、AUTHOR
4. 跑 `./pipeline.sh`

## 日常使用

```bash
/Users/lixing/WorkRep/TodoList/zsxq/wechat/pipeline.sh
```

跑通后如需每天定时，可加 crontab（示例：每天 8:30）：

```
30 8 * * * /Users/lixing/WorkRep/TodoList/zsxq/wechat/pipeline.sh >> /tmp/zsxq_pipeline.log 2>&1
```

## 常见错误

| 报错 | 原因 |
|---|---|
| 40164 | 本机 IP 不在白名单，去公众号后台加 |
| 40001 | AppSecret 错误或被重置 |
| 48001 | 公众号无草稿箱权限（未认证订阅号没有） |
| 封面生成失败 | arkcli SSO 过期，重新登录；或在 config.env 配 ARK_API_KEY 走直连 |
