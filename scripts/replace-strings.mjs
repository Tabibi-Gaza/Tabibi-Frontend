// Comprehensive string replacement script for remaining files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

// Define all replacements for each file
const fileReplacements = {
  'src/pages/Doctor pages/DoctorSubscription.jsx': [
    ['اشتراكي', "t('doctorSubscription.title')"],
    ['فترة تجريبية', "t('doctorSubscription.trialPeriod')"],
    ['اشتراك نشط', "t('doctorSubscription.activeSubscription')"],
    ['اشتراك منتهي', "t('doctorSubscription.expiredSubscription')"],
    ['فترة تجريبية مجانية', "t('doctorSubscription.freeTrial')"],
    ['الاشتراك الشهري', "t('doctorSubscription.monthlySubscription')"],
    ['الاشتراك منتهي الصلاحية', "t('doctorSubscription.expiredSubscriptionTitle')"],
    ['يوم متبقي', "t('doctorSubscription.daysRemaining')"],
    ['تاريخ البدء', "t('doctorSubscription.startDate')"],
    ['تاريخ الانتهاء', "t('doctorSubscription.endDate')"],
    ['المبلغ', "t('doctorSubscription.amount')"],
    ['مجاني', "t('doctorSubscription.free')"],
    ['اشترك الآن بعد انتهاء الفترة التجريبية', "t('doctorSubscription.subscribeNow')"],
    ['تجديد الاشتراك', "t('doctorSubscription.renewSubscription')"],
    ['تأكيد ودفع الاشتراك', "t('doctorSubscription.confirmAndPay')"],
    ['المبلغ المطلوب:', "t('doctorSubscription.requiredAmount')"],
    ['اشتراك شهري - 30 يوم', "t('doctorSubscription.monthlySubscriptionDesc')"],
    ['تحويل بنكي', "t('doctorSubscription.bankTransfer')"],
    ['محفظة إلكترونية', "t('doctorSubscription.electronicWallet')"],
    ['صورة الإيصال / التحويل', "t('doctorSubscription.receiptImage')"],
    ['اضغط لرفع صورة الإيصال', "t('doctorSubscription.clickToUploadReceipt')"],
    ['اسم صاحب الحساب', "t('doctorSubscription.accountHolderName')"],
    ['رقم الهاتف', "t('doctorSubscription.phoneNumber')"],
    ['الاسم كما في الحساب', "t('doctorSubscription.nameAsOnAccount')"],
    ['جاري الإرسال...', "t('doctorSubscription.sending')"],
    ['إرسال طلب الدفع', "t('doctorSubscription.sendPaymentRequest')"],
    ['لا توجد طرق دفع متاحة حالياً. يرجى المحاولة لاحقاً.', "t('doctorSubscription.noPaymentMethods')"],
    ['يجب تجديد الاشتراك للاستمرار في استخدام المنصة', "t('doctorSubscription.renewToContinue')"],
    ['استمتع بالمنصة لمدة 7 أيام مجاناً', "t('doctorSubscription.enjoyFreeTrial')"],
    ['حجم الملف يتجاوز 5 ميغابايت', "t('doctorSubscription.fileTooLarge')"],
    ['يرجى اختيار طريقة الدفع', "t('doctorSubscription.selectPaymentMethod')"],
    ['يرجى إدخال اسم صاحب الحساب', "t('doctorSubscription.enterAccountHolderName')"],
    ['يرجى إدخال رقم الهاتف', "t('doctorSubscription.enterPhoneNumber')"],
    ['يرجى رفع صورة الإيصال', "t('doctorSubscription.uploadReceipt')"],
    ['تم إرسال طلب الدفع بنجاح! سيتم مراجعته من قبل الإدارة', "t('doctorSubscription.paymentSubmitted')"],
    ['فشل إرسال الطلب', "t('doctorSubscription.submitFailed')"],
    ['حدث خطأ أثناء إرسال الطلب', "t('doctorSubscription.submitError')"],
    ['تأكيد الدفع', "t('doctorSubscription.confirmPayment')"],
    ['فشل تحميل بيانات الدفع', "t('doctorSubscription.loadPaymentFailed')"],
    ['حدث خطأ أثناء تحميل بيانات الدفع', "t('doctorSubscription.loadPaymentError')"],
    ['خطأ في جلب بيانات الدفع', "t('doctorSubscription.fetchPaymentError')"],
    ['تم تأكيد الدفع بنجاح!', "t('doctorSubscription.paymentConfirmed')"],
    ['فشل تأكيد الدفع', "t('doctorSubscription.paymentConfirmFailed')"],
    ['خطأ في تأكيد الدفع', "t('doctorSubscription.paymentConfirmError')"],
    ['تم رفض الدفع', "t('doctorSubscription.paymentRejected')"],
    ['فشل رفض الدفع', "t('doctorSubscription.paymentRejectFailed')"],
    ['خطأ في رفض الدفع', "t('doctorSubscription.paymentRejectError')"],
    ['تم تحديث الاشتراك بنجاح', "t('doctorSubscription.subscriptionUpdated')"],
    ['خطأ في تحديث الاشتراك', "t('doctorSubscription.subscriptionUpdateError')"],
    ['الاشتراك نشط', "t('doctorSubscription.subscriptionActive')"],
    ['الاشتراك منتهي', "t('doctorSubscription.subscriptionExpired')"],
    ['فترة تجريبية', "t('doctorSubscription.trialPeriod')"],
    ['انتهت الفترة التجريبية', "t('doctorSubscription.trialExpired')"],
    ['تجديد', "t('doctorSubscription.renew')"],
    ['تفاصيل الاشتراك', "t('doctorSubscription.subscriptionDetails')"],
    ['المدة:', "t('doctorSubscription.duration')"],
    ['الحالة:', "t('doctorSubscription.status')"],
    ['تاريخ الانتهاء:', "t('doctorSubscription.endDate')"],
    ['المبلغ الشهري:', "t('doctorSubscription.monthlyAmount')"],
  ],
  'src/pages/Doctor pages/Appointment Management.jsx': [
    ['إدارة المواعيد', "t('appointmentManagement.title')"],
    ['الجدول اليومي', "t('appointmentManagement.dailySchedule')"],
    ['جميع المواعيد', "t('appointmentManagement.allAppointments')"],
    ['قائمة الانتظار', "t('appointmentManagement.waitingList')"],
    ['مواعيد اليوم', "t('appointmentManagement.todayAppointments')"],
    ['بانتظار التأكيد', "t('appointmentManagement.pendingVerification')"],
    ['تم الانتهاء', "t('appointmentManagement.completed')"],
    ['المريض', "t('appointmentManagement.patient')"],
    ['الوقت', "t('appointmentManagement.time')"],
    ['نوع الزيارة', "t('appointmentManagement.visitType')"],
    ['الحالة', "t('appointmentManagement.status')"],
    ['الإجراءات', "t('appointmentManagement.actions')"],
    ['بدء الكشف', "t('appointmentManagement.startExamination')"],
    ['تخصيص التاريخ', "t('appointmentManagement.customDate')"],
    ['تطبيق الفلتر', "t('appointmentManagement.applyFilter')"],
    ['إعادة ضبط', "t('appointmentManagement.reset')"],
    ['لا توجد مواعيد مجدولة.', "t('appointmentManagement.noScheduledAppointments')"],
    ['كل الحالات', "t('appointmentManagement.allStatuses')"],
    ['مكتمل', "t('appointmentManagement.completed')"],
    ['غير مكتمل', "t('appointmentManagement.notCompleted')"],
    ['بانتظار الدفع', "t('appointmentManagement.pendingPayment')"],
    ['جاري الكشف', "t('appointmentManagement.inProgress')"],
    ['لم يحضر', "t('appointmentManagement.noShow')"],
    ['تم بدء الكشف بنجاح', "t('appointmentManagement.examinationStarted')"],
    ['الوقت والتاريخ', "t('appointmentManagement.timeAndDate')"],
    ['عرض', "t('appointmentManagement.showing')"],
    ['من أصل', "t('appointmentManagement.ofTotal')"],
    ['موعد', "t('appointmentManagement.appointment')"],
    ['لديك', "t('appointmentManagement.youHave')"],
    ['مواعيد اليوم.', "t('appointmentManagement.todayAppointmentsPeriod')"],
    ['ابدأ يومك بنشاط.', "t('appointmentManagement.startDayActive')"],
  ],
  'src/pages/Admin pages/AdminProfile.jsx': [
    ['المعلومات الشخصية', "t('adminProfile.title')"],
    ['قم بتحديث معلوماتك الأساسية لضمان تجربة حجز دقيقة.', "t('adminProfile.description')"],
    ['رفع صورة', "t('adminProfile.uploadImage')"],
    ['الاسم الأول', "t('adminProfile.firstName')"],
    ['اسم العائلة', "t('adminProfile.lastName')"],
    ['البريد الإلكتروني', "t('adminProfile.email')"],
    ['رقم الهاتف', "t('adminProfile.phone')"],
    ['تاريخ الميلاد', "t('adminProfile.dateOfBirth')"],
    ['الجنس', "t('adminProfile.gender')"],
    ['حفظ التغييرات', "t('adminProfile.saveChanges')"],
    ['جاري الحفظ...', "t('adminProfile.saving')"],
    ['تعديل المعلومات الشخصية', "t('adminProfile.editProfile')"],
    ['صورة شخصية', "t('adminProfile.profileImageAlt')"],
    ['فشل حفظ التعديلات', "t('adminProfile.saveFailed')"],
  ],
  'src/pages/Admin pages/AdminPharmaceutical.jsx': [
    ['إجمالي الأدوية', "t('adminPharmaceutical.totalMedicines')"],
    ['إضافة دواء جديد', "t('adminPharmaceutical.addNewMedicine')"],
    ['قائمة الأدوية', "t('adminPharmaceutical.medicinesList')"],
    ['اسم الدواء', "t('adminPharmaceutical.medicineName')"],
    ['الإجراءات', "t('adminPharmaceutical.actions')"],
    ['لا توجد أدوية مسجلة في النظام بعد.', "t('adminPharmaceutical.noMedicines')"],
    ['إضافة دواء جديد', "t('adminPharmaceutical.addNewMedicine')"],
    ['تعديل بيانات الدواء', "t('adminPharmaceutical.editMedicine')"],
    ['اسم الدواء', "t('adminPharmaceutical.medicineName')"],
    ['إضافة', "t('adminPharmaceutical.add')"],
    ['حفظ التعديلات', "t('adminPharmaceutical.saveChanges')"],
    ['هل أنت متأكد من حذف هذا الدواء نهائياً؟', "t('adminPharmaceutical.confirmDelete')"],
    ['عرض', "t('adminPharmaceutical.showing')"],
    ['من إجمالي', "t('adminPharmaceutical.ofTotal')"],
    ['دواء', "t('adminPharmaceutical.medicine')"],
    ['أدوية', "t('adminPharmaceutical.medicines')"],
  ],
};

// Process each file
for (const [file, replacements] of Object.entries(fileReplacements)) {
  const filePath = path.join(basePath, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} (not found)`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  
  for (const [arabic, replacement] of replacements) {
    // Escape special regex characters
    const escaped = arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Try different patterns
    // 1. As a standalone text in JSX
    const jsxPattern = new RegExp(`(?<=>)\\s*${escaped}\\s*(?=<)`, 'g');
    if (jsxPattern.test(content)) {
      content = content.replace(jsxPattern, ` ${replacement} `);
      count++;
    }
    
    // 2. As a string literal
    const stringPattern = new RegExp(`['"]${escaped}['"]`, 'g');
    if (stringPattern.test(content)) {
      content = content.replace(stringPattern, replacement);
      count++;
    }
    
    // 3. In template literal
    const templatePattern = new RegExp(`\`${escaped}\``, 'g');
    if (templatePattern.test(content)) {
      content = content.replace(templatePattern, `\${${replacement}}`);
      count++;
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`DONE: ${file} (${count} replacements)`);
}

console.log('\nString replacements complete!');
