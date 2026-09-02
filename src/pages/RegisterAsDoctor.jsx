import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';
import PALESTINE_LOCATIONS from '../constants/locations';

const RegisterAsDoctor = () => {
    const [specializations, setSpecializations] = useState([]);
    const [submitting, setSubmitting] = useState(false);

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

        if (!formData.clinicName) { toast.error('يرجى إدخال اسم العيادة'); return; }
        if (!formData.clinicAddress) { toast.error('يرجى إدخال عنوان العيادة'); return; }
        if (!formData.licenseNumber) { toast.error('يرجى إدخال رقم الترخيص'); return; }
        if (!formData.specializationId) { toast.error('يرجى اختيار التخصص'); return; }
        if (!formData.experienceYears) { toast.error('يرجى إدخال سنوات الخبرة'); return; }
        if (!formData.consultationFee || Number(formData.consultationFee) <= 0) { toast.error('يرجى إدخال سعر الكشفية'); return; }
        if (!formData.idCard) { toast.error('يرجى رفع صورة الهوية'); return; }
        if (!formData.cv) { toast.error('يرجى رفع السيرة الذاتية'); return; }

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
                toast.success('تم إرسال طلب الانضمام بنجاح! سيتم مراجعة طلبك خلال 48 ساعة.');
                setFormData({
                    clinicName: '', clinicAddress: '',
                    licenseNumber: '', specializationId: '', experienceYears: '',
                    consultationFee: '', bio: '', idCard: null, cv: null, additionalNotes: '',
                    hasSecretary: false, secretaryEmail: ''
                });
            } else {
                const errorMsg = data.errors?.[0]?.message || data.message || 'حدث خطأ أثناء إرسال الطلب';
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        // تم إضافة pt-24 لضمان عدم تداخل هيدر الصفحة مع الـ Navbar الثابت علوياً
        <div className="min-h-screen bg-[#f7f9fc] text-slate-800 pt-24 pb-16" dir="rtl">

            {/* رأس الصفحة - العناوين الرئيسية */}
            <header className="text-center py-10 px-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#118fa6] mb-2">تسجيل طبيب جديد</h1>
                <p className="text-slate-500 text-sm md:text-base font-semibold">أكمل ملفك المهني للانضمام إلى نخبة أطباء منصة طبيبي</p>
            </header>

            {/* جسم الاستمارة الرئيسي */}
            <main className="max-w-4xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* القسم 1: بيانات العيادة */}
                    <div className="bg-white border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-base font-extrabold">بيانات العيادة</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">اسم العيادة</label>
                                <input
                                    type="text"
                                    name="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    placeholder="مثال: مركز الطمأنينة"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">عنوان العيادة</label>
                                <div className="relative">
                                    <select
                                        name="clinicAddress"
                                        value={formData.clinicAddress}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-10 pr-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white text-gray-600 appearance-none cursor-pointer"
                                    >
                                        <option value="">اختر المنطقة...</option>
                                        {PALESTINE_LOCATIONS.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute left-4 top-4 text-gray-400 pointer-events-none stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 mb-2">العنوان بالتفصيل</label>
                                <input
                                    type="text"
                                    name="detailedAddress"
                                    value={formData.detailedAddress}
                                    onChange={handleChange}
                                    placeholder="مثال: شارع الشهداء، بجانب صيدلية الحياة، الطابق الثاني"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* القسم 3: المؤهلات والترخيص */}
                    <div className="bg-white border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 className="text-base font-extrabold">المؤهلات والترخيص</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">رقم الترخيص</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="000-000-000"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] text-left"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">التخصص</label>
                                {/* تم احتواء الـ select داخل relative وتزويده بسهم مخصص تفادياً لاختفائه بسبب appearance-none */}
                                <div className="relative">
                                    <select
                                        name="specializationId"
                                        value={formData.specializationId}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-10 pr-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white text-gray-600 appearance-none cursor-pointer"
                                    >
                                        <option value="">اختر التخصص...</option>
                                        {specializations.map(spec => (
                                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute left-4 top-4 text-gray-400 pointer-events-none stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">سنوات الخبرة</label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] text-left"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">سعر الكشفية</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="consultationFee"
                                        value={formData.consultationFee}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full h-12 pl-16 pr-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] text-left"
                                        dir="ltr"
                                    />
                                    <span className="absolute left-3 top-3.5 text-xs font-bold text-gray-400">ILS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* القسم 4: التعريف والوثائق */}
                    <div className="bg-white border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-6 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-base font-extrabold">التعريف والوثائق</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">نبذة مهنية</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="اكتب نبذة مختصرة عن مسيرتك المهنية..."
                                    className="w-full h-28 p-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6] resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* إرفاق الهوية */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">إرفاق الهوية</label>
                                    <div className="border border-dashed border-[#bcd3ee] rounded-xl p-4 bg-slate-50/40 text-center relative hover:bg-slate-50 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'idCard')}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <svg className="w-5 h-5 text-slate-400 stroke-[2]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                            </svg>
                                            <span className="text-xs font-bold text-slate-500">انقر لرفع صورة الهوية</span>
                                        </div>
                                        {formData.idCard && <p className="mt-1 text-[11px] text-emerald-600 font-bold">✓ {formData.idCard.name}</p>}
                                    </div>
                                </div>
                                {/* إرفاق السيرة الذاتية */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">إرفاق السيرة الذاتية</label>
                                    <div className="border border-dashed border-[#bcd3ee] rounded-xl p-4 bg-slate-50/40 text-center relative hover:bg-slate-50 cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={(e) => handleFileChange(e, 'cv')}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <svg className="w-5 h-5 text-slate-400 stroke-[2]" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="text-xs font-bold text-slate-500">انقر لرفع ملف PDF</span>
                                        </div>
                                        {formData.cv && <p className="mt-1 text-[11px] text-emerald-600 font-bold">✓ {formData.cv.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* القسم 5: إضافات */}
                    <div className="bg-white border border-[#cfd9e8] rounded-2xl p-6 shadow-xs">
                        <div className="flex items-center gap-2 mb-4 text-[#118fa6]">
                            <svg className="w-5 h-5 stroke-[2.2] fill-none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-base font-extrabold">إضافات</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">ملاحظات إضافية</label>
                                <input
                                    type="text"
                                    name="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={handleChange}
                                    placeholder="أي معلومات أخرى ترغب بمشاركتها..."
                                    className="w-full h-14 px-4 border border-[#bcd3ee] rounded-xl text-sm outline-none focus:border-[#118fa6]"
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
                            {submitting ? 'جاري الإرسال...' : 'إرسال طلب الانضمام'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-1/3 h-12 border border-[#bcd3ee] bg-white text-[#118fa6] font-bold rounded-xl text-base hover:bg-slate-50 transition-colors order-2 sm:order-1"
                        >
                            السابق
                        </button>
                    </div>

                    <p className="text-center text-[11px] font-bold text-slate-400 mt-2">سيتم مراجعة طلبك من قبل فريقنا المختص خلال 48 ساعة.</p>
                </form>

                {/* كروت الميزات والضمانات السفلية التابعة لـ طيبي */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">أمان البيانات</h4>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">نضمن حماية قصوى لبياناتك الشخصية والمهنية.</p>
                    </div>

                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">شبكة واسعة</h4>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">انضم إلى مجتمع يضم أكثر من 10,000 طبيب.</p>
                    </div>

                    <div className="bg-[#edf4ff] rounded-2xl p-5 border border-[#e2eaf8] flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-[#118fa6] text-white grid place-items-center mb-3">
                            <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-black text-[#118fa6] mb-1">نمو مهني</h4>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed">زد من وصولك للمرضى ونظّم مواعيدك بذكاء.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default RegisterAsDoctor;