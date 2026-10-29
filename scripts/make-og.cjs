const sharp = require('sharp');
const fs = require('fs');

const svg = `<svg width='1200' height='630' xmlns='http://www.w3.org/2000/svg'>
  <rect width='1200' height='630' fill='#ffffff'/>
  <rect x='0' y='0' width='1200' height='12' fill='#138C9F'/>
  <rect x='0' y='618' width='1200' height='12' fill='#003D9B'/>
  <text x='600' y='360' font-family='Segoe UI, Tahoma, Arial' font-size='78' font-weight='800' fill='#003D9B' text-anchor='middle'>طبيبي  ·  Tabibi</text>
  <text x='600' y='430' font-family='Segoe UI, Tahoma, Arial' font-size='34' font-weight='600' fill='#138C9F' text-anchor='middle'>منصة طبية رقمية في غزة  ·  Digital Medical Platform in Gaza</text>
  <text x='600' y='500' font-family='Segoe UI, Tahoma, Arial' font-size='26' font-weight='400' fill='#64748b' text-anchor='middle'>حجز مواعيد · سجلات طبية · وصفات إلكترونية · صيدليات · مختبرات · مراكز طبية</text>
</svg>`;

sharp('src/assets/assets_frontend/logo.png')
  .resize({ height: 160, fit: 'contain' })
  .toBuffer()
  .then((lb) => {
    const meta = sharp(lb).metadata();
    return meta.then((m) => ({ lb, w: m.width }));
  })
  .then(({ lb, w }) => {
    return sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
      .composite([
        { input: lb, top: 120, left: Math.round((1200 - w) / 2) },
        { input: Buffer.from(svg), top: 0, left: 0 },
      ])
      .jpeg({ quality: 92 })
      .toFile('public/images/og-cover.jpg');
  })
  .then(() => console.log('OK og-cover.jpg'))
  .catch((e) => console.log('ERR', e.message));
