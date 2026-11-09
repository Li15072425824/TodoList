#!/usr/bin/env node
/**
 * spec-lint.mjs — Voyah UI/UE 规范静态检查器
 *
 * 用法:
 *   node spec-lint.mjs <demo.html 或目录> [--spec <spec.json>] [--json <输出路径>]
 *
 * 规则来源优先级:
 *   1. --spec 指定的 spec.json(验收基线提取的真值,含 colors whitelist)
 *   2. 缺省回退:解析 .claude/skills/voyah-demo/assets/tokens.css 的 :root 变量值
 *
 * 检查项(映射测试用例编号):
 *   TC-0-01 颜色必须 token 化(demo 内不允许白名单外硬编码色值)
 *   TC-1-08 色值无近似替代(与规范色仅 1 字符之差的 hex 单独标记)
 *   TC-2-02 字重仅 400/500/600
 *   TC-3-01/TC-3-08 间距(margin/padding/gap)取 4n,豁免集除外
 *   TC-4-01 线宽 ∈ {0.5,1,2,3}px
 * 说明:只扫描 demo HTML(含内联 <style>/style 属性)与 demo 自有的布局 CSS,
 *       不扫描 tokens.css(token 定义本身是真值来源,不做 4n 约束)。
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('用法: node spec-lint.mjs <demo.html|目录> [--spec spec.json] [--json out.json]');
  process.exit(2);
}
const target = args[0];
const specIdx = args.indexOf('--spec');
const jsonIdx = args.indexOf('--json');
const specPath = specIdx >= 0 ? args[specIdx + 1] : null;
const jsonOut = jsonIdx >= 0 ? args[jsonIdx + 1] : null;

/* ---------- 收集待扫描文件(排除 tokens.css) ---------- */
function collect(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  const out = [];
  for (const f of fs.readdirSync(p)) {
    const fp = path.join(p, f);
    if (fs.statSync(fp).isDirectory()) out.push(...collect(fp));
    else if (/\.(html?|css)$/i.test(f) && f !== 'tokens.css') out.push(fp);
  }
  return out;
}
const files = collect(target);

/* ---------- 构建色值白名单 ---------- */
const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
function normHex(h) {
  h = h.toLowerCase();
  if (/^#[0-9a-f]{3,4}$/.test(h)) {
    const [r, g, b] = h.slice(1, 4);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return h.slice(0, 7);
}
const whitelist = new Set(['#ffffff']); // 规范豁免:纯白
let specSource = 'fallback:tokens.css';

function addColor(v) {
  if (typeof v !== 'string') return;
  for (const m of v.match(HEX_RE) || []) whitelist.add(normHex(m));
}

if (specPath && fs.existsSync(specPath)) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  specSource = specPath;
  // spec.json 结构:任意嵌套,收集所有字符串中的 hex + colors 数组
  (function walk(o) {
    if (typeof o === 'string') addColor(o);
    else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  })(spec);
} else {
  const tokensPath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../../../../.claude/skills/voyah-demo/assets/tokens.css'
  );
  if (fs.existsSync(tokensPath)) addColor(fs.readFileSync(tokensPath, 'utf8'));
}

/* ---------- 规则常量 ---------- */
const SPACING_EXEMPT = new Set([0, 1, 2, 3, 6]); // 0/细线/输入框上下 6px 等规范豁免
const VALID_WEIGHTS = new Set(['400', '500', '600', 'normal']);
const VALID_BORDER_WIDTHS = new Set(['0', '0.5', '1', '2', '3']);
const SPACING_PROPS =
  /(?:^|[\s;{])((?:margin|padding)(?:-[a-z]+)?|gap|row-gap|column-gap|inset(?:-[a-z]+)?)\s*:\s*([^;}]+)/gi;

function is4n(px) {
  return px % 4 === 0 && px >= 4 && px <= 80;
}

/* ---------- 扫描 ---------- */
const violations = [];
let varRefs = 0;
let hardcodedColors = 0;

function report(tc, rule, file, line, value, snippet) {
  violations.push({ tc, rule, file, line, value, snippet: snippet.trim().slice(0, 120) });
}

/* 只提取样式上下文:<style> 块与 style="..." 属性(普通 HTML 文本中的色值描述不算违规)。
   返回 [{startLine, text}],行号相对原文件。 */
function styleSegments(file, raw) {
  if (/\.css$/i.test(file)) return [{ startLine: 1, text: raw }];
  const segs = [];
  for (const m of raw.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    segs.push({ startLine: raw.slice(0, m.index).split('\n').length, text: m[1] });
  }
  for (const m of raw.matchAll(/style\s*=\s*"([^"]*)"/gi)) {
    segs.push({ startLine: raw.slice(0, m.index).split('\n').length, text: m[1] });
  }
  return segs;
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const segments = styleSegments(file, raw);
  for (const seg of segments) {
  const lines = seg.text.split('\n');
  // 去掉注释,避免注释里的示例值误报(保留行号结构)
  const inBlock = { v: false };
  const cleaned = lines.map((l) => {
    let out = '';
    for (let i = 0; i < l.length; i++) {
      if (!inBlock.v && l[i] === '/' && l[i + 1] === '*') { inBlock.v = true; i++; out += '  '; continue; }
      if (inBlock.v && l[i] === '*' && l[i + 1] === '/') { inBlock.v = false; i++; out += '  '; continue; }
      out += inBlock.v ? ' ' : l[i];
    }
    return out;
  });

  cleaned.forEach((line, i) => {
    const ln = seg.startLine + i;
    const rel = path.relative(process.cwd(), file);

    // --- 色值检查(跳过纯 token 定义行,定义行属于资产) ---
    for (const m of line.match(HEX_RE) || []) {
      const hex = normHex(m);
      if (whitelist.has(hex)) continue;
      hardcodedColors++;
      // 近似色:与某白名单色仅 1 字符不同
      let near = null;
      for (const w of whitelist) {
        if (w.length !== hex.length) continue;
        let diff = 0;
        for (let k = 0; k < w.length; k++) if (w[k] !== hex[k]) diff++;
        if (diff === 1) { near = w; break; }
      }
      report(
        near ? 'TC-1-08' : 'TC-0-01',
        near ? `近似色(应为 ${near})` : '白名单外硬编码色值',
        rel, ln, m, line
      );
    }

    // --- 间距检查 ---
    for (const m of line.matchAll(SPACING_PROPS)) {
      const vals = m[2].match(/-?\d+(?:\.\d+)?px/g) || [];
      for (const v of vals) {
        const n = parseFloat(v);
        if (n < 0) continue; // 负 margin 属布局技巧,单列人工
        if (SPACING_EXEMPT.has(n) || is4n(n)) continue;
        report('TC-3-01', '间距非 4n 且不在豁免集', rel, ln, `${m[1]}: ${v}`, line);
      }
    }

    // --- 字重检查 ---
    for (const m of line.matchAll(/font-weight\s*:\s*([^;}]+)/gi)) {
      const w = m[1].trim().toLowerCase();
      if (VALID_WEIGHTS.has(w) || w.startsWith('var(')) continue;
      report('TC-2-02', '字重非 400/500/600', rel, ln, m[1].trim(), line);
    }

    // --- 线宽检查(border 简写中的 Npx + border-width) ---
    for (const m of line.matchAll(/border(?:-width)?\s*:\s*([^;}]+)/gi)) {
      for (const w of m[1].match(/\d+(?:\.\d+)?px/g) || []) {
        const n = String(parseFloat(w));
        if (!VALID_BORDER_WIDTHS.has(n)) {
          report('TC-4-01', '线宽非 0.5/1/2/3', rel, ln, w, line);
        }
      }
    }

    // --- token 引用统计 ---
    varRefs += (line.match(/var\(--vx-/g) || []).length;
  });
  }
}

const result = {
  target,
  specSource,
  filesScanned: files.length,
  stats: {
    violations: violations.length,
    p0: violations.filter((v) => ['TC-0-01', 'TC-1-08'].includes(v.tc)).length,
    varRefs,
    hardcodedColors,
  },
  violations,
};

if (jsonOut) {
  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.writeFileSync(jsonOut, JSON.stringify(result, null, 2));
}
console.log(JSON.stringify(result.stats, null, 2));
for (const v of violations.slice(0, 50)) {
  console.log(`[${v.tc}] ${v.file}:${v.line} ${v.rule} → ${v.value}`);
}
if (violations.length > 50) console.log(`... 其余 ${violations.length - 50} 条见 JSON 输出`);
