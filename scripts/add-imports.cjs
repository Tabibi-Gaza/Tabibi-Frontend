// Script to add useTranslation import and hook to remaining files
const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/pages/Doctor pages/DoctorPayment .jsx',
  'src/pages/Doctor pages/DoctorSubscription.jsx',
  'src/pages/Doctor pages/Appointment Management.jsx',
  'src/pages/Doctor pages/MedicalExamination.jsx',
  'src/pages/Doctor pages/FinancialFiles.jsx',
  'src/pages/Admin pages/AdminJoinRequests.jsx',
  'src/pages/Admin pages/AdminDepartmentsManagement.jsx',
  'src/pages/Admin pages/AdminPaymentMethods.jsx',
  'src/pages/Admin pages/AdminFinancialTransactions.jsx',
  'src/pages/Admin pages/AdminProfile.jsx',
  'src/pages/Admin pages/AdminPharmaceutical.jsx'
];

const basePath = path.join(__dirname, '..');

for (const file of filesToProcess) {
  const filePath = path.join(basePath, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} (not found)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add useTranslation import if missing
  if (!content.includes("useTranslation")) {
    // Find the last import line
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, "import { useTranslation } from 'react-i18next';");
      content = lines.join('\n');
    }
  }
  
  // Add const { t } = useTranslation(); if missing
  if (!content.includes("const { t } = useTranslation()")) {
    // Find the component function start
    // Try patterns: export default function, const X = () => {, function X(
    const patterns = [
      /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/,
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/,
      /function\s+\w+\s*\([^)]*\)\s*\{/,
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const insertIndex = content.indexOf(match[0]) + match[0].length;
        content = content.slice(0, insertIndex) + "\n    const { t } = useTranslation();" + content.slice(insertIndex);
        break;
      }
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`DONE: ${file}`);
}

console.log('\nAll import/hook additions complete!');
