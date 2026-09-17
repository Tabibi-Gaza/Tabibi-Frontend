import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'
import { COUNTRIES, DEFAULT_COUNTRY } from '../constants/countries'
import { useTranslation } from 'react-i18next'

const Myprofile = () => {
  // جلب البيانات ودوال المزامنة من الـ AppContext
  const { userData, setUserData, loadUserProfileData } = useContext(AppContext)
  const { t } = useTranslation()

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [showCountries, setShowCountries] = useState(false)

  // تم التخلص من الـ useEffect وتعيين الـ initial state مباشرة من الـ Context لتجنب الـ cascading renders
  const [localUserData, setLocalUserData] = useState(() => {
    return userData ? { ...userData } : null;
  })

  const imageUrl = localUserData?.image

  useEffect(() => {
    return () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl])

  // تحديد الدولة الأولية بناءً على الرقم المحفوظ إن وُجد
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const p = userData?.phone || "";
    const match = COUNTRIES.find((c) => p.startsWith(c.code));
    return match || DEFAULT_COUNTRY;
  })

  // دالة حفظ التعديلات وإرسالها للـ Backend ثم مزامنتها فوراً في كل الموقع
  const updateUserProfileData = async () => {
    try {
      if (!localUserData.gender) {
        toast.error(t('profile.genderRequired'))
        return
      }
      if (!localUserData.dob) {
        toast.error(t('profile.dobRequired'))
        return
      }
      if (!phoneNumberPart.trim()) {
        toast.error(t('profile.phoneRequired'))
        return
      }

      const formData = new FormData()
      formData.append('firstName', localUserData.firstname || '')
      formData.append('lastName', localUserData.lastname || '')
      formData.append('email', localUserData.email || '')
      formData.append('phoneNumber', localUserData.phone || '')
      formData.append('gender', localUserData.gender)
      formData.append('dateOfBirth', localUserData.dob)
      formData.append('address', localUserData.address?.line1 || '')

      if (image) {
        formData.append('profileImage', image)
      }

      const { data } = await axiosInstance.put('/patient/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.succeeded) {
        toast.success(t('profile.updateSuccess'))

        // تحديث فوري في كل الموقع (مثل المواقع العالمية)
        const updatedImageUrl = localUserData.image || (image ? URL.createObjectURL(image) : null)
        setUserData(prev => ({
          ...prev,
          firstname: localUserData.firstname,
          lastname: localUserData.lastname,
          email: localUserData.email,
          phone: localUserData.phone,
          gender: localUserData.gender,
          dob: localUserData.dob,
          address: { line1: localUserData.address?.line1 || '' },
          image: updatedImageUrl
        }))

        // تحديث الـ localStorage ليظل الاسم مطابقاً بعد إعادة التحميل
        try {
          const userStr = localStorage.getItem("user")
          if (userStr) {
            const u = JSON.parse(userStr)
            const fullName = `${localUserData.firstname} ${localUserData.lastname}`.trim()
            localStorage.setItem("user", JSON.stringify({ ...u, fullName, email: localUserData.email }))
          }
        } catch (err) {

        }

        // إعادة جلب الصورة الحقيقية من الـ Backend بعد الرفع
        loadUserProfileData()

        setHasSaved(true)
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.errors?.[0]?.message || data.message || t('profile.updateError'))
      }
    } catch (error) {

      toast.error(error.response?.data?.errors?.[0]?.message || error.message || t('profile.updateError'))
    }
  }

  // في حال كانت بيانات الـ Context لم تجهز بعد (مثلاً قيد الرفع أو الجلب من السيرفر)
  const currentData = isEdit || hasSaved ? localUserData : (userData || localUserData);

  // استخراج رقم الهاتف بدون رمز الدولة
  const phoneNumberPart = (() => {
    const p = currentData?.phone || "";
    if (!p) return "";
    const match = COUNTRIES.find((c) => p.startsWith(c.code));
    return match ? p.slice(match.code.length) : p;
  })();

  return (
    currentData && (
      <div
        className="w-full bg-white dark:bg-gray-800 p-6 md:pb-10 md:pr-10 md:pl-10 pt-40 "
        dir="rtl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4  items-start">
          {/* 1. الجهة اليمنى: الصورة وزر الرفع  */}
          <div className="flex flex-col items-center gap-4 pt-2 order-first lg:order-0">
            <div className="w-55 h-55 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xs border border-gray-200">
              {currentData?.image ? (
                // إذا كانت هناك صورة جديدة مرفوعة أو صورة قديمة مخزنة، نعرض الصورة
                <img
                  loading="lazy"
                  decoding="async"
                  width="220"
                  height="220"
                  className="w-full h-full object-cover"
                  src={currentData.image}
                  alt={t('profile.profileImageAlt')}
                />
              ) : (
                // 2. إذا لم تكن هناك أي صورة، نعرض أول حرفين بشكل عريض ومناسب للحجم الكبير
                <div className="w-full h-full bg-[#138C9F] text-white flex items-center justify-center font-black text-4xl select-none">
                  {currentData
                    ? `${currentData.firstname.slice(0, 2) || ""}`
                    : "?"}
                </div>
              )}
            </div>

            <div className="relative w-full flex justify-center items-center">
              <label
                htmlFor="file-upload"
                className={`text-white py-2.5 px-5 rounded-lg text-sm font-medium w-55 flex items-center justify-center gap-2 transition-colors duration-300 ${
                  isEdit
                    ? "bg-[#1b8b99] hover:bg-[#15727e] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed opacity-70"
                }`}
              >
                <svg
                  className="w-4.5 h-4.5 stroke-white fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21,15V18.5A3.5,3.5,0,0,1,17.5,22H6.5A3.5,3.5,0,0,1,3,18.5V15M12,2L12,15M12,2L8,6M12,2L16,6" />
                </svg>
                {t('profile.uploadImage')}
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                disabled={!isEdit} // منع اختيار ملف نهائياً إذا لم يضغط على تعديل
                className="absolute inset-0 opacity-0 w-full h-full disabled:cursor-not-allowed"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setLocalUserData((prev) => ({
                      ...prev,
                      image: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
            </div>
          </div>

          {/* 2. الجهة اليسرى: النموذج  */}
          <div className="flex flex-col">
            <div className="mb-1.5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
                {t('profile.personalInfo')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm">
                {t('profile.personalInfoDescription')}
              </p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 my-4 lg:my-6 w-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* الاسم الأول  */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.firstName')}
                </label>
                <input
                  type="text"
                  disabled={!isEdit}
                  value={currentData.firstname || ""}
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }))
                  }
                  required
                  pattern="^[\u0600-\u06FFa-zA-Z\s]{2,}$"
                  className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-[#1b8b99] disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* الاسم الأخير  */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.lastName')}
                </label>
                <input
                  type="text"
                  disabled={!isEdit}
                  value={currentData.lastname || ""}
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }))
                  }
                  required
                  pattern="^[\u0600-\u06FFa-zA-Z\s]{2,}$"
                  className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-[#1b8b99] disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* البريد الإلكتروني  */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.email')}
                </label>
                <input
                  type="email"
                  disabled={!isEdit}
                  value={currentData.email || ""}
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-[#1b8b99] disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* رقم الهاتف مع اختيار الدولة */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.phone')}
                </label>
                <div className="relative">
                  <div className="flex items-stretch overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:border-[#1b8b99] transition-colors duration-200">
                    <button
                      type="button"
                      disabled={!isEdit}
                      onClick={() => setShowCountries((prev) => !prev)}
                      className="flex items-center gap-1.5 px-3 py-2 border-l border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-gray-500 bg-[#fcfcfc] dark:bg-gray-800 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        width="24"
                        height="18"
                        src={`https://flagcdn.com/24x18/${selectedCountry.iso}.png`}
                        alt={selectedCountry.name}
                        className="w-6 h-[18px] rounded-sm object-cover"
                      />
                      <span className="text-sm" dir="ltr">{selectedCountry.code}</span>
                      <svg
                        className={`w-3.5 h-3.5 stroke-gray-500 fill-none transition-transform duration-200 ${showCountries ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      dir="ltr"
                      disabled={!isEdit}
                      value={phoneNumberPart}
                      placeholder="5xxxxxxxx"
                      onChange={(e) =>
                        setLocalUserData((prev) => ({
                          ...prev,
                          phone: selectedCountry.code + e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      required
                      pattern="05[96]\d{8}"
                      maxLength="10"
                      className="flex-1 min-w-0 py-2 px-3 text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  {showCountries && (
                    <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                      {COUNTRIES.map((c) => {
                        const isActive = c.code === selectedCountry.code;
                        return (
                          <button
                            key={`${c.code}-${c.name}`}
                            type="button"
                            onClick={() => {
                              setLocalUserData((prev) => ({
                                ...prev,
                                phone: c.code + phoneNumberPart,
                              }));
                              setSelectedCountry(c);
                              setShowCountries(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer transition-colors duration-100 ${isActive
                              ? "bg-[#e6f4f6] dark:bg-gray-800 text-[#1b8b99] font-bold"
                              : "text-gray-700 dark:text-gray-300 dark:text-gray-500 hover:bg-gray-50"}`}
                          >
                            <span className="text-lg leading-none">
                              <img
                                loading="lazy"
                                decoding="async"
                                width="24"
                                height="18"
                                src={`https://flagcdn.com/24x18/${c.iso}.png`}
                                alt={c.name}
                                className="w-6 h-[18px] rounded-sm object-cover"
                              />
                            </span>
                            <span className="flex-1 text-right">{c.name}</span>
                            <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-xs" dir="ltr">{c.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* الجنس  */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.gender')}
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-[#fcfcfc] dark:bg-gray-800 h-12">
                  <button
                    type="button"
                    disabled={!isEdit}
                    onClick={() =>
                      setLocalUserData((prev) => ({ ...prev, gender: "Male" }))
                    }
                    className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${currentData.gender === "Male" ? "bg-[#1b8b99] text-white" : "text-gray-700 dark:text-gray-300"} ${!isEdit ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {t('profile.male')}
                  </button>
                  <button
                    type="button"
                    disabled={!isEdit}
                    onClick={() =>
                      setLocalUserData((prev) => ({
                        ...prev,
                        gender: "Female",
                      }))
                    }
                    className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${currentData.gender === "Female" ? "bg-[#1b8b99] text-white" : "text-gray-700 dark:text-gray-300"} ${!isEdit ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {t('profile.female')}
                  </button>
                </div>
              </div>

              {/* تاريخ الميلاد  */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.dateOfBirth')}
                </label>
                <input
                  type="date"
                  disabled={!isEdit}
                  value={currentData.dob || ""}
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }))
                  }
                  required
                  className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-[#1b8b99] h-12 disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* العنوان  */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[#1b8b99] font-medium text-sm">
                  {t('profile.address')}
                </label>
                <input
                  type="text"
                  disabled={!isEdit}
                  value={currentData.address?.line1 || ""}
                  onChange={(e) =>
                    setLocalUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-[#1b8b99] disabled:bg-gray-50 dark:bg-gray-900 disabled:text-gray-500 dark:text-gray-400 dark:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* أزرار التحكم  */}
            <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
              {isEdit ? (
                <button
                  onClick={updateUserProfileData}
                  className="bg-[#1b8b99] hover:bg-[#15727e] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-colors duration-300"
                >
                  <svg
                    className="w-4.5 h-4.5 stroke-white fill-none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                  {t('profile.saveChanges')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLocalUserData({ ...currentData }); // إعادة تهيئة البيانات المحلية عند بدء التعديل
                    setHasSaved(false);
                    setIsEdit(true);
                  }}
                  className="bg-[#1b8b99] hover:bg-[#15727e] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-colors duration-300"
                >
                  {t('profile.editProfile')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Myprofile 