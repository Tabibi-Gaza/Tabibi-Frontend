// Fix all JSX attribute replacements: =t('...') -> ={t('...')}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

// Files that need fixing
const files = [
  'src/pages/Admin pages/AdminDepartmentsManagement.jsx',
  'src/pages/Admin pages/AdminJoinRequests.jsx',
  'src/pages/Admin pages/AdminPaymentMethods.jsx',
  'src/pages/Admin pages/AdminProfile.jsx',
  'src/pages/Doctor pages/DoctorPayment .jsx',
  'src/pages/Doctor pages/DoctorSubscription.jsx',
  'src/pages/Doctor pages/MedicalExamination.jsx',
  'src/pages/Doctor pages/FinancialFiles.jsx',
];

let totalFixes = 0;

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  // Fix =t('...') -> ={t('...')} in JSX attributes
  // Pattern: a word char or " followed by =t(' then chars then ')
  const regex = /(\w|")=t\('([^']+)'\)/g;
  const newContent = content.replace(regex, (match, prefix, key) => {
    count++;
    return `${prefix}={t('${key}')}`;
  });
  
  if (count > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`FIXED: ${file} (${count} fixes)`);
    totalFixes += count;
  }
}

console.log(`\nTotal fixes: ${totalFixes}`);
