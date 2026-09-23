#!/bin/bash
# 每日流水线：拉取星球精选 → 生成封面 → 转换排版 → 推送到公众号草稿箱
# 用法: pipeline.sh   （前置条件见 zsxq/README.md）
# 去重：已成功推送过的 topic_id 记录在 zsxq/published_ids.txt，不会重复生成
set -euo pipefail

BASE="$(cd "$(dirname "$0")/.." && pwd)"      # zsxq/
DIR="$BASE/wechat"
source "$DIR/config.env"
TOPIC_COUNT="${TOPIC_COUNT:-1}"
TODAY=$(date '+%Y-%m-%d')
WORK="$BASE/daily/$TODAY"
PUBLISHED="$BASE/published_ids.txt"
touch "$PUBLISHED"
mkdir -p "$WORK"

# 1. 拉取最新精选
echo "① 拉取星球精选..."
"$BASE/fetch_digests.sh"

# 2. 从精选中选出前 TOPIC_COUNT 条「未推送过」的条目
echo "② 挑选未推送过的精选条目（最多 ${TOPIC_COUNT} 条）..."
SELECTION=$(python3 - "$BASE/白诗诗成长社群-精选.md" "$WORK/article.md" "$WORK/topic_ids.txt" "$PUBLISHED" "$TOPIC_COUNT" <<'EOF'
import sys, re
src, dst, ids_out, published_f, count = sys.argv[1:6]
text = open(src, encoding="utf-8").read()
published = {l.strip() for l in open(published_f, encoding="utf-8") if l.strip()}
parts = re.split(r"\n(?=## )", text)
topics = [p for p in parts[1:] if p.startswith("## ")]
# 提取每条的 topic_id（来自正文里的星球链接）
def topic_id(block):
    m = re.search(r"/topic/(\d+)", block)
    return m.group(1) if m else None

selected, seen = [], set()
for p in topics:
    tid = topic_id(p)
    if tid is None or tid in published or tid in seen:
        continue
    seen.add(tid)
    selected.append(p)
    if len(selected) >= int(count):
        break

if not selected:
    print("EMPTY")
else:
    open(dst, "w", encoding="utf-8").write(
        parts[0] + "\n" + "\n".join(selected))
    open(ids_out, "w", encoding="utf-8").write(
        "\n".join(topic_id(p) for p in selected))
    print(re.sub(r"^## ", "", selected[0].splitlines()[0]).strip())
EOF
)

if [ "$SELECTION" = "EMPTY" ]; then
  echo "✅ 没有新的精选内容，无需生成（全部已推送过）。"
  exit 0
fi
echo "   本期标题：$SELECTION"

# 3. 生成封面（豆包提关键词 → Pexels 搜图；失败自动降级）
echo "③ 生成封面图..."
"$DIR/gen_cover.sh" "$SELECTION" "$WORK/cover.jpg" || true
COVER=$(ls "$WORK"/cover.jpg "$WORK"/cover.png 2>/dev/null | head -1 || true)
[ -n "$COVER" ] || { echo "❌ 封面生成失败"; exit 1; }
echo "   封面文件：$COVER"

# 4. 推送草稿；成功后才把本期 topic_id 记入已推送清单
echo "④ 推送到公众号草稿箱..."
if python3 "$DIR/publish_draft.py" "$WORK/article.md" "$COVER" "$SELECTION"; then
  cat "$WORK/topic_ids.txt" >> "$PUBLISHED"
  echo "   已记录 topic_id 到 $PUBLISHED（下次不再重复生成）"
fi

echo "🎉 完成！产物在 $WORK/"
