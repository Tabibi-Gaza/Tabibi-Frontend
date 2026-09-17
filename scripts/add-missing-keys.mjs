import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '..');

const ar = JSON.parse(fs.readFileSync(path.join(basePath, 'src/locales/ar.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(basePath, 'src/locales/en.json'), 'utf8'));

// Add common keys
if (!ar.common) ar.common = {};
if (!en.common) en.common = {};
Object.assign(ar.common, {
  "add": "إضافة",
  "all": "الكل",
  "close": "إغلاق",
  "errorOccurred": "حدث خطأ",
  "no": "لا",
  "yes": "نعم",
  "previous": "السابق",
  "saveChanges": "حفظ التغييرات",
  "search": "بحث"
});
Object.assign(en.common, {
  "add": "Add",
  "all": "All",
  "close": "Close",
  "errorOccurred": "An error occurred",
  "no": "No",
  "yes": "Yes",
  "previous": "Previous",
  "saveChanges": "Save Changes",
  "search": "Search"
});

// Add doctorSubscription keys
if (!ar.doctorSubscription) ar.doctorSubscription = {};
if (!en.doctorSubscription) en.doctorSubscription = {};
Object.assign(ar.doctorSubscription, {
  "title": "الاشتراك",
  "freeTrial": "فترة تجريبية مجانية",
  "expiredSubscriptionTitle": "اشتراك منتهي الصلاحية",
  "enjoyFreeTrial": "استمتع بالفترة التجريبية المجانية لمدة 7 أيام",
  "renewToContinue": "يجب تجديد الاشتراك للاستمرار",
  "accountHolderName": "اسم صاحب الحساب",
  "electronicWallet": "محفظة إلكترونية",
  "fileTooLarge": "حجم الملف يتجاوز 5 ميغابايت",
  "monthlySubscriptionDesc": "اشتراك شهري - 30 يوم",
  "nameAsOnAccount": "الاسم كما في الحساب",
  "noPaymentMethods": "لا توجد طرق دفع متاحة",
  "paymentSubmitted": "تم إرسال طلب الدفع بنجاح!",
  "phoneNumber": "رقم الهاتف",
  "sendPaymentRequest": "إرسال طلب الدفع",
  "submitError": "حدث خطأ أثناء إرسال الطلب",
  "submitFailed": "فشل إرسال الطلب",
  "uploadReceipt": "يرجى رفع صورة الإيصال"
});
Object.assign(en.doctorSubscription, {
  "title": "Subscription",
  "freeTrial": "Free Trial",
  "expiredSubscriptionTitle": "Expired Subscription",
  "enjoyFreeTrial": "Enjoy the free trial for 7 days",
  "renewToContinue": "Renew to continue using the platform",
  "accountHolderName": "Account Holder Name",
  "electronicWallet": "Electronic Wallet",
  "fileTooLarge": "File size exceeds 5MB",
  "monthlySubscriptionDesc": "Monthly subscription - 30 days",
  "nameAsOnAccount": "Name as on the account",
  "noPaymentMethods": "No payment methods available",
  "paymentSubmitted": "Payment request submitted successfully!",
  "phoneNumber": "Phone Number",
  "sendPaymentRequest": "Send Payment Request",
  "submitError": "An error occurred while submitting",
  "submitFailed": "Failed to submit request",
  "uploadReceipt": "Please upload a receipt image"
});

// Add appointmentManagement keys
if (!ar.appointmentManagement) ar.appointmentManagement = {};
if (!en.appointmentManagement) en.appointmentManagement = {};
Object.assign(ar.appointmentManagement, {
  "title": "إدارة المواعيد",
  "examinationStarted": "تم بدء الكشف بنجاح",
  "customDate": "تخصيص التاريخ",
  "reset": "إعادة ضبط",
  "showing": "عرض",
  "ofTotal": "من إجمالي",
  "appointment": "موعد"
});
Object.assign(en.appointmentManagement, {
  "title": "Appointment Management",
  "examinationStarted": "Examination started successfully",
  "customDate": "Custom Date",
  "reset": "Reset",
  "showing": "Showing",
  "ofTotal": "of total",
  "appointment": "appointment"
});

// Add medicalExamination keys
if (!ar.medicalExamination) ar.medicalExamination = {};
if (!en.medicalExamination) en.medicalExamination = {};
Object.assign(ar.medicalExamination, {
  "startExamination": "بدء الكشف الطبي",
  "patientName": "اسم المريض",
  "age": "العمر",
  "bloodType": "فصيلة الدم",
  "currentExamination": "شاشة الكشف الحالية",
  "createPrescription": "إنشاء وصفة طبية",
  "medicineName": "اسم الدواء",
  "dosage": "الجرعة",
  "frequency": "التكرار",
  "duration": "المدة",
  "addToPrescription": "إضافة إلى الوصفة",
  "addedMedicines": "الأدوية المضافة",
  "symptoms": "الأعراض",
  "clinicalNotes": "الملاحظات السريرية",
  "diagnosis": "التشخيص",
  "chronicDiseases": "الأمراض المزمنة",
  "foodAndDrugAllergies": "الحساسية الغذائية والدوائية",
  "vitalSigns": "القياسات الحيوية",
  "bloodPressure": "ضغط الدم",
  "bloodSugar": "سكر الدم",
  "weight": "الوزن",
  "height": "الطول",
  "smokingAndLifestyle": "التدخين ونمط الحياة",
  "currentMedications": "الأدوية والمعلومات الطبية الملتزم بها",
  "medicineNameHeader": "اسم الدواء/العلمي",
  "noChronicDiseases": "لا توجد أمراض مزمنة مسجلة",
  "noAllergies": "لا توجد حساسية مسجلة",
  "noMedicationsRecorded": "لا يوجد أدوية مسجلة",
  "editPersonalRecord": "تعديل السجل المرضي الشخصي",
  "editPatientData": "تعديل البيانات الطبية للمريض",
  "isPatientSmoker": "هل المريض مدخن؟",
  "addChronicDisease": "إضافة مرض مزمن",
  "addAllergy": "إضافة حساسية",
  "manageCurrentMedications": "إدارة الأدوية الحالية",
  "insert": "إدراج",
  "medicine": "الدواء",
  "searchByDate": "بحث حسب التاريخ",
  "specialization": "التخصص",
  "all": "الكل",
  "applyFilters": "تطبيق الفلاتر",
  "resetFilters": "إعادة ضبط",
  "medicalVisit": "زيارة طبية",
  "atTime": "الساعة",
  "completed": "منتهية",
  "deleteRecord": "حذف السجل",
  "doctorName": "اسم الطبيب",
  "notes": "الملاحظات",
  "prescription": "الوصفة الطبية",
  "sentToPatient": "تم الإرسال للمريض ✓",
  "resendPrescription": "إعادة إرسال الروشتة",
  "sendAndExportPrescription": "إرسال وتصدير الروشتة",
  "noPreviousRecords": "لا توجد سجلات كشف طبي سابقة لهذا المريض.",
  "scanForQuickAccess": "امسح هذا الرمز للوصول السريع للسجل المرضي",
  "validUntil": "صالح حتى",
  "openLink": "فتح الرابط",
  "loadingPatientData": "جاري تحميل بيانات المريض...",
  "patientNotFound": "لم يتم العثور على بيانات المريض",
  "generating": "جاري الإنشاء...",
  "qrCodeForRecord": "رمز QR للسجل",
  "unknown": "غير معروف",
  "notSpecified": "غير محدد",
  "years": "سنة",
  "kg": "كغ",
  "cm": "سم",
  "noDiseasesAdded": "لم يتم إدراج أي مرض بعد...",
  "noAllergiesAdded": "لم يتم إدراج أي حساسية بعد...",
  "saving": "جاري الحفظ...",
  "saveError": "حدث خطأ أثناء حفظ البيانات",
  "examinationSaved": "تم حفظ بيانات الكشف الطبي بنجاح!",
  "recordDeleted": "تم حذف السجل الطبي بنجاح",
  "deleteFailed": "فشل حذف السجل",
  "deleteError": "حدث خطأ أثناء الحذف",
  "prescriptionSent": "تم إرسال الروشتة للمريض بنجاح",
  "prescriptionSendFailed": "فشل إرسال الروشتة",
  "prescriptionSendError": "حدث خطأ أثناء إرسال الروشتة",
  "qrGenerateFailed": "فشل إنشاء رمز QR",
  "qrError": "حدث خطأ أثناء إنشاء رمز QR",
  "confirmDeleteRecord": "هل أنت متأكد من حذف هذا السجل الطبي؟",
  "recordUpdated": "تم تحديث السجل المرضي الشخصي بنجاح!",
  "updateFailed": "فشل تحديث السجل المرضي",
  "updateError": "حدث خطأ أثناء تحديث السجل المرضي",
  "fillAllFields": "الرجاء ملء حقول الدواء بالكامل",
  "notSaved": "لم يتم الحفظ"
});
Object.assign(en.medicalExamination, {
  "startExamination": "Start Examination",
  "patientName": "Patient Name",
  "age": "Age",
  "bloodType": "Blood Type",
  "currentExamination": "Current Examination Screen",
  "createPrescription": "Create Prescription",
  "medicineName": "Medicine Name",
  "dosage": "Dosage",
  "frequency": "Frequency",
  "duration": "Duration",
  "addToPrescription": "Add to Prescription",
  "addedMedicines": "Added Medicines",
  "symptoms": "Symptoms",
  "clinicalNotes": "Clinical Notes",
  "diagnosis": "Diagnosis",
  "chronicDiseases": "Chronic Diseases",
  "foodAndDrugAllergies": "Food & Drug Allergies",
  "vitalSigns": "Vital Signs",
  "bloodPressure": "Blood Pressure",
  "bloodSugar": "Blood Sugar",
  "weight": "Weight",
  "height": "Height",
  "smokingAndLifestyle": "Smoking & Lifestyle",
  "currentMedications": "Current Medications & Medical Information",
  "medicineNameHeader": "Medication Name",
  "noChronicDiseases": "No chronic diseases recorded",
  "noAllergies": "No allergies recorded",
  "noMedicationsRecorded": "No medications registered",
  "editPersonalRecord": "Edit Personal Medical Record",
  "editPatientData": "Edit Patient Medical Data",
  "isPatientSmoker": "Is the patient a smoker?",
  "addChronicDisease": "Add Chronic Disease",
  "addAllergy": "Add Allergy",
  "manageCurrentMedications": "Manage Current Medications",
  "insert": "Insert",
  "medicine": "Medicine",
  "searchByDate": "Search by Date",
  "specialization": "Specialty",
  "all": "All",
  "applyFilters": "Apply Filters",
  "resetFilters": "Reset",
  "medicalVisit": "Medical Visit",
  "atTime": "At",
  "completed": "Completed",
  "deleteRecord": "Delete Record",
  "doctorName": "Doctor Name",
  "notes": "Notes",
  "prescription": "Prescription",
  "sentToPatient": "Sent to Patient ✓",
  "resendPrescription": "Resend Prescription",
  "sendAndExportPrescription": "Send & Export Prescription",
  "noPreviousRecords": "No previous examination records for this patient.",
  "scanForQuickAccess": "Scan this code for quick access to the medical record",
  "validUntil": "Valid until",
  "openLink": "Open Link",
  "loadingPatientData": "Loading patient data...",
  "patientNotFound": "Patient data not found",
  "generating": "Generating...",
  "qrCodeForRecord": "QR Code for Record",
  "unknown": "Unknown",
  "notSpecified": "Not specified",
  "years": "years",
  "kg": "kg",
  "cm": "cm",
  "noDiseasesAdded": "No diseases added yet...",
  "noAllergiesAdded": "No allergies added yet...",
  "saving": "Saving...",
  "saveError": "An error occurred while saving data",
  "examinationSaved": "Examination data saved successfully!",
  "recordDeleted": "Medical record deleted successfully",
  "deleteFailed": "Failed to delete record",
  "deleteError": "An error occurred while deleting",
  "prescriptionSent": "Prescription sent to patient successfully",
  "prescriptionSendFailed": "Failed to send prescription",
  "prescriptionSendError": "An error occurred while sending prescription",
  "qrGenerateFailed": "Failed to generate QR code",
  "qrError": "An error occurred while generating QR code",
  "confirmDeleteRecord": "Are you sure you want to delete this medical record?",
  "recordUpdated": "Personal medical record updated successfully!",
  "updateFailed": "Failed to update medical record",
  "updateError": "An error occurred while updating medical record",
  "fillAllFields": "Please fill in all medication fields",
  "notSaved": "Not saved"
});

// Add financialFiles keys
if (!ar.financialFiles) ar.financialFiles = {};
if (!en.financialFiles) en.financialFiles = {};
Object.assign(ar.financialFiles, {
  "title": "السجلات المالية",
  "description": "تتبع أرباحك وإدارة معاملاتك المالية بكل سهولة.",
  "totalRevenue": "الإيرادات الإجمالية",
  "totalExaminations": "إجمالي الكشفيات",
  "expenses": "المصروفات",
  "operationalExpenses": "مصروفات تشغيلية",
  "netProfit": "صافي الربح",
  "revenueMinusExpenses": "إيرادات - مصروفات",
  "pendingPayments": "دفعات متبقية",
  "uncollectedAmounts": "مبالغ غير محصلة",
  "incomeAndPayments": "جدول الإيرادات والدفعات",
  "operationalExpensesTable": "جدول المصاريف التشغيلية",
  "searchPlaceholder": "بحث بالاسم أو طريقة الدفع...",
  "filters": "فلاتر",
  "transaction": "معاملة",
  "dateRange": "نطاق التاريخ",
  "to": "إلى",
  "paymentMethod": "طريقة الدفع",
  "patient": "المريض",
  "dateTime": "التاريخ والوقت",
  "amount": "المبلغ",
  "status": "الحالة",
  "actions": "إجراءات",
  "printInvoice": "طباعة فاتورة",
  "showAllTransactions": "عرض جميع المعاملات",
  "showLessTransactions": "عرض معاملات أقل",
  "noMatchingTransactions": "لا توجد معاملات تطابق بحثك الحالي.",
  "operationalExpensesTitle": "المصاريف التشغيلية",
  "addExpense": "إضافة مصروف",
  "category": "التصنيف",
  "date": "التاريخ",
  "description": "الوصف",
  "noExpensesRecorded": "لا توجد مصاريف مسجلة.",
  "addNewExpense": "إضافة مصروف جديد",
  "categoryRequired": "التصنيف *",
  "selectCategory": "اختر التصنيف",
  "amountRequired": "المبلغ (ILS) *",
  "descriptionOptional": "الوصف (اختياري)",
  "expenseDetails": "تفاصيل المصروف...",
  "add": "إضافة",
  "invoicePreview": "معاينة الفاتورة",
  "patientLabel": "المريض:",
  "dateLabel": "التاريخ:",
  "paymentMethodLabel": "طريقة الدفع:",
  "statusLabel": "الحالة:",
  "paidLabel": "المدفوع:",
  "remainingLabel": "المتبقي:",
  "totalAmount": "المبلغ الإجمالي",
  "thankYou": "شكراً لثقتكم بمنصة طبيبي",
  "print": "طباعة",
  "totalAmountLabel": "المبلغ الإجمالي:",
  "all": "الكل",
  "today": "اليوم",
  "thisWeek": "هذا الأسبوع",
  "thisMonth": "هذا الشهر",
  "custom": "مخصص",
  "bankOfPalestine": "بنك فلسطين",
  "bankTransfer": "تحويل بنكي",
  "medicalSupplies": "مستلزمات طبية",
  "rent": "إيجار",
  "salaries": "رواتب",
  "utilities": "مرافق",
  "maintenance": "صيانة",
  "marketing": "تسويق",
  "other": "أخرى",
  "partiallyCompleted": "مكتمل جزئياً",
  "underProcessing": "قيد المعالجة",
  "cancelled": "ملغى",
  "confirmDeleteExpense": "هل أنت متأكد من حذف هذا المصروف؟",
  "loading": "جاري تحميل البيانات المالية...",
  "platformDescription": "منصة إدارة العيادات الطبية",
  "amountDue": "المبلغ المطلوب"
});
Object.assign(en.financialFiles, {
  "title": "Financial Records",
  "description": "Track your earnings and manage your financial transactions easily.",
  "totalRevenue": "Total Revenue",
  "totalExaminations": "Total Examinations",
  "expenses": "Expenses",
  "operationalExpenses": "Operating Expenses",
  "netProfit": "Net Profit",
  "revenueMinusExpenses": "Revenue - Expenses",
  "pendingPayments": "Pending Payments",
  "uncollectedAmounts": "Uncollected Amounts",
  "incomeAndPayments": "Revenue & Payments Table",
  "operationalExpensesTable": "Operating Expenses Table",
  "searchPlaceholder": "Search by name or payment method...",
  "filters": "Filters",
  "transaction": "transaction",
  "dateRange": "Date Range",
  "to": "to",
  "paymentMethod": "Payment Method",
  "patient": "Patient",
  "dateTime": "Date & Time",
  "amount": "Amount",
  "status": "Status",
  "actions": "Actions",
  "printInvoice": "Print Invoice",
  "showAllTransactions": "Show All Transactions",
  "showLessTransactions": "Show Fewer Transactions",
  "noMatchingTransactions": "No transactions match your current search.",
  "operationalExpensesTitle": "Operating Expenses",
  "addExpense": "Add Expense",
  "category": "Category",
  "date": "Date",
  "description": "Description",
  "noExpensesRecorded": "No expenses recorded.",
  "addNewExpense": "Add New Expense",
  "categoryRequired": "Category *",
  "selectCategory": "Select category",
  "amountRequired": "Amount (ILS) *",
  "descriptionOptional": "Description (optional)",
  "expenseDetails": "Expense details...",
  "add": "Add",
  "invoicePreview": "Invoice Preview",
  "patientLabel": "Patient:",
  "dateLabel": "Date:",
  "paymentMethodLabel": "Payment Method:",
  "statusLabel": "Status:",
  "paidLabel": "Paid:",
  "remainingLabel": "Remaining:",
  "totalAmount": "Total Amount",
  "thankYou": "Thank you for your trust in Tabibi platform",
  "print": "Print",
  "totalAmountLabel": "Total Amount:",
  "all": "All",
  "today": "Today",
  "thisWeek": "This Week",
  "thisMonth": "This Month",
  "custom": "Custom",
  "bankOfPalestine": "Bank of Palestine",
  "bankTransfer": "Bank Transfer",
  "medicalSupplies": "Medical Supplies",
  "rent": "Rent",
  "salaries": "Salaries",
  "utilities": "Utilities",
  "maintenance": "Maintenance",
  "marketing": "Marketing",
  "other": "Other",
  "partiallyCompleted": "Partially Completed",
  "underProcessing": "Under Processing",
  "cancelled": "Cancelled",
  "confirmDeleteExpense": "Are you sure you want to delete this expense?",
  "loading": "Loading financial data...",
  "platformDescription": "Medical Clinics Management Platform",
  "amountDue": "Amount Due"
});

// Add doctorPayment keys
if (!ar.doctorPayment) ar.doctorPayment = {};
if (!en.doctorPayment) en.doctorPayment = {};
Object.assign(ar.doctorPayment, {
  "bankTransfer": "تحويل بنكي",
  "electronicWallet": "محفظة إلكترونية",
  "walletNumber": "رقم المحفظة"
});
Object.assign(en.doctorPayment, {
  "bankTransfer": "Bank Transfer",
  "electronicWallet": "Electronic Wallet",
  "walletNumber": "Wallet Number"
});

// Add doctorProfile keys
if (!ar.doctorProfile) ar.doctorProfile = {};
if (!en.doctorProfile) en.doctorProfile = {};
Object.assign(ar.doctorProfile, {
  "profileImageAlt": "صورة الملف الشخصي"
});
Object.assign(en.doctorProfile, {
  "profileImageAlt": "Profile Picture"
});

// Add adminPharmaceutical keys
if (!ar.adminPharmaceutical) ar.adminPharmaceutical = {};
if (!en.adminPharmaceutical) en.adminPharmaceutical = {};
Object.assign(ar.adminPharmaceutical, {
  "confirmDelete": "هل أنت متأكد من حذف هذا الدواء؟",
  "editMedicine": "تعديل الدواء"
});
Object.assign(en.adminPharmaceutical, {
  "confirmDelete": "Are you sure you want to delete this medicine?",
  "editMedicine": "Edit Medicine"
});

// Add adminUserManagement keys
if (!ar.adminUserManagement) ar.adminUserManagement = {};
if (!en.adminUserManagement) en.adminUserManagement = {};
Object.assign(ar.adminUserManagement, {
  "activate": "تفعيل",
  "deactivate": "تعطيل",
  "fetchFailed": "فشل في تحميل بيانات المستخدمين"
});
Object.assign(en.adminUserManagement, {
  "activate": "Activate",
  "deactivate": "Deactivate",
  "fetchFailed": "Failed to load user data"
});

// Add adminFinancialTransactions keys
if (!ar.adminFinancialTransactions) ar.adminFinancialTransactions = {};
if (!en.adminFinancialTransactions) en.adminFinancialTransactions = {};
Object.assign(ar.adminFinancialTransactions, {
  "all": "الكل"
});
Object.assign(en.adminFinancialTransactions, {
  "all": "All"
});

// Write back
fs.writeFileSync(path.join(basePath, 'src/locales/ar.json'), JSON.stringify(ar, null, 2), 'utf8');
fs.writeFileSync(path.join(basePath, 'src/locales/en.json'), JSON.stringify(en, null, 2), 'utf8');

console.log('Done! Added all missing keys to ar.json and en.json');
