/**
 * extract-spec.mjs — 从冻结的验收 Gallery 提取机器可读真值 spec.json
 *
 * 数据来源(双重):
 *  1) Gallery 的 DATA 结构(渲染声明的源值: token/hex/usage/button BTN/尺寸/间距)
 *  2) 实际渲染 DOM 的 computed style(交叉校验:声明值确实渲染到页面)
 *  3) localStorage 检核状态(pass→freezeSource='pass';fail/unchecked→'user-ruling')
 *
 * 用法: node extract-spec.mjs [输出路径]
 * 默认输出: ../../ground-truth/spec.json
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');           // PPT/voyah-skill-eval
const GALLERY = path.join(ROOT, 'ground-truth/spec-gallery.html');
const OUT = process.argv[2] || path.join(ROOT, 'ground-truth/spec.json');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
await page.goto('file://' + GALLERY);
await page.waitForTimeout(300);

// ---- 1) 从页面数据模型导出所有条目(6 主题各一遍) ----
const data = await page.evaluate(() => {
  const state = JSON.parse(localStorage.getItem(KEY) || '{}');
  const out = { themes: THEMES, helpPalettes: HELP_PALETTES, btn: BTN, btnSizes: BTN_SIZES, items: [], state };
  const secNames = { color: '色彩', line: '线条', font: '字体', button: '按钮', spacing: '间距' };

  const pushItem = (it, section, group, themeScope) => {
    if (!it || it.labelOnly) return;
    const st = state[it.id] || {};
    let spec = null;
    if (it.sample) spec = { type: 'color', hex: it.hex, bg: it.sample.bg, fg: it.sample.fg, text: it.sample.text };
    else if (it.demo && it.demo.size) {
      const bm = it.id.match(/^button\.(.+)\.(normal|hover|click|disabled)$/);
      const sm = it.id.match(/^button\.(size|variant\.icon)\.(large|middle|small)$/);
      if (bm) spec = { type: 'button-state', variant: bm[1], state: bm[2], size: it.demo.size, v: it.demo.btn };
      else if (sm) spec = { type: 'button-size', kind: sm[1], size: sm[2], v: BTN_SIZES[sm[2]], icon: sm[1] === 'variant.icon' };
    } else if (it.demo && it.demo.gap !== undefined) spec = { type: 'spacing', gap: it.demo.gap };
    else if (it.demo && it.demo.pad) spec = { type: 'padding', pad: it.demo.pad, label: it.demo.label };
    else if (it.demo && it.demo.shadow) spec = { type: 'shadow', shadow: it.demo.shadow };
    else if (it.demo && (it.demo.hdivider || it.demo.vdivider)) spec = { type: 'divider', kind: it.demo.hdivider ? 'horizontal' : 'vertical', raw: it.hex };
    else if (it.demo && it.demo.w) spec = { type: 'line-width', width: it.demo.w, style: it.demo.style, color: it.demo.color || null };
    else if (it.demo && it.demo.css) spec = { type: 'font', css: it.demo.css, text: it.demo.font };
    out.items.push({
      id: it.id, section, sectionId: section, group, themeScope,
      token: it.token || null, hex: it.hex || null, usage: it.usage || null,
      flag: it.flag || null, uflag: it.uflag || null,
      freeze: { status: st.status || 'unchecked', locked: !!st.locked, note: st.note || '',
                source: st.status === 'pass' ? 'pass' : 'user-ruling' },
      spec
    });
  };

  // 共享组(色彩共享 + 线条/字体/按钮/间距)
  DATA[0].groups.forEach(g => g.items.forEach(it => pushItem(it, secNames.color, g.name, 'shared')));
  for (let i = 1; i < DATA.length; i++) {
    const secId = DATA[i].id;
    DATA[i].groups.forEach(g => g.items.forEach(it => pushItem(it, secNames[secId], g.name, 'shared')));
  }
  // 主题组(逐主题)
  THEMES.forEach(t => {
    curTheme = t.key;
    DATA[0].themeGroups().forEach(g => g.items.forEach(it => pushItem(it, secNames.color, g.name, t.key)));
  });
  curTheme = 'blue';
  return out;
});

// ---- 2) 逐主题渲染,采集 computed style(交叉校验) ----
const rendered = {};
const themeKeys = data.themes.map(t => t.key);
for (const key of themeKeys) {
  await page.evaluate(k => { curTheme = k; render(); }, key);
  await page.waitForTimeout(120);
  const snap = await page.evaluate(() => {
    const r = {};
    document.querySelectorAll('.el[data-spec-id]').forEach(el => {
      const id = el.dataset.specId;
      const vbtn = el.querySelector('.vbtn');
      const chip = el.querySelector('.chip');
      const rec = {};
      if (vbtn) {
        const cs = getComputedStyle(vbtn);
        rec.button = { color: cs.color, backgroundColor: cs.backgroundColor, borderColor: cs.borderColor,
                       borderWidth: cs.borderTopWidth, fontSize: cs.fontSize, lineHeight: cs.lineHeight,
                       height: cs.height, borderRadius: cs.borderRadius,
                       paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
                       paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft };
        const icon = vbtn.querySelector('.iconph');
        if (icon) { const ic = getComputedStyle(icon); rec.icon = { width: ic.width, height: ic.height }; }
      } else if (chip && chip.style.background) {
        const cs = getComputedStyle(chip);
        rec.swatch = { backgroundColor: cs.backgroundColor, color: cs.color };
      }
      const inner = el.querySelector('.chip > div');
      if (inner) {
        const cs = getComputedStyle(inner);
        const box = { paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
                      paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
                      boxShadow: cs.boxShadow, width: cs.width, height: cs.height };
        if (cs.borderTopStyle !== 'none')
          box.borderTop = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
        const spacer = inner.querySelector('div[style*="width"]');
        if (spacer && spacer.style.width) box.spacerWidth = spacer.style.width;
        if (inner.classList.contains('fontdemo'))
          box.font = { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
                       lineHeight: cs.lineHeight, color: cs.color };
        rec.box = box;
      }
      r[id] = rec;
    });
    return r;
  });
  rendered[key] = snap;
}

// ---- 3) 合并(同 id 跨主题去重,如 color.aux.help-blue.* 在 5 个非蓝主题下同 id)+ 写盘 ----
const merged = new Map();
for (const it of data.items) {
  const ex = merged.get(it.id);
  if (!ex) { merged.set(it.id, { ...it, themeScopes: [it.themeScope] }); }
  else {
    if (!ex.themeScopes.includes(it.themeScope)) ex.themeScopes.push(it.themeScope);
  }
}
const items = [...merged.values()];
for (const it of items) {
  if (it.themeScopes.length > 1 && it.themeScopes.includes('shared')) it.themeScope = 'shared';
  else if (it.themeScopes.length > 1) it.themeScope = 'multi-theme';   // 非蓝主题共享帮助板
  it.rendered = {};
  for (const key of themeKeys) {
    const rec = rendered[key][it.id];
    if (rec && Object.keys(rec).length) it.rendered[key] = rec;
  }
  it.renderedPrimary = Object.values(it.rendered)[0] || null;
}
const byId = Object.fromEntries(items.map(i => [i.id, i]));

const meta = {
  source: 'PPT/voyah-skill-eval/ground-truth/spec-gallery.html',
  baselineTag: 'baseline-v4',
  extractedAt: new Date().toISOString(),
  themeCount: themeKeys.length,
  itemCount: items.length,
  blueViewCount: items.filter(i => ['shared', 'blue'].includes(i.themeScope)).length,
  counts: {
    pass: items.filter(i => i.freeze.status === 'pass').length,
    fail: items.filter(i => i.freeze.status === 'fail').length,
    unchecked: items.filter(i => i.freeze.status === 'unchecked').length,
    shared: items.filter(i => i.themeScope === 'shared').length,
    themeScoped: items.filter(i => i.themeScope !== 'shared').length,
  },
};

const doc = {
  meta,
  themes: data.themes,
  helpPalettes: data.helpPalettes,
  buttons: { variants: data.btn, sizes: data.btnSizes },
  items,
  byId,
};

fs.writeFileSync(OUT, JSON.stringify(doc, null, 2));
await browser.close();

console.log(`✓ ${OUT}`);
console.log(`  items=${meta.itemCount} (shared=${meta.counts.shared}, themeScoped=${meta.counts.themeScoped})`);
console.log(`  freeze: pass=${meta.counts.pass} fail=${meta.counts.fail} unchecked=${meta.counts.unchecked}`);
const noRender = items.filter(i => !i.renderedPrimary).map(i => i.id);
console.log(`  rendered-missing=${noRender.length}${noRender.length ? ': ' + noRender.join(', ') : ''}`);
