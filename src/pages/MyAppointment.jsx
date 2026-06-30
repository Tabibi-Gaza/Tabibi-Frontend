import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([]) 
  const navigate = useNavigate()

  // أسماء الأشهر باللغة العربية لتنسيق التاريخ بشكل صحيح
  const monthsAr = ["", "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
  const daysOfWeekAr = {
    "Sunday": "الأحد", "Monday": "الإثنين", "Tuesday": "الثلاثاء", "Wednesday": "الأربعاء", 
    "Thursday": "الخميس", "Friday": "الجمعة", "Saturday": "السبت"
  }

  // تنسيق التاريخ واليوم ليطابق الصورة (مثال: السبت 20 أغسطس 2026)
  const slotDateFormat = (slotDate) => { 
    if (!slotDate) return ""
    const dataArray = slotDate.split('_')
    const day = dataArray[0]
    const month = monthsAr[Number(dataArray[1])]
    const year = dataArray[2]
    
    // محاولة استخراج اسم اليوم
    const dateObj = new Date(`${year}-${dataArray[1]}-${day}`)
    const dayNameEn = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    const dayNameAr = daysOfWeekAr[dayNameEn] || "اليوم"

    return `${dayNameAr} ${day} ${month} - ${year}`
  }

  const getUserAppointments = async () => { 
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  // تصنيف المواعيد برمجياً إلى قادمة وسابقة (ملغية أو منتهية) بناءً على التصميم المرفق
  const upcomingAppointments = appointments.filter(item => !item.cancelled && !item.isCompleted)
  const pastAppointments = appointments.filter(item => item.cancelled || item.isCompleted)

  return (
    <div className='w-full font-sans p-4 max-w-5xl mx-auto text-right mb-16' dir='rtl'>
      
      {/* ---- رأس الصفحة العلوي كالمرفق تماماً ---- */}
      <div className='flex justify-between items-center mb-8 border-b border-gray-100 pb-4'>
        <div>
          <h1 className='text-xl font-bold text-gray-800'>حجوزاتي</h1>
          <p className='text-xs text-gray-400 mt-0.5'>قائمة مواعيدك الطبية</p>
        </div>
        <button 
          onClick={() => navigate('/doctors')}
          className='flex items-center gap-1.5 bg-[#00a699] hover:bg-[#008f84] text-white px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-sm'
        >
          <span>حجز موعد جديد</span>
          <span className='text-sm font-bold'>+</span>
        </button>
      </div>

      {/* 1️⃣ الحالة الأولى: عندما لا توجد أي مواعيد نهائياً */}
      {appointments.length === 0 ? (
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center my-6'>
          <div className='w-40 h-40 bg-[#f4faff] rounded-full flex items-center justify-center relative mb-6'>
            {/* أيقونة النتيجة الطبية ثلاثية الأبعاد التخيلية */}
            <span className='absolute top-4 right-4 bg-[#00a699] text-white p-1 rounded-md text-xs'>📅</span>
            <div className='text-5xl'>📋</div>
          </div>
          <h2 className='text-lg font-bold text-gray-800 mb-2'>لا توجد مواعيد مجدولة حالياً</h2>
          <p className='text-xs text-gray-400 max-w-sm leading-relaxed mb-6'>
            ابدأ رحلتك الصحية الآن واحجز موعدك مع أفضل الأطباء المتخصصين. نحن هنا لضمان حصولك على الرعاية التي تستحقها بكل سهولة.
          </p>
          <button 
            onClick={() => navigate('/doctors')}
            className='flex items-center gap-2 bg-[#00a699] hover:bg-[#008f84] text-white px-8 py-2.5 rounded-xl text-xs font-medium transition-all shadow-md'
          >
            <span>احجز موعدك الأول</span>
            <span>+</span>
          </button>
        </div>
      ) : (
        // 2️⃣ الحالة الثانية: عرض القوائم مقسمة إلى حاويات رمادية أنيقة
        <div className='flex flex-col gap-8'>
          
          {/* حاوية المواعيد القادمة (1) */}
          {upcomingAppointments.length > 0 && (
            <div className='bg-gray-50 border border-gray-200/60 rounded-2xl p-5'>
              <h3 className='text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5'>
                المواعيد القادمة ({upcomingAppointments.length})
              </h3>
              
              <div className='flex flex-col gap-3'>
                {upcomingAppointments.map((item, index) => (
                  <div key={index} className='bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm'>
                    <div className='flex items-center gap-4 w-full md:w-auto'>
                      <div className='w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200'>
                        <img className='w-full h-full object-cover' src={item.docData?.image || item.image} alt="" />
                      </div>
                      <div>
                        <h4 className='text-sm font-bold text-gray-800'>{item.docData?.name || item.name}</h4>
                        <p className='text-xs text-[#00a699] font-medium mt-0.5'>{item.docData?.speciality || item.speciality}</p>
                        <p className='text-[11px] text-gray-400 mt-1 flex items-center gap-1'>
                          <span>📅 {slotDateFormat(item.slotDate)}</span>
                          <span className='mx-1'>|</span>
                          <span>🕒 {item.slotTime}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* أزرار التحكم وحالة الدفع جهة اليسار */}
                    <div className='flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0'>
                      <span className='text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg'>
                        مدفوع {item.amount || '50ILS'}
                      </span>
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className='bg-[#e06666] hover:bg-red-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors'
                      >
                        إلغاء الحجز
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* حاوية المواعيد السابقة (2) */}
          {pastAppointments.length > 0 && (
            <div className='bg-gray-50 border border-gray-200/60 rounded-2xl p-5'>
              <h3 className='text-sm font-bold text-gray-800 mb-4 flex items-center gap-1.5'>
                المواعيد السابقة ({pastAppointments.length})
              </h3>
              
              <div className='flex flex-col gap-3'>
                {pastAppointments.map((item, index) => (
                  <div key={index} className='bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm opacity-85'>
                    <div className='flex items-center gap-4 w-full md:w-auto'>
                      <div className='w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 border border-gray-200 grayscale'>
                        <img className='w-full h-full object-cover' src={item.docData?.image || item.image} alt="" />
                      </div>
                      <div>
                        <h4 className='text-sm font-bold text-gray-700'>{item.docData?.name || item.name}</h4>
                        <p className='text-xs text-gray-400 mt-0.5'>{item.docData?.speciality || item.speciality}</p>
                        <p className='text-[11px] text-gray-400 mt-1'>
                          📅 {slotDateFormat(item.slotDate)} | 🕒 {item.slotTime}
                        </p>
                      </div>
                    </div>
                    
                    {/* وسم الحالة النهائي الملون المطابق تماماً للصورة */}
                    <div className='flex items-center gap-3 w-full md:w-auto justify-end'>
                      {item.cancelled ? (
                        <>
                          <span className='text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg'>
                            تم إرجاع المبلغ
                          </span>
                          <span className='text-xs font-bold text-red-500 bg-red-50 px-4 py-1.5 rounded-lg'>
                            ملغي
                          </span>
                        </>
                      ) : (
                        <>
                          <span className='text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg'>
                            مدفوع {item.amount }
                          </span>
                          <span className='text-xs font-bold text-teal-600 bg-teal-50 px-4 py-1.5 rounded-lg'>
                            منتهي
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default MyAppointment