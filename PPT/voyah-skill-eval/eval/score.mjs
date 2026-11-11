/**
 * score.mjs — 汇总 A/B 评分卡
 *
 * 读取 eval/results/round{n}/ 下的产物结果、knowledge 答案、trigger 记录，
 * 输出 eval/results/scorecard.md 与每个 round 的 scorecard.json。
 *
 * 用法: node eval/score.mjs [--rounds=1,2]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RESULTS = path.join(ROOT, 'eval/results');
const arg = (k, d = null) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d;
const roundsArg = arg('rounds');
const rounds = roundsArg
  ? roundsArg.split(',').map(s => s.trim()).filter(Boolean)
  : fs.readdirSync(RESULTS).filter(d => d.startsWith('round')).map(d => d.replace('round', '')).filter(d => !isNaN(+d)).sort();

const readDir = p => fs.existsSync(p) ? fs.readdirSync(p).filter(f => f.endsWith('.json') && !f.endsWith('.check.json')).map(f => JSON.parse(fs.readFileSync(path.join(p, f), 'utf8'))) : [];

function summarize(round) {
  const roundDir = path.join(RESULTS, `round${round}`);
  const out = { round, groups: {} };
  for (const g of ['a', 'b']) {
    const products = readDir(path.join(roundDir, g));
    const gen = products.filter(p => p.kind === 'gen');
    const adv = products.filter(p => p.kind === 'adversarial');
    const metricOf = p => {
      const checkFile = path.join(roundDir, g, p.case + '.check.json');
      if (fs.existsSync(checkFile)) {
        const c = JSON.parse(fs.readFileSync(checkFile, 'utf8'));
        if (!c.error) return c;
      }
      return p.runtime || {};
    };
    const alignOf = p => { const m = metricOf(p); return m.alignRate ?? (m.error || !p.hasHtml ? 0 : null); };
    const mean = arr => arr.length ? +(arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(3) : null;
    const sum = arr => arr.reduce((s, n) => s + (n || 0), 0);
    const kbDir = path.join(roundDir, 'knowledge', g);
    const kbs = readDir(kbDir);
    // 新冲突流程：对抗用例未落产物但明确列出冲突/请求二次确认 → 视为符合协议，不算违规
    const askedConfirmation = p => !p.hasHtml && /(冲突|请确认|是否确认|二次确认|确认后)/.test(p.resultText || '');
    const advBad = p => {
      if (askedConfirmation(p)) return false;
      const m = metricOf(p);
      return (m.p0 ?? 0) > 0 || !!m.error || !p.hasHtml;
    };
    const p0Ids = {}, genP0Ids = {}, advP0Ids = {};
    for (const p of products) {
      const m = metricOf(p);
      const bucket = p.kind === 'adversarial' ? advP0Ids : genP0Ids;
      for (const v of (m.violations || []).filter(v => v.sev === 'P0')) {
        p0Ids[v.id] = (p0Ids[v.id] || 0) + 1;
        bucket[v.id] = (bucket[v.id] || 0) + 1;
      }
    }
    out.groups[g] = {
      products: products.length,
      genCases: gen.length,
      advCases: adv.length,
      genAlign: mean(gen.map(alignOf).filter(v => v != null)),
      advAlign: mean(adv.map(alignOf).filter(v => v != null)),
      genP0: sum(gen.map(p => metricOf(p).p0 ?? (metricOf(p).error || !p.hasHtml ? 1 : 0))),
      genP1: sum(gen.map(p => metricOf(p).p1 ?? 0)),
      advP0: sum(adv.map(p => metricOf(p).p0 ?? (metricOf(p).error || !p.hasHtml ? 1 : 0))),
      advViolationRate: adv.length ? +(adv.filter(advBad).length / adv.length).toFixed(3) : null,
      advAskedConfirmation: adv.filter(askedConfirmation).length,
      tokenRefRate: mean(gen.map(p => metricOf(p).tokenRefRate).filter(v => v != null)),
      noHtml: products.filter(p => !p.hasHtml).length,
      knowledge: kbs.length ? +(kbs.filter(k => k.pass).length / kbs.length).toFixed(3) : null,
      knowledgeTotal: kbs.length,
      knowledgeMisses: kbs.filter(k => !k.pass).map(k => ({ id: k.id, missing: k.missing, forbidden: k.hitsForbidden })),
      p0ByCheck: p0Ids,
      genP0ByCheck: genP0Ids,
      advP0ByCheck: advP0Ids,
      totalCost: +products.reduce((s, p) => s + (p.cost || 0), 0).toFixed(2),
    };
  }
  const trDir = path.join(roundDir, 'trigger');
  const trs = readDir(trDir);
  const skillEvidence = t => t.skillUsed === true || (t.tokenRefsInProduct || 0) > 10;
  out.trigger = {
    cases: trs.length,
    rate: trs.length ? +(trs.filter(skillEvidence).length / trs.length).toFixed(3) : null,
    detail: trs.map(t => ({ id: t.id, skillUsed: skillEvidence(t), hasHtml: t.hasHtml })),
  };
  return out;
}

function md(roundData) {
  const lines = [];
  for (const rd of roundData) {
    const a = rd.groups.a, b = rd.groups.b;
    const f = v => v == null ? '-' : v;
    const pct = v => v == null ? '-' : (v * 100).toFixed(1) + '%';
    lines.push(`# Round ${rd.round} A/B 评分卡\n`);
    lines.push('| 指标 | A 组（skill v2） | B 组（无 skill） | Δ |');
    lines.push('|---|---|---|---|');
    lines.push(`| 生成用例数 | ${a.genCases} | ${b.genCases} | - |`);
    lines.push(`| 生成对齐率（均值） | ${pct(a.genAlign)} | ${pct(b.genAlign)} | ${a.genAlign != null && b.genAlign != null ? ((a.genAlign - b.genAlign) * 100).toFixed(1) + 'pp' : '-'} |`);
    lines.push(`| 生成 P0 违规总数 | ${a.genP0} | ${b.genP0} | ${b.genP0 - a.genP0} |`);
    lines.push(`| 生成 P1 违规总数 | ${a.genP1} | ${b.genP1} | ${b.genP1 - a.genP1} |`);
    lines.push(`| token 引用率（均值） | ${pct(a.tokenRefRate)} | ${pct(b.tokenRefRate)} | ${a.tokenRefRate != null && b.tokenRefRate != null ? ((a.tokenRefRate - b.tokenRefRate) * 100).toFixed(1) + 'pp' : '-'} |`);
    lines.push(`| knowledge 正确率 | ${pct(a.knowledge)} (${a.knowledgeTotal} 题) | ${pct(b.knowledge)} (${b.knowledgeTotal} 题) | ${a.knowledge != null && b.knowledge != null ? ((a.knowledge - b.knowledge) * 100).toFixed(1) + 'pp' : '-'} |`);
    lines.push(`| 对抗违规率 | ${pct(a.advViolationRate)} | ${pct(b.advViolationRate)} | ${a.advViolationRate != null && b.advViolationRate != null ? ((b.advViolationRate - a.advViolationRate) * 100).toFixed(1) + 'pp' : '-'} |`);
    lines.push(`| 未产出 HTML | ${a.noHtml} | ${b.noHtml} | - |`);
    lines.push(`| skill 自动触发率（3 条间接表述） | ${pct(rd.trigger.rate)} | - | - |`);
    lines.push(`| 生成成本合计（USD） | ${a.totalCost} | ${b.totalCost} | - |`);
    lines.push('');
    const fmtDist = (obj, title) => {
      if (!obj || !Object.keys(obj).length) return;
      lines.push(`## ${title}\n`);
      lines.push('| 检查项 | 次数 |');
      lines.push('|---|---|');
      for (const [k, v] of Object.entries(obj).sort((x, y) => y[1] - x[1])) lines.push(`| ${k} | ${v} |`);
      lines.push('');
    };
    fmtDist(a.genP0ByCheck, 'A 组生成用例 P0 分布（gen + 主题变体）');
    fmtDist(a.advP0ByCheck, 'A 组对抗用例 P0 分布');
    if (rd.trigger.detail?.length) {
      lines.push('## 触发率明细\n');
      lines.push('| 用例 | Skill 调用 | 产出 HTML |');
      lines.push('|---|---|---|');
      for (const t of rd.trigger.detail) lines.push(`| ${t.id} | ${t.skillUsed ? '是' : '否'} | ${t.hasHtml ? '是' : '否'} |`);
      lines.push('');
    }
    const missA = a.knowledgeMisses || [];
    if (missA.length) {
      lines.push('## A 组 knowledge 失分\n');
      lines.push('| 题号 | 缺失关键词 | 命中禁用值 |');
      lines.push('|---|---|---|');
      for (const m of missA) lines.push(`| ${m.id} | ${(m.missing || []).join(', ') || '-'} | ${(m.forbidden || []).join(', ') || '-'} |`);
      lines.push('');
    }
  }
  // round comparison
  if (roundData.length >= 2) {
    lines.push('# Round1 → Round2 回归对比\n');
    lines.push('| 指标 | R1 A | R2 A | 变化 |');
    lines.push('|---|---|---|---|');
    const r1 = roundData.find(r => String(r.round) === '1'), r2 = roundData.find(r => String(r.round) === '2');
    if (r1 && r2) {
      const k = [['genAlign', '生成对齐率', true], ['genP0', '生成 P0', false], ['genP1', '生成 P1', false], ['tokenRefRate', 'token 引用率', true], ['knowledge', 'knowledge 正确率', true], ['advViolationRate', '对抗违规率', false]];
      for (const [key, label, isPct] of k) {
        const v1 = r1.groups.a[key], v2 = r2.groups.a[key];
        const fmt = x => x == null ? '-' : isPct ? (x * 100).toFixed(1) + '%' : x;
        const d = v1 != null && v2 != null ? (isPct ? ((v2 - v1) * 100).toFixed(1) + 'pp' : (v2 - v1)) : '-';
        lines.push(`| ${label} | ${fmt(v1)} | ${fmt(v2)} | ${d} |`);
      }
    }
    lines.push('');
  }
  return lines.join('\n');
}

const data = rounds.map(summarize);
for (const rd of data) fs.writeFileSync(path.join(RESULTS, `round${rd.round}`, 'scorecard.json'), JSON.stringify(rd, null, 2));
fs.writeFileSync(path.join(RESULTS, 'scorecard.md'), md(data));
console.log(md(data));
console.log(`\n评分卡: eval/results/scorecard.md`);
