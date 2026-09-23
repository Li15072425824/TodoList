#!/bin/bash
# 封面图生成：豆包提关键词 → Pexels 搜无版权图 → 下载
# 用法: gen_cover.sh <文章标题或提示词> <输出路径>
# config.env 可配: IMAGE_API_KEY(pexels key) / IMAGE_MODEL / IMAGE_MODE
# 降级链: pexels → picsum → 占位图
set -euo pipefail

TEXT="${1:?用法: gen_cover.sh <标题/提示词> <输出路径>}"
OUT="${2:?用法: gen_cover.sh <标题/提示词> <输出路径>}"
DIR="$(cd "$(dirname "$0")" && pwd)"
[ -f "$DIR/config.env" ] && source "$DIR/config.env"
MODE="${IMAGE_MODE:-auto}"

gen_placeholder() {
  python3 "$DIR/placeholder_cover.py" "${OUT%.jpg}.png"
}

# ---- 关键词提取：豆包把标题翻译成英文图片搜索词 ----
get_keywords() {
  local kw
  kw=$(arkcli +chat "把下面这篇文章标题提炼成 2-3 个适合图片搜索引擎的英文单词，要偏治愈、平静、自然意象的表达，只输出小写单词本身（空格分隔），不要任何解释：${TEXT}" 2>/dev/null \
       | jq -r '.content // empty' | tr '\n' ' ' | sed 's/^ *//;s/ *$//' | head -c 60) || kw=""
  if [ -n "$kw" ] && echo "$kw" | grep -q '^[a-z ]*$'; then
    echo "$kw minimal calm"
    return 0
  fi
  # 兜底：按日期轮换通用词组
  local -a generic=("sunrise road minimal" "reading book coffee minimal" "city morning light calm" "nature path walking calm" "writing notebook desk minimal" "mountain hiking freedom calm")
  local idx
  idx=$(( $(date '+%j') % ${#generic[@]} ))
  echo "${generic[$idx]}"
}

# ---- Pexels 搜索下载 ----
try_pexels() {
  local kw="$1"
  [ -n "${IMAGE_API_KEY:-}" ] || return 1
  local url
  url=$(curl -s -m 20 -G -H "Authorization: ${IMAGE_API_KEY}" \
    --data-urlencode "query=${kw}" \
    --data-urlencode "per_page=5" \
    --data-urlencode "orientation=landscape" \
    "https://api.pexels.com/v1/search" \
    | jq -r '.photos[0].src.landscape // empty' 2>/dev/null) || url=""
  [ -n "$url" ] || return 1
  curl -s -m 30 -L -o "$OUT" "$url" && [ -s "$OUT" ] && file "$OUT" | grep -qi 'image'
}

# ---- picsum 兜底 ----
try_picsum() {
  local seed
  seed=$(echo "$TEXT" | md5 | head -c 8)
  curl -s -m 30 -L -o "$OUT" "https://picsum.photos/seed/${seed}/900/383" \
    && [ -s "$OUT" ] && file "$OUT" | grep -qi 'image'
}

if [ "$MODE" = "placeholder" ]; then
  gen_placeholder
  exit 0
fi

if [ "$MODE" = "ai" ]; then
  MODEL="${IMAGE_MODEL:-doubao-seedream-5-0-260128}"
  if [ -n "${ARK_API_KEY:-}" ]; then
    B64=$(curl -s -m 60 https://ark.cn-beijing.volces.com/api/v3/images/generations \
      -H "Authorization: Bearer ${ARK_API_KEY}" \
      -H 'Content-Type: application/json' \
      -d "$(jq -n --arg m "$MODEL" --arg p "$TEXT" \
        '{model:$m,prompt:$p,size:"1024x1024",response_format:"b64_json"}')" \
      | jq -r '.data[0].b64_json // empty') || B64=""
    if [ -n "$B64" ]; then
      echo "$B64" | base64 -d > "$OUT"
      echo "✅ AI 封面已生成: $OUT"
      exit 0
    fi
  fi
  echo "⚠️ AI 配图不可用，回退图源链" >&2
fi

# auto / free / ai 降级后统一走图源链
if try_pexels "$(get_keywords)"; then
  echo "✅ Pexels 封面已下载: $OUT"
  exit 0
fi
echo "⚠️ Pexels 拉取失败，尝试 picsum" >&2
if try_picsum; then
  echo "✅ picsum 封面已下载: $OUT"
  exit 0
fi
echo "⚠️ 图源全部失败，回退占位图" >&2
gen_placeholder
