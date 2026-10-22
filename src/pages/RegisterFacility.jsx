import React, { useState } from 'react';
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

const THEMES = {
    pharmacy: {
        accent: '#16a34a',
        accentHover: '#15803d',
        light: '#f0fdf4',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <g transform="rotate(-45 12 12)">
                    <rect x="3" y="8" width="18" height="8" rx="4" />
                    <path d="M12 8v8" />
                </g>
            </svg>
        ),
    },
    lab: {
        accent: '#ec4899',
        accentHover: '#db2777',
        light: '#fdf2f8',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 3h6M10 3v6l-5 8a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-8V3" />
                <path d="M7.5 15h9" />
            </svg>
        ),
    },
    medicalCenter: {
        accent: '#2563eb',
        accentHover: '#1d4ed8',
        light: '#eff6ff',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9.5 21v-4.5h5V21M12 7.5v3M10.5 9h3" />
            </svg>
        ),
    },
};

const RegisterFacility = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    const type = VALID_TYPES.includes(searchParams.get('type')) ? searchParams.get('type') : 'pharmacy';
    const theme = THEMES[type];

    const [submitting, setSubmitting] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [facilityName, setFacilityName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [area, setArea] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [description, setDescription] = useState('');
    const [licenseDocument, setLicenseDocument] = useState(null);

    const L = isEn ? {
        titles: { pharmacy: 'New pharmacy registration', lab: 'New lab registration', medicalCenter: 'New medical center registration' },
        subtitles: {
            pharmacy: 'Create your pharmacy account and join the Tabibi platform',
            lab: 'Create your lab account and join the Tabibi platform',
            medicalCenter: 'Create your medical center account and join the Tabibi platform',
        },
        accountSection: 'Account Information',
        facilitySection: 'Facility Information',
        fullName: 'Full name',
        fullNamePh: 'e.g. Ahmed Mohammed',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Confirm password',
        phone: 'Phone number',
        facilityName: 'Facility name',
        facilityNamePh: 'e.g. Al-Shifa Pharmacy',
        license: 'License number',
        area: 'Area',
        selectArea: 'Select an area...',
        detailedAddress: 'Facility address',
        description: 'Description (optional)',
        descriptionPh: 'A short overview of your facility and services...',
        licenseDoc: 'License document',
        licenseDocHint: 'Click to upload the license image or PDF',
        fileSelected: 'File selected',
        submitting: 'Submitting...',
        submit: 'Create account & submit request',
        okMsg: 'Request received successfully! It will be approved by the platform administration.',
        errRequired: 'Please fill in all required fields',
        errPasswordShort: 'Password must be at least 8 characters',
        errPasswordsMismatch: 'Passwords do not match',
        errPhone: 'Invalid phone number (7-15 digits)',
        errDoc: 'Please upload the license document',
        errGeneric: 'An error occurred while submitting',
        errEmailExists: 'This email is already registered. Please log in first, then you can submit your request from the registration page.',
        haveAccount: 'Already have an account?',
        loginNow: 'Log in now',
    } : {
        titles: { pharmacy: 'تسجيل صيدلية جديدة', lab: 'تسجيل مختبر جديد', medicalCenter: 'تسجيل مركز طبي جديد' },
        subtitles: {
            pharmacy: 'أنشئ حساب صيدليتك وانضم إلى منصة طبيبي',
            lab: 'أنشئ حساب مختبرك وانضم إلى منصة طبيبي',
            medicalCenter: 'أنشئ حساب مركزك الطبي وانضم إلى منصة طبيبي',
        },
        accountSection: 'معلومات الحساب',
        facilitySection: 'بيانات المنشأة',
        fullName: 'اسم المستخدم',
        fullNamePh: 'مثال: أحمد محمد',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        phone: 'رقم الهاتف',
        facilityName: 'اسم المنشأة',
        facilityNamePh: 'مثال: صيدلية الشفاء',
        license: 'رقم الترخيص',
        area: 'المنطقة',
        selectArea: 'اختر المنطقة...',
        detailedAddress: 'عنوان المنشأة',
        description: 'نبذة (اختياري)',
        descriptionPh: 'نبذة مختصرة عن منشأتك وخدماتك...',
        licenseDoc: 'وثيقة الترخيص',
        licenseDocHint: 'انقر لرفع صورة الترخيص أو ملف PDF',
        fileSelected: 'تم اختيار الملف',
        submitting: 'جاري الإرسال...',
        submit: 'إنشاء الحساب وإرسال الطلب',
        okMsg: 'تم استلام طلبك بنجاح، سيتم اعتماده من قبل إدارة المنصة.',
        errRequired: 'يرجى تعبئة جميع الحقول المطلوبة',
        errPasswordShort: 'كلمة المرور يجب ألا تقل عن 8 أحرف',
        errPasswordsMismatch: 'كلمتا المرور غير متطابقتين',
        errPhone: 'رقم الهاتف غير صالح (من 7 إلى 15 رقماً)',
        errDoc: 'يرجى إرفاق وثيقة الترخيص',
        errGeneric: 'حدث خطأ أثناء إرسال الطلب',
        errEmailExists: 'هذا البريد مسجل مسبقاً. سجّل دخولك أولاً، وبعدها يمكنك تقديم طلب التسجيل.',
        haveAccount: 'لديك حساب بالفعل؟',
        loginNow: 'سجّل الدخول الآن',
    };

    const inputStyle = {
        borderColor: '#d1d5db',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName.trim() || !email.trim() || !password || !phone.trim() || !facilityName.trim() || !licenseNumber.trim() || !area || !detailedAddress.trim()) {
            toast.error(L.errRequired);
            return;
        }
        if (password.length < 8) {
            toast.error(L.errPasswordShort);
            return;
        }
        if (password !== confirmPassword) {
            toast.error(L.errPasswordsMismatch);
            return;
        }
        const phoneDigits = phone.replace(/[^0-9]/g, '');
        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            toast.error(L.errPhone);
            return;
        }
        if (!licenseDocument) {
            toast.error(L.errDoc);
            return;
        }

        setSubmitting(true);
        try {
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];

            const { data } = await axiosInstance.post('/auth/register', {
                firstName,
                lastName,
                email,
                password,
                phoneNumber: phoneDigits,
                gender: 3,
                dateOfBirth: '2000-01-01',
                address: detailedAddress,
                acceptPrivacyPolicy: true,
            });

            if (!data.succeeded || !data.data) {
                const errorCode = data.errors?.[0]?.code;
                const errorMsg = data.errors?.[0]?.message || data.message || L.errGeneric;
                if (errorCode === 'email_exists') {
                    toast.error(L.errEmailExists);
                } else {
                    toast.error(errorMsg);
                }
                return;
            }

            const { accessToken, user } = data.data.response || data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            const fd = new FormData();
            fd.append('FacilityType', TYPE_TO_ENUM[type]);
            fd.append('FacilityName', facilityName);
            fd.append('LicenseNumber', licenseNumber);
            fd.append('Area', area);
            fd.append('DetailedAddress', detailedAddress);
            fd.append('PhoneNumber', phoneDigits);
            fd.append('Description', description || '');
            fd.append('LicenseDocument', licenseDocument);

            const { data: appData } = await axiosInstance.post('/facility-applications', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (appData.succeeded) {
                toast.success(appData.message || L.okMsg);
                navigate('/');
            } else {
                toast.error(appData.errors?.[0]?.message || appData.message || L.errGeneric);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || L.errGeneric;
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-16 px-4" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                        style={{ backgroundColor: theme.light, color: theme.accent }}
                    >
                        {theme.icon}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-gray-100 mb-2">{L.titles[type]}</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">{L.subtitles[type]}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-black text-slate-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></span>
                            {L.accountSection}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.fullName}</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={L.fullNamePh}
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.email}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="blog@email.com"
                                    required
                                    dir="ltr"
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all text-start"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.password}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.confirmPassword}</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.phone}</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="05xxxxxxxx"
                                    required
                                    dir="ltr"
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all text-start"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-black text-slate-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></span>
                            {L.facilitySection}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.facilityName}</label>
                                <input
                                    type="text"
                                    value={facilityName}
                                    onChange={(e) => setFacilityName(e.target.value)}
                                    placeholder={L.facilityNamePh}
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.license}</label>
                                <input
                                    type="text"
                                    value={licenseNumber}
                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                    placeholder="000-000-000"
                                    required
                                    dir="ltr"
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all text-start"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.area}</label>
                                <select
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all cursor-pointer"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; }}
                                >
                                    <option value="">{L.selectArea}</option>
                                    {PALESTINE_LOCATIONS.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.detailedAddress}</label>
                                <input
                                    type="text"
                                    value={detailedAddress}
                                    onChange={(e) => setDetailedAddress(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.description}</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={L.descriptionPh}
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-xl text-sm outline-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 transition-all resize-none"
                                    style={{ borderColor: '#d1d5db' }}
                                    onFocus={(e) => { e.target.style.borderColor = theme.accent; e.target.style.boxShadow = `0 0 0 3px ${theme.light}`; }}
                                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 dark:text-gray-400 mb-2">{L.licenseDoc}</label>
                                <label
                                    className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                                    style={{ borderColor: '#d1d5db' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.backgroundColor = theme.light; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    <svg className="w-7 h-7" style={{ color: theme.accent }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                    </svg>
                                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                                        {licenseDocument ? `${L.fileSelected}: ${licenseDocument.name}` : L.licenseDocHint}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={(e) => { if (e.target.files?.[0]) setLicenseDocument(e.target.files[0]); }}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition-all disabled:opacity-60"
                        style={{ backgroundColor: submitting ? '#9ca3af' : theme.accent }}
                        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = theme.accentHover; }}
                        onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = theme.accent; }}
                    >
                        {submitting ? L.submitting : L.submit}
                    </button>

                    <p className="text-sm text-center font-bold text-slate-600 dark:text-gray-300">
                        {L.haveAccount}{' '}
                        <span
                            className="underline cursor-pointer"
                            style={{ color: theme.accent }}
                            onClick={() => navigate('/login')}
                        >
                            {L.loginNow}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterFacility;
