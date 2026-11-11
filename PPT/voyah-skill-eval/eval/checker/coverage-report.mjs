/**
 * coverage-report.mjs — 用例覆盖矩阵校验（spec.json 每叶子 → 用例 → 断言）
 *
 * 输入:
 *  - ground-truth/spec.json（227 个叶子，含 6 主题变体）
 *  - eval/cases/gen/*.md、eval/cases/adversarial/*.md 的 `covers: [...]` 行（支持 `*` 通配）
 *  - eval/cases/knowledge/kb-*.json 的 specIds
 * 输出:
 *  - eval/coverage-matrix.md（每个 spec-id 的覆盖用例与断言）
 *  - stdout 摘要；覆盖率 < 100% 时 exit 1
 *
 * 用法: node coverage-report.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'ground-truth/spec.json'), 'utf8'));
const items = SPEC.items;
const byId = new Map(items.map(it => [it.id, it]));

const globToRe = pat => new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\\?\*/g, '.*') + '$');
const expand = pat => items.filter(it => globToRe(pat).test(it.id)).map(it => it.id);

// ---- 收集用例覆盖 ----
const cases = []; // { id, kind, covers:[patterns], file }
const caseDir = path.join(ROOT, 'eval/cases');
for (const kind of ['gen', 'adversarial']) {
  const dir = path.join(caseDir, kind);
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = text.match(/covers:\s*\[([^\]]*)\]/);
    const id = f.replace('.md', '');
    if (!m) { cases.push({ id, kind, covers: [], file: f }); continue; }
    const pats = m[1].split(',').map(s => s.trim()).filter(Boolean);
    cases.push({ id, kind, covers: pats, file: f });
  }
}
const kbDir = path.join(caseDir, 'knowledge');
for (const f of fs.readdirSync(kbDir).filter(f => f.endsWith('.json')).sort()) {
  const kb = JSON.parse(fs.readFileSync(path.join(kbDir, f), 'utf8'));
  cases.push({ id: kb.id, kind: 'knowledge', covers: kb.specIds || [], file: f, kb });
}

// ---- 校验引用合法性 + 建立 item→cases ----
const coverMap = new Map(items.map(it => [it.id, []]));
const bogus = [];
for (const c of cases) {
  const hit = new Set();
  for (const pat of c.covers) {
    const ids = expand(pat);
    if (!ids.length) { bogus.push(`${c.id}: covers 项 "${pat}" 未匹配任何 spec-id`); continue; }
    ids.forEach(id => hit.add(id));
  }
  for (const id of hit) coverMap.get(id).push(c.id);
}

const uncovered = items.filter(it => coverMap.get(it.id).length === 0).map(it => it.id);
const covered = items.length - uncovered.length;

// ---- 断言描述 ----
const fmt = v => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v); } catch { return String(v); }
};
function expected(it) {
  const sp = it.spec || {};
  switch (sp.type) {
    case 'color': return `填色 = ${sp.hex || it.hex || '?'}${it.token ? `（${it.token}）` : ''}`;
    case 'button-state': return `text/fill/border = ${sp.v?.fg || '?'} / ${sp.v?.bg || '?'} / ${sp.v?.bd || '?'}`;
    case 'button-size': return `h ${sp.h}px · padding ${sp.pad} · 字号/行高 ${sp.font} · 圆角 ${sp.radius}px${sp.icon ? ` · icon ${sp.icon}px` : ''}`;
    case 'gap': return `间距 ${sp.value ?? fmt(sp)}`;
    case 'pad': return `padding ${fmt(sp.value ?? sp)}`;
    case 'shadow': return `box-shadow ${fmt(sp.value ?? sp)}`;
    case 'divider': return `分割线 ${sp.h || sp.v || fmt(sp)}`;
    case 'line-width': return `线宽 ${sp.width}px ${sp.style || ''}`.trim();
    case 'font': return `字体 ${sp.family || ''} ${sp.size || ''}/${sp.lineHeight || ''} w${sp.weight || ''}`.trim();
    default: return fmt(sp.hex || it.hex || sp.value || it.token || '');
  }
}

// ---- 写矩阵 ----
const freezeLabel = f => f?.source === 'user-ruling'
  ? (f.status === 'pass' ? '裁决✔' : f.status === 'fail' ? '裁决✘' : '裁决·未填')
  : f?.status === 'pass' ? '通过✔' : f?.status === 'fail' ? '未通过✘' : '未填写';

let md = `# 覆盖矩阵（spec.json → 用例 → 断言）

> 由 \`eval/checker/coverage-report.mjs\` 自动生成，请勿手改。
> 机器真值：\`ground-truth/spec.json\`（tag baseline-v4，${items.length} 个叶子；蓝视图 ${SPEC.meta.blueViewCount} 个 + 6 主题变体）。
> 覆盖率：**${covered}/${items.length} = ${(covered / items.length * 100).toFixed(1)}%**

## 用例索引

| 用例 | 类型 | 覆盖叶子数 | 文件 |
|---|---|---|---|
`;
for (const c of cases) {
  const n = new Set(c.covers.flatMap(expand)).size;
  md += `| ${c.id} | ${c.kind} | ${n} | \`eval/cases/${c.kind}${c.kind === 'knowledge' ? '' : ''}/${c.file}\` |\n`;
}
md += `\n## 叶子明细\n\n| spec-id | 组 | 取值/场景 | 冻结状态 | 覆盖用例 | 断言 |\n|---|---|---|---|---|---|\n`;
let lastSection = '';
for (const it of items) {
  if (it.section !== lastSection) {
    md += `| **${it.section} — ${it.group || ''}** | | | | | |\n`;
    lastSection = it.section;
  }
  const cs = coverMap.get(it.id);
  md += `| \`${it.id}\` | ${it.group || ''} | ${(it.usage || it.hex || '').replace(/\|/g, '/')} | ${freezeLabel(it.freeze)} | ${cs.join(', ') || '**未覆盖**'} | ${expected(it).replace(/\|/g, '/')} |\n`;
}
if (uncovered.length) {
  md += `\n## 未覆盖缺口（${uncovered.length}）\n\n${uncovered.map(u => '- `' + u + '`').join('\n')}\n`;
}
fs.writeFileSync(path.join(ROOT, 'eval/coverage-matrix.md'), md);

// ---- 摘要 ----
console.log(`coverage-report: ${covered}/${items.length} (${(covered / items.length * 100).toFixed(1)}%)`);
console.log(`  cases: ${cases.length}（gen ${cases.filter(c => c.kind === 'gen').length} / adversarial ${cases.filter(c => c.kind === 'adversarial').length} / knowledge ${cases.filter(c => c.kind === 'knowledge').length}）`);
const bySection = {};
for (const it of items) {
  const s = it.section;
  bySection[s] = bySection[s] || { total: 0, cov: 0 };
  bySection[s].total++;
  if (coverMap.get(it.id).length) bySection[s].cov++;
}
for (const [s, v] of Object.entries(bySection)) console.log(`  ${s}: ${v.cov}/${v.total}`);
if (bogus.length) {
  console.log(`  ✘ ${bogus.length} 条 covers 引用无效:`);
  bogus.forEach(b => console.log('    - ' + b));
}
if (uncovered.length) {
  console.log(`  ✘ 未覆盖 ${uncovered.length} 个叶子:`);
  uncovered.slice(0, 40).forEach(u => console.log('    - ' + u));
  if (uncovered.length > 40) console.log(`    ... 另有 ${uncovered.length - 40} 条`);
}
if (bogus.length || uncovered.length) process.exit(1);
console.log('  ✔ 覆盖率 100%，全部 covers 引用有效');
console.log(`  矩阵: eval/coverage-matrix.md`);
