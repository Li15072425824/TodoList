/**
 * runner.mjs — Voyah skill v2 A/B 批跑执行器
 *
 * A 组: 临时工作区复制 skill-v2/voyah-demo 到 .claude/skills/；B 组: 无 skill。
 * 用例: gen 11 条 + 3 条非蓝主题变体 + adversarial 6 条 → 产物落 eval/products/round{n}/a|b/
 *      knowledge 25 题（A/B 直答）→ eval/results/round{n}/knowledge/
 *      trigger 3 条间接表述（仅 A，stream-json 检测 Skill 调用）→ eval/results/round{n}/trigger/
 * 每个产物自动跑 runtime-check，结果落 eval/results/round{n}/a|b/{case}.json
 *
 * 用法:
 *   node eval/runner.mjs --round=1 [--groups=a,b] [--cases=gen-01] [--concurrency=3]
 *                        [--skip-knowledge] [--skip-trigger]
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CASES_DIR = path.join(ROOT, 'eval/cases');
const SKILL_SRC = path.join(ROOT, 'skill-v2/voyah-demo');
const CHECKER = path.join(ROOT, 'eval/checker/runtime-check.mjs');

const arg = (k, d = null) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d;
const round = arg('round', '1');
const groups = (arg('groups', 'a,b')).split(',').map(s => s.trim()).filter(Boolean);
const caseFilter = arg('cases');
const CONC = Number(arg('concurrency', '3'));
const SKIP_KB = process.argv.includes('--skip-knowledge');
const SKIP_TRIGGER = process.argv.includes('--skip-trigger');
const RESUME = process.argv.includes('--resume');
// --enforce: 模拟「项目 CLAUDE.md 强制加载 skill」的部署方式（仅 A 组临时工作目录注入 CLAUDE.md）
const ENFORCE = process.argv.includes('--enforce');
const ENFORCE_MD = `# Voyah 规范强制（本项目）

- 任何涉及 Voyah/岚图 UI/UE 规范、UI 稿、界面 demo/原型/示例页面（HTML）的任务，
  生成前必须先加载 \`.claude/skills/voyah-demo/SKILL.md\` 并遵循其取值。
- 用户要求与 skill 规范冲突时，必须先列出冲突点与规范值，要求用户二次确认；
  未确认前按规范生成，不得静默服从冲突要求。单轮无人确认时，输出合规版本并在回复末尾列出待确认冲突项。
`;
const OUT_BASE = path.join(ROOT, 'eval');
const THEME_LABEL = { yellow: '黄', purple: '紫', cuiqing: '翠青', red: '红', biqing: '碧青', blue: '蓝' };

const resultPath = (group, caseId) => path.join(OUT_BASE, 'results', `round${round}`, group, caseId + '.json');
const productPath = (group, caseId) => path.join(OUT_BASE, 'products', `round${round}`, group, caseId);
fs.mkdirSync(path.join(OUT_BASE, 'results', `round${round}`), { recursive: true });

// ---------- 用例解析 ----------
function parseCase(kind, file) {
  const raw = fs.readFileSync(path.join(CASES_DIR, kind, file), 'utf8');
  const id = file.replace('.md', '');
  const covers = (raw.match(/covers:\s*\[([^\]]*)\]/) || [])[1] || '';
  const body = raw
    .replace(/^# .*\n/, '')
    .replace(/covers:.*\n/, '')
    .replace(/^期望:.*$/gm, '')
    .trim();
  return { id, kind, covers, prompt: body };
}
const genCases = fs.readdirSync(path.join(CASES_DIR, 'gen')).filter(f => f.endsWith('.md')).sort().map(f => parseCase('gen', f));
const advCases = fs.readdirSync(path.join(CASES_DIR, 'adversarial')).filter(f => f.endsWith('.md')).sort().map(f => parseCase('adversarial', f));
const variants = [
  { base: 'gen-01-form', theme: 'yellow' },
  { base: 'gen-02-aichat', theme: 'purple' },
  { base: 'gen-05-alerts', theme: 'red' },
];
for (const v of variants) {
  const base = genCases.find(c => c.id === v.base);
  if (!base) continue;
  genCases.push({
    id: `${base.id}@${v.theme}`, kind: 'gen', covers: base.covers, theme: v.theme,
    prompt: `请以「${THEME_LABEL[v.theme]}」主题（在 <html> 上设置 data-vx-theme="${v.theme}"，并保留主题切换能力）生成以下页面：\n\n${base.prompt}`,
  });
}

const SAVE_NOTE = '\n\n将完整 demo 保存到当前目录 `index.html`（单 HTML 文件；如有样式文件一并放在当前目录）。不要创建说明文档或 README。';
const SYSTEM_NOTE = '这是自动化设计规范评测任务：只完成用户要求的 demo 文件，不要归档对话到 Obsidian、不要写记忆、不要创建额外说明文件。';

// ---------- 子进程工具 ----------
let ACTIVE = null;
setInterval(() => { if (ACTIVE) console.log(`[hb] ${ACTIVE.label} ${Math.round((Date.now() - ACTIVE.t) / 1000)}s`); }, 120000).unref();

function runClaude({ cwd, prompt, maxBudget = 1.5, timeoutMs = 360000, stream = false, label = '' }) {
  return new Promise(resolve => {
    ACTIVE = { label, t: Date.now() };
    console.log(`[spawn] ${label}`);
    const args = [
      '-p', prompt,
      '--output-format', stream ? 'stream-json' : 'json',
      ...(stream ? ['--verbose'] : []),
      '--permission-mode', 'acceptEdits',
      '--allowedTools', 'Read,Write,Edit,Glob,Grep,Skill,Bash(*)',
      '--model', 'sonnet',
      '--max-budget-usd', String(maxBudget),
      '--no-session-persistence',
      '--settings', '{"disableAllHooks":true}',
      '--append-system-prompt', SYSTEM_NOTE,
    ];
    const proc = spawn('claude', args, { cwd, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    let out = '', err = '', killed = false, finalized = false, forceTimer = null, code = null;
    const killGroup = sig => { try { process.kill(-proc.pid, sig); } catch { try { proc.kill(sig); } catch {} } };
    proc.stdout.on('data', d => { out += d; });
    proc.stderr.on('data', d => { err += d; });
    const finish = () => {
      if (finalized) return;
      finalized = true;
      if (forceTimer) clearTimeout(forceTimer);
      let json = null;
      if (!stream) { try { json = JSON.parse(out.trim()); } catch {} }
      else {
        for (const line of out.trim().split('\n')) {
          try { const j = JSON.parse(line); if (j.type === 'result') json = j; } catch {}
        }
      }
      ACTIVE = null;
      console.log(`[done] ${label} code=${code} subtype=${json?.subtype ?? (killed ? 'timeout' : 'unknown')}`);
      resolve({
        code, killed, stdout: out, stderr: err.slice(-2000), json,
        cost: json?.total_cost_usd ?? null,
        result: json?.result ?? null,
        denials: json?.permission_denials?.map(d => d.tool_name) ?? [],
        skillUsed: stream ? /"name":"Skill"/.test(out) && out.includes('voyah-demo') : null,
        subtype: json?.subtype ?? (killed ? 'timeout' : 'unknown'),
      });
    };
    const timer = setTimeout(() => {
      killed = true;
      killGroup('SIGTERM');
      setTimeout(() => killGroup('SIGKILL'), 5000);
      forceTimer = setTimeout(finish, 9000); // 即使管道被子进程占用，也在超时后强制返回
    }, timeoutMs);
    proc.on('exit', c => { code = c; clearTimeout(timer); setTimeout(finish, 2000); });
    proc.on('close', c => { code = c; clearTimeout(timer); finish(); });
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
function shouldRetry(run) {
  const txt = (run.result || '') + ' ' + (run.stdout || '').slice(-500);
  return /System protection|request burst|rate limit|API Error|overloaded/i.test(txt)
    || (!run.json && !run.killed)
    || run.subtype === 'error_during_execution';
}
const withWatchdog = (p, ms, label) => new Promise((resolve, reject) => {
  const t = setTimeout(() => {
    console.log(`[watchdog] ${label} 超过 ${(ms / 60000).toFixed(0)} 分钟，强行跳过`);
    resolve({ code: null, killed: true, stdout: '', stderr: '', json: null, cost: null, result: null, denials: [], skillUsed: null, subtype: 'watchdog-timeout' });
  }, ms);
  p.then(r => { clearTimeout(t); resolve(r); }, e => { clearTimeout(t); reject(e); });
});
async function runClaudeRetry(opts, label, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    const run = await runClaude({ ...opts, label: `${label}#${i}` });
    if (!shouldRetry(run)) return run;
    console.log(`  ⚠ ${label} 第 ${i} 次失败（${run.subtype}: ${(run.result || '').slice(0, 80)}），${60 + i * 30}s 后重试`);
    if (i < attempts) await sleep(60000 + i * 30000);
    if (i === attempts) return run;
  }
}

const runPool = async (items, fn) => {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
      const tag = items[i].label || items[i].id || i;
      console.log(`[${i + 1}/${items.length}] ${tag} ✓`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONC, items.length) }, worker));
  return results;
};

function copyProduct(tmpDir, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(tmpDir)) {
    if (f === '.claude') continue;
    const src = path.join(tmpDir, f), dst = path.join(dest, f);
    const st = fs.statSync(src);
    if (st.isDirectory()) fs.cpSync(src, dst, { recursive: true });
    else fs.copyFileSync(src, dst);
  }
}
function validateProduct(dest, { theme, allThemes, outFile }) {
  return new Promise(resolve => {
    const args = [CHECKER, dest, '--out=' + outFile];
    if (theme) args.push('--theme=' + theme);
    if (allThemes) args.push('--all-themes');
    const proc = spawn('node', args, { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    proc.stdout.on('data', d => { out += d; });
    proc.stderr.on('data', d => { err += d; });
    proc.on('close', code => {
      let summary = null;
      try { summary = JSON.parse(out.trim().split('\n')[0]); } catch {}
      if (!summary) resolve({ error: 'runtime-check 失败: ' + (err || out).slice(0, 300), code });
      else resolve(summary);
    });
  });
}

const askedConfirmation = text => /(冲突|请确认|是否确认|二次确认|确认后)/.test(text || '');

async function runProduct(c, group) {
  const tag = `${group}/${c.id}`;
  if (RESUME && fs.existsSync(resultPath(group, c.id))) {
    const old = JSON.parse(fs.readFileSync(resultPath(group, c.id), 'utf8'));
    if (old.hasHtml && fs.existsSync(path.join(ROOT, old.product))) { console.log(`  ↷ 跳过已完成 ${tag}`); return old; }
  }
  const tmp = `/tmp/vx-eval/r${round}/${group}/${c.id.replace(/[^a-z0-9@._-]/gi, '_')}`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  if (group === 'a') {
    fs.mkdirSync(path.join(tmp, '.claude/skills'), { recursive: true });
    fs.cpSync(SKILL_SRC, path.join(tmp, '.claude/skills/voyah-demo'), { recursive: true });
    // 按 SKILL.md 第 1 步，把 tokens.css 放到 demo 同级目录（模型可再复制/引用）
    fs.copyFileSync(path.join(SKILL_SRC, 'assets/tokens.css'), path.join(tmp, 'tokens.css'));
    if (ENFORCE) fs.writeFileSync(path.join(tmp, 'CLAUDE.md'), ENFORCE_MD);
  }
  const prompt = c.prompt + SAVE_NOTE;
  fs.writeFileSync(path.join(tmp, 'prompt.txt'), prompt);
  const dest = productPath(group, c.id);
  let run = null, hasHtml = false;
  for (let attempt = 1; attempt <= 2; attempt++) {
    run = await withWatchdog(runClaudeRetry({ cwd: tmp, prompt, maxBudget: 2.5, timeoutMs: 420000 }, `${group}/${c.id}`), 1800000, `${group}/${c.id}`);
    await sleep(6000);
    copyProduct(tmp, dest);
    hasHtml = fs.readdirSync(dest).some(f => f.endsWith('.html'));
    if (hasHtml) break;
    // 新冲突流程下，对抗用例可以只列出冲突并要求二次确认而不落产物，视为符合协议，不再重试
    if (c.kind === 'adversarial' && askedConfirmation(run.result)) {
      console.log(`  ✓ ${group}/${c.id} 已请求二次确认（未落 HTML，按协议接受）`);
      break;
    }
    console.log(`  ⚠ ${group}/${c.id} 未产出 HTML（${run.subtype}），60s 后重试 (${attempt}/2)`);
    if (attempt < 2) await sleep(60000);
  }
  const checkOut = path.join(OUT_BASE, 'results', `round${round}`, group, c.id + '.check.json');
  fs.mkdirSync(path.dirname(checkOut), { recursive: true });
  const runtime = hasHtml
    ? await validateProduct(dest, { theme: c.theme, allThemes: c.id === 'gen-11-themes', outFile: checkOut })
    : { error: askedConfirmation(run.result) ? '未产出 HTML（已请求二次确认）' : '未产出 HTML' };
  const record = {
    round, group, case: c.id, kind: c.kind, theme: c.theme || null,
    product: path.relative(ROOT, dest),
    hasHtml, subtype: run.subtype, cost: run.cost, denials: run.denials,
    resultText: (run.result || '').slice(0, 1000),
    runtime,
    at: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(resultPath(group, c.id)), { recursive: true });
  fs.writeFileSync(resultPath(group, c.id), JSON.stringify(record, null, 2));
  return record;
}

async function runKnowledge(kb, group) {
  const kbDir = path.join(OUT_BASE, 'results', `round${round}`, 'knowledge', group);
  if (RESUME && fs.existsSync(path.join(kbDir, kb.id + '.json'))) { console.log(`  ↷ 跳过已完成 ${group}/${kb.id}`); return JSON.parse(fs.readFileSync(path.join(kbDir, kb.id + '.json'), 'utf8')); }
  const tmp = `/tmp/vx-eval/r${round}/knowledge-${group}`;
  if (group === 'a') {
    fs.mkdirSync(path.join(tmp, '.claude/skills'), { recursive: true });
    if (!fs.existsSync(path.join(tmp, '.claude/skills/voyah-demo'))) fs.cpSync(SKILL_SRC, path.join(tmp, '.claude/skills/voyah-demo'), { recursive: true });
  } else fs.mkdirSync(tmp, { recursive: true });
  const prompt = group === 'a'
    ? `这个项目里有设计规范 skill「voyah-demo」。请先加载该 skill，并严格依据它的内容回答。只输出答案。\n\n问题：${kb.question}`
    : `请回答以下设计规范问题（不要读取项目文件或 skill）；按通用知识回答。只输出答案。\n\n问题：${kb.question}`;
  const run = await withWatchdog(runClaudeRetry({ cwd: tmp, prompt, maxBudget: 0.4, timeoutMs: 120000 }, `${group}/${kb.id}`), 420000, `${group}/${kb.id}`);
  await sleep(2000);
  const answer = run.result || '';
  // 归一化：短 hex 展开、去单位 px、统一分隔符/空白，避免格式差异误判
  const norm = s => s
    .replace(/#([0-9a-fA-F]{6})(?![0-9a-fA-F])/g, (_, h) => '#' + h)
    .replace(/#([0-9a-fA-F]{3})(?![0-9a-fA-F])/g, (_, h) => '#' + h.split('').map(c => c + c).join(''))
    .replace(/\b0px\b/gi, '0')
    .replace(/px\b/gi, '')
    .replace(/[×*·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  const ans = norm(answer);
  const required = kb.required || [];
  const forbidden = kb.forbidden || [];
  const missing = required.filter(r => !ans.includes(norm(r)));
  // 禁用值只在“肯定/推荐”语境下判错；出现在“旧值/废弃/不要”说明中不算
  const hitsForbidden = forbidden.filter(f => {
    const nf = norm(f);
    return answer.split(/[。；;\n]|,(?=\s)/).some(clause => {
      const nc = norm(clause);
      if (!nc.includes(nf)) return false;
      return !/废弃|旧值|不要|禁止|错误|勿|不是|已删除|别用|不可|旧版/i.test(clause);
    });
  });
  const pass = missing.length === 0 && hitsForbidden.length === 0;
  const rec = { round, group, id: kb.id, topic: kb.topic, question: kb.question, answer, pass, missing, hitsForbidden, cost: run.cost, subtype: run.subtype, at: new Date().toISOString() };
  const dir = path.join(OUT_BASE, 'results', `round${round}`, 'knowledge', group);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, kb.id + '.json'), JSON.stringify(rec, null, 2));
  return rec;
}

async function runTrigger(t, i) {
  if (RESUME && fs.existsSync(path.join(OUT_BASE, 'results', `round${round}`, 'trigger', t.id + '.json'))) { console.log(`  ↷ 跳过已完成 trigger/${t.id}`); return null; }
  const tmp = `/tmp/vx-eval/r${round}/trigger/${t.id}`;
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmp, '.claude/skills'), { recursive: true });
  fs.cpSync(SKILL_SRC, path.join(tmp, '.claude/skills/voyah-demo'), { recursive: true });
  fs.copyFileSync(path.join(SKILL_SRC, 'assets/tokens.css'), path.join(tmp, 'tokens.css'));
  const prompt = t.prompt + SAVE_NOTE;
  const run = await withWatchdog(runClaudeRetry({ cwd: tmp, prompt, maxBudget: 2.5, timeoutMs: 420000, stream: true }, t.id), 1800000, t.id);
  await sleep(6000);
  const dest = path.join(OUT_BASE, 'products', `round${round}`, 'trigger', t.id);
  copyProduct(tmp, dest);
  const html = fs.readdirSync(dest).find(f => f.endsWith('.html'));
  const content = html ? fs.readFileSync(path.join(dest, html), 'utf8') : '';
  const rec = { round, id: t.id, prompt: t.prompt, skillUsed: run.skillUsed, hasHtml: !!html, tokenRefsInProduct: (content.match(/var\(--vx-/g) || []).length, cost: run.cost, subtype: run.subtype, at: new Date().toISOString() };
  const dir = path.join(OUT_BASE, 'results', `round${round}`, 'trigger');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, t.id + '.json'), JSON.stringify(rec, null, 2));
  return rec;
}

// ---------- 执行 ----------
const selected = c => !caseFilter || caseFilter.split(',').some(f => c.id.includes(f));
const selectedGen = genCases.filter(selected);
const selectedAdv = advCases.filter(selected);

(async () => {
  const t0 = Date.now();
  for (const g of groups) {
    console.log(`\n=== round${round} 组 ${g.toUpperCase()}：${selectedGen.length + selectedAdv.length} 条产物用例 ===`);
    const items = [...selectedGen, ...selectedAdv].map(c => ({ ...c, label: `${g}/${c.id}`, group: g }));
    await runPool(items, it => runProduct(it, it.group));
    if (!SKIP_KB) {
      console.log(`\n=== 组 ${g.toUpperCase()}：knowledge 25 题 ===`);
      const kbFiles = fs.readdirSync(path.join(CASES_DIR, 'knowledge')).filter(f => f.endsWith('.json')).sort();
      const kbs = kbFiles.map(f => JSON.parse(fs.readFileSync(path.join(CASES_DIR, 'knowledge', f), 'utf8')));
      await runPool(kbs.map(kb => ({ ...kb, label: `${g}/${kb.id}` })), kb => runKnowledge(kb, g));
    }
  }
  if (!SKIP_TRIGGER && groups.includes('a')) {
    console.log('\n=== 触发率（仅 A 组，3 条间接表述）===');
    const triggers = [
      { id: 'tr-01', prompt: '帮我做一个车辆订单管理后台的 HTML 原型，要看起来专业、统一。' },
      { id: 'tr-02', prompt: '生成一个新能源汽车 App 的运营活动页 demo（单文件 HTML）。' },
      { id: 'tr-03', prompt: '做一个内部数据看板 demo HTML，风格要贴合我们公司的品牌规范。' },
    ];
    await runPool(triggers.map(t => ({ ...t, label: t.id })), runTrigger);
  }
  console.log(`\n完成，用时 ${((Date.now() - t0) / 60000).toFixed(1)} 分钟`);
})();
