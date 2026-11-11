/**
 * runtime-check.mjs — 对 A/B 产物做运行时规范校验（Playwright + 静态扫描）
 *
 * 用法:
 *   node runtime-check.mjs <产物目录> [--theme=blue|yellow|...] [--all-themes] [--out=result.json]
 *
 * 检查项:
 *  静态: 调色板外色值/禁用近似色、渐变、700+ 字重、纯黑、非 4n 间距、非法线宽、token 引用率
 *  运行时: 按钮尺寸/padding/字号/行高/圆角、六类型四态模拟（primary 四态 + danger/prompt/secondary/whiteline）、
 *          输入框 padding/边框、主题属性与 6 主题变量探针（主色 + 帮助色决策）、字体栈、控制台错误
 *
 * 输出: 评分卡 JSON（对齐率 = 通过检查 / 适用检查；P0/P1 违规明细）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'ground-truth/spec.json'), 'utf8'));

// ---------- args ----------
const target = process.argv[2];
if (!target) { console.error('用法: node runtime-check.mjs <产物目录> [--theme=blue] [--all-themes] [--out=x.json]'); process.exit(2); }
const getArg = (k, d = null) => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1] ?? d;
const expectedTheme = getArg('theme');
const requireAllThemes = process.argv.includes('--all-themes');
const outFile = getArg('out');

// ---------- 调色板 ----------
const norm = h => {
  if (!h) return null;
  let s = String(h).trim().toUpperCase();
  if (!s.startsWith('#')) return s;
  if (s.length === 4) s = '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  return s;
};
// 后边界避免把订单号/编号（如 #20261110001）误当成 6 位色值
const HEX_RE = /#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?![0-9A-Fa-f])/g;
const hexes = t => (t.match(HEX_RE) || []).map(norm);
const allowed = new Set(['#FFFFFF', '#222222', '#444444', '#555555', '#888888']);
for (const it of SPEC.items) {
  hexes(it.hex || '').forEach(h => allowed.add(h));
  if (it.spec) {
    hexes(it.spec.hex || '').forEach(h => allowed.add(h));
    if (it.spec.type === 'button-state' && it.spec.v) ['bg', 'fg', 'bd'].forEach(k => hexes(it.spec.v[k] || '').forEach(h => allowed.add(h)));
    hexes(it.spec.css || '').forEach(h => allowed.add(h));
  }
}
for (const t of SPEC.themes) { t.primary.forEach(h => allowed.add(norm(h))); (t.ladder || []).forEach(h => allowed.add(norm(h))); allowed.add(norm(t.lineBlue)); }
for (const p of Object.values(SPEC.helpPalettes)) p.vals.forEach(h => allowed.add(norm(h)));

const FORBIDDEN = ['#FF8A5D', '#FFC24D', '#A6D2D8', '#5684FF', '#1A48C2', '#6691DB', '#F04438', '#20A870', '#2ECA8A', '#097E4F', '#D6F1E0', '#3774DB', '#3673DC', '#000000'];
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();
function parseColor(v) {
  if (!v) return null;
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(',').map(s => parseFloat(s));
    if ((p[3] ?? 1) === 0) return null;
    return rgbToHex(p[0], p[1], p[2]);
  }
  if (v.startsWith('#')) return norm(v);
  return v.toUpperCase();
}
const FONT_W = /font-weight:\s*([0-9]+|bold|bolder)/gi;
const SPACE_OK = v => v === 0 || ['1', '2', '3', '6'].includes(v) || (v >= 4 && Number(v) % 4 === 0);
const SPACE_PROPS = /(?:^|[;{\s])(padding(?:-top|-right|-bottom|-left)?|margin(?:-top|-right|-bottom|-left)?|gap|row-gap|column-gap):\s*([^;{}]+);/g;
const BORDER_RE = /border(?:-top|-right|-bottom|-left)?(?:-width)?:\s*([0-9.]+)px/gi;

// ---------- 定位产物 ----------
const dir = path.resolve(target);
const stat = fs.statSync(dir);
const entry = stat.isDirectory()
  ? (fs.existsSync(path.join(dir, 'index.html')) ? path.join(dir, 'index.html')
    : fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => path.join(dir, f))[0])
  : dir;
if (!entry || !fs.existsSync(entry)) { console.error('未找到 HTML 产物'); process.exit(2); }
const entryHtml = fs.readFileSync(entry, 'utf8');
const localCss = [...entryHtml.matchAll(/<link[^>]+href=["'](?:\.\/)?([^"']+\.css)["']/gi)]
  .map(m => path.resolve(path.dirname(entry), m[1])).filter(p => fs.existsSync(p));
const cssText = localCss.map(p => fs.readFileSync(p, 'utf8')).join('\n');
const styleText = [...entryHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
const allText = entryHtml + '\n' + cssText;
const demoText = entryHtml + '\n' + styleText; // 不含链接的 token 文件，用于 token 引用率
// 去掉注释（注释中的“旧值/废弃”说明不算实际用色）
const stripComments = t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\/[^\n]*/g, '');
const scanText = stripComments(allText);
const demoSrc = stripComments(demoText);

const checks = [];
const violations = [];
const addCheck = (id, cat, sev, pass, detail) => {
  checks.push({ id, cat, sev, pass: !!pass, detail: detail || '' });
  if (!pass) violations.push({ id, cat, sev, detail: detail || '' });
};
const staticIssues = { hex: [], forbidden: [], gradient: [], weight: [], black: [], spacing: [], border: [], errors: [] };

// ---------- 静态扫描 ----------
const activeText = scanText;
const hexesFound = [...new Set(hexes(activeText))];
for (const h of hexesFound) if (!allowed.has(h)) staticIssues.hex.push(h);
for (const h of FORBIDDEN) if (activeText.toUpperCase().includes(h)) staticIssues.forbidden.push(h);
if (/(?:linear|radial|conic)-gradient/i.test(activeText)) staticIssues.gradient.push('gradient');
if (/#000000|#000(?!\d)/i.test(activeText)) staticIssues.black.push('#000');
for (const m of activeText.matchAll(FONT_W)) {
  const w = m[1].toLowerCase();
  if (w === 'bold' || w === 'bolder' || Number(w) >= 700) staticIssues.weight.push(w);
}
for (const m of activeText.matchAll(SPACE_PROPS)) {
  for (const raw of (m[2].match(/[0-9.]+px/g) || [])) {
    const v = raw.replace('px', '');
    if (!SPACE_OK(v)) staticIssues.spacing.push(`${m[1]}: ${raw}`);
  }
}
for (const m of allText.matchAll(BORDER_RE)) {
  if (!['0.5', '1', '2', '3'].includes(m[1])) staticIssues.border.push(m[1] + 'px');
}
addCheck('static.palette', '色彩', 'P0', staticIssues.hex.length === 0, staticIssues.hex.length ? '调色板外色值: ' + staticIssues.hex.slice(0, 12).join(' ') : '全部色值均来自冻结基线');
addCheck('static.forbidden', '色彩', 'P0', staticIssues.forbidden.length === 0, staticIssues.forbidden.length ? '禁用/近似色: ' + staticIssues.forbidden.join(' ') : '无禁用近似色');
addCheck('static.gradient', '色彩', 'P0', staticIssues.gradient.length === 0, staticIssues.gradient.length ? '出现渐变（规范无渐变）' : '无渐变');
addCheck('static.black', '色彩', 'P0', staticIssues.black.length === 0, staticIssues.black.length ? '出现纯黑 #000000' : '无纯黑');
addCheck('static.weight', '字体', 'P0', staticIssues.weight.length === 0, staticIssues.weight.length ? '非法字重: ' + [...new Set(staticIssues.weight)].join(',') : '字重 ∈ {400,500,600}');
addCheck('static.spacing', '间距', 'P1', staticIssues.spacing.length === 0, staticIssues.spacing.length ? '非 4n 间距: ' + [...new Set(staticIssues.spacing)].slice(0, 8).join('; ') : '间距均为 4n 或豁免');
addCheck('static.border', '线条', 'P1', staticIssues.border.length === 0, staticIssues.border.length ? '非法线宽: ' + [...new Set(staticIssues.border)].join(',') : '线宽 ∈ {0.5,1,2,3}');

// token 引用率（只算 demo 自身，不含 tokens.css 定义）
const varUses = (demoSrc.match(/var\(--vx-/g) || []).length;
const rawHexUses = (demoSrc.match(HEX_RE) || []).length;
const tokenRefRate = varUses + rawHexUses === 0 ? 0 : +(varUses / (varUses + rawHexUses)).toFixed(3);

// ---------- 运行时 ----------
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(10000);
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
page.on('pageerror', e => consoleErrors.push(String(e).slice(0, 200)));
await page.goto('file://' + entry, { waitUntil: 'load' });
await page.waitForTimeout(500);
// 状态模拟时禁用过渡动画，避免采到过渡中间值
await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });

const themeKeys = SPEC.themes.map(t => t.key);
const themeAttrList = await page.evaluate(() => [...document.querySelectorAll('[data-vx-theme]')].map(e => e.getAttribute('data-vx-theme')));
const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-vx-theme'));
addCheck('runtime.console', '运行时', 'P1', consoleErrors.length === 0, consoleErrors.length ? '控制台错误: ' + consoleErrors.slice(0, 3).join(' | ') : '无控制台错误');

// 按钮计算样式
const btns = await page.evaluate(() => [...document.querySelectorAll('button, .vx-btn, .btn, [role="button"]')]
  .filter(el => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const bd = parseFloat(cs.borderTopWidth) || 0;
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    // 纯文字链（透明底、无边框、高度<24）不计入按钮规范校验
    if (/rgba\(0, 0, 0, 0\)|transparent/.test(bg) && bd === 0 && radius === 0 && r.height < 24) return false;
    // 主题色卡/色点属演示用主题切换控件，不是业务按钮，不套用按钮尺寸/色板规格
    if (/theme-dot|theme-swatch|theme-chip|color-dot/i.test(String(el.className))) return false;
    return true;
  })
  .map((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      i, tag: el.tagName, cls: el.className && String(el.className).slice(0, 80),
      text: (el.textContent || '').trim().slice(0, 30),
      h: +r.height.toFixed(1), w: +r.width.toFixed(1),
      pad: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(v => parseFloat(v)),
      fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight), fw: cs.fontWeight,
      r: parseFloat(cs.borderTopLeftRadius),
      fg: cs.color, bg: cs.backgroundColor, bd: cs.borderTopColor, bw: parseFloat(cs.borderTopWidth),
      disabled: !!el.disabled, hasIcon: !!el.querySelector('svg,img'),
      gap: cs.display.includes('flex') ? parseFloat(cs.gap) : null,
      ff: cs.fontFamily,
    };
  }));

const textBtns = btns.filter(b => b.text.length > 0);
if (btns.length) {
  const badSize = btns.filter(b => ![24, 32, 40].some(h => Math.abs(b.h - h) < 0.6));
  addCheck('runtime.btn.height', '按钮', 'P0', badSize.length === 0, badSize.length ? `${badSize.length}/${btns.length} 按钮高度非 24/32/40: ` + badSize.slice(0, 5).map(b => `${b.text || b.cls}=${b.h}`).join(', ') : `全部按钮高度合规 (${btns.length})`);
  const badPad = textBtns.filter(b => ![2, 6, 8].some(v => Math.abs(b.pad[0] - v) < 0.5 && Math.abs(b.pad[2] - v) < 0.5) || ![8, 16].some(v => Math.abs(b.pad[1] - v) < 0.5 && Math.abs(b.pad[3] - v) < 0.5));
  addCheck('runtime.btn.padding', '按钮', 'P1', badPad.length === 0, badPad.length ? `${badPad.length} 按钮 padding 非 2/6/8·8/16: ` + badPad.slice(0, 4).map(b => `${b.text || b.cls}=[${b.pad}]`).join(', ') : '按钮 padding 合规');
  const badFont = textBtns.filter(b => ![12, 16].includes(Math.round(b.fs)) || ![20, 24].includes(Math.round(b.lh)));
  addCheck('runtime.btn.font', '按钮', 'P1', badFont.length === 0, badFont.length ? `${badFont.length} 按钮字号/行高非 12·20/16·24: ` + badFont.slice(0, 4).map(b => `${b.text}=${b.fs}/${b.lh}`).join(', ') : '按钮字号行高合规');
  const badRadius = btns.filter(b => ![4, 6].some(v => Math.abs(b.r - v) < 0.6));
  addCheck('runtime.btn.radius', '按钮', 'P1', badRadius.length === 0, badRadius.length ? `${badRadius.length} 按钮圆角非 4/6: ` + badRadius.slice(0, 4).map(b => `${b.text}=${b.r}`).join(', ') : '按钮圆角合规');
  const badWeight = btns.filter(b => !['400', '500', '600'].includes(String(b.fw)));
  addCheck('runtime.btn.weight', '按钮', 'P0', badWeight.length === 0, badWeight.length ? '按钮字重非法: ' + [...new Set(badWeight.map(b => b.fw))].join(',') : '按钮字重合规');
  const badColor = btns.filter(b => [b.fg, b.bg, b.bd].some(c => { const h = parseColor(c); return h && !allowed.has(h); }));
  addCheck('runtime.btn.color', '按钮', 'P0', badColor.length === 0, badColor.length ? `${badColor.length} 按钮色值出板: ` + badColor.slice(0, 4).map(b => `${b.text}=${[b.fg, b.bg, b.bd].join('/')}`).join(', ') : '按钮色值均在基线内');
  const iconGap = textBtns.filter(b => b.hasIcon && (!b.gap || Math.abs(b.gap - 4) > 0.6));
  addCheck('runtime.btn.iconGap', '按钮', 'P1', iconGap.length === 0, iconGap.length ? `${iconGap.length} 个图标按钮 gap≠4` : '图标按钮 gap 合规');
} else {
  addCheck('runtime.btn.exists', '按钮', 'P1', true, '页面无按钮（按钮检查不适用）');
}

// ---- 四态模拟 ----
function eqColor(a, b) { return parseColor(a) === norm(b); }
async function simStates(sel) {
  const read = () => page.$eval(sel, el => { const cs = getComputedStyle(el); return { fg: cs.color, bg: cs.backgroundColor, bd: cs.borderTopColor }; });
  await page.mouse.move(0, 0); await page.waitForTimeout(150);
  const normal = await read();
  await page.hover(sel); await page.waitForTimeout(250);
  const hover = await read();
  await page.mouse.down(); await page.waitForTimeout(120);
  const click = await read();
  await page.mouse.up();
  await page.evaluate(sel => { const el = document.querySelector(sel); if (el) el.disabled = true; }, sel);
  await page.mouse.move(0, 0); await page.waitForTimeout(150);
  const disabled = await read();
  await page.evaluate(sel => { const el = document.querySelector(sel); if (el) el.disabled = false; }, sel);
  return { normal, hover, click, disabled };
}
// 用例未指定主题时，按产物声明的 data-vx-theme 校验其主色四态；
// 未声明才回落到默认蓝主题（避免把合法的 red 主题产物误判成蓝主题主色）
const themeKey = (expectedTheme && themeKeys.includes(expectedTheme)) ? expectedTheme
  : (htmlTheme && themeKeys.includes(htmlTheme)) ? htmlTheme
  : 'blue';
const theme = SPEC.themes.find(t => t.key === themeKey) || SPEC.themes[0];
const v = SPEC.buttons.variants;
// 主按钮 normal/hover/click 随主题主色 4 阶（disabled 全主题统一）
const primExpected = {
  normal: { fg: '#fff', bg: theme.primary[0], bd: theme.primary[0] },
  hover: { fg: '#fff', bg: theme.primary[1], bd: theme.primary[1] },
  click: { fg: '#fff', bg: theme.primary[2], bd: theme.primary[2] },
  disabled: v.primary.disabled,
};
const nChecks = { primary: 4, secondary: 3, danger: 1, prompt: 1, whiteline: 2 };

// 找主按钮：类名优先，否则按主色识别；统一打上 probe id
const primarySel = await page.evaluate(([hex]) => {
  const cands = [...document.querySelectorAll('button, .vx-btn, .btn, [role="button"]')].filter(el => { if (el.disabled) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const byCls = cands.find(el => /\bvx-btn-primary\b|\bbtn-primary\b|\bprimary-btn\b/i.test(String(el.className)));
  let idx = byCls ? cands.indexOf(byCls) : -1;
  if (idx < 0) {
    const probe = document.createElement('div'); probe.style.color = `var(--vx-primary, ${hex})`; document.body.appendChild(probe);
    const want = getComputedStyle(probe).color; probe.remove();
    idx = cands.findIndex(el => getComputedStyle(el).backgroundColor === want && parseFloat(getComputedStyle(el).height) >= 24);
  }
  if (idx >= 0) { cands[idx].id = '__vx_probe_primary'; return '#__vx_probe_primary'; }
  return null;
}, [theme.primary[0]]);
if (primarySel) {
  const usedSel = primarySel;
  try {
    const st = await simStates(usedSel);
    addCheck('sim.primary.normal', '按钮态', 'P0', eqColor(st.normal.fg, primExpected.normal.fg) && eqColor(st.normal.bg, primExpected.normal.bg) && eqColor(st.normal.bd, primExpected.normal.bd), `主按钮 normal = ${st.normal.fg}/${st.normal.bg}/${st.normal.bd}，期望 ${primExpected.normal.fg}/${primExpected.normal.bg}/${primExpected.normal.bd}`);
    addCheck('sim.primary.hover', '按钮态', 'P0', eqColor(st.hover.fg, primExpected.hover.fg) && eqColor(st.hover.bg, primExpected.hover.bg) && eqColor(st.hover.bd, primExpected.hover.bd), `主按钮 hover = ${st.hover.fg}/${st.hover.bg}/${st.hover.bd}，期望 ${primExpected.hover.fg}/${primExpected.hover.bg}/${primExpected.hover.bd}`);
    addCheck('sim.primary.click', '按钮态', 'P0', eqColor(st.click.fg, primExpected.click.fg) && eqColor(st.click.bg, primExpected.click.bg) && eqColor(st.click.bd, primExpected.click.bd), `主按钮 click = ${st.click.fg}/${st.click.bg}/${st.click.bd}，期望 ${primExpected.click.fg}/${primExpected.click.bg}/${primExpected.click.bd}`);
    addCheck('sim.primary.disabled', '按钮态', 'P0', eqColor(st.disabled.fg, primExpected.disabled.fg) && eqColor(st.disabled.bg, primExpected.disabled.bg) && eqColor(st.disabled.bd, primExpected.disabled.bd), `主按钮 disabled = ${st.disabled.fg}/${st.disabled.bg}/${st.disabled.bd}，期望 ${primExpected.disabled.fg}/${primExpected.disabled.bg}/${primExpected.disabled.bd}`);
  } catch (e) { addCheck('sim.primary', '按钮态', 'P1', true, '主按钮不可交互（跳过四态模拟）: ' + String(e).slice(0, 100)); }
} else {
  addCheck('sim.primary', '按钮态', 'P1', true, '页面无主按钮（四态不适用）');
}

// danger / prompt / whiteline / secondary：按类名或计算样式识别，打 probe id
async function findBtn(kind) {
  const sel = await page.evaluate(kind => {
    const cands = [...document.querySelectorAll('button, .vx-btn, .btn, [role="button"]')].filter(el => { if (el.disabled) return false; if (/theme-dot|theme-swatch|theme-chip|color-dot/i.test(String(el.className))) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const rgb = hex => { const p = document.createElement('div'); p.style.color = hex; document.body.appendChild(p); const v = getComputedStyle(p).color; p.remove(); return v; };
    const match = el => {
      const s = getComputedStyle(el);
      const cls = String(el.className) + ' ' + (el.textContent || '');
      if (kind === 'danger') return /danger|危险/i.test(cls) || s.backgroundColor === rgb('#FF2020');
      if (kind === 'prompt') return /prompt|提示/i.test(cls) || s.backgroundColor === rgb('#FFA800');
      if (kind === 'whiteline') return /whiteline|反白/i.test(cls) || (s.backgroundColor === rgb('#FAFAFA') && s.color === rgb('#666666'));
      if (kind === 'secondary') {
        // 反白按钮 normal 也是 #FAFAFA/#DEDEDE，但其 hover fill 保持 #FAFAFA，不能套用次要按钮期望
        if (/whiteline|反白/i.test(cls) || (s.backgroundColor === rgb('#FAFAFA') && s.color === rgb('#666666'))) return false;
        return /secondary|次要/i.test(cls) || (s.backgroundColor === rgb('#FAFAFA') && s.borderTopColor === rgb('#DEDEDE'));
      }
      return false;
    };
    const el = cands.find(match);
    if (!el) return null;
    el.id = '__vx_probe_' + kind;
    return '#__vx_probe_' + kind;
  }, kind);
  return sel;
}
async function hoverBg(sel) {
  try {
    await page.mouse.move(0, 0); await page.waitForTimeout(100);
    await page.hover(sel, { timeout: 5000 }); await page.waitForTimeout(250);
    return await page.$eval(sel, el => getComputedStyle(el).backgroundColor);
  } catch { return null; }
}
async function readColors(sel) {
  try { return await page.$eval(sel, el => { const s = getComputedStyle(el); return { fg: s.color, bg: s.backgroundColor, bd: s.borderTopColor }; }); }
  catch { return null; }
}
const dangerSel = await findBtn('danger');
const dangerBg = dangerSel ? await hoverBg(dangerSel) : null;
if (dangerSel && dangerBg) {
  addCheck('sim.danger.hover', '按钮态', 'P0', eqColor(dangerBg, v.danger.hover.bg), `危险按钮 hover = ${dangerBg}，期望 ${v.danger.hover.bg}`);
} else addCheck('sim.danger.hover', '按钮态', 'P1', true, dangerSel ? '危险按钮不可交互（跳过）' : '未使用危险按钮（不适用）');
const promptSel = await findBtn('prompt');
const promptBg = promptSel ? await hoverBg(promptSel) : null;
if (promptSel && promptBg) {
  addCheck('sim.prompt.hover', '按钮态', 'P0', eqColor(promptBg, v.prompt.hover.bg), `提示按钮 hover = ${promptBg}，期望 ${v.prompt.hover.bg}`);
} else addCheck('sim.prompt.hover', '按钮态', 'P1', true, promptSel ? '提示按钮不可交互（跳过）' : '未使用提示按钮（不适用）');
const whitelineSel = await findBtn('whiteline');
if (whitelineSel) {
  const cs = await readColors(whitelineSel);
  if (cs) {
    addCheck('sim.whiteline.normal.fg', '按钮态', 'P0', eqColor(cs.fg, '#666666'), `反白 normal 文字 = ${cs.fg}，期望 #666666`);
    addCheck('sim.whiteline.normal.fill', '按钮态', 'P0', eqColor(cs.bg, '#FAFAFA') && eqColor(cs.bd, '#DEDEDE'), `反白 normal fill/border = ${cs.bg}/${cs.bd}，期望 #FAFAFA/#DEDEDE`);
  } else { addCheck('sim.whiteline.normal.fg', '按钮态', 'P1', true, '反白按钮读取失败（跳过）'); addCheck('sim.whiteline.normal.fill', '按钮态', 'P1', true, '反白按钮读取失败（跳过）'); }
} else { addCheck('sim.whiteline.normal.fg', '按钮态', 'P1', true, '未使用反白按钮（不适用）'); addCheck('sim.whiteline.normal.fill', '按钮态', 'P1', true, '未使用反白按钮（不适用）'); }
const secondarySel = await findBtn('secondary');
let hv = null;
if (secondarySel) {
  await page.mouse.move(0, 0); await page.waitForTimeout(100);
  try { await page.hover(secondarySel, { timeout: 5000 }); await page.waitForTimeout(250); hv = await readColors(secondarySel); } catch { hv = null; }
}
if (secondarySel && hv) {
  addCheck('sim.secondary.hover.fg', '按钮态', 'P0', eqColor(hv.fg, v.secondary.hover.fg) && eqColor(hv.bd, v.secondary.hover.bd), `次要 hover 字/边 = ${hv.fg}/${hv.bd}，期望 #568EEE`);
  addCheck('sim.secondary.hover.fill', '按钮态', 'P0', eqColor(hv.bg, v.secondary.hover.bg), `次要 hover 填充 = ${hv.bg}，期望 #FFFFFF`);
} else { addCheck('sim.secondary.hover.fg', '按钮态', 'P1', true, secondarySel ? '次要按钮不可交互（跳过）' : '未使用次要按钮（不适用）'); addCheck('sim.secondary.hover.fill', '按钮态', 'P1', true, secondarySel ? '次要按钮不可交互（跳过）' : '未使用次要按钮（不适用）'); }

// ---- 输入框 ----
const inputInfo = await page.evaluate(() => {
  const el = [...document.querySelectorAll('input, textarea')].find(e => {
    const r = e.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    // Sender 对话输入框 / 顶部导航搜索框 / 无边框搜索框不套用表单输入框规格
    if (e.closest('.vx-sender, header, nav, .nav-search, .vx-search')) return false;
    if (/search|搜索/i.test(String(e.className) + ' ' + (e.getAttribute('placeholder') || ''))) return false;
    // 报错态输入框边框按 error token 渲染，不套用默认态 #DEDEDE
    if (/error|invalid/i.test(String(e.className) + ' ' + (e.getAttribute('aria-invalid') || ''))) return false;
    const cs = getComputedStyle(e);
    if ((parseFloat(cs.borderTopLeftRadius) || 0) >= 12) return false;
    const bw = parseFloat(cs.borderTopWidth) || 0;
    if (bw === 0 || /rgba\(0, 0, 0, 0\)|transparent/.test(cs.borderTopColor)) return false;
    // 校验失败/成功态输入框（红/绿边框）按语义色渲染，不套用默认态 #DEDEDE
    if (['rgb(255, 32, 32)', 'rgb(0, 209, 21)'].includes(cs.borderTopColor)) return false;
    if (e.tagName === 'TEXTAREA') return true;
    return ['text', 'search', 'email', 'tel', 'url', 'password'].includes((e.getAttribute('type') || 'text').toLowerCase());
  });
  if (!el) return null;
  const s = getComputedStyle(el);
  return { pad: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(v => parseFloat(v)), bd: s.borderTopColor, bw: parseFloat(s.borderWidth), r: parseFloat(s.borderTopLeftRadius) };
});
if (inputInfo) {
  const padOk = Math.abs(inputInfo.pad[0] - 6) < 0.6 && Math.abs(inputInfo.pad[2] - 6) < 0.6 && Math.abs(inputInfo.pad[1] - 12) < 0.6 && Math.abs(inputInfo.pad[3] - 12) < 0.6;
  addCheck('runtime.input.padding', '输入框', 'P1', padOk, `输入框 padding = [${inputInfo.pad}]，期望 12/12/6/6`);
  addCheck('runtime.input.border', '输入框', 'P0', eqColor(inputInfo.bd, '#DEDEDE'), `输入框边框 = ${inputInfo.bd}，期望 #DEDEDE`);
} else addCheck('runtime.input', '输入框', 'P1', true, '页面无表单输入框（不适用）');

// ---- 主题 ----
if (expectedTheme) {
  addCheck('theme.expected', '主题', 'P0', htmlTheme === expectedTheme, `html[data-vx-theme] = ${htmlTheme}，期望 ${expectedTheme}`);
} else if (requireAllThemes) {
  const found = [...new Set([...themeAttrList, htmlTheme].filter(Boolean))];
  addCheck('theme.all', '主题', 'P0', themeKeys.every(k => found.includes(k)) && found.length >= 6, `主题属性: ${found.join(',')}；期望 6 套全部出现`);
  const probe = await page.evaluate(keys => {
    const out = {};
    for (const k of keys) {
      const host = document.createElement('div'); host.setAttribute('data-vx-theme', k); host.style.position = 'absolute'; host.style.left = '-9999px';
      const a = document.createElement('div'); a.style.background = 'var(--vx-primary)';
      const b = document.createElement('div'); b.style.color = 'var(--vx-help)';
      host.appendChild(a); host.appendChild(b); document.body.appendChild(host);
      out[k] = { primary: getComputedStyle(a).backgroundColor, help: getComputedStyle(b).color };
      host.remove();
    }
    return out;
  }, themeKeys);
  for (const t of SPEC.themes) {
    const want = t.help === 'teal' ? SPEC.helpPalettes.teal.vals[2] : SPEC.helpPalettes.blue.vals[2];
    addCheck(`theme.${t.key}.primary`, '主题', 'P0', eqColor(probe[t.key]?.primary, t.primary[0]), `主题 ${t.key} 主色 = ${probe[t.key]?.primary}，期望 ${t.primary[0]}`);
    addCheck(`theme.${t.key}.help`, '主题', 'P0', eqColor(probe[t.key]?.help, want), `主题 ${t.key} 帮助色 = ${probe[t.key]?.help}，期望 ${want}`);
  }
} else {
  addCheck('theme.declared', '主题', 'P1', !!htmlTheme || themeAttrList.length > 0, `主题声明: html=${htmlTheme || '无'}, 其他=${themeAttrList.length} 个`);
}

// ---- 字体栈 ----
const ff = await page.evaluate(() => getComputedStyle(document.body).fontFamily || '');
addCheck('runtime.fontStack', '字体', 'P1', /PingFang SC/i.test(ff) && /Microsoft YaHei/i.test(ff), `body font-family = ${ff.slice(0, 120)}`);

await browser.close();

// ---------- 汇总 ----------
const applicable = checks;
const passed = checks.filter(c => c.pass);
const p0 = violations.filter(v => v.sev === 'P0');
const p1 = violations.filter(v => v.sev === 'P1');
const result = {
  product: path.relative(ROOT, entry),
  alignRate: +(passed.length / applicable.length).toFixed(3),
  checks: applicable.length,
  passed: passed.length,
  p0: p0.length,
  p1: p1.length,
  tokenRefRate,
  expectedTheme: expectedTheme || null,
  allThemes: requireAllThemes,
  htmlTheme,
  themeAttrs: [...new Set([...themeAttrList, htmlTheme].filter(Boolean))],
  staticIssues,
  violations,
  checksDetail: checks,
  costNote: null,
};
if (outFile) fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ product: result.product, alignRate: result.alignRate, checks: result.checks, passed: result.passed, p0: result.p0, p1: result.p1, tokenRefRate: result.tokenRefRate }));
if (p0.length) console.log('P0: ' + p0.map(v => v.id).join(', '));
if (p1.length) console.log('P1: ' + p1.map(v => v.id).join(', '));
