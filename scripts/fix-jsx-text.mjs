// Fix all bare t('...') in JSX text content: > t('...') < > {t('...')} <
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

const files = [
  'src/pages/Admin pages/AdminDepartmentsManagement.jsx',
  'src/pages/Admin pages/AdminJoinRequests.jsx',
  'src/pages/Admin pages/AdminPaymentMethods.jsx',
  'src/pages/Admin pages/AdminProfile.jsx',
  'src/pages/Admin pages/AdminFinancialTransactions.jsx',
  'src/pages/Admin pages/AdminPharmaceutical.jsx',
  'src/pages/Doctor pages/DoctorPayment .jsx',
  'src/pages/Doctor pages/DoctorSubscription.jsx',
  'src/pages/Doctor pages/MedicalExamination.jsx',
  'src/pages/Doctor pages/FinancialFiles.jsx',
  'src/pages/Doctor pages/Appointment Management.jsx',
];

let totalFixes = 0;

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} (not found)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  // Fix > t('...') </...  -> {t('...')}
  // Pattern: > followed by spaces, then t('...'), then whitespace, then <
  const regex = /(>)\s*t\('([^']+)'\)\s*(<)/g;
  const newContent = content.replace(regex, (match, gt, key, lt) => {
    count++;
    return `${gt}{t('${key}')}${lt}`;
  });
  
  if (count > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`FIXED: ${file} (${count} fixes)`);
    totalFixes += count;
  } else {
    console.log(`OK: ${file} (no changes needed)`);
  }
}

console.log(`\nTotal fixes: ${totalFixes}`);
