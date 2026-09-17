// MedicalExamination.jsx specific replacements
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

const filePath = path.join(basePath, 'src/pages/Doctor pages/MedicalExamination.jsx');

if (!fs.existsSync(filePath)) {
  console.log('File not found');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  ['\u0628\u062F\u0621 \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u0637\u0628\u064A', "t('medicalExamination.startExamination')"],
  ['\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A \u0627\u0644\u0634\u062E\u0635\u064A', "t('medicalExamination.personalMedicalRecord')"],
  ['\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0628\u064A', "t('medicalExamination.medicalHistory')"],
  ['\u062D\u0641\u0638 \u0648\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0643\u0634\u0641', "t('medicalExamination.saveAndComplete')"],
  ['\u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u064A\u0636', "t('medicalExamination.patientName')"],
  ['\u0627\u0644\u0639\u0645\u0631', "t('medicalExamination.age')"],
  ['\u0641\u0635\u064A\u0644\u0629 \u0627\u0644\u062F\u0645', "t('medicalExamination.bloodType')"],
  ['\u0634\u0627\u0634\u0629 \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u062D\u0627\u0644\u064A', "t('medicalExamination.currentExamination')"],
  ['\u0625\u0646\u0634\u0627\u0621 \u0648\u0635\u0641\u0629 \u0637\u0628\u064A\u0629', "t('medicalExamination.createPrescription')"],
  ['\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621', "t('medicalExamination.medicineName')"],
  ['\u0627\u0644\u062C\u0631\u0639\u0629', "t('medicalExamination.dosage')"],
  ['\u0627\u0644\u062A\u0643\u0631\u0627\u0631', "t('medicalExamination.frequency')"],
  ['\u0627\u0644\u0645\u062F\u0629', "t('medicalExamination.duration')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u0625\u0644\u0649 \u0627\u0644\u0648\u0635\u0641\u0629', "t('medicalExamination.addToPrescription')"],
  ['\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629', "t('medicalExamination.addedMedicines')"],
  ['\u0627\u0644\u0623\u0639\u0631\u0627\u0636', "t('medicalExamination.symptoms')"],
  ['\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0627\u0644\u0633\u0631\u064A\u0631\u064A\u0629', "t('medicalExamination.clinicalNotes')"],
  ['\u0627\u0644\u062A\u0634\u062E\u064A\u0635', "t('medicalExamination.diagnosis')"],
  ['\u0627\u0644\u0623\u0645\u0631\u0627\u0636 \u0627\u0644\u0645\u0632\u0645\u0646\u0629', "t('medicalExamination.chronicDiseases')"],
  ['\u0627\u0644\u062D\u0633\u0627\u0633\u064A\u0629 \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0648\u0627\u0644\u062F\u0648\u0627\u0626\u064A\u0629', "t('medicalExamination.foodAndDrugAllergies')"],
  ['\u0627\u0644\u0642\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u062D\u064A\u0648\u064A\u0629', "t('medicalExamination.vitalSigns')"],
  ['\u0636\u063A\u0637 \u0627\u0644\u062F\u0645', "t('medicalExamination.bloodPressure')"],
  ['\u0633\u0643\u0631 \u0627\u0644\u062F\u0645', "t('medicalExamination.bloodSugar')"],
  ['\u0627\u0644\u0648\u0632\u0646', "t('medicalExamination.weight')"],
  ['\u0627\u0644\u0637\u0648\u0644', "t('medicalExamination.height')"],
  ['\u0627\u0644\u062A\u062F\u062E\u064A\u0646 \u0648\u0646\u0645\u0637 \u0627\u0644\u062D\u064A\u0627\u0629', "t('medicalExamination.smokingAndLifestyle')"],
  ['\u0645\u062F\u062E\u0646', "t('medicalExamination.smoker')"],
  ['\u063A\u064A\u0631 \u0645\u062F\u062E\u0646', "t('medicalExamination.nonSmoker')"],
  ['\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0648\u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0629 \u0627\u0644\u0645\u0644\u062A\u0632\u0645 \u0628\u0647\u0627', "t('medicalExamination.currentMedications')"],
  ['\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621/\u0627\u0644\u0639\u0644\u0645\u064A', "t('medicalExamination.medicineNameHeader')"],
  ['\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0645\u0631\u0627\u0636 \u0645\u0632\u0645\u0646\u0629 \u0645\u0633\u062C\u0644\u0629', "t('medicalExamination.noChronicDiseases')"],
  ['\u0644\u0627 \u062A\u0648\u062C\u062F \u062D\u0633\u0627\u0633\u064A\u0629 \u0645\u0633\u062C\u0644\u0629', "t('medicalExamination.noAllergies')"],
  ['\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0645\u0633\u062C\u0644\u0629', "t('medicalExamination.noMedicationsRecorded')"],
  ['\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A \u0627\u0644\u0634\u062E\u0635\u064A', "t('medicalExamination.editPersonalRecord')"],
  ['\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0629 \u0644\u0644\u0645\u0631\u064A\u0636', "t('medicalExamination.editPatientData')"],
  ['\u0647\u0644 \u0627\u0644\u0645\u0631\u064A\u0636 \u0645\u062F\u062E\u0646\u061F', "t('medicalExamination.isPatientSmoker')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u0645\u0631\u0636 \u0645\u0632\u0645\u0646', "t('medicalExamination.addChronicDisease')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u062D\u0633\u0627\u0633\u064A\u0629', "t('medicalExamination.addAllergy')"],
  ['\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629', "t('medicalExamination.manageCurrentMedications')"],
  ['\u0625\u062F\u0631\u0627\u062C', "t('medicalExamination.insert')"],
  ['\u0627\u0644\u062F\u0648\u0627\u0621', "t('medicalExamination.medicine')"],
  ['\u0628\u062D\u062B \u0628\u062D\u0633\u0628 \u0627\u0644\u062A\u0627\u0631\u064A\u062E', "t('medicalExamination.searchByDate')"],
  ['\u0627\u0644\u062A\u062E\u0635\u0635', "t('medicalExamination.specialization')"],
  ['\u0627\u0644\u0643\u0644', "t('medicalExamination.all')"],
  ['\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0641\u0644\u0627\u062A\u0631', "t('medicalExamination.applyFilters')"],
  ['\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637', "t('medicalExamination.resetFilters')"],
  ['\u0632\u064A\u0627\u0631\u0629 \u0637\u0628\u064A\u0629', "t('medicalExamination.medicalVisit')"],
  ['\u0627\u0644\u0633\u0627\u0639\u0629', "t('medicalExamination.atTime')"],
  ['\u0645\u0646\u062A\u0647\u064A\u0629', "t('medicalExamination.completed')"],
  ['\u062D\u0630\u0641 \u0627\u0644\u0633\u062C\u0644', "t('medicalExamination.deleteRecord')"],
  ['\u0627\u0633\u0645 \u0627\u0644\u0637\u0628\u064A\u0628', "t('medicalExamination.doctorName')"],
  ['\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A', "t('medicalExamination.notes')"],
  ['\u0627\u0644\u0648\u0635\u0641\u0629 \u0627\u0644\u0637\u0628\u064A\u0629', "t('medicalExamination.prescription')"],
  ['\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0645\u0631\u064A\u0636 \u2713', "t('medicalExamination.sentToPatient')"],
  ['\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0648\u0634\u062A\u0629', "t('medicalExamination.resendPrescription')"],
  ['\u0625\u0631\u0633\u0627\u0644 \u0648\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0631\u0648\u0634\u062A\u0629', "t('medicalExamination.sendAndExportPrescription')"],
  ['\u0644\u0627 \u062A\u0648\u062C\u062F \u0633\u062C\u0644\u0627\u062A \u0643\u0634\u0641 \u0637\u0628\u064A \u0633\u0627\u0628\u0642\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u0645\u0631\u064A\u0636.', "t('medicalExamination.noPreviousRecords')"],
  ['\u0631\u0645\u0632 QR \u0644\u0644\u0633\u062C\u0644 \u0627\u0644\u0637\u0628\u064A', "t('medicalExamination.qrCodeForRecord')"],
  ['\u0627\u0645\u0633\u062D \u0647\u0630\u0627 \u0627\u0644\u0631\u0645\u0632 \u0644\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0633\u0631\u064A\u0639 \u0644\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A', "t('medicalExamination.scanForQuickAccess')"],
  ['\u0635\u0627\u0644\u062D \u062D\u062A\u0649', "t('medicalExamination.validUntil')"],
  ['\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637', "t('medicalExamination.openLink')"],
  ['\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0631\u064A\u0636...', "t('medicalExamination.loadingPatientData')"],
  ['\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0631\u064A\u0636', "t('medicalExamination.patientNotFound')"],
  ['\u062C\u0627\u0631\u064A \u0627\u0644\u0625\u0646\u0634\u0627\u0621...', "t('medicalExamination.generating')"],
  ['\u0631\u0645\u0632 QR \u0644\u0644\u0633\u062C\u0644', "t('medicalExamination.qrCodeForRecord')"],
  ['\u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641', "t('medicalExamination.unknown')"],
  ['\u063A\u064A\u0631 \u0645\u062D\u062F\u062F', "t('medicalExamination.notSpecified')"],
  ['\u0633\u0646\u0629', "t('medicalExamination.years')"],
  ['\u0643\u063A', "t('medicalExamination.kg')"],
  ['\u0633\u0645', "t('medicalExamination.cm')"],
  ['\u0644\u0645 \u064A\u062A\u0645 \u0625\u062F\u0631\u0627\u062C \u0623\u064A \u0645\u0631\u0636 \u0628\u0639\u062F...', "t('medicalExamination.noDiseasesAdded')"],
  ['\u0644\u0645 \u064A\u062A\u0645 \u0625\u062F\u0631\u0627\u062C \u0623\u064A \u062D\u0633\u0627\u0633\u064A\u0629 \u0628\u0639\u062F...', "t('medicalExamination.noAllergiesAdded')"],
  ['\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A', "t('common.saveChanges')"],
  ['\u062C\u0627\u0631\u064A \u0627\u0644\u062D\u0641\u0638...', "t('medicalExamination.saving')"],
  ['\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A', "t('medicalExamination.saveError')"],
  ['\u062A\u0645 \u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0643\u0634\u0641 \u0627\u0644\u0637\u0628\u064A \u0628\u0646\u062C\u0627\u062D!', "t('medicalExamination.examinationSaved')"],
  ['\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0637\u0628\u064A \u0628\u0646\u062C\u0627\u062D', "t('medicalExamination.recordDeleted')"],
  ['\u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0633\u062C\u0644', "t('medicalExamination.deleteFailed')"],
  ['\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062D\u0630\u0641', "t('medicalExamination.deleteError')"],
  ['\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0648\u0634\u062A\u0629 \u0644\u0644\u0645\u0631\u064A\u0636 \u0628\u0646\u062C\u0627\u062D', "t('medicalExamination.prescriptionSent')"],
  ['\u0641\u0634\u0644 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0648\u0634\u062A\u0629', "t('medicalExamination.prescriptionSendFailed')"],
  ['\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0648\u0634\u062A\u0629', "t('medicalExamination.prescriptionSendError')"],
  ['\u0641\u0634\u0644 \u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632 QR', "t('medicalExamination.qrGenerateFailed')"],
  ['\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632 QR', "t('medicalExamination.qrError')"],
  ['\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0637\u0628\u064A\u061F', "t('medicalExamination.confirmDeleteRecord')"],
  ['\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A \u0627\u0644\u0634\u062E\u0635\u064A \u0628\u0646\u062C\u0627\u062D!', "t('medicalExamination.recordUpdated')"],
  ['\u0641\u0634\u0644 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A', "t('medicalExamination.updateFailed')"],
  ['\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u0636\u064A', "t('medicalExamination.updateError')"],
  ['\u0627\u0644\u0631\u062C\u0627\u0621 \u0645\u0644\u0621 \u062D\u0642\u0648\u0644 \u0627\u0644\u062F\u0648\u0627\u0621 \u0628\u0627\u0644\u0643\u0627\u0645\u0644', "t('medicalExamination.fillAllFields')"],
  ['\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u062D\u0641\u0638', "t('medicalExamination.notSaved')"],
  ['\u0625\u063A\u0644\u0627\u0642', "t('common.close')"],
  ['\u0625\u0644\u063A\u0627\u0621', "t('common.cancel')"],
  ['\u0646\u0639\u0645', "t('common.yes')"],
  ['\u0644\u0627', "t('common.no')"],
  ['\u0625\u0636\u0627\u0641\u0629', "t('common.add')"],
  ['\u062D\u0630\u0641', "t('common.delete')"],
  ['\u0637\u0628\u0627\u0639\u0629', "t('common.print')"],
  ['\u0628\u062D\u062B', "t('common.search')"],
  ['\u062A\u0635\u0641\u064A\u0629', "t('common.filter')"],
  ['\u0639\u0631\u0636', "t('common.show')"],
  ['\u0631\u062C\u0648\u0639', "t('common.back')"],
  ['\u0627\u0644\u062A\u0627\u0644\u064A', "t('common.next')"],
  ['\u062A\u062E\u0637\u064A', "t('common.skip')"],
  ['\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645', "t('common.submitRating')"],
  ['\u062D\u0641\u0638', "t('common.save')"],
  ['\u062A\u0623\u0643\u064A\u062F', "t('common.confirm')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u0631\u0648\u0641', "t('common.addExpense')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u062F\u0648\u0627\u0621', "t('common.addMedicine')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u0642\u0633\u0645', "t('common.addDepartment')"],
  ['\u0625\u0636\u0627\u0641\u0629 \u0637\u0631\u064A\u0642\u0629 \u062F\u0641\u0639', "t('common.addPaymentMethod')"],
];

let count = 0;
for (const [arabic, replacement] of replacements) {
  const escaped = arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Try as string literal
  const stringPattern = new RegExp(`['"]${escaped}['"]`, 'g');
  if (stringPattern.test(content)) {
    content = content.replace(stringPattern, replacement);
    count++;
  }
  
  // Try as JSX text
  const jsxPattern = new RegExp(`(?<=>)\\s*${escaped}\\s*(?=<)`, 'g');
  if (jsxPattern.test(content)) {
    content = content.replace(jsxPattern, ` ${replacement} `);
    count++;
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`DONE: MedicalExamination.jsx (${count} replacements)`);
