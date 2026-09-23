#!/usr/bin/env python3
"""websearch.py — 本地全网搜索/网页抓取工具（零依赖，仅 Python 标准库）

替代 Claude Code 的 WebSearch/WebFetch（方舟网关未开通联网搜索、
本地网络无法访问 claude.ai/Google 时的方案）。

用法:
    python3 websearch.py search "查询词" [-n 10] [--json]
    python3 websearch.py fetch <URL> [--max-chars 8000]
"""

import argparse
import gzip
import json
import re
import sys
import urllib.parse
import urllib.request
from html.parser import HTMLParser

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
HEADERS = {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip",
}


def http_get(url: str, timeout: int = 15) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        if resp.headers.get("Content-Encoding") == "gzip":
            data = gzip.decompress(data)
        charset = resp.headers.get_content_charset() or "utf-8"
        return data.decode(charset, errors="replace")


# ---------------------------------------------------------------- search ---

class BingParser(HTMLParser):
    """解析 cn.bing.com 搜索结果页，提取 <li class="b_algo"> 内的标题/链接/摘要。"""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.results = []
        self._in_algo = 0
        self._in_h2 = 0
        self._in_caption = 0
        self._cur = None
        self._buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "")
        if tag == "li" and "b_algo" in cls:
            self._in_algo += 1
        elif not self._in_algo:
            return
        if tag == "h2":
            self._in_h2 += 1
        elif tag == "div" and "b_caption" in cls:
            self._in_caption += 1
        elif tag == "p" and self._in_caption and not self._in_h2:
            self._buf = []
            self._in_caption_p = True
        elif tag == "a" and self._in_h2:
            self._cur = {"title": "", "url": a.get("href", ""), "snippet": ""}

    def handle_endtag(self, tag):
        if tag == "li" and self._in_algo:
            self._in_algo -= 1
            if self._cur and self._cur["title"]:
                self.results.append(self._cur)
            self._cur = None
        elif tag == "h2" and self._in_h2:
            self._in_h2 -= 1
        elif tag == "p" and getattr(self, "_in_caption_p", False):
            self._in_caption_p = False
            if self._cur is not None:
                self._cur["snippet"] = " ".join(self._buf).strip()
        elif tag == "div" and self._in_caption:
            self._in_caption -= 1

    def handle_data(self, data):
        if self._in_h2 and self._cur is not None:
            self._cur["title"] += data
        elif getattr(self, "_in_caption_p", False):
            self._buf.append(data)


def search(query: str, count: int = 10) -> list:
    """用 Bing（cn.bing.com）搜索，返回 [{title, url, snippet}, ...]。"""
    q = urllib.parse.quote(query)
    html = http_get(f"https://cn.bing.com/search?q={q}&count={count}")
    parser = BingParser()
    parser.feed(html)
    results = parser.results[:count]
    if not results:  # 命中验证码/风控页时兜底报错，避免静默空结果
        if "captcha" in html.lower() or "验证" in html:
            raise RuntimeError("Bing 触发风控页，请稍后重试或换查询词")
    return results


# ----------------------------------------------------------------- fetch ---

SKIP_TAGS = {"script", "style", "noscript", "header", "footer", "nav", "aside",
             "iframe", "svg", "form", "button"}


class TextExtractor(HTMLParser):
    """抽取网页正文纯文本（跳过 script/style 等标签）。"""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self._skip = 0
        self._chunks = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self._skip += 1
        elif tag in ("p", "div", "br", "li", "tr", "h1", "h2", "h3", "h4",
                     "section", "article"):
            self._chunks.append("\n")

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip and data.strip():
            self._chunks.append(data)


def fetch_text(url: str, max_chars: int = 8000) -> str:
    """抓取网页并返回纯文本正文（截断到 max_chars）。"""
    html = http_get(url)
    ext = TextExtractor()
    ext.feed(html)
    text = "".join(ext._chunks)
    text = re.sub(r"\n{3,}", "\n\n", re.sub(r"[ \t]+", " ", text)).strip()
    return text[:max_chars]


# ------------------------------------------------------------------- cli ---

def main():
    ap = argparse.ArgumentParser(description="本地全网搜索/网页抓取工具")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p_s = sub.add_parser("search", help="Bing 全网搜索")
    p_s.add_argument("query")
    p_s.add_argument("-n", type=int, default=10, help="结果条数（默认 10）")
    p_s.add_argument("--json", action="store_true", help="输出 JSON")

    p_f = sub.add_parser("fetch", help="抓取网页正文")
    p_f.add_argument("url")
    p_f.add_argument("--max-chars", type=int, default=8000)

    args = ap.parse_args()

    if args.cmd == "search":
        try:
            results = search(args.query, args.n)
        except Exception as e:
            sys.exit(f"搜索失败: {e}")
        if args.json:
            print(json.dumps(results, ensure_ascii=False, indent=2))
        else:
            if not results:
                sys.exit("无结果")
            for i, r in enumerate(results, 1):
                print(f"{i}. {r['title']}\n   {r['url']}")
                if r["snippet"]:
                    print(f"   {r['snippet'][:200]}")
                print()
    else:
        try:
            print(fetch_text(args.url, args.max_chars))
        except Exception as e:
            sys.exit(f"抓取失败: {e}")


if __name__ == "__main__":
    main()
