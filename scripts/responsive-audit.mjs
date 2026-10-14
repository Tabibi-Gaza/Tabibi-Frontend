import { chromium, firefox, webkit } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const OUT = path.resolve('scripts/artifacts');
fs.mkdirSync(OUT, { recursive: true });

const PUBLIC_ROUTES = [
  '/', '/home-v2', '/login', '/doctors', '/about', '/contact', '/faqs', '/terms',
  '/privacy-policy', '/pharmacies', '/medical-centers', '/labs', '/register-doctor',
  '/favorites', '/cart', '/notifications', '/medical-history', '/chats',
  '/financial-transactions', '/my-appointment', '/my-profile', '/my-prescriptions',
  '/medical-files',
];
const ADMIN_ROUTES = [
  '/admin-dashboard', '/admin/profile', '/admin/notifications', '/admin/users-management',
  '/admin/departments-management', '/admin/join-requests', '/admin/chats',
  '/admin/financial-transactions', '/admin/payment-methods', '/admin/contact-us',
];
const DOCTOR_ROUTES = [
  '/doctor-dashboard', '/doctor/notifications', '/doctor/schedule', '/doctor/patients',
  '/doctor/chats', '/doctor/payments', '/doctor/financials', '/doctor/appointments',
  '/doctor/secretary-management', '/doctor/change-password', '/doctor/subscription',
];

const VPS_FULL = [
  { w: 320, h: 568 }, { w: 390, h: 844 }, { w: 430, h: 932 },
  { w: 740, h: 360 }, { w: 768, h: 1024 }, { w: 820, h: 1180 },
  { w: 1024, h: 1366 }, { w: 1280, h: 800 }, { w: 1440, h: 900 }, { w: 1920, h: 1080 },
];
const VPS_SUB = [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1440, h: 900 }];

const CHECK = () => {
  const vw = window.innerWidth;
  const out = { scrolledX: 0, overflow: [], smallTaps: [] };
  window.scrollTo(9999, 0);
  out.scrolledX = Math.round(window.scrollX);
  window.scrollTo(0, 0);

  const desc = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).slice(0, 3).join('.');
    if (c) s += '.' + c;
    return s.slice(0, 140);
  };
  const scrollableXAncestor = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const o = getComputedStyle(p).overflowX;
      if (o === 'auto' || o === 'scroll') return true;
      p = p.parentElement;
    }
    return false;
  };

  for (const el of document.querySelectorAll('body *')) {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') continue;
    if (st.position === 'fixed') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.left >= vw - 1 || r.right <= 1) continue;
    if (scrollableXAncestor(el)) continue;
    if (r.right > vw + 2 || r.left < -2) {
      out.overflow.push({ sel: desc(el), l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) });
    }
  }

  if (vw <= 430) {
    for (const el of document.querySelectorAll('a,button,input,select,textarea,[role=button]')) {
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.width < 30 || r.height < 30) out.smallTaps.push({ sel: desc(el), w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  return out;
};

const seeds = {
  public: { roles: ['User'], name: 'Audit' },
  admin: { roles: ['Admin'], name: 'Audit Admin' },
  doctor: { roles: ['Doctor'], name: 'Audit Doctor' },
};

function buildTasks() {
  const tasks = [];
  const add = (routes, group, vps, browsers) => {
    for (const r of routes)
      for (const vp of vps)
        for (const b of browsers) tasks.push({ route: r, vp, browser: b, group });
  };
  add(PUBLIC_ROUTES, 'public', VPS_FULL, ['chromium']);
  add(ADMIN_ROUTES, 'admin', VPS_FULL, ['chromium']);
  add(DOCTOR_ROUTES, 'doctor', VPS_FULL, ['chromium']);
  add(PUBLIC_ROUTES, 'public', VPS_SUB, ['firefox', 'webkit']);
  add(ADMIN_ROUTES, 'admin', VPS_SUB, ['firefox', 'webkit']);
  add(DOCTOR_ROUTES, 'doctor', VPS_SUB, ['firefox', 'webkit']);
  return tasks;
}

const launchers = { chromium, firefox, webkit };
const report = [];

async function runTask(browser, t) {
  const ctx = await browser.newContext({ viewport: { width: t.vp.w, height: t.vp.h } });
  await ctx.addInitScript((seed) => {
    try {
      localStorage.setItem('user', JSON.stringify(seed));
      localStorage.setItem('accessToken', 'audit-fake-token');
    } catch (e) {}
  }, seeds[t.group]);
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on('pageerror', (e) => jsErrors.push(String(e).slice(0, 220)));
  let entry = { ...t, ok: true, redirected: false, issues: [], jsErrors };
  try {
    await page.goto(BASE + t.route, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(1600);
    const finalUrl = page.url();
    if (finalUrl.replace(BASE, '').split('?')[0] !== t.route) entry.redirected = finalUrl.replace(BASE, '');
    const f = await page.evaluate(CHECK);
    if (f.scrolledX > 0) entry.issues.push({ type: 'page-hscroll', scrolledX: f.scrolledX });
    if (f.overflow.length) entry.issues.push({ type: 'overflow', els: f.overflow.slice(0, 8), total: f.overflow.length });
    if (f.smallTaps.length) entry.issues.push({ type: 'small-taps', els: f.smallTaps.slice(0, 8), total: f.smallTaps.length });
    if (entry.issues.length || jsErrors.length) {
      const name = `${t.browser}-${t.route.replace(/\W+/g, '_')}-${t.vp.w}x${t.vp.h}.png`;
      await page.screenshot({ path: path.join(OUT, name), timeout: 8000 }).catch(() => {});
      entry.screenshot = name;
    }
  } catch (e) {
    entry.ok = false;
    entry.error = String(e).slice(0, 220);
  }
  await ctx.close();
  report.push(entry);
}

const tasks = buildTasks();
console.log(`tasks: ${tasks.length}`);
const CONC = 6;
const browsers = {};
for (const name of Object.keys(launchers)) browsers[name] = await launchers[name]().catch(() => null);

let i = 0;
async function worker() {
  while (i < tasks.length) {
    const idx = i++;
    const t = tasks[idx];
    if (!browsers[t.browser]) {
      report.push({ ...t, ok: false, error: 'browser unavailable', issues: [], jsErrors: [] });
      continue;
    }
    process.stderr.write(`\r[${t.browser}] ${idx + 1}/${tasks.length} ${t.route} ${t.vp.w}   `);
    await runTask(browsers[t.browser], t);
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));

for (const b of Object.values(browsers)) if (b) await b.close();

fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
const bad = report.filter((r) => !r.ok || r.issues.length || r.jsErrors.length || r.redirected);
console.log(`\n=== DONE: ${report.length} checks, ${bad.length} with findings ===`);
for (const r of bad) {
  const why = [];
  if (!r.ok) why.push('NAV-FAIL: ' + r.error);
  if (r.redirected) why.push('redirected→' + r.redirected);
  for (const is of r.issues) {
    if (is.type === 'page-hscroll') why.push(`HSCROLL ${is.scrolledX}px`);
    if (is.type === 'overflow') why.push(`OVERFLOW x${is.total}: ${is.els.map((e) => e.sel).join(' | ')}`);
    if (is.type === 'small-taps') why.push(`TAPS x${is.total}: ${is.els.map((e) => `${e.sel}(${e.w}x${e.h})`).join(' | ')}`);
  }
  if (r.jsErrors.length) why.push(`JS: ${r.jsErrors[0]}`);
  console.log(`\n[${r.browser}] ${r.route} @${r.vp.w}x${r.vp.h}\n  ${why.join('\n  ')}`);
}
