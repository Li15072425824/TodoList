#!/bin/bash
# 拉取知识星球「白诗诗的成长社群」精选内容，保存为 Markdown
# 每次执行都会重新请求接口并覆盖更新 MD 文件
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$DIR/白诗诗成长社群-精选.md"
RAW=$(mktemp)

# ---- 请求接口 ----
# 若返回 401/签名失效，需要从浏览器重新复制 cookie（zsxq_access_token）及 x-signature / x-timestamp
curl -s --url 'https://api.zsxq.com/v2/groups/15522885251212/topics?scope=digests&count=20' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8' \
  -H 'cache-control: no-cache' \
  -b 'zsxq_access_token=8399FA5B-199B-4391-825E-FA9EAB3677D0_95662DA61CCAB88B; abtest_env=product' \
  -H 'origin: https://wx.zsxq.com' \
  -H 'pragma: no-cache' \
  -H 'referer: https://wx.zsxq.com/' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36' \
  -H 'x-aduid: 8cdb4b82e-fd1b-a247-686d-6bbedb084e7' \
  -H 'x-request-id: 11b745dbf-4f89-0a44-b8ce-d476c162251' \
  -H 'x-signature: 80d8aeafbd244baee2a29869a6e9d23999e570c4' \
  -H 'x-timestamp: 1790068086' \
  -H 'x-version: 2.96.0' > "$RAW"

# 校验响应
SUCCEEDED=$(jq -r '.succeeded // false' "$RAW")
if [ "$SUCCEEDED" != "true" ]; then
  echo "❌ 接口请求失败，响应内容：" >&2
  head -c 500 "$RAW" >&2
  rm -f "$RAW"
  exit 1
fi

NOW=$(date '+%Y-%m-%d %H:%M')

# ---- 转换为 Markdown ----
{
  echo "# 白诗诗的成长社群 · 精选"
  echo
  echo "> 拉取时间：${NOW} ｜ 数据来源：知识星球 digests 接口（最新 20 条精选）"
  echo

  jq -r '
    .resp_data.topics[]
    | . as $t
    | ($t.create_time | sub("\\.[0-9]+"; "") | sub("T"; " ") | sub("\\+0800"; "")) as $time
    | ($t.topic_id | tostring) as $id
    | "## " + ($t.title // ($t.type + " · " + $time)) + "\n"
      + "\n- **时间**：" + $time
      + "\n- **链接**：https://wx.zsxq.com/group/topic/" + $id
      + "\n- **数据**：👍 " + (($t.likes_count // 0) | tostring)
      + " 💬 " + (($t.comments_count // 0) | tostring)
      + " 👀 " + (($t.readers_count // $t.reading_count // 0) | tostring)
      + "\n"
      + (
          if $t.type == "talk" then
            "\n### 📝 正文\n\n" + ($t.talk.text // "") + "\n"
            + (if $t.talk.article and $t.talk.article.article_url then
                 "\n📎 [长文链接](" + $t.talk.article.article_url + ")\n"
               else "" end)
          elif $t.type == "q&a" then
            "\n### ❓ 提问（" + ($t.question.owner.name // "匿名") + "）\n\n"
            + ($t.question.text // "") + "\n"
            + "\n### ✅ 回答（" + ($t.answer.owner.name // "白诗诗") + "）\n\n"
            + ($t.answer.text // "") + "\n"
          else
            "\n```\n" + ($t | tostring) + "\n```\n"
          end
        )
      + "\n---\n"
  ' "$RAW"
} > "$OUT"

rm -f "$RAW"
COUNT=$(grep -c '^## ' "$OUT" || true)
echo "✅ 已更新 ${OUT}（共 ${COUNT} 条精选，拉取时间 ${NOW}）"
