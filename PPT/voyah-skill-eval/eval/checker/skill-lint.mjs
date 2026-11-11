/**
 * skill-lint.mjs — 校验 skill v2 资产是否与冻结基线 spec.json 一致(0 偏差)
 *
 * 检查域(规范域,不检查组件自有的宽高/圆角尺寸):
 *  1) 所有 hex 色值 ∈ 基线调色板(或 #FFFFFF);禁止废弃值/近似色
 *  2) 字重 ∈ {400,500,600}
 *  3) font-size ∈ 12~24(设计稿层级范围),line-height ∈ {20,22,24,28,32,40}
 *  4) padding/margin/gap 字面量 ∈ 4n ∪ {0,1,2,3,6}
 *  5) 边框宽度 ∈ {0.5,1,2,3}
 *  6) 6 主题齐全(无绿色),蓝主题帮助=青色系,非蓝主题帮助=蓝色系
 *  7) 基线 spec.json 中出现的每个 hex 都在 skill 中有对应 token
 *
 * 用法: node skill-lint.mjs [skill目录]  默认 ../../skill-v2/voyah-demo
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'ground-truth/spec.json'), 'utf8'));
const SKILL = process.argv[2] || path.join(ROOT, 'skill-v2/voyah-demo');

const FILES = ['SKILL.md', 'assets/tokens.css', 'references/design.md', 'references/components.md'];
const read = f => fs.readFileSync(path.join(SKILL, f), 'utf8');
const css = read('assets/tokens.css');
const docs = FILES.filter(f => f !== 'assets/tokens.css').map(f => ({ f, text: read(f) }));

const errors = [];
const warns = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const normHex = h => {
  let s = h.toUpperCase();
  if (s.length === 4) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return s;
};
const HEX_RE = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;
const hexes = text => (text.match(HEX_RE) || []).map(normHex);

// 历史/反例行不参与取值校验(仍参与 token 覆盖统计)
const HIST_RE = /错误|废弃|不得|禁止|近似色|旧值|Q2|Q3|实际填充|历史/;
const activeLines = text => text.split('\n').filter(l => !HIST_RE.test(l)).join('\n');

// ---- 1) 允许色板(基线) ----
const allowed = new Set(['#FFFFFF']);
for (const it of SPEC.items) hexes(it.hex || '').forEach(h => allowed.add(h));
for (const it of SPEC.items) {
  const sp = it.spec;
  if (sp && sp.type === 'button-state') ['bg', 'fg', 'bd'].forEach(k => hexes(sp.v[k] || '').forEach(h => allowed.add(h)));
}
for (const t of SPEC.themes) {
  t.primary.forEach(h => allowed.add(normHex(h)));
  (t.ladder || []).forEach(h => allowed.add(normHex(h)));
  allowed.add(normHex(t.lineBlue));
}
for (const p of Object.values(SPEC.helpPalettes)) p.vals.forEach(h => allowed.add(normHex(h)));

const FORBIDDEN = ['#FF8A5D', '#FFC24D', '#A6D2D8', '#5684FF', '#1A48C2', '#6691DB',
  '#F04438', '#20A870', '#2ECA8A', '#097E4F', '#D6F1E0'];

// 检查各文件中的活跃 hex
for (const { f, text } of [...docs, { f: 'assets/tokens.css', text: css }]) {
  for (const h of hexes(activeLines(text))) {
    if (!allowed.has(h)) err(f, `色值 ${h} 不在冻结基线白名单内(或为近似色)`);
  }
}
for (const h of FORBIDDEN) {
  for (const { f, text } of [...docs, { f: 'assets/tokens.css', text: css }]) {
    if (activeLines(text).toUpperCase().includes(h)) err(f, `出现废弃/禁用色值 ${h}`);
  }
}

// ---- 2) 字重 ----
for (const m of css.matchAll(/font-weight:\s*([0-9]+)/g)) {
  if (!['400', '500', '600'].includes(m[1])) err('assets/tokens.css', `字重 ${m[1]} 不在 {400,500,600}`);
}

// ---- 3) 字号 / 行高 ----
for (const m of css.matchAll(/font-size:\s*([0-9.]+)px/g)) {
  const v = Number(m[1]);
  if (!(v >= 12 && v <= 24)) err('assets/tokens.css', `font-size ${v}px 超出设计稿层级范围 12~24`);
}
for (const m of css.matchAll(/line-height:\s*([0-9.]+)px/g)) {
  if (!['20', '22', '24', '28', '32', '40'].includes(m[1])) err('assets/tokens.css', `line-height ${m[1]}px 不在 20/22/24/28/32/40`);
}

// ---- 4) 间距 ----
const SPACE_OK = v => v === 0 || v === 1 || v === 2 || v === 3 || v === 6 || (v >= 4 && v % 4 === 0);
const SPACE_PROPS = /(?:^|\s)(padding(?:-top|-right|-bottom|-left)?|margin(?:-top|-right|-bottom|-left)?|gap|row-gap|column-gap):\s*([^;{}]+);/g;
for (const m of css.matchAll(SPACE_PROPS)) {
  const vals = m[2].match(/[0-9.]+px/g) || [];
  for (const raw of vals) {
    const v = Number(raw.replace('px', ''));
    if (!SPACE_OK(v)) err('assets/tokens.css', `${m[1]} 值 ${raw} 违反 Sn=4n(仅 0/1/2/3/6 豁免)`);
  }
}
// tokens.css 自身间距声明
for (const m of css.matchAll(/--vx-space-[a-z0-9]+:\s*([0-9]+)px/g)) {
  const v = Number(m[1]);
  if (!(v >= 4 && v <= 80 && v % 4 === 0)) err('assets/tokens.css', `spacing token 值 ${v}px 违反 4n`);
}

// ---- 5) 边框宽度 ----
for (const m of css.matchAll(/border(?:-top|-right|-bottom|-left)?:\s*([0-9.]+)px/g)) {
  if (!['0.5', '1', '2', '3'].includes(m[1])) err('assets/tokens.css', `边框宽度 ${m[1]}px 不在 {0.5,1,2,3}`);
}

// ---- 6) 主题完整性 ----
const themeKeys = SPEC.themes.map(t => t.key);
for (const k of themeKeys) {
  if (!css.includes(`data-vx-theme="${k}"`) && k !== 'blue') err('assets/tokens.css', `缺少主题块 [data-vx-theme="${k}"]`);
}
if (/data-vx-theme="green"/.test(css)) err('assets/tokens.css', '出现已删除的 green 主题');
const tealVals = SPEC.helpPalettes.teal.vals.map(normHex);
const blueVals = SPEC.helpPalettes.blue.vals.map(normHex);
const helpBlockBlue = css.match(/:root\s*\{[\s\S]*?--vx-help:.*/);
if (!helpBlockBlue || !css.includes(`--vx-help: ${SPEC.helpPalettes.teal.vals[2]}`)) {
  err('assets/tokens.css', '默认(蓝)主题 --vx-help 应为青色系 #54A7B2');
}
for (const k of themeKeys.filter(k => k !== 'blue')) {
  const block = css.match(new RegExp(`\\[data-vx-theme="${k}"]\\s*{([\\s\\S]*?)}`, 'm'));
  if (!block) continue;
  if (!block[1].includes(`--vx-help: ${SPEC.helpPalettes.blue.vals[2]}`))
    err('assets/tokens.css', `主题 ${k} 的帮助色应为蓝色系 #3773DB`);
}
// 主题主色 4 阶与基线一致
for (const t of SPEC.themes) {
  if (t.key === 'blue') continue;
  const block = css.match(new RegExp(`\\[data-vx-theme="${t.key}"]\\s*{([\\s\\S]*?)}`, 'm'));
  if (!block) continue;
  const b = block[1];
  const want = { '--vx-primary': t.primary[0], '--vx-primary-hover': t.primary[1], '--vx-primary-active': t.primary[2], '--vx-primary-bg': t.primary[3] };
  for (const [k, v] of Object.entries(want)) {
    if (!b.includes(`${k}: ${v}`)) err('assets/tokens.css', `主题 ${t.key} 的 ${k} 与基线 ${v} 不一致`);
  }
}

// ---- 7) 基线 hex 覆盖 ----
const skillSet = new Set([...FILES.flatMap(f => hexes(read(f)))]);
const missing = [...allowed].filter(h => h !== '#FFFFFF' && !skillSet.has(h));
if (missing.length) warns.push(`基线中有 ${missing.length} 个色值未在 skill 中出现: ${missing.join(', ')}`);

// ---- 报告 ----
console.log(`skill-lint: ${SKILL}`);
console.log(`  允许色板 ${allowed.size} 个;skill 文件 ${FILES.length} 个`);
if (warns.length) warns.forEach(w => console.log('  ⚠ ' + w));
if (errors.length) {
  console.log(`  ✘ ${errors.length} 处偏差:`);
  const uniq = [...new Set(errors)];
  uniq.slice(0, 40).forEach(e => console.log('    - ' + e));
  if (uniq.length > 40) console.log(`    ... 另有 ${uniq.length - 40} 条`);
  process.exit(1);
}
console.log('  ✔ 0 偏差(spec 域全部通过)');
