#!/usr/bin/env python3
"""把星球精选 Markdown 转成微信公众号可用的内联样式 HTML。

用法: md2html.py <input.md> <output.html>
只覆盖本流水线生成的 MD 结构（# 标题 / ## 小节 / 引用 / 加粗 / 列表 / 分隔线 / 段落）。
"""
import html
import re
import sys

# 微信编辑器只认内联 style，段落统一排版参数
P_STYLE = ("margin:0 0 20px 0;padding:0;font-size:16px;line-height:1.9;"
           "color:#3f3f3f;letter-spacing:0.5px;text-align:justify;")
H2_STYLE = ("margin:28px 0 18px 0;font-size:19px;font-weight:bold;"
            "color:#1a1a1a;border-left:4px solid #e8a33d;padding-left:12px;")
H3_STYLE = ("margin:22px 0 12px 0;font-size:17px;font-weight:bold;color:#c26a1d;")
QUOTE_STYLE = ("margin:0 0 20px 0;padding:12px 16px;background:#f7f5f0;"
               "border-left:3px solid #d9c7a3;color:#6b6b6b;font-size:15px;line-height:1.8;")
LI_STYLE = "margin:0 0 8px 0;font-size:16px;line-height:1.9;color:#3f3f3f;"
HR_HTML = ('<hr style="margin:32px 0;border:none;height:1px;'
           'background:linear-gradient(to right,transparent,#ccc,transparent);"/>')
IMG_HTML = ('<p style="text-align:center;margin:24px 0;">'
            '<img src="{src}" style="max-width:100%;border-radius:8px;"/></p>')


def inline(text: str) -> str:
    """处理行内标记：图片、链接、加粗、斜体。"""
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)",
                  lambda m: IMG_HTML.format(src=html.escape(m.group(2))), text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
                  r'<a href="\2" style="color:#576b95;">\1</a>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def convert(md_text: str) -> str:
    out, in_quote, in_list = [], False, False

    def close_quote():
        nonlocal in_quote
        if in_quote:
            out.append("</blockquote>")
            in_quote = False

    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    for raw in md_text.splitlines():
        line = raw.rstrip()
        stripped = line.strip()

        if not stripped or stripped == "---":
            close_quote()
            close_list()
            if stripped == "---":
                out.append(HR_HTML)
            continue

        if stripped.startswith("> "):
            close_list()
            if not in_quote:
                out.append(f'<blockquote style="{QUOTE_STYLE}">')
                in_quote = True
            out.append(f'<p style="margin:0 0 8px 0;">{inline(html.escape(stripped[2:]))}</p>')
            continue

        m = re.match(r"^(#{1,3})\s+(.*)$", stripped)
        if m:
            close_quote()
            close_list()
            level, content = len(m.group(1)), html.escape(m.group(2))
            if level == 1:
                out.append(f'<h1 style="margin:0 0 8px 0;font-size:22px;'
                           f'font-weight:bold;color:#1a1a1a;text-align:center;">{content}</h1>')
            elif level == 2:
                out.append(f'<h2 style="{H2_STYLE}">{content}</h2>')
            else:
                out.append(f'<h3 style="{H3_STYLE}">{content}</h3>')
            continue

        m = re.match(r"^[-*]\s+(.*)$", stripped)
        if m:
            close_quote()
            if not in_list:
                out.append('<ul style="padding-left:24px;margin:0 0 20px 0;">')
                in_list = True
            out.append(f'<li style="{LI_STYLE}">{inline(html.escape(m.group(1)))}</li>')
            continue

        close_quote()
        close_list()
        out.append(f'<p style="{P_STYLE}">{inline(html.escape(stripped))}</p>')

    close_quote()
    close_list()
    return "\n".join(out)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit("用法: md2html.py <input.md> <output.html>")
    with open(sys.argv[1], encoding="utf-8") as f:
        md = f.read()
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(convert(md))
    print(f"✅ HTML 已生成: {sys.argv[2]}")


if __name__ == "__main__":
    main()
