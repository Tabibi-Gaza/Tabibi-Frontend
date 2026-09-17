const fs = require('fs');
const path = require('path');

// Mapping of file paths to their translation namespace and component type
const files = [
  {
    path: 'src/pages/Doctor pages/DoctorPayment .jsx',
    namespace: 'doctorPayment',
    componentType: 'function', // function declaration
    componentName: 'DoctorPayment'
  },
  {
    path: 'src/pages/Doctor pages/DoctorSubscription.jsx',
    namespace: 'doctorSubscription',
    componentType: 'export-function',
    componentName: 'DoctorSubscription'
  },
  {
    path: 'src/pages/Doctor pages/Appointment Management.jsx',
    namespace: 'appointmentManagement',
    componentType: 'const',
    componentName: 'AppointmentManagement'
  },
  {
    path: 'src/pages/Doctor pages/FinancialFiles.jsx',
    namespace: 'financialFiles',
    componentType: 'const',
    componentName: 'FinancialFiles'
  },
  {
    path: 'src/pages/Doctor pages/MedicalExamination.jsx',
    namespace: 'medicalExamination',
    componentType: 'const',
    componentName: 'MedicalExamination'
  },
  {
    path: 'src/pages/Admin pages/AdminJoinRequests.jsx',
    namespace: 'adminJoinRequests',
    componentType: 'unknown',
    componentName: 'AdminJoinRequests'
  },
  {
    path: 'src/pages/Admin pages/AdminDepartmentsManagement.jsx',
    namespace: 'adminDepartments',
    componentType: 'unknown',
    componentName: 'AdminDepartmentsManagement'
  },
  {
    path: 'src/pages/Admin pages/AdminPaymentMethods.jsx',
    namespace: 'adminPaymentMethods',
    componentType: 'unknown',
    componentName: 'AdminPaymentMethods'
  },
  {
    path: 'src/pages/Admin pages/AdminFinancialTransactions.jsx',
    namespace: 'adminFinancialTransactions',
    componentType: 'unknown',
    componentName: 'AdminFinancialTransactions'
  },
  {
    path: 'src/pages/Admin pages/AdminProfile.jsx',
    namespace: 'adminProfile',
    componentType: 'unknown',
    componentName: 'AdminProfile'
  },
  {
    path: 'src/pages/Admin pages/AdminPharmaceutical.jsx',
    namespace: 'adminPharmaceutical',
    componentType: 'unknown',
    componentName: 'AdminPharmaceutical'
  }
];

// Arabic to translation key mappings (common strings)
const translations = {
  // Common strings
  'جاري التحميل...': "t('common.loading')",
  'حدث خطأ': "t('common.error')",
  'حفظ': "t('common.save')",
  'إلغاء': "t('common.cancel')",
  'حذف': "t('common.delete')",
  'تعديل': "t('common.edit')",
  'تأكيد': "t('common.confirm')",
  'رجوع': "t('common.back')",
  'التالي': "t('common.next')",
  'لا توجد بيانات': "t('common.noData')",
  
  // Gender
  'ذكر': "t('profile.male')",
  'أنثى': "t('profile.female')",
  
  // Status
  'نشط': "t('common.active')",
  'غير نشط': "t('common.inactive')",
  'مكتمل': "t('common.completed')",
  'غير مكتمل': "t('common.incomplete')",
  'ملغي': "t('common.cancelled')",
  'معلق': "t('common.pending')",
  'مؤكد': "t('common.confirmed')",
  
  // Actions
  'حفظ التعديلات': "t('common.saveChanges')",
  'إضافة': "t('common.add')",
  'بحث': "t('common.search')",
  'تصفية': "t('common.filter')",
  'عرض': "t('common.show')",
  'إغلاق': "t('common.close')",
  'نعم': "t('common.yes')",
  'لا': "t('common.no')",
  
  // Doctor Payment
  'إدارة طرق الدفع': "t('doctorPayment.pageTitle')",
  'طرق الدفع': "t('doctorPayment.paymentMethods')",
  'إضافة طريقة دفع جديدة': "t('doctorPayment.addNewMethod')",
  'حساب بنكي': "t('doctorPayment.bankAccount')",
  'محفظة إلكترونية': "t('doctorPayment.electronicWallet')",
  'اسم البنك': "t('doctorPayment.bankName')",
  'اسم صاحب الحساب': "t('doctorPayment.accountHolderName')",
  'رقم جوال الحساب': "t('doctorPayment.mobileNumber')",
  'رقم الآيبان (IBAN)': "t('doctorPayment.ibanNumberLabel')",
  'نوع المحفظة': "t('doctorPayment.walletTypeLabel')",
  'اسم صاحب المحفظة': "t('doctorPayment.walletHolderName')",
  'رقم جوال المحفظة': "t('doctorPayment.walletPhoneNumber')",
  'إرسال': "t('common.send')",
  'إضافة الوسيلة': "t('doctorPayment.addMethod')",
  'حفظ التغييرات': "t('common.saveChanges')",
  'تعديل بيانات وسيلة الدفع': "t('doctorPayment.editPaymentTitle')",
  'تعديل بيانات المحفظة الرقمية': "t('doctorPayment.editWalletTitle')",
  'حذف طريقة الدفع': "t('doctorPayment.deletePaymentTitle')",
  'نعم، حذف': "t('common.yesDelete')",
  'تعليمات هامة': "t('doctorPayment.importantInstructions')",
  'ses这名': "t('doctorPayment.accountName')",
  'البنك': "t('doctorPayment.bankName')",
  'رقم جوال الحساب': "t('doctorPayment.accountPhoneNumber')",
  'الآيبان': "t('doctorPayment.ibanLabel')",
  'active': "t('doctorPayment.activeStatus')",
  'الحسابات البنكية': "t('doctorPayment.bankAccountsTitle')",
  'المحافظ الرقمية': "t('doctorPayment.digitalWalletsTitle')",
  'لم تتم إضافة حساب بنكي بعد': "t('doctorPayment.noBankAccountYet')",
  'لم تتم إضافة محفظة رقمية بعد': "t('doctorPayment.noWalletYet')",
  'نصيحة تقنية': "t('doctorPayment.technicalTip')",
  'اختر نوع وسيلة الدفع': "t('doctorPayment.choosePaymentType')",
  'التحويل المباشر للحسابات الفلسطينية': "t('doctorPayment.bankTransferDesc')",
  'جوال باي، بال بي': "t('doctorPayment.walletProvidersDesc')",
  'الاسم كما في البنك': "t('doctorPayment.accountHolderPlaceholder')",
  'الاسم كما في المحفظة': "t('doctorPayment.walletHolderPlaceholder')",
  'صيغة الآيبان صحيحة': "t('doctorPayment.ibanValid')",
  'تأكد من مطابقة رقم الجوال المسجل في خدمة المحفظة الرقمية.': "t('doctorPayment.walletPhoneNote')",
  
  // Doctor Subscription
  'اشتراكي': "t('doctorSubscription.title')",
  'فترة تجريبية': "t('doctorSubscription.trialPeriod')",
  'اشتراك نشط': "t('doctorSubscription.activeSubscription')",
  'اشتراك منتهي': "t('doctorSubscription.expiredSubscription')",
  'فترة تجريبية مجانية': "t('doctorSubscription.freeTrial')",
  'الاشتراك الشهري': "t('doctorSubscription.monthlySubscription')",
  'الاشتراك منتهي الصلاحية': "t('doctorSubscription.expiredSubscriptionTitle')",
  'يوم متبقي': "t('doctorSubscription.daysRemaining')",
  'تاريخ البدء': "t('doctorSubscription.startDate')",
  'تاريخ الانتهاء': "t('doctorSubscription.endDate')",
  'المبلغ': "t('doctorSubscription.amount')",
  'مجاني': "t('doctorSubscription.free')",
  'اشترك الآن بعد انتهاء الفترة التجريبية': "t('doctorSubscription.subscribeNow')",
  'تجديد الاشتراك': "t('doctorSubscription.renewSubscription')",
  'تأكيد ودفع الاشتراك': "t('doctorSubscription.confirmAndPay')",
  'المبلغ المطلوب': "t('doctorSubscription.requiredAmount')",
  'اشتراك شهري - 30 يوم': "t('doctorSubscription.monthlySubscriptionDesc')",
  'تحويل بنكي': "t('doctorSubscription.bankTransfer')",
  'صورة الإيصال / التحويل': "t('doctorSubscription.receiptImage')",
  'اضغط لرفع صورة الإيصال': "t('doctorSubscription.clickToUploadReceipt')",
  'اسم صاحب الحساب': "t('doctorSubscription.accountHolderName')",
  'رقم الهاتف': "t('doctorSubscription.phoneNumber')",
  'الاسم كما في الحساب': "t('doctorSubscription.nameAsOnAccount')",
  'جاري الإرسال...': "t('doctorSubscription.sending')",
  'إرسال طلب الدفع': "t('doctorSubscription.sendPaymentRequest')",
  'لا توجد طرق دفع متاحة حالياً. يرجى المحاولة لاحقاً.': "t('doctorSubscription.noPaymentMethods')",
  'يجب تجديد الاشتراك للاستمرار في استخدام المنصة': "t('doctorSubscription.renewToContinue')",
  'استمتع بالمنصة لمدة 7 أيام مجاناً': "t('doctorSubscription.enjoyFreeTrial')",
  
  // Appointment Management
  'إدارة المواعيد': "t('appointmentManagement.title')",
  'الجدول اليومي': "t('appointmentManagement.dailySchedule')",
  'جميع المواعيد': "t('appointmentManagement.allAppointments')",
  'قائمة الانتظار': "t('appointmentManagement.waitingList')",
  'مواعيد اليوم': "t('appointmentManagement.todayAppointments')",
  'بانتظار التأكيد': "t('appointmentManagement.pendingVerification')",
  'تم الانتهاء': "t('appointmentManagement.completed')",
  'المريض': "t('appointmentManagement.patient')",
  'الوقت': "t('appointmentManagement.time')",
  'نوع الزيارة': "t('appointmentManagement.visitType')",
  'الحالة': "t('appointmentManagement.status')",
  'الإجراءات': "t('appointmentManagement.actions')",
  'بدء الكشف': "t('appointmentManagement.startExamination')",
  'تخصيص التاريخ': "t('appointmentManagement.customDate')",
  'تطبيق الفلتر': "t('appointmentManagement.applyFilter')",
  'إعادة ضبط': "t('appointmentManagement.reset')",
  'لا توجد مواعيد مجدولة.': "t('appointmentManagement.noScheduledAppointments')",
  'عرض': "t('appointmentManagement.showing')",
  'من أصل': "t('appointmentManagement.ofTotal')",
  'موعد': "t('appointmentManagement.appointment')",
  'الوقت والتاريخ': "t('appointmentManagement.timeAndDate')",
  'كل الحالات': "t('appointmentManagement.allStatuses')",
  'مكتمل': "t('appointmentManagement.completed')",
  'غير مكتمل': "t('appointmentManagement.notCompleted')",
  'بانتظار الدفع': "t('appointmentManagement.pendingPayment')",
  'بانتظار التأكيد': "t('appointmentManagement.pendingVerification')",
  'جاري الكشف': "t('appointmentManagement.inProgress')",
  'لم يحضر': "t('appointmentManagement.noShow')",
  'تم بدء الكشف بنجاح': "t('appointmentManagement.examinationStarted')",
  
  // Medical Examination
  'بدء الكشف الطبي': "t('medicalExamination.startExamination')",
  'السجل المرضي الشخصي': "t('medicalExamination.personalMedicalRecord')",
  'التاريخ الطبي': "t('medicalExamination.medicalHistory')",
  'حفظ وإنهاء الكشف': "t('medicalExamination.saveAndComplete')",
  'اسم المريض': "t('medicalExamination.patientName')",
  'العمر': "t('medicalExamination.age')",
  'فصيلة الدم': "t('medicalExamination.bloodType')",
  'شاشة الكشف الحالية': "t('medicalExamination.currentExamination')",
  'إنشاء وصفة طبية': "t('medicalExamination.createPrescription')",
  'اسم الدواء': "t('medicalExamination.medicineName')",
  'الجرعة': "t('medicalExamination.dosage')",
  'التكرار': "t('medicalExamination.frequency')",
  'المدة': "t('medicalExamination.duration')",
  'إضافة إلى الوصفة': "t('medicalExamination.addToPrescription')",
  'الأدوية المضافة': "t('medicalExamination.addedMedicines')",
  'الأعراض': "t('medicalExamination.symptoms')",
  'الملاحظات السريرية': "t('medicalExamination.clinicalNotes')",
  'التشخيص': "t('medicalExamination.diagnosis')",
  'الأمراض المزمنة': "t('medicalExamination.chronicDiseases')",
  'الحساسية الغذائية والدوائية': "t('medicalExamination.foodAndDrugAllergies')",
  'القياسات الحيوية': "t('medicalExamination.vitalSigns')",
  'ضغط الدم': "t('medicalExamination.bloodPressure')",
  'سكر الدم': "t('medicalExamination.bloodSugar')",
  'الوزن': "t('medicalExamination.weight')",
  'الطول': "t('medicalExamination.height')",
  'التدخين ونمط الحياة': "t('medicalExamination.smokingAndLifestyle')",
  'مدخن': "t('medicalExamination.smoker')",
  'غير مدخن': "t('medicalExamination.nonSmoker')",
  'الأدوية والمعلومات الطبية الملتزم بها': "t('medicalExamination.currentMedications')",
  'اسم الدواء/العلمي': "t('medicalExamination.medicineNameHeader')",
  'الأدوية والمعلومات الطبية': "t('medicalExamination.medicationsAndMedicalInfo')",
  'لا توجد أمراض مزمنة مسجلة': "t('medicalExamination.noChronicDiseases')",
  'لا توجد حساسية مسجلة': "t('medicalExamination.noAllergies')",
  'لا يوجد أدوية مسجلة': "t('medicalExamination.noMedicationsRecorded')",
  'تعديل السجل المرضي الشخصي': "t('medicalExamination.editPersonalRecord')",
  'تعديل البيانات الطبية للمريض': "t('medicalExamination.editPatientData')",
  'هل المريض مدخن؟': "t('medicalExamination.isPatientSmoker')",
  'إضافة مرض مزمن': "t('medicalExamination.addChronicDisease')",
  'إضافة حساسية': "t('medicalExamination.addAllergy')",
  'إدارة الأدوية الحالية': "t('medicalExamination.manageCurrentMedications')",
  'إدراج': "t('medicalExamination.insert')",
  'الدواء': "t('medicalExamination.medicine')",
  'بحث حسب التاريخ': "t('medicalExamination.searchByDate')",
  'التخصص': "t('medicalExamination.specialization')",
  'الكل': "t('medicalExamination.all')",
  'تطبيق الفلاتر': "t('medicalExamination.applyFilters')",
  'إعادة ضبط': "t('medicalExamination.resetFilters')",
  'زيارة طبية': "t('medicalExamination.medicalVisit')",
  'الساعة': "t('medicalExamination.atTime')",
  'منتهية': "t('medicalExamination.completed')",
  'حذف السجل': "t('medicalExamination.deleteRecord')",
  'اسم الطبيب': "t('medicalExamination.doctorName')",
  'الملاحظات': "t('medicalExamination.notes')",
  'الوصفة الطبية': "t('medicalExamination.prescription')",
  'تم الإرسال للمريض ✓': "t('medicalExamination.sentToPatient')",
  'إعادة إرسال الروشتة': "t('medicalExamination.resendPrescription')",
  'إرسال وتصدير الروشتة': "t('medicalExamination.sendAndExportPrescription')",
  'لا توجد سجلات كشف طبي سابقة لهذا المريض.': "t('medicalExamination.noPreviousRecords')",
  'رمز QR للسجل الطبي': "t('medicalExamination.qrCodeForRecord')",
  'امسح هذا الرمز للوصول السريع للسجل المرضي': "t('medicalExamination.scanForQuickAccess')",
  'صالح حتى': "t('medicalExamination.validUntil')",
  'فتح الرابط': "t('medicalExamination.openLink')",
  'جاري تحميل بيانات المريض...': "t('medicalExamination.loadingPatientData')",
  'لم يتم العثور على بيانات المريض': "t('medicalExamination.patientNotFound')",
  'جاري الإنشاء...': "t('medicalExamination.generating')",
  'رمز QR للسجل': "t('medicalExamination.qrCodeForRecord')",
  'غير معروف': "t('medicalExamination.unknown')",
  'غير محدد': "t('medicalExamination.notSpecified')",
  'سنة': "t('medicalExamination.years')",
  'كغ': "t('medicalExamination.kg')",
  'سم': "t('medicalExamination.cm')",
  'لم يتم إدراج أي مرض بعد...': "t('medicalExamination.noDiseasesAdded')",
  'لم يتم إدراج أي حساسية بعد...': "t('medicalExamination.noAllergiesAdded')",
  'حفظ التعديلات': "t('common.saveChanges')",
  'جاري الحفظ...': "t('medicalExamination.saving')",
  'حدث خطأ أثناء حفظ البيانات': "t('medicalExamination.saveError')",
  'تم حفظ بيانات الكشف الطبي بنجاح!': "t('medicalExamination.examinationSaved')",
  'تم حذف السجل الطبي بنجاح': "t('medicalExamination.recordDeleted')',
  'فشل حذف السجل': "t('medicalExamination.deleteFailed')",
  'حدث خطأ أثناء الحذف': "t('medicalExamination.deleteError')",
  'تم إرسال الروشتة للمريض بنجاح': "t('medicalExamination.prescriptionSent')",
  'فشل إرسال الروشتة': "t('medicalExamination.prescriptionSendFailed')",
  'حدث خطأ أثناء إرسال الروشتة': "t('medicalExamination.prescriptionSendError')",
  'فشل إنشاء رمز QR': "t('medicalExamination.qrGenerateFailed')",
  'حدث خطأ أثناء إنشاء رمز QR': "t('medicalExamination.qrError')",
  'هل أنت متأكد من حذف هذا السجل الطبي؟': "t('medicalExamination.confirmDeleteRecord')",
  'تم تحديث السجل المرضي الشخصي بنجاح!': "t('medicalExamination.recordUpdated')",
  'فشل تحديث السجل المرضي': "t('medicalExamination.updateFailed')",
  'حدث خطأ أثناء تحديث السجل المرضي': "t('medicalExamination.updateError')",
  'الرجاء ملء حقول الدواء بالكامل': "t('medicalExamination.fillAllFields')",
  'لم يتم الحفظ': "t('medicalExamination.notSaved')",
  
  // Financial Files
  'السجلات المالية': "t('financialFiles.title')",
  'تتبع أرباحك وإدارة معاملاتك المالية بكل سهولة.': "t('financialFiles.description')",
  'الإيرادات الإجمالية': "t('financialFiles.totalRevenue')",
  'إجمالي الكشفيات': "t('financialFiles.totalExaminations')",
  'المصروفات': "t('financialFiles.expenses')",
  'مصروفات تشغيلية': "t('financialFiles.operationalExpenses')",
  'صافي الربح': "t('financialFiles.netProfit')",
  'إيرادات - مصروفات': "t('financialFiles.revenueMinusExpenses')",
  'دفعات متبقية': "t('financialFiles.pendingPayments')",
  'مبالغ غير محصلة': "t('financialFiles.uncollectedAmounts')",
  'جدول الإيرادات والدفعات': "t('financialFiles.incomeAndPayments')",
  'جدول المصاريف التشغيلية': "t('financialFiles.operationalExpensesTable')",
  'بحث بالاسم أو طريقة الدفع...': "t('financialFiles.searchPlaceholder')",
  'فلاتر': "t('financialFiles.filters')",
  'معاملة': "t('financialFiles.transaction')",
  'نطاق التاريخ': "t('financialFiles.dateRange')",
  'إلى': "t('financialFiles.to')",
  'طريقة الدفع': "t('financialFiles.paymentMethod')",
  'المريض': "t('financialFiles.patient')",
  'التاريخ والوقت': "t('financialFiles.dateTime')",
  'المبلغ': "t('financialFiles.amount')",
  'الحالة': "t('financialFiles.status')',
  'إجراءات': "t('financialFiles.actions')",
  'طباعة فاتورة': "t('financialFiles.printInvoice')",
  'عرض جميع المعاملات': "t('financialFiles.showAllTransactions')",
  'عرض معاملات أقل': "t('financialFiles.showLessTransactions')",
  'لا توجد معاملات تطابق بحثك الحالي.': "t('financialFiles.noMatchingTransactions')",
  'المصاريف التشغيلية': "t('financialFiles.operationalExpensesTitle')",
  'إضافة مصروف': "t('financialFiles.addExpense')",
  'التصنيف': "t('financialFiles.category')",
  'التاريخ': "t('financialFiles.date')",
  'الوصف': "t('financialFiles.description')",
  'لا توجد مصاريف مسجلة.': "t('financialFiles.noExpensesRecorded')",
  'إضافة مصروف جديد': "t('financialFiles.addNewExpense')",
  'التصنيف *': "t('financialFiles.categoryRequired')",
  'اختر التصنيف': "t('financialFiles.selectCategory')",
  'المبلغ (ILS) *': "t('financialFiles.amountRequired')",
  'الوصف (اختياري)': "t('financialFiles.descriptionOptional')",
  'تفاصيل المصروف...': "t('financialFiles.expenseDetails')",
  'إضافة': "t('common.add')",
  'إلغاء': "t('common.cancel')",
  'معاينة الفاتورة': "t('financialFiles.invoicePreview')",
  'المريض:': "t('financialFiles.patient:')",
  'التاريخ:': "t('financialFiles.date:')",
  'طريقة الدفع:': "t('financialFiles.paymentMethod:')",
  'الحالة:': "t('financialFiles.status:')",
  'المدفوع:': "t('financialFiles.paid:')",
  'المتبقي:': "t('financialFiles.remaining:')",
  'المبلغ الإجمالي': "t('financialFiles.totalAmount')",
  'شكراً لثقتكم بمنصة طبيبي': "t('financialFiles.thankYou')",
  'طباعة': "t('financialFiles.print')",
  'المبلغ الإجمالي:': "t('financialFiles.totalAmount:')",
  'الكل': "t('financialFiles.all')",
  'اليوم': "t('financialFiles.today')",
  'هذا الأسبوع': "t('financialFiles.thisWeek')",
  'هذا الشهر': "t('financialFiles.thisMonth')",
  'مخصص': "t('financialFiles.custom')",
  'بنك فلسطين': "t('financialFiles.bankOfPalestine')",
  'تحويل بنكي': "t('financialFiles.bankTransfer')",
  'مستلزمات طبية': "t('financialFiles.medicalSupplies')",
  'إيجار': "t('financialFiles.rent')",
  'رواتب': "t('financialFiles.salaries')",
  'مرافق': "t('financialFiles.utilities')",
  'صيانة': "t('financialFiles.maintenance')',
  'تسويق': "t('financialFiles.marketing')",
  'أخرى': "t('financialFiles.other')",
  'مكتمل': "t('financialFiles.completed')",
  'مكتمل جزئياً': "t('financialFiles.partiallyCompleted')",
  'قيد المعالجة': "t('financialFiles.underProcessing')',
  'ملغى': "t('financialFiles.cancelled')",
  'هل أنت متأكد من حذف هذا المصروف؟': "t('financialFiles.confirmDeleteExpense')",
  'جاري تحميل البيانات المالية...': "t('financialFiles.loading')",
  
  // Admin Join Requests
  'طلبات انضمام الأطباء': "t('adminJoinRequests.title')",
  'إدارة ومراجعة طلبات الاعتماد للأطباء الجدد في المنصة.': "t('adminJoinRequests.description')",
  'إجمالي الطلبات المعلقة': "t('adminJoinRequests.totalPending')",
  'تصفية متقدمة': "t('adminJoinRequests.advancedFilter')",
  'المعلقة': "t('adminJoinRequests.pending')",
  'المقبولة': "t('adminJoinRequests.accepted')",
  'المرفوضة': "t('adminJoinRequests.rejected')",
  'اسم الطبيب': "t('adminJoinRequests.doctorName')",
  'التخصص': "t('adminJoinRequests.specialty')",
  'الخبرة (سنوات)': "t('adminJoinRequests.experience')",
  'الحالة': "t('adminJoinRequests.status')",
  'تاريخ الطلب': "t('adminJoinRequests.requestDate')",
  'الإجراءات': "t('adminJoinRequests.actions')",
  'تم القبول': "t('adminJoinRequests.acceptedStatus')",
  'مرفوض': "t('adminJoinRequests.rejectedStatus')",
  'قيد المراجعة': "t('adminJoinRequests.underReview')",
  'عرض التفاصيل': "t('adminJoinRequests.viewDetails')",
  'قبول': "t('adminJoinRequests.accept')",
  'رفض': "t('adminJoinRequests.reject')",
  'لا توجد نتائج مطابقة لخيارات التصفية المحددة.': "t('adminJoinRequests.noResults')",
  'عرض': "t('adminJoinRequests.showing')",
  'من إجمالي': "t('adminJoinRequests.ofTotal')",
  'طلب': "t('adminJoinRequests.request')",
  
  // Admin Departments
  'إدارة الأقسام': "t('adminDepartments.title')",
  'قم بإضافة وتعديل الأقسام الطبية المتاحة في العيادة': "t('adminDepartments.description')",
  'إضافة قسم جديد': "t('adminDepartments.addNew')",
  'أقسام نشطة حالياً': "t('adminDepartments.activeDepartments')",
  'إجمالي الأطباء في الأقسام': "t('adminDepartments.totalDoctors')",
  'بحث عن قسم...': "t('adminDepartments.searchPlaceholder')",
  'اسم القسم': "t('adminDepartments.departmentName')",
  'عدد الأطباء': "t('adminDepartments.doctorCount')",
  'الحالة': "t('adminDepartments.status')",
  'الإجراءات': "t('adminDepartments.actions')",
  'طبيب': "t('adminDepartments.doctor')",
  'أطباء': "t('adminDepartments.doctors')",
  'نشط': "t('adminDepartments.active')",
  'غير نشط': "t('adminDepartments.inactive')",
  'تعطيل': "t('adminDepartments.deactivate')",
  'تفعيل': "t('adminDepartments.activate')",
  'لا توجد أقسام مضافة حالياً.': "t('adminDepartments.noDepartments')",
  
  // Admin Payment Methods
  'إدارة طرق الدفع والاشتراكات': "t('adminPaymentMethods.title')",
  'مدفوعات الاشتراكات': "t('adminPaymentMethods.subscriptionPayments')",
  'إضافة طريقة دفع': "t('adminPaymentMethods.addPaymentMethod')",
  'نشط': "t('adminPaymentMethods.active')",
  'معطل': "t('adminPaymentMethods.inactive')",
  'صاحب الحساب:': "t('adminPaymentMethods.accountHolder')",
  'الهاتف:': "t('adminPaymentMethods.phone')",
  'الآيبان:': "t('adminPaymentMethods.iban')",
  'لا توجد طرق دفع مضافة': "t('adminPaymentMethods.noPaymentMethods')",
  'اشتراكات نشطة': "t('adminPaymentMethods.activeSubscriptions')',
  'فترات تجريبية': "t('adminPaymentMethods.trialPeriods')",
  'مدفوعات معلقة': "t('adminPaymentMethods.pendingPayments')",
  'إجمالي الإيرادات': "t('adminPaymentMethods.totalRevenue')",
  'مدفوعات معلقة - تحتاج مراجعة': "t('adminPaymentMethods.pendingPaymentsReview')",
  'الطبيب': "t('adminPaymentMethods.doctor')",
  'المبلغ': "t('adminPaymentMethods.amount')",
  'طريقة الدفع': "t('adminPaymentMethods.paymentMethod')",
  'التاريخ': "t('adminPaymentMethods.date')",
  'عرض الإيصال': "t('adminPaymentMethods.viewReceipt')",
  'تأكيد القبول': "t('adminPaymentMethods.approvePayment')",
  'جميع المدفوعات': "t('adminPaymentMethods.allPayments')",
  'مقبول': "t('adminPaymentMethods.approved')",
  'مرفوض': "t('adminPaymentMethods.rejected')",
  'قيد الانتظار': "t('adminPaymentMethods.pending')",
  'لا توجد مدفوعات': "t('adminPaymentMethods.noPayments')",
  
  // Admin Financial Transactions
  'المعاملات المالية': "t('adminFinancialTransactions.title')",
  'تتبع أرباحك وإدارة معاملاتك المالية بكل سهولة.': "t('adminFinancialTransactions.description')",
  'إجمالي الاشتراكات': "t('adminFinancialTransactions.totalSubscriptions')",
  'إجمالي الإيرادات': "t('adminFinancialTransactions.totalRevenue')",
  'مدفوعات معلقة': "t('adminFinancialTransactions.pendingPayments')",
  'المعاملات المالية': "t('adminFinancialTransactions.transactionsTitle')",
  'تصفية': "t('adminFinancialTransactions.filter')",
  'مكتمل': "t('adminFinancialTransactions.completed')",
  'قيد الانتظار': "t('adminFinancialTransactions.pending')",
  'ملغى': "t('adminFinancialTransactions.cancelled')",
  'اسم الطبيب': "t('adminFinancialTransactions.doctorName')",
  'المبلغ': "t('adminFinancialTransactions.amount')",
  'التاريخ': "t('adminFinancialTransactions.date')",
  'النوع': "t('adminFinancialTransactions.type')",
  'الحالة': "t('adminFinancialTransactions.status')",
  'اشتراك': "t('adminFinancialTransactions.subscription')",
  'لا توجد معاملات مالية مطابقة للفلتر الحالي.': "t('adminFinancialTransactions.noTransactions')",
  
  // Admin Profile
  'المعلومات الشخصية': "t('adminProfile.title')",
  'قم بتحديث معلوماتك الأساسية لضمان تجربة حجز دقيقة.': "t('adminProfile.description')",
  'رفع صورة': "t('adminProfile.uploadImage')",
  'الاسم الأول': "t('adminProfile.firstName')",
  'اسم العائلة': "t('adminProfile.lastName')",
  'البريد الإلكتروني': "t('adminProfile.email')",
  'رقم الهاتف': "t('adminProfile.phone')",
  'تاريخ الميلاد': "t('adminProfile.dateOfBirth')",
  'الجنس': "t('adminProfile.gender')",
  'حفظ التغييرات': "t('adminProfile.saveChanges')",
  'جاري الحفظ...': "t('adminProfile.saving')",
  'تعديل المعلومات الشخصية': "t('adminProfile.editProfile')",
  
  // Admin Pharmaceutical
  'إجمالي الأدوية': "t('adminPharmaceutical.totalMedicines')",
  'إضافة دواء جديد': "t('adminPharmaceutical.addNewMedicine')",
  'قائمة الأدوية': "t('adminPharmaceutical.medicinesList')",
  'اسم الدواء': "t('adminPharmaceutical.medicineName')",
  'الإجراءات': "t('adminPharmaceutical.actions')",
  'لا توجد أدوية مسجلة في النظام بعد.': "t('adminPharmaceutical.noMedicines')",
  
  // Patient Management
  'إدارة المرضى': "t('patientManagement.title')",
  'إجمالي المتاح بالقائمة الفعالة:': "t('patientManagement.totalAvailable')",
  'قائمة المرضى': "t('patientManagement.patientList')",
  'ابحث باسم المريض...': "t('patientManagement.searchPlaceholder')",
  'كل الحالات': "t('patientManagement.allStatuses')",
  'الاسم': "t('patientManagement.nameHeader')",
  'العمر/ الجنس': "t('patientManagement.ageGenderHeader')",
  'آخر زيارة': "t('patientManagement.lastVisitHeader')",
  'إجراءات سريعة': "t('patientManagement.actionsHeader')",
  'العمر / الجنس': "t('patientManagement.ageGender')",
  'سنوات': "t('patientManagement.years')",
  'لا يوجد مرضى يطابقون خيارات البحث.': "t('patientManagement.noMatchingPatients')",
  'جاري تحميل بيانات المرضى...': "t('patientManagement.loading')",
};

function addI18nToFile(fileConfig) {
  const filePath = path.join(__dirname, '..', fileConfig.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if useTranslation is already imported
  if (!content.includes("import { useTranslation } from 'react-i18next'")) {
    // Add import after the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const lineEnd = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, lineEnd + 1) + 
                "import { useTranslation } from 'react-i18next';\n" + 
                content.slice(lineEnd + 1);
    }
  }
  
  // Check if useTranslation hook is already added
  if (!content.includes('const { t } = useTranslation()')) {
    // Find the component function and add the hook
    const componentPatterns = [
      new RegExp(`(const\\s+${fileConfig.componentName}\\s*=\\s*(?:\\([^)]*\\)|[^=])*=>\\s*\\{)`),
      new RegExp(`(function\\s+${fileConfig.componentName}\\s*\\([^)]*\\)\\s*\\{)`),
      new RegExp(`(export\\s+default\\s+function\\s+${fileConfig.componentName}\\s*\\([^)]*\\)\\s*\\{)`)
    ];
    
    for (const pattern of componentPatterns) {
      const match = content.match(pattern);
      if (match) {
        const insertPos = content.indexOf(match[1]) + match[1].length;
        content = content.slice(0, insertPos) + 
                  "\n    const { t } = useTranslation();" + 
                  content.slice(insertPos);
        break;
      }
    }
  }
  
  // Replace hardcoded Arabic strings with t() calls
  // Sort by length descending to replace longer strings first
  const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  
  for (const [arabic, translation] of sortedTranslations) {
    // Replace in JSX text content (between > and <)
    const jsxPattern = new RegExp(`(?<=>)\\s*${arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?=<)`, 'g');
    content = content.replace(jsxPattern, (match) => ` ${translation} `);
    
    // Replace in string literals
    const stringPattern = new RegExp(`['"]${arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
    content = content.replace(stringPattern, translation);
    
    // Replace in JSX attribute values (placeholder, alt, title, etc.)
    const attrPattern = new RegExp(`(placeholder|alt|title)=["']${arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    content = content.replace(attrPattern, `$1={${translation}}`);
    
    // Replace in template literals
    const templatePattern = new RegExp(`\`${arabic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\``, 'g');
    content = content.replace(templatePattern, `\${${translation}}`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${fileConfig.path}`);
  return true;
}

// Process all files
let successCount = 0;
let failCount = 0;

for (const fileConfig of files) {
  if (addI18nToFile(fileConfig)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log(`\nDone! Updated: ${successCount} files, Failed: ${failCount} files`);
