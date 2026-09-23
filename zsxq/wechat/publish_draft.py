#!/usr/bin/env python3
"""把一篇 Markdown 文章（含已生成的封面图）推到微信公众号草稿箱。

用法: publish_draft.py <article.md> <cover.jpg> <title>
依赖: config.env（同目录）里已填 APP_ID / APP_SECRET
"""
import json
import mimetypes
import os
import re
import sys
import urllib.request
import urllib.parse

DIR = os.path.dirname(os.path.abspath(__file__))
API = "https://api.weixin.qq.com/cgi-bin"


def load_config() -> tuple[str, str]:
    cfg = {}
    with open(os.path.join(DIR, "config.env"), encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                cfg[k.strip()] = v.strip().strip('"')
    app_id, app_secret = cfg.get("APP_ID", ""), cfg.get("APP_SECRET", "")
    if not app_id or not app_secret:
        sys.exit("❌ config.env 里还没填 APP_ID / APP_SECRET")
    return app_id, app_secret


def http_json(url: str, data: bytes | None = None, headers: dict | None = None,
              method: str = "GET") -> dict:
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_token(app_id: str, app_secret: str) -> str:
    url = f"{API}/token?grant_type=client_credential&appid={app_id}&secret={app_secret}"
    r = http_json(url)
    if "access_token" not in r:
        sys.exit(f"❌ 获取 access_token 失败: {r}\n"
                 "   40013=appid 错误, 40164=IP 不在白名单（把本机 IP 加到公众号后台白名单）")
    return r["access_token"]


def upload_cover(token: str, path: str) -> str:
    """封面图传永久素材接口，返回 media_id。"""
    mime = mimetypes.guess_type(path)[0] or "image/jpeg"
    boundary = "----WechatBoundary7d1a2c"
    with open(path, "rb") as f:
        file_bytes = f.read()
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="media"; filename="{os.path.basename(path)}"\r\n'
        f"Content-Type: {mime}\r\n\r\n"
    ).encode("utf-8") + file_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")
    url = f"{API}/material/add_material?access_token={token}&type=image"
    r = http_json(url, data=body, method="POST",
                  headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    if "media_id" not in r:
        sys.exit(f"❌ 封面上传失败: {r}")
    return r["media_id"]


def add_draft(token: str, title: str, author: str, content_html: str,
              thumb_media_id: str, digest: str) -> str:
    article = {
        "title": title[:64],
        "author": author,
        "digest": digest[:120],
        "content": content_html,
        "thumb_media_id": thumb_media_id,
        "need_open_comment": 0,
        "only_fans_can_comment": 0,
    }
    body = json.dumps({"articles": [article]}, ensure_ascii=False).encode("utf-8")
    url = f"{API}/draft/add?access_token={token}"
    r = http_json(url, data=body, method="POST",
                  headers={"Content-Type": "application/json; charset=utf-8"})
    if "media_id" not in r:
        sys.exit(f"❌ 新建草稿失败: {r}")
    return r["media_id"]


def main() -> None:
    if len(sys.argv) != 4:
        sys.exit("用法: publish_draft.py <article.md> <cover.jpg> <title>")
    article_md, cover, title = sys.argv[1], sys.argv[2], sys.argv[3]

    import subprocess
    html_file = article_md.rsplit(".", 1)[0] + ".html"
    subprocess.run([sys.executable, os.path.join(DIR, "md2html.py"), article_md, html_file],
                   check=True)
    with open(html_file, encoding="utf-8") as f:
        content_html = f.read()

    cfg = {}
    with open(os.path.join(DIR, "config.env"), encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                cfg[k.strip()] = v.strip().strip('"')
    author = cfg.get("AUTHOR", "")

    with open(article_md, encoding="utf-8") as f:
        first_para = next((l.strip() for l in f if l.strip() and not l.startswith("#")), "")
    digest = re.sub(r"\*\*|!?\[[^\]]*\]\([^)]*\)", "", first_para)

    app_id, app_secret = load_config()
    token = get_token(app_id, app_secret)
    print("✅ access_token 获取成功")
    media_id = upload_cover(token, cover)
    print("✅ 封面已上传为永久素材")
    draft_id = add_draft(token, title, author, content_html, media_id, digest)
    print(f"✅ 草稿创建成功 media_id={draft_id}，去公众号后台「草稿箱」查看")


if __name__ == "__main__":
    main()
