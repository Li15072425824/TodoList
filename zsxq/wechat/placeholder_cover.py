#!/usr/bin/env python3
"""生成纯色渐变占位封面 PNG（零依赖，纯标准库）。

用法: placeholder_cover.py <输出路径.png> [主题色1(hex)] [主题色2(hex)]
"""
import struct
import sys
import zlib

W, H = 900, 383  # 公众号封面推荐比例 2.35:1


def chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data))


def hex2rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def main() -> None:
    out = sys.argv[1]
    c1 = hex2rgb(sys.argv[2] if len(sys.argv) > 2 else "e8a33d")
    c2 = hex2rgb(sys.argv[3] if len(sys.argv) > 3 else "f6e3c5")

    rows = []
    for y in range(H):
        t = y / (H - 1)
        r = round(c1[0] + (c2[0] - c1[0]) * t)
        g = round(c1[1] + (c2[1] - c1[1]) * t)
        b = round(c1[2] + (c2[2] - c1[2]) * t)
        # 每行行首加 filter byte 0
        rows.append(b"\x00" + bytes([r, g, b]) * W)
    raw = b"".join(rows)

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    with open(out, "wb") as f:
        f.write(png)
    print(f"✅ 占位封面已生成: {out}")


if __name__ == "__main__":
    main()
