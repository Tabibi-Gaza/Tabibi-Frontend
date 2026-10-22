import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PALESTINE_LOCATIONS from '../constants/locations';

const VALID_TYPES = ['pharmacy', 'lab', 'medicalCenter'];

const TYPE_TO_ENUM = {
    pharmacy: 'Pharmacy',
    lab: 'Lab',
    medicalCenter: 'MedicalCenter',
};

const RegisterFacility = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    const type = VALID_TYPES.includes(searchParams.get('type')) ? searchParams.get('type') : 'pharmacy';

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        facilityName: '',
        licenseNumber: '',
        area: '',
        detailedAddress: '',
        phoneNumber: '',
        description: '',
        licenseDocument: null,
    });

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login?view=register');
        }
    }, [navigate]);

    const L = isEn ? {
        titles: { pharmacy: 'New pharmacy registration', lab: 'New lab registration', medicalCenter: 'New medical center registration' },
        subtitles: {
            pharmacy: 'Complete your pharmacy details to join the Tabibi platform',
            lab: 'Complete your lab details to join the Tabibi platform',
            medicalCenter: 'Complete your medical center details to join the Tabibi platform',
        },
        facilityName: 'Facility name',
        facilityNamePh: 'e.g. Al-Shifa Pharmacy',
        license: 'License number',
        area: 'Area',
        selectArea: 'Select an area...',
        detailedAddress: 'Detailed address',
        detailedAddressPh: 'e.g. Al-Shuhada St., 2nd floor',
        phone: 'Contact phone',
        description: 'Description',
        descriptionPh: 'A short overview of your facility and services...',
        licenseDoc: 'License document',
        licenseDocHint: 'Click to upload the license image or PDF',
        fileSelected: 'File selected',
        submitting: 'Submitting...',
        submit: 'Submit application',
        reviewNote: 'Your application will be reviewed by our team. You can log in after it is approved.',
        okMsg: 'Application submitted successfully! It will be reviewed within 48 hours.',
        errMsg: 'An error occurred while submitting the application',
        errFacilityName: 'Please enter the facility name',
        errLicense: 'Please enter the license number',
        errArea: 'Please select an area',
        errDoc: 'Please upload the license document',
    } : {
        titles: { pharmacy: 'تسجيل صيدلية جديدة', lab: 'تسجيل مختبر جديد', medicalCenter: 'تسجيل مركز طبي جديد' },
        subtitles: {
            pharmacy: 'أكمل بيانات صيدليتك للانضمام إلى منصة طبيبي',
            lab: 'أكمل بيانات مختبرك للانضمام إلى منصة طبيبي',
            medicalCenter: 'أكمل بيانات مركزك الطبي للانضمام إلى منصة طبيبي',
        },
        facilityName: 'اسم المنشأة',
        facilityNamePh: 'مثال: صيدلية الشفاء',
        license: 'رقم الترخيص',
        area: 'المنطقة',
        selectArea: 'اختر المنطقة...',
        detailedAddress: 'العنوان بالتفصيل',
        detailedAddressPh: 'مثال: شارع الشهداء، الطابق الثاني',
        phone: 'رقم التواصل',
        description: 'نبذة',
        descriptionPh: 'نبذة مختصرة عن منشأتك وخدماتك...',
        licenseDoc: 'وثيقة الترخيص',
        licenseDocHint: 'انقر لرفع صورة الترخيص أو ملف PDF',
        fileSelected: 'تم اختيار الملف',
        submitting: 'جاري الإرسال...',
        submit: 'إرسال طلب الانضمام',
        reviewNote: 'سيتم مراجعة طلبك من قبل فريقنا. يمكنك تسجيل الدخول بعد اعتماد الطلب.',
        okMsg: 'تم إرسال طلبك بنجاح! سيتم مراجعته خلال 48 ساعة.',
        errMsg: 'حدث خطأ أثناء إرسال الطلب',
        errFacilityName: 'يرجى إدخال اسم المنشأة',
        errLicense: 'يرجى إدخال رقم الترخيص',
        errArea: 'يرجى اختيار المنطقة',
        errDoc: 'يرجى إرفاق وثيقة الترخيص',
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, licenseDocument: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.facilityName.trim()) { toast.error(L.errFacilityName); return; }
        if (!formData.licenseNumber.trim()) { toast.error(L.errLicense); return; }
        if (!formData.area) { toast.error(L.errArea); return; }
        if (!formData.licenseDocument) { toast.error(L.errDoc); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('FacilityType', TYPE_TO_ENUM[type]);
            fd.append('FacilityName', formData.facilityName);
            fd.append('LicenseNumber', formData.licenseNumber);
            fd.append('Area', formData.area);
            fd.append('DetailedAddress', formData.detailedAddress || '');
            fd.append('PhoneNumber', formData.phoneNumber || '');
            fd.append('Description', formData.description || '');
            fd.append('LicenseDocument', formData.licenseDocument);

            const { data } = await axiosInstance.post('/facility-applications', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.succeeded) {
                toast.success(data.message || L.okMsg);
                navigate('/');
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
        <div className="min-h-screen bg-[#f7f9fc] dark:bg-gray-900 text-slate-800 dark:text-gray-200 pt-24 pb-16" dir={isEn ? "ltr" : "rtl"}>
            <header className="text-center py-10 px-4">
                <h1 className="text-3xl md:text-4xl font-black text-[#118fa6] mb-2">{L.titles[type]}</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base font-semibold">{L.subtitles[type]}</p>
            </header>

            <main className="max-w-3xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] dark:border-gray-700 rounded-2xl p-6 shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.facilityName}</label>
                                <input
                                    type="text"
                                    name="facilityName"
                                    value={formData.facilityName}
                                    onChange={handleChange}
                                    placeholder={L.facilityNamePh}
                                    required
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.license}</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    placeholder="000-000-000"
                                    required
                                    dir="ltr"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] text-start bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.area}</label>
                                <select
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white cursor-pointer"
                                >
                                    <option value="">{L.selectArea}</option>
                                    {PALESTINE_LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.phone}</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    dir="ltr"
                                    className="w-full h-12 px-4 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] text-start bg-white dark:bg-gray-700 dark:text-white"
                                />
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
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.description}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder={L.descriptionPh}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-[#bcd3ee] dark:border-gray-600 rounded-xl text-sm outline-none focus:border-[#118fa6] bg-white dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-[#cfd9e8] dark:border-gray-700 rounded-2xl p-6 shadow-xs">
                        <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.licenseDoc}</label>
                        <label className="flex flex-col items-center justify-center gap-2 h-36 border-2 border-dashed border-[#bcd3ee] dark:border-gray-600 rounded-xl cursor-pointer hover:bg-[#118fa6]/5 transition-colors">
                            <svg className="w-8 h-8 text-[#118fa6]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                                {formData.licenseDocument ? `${L.fileSelected}: ${formData.licenseDocument.name}` : L.licenseDocHint}
                            </span>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleFileChange}
                                required
                            />
                        </label>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-gray-400 font-bold text-center">{L.reviewNote}</p>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#118fa6] hover:bg-[#0e7487] text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-60"
                    >
                        {submitting ? L.submitting : L.submit}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default RegisterFacility;
