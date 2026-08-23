import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_frontend/assets';
import { toast } from 'react-toastify';

const PALESTINE_LOCATIONS = [
  "مدينة غزة",
  "شمال غزة",
  "جباليا",
  "بيت لاهيا",
  "بيت حانون",
  "النصيرات",
  "دير البلح",
  "البريج",
  "المغازي",
  "الزاهرة",
  "الشجاعية",
  "الشيخ رضوان",
  "القرارة",
  "خان يونس",
  "رفح",
];

const DoctorProfile = () => {
    // استهلاك الـ Context الخاص بالطبيب
    const { doctorData, updateDoctorProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false); 
    const [image, setImage] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [showLocations, setShowLocations] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const fileInputRef = useRef(null);
    const locationDropdownRef = useRef(null);

    // ستيت محلية معزولة لإدارة المدخلات أثناء الكتابة
    const [localData, setLocalData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        experienceYears: '',
        specialization: '',
        clinicName: '',
        clinicAddress: '',
        detailedAddress: '',
        bio: '',
        sessionPrice: ''
    });

    // تفعيل وضع التعديل ونقل البيانات الحالية للستيت المحلية
    const handleEditClick = (e) => {
        e.preventDefault();
        setLocalData({
            firstname: doctorData?.firstname || '',
            lastname: doctorData?.lastname || '',
            email: doctorData?.email || '',
            phone: doctorData?.phone || '',
            gender: doctorData?.gender || 'Male',
            dob: doctorData?.dob || '',
            experienceYears: doctorData?.experienceYears || '',
            specialization: doctorData?.specialization || '',
            clinicName: doctorData?.clinicName || '',
            clinicAddress: doctorData?.clinicAddress || '',
            detailedAddress: doctorData?.detailedAddress || '',
            bio: doctorData?.bio || '',
            sessionPrice: doctorData?.sessionPrice || ''
        });
        setIsEdit(true);
    };

    // إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
                setShowLocations(false);
                setLocationSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // دالة حفظ البيانات وإرسالها لملف الطبيب
    const updateProfileData = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        
        try {
            const dataToSend = new FormData(); 
            dataToSend.append('FirstName', localData.firstname); 
            dataToSend.append('LastName', localData.lastname); 
            dataToSend.append('Email', localData.email); 
            dataToSend.append('PhoneNumber', localData.phone); 
            dataToSend.append('Gender', localData.gender); 
            dataToSend.append('DateOfBirth', localData.dob); 
            dataToSend.append('YearsOfExperience', localData.experienceYears || 0); 
            dataToSend.append('ClinicName', localData.clinicName); 
            dataToSend.append('ClinicAddress', localData.clinicAddress); 
            dataToSend.append('DetailedAddress', localData.detailedAddress || '');
            dataToSend.append('Bio', localData.bio); 
            dataToSend.append('SessionPrice', localData.sessionPrice || 0); 

            if (image) {
                dataToSend.append('ProfileImage', image); 
            }

            const localUpdates = {
                firstname: localData.firstname,
                lastname: localData.lastname,
                email: localData.email,
                phone: localData.phone,
                gender: localData.gender,
                dob: localData.dob,
                experienceYears: localData.experienceYears,
                specialization: localData.specialization,
                clinicName: localData.clinicName,
                clinicAddress: localData.clinicAddress,
                detailedAddress: localData.detailedAddress,
                bio: localData.bio,
                sessionPrice: localData.sessionPrice,
                image: image ? URL.createObjectURL(image) : doctorData.image
            };

            // إرسال وتحديث الـ Context فوراً للمزامنة التامة مع الـ DoctorNavbar
            await updateDoctorProfileData(dataToSend, localUpdates);
            
            setIsEdit(false); 
            setImage(false);  
        } catch (error) {

            toast.error("فشل حفظ التعديلات");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEdit(false);
        setImage(false);
    };

    return doctorData && (
        <div className="w-full min-h-screen bg-[#ecf8fa] py-5 font-['Tajawal']" dir="rtl">
            <div className=" mx-auto px-6">
                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-6 md:p-10 shadow-xs flex flex-col md:flex-row justify-start items-start gap-10">

                    {/* 📸 جزء الصورة ومعاينتها */}
                    <div className="w-full max-w-[220px] flex flex-col items-center shrink-0 mx-auto md:mx-0">
                        <div className="w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-[#C3C6D6] mb-5">
                            <img
                                loading="lazy"
                                decoding="async"
                                width="220"
                                height="293"
                                className="w-full h-full object-cover"
                                src={image ? URL.createObjectURL(image) : doctorData.image || '/images/default-doctor.webp'}
                                alt="صورة الطبيب الشخصية"
                            />
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            disabled={!isEdit}
                            className="hidden"
                            onChange={(e) => { if (e.target.files[0]) setImage(e.target.files[0]); }}
                        />

                        <button
                            type="button"
                            disabled={!isEdit}
                            onClick={() => fileInputRef.current.click()}
                            className={`bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-2.5 px-5 rounded-lg text-sm font-medium w-full max-w-[220px] flex items-center justify-center gap-2 transition-all ${!isEdit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            رفع صورة
                        </button>
                    </div>

                    {/* 📝 نموذج حقول البيانات الاستبدالي المماثل للآدمن تماماً والظاهر في image_299dfc.png */}
                    <div className="flex-grow w-full">
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-[#0B1C30] mb-1.5">المعلومات الشخصية للطبيب</h2>
                            <p className="text-[#526069] text-sm">قم بتحديث معلوماتك الأساسية لضمان تجربة حجز دقيقة عبر منصة طبيبي.</p>
                        </div>

                        <div className="border-b border-[#C3C6D6] my-5 w-full"></div>

                        <form onSubmit={updateProfileData} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* الاسم الأول */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">الاسم الأول</label>
                                <input
                                    type="text"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.firstname : doctorData.firstname || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, firstname: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* الاسم الأخير */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">الاسم الأخير</label>
                                <input
                                    type="text"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.lastname : doctorData.lastname || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, lastname: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* البريد الإلكتروني */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.email : doctorData.email || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, email: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500"
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* رقم الهاتف */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">رقم الهاتف</label>
                                <input
                                    type="text"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.phone : doctorData.phone || ''}
                                    onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setLocalData(prev => ({ ...prev, phone: val })); }}
                                    maxLength={10}
                                    placeholder="059XXXXXXXX"
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                    style={{ direction: 'ltr' }}
                                />
                            </div>

                            {/* الجنس التفاعلي */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">الجنس</label>
                                <div className="flex items-center border border-[#C3C6D6] rounded-xl overflow-hidden bg-gray-50 h-[46px] p-0.5">
                                    <button
                                        type="button" 
                                        disabled={!isEdit || loading}
                                        onClick={() => setLocalData(prev => ({ ...prev, gender: 'Male' }))}
                                        className={`flex-1 text-center h-full flex items-center justify-center font-bold text-sm transition-all rounded-lg ${
                                            (isEdit ? localData.gender : doctorData.gender) === 'Male' ? 'bg-[#138C9F] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        ذكر
                                    </button>
                                    <button
                                        type="button" 
                                        disabled={!isEdit || loading}
                                        onClick={() => setLocalData(prev => ({ ...prev, gender: 'Female' }))}
                                        className={`flex-1 text-center h-full flex items-center justify-center font-bold text-sm transition-all rounded-lg ${
                                            (isEdit ? localData.gender : doctorData.gender) === 'Female' ? 'bg-[#138C9F] text-white shadow-xs' : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                    >
                                        أنثى
                                    </button>
                                </div>
                            </div>

                            {/* تاريخ الميلاد */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">تاريخ الميلاد</label>
                                <input
                                    type="date"
                                    placeholder="00/00/0000"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.dob : doctorData.dob || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, dob: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* سنوات الخبرة */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">سنوات الخبرة</label>
                                <input
                                    type="number"
                                    placeholder="سنوات الخبرة"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.experienceYears : doctorData.experienceYears || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, experienceYears: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* سعر الكشفية */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">سعر الكشفية (₪)</label>
                                <input
                                    type="number"
                                    placeholder="سعر الكشفية"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.sessionPrice : doctorData.sessionPrice || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, sessionPrice: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* التخصص */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">التخصص</label>
                                <input
                                    type="text"
                                    placeholder="التخصص"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.specialization : doctorData.specialization || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, specialization: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* اسم العيادة */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F] font-bold text-sm">اسم العيادة</label>
                                <input
                                    type="text"
                                    placeholder="اسم العيادة"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.clinicName : doctorData.clinicName || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, clinicName: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* عنوان العيادة */}
                            <div className="flex flex-col gap-1.5 text-right sm:col-span-2">
                                <label className="text-[#138C9F] font-bold text-sm">عنوان العيادة</label>
                                <div className="relative" ref={locationDropdownRef}>
                                    <input
                                        type="text"
                                        placeholder="اختر المنطقة"
                                        disabled={!isEdit || loading}
                                        value={isEdit ? localData.clinicAddress : doctorData.clinicAddress || ''}
                                        onChange={(e) => {
                                            setLocalData(prev => ({ ...prev, clinicAddress: e.target.value }));
                                            setShowLocations(true);
                                        }}
                                        onFocus={() => isEdit && !loading && setShowLocations(true)}
                                        className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 w-full text-sm"
                                    />
                                    {isEdit && showLocations && (
                                        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white border border-[#C3C6D6] rounded-xl shadow-xl">
                                            <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-100">
                                                <input
                                                    type="text"
                                                    value={locationSearch}
                                                    onChange={(e) => setLocationSearch(e.target.value)}
                                                    placeholder="ابحث عن منطقة..."
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-[#138C9F]"
                                                    autoFocus
                                                />
                                            </div>
                                            {PALESTINE_LOCATIONS
                                                .filter(loc => !locationSearch || loc.includes(locationSearch))
                                                .map((loc) => (
                                                    <button
                                                        key={loc}
                                                        type="button"
                                                        onClick={() => {
                                                            setLocalData(prev => ({ ...prev, clinicAddress: loc }));
                                                            setShowLocations(false);
                                                            setLocationSearch('');
                                                        }}
                                                        className={`w-full text-right px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100 hover:bg-[#e6f4f6] hover:text-[#138C9F] ${localData.clinicAddress === loc ? 'bg-[#e6f4f6] text-[#138C9F] font-bold' : 'text-gray-700'}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            {PALESTINE_LOCATIONS.filter(loc => !locationSearch || loc.includes(locationSearch)).length === 0 && (
                                                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                    لا توجد نتائج
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* العنوان بالتفصيل */}
                            <div className="flex flex-col gap-1.5 text-right sm:col-span-2">
                                <label className="text-[#138C9F] font-bold text-sm">العنوان بالتفصيل</label>
                                <input
                                    type="text"
                                    placeholder="مثال: شارع الشهداء، بجانب صيدلية الحياة، الطابق الثاني"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.detailedAddress : doctorData.detailedAddress || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, detailedAddress: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50"
                                />
                            </div>

                            {/* نبذة عن الطبيب */}
                            <div className="flex flex-col gap-1.5 text-right sm:col-span-2">
                                <label className="text-[#138C9F] font-bold text-sm">نبذة عن الطبيب</label>
                                <textarea
                                    placeholder="نبذة مختصرة عن الطبيب وخبراته..."
                                    disabled={!isEdit || loading}
                                    rows={3}
                                    value={isEdit ? localData.bio : doctorData.bio || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-xl outline-none text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 resize-none"
                                />
                            </div>

                            {/* أزرار التحكم التبادلية أسفل الاستمارة */}
                            <div className="border-t border-[#C3C6D6] pt-6 mt-2 sm:col-span-2 text-right flex items-center gap-4">
                                {isEdit ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-3 px-10 rounded-xl text-base font-bold cursor-pointer inline-flex items-center gap-2.5 shadow-xs disabled:bg-gray-400"
                                        >
                                            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-xl text-base font-medium cursor-pointer"
                                        >
                                            إلغاء
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button" 
                                        onClick={handleEditClick}
                                        className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-3 px-10 rounded-xl text-base font-bold cursor-pointer inline-flex items-center gap-2.5 shadow-xs"
                                    >
                                        تعديل البيانات الشخصية
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;