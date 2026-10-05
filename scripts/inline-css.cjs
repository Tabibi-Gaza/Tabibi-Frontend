const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const htmlPath = path.join(dist, 'index.html');
const assetsDir = path.join(dist, 'assets');

let html = fs.readFileSync(htmlPath, 'utf8');

const linkRe = /<link\s+rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g;
let m;
let inlined = 0;

while ((m = linkRe.exec(html)) !== null) {
  const cssPath = path.join(dist, m[1].replace(/^\//, ''));
  if (!fs.existsSync(cssPath)) continue;
  const css = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(m[0], `<style data-inlined="1">\n${css}\n</style>`);
  inlined++;
}

function firstMatch(pattern) {
  const files = fs.readdirSync(assetsDir).filter((f) => pattern.test(f));
  return files.sort()[0] || null;
}

const preloadTargets = [firstMatch(/^HomeV3-.*\.js$/)].filter(Boolean);
const links = preloadTargets
  .map((f) => `<link rel="modulepreload" crossorigin href="/assets/${f}">`)
  .join('\n    ');

if (links && !html.includes('rel="modulepreload" crossorigin href="/assets/HomeV3')) {
  html = html.replace('</head>', `    ${links}\n  </head>`);
}

fs.writeFileSync(htmlPath, html);

const cssNames = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
const entryJs = fs.readdirSync(assetsDir)
  .filter((f) => /^index-.*\.js$/.test(f))
  .sort((a, b) => fs.statSync(path.join(assetsDir, b)).size - fs.statSync(path.join(assetsDir, a)).size)[0];
let stripped = 0;
if (entryJs) {
  for (const f of fs.readdirSync(assetsDir)) {
    if (!f.endsWith('.js')) continue;
    const p = path.join(assetsDir, f);
    let js = fs.readFileSync(p, 'utf8');
    let changed = false;
    for (const c of cssNames) {
      const lit = `assets/${c}`;
      const rep = `assets/${entryJs}`;
      for (const v of [`,"${lit}"`, `"${lit}",`, `"${lit}"`]) {
        if (js.includes(v)) {
          js = js.replace(v, v.split(lit).join(rep));
          changed = true;
          stripped++;
          break;
        }
      }
    }
    if (changed) fs.writeFileSync(p, js);
  }
}

console.log(`inline-css: ${inlined} stylesheet(s) inlined, ${preloadTargets.length} modulepreload(s) added, ${stripped} css preload ref(s) neutralized`);
