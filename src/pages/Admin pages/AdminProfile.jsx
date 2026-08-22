import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_frontend/assets';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    // استهلاك دالة الآدمن والبيانات من الـ Context
    const { userData, updateAdminProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false); 
    const [image, setImage] = useState(false); 
    const [loading, setLoading] = useState(false); 

    // ستيت محلية معزولة لإدارة المدخلات أثناء الكتابة
    const [localData, setLocalData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        dob: ''
    });

    // 🔓 تفعيل وضع التعديل ونقل البيانات الحالية للستيت المحلية بدقة
    const handleEditClick = (e) => {
        e.preventDefault(); // منع أي سلوك افتراضي للفورم
        setLocalData({
            firstname: userData?.firstname || '',
            lastname: userData?.lastname || '',
            email: userData?.email || '',
            phone: userData?.phone || '',
            gender: userData?.gender || 'Male',
            dob: userData?.dob || ''
        });
        setIsEdit(true);
    };

    // 💾 دالة حفظ البيانات وإرسالها
    const updateProfileData = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        
        try {
            const dataToSend = new FormData(); 
            dataToSend.append('FirstName', localData.firstname); 
            dataToSend.append('LastName', localData.lastname); 
            dataToSend.append('Email', localData.email || userData.email); 
            dataToSend.append('PhoneNumber', localData.phone); 
            dataToSend.append('Gender', localData.gender); 
            if (localData.dob && localData.dob !== '0001-01-01') {
                dataToSend.append('DateOfBirth', localData.dob);
            }

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
                image: image ? URL.createObjectURL(image) : userData.image,
            };

            // إرسال البيانات وتحديث الـ Context فوراً للمزامنة مع الـ Navbar
            await updateAdminProfileData(dataToSend, localUpdates);
            
            // 🔒 العودة لوضع القراءة وحماية الحقول بعد النجاح
            setIsEdit(false); 
            setImage(false);  
        } catch (error) {
            console.error("حدث خطأ أثناء حفظ البيانات:", error);
            toast.error("فشل حفظ التعديلات");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEdit(false);
        setImage(false);
    };

    return userData && (
        <div className="w-full min-h-screen bg-[#ecf8fa] py-10 font-['Cairo']" dir="rtl">
            <div className=" ">
                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-6 md:p-10 shadow-xs flex flex-col md:flex-row justify-start items-start gap-10">

                    {/* 📸 العمود الأيمن: الصورة وزر الرفع المستقل */}
                    <div className="w-[220px] flex flex-col items-center shrink-0 mx-auto md:mx-0">
                    <div className="w-55 h-55 rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-gray-200 mb-5">
              {image || userData?.image ? (
                // 1. إذا كانت هناك صورة جديدة مرفوعة أو صورة قديمة مخزنة، نعرض الصورة
                <img
                  loading="lazy"
                  className="w-full h-full object-cover"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="صورة شخصية"
                />
              ) : (
                // 2. إذا لم تكن هناك أي صورة، نعرض أول حرفين بشكل عريض ومناسب للحجم الكبير
                <div className="w-full h-full bg-[#138C9F] text-white flex items-center justify-center font-black text-4xl select-none font-['Cairo']">
                  {userData
                    ? `${userData.firstname.slice(0, 2) || ""}`
                    : "?"}
                </div>
              )}
            </div>

                        <div className="relative w-full flex justify-center items-center">
                            <label
                                htmlFor="file-upload"
                                className={`bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-2.5 px-5 rounded-lg text-sm font-medium w-[220px] flex items-center justify-center gap-2 transition-all duration-300 ${
                                    !isEdit ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                            >
                                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21,15V18.5A3.5,3.5,0,0,1,17.5,22H6.5A3.5,3.5,0,0,1,3,18.5V15M12,2L12,15M12,2L8,6M12,2L16,6"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                رفع صورة
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                disabled={!isEdit}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed"
                                onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* 📝 العمود الأيسر: الاستمارات والإدخال */}
                    <div className="flex-grow w-full">
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-[#0B1C30] mb-1.5">المعلومات الشخصية</h2>
                            <p className="text-[#526069] text-sm">قم بتحديث معلوماتك الأساسية لضمان تجربة حجز دقيقة.</p>
                        </div>

                        <div className="border-b border-[#C3C6D6] my-5 w-full"></div>

                        <form onSubmit={updateProfileData} className="grid grid-cols-1 sm:grid-cols-2 gap-8">

                            {/* الاسم الأول */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">الاسم الأول</label>
                                <input
                                    type="text"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.firstname : userData.firstname || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, firstname: e.target.value }))}
                                    placeholder="الاسم الأول"
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-lg text-base outline-none transition-all duration-200 text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* الاسم الأخير */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">الاسم الأخير</label>
                                <input
                                    type="text"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.lastname : userData.lastname || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, lastname: e.target.value }))}
                                    placeholder="الاسم الأخير"
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-lg text-base outline-none transition-all duration-200 text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* البريد الإلكتروني */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.email : userData.email || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="example@mail.com"
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-lg text-base outline-none transition-all duration-200 text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* رقم الهاتف */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.phone : userData.phone || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+970 "
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-lg text-base outline-none transition-all duration-200 text-black bg-white focus:border-[#138C9F] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* تاريخ الميلاد */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">تاريخ الميلاد</label>
                                <input
                                    type="date"
                                    disabled={!isEdit || loading}
                                    value={isEdit ? localData.dob : userData.dob || ''}
                                    onChange={(e) => setLocalData(prev => ({ ...prev, dob: e.target.value }))}
                                    className="py-2.5 px-4 border border-[#C3C6D6] rounded-lg text-base outline-none transition-all duration-200 text-black bg-white focus:border-[#138C9F] h-[48px] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* مكوّن اختيار الجنس التفاعلي */}
                            <div className="flex flex-col gap-1.5 text-right">
                                <label className="text-[#138C9F]/85 font-medium text-sm">الجنس</label>
                                <div className="flex items-center border border-[#C3C6D6] rounded-lg overflow-hidden bg-[#E5EEFF] h-[48px]">
                                    <button
                                        type="button" 
                                        disabled={!isEdit || loading}
                                        onClick={() => setLocalData(prev => ({ ...prev, gender: 'Male' }))}
                                        className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
                                            (isEdit ? localData.gender : userData.gender) === 'Male' ? 'bg-[#138C9F] text-white font-bold' : 'text-black hover:bg-[#C3C6D6]/40'
                                        } ${!isEdit ? 'cursor-not-allowed opacity-85' : 'cursor-pointer'}`}
                                    >
                                        ذكر
                                    </button>
                                    <button
                                        type="button" 
                                        disabled={!isEdit || loading}
                                        onClick={() => setLocalData(prev => ({ ...prev, gender: 'Female' }))}
                                        className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
                                            (isEdit ? localData.gender : userData.gender) === 'Female' ? 'bg-[#138C9F] text-white font-bold' : 'text-black hover:bg-[#C3C6D6]/40'
                                        } ${!isEdit ? 'cursor-not-allowed opacity-85' : 'cursor-pointer'}`}
                                    >
                                        أنثى
                                    </button>
                                </div>
                            </div>

                            {/* أزرار التحكم التبادلية */}
                            <div className="border-t border-[#C3C6D6] pt-6 mt-2 sm:col-span-2 text-right flex items-center gap-4">
                                {isEdit ? (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-300 shadow-xs disabled:bg-gray-400"
                                        >
                                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M20 6L9 17L4 12"
                                                    stroke="white"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-lg text-base font-medium cursor-pointer transition-all duration-300"
                                        >
                                            إلغاء
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button" // 🌟 تم التعديل الحاسم هنا لمنع الحفظ التلقائي الفوري!
                                        onClick={handleEditClick}
                                        className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-all duration-300 shadow-xs"
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

export default AdminProfile;