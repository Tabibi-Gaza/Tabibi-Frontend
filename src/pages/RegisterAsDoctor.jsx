import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import PALESTINE_LOCATIONS from '../constants/locations';

const RegisterAsDoctor = () => {
    const [specializations, setSpecializations] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const { i18n } = useTranslation();
    const isEn = i18n.language === "en";

    const [formData, setFormData] = useState({
        clinicName: '',
        clinicAddress: '',
        detailedAddress: '',
        licenseNumber: '',
        specializationId: '',
        experienceYears: '',
        consultationFee: '',
        bio: '',
        idCard: null,
        cv: null,
        additionalNotes: '',
        hasSecretary: false,
        secretaryEmail: ''
    });

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const { data } = await axiosInstance.get('/specializations/lookup');
                if (data.succeeded && data.data) {
                    setSpecializations(data.data);
                }
            } catch (error) {

            }
        };
        fetchSpecializations();
    }, []);

    const L = isEn ? {
        title: "New doctor registration",
        subtitle: "Complete your professional profile to join the elite doctors of the Tabibi platform",
        clinicSection: "Clinic details",
        clinicName: "Clinic name",
        clinicNamePh: "e.g. Al-Tamaneen Center",
        clinicArea: "Clinic area",
        selectArea: "Select an area...",
        detailedAddress: "Detailed address",
        detailedAddressPh: "e.g. Al-Shuhada St., next to Hayat Pharmacy, 2nd floor",
        qualSection: "Qualifications & license",
        license: "License number",
        specialty: "Specialty",
        selectSpecialty: "Select a specialty...",
        yearsExp: "Years of experience",
        fee: "Consultation fee",
        docsSection: "Profile & documents",
        bio: "Professional bio",
        bioPh: "Write a short summary of your career...",
        idUpload: "ID attachment",
        idUploadHint: "Click to upload the ID image",
        cvUpload: "CV attachment",
        cvUploadHint: "Click to upload the PDF file",
        extrasSection: "Extras",
        notes: "Additional notes",
        notesPh: "Any other information you'd like to share...",
        submitting: "Submitting...",
        submit: "Submit application",
        back: "Back",
        reviewNote: "Your application will be reviewed by our team within 48 hours.",
        sec1: "Data security",
        sec1d: "We guarantee maximum protection for your personal and professional data.",
        sec2: "Wide network",
        sec2d: "Join a community of more than 10,000 doctors.",
        sec3: "Professional growth",
        sec3d: "Expand your reach to patients and manage your schedule smarter.",
        errClinic: "Please enter the clinic name",
        errAddr: "Please enter the clinic address",
        errLicense: "Please enter the license number",
        errSpec: "Please select a specialty",
        errYears: "Please enter years of experience",
        errFee: "Please enter the consultation fee",
        errId: "Please upload the ID image",
        errCv: "Please upload the CV",
        okMsg: "Application submitted successfully! It will be reviewed within 48 hours.",
        errMsg: "An error occurred while submitting the application",
    } : {
        title: "تسجيل طبيب جديد",
        subtitle: "أكمل ملفك المهني للانضمام إلى نخبة أطباء منصة طبيبي",
        clinicSection: "بيانات العيادة",
        clinicName: "اسم العيادة",
        clinicNamePh: "مثال: مركز الطمأنينة",
        clinicArea: "عنوان العيادة",
        selectArea: "اختر المنطقة...",
        detailedAddress: "العنوان بالتفصيل",
        detailedAddressPh: "مثال: شارع الشهداء، بجانب صيدلية الحياة، الطابق الثاني",
        qualSection: "المؤهلات والترخيص",
        license: "رقم الترخيص",
        specialty: "التخصص",
        selectSpecialty: "اختر التخصص...",
        yearsExp: "سنوات الخبرة",
        fee: "سعر الكشفية",
        docsSection: "التعريف والوثائق",
        bio: "نبذة مهنية",
        bioPh: "اكتب نبذة مختصرة عن مسيرتك المهنية...",
        idUpload: "إرفاق الهوية",
        idUploadHint: "انقر لرفع صورة الهوية",
        cvUpload: "إرفاق السيرة الذاتية",
        cvUploadHint: "انقر لرفع ملف PDF",
        extrasSection: "إضافات",
        notes: "ملاحظات إضافية",
        notesPh: "أي معلومات أخرى ترغب بمشاركتها...",
        submitting: "جاري الإرسال...",
        submit: "إرسال طلب الانضمام",
        back: "السابق",
        reviewNote: "سيتم مراجعة طلبك من قبل فريقنا المختص خلال 48 ساعة.",
        sec1: "أمان البيانات",
        sec1d: "نضمن حماية قصوى لبياناتك الشخصية والمهنية.",
        sec2: "شبكة واسعة",
        sec2d: "انضم إلى مجتمع يضم أكثر من 10,000 طبيب.",
        sec3: "نمو مهني",
        sec3d: "زد من وصولك للمرضى ونظّم مواعيدك بذكاء.",
        errClinic: "يرجى إدخال اسم العيادة",
        errAddr: "يرجى إدخال عنوان العيادة",
        errLicense: "يرجى إدخال رقم الترخيص",
        errSpec: "يرجى اختيار التخصص",
        errYears: "يرجى إدخال سنوات الخبرة",
        errFee: "يرجى إدخال سعر الكشفية",
        errId: "يرجى رفع صورة الهوية",
        errCv: "يرجى رفع السيرة الذاتية",
        okMsg: "تم إرسال طلب الانضمام بنجاح! سيتم مراجعة طلبك خلال 48 ساعة.",
        errMsg: "حدث خطأ أثناء إرسال الطلب",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [fieldName]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.clinicName) { toast.error(L.errClinic); return; }
        if (!formData.clinicAddress) { toast.error(L.errAddr); return; }
        if (!formData.licenseNumber) { toast.error(L.errLicense); return; }
        if (!formData.specializationId) { toast.error(L.errSpec); return; }
        if (!formData.experienceYears) { toast.error(L.errYears); return; }
        if (!formData.consultationFee || Number(formData.consultationFee) <= 0) { toast.error(L.errFee); return; }
        if (!formData.idCard) { toast.error(L.errId); return; }
        if (!formData.cv) { toast.error(L.errCv); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('SpecializationId', formData.specializationId);
            fd.append('LicenseNumber', formData.licenseNumber);
            fd.append('YearsOfExperience', formData.experienceYears);
            fd.append('SessionPrice', formData.consultationFee);
            fd.append('ClinicName', formData.clinicName);
            fd.append('ClinicAddress', formData.clinicAddress);
            fd.append('DetailedAddress', formData.detailedAddress || '');
            fd.append('Bio', formData.bio);
            fd.append('Notes', formData.additionalNotes);
            fd.append('IdDocument', formData.idCard);
            fd.append('CvFile', formData.cv);
            if (formData.hasSecretary && formData.secretaryEmail) {
                fd.append('SecretaryEmail', formData.secretaryEmail);
            }

            const { data } = await axiosInstance.post('/doctor-applications', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.succeeded) {
                toast.success(L.okMsg);
                setFormData({
                    clinicName: '', clinicAddress: '', detailedAddress: '',
                    licenseNumber: '', specializationId: '', experienceYears: '',
                    consultationFee: '', bio: '', idCard: null, cv: null, additionalNotes: '',
                    hasSecretary: false, secretaryEmail: ''
                });
            } else {
                const errorMsg = data.errors?.[0]?.message || data.message || L.errMsg;
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || L.errMsg;
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        // تم إضافة pt-24 لضمان عدم تداخل هيدر الصفحة مع الـ Navbar الثابت علوياً
        <div className="min-h-screen bg-[#f7f9fc] dark:bg-gray-900 text-slate-800 dark:text-gray-200 pt-24 pb-16" dir={isEn ? "ltr" : "rtl"}>
            <header className="text-center py-10 px-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#118fa6] mb-2">{L.title}</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-semibold">{L.subtitle}</p>
            </header>

            {/* جسم الاستمارة الرئيسي */}
            <main className="max-w-4xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* القسم 1: بيانات العيادة */}
                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-base font-extrabold">{L.clinicSection}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.clinicName}</label>
                                <input
                                    type="text"
                                    name="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    placeholder={L.clinicNamePh}
                                    required
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.clinicArea}</label>
                                <div className="relative">
                                    <select
                                        name="clinicAddress"
                                        value={formData.clinicAddress}
                                        onChange={handleChange}
                                        className="w-full h-12 ps-4 pe-10 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-500 appearance-none cursor-pointer"
                                    >
                                        <option value="">{L.selectArea}</option>
                                        {PALESTINE_LOCATIONS.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute end-4 top-4 text-gray-400 dark:text-gray-500 pointer-events-none stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.detailedAddress}</label>
                                <input
                                    type="text"
                                    name="detailedAddress"
                                    value={formData.detailedAddress}
                                    onChange={handleChange}
                                    placeholder={L.detailedAddressPh}
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* القسم 3: المؤهلات والترخيص */}
                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 className="text-base font-extrabold">{L.qualSection}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.license}</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="000-000-000"
                                    required
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] text-start bg-white dark:bg-gray-700 dark:text-white"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.specialty}</label>
                                {/* تم احتواء الـ select داخل relative وتزويده بسهم مخصص تفادياً لاختفائه بسبب appearance-none */}
                                <div className="relative">
                                    <select
                                        name="specializationId"
                                        value={formData.specializationId}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 ps-4 pe-10 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 dark:text-gray-500 appearance-none cursor-pointer"
                                    >
                                        <option value="">{L.selectSpecialty}</option>
                                        {specializations.map(spec => (
                                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute end-4 top-4 text-gray-400 dark:text-gray-500 pointer-events-none stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.yearsExp}</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                    min="0"
                                    max="70"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] text-start bg-white dark:bg-gray-700 dark:text-white"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.fee}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        placeholder="0"
                                        required
                                        min="1"
                                        className="w-full h-12 ps-16 pe-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] text-start bg-white dark:bg-gray-700 dark:text-white"
                                        dir="ltr"
                                    />
                                    <span className="absolute start-3 top-3.5 text-xs font-bold text-gray-400">ILS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* القسم 4: التعريف والوثائق */}
                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-base font-extrabold">{L.docsSection}</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.bio}</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder={L.bioPh}
                                    className="w-full h-28 p-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] resize-none bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* إرفاق الهوية */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.idUpload}</label>
                                    <div className="border border-dashed border-[#bcd3ee] rounded-xl p-4 bg-slate-50 dark:bg-gray-900/40 text-center relative hover:bg-slate-50 dark:bg-gray-900 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) => handleFileChange(e, 'idCard')}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <svg className="w-5 h-5 text-slate-400 dark:text-gray-500 stroke-[2]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                            </svg>
                                            <span className="text-xs font-bold text-slate-500">{L.idUploadHint}</span>
                                        </div>
                                        {formData.idCard && <p className="mt-1 text-[11px] text-emerald-600 font-bold">✓ {formData.idCard.name}</p>}
                                    </div>
                                </div>
                                {/* إرفاق السيرة الذاتية */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.cvUpload}</label>
                                    <div className="border border-dashed border-[#bcd3ee] rounded-xl p-4 bg-slate-50 dark:bg-gray-900/40 text-center relative hover:bg-slate-50 dark:bg-gray-900 cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            required
                                            onChange={(e) => handleFileChange(e, 'cv')}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <svg className="w-5 h-5 text-slate-400 dark:text-gray-500 stroke-[2]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-xs font-bold text-slate-500">{L.cvUploadHint}</span>
                                        </div>
                                        {formData.cv && <p className="mt-1 text-[11px] text-emerald-600 font-bold">✓ {formData.cv.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* القسم 5: إضافات */}
                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-4 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-base font-extrabold">{L.extrasSection}</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.notes}</label>
                                <input
                                    type="text"
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleChange}
                                    placeholder={L.notesPh}
                                    className="w-full h-14 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* أزرار التحكم والتنقل السفلية */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-2/3 h-12 bg-[#118fa6] text-white font-black rounded-xl text-base hover:bg-[#0e788c] transition-colors order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? L.submitting : L.submit}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-1/3 h-12 border border-[#bcd3ee] bg-white dark:bg-gray-800 text-[#118fa6] font-bold rounded-xl text-base hover:bg-slate-50 dark:bg-gray-900 transition-colors order-2 sm:order-1"
                        >
                            {L.back}
                        </button>
                    </div>

                    <p className="text-center text-[11px] font-bold text-slate-400 dark:text-gray-500 mt-2">{L.reviewNote}</p>
                </form>

                {/* كروت الميزات والضمانات السفلية التابعة لـ طيبي */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">{L.sec1}</h4>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 leading-relaxed">{L.sec1d}</p>
                    </div>

                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">{L.sec2}</h4>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 leading-relaxed">{L.sec2d}</p>
                    </div>

                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">{L.sec3}</h4>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-gray-400 leading-relaxed">{L.sec3d}</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RegisterAsDoctor;