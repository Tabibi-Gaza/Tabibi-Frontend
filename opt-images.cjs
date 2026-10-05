const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pub = path.join(__dirname, 'public');
const files = [];
async function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) await walk(p);
    else if (/\.(jpe?g|png)$/i.test(e.name)) files.push(p);
  }
}
(async () => {
  await walk(pub);
  let saved = 0, total = 0;
  const log = [];
  for (const p of files) {
    const before = fs.statSync(p).size;
    const dest = p.replace(/\.(jpe?g|png)$/i, '.webp');
    if (fs.existsSync(dest)) continue;
    try {
      const q = /feature|hero|default|payment/i.test(p) ? 78 : 82;
      await sharp(p).webp({ quality: q, effort: 5 }).toFile(dest);
      const after = fs.statSync(dest).size;
      saved += (before - after); total += before;
      log.push(`${path.relative(pub, p)}  ${Math.round(before/1024)}KB -> ${Math.round(after/1024)}KB`);
    } catch (e) { log.push('FAIL ' + path.relative(pub, p) + ' ' + e.message); }
  }
  console.log(log.join('\n'));
  console.log('processed KB=' + Math.round(total/1024) + ' saved KB=' + Math.round(saved/1024));
})();
