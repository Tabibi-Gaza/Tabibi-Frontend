import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Myprofile = () => {
  // جلب البيانات من الـ AppContext (قم بإلغاء التعليق عنها لاحقاً عند ربط الداتا)
  // const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  // بيانات تجريبية مطابقة لهيكلية الـ Context والـ Database لديك
  const [userData, setUserData] = useState({
    name: "عمر حمد",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    email: 'omar.m@example.com',
    phone: '+970 597498962',
    address: {
      line1: "غزة - دوار السراي",
      line2: "", // في حال وجود سطر ثاني للعنوان
    },
    gender: 'Male', // المخزن في الداتابيز عادة يكون بالإنجليزية 'Male' أو 'Female'
    dob: '2003-04-06',
  })

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  // دالة تحديث البيانات وإرسالها للـ Backend
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      if (image) {
        formData.append('image', image)
      }

      // كود إرسال الطلب (قم بإلغاء التعليق عند جاهزية الـ API)
      /*
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
      */

      // للتجربة المؤقتة:
      toast.success("تم تحديث البيانات بنجاح (وضع التجربة)")
      setIsEdit(false)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // فصل الاسم الأول والأخير للعرض في الـ Inputs أثناء التعديل
  const getFirstAndLastName = () => {
    const names = userData.name.split(' ')
    const firstName = names[0] || ''
    const lastName = names.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  const handleNameChange = (type, value) => {
    const { firstName, lastName } = getFirstAndLastName()
    if (type === 'first') {
      setUserData(prev => ({ ...prev, name: `${value} ${lastName}`.trim() }))
    } else {
      setUserData(prev => ({ ...prev, name: `${firstName} ${value}`.trim() }))
    }
  }

  return userData && (
    <div className="w-full bg-white p-6 md:p-10 font-['Cairo']" dir="rtl">
      {/* الهيكل الرئيسي المتجاوب */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-6 lg:gap-10 items-start">

        {/* 1. الجهة اليمنى: الصورة وزر الرفع */}
        <div className="flex flex-col items-center gap-4 pt-2 order-first lg:order-0">
          <div className="w-55 h-55 rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-gray-200">
            <img
              className="w-full h-full object-cover"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="صورة شخصية"
            />
          </div>

          <div className="relative w-full flex justify-center items-center">
            <label
              htmlFor="file-upload"
              className="bg-[#1b8b99] hover:bg-[#15727e] text-white py-2.5 px-5 rounded-lg cursor-pointer text-sm font-medium w-55 flex items-center justify-center gap-2 transition-colors duration-300"
            >
              <svg className="w-4.5 h-4.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21,15V18.5A3.5,3.5,0,0,1,17.5,22H6.5A3.5,3.5,0,0,1,3,18.5V15M12,2L12,15M12,2L8,6M12,2L16,6" />
              </svg>
              رفع صورة
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>

        {/* 2. الجهة اليسرى: العنوان والنموذج */}
        <div className="flex flex-col">
          {/* أ. العنوان ووصف القسم */}
          <div className="mb-1.5">
            <h2 className="text-2xl font-bold text-gray-900 mb-1.5">المعلومات الشخصية</h2>
            <p className="text-gray-500 text-sm">قم بتحديث معلوماتك الأساسية لضمان تجربة حجز دقيقة.</p>
          </div>

          {/* ب. الخط الفاصل */}
          <div className="border-b border-gray-200 my-4 lg:my-6 w-full"></div>

          {/* ج. النموذج (Form) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* الاسم الأول */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">الاسم الأول</label>
              <input
                type="text"
                disabled={!isEdit}
                value={isEdit ? getFirstAndLastName().firstName : userData.name.split(' ')[0] || ''}
                onChange={(e) => handleNameChange('first', e.target.value)}
                placeholder="الاسم الأول"
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* الاسم الأخير */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">الاسم الأخير</label>
              <input
                type="text"
                disabled={!isEdit}
                value={isEdit ? getFirstAndLastName().lastName : userData.name.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => handleNameChange('last', e.target.value)}
                placeholder="الاسم الأخير"
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">البريد الإلكتروني</label>
              <input
                type="email"
                disabled={!isEdit}
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@mail.com"
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* رقم الهاتف */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">رقم الهاتف</label>
              <input
                type="tel"
                disabled={!isEdit}
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+970 "
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>


            {/* الجنس (Toggle Switch) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">الجنس</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#fcfcfc] h-12">

                {/* خيار ذكر */}
                <button
                  type="button"
                  disabled={!isEdit}
                  onClick={() => setUserData(prev => ({ ...prev, gender: 'Male' }))}
                  className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${userData.gender === 'Male'
                      ? 'bg-[#1b8b99] text-white'
                      : 'text-gray-700 hover:bg-gray-50 disabled:hover:bg-transparent'
                    } ${!isEdit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  ذكر
                </button>

                {/* خيار أنثى */}
                <button
                  type="button"
                  disabled={!isEdit}
                  onClick={() => setUserData(prev => ({ ...prev, gender: 'Female' }))}
                  className={`flex-1 text-center h-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${userData.gender === 'Female'
                      ? 'bg-[#1b8b99] text-white'
                      : 'text-gray-700 hover:bg-gray-50 disabled:hover:bg-transparent'
                    } ${!isEdit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  أنثى
                </button>

              </div>
            </div>

            {/* تاريخ الميلاد (أضفته بناءً على وجود dob في الداتا الخاصة بك) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#1b8b99] font-medium text-sm">تاريخ الميلاد</label>
              <input
                type="date"
                disabled={!isEdit}
                value={userData.dob}
                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] h-12 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* العنوان */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[#1b8b99] font-medium text-sm">العنوان</label>
              <input
                type="text"
                disabled={!isEdit}
                value={userData.address.line1}
                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                placeholder="العنوان الحصري"
                className="py-2 px-4 border border-gray-200 rounded-lg text-base outline-none transition-colors duration-200 text-gray-800 bg-white focus:border-[#1b8b99] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>


          </div>

          {/* زر التعديل / الحفظ */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            {isEdit ? (
              <button
                onClick={updateUserProfileData}
                className="bg-[#1b8b99] hover:bg-[#15727e] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-colors duration-300"
              >
                <svg className="w-4.5 h-4.5 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17L4 12" />
                </svg>
                حفظ التعديلات
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="bg-[#1b8b99] hover:bg-[#15727e] text-white py-3 px-10 rounded-lg text-base font-bold cursor-pointer inline-flex items-center gap-2.5 transition-colors duration-300"
              >
                تعديل الملف الشخصي
              </button>
            )}
          </div>

        </div>
      </div>

      {/* شريط معلومات الخصوصية سفلي */}
      <div className="mt-8">
        <div className="bg-[#f2f6fc] p-4 md:py-3.5 md:px-5 rounded-xl flex items-center gap-4 text-gray-800 text-xs md:text-sm border border-[#e9eff6]">
          <div className="bg-white text-[#1b8b99] w-6 h-6 rounded-full flex items-center justify-center font-bold border border-[#dce6ef] shrink-0">
            i
          </div>
          <span>
            يتم استخدام هذه البيانات فقط لأغراض طبية ولتسهيل تواصلك مع الأطباء ونحن نلتزم بأعلى معايير الخصوصية والأمان لحماية معلوماتك الصحية.
          </span>
        </div>
      </div>
    </div>
  )
}

export default Myprofile