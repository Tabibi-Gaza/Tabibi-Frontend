import React, { useContext, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  // أيام الأسبوع باللغة العربية
  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  // جلب بيانات الطبيب المختار
  const docInfo = useMemo(() => {
    return doctors.find(doc => doc._id === docId)
  }, [doctors, docId])

  // حساب المواعيد المتاحة وتنسيق التوقيت باللغة العربية (ص / م)
  const docSlots = useMemo(() => {
    if (!docInfo) return [];

    let allSlots = []
    let today = new Date()
    today.setSeconds(0, 0)

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0) // نهاية المواعيد 9 مساءً

      if (today.getDate() === currentDate.getDate()) {
        if (today.getHours() < 10) {
          currentDate.setHours(10, 0, 0, 0)
        } else {
          currentDate.setHours(today.getHours() + 1)
          currentDate.setMinutes(today.getMinutes() > 30 ? 30 : 0)
        }
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
        
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots)
      }
    }

    return allSlots
  }, [docInfo])

  if (!docInfo) {
    return <div className='text-center mt-10 text-gray-500 font-sans' style={{ direction: 'rtl' }}>جاري تحميل بيانات الطبيب...</div>
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('يرجى تسجيل الدخول أولاً لحجز موعد')
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`, 
        { docId, slotDate, slotTime }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message || 'تم حجز الموعد بنجاح!')
        getDoctorsData()
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const handleMessageClick = () => {
    if (!token) {
      toast.warn('يرجى تسجيل الدخول أولاً لمراسلة الطبيب')
      return navigate('/login')
    }
    navigate(`/chat/${docId}`)
  }

  return (
    // استخدام الاتجاه dir='rtl' ومحاذاة النص text-right لكامل الصفحة
    <div className='w-full font-sans p-4 max-w-5xl mx-auto text-right' dir='rtl'>
      
      {/* --------- تفاصيل الطبيب --------- */}
      <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col md:flex-row gap-6 mb-6'>
        
        {/* أزرار التفاعل العلوي - تم تموضعها يساراً absolute left-6 لتعاكس النصوص اليمينية */}
        <div className='absolute top-6 left-6 flex items-center gap-3 z-10'>
          <button 
            onClick={handleMessageClick}
            className='flex items-center gap-2 bg-[#4faec4] hover:bg-[#3f9cb1] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm'
          >
            <span>مراسلة</span>
            <img className='w-4 h-4 invert' src={assets.chats_icon} alt="" />
          </button>
          
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-xl border transition-all duration-200 ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>

        {/* القسم الخاص بصورة الطبيب */}
        <div className='w-full md:w-56 shrink-0 bg-[#f4faff] rounded-xl flex items-center justify-center overflow-hidden p-2'>
          <img className='w-full h-56 md:h-auto object-contain' src={docInfo.image} alt={docInfo.name} />
        </div>

        {/* تفاصيل النصوص والمعلومات */}
        <div className='flex-1 flex flex-col justify-between pt-10 md:pt-0 text-5xl'>
          <div>
            <div className='flex items-center gap-2 text-xl font-bold text-gray-800'>
              <h2>{docInfo.name}</h2>
              {/* أيقونة التوثيق */}
              <img className='w-4 h-4' src={assets.verified_icon} alt="Verified" />
            </div>
            
            <div className='flex flex-wrap items-center gap-2 mt-2 text-[15px] text-gray-500'>
              <span className='text-[#00a699] bg-[#e6f6f5] px-3 py-1 rounded-md font-medium'>{docInfo.speciality}</span>
              <span className='text-gray-300'>|</span>
              <p>{docInfo.degree}</p>
              <span className='bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md'>سنوات خبرة {docInfo.experience}</span>
            </div>

            <div className='mt-4'>
              <p className='flex items-center gap-1.5 text-sm font-bold text-gray-800'>
                <img className='w-3.5 h-3.5' src={assets.info_icon} alt="" /> عن الطبيب
              </p>
              <p className='text-[15px] text-gray-500 leading-relaxed mt-1 max-w-2xl'>{docInfo.about}</p>
            </div>
          </div>

          <div className='mt-4 pt-3 border-t border-gray-100 flex justify-between items-center'>
            <p className='text-gray-600 text-sm font-medium'>
              كشفية الطبيب: <span className='text-[#00a699] font-bold text-base'>{docInfo.fees} {currencySymbol}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------- مواعيد الحجز المتاحة ---------- */}
      <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 '>
        <h3 className='text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-r-4 border-[#00a699] pr-2 pl-0'>
          مواعيد الحجز المتاحة
        </h3>
        
        {/* شريط الأيام المارّ أفقياً */}
        <div className='flex gap-3 items-center w-full overflow-x-auto pb-3 scrollbar-none'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            <div 
              key={index}
              onClick={() => setSlotIndex(index)} 
              className={`text-center py-3 px-4  min-w-17.5 rounded-xl cursor-pointer transition-all duration-150 border flex flex-col gap-1 ${slotIndex === index ? 'bg-[#00a699] text-white border-[#00a699]' : 'border-gray-200 text-gray-500 hover:border-teal-200'}`}
            >
              <p className='text-[15px]'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p className='text-base font-bold'>{item[0] && item[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* شريط الساعات المستدير بشكل كامل */}
        <div className='flex gap-2.5 items-center w-full overflow-x-auto mt-5 pb-2 scrollbar-none'>
          {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
            <p 
              key={index}
              onClick={() => setSlotTime(item.time)} 
              className={`text-[15px] shrink-0 px-4 py-2 rounded-full cursor-pointer transition-all border ${item.time === slotTime ? 'bg-[#00a699] text-white border-[#00a699]' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              {item.time}
            </p>
          ))}
        </div>

        {/* حقل الملاحظات الإضافية */}
        <div className='mt-5'>
          <label className='block text-[15px] font-semibold text-gray-600 mb-2'>ملاحظات إضافية</label>
          <textarea 
            placeholder="ما أعراضك؟ (اختياري)" 
            className='w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00a699] text-[15px]'
            rows="3"
          ></textarea>
        </div>

        {/* زر التثبيت يتموضع في أقصى اليسار متناسقاً مع التصميم الهيكلي */}
        <div className='mt-5 flex justify-end'>
          <button 
            onClick={bookAppointment} 
            disabled={!slotTime}
            className={`px-8 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 ${slotTime ? 'bg-[#00a699] hover:bg-[#008f84] cursor-pointer shadow-sm' : 'bg-[#c3cacf] cursor-not-allowed'}`}
          >
            حجز الموعد
          </button>
        </div>
      </div>

      {/* ------------ الأطباء ذوو الصلة --------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment