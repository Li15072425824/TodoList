/**
 * recheck.mjs — 用最新 runtime-check 重新校验某轮全部产物，并回写结果记录
 *
 * 用法: node eval/recheck.mjs --round=1
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d;
const round = arg('round', '1');
const RES = path.join(ROOT, 'eval/results', `round${round}`);
const CHECKER = path.join(ROOT, 'eval/checker/runtime-check.mjs');

function check(product, outFile, theme, allThemes) {
  return new Promise(resolve => {
    const args = [CHECKER, product, '--out=' + outFile];
    if (theme) args.push('--theme=' + theme);
    if (allThemes) args.push('--all-themes');
    const p = spawn('node', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => { out += d; });
    p.stderr.on('data', d => { err += d; });
    p.on('close', code => {
      try { resolve(JSON.parse(out.trim().split('\n')[0])); }
      catch { resolve({ error: (err || out).slice(0, 300), code }); }
    });
  });
}

(async () => {
  let n = 0;
  for (const group of ['a', 'b', 'trigger']) {
    const dir = path.join(RES, group);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.endsWith('.check.json'))) {
      const file = path.join(dir, f);
      const rec = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!rec.product && !rec.case) continue;
      const caseId = rec.case || rec.id;
      const theme = caseId.includes('@') ? caseId.split('@')[1] : null;
      const allThemes = caseId === 'gen-11-themes';
      const product = path.join(ROOT, rec.product);
      if (!fs.existsSync(product)) continue;
      const checkOut = path.join(dir, caseId + '.check.json');
      const r = await check(product, checkOut, theme, allThemes);
      rec.runtime = r;
      fs.writeFileSync(file, JSON.stringify(rec, null, 2));
      console.log(`${group}/${caseId}: align=${r.alignRate ?? '-'} p0=${r.p0 ?? '-'} p1=${r.p1 ?? '-'}${r.error ? ' ERR ' + r.error : ''}`);
      n++;
    }
  }
  console.log(`rechecked ${n} products`);
})();
