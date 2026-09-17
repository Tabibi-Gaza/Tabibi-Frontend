import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

const pagesDir = path.join(basePath, 'src/pages');
const files = [];
function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full);
    else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) files.push(full);
  }
}
walkDir(pagesDir);

const usedKeys = new Set();
const regex = /t\('([^']+)'\)/g;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    usedKeys.add(match[1]);
  }
}

const ar = JSON.parse(fs.readFileSync(path.join(basePath, 'src/locales/ar.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(basePath, 'src/locales/en.json'), 'utf8'));

function flattenKeys(obj, prefix = '') {
  const result = new Set();
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null) {
      for (const k of flattenKeys(val, fullKey)) result.add(k);
    } else {
      result.add(fullKey);
    }
  }
  return result;
}

const arKeys = flattenKeys(ar);
const enKeys = flattenKeys(en);

function getValue(obj, dotKey) {
  const parts = dotKey.split('.');
  let current = obj;
  for (const p of parts) {
    if (current && typeof current === 'object' && p in current) {
      current = current[p];
    } else {
      return null;
    }
  }
  return current;
}

const missing = [];
for (const key of usedKeys) {
  if (!arKeys.has(key)) missing.push(key);
}

missing.sort();
console.log(`Used keys: ${usedKeys.size}, ar.json keys: ${arKeys.size}, Missing: ${missing.length}\n`);

const byNs = {};
for (const key of missing) {
  const ns = key.split('.')[0];
  if (!byNs[ns]) byNs[ns] = [];
  byNs[ns].push(key);
}

// Build missing key structure for both ar and en
const missingAr = {};
const missingEn = {};

for (const key of missing) {
  const parts = key.split('.');
  const leaf = parts[parts.length - 1];
  const enVal = getValue(en, key);
  const displayEn = typeof enVal === 'string' ? enVal : key;
  
  // For Arabic, try to find the base namespace and build a reasonable translation
  let arVal = null;
  // Check if there's a similar key
  const nsParts = key.split('.');
  
  let arObj = missingAr;
  let enObj = missingEn;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in arObj)) arObj[parts[i]] = {};
    if (!(parts[i] in enObj)) enObj[parts[i]] = {};
    arObj = arObj[parts[i]];
    enObj = enObj[parts[i]];
  }
  arObj[leaf] = displayEn;
  enObj[leaf] = displayEn;
}

// Print missing keys
for (const [ns, keys] of Object.entries(byNs).sort()) {
  console.log(`\n--- ${ns} (${keys.length}) ---`);
  for (const k of keys) {
    const enVal = getValue(en, k);
    console.log(`  ${k}: en=${enVal || 'NEEDS ENGLISH'}`);
  }
}

// Write to files
console.log('\n--- Updates needed ---');
console.log(`\nArabic missing keys (to add to ar.json): ${JSON.stringify(missingAr, null, 2).length} bytes`);
console.log(`English missing keys (to add to en.json): ${JSON.stringify(missingEn, null, 2).length} bytes`);

fs.writeFileSync(path.join(basePath, 'scripts', 'missing-ar.json'), JSON.stringify(missingAr, null, 2), 'utf8');
fs.writeFileSync(path.join(basePath, 'scripts', 'missing-en.json'), JSON.stringify(missingEn, null, 2), 'utf8');
console.log('\nWrote missing-ar.json and missing-en.json');
