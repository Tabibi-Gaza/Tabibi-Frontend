import React, { useContext, useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { resolveImageUrl } from '../utils/imageUrl'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, token } = useContext(AppContext)
  const navigate = useNavigate()

  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isFavorite, setIsFavorite] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favs.some(f => f.id === docId);
  })
  const [calendarData, setCalendarData] = useState([])
  const [loadingCalendar, setLoadingCalendar] = useState(true)
  const [booking, setBooking] = useState(false)
  const [notes, setNotes] = useState('')
  const [fallbackDoctor, setFallbackDoctor] = useState(null)
  const [loadingFallback, setLoadingFallback] = useState(true)

  const docInfo = useMemo(() => {
    const found = doctors.find(doc => doc._id === docId)
    if (found) return found
    if (fallbackDoctor) return fallbackDoctor
    return null
  }, [doctors, docId, fallbackDoctor])

  useEffect(() => {
    if (!docId) return;
    if (doctors.find(doc => doc._id === docId)) {
      setLoadingFallback(false);
      return;
    }
    const fetchDoctor = async () => {
      setLoadingFallback(true);
      try {
        const { data } = await axiosInstance.get(`/Doctors/${docId}`);
        if (data.succeeded && data.data) {
          const doc = data.data;
          setFallbackDoctor({
            _id: doc.id,
            userId: doc.userId,
            name: doc.fullName,
            image: resolveImageUrl(doc.profileImageUrl) || "",
            speciality: doc.specializationName || "",
            degree: doc.specializationName || "",
            experience: doc.yearsOfExperience ? `${doc.yearsOfExperience} سنوات` : "",
            about: doc.bio || "",
            fees: doc.sessionPrice || 0,
            rating: doc.averageRating || 0,
            reviewsCount: doc.totalReviews || 0,
            address: {
              line1: doc.clinicAddress || "",
              line2: doc.clinicName || "",
            },
          });
        }
      } catch (err) {

      } finally {
        setLoadingFallback(false);
      }
    };
    fetchDoctor();
  }, [docId, doctors]);

  useEffect(() => {
    if (!docId) return;
    const fetchCalendar = async () => {
      setLoadingCalendar(true);
      try {
        const { data } = await axiosInstance.get(`/booking/doctor/${docId}/calendar-slots`);
        if (data.succeeded && data.data?.calendarDays) {
          setCalendarData(data.data.calendarDays);
          const firstActiveIdx = data.data.calendarDays.findIndex(
            d => d.isActiveDay && d.slots?.some(s => s.isAvailable)
          );
          if (firstActiveIdx >= 0) setSlotIndex(firstActiveIdx);
        } else {
          setCalendarData([]);
        }
      } catch (err) {

        setCalendarData([]);
      } finally {
        setLoadingCalendar(false);
      }
    };
    fetchCalendar();
  }, [docId]);

  if (loadingFallback) {
    return (
      <div className="text-center mt-10 pt-40 text-gray-500 font-sans" style={{ direction: "rtl" }}>
        جاري تحميل بيانات الطبيب...
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className="text-center mt-10 pt-40 text-gray-500 font-sans" style={{ direction: "rtl" }}>
        الطبيب غير موجود
      </div>
    );
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('يرجى تسجيل الدخول أولاً لحجز موعد')
      return navigate('/login')
    }

    if (!selectedSlot) {
      toast.warn('يرجى اختيار وقت الموعد')
      return
    }

    setBooking(true);
    try {
      const day = calendarData[slotIndex];
      const startTime = `${day.date}T${selectedSlot.start}`;
      const endTime = `${day.date}T${selectedSlot.end}`;

      const payload = {
        doctorId: docId,
        startTime,
        endTime,
        notes: notes || null
      };

      const { data } = await axiosInstance.post('/patient/appointments/initiate-booking', payload);

      if (data.succeeded) {
        toast.success(data.message || 'تم إنشاء الحجز بنجاح! يرجى رفع إيصال الدفع')
        navigate(`/payment/${data.data}`, {
          state: {
            doctorId: docId,
            amount: docInfo.fees,
            dateTime: startTime,
            doctorName: docInfo.name
          }
        })
      } else {
        toast.error(data.errors?.[0]?.message || data.message || 'فشل الحجز');
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'حدث خطأ أثناء الحجز');
    } finally {
      setBooking(false);
    }
  }

  const handleMessageClick = () => {
    if (!token) {
      toast.warn('يرجى تسجيل الدخول أولاً لمراسلة الطبيب')
      return navigate('/login')
    }
    navigate('/chats', { state: { doctorId: docInfo.userId || docId } });
  }

  const activeDays = calendarData.filter(day => day.isActiveDay);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updated = favs.filter(f => f.id !== docId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      const newFav = {
        id: docId,
        name: docInfo.name,
        image: docInfo.image,
        specialty: docInfo.speciality || docInfo.specialty,
        fees: docInfo.fees,
        rating: docInfo.rating,
        experience: docInfo.experience,
        address: docInfo.address?.line1 || "",
      };
      favs.push(newFav);
      localStorage.setItem('favorites', JSON.stringify(favs));
      setIsFavorite(true);
    }
  };

  return (
    <div className="w-full p-4 pt-40 px-3 text-right" dir="rtl">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col md:flex-row gap-6 mb-6">
        <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
          <button onClick={handleMessageClick} className="flex items-center gap-2 bg-[#138c9f] hover:bg-[#3f9cb1] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
            <span>مراسلة</span>
            <FontAwesomeIcon icon={faComments} className="w-4 h-4" />
          </button>
          <button onClick={toggleFavorite} className={`p-2 rounded-xl border transition-all duration-200 ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </div>

        <div className="w-full md:w-56 shrink-0 bg-[#f4faff] rounded-xl flex items-center justify-center overflow-hidden p-2">
          <img loading="lazy" decoding="async" width="224" height="224" className="w-full h-56 md:h-auto object-contain" src={docInfo.image} alt={docInfo.name} />
        </div>

        <div className="flex-1 flex flex-col justify-between pt-10 md:pt-0 text-5xl">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <h2>{docInfo.name}</h2>
              <img loading="lazy" decoding="async" width="16" height="16" className="w-4 h-4" src={assets.verified_icon} alt="Verified" />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-[15px] text-gray-500">
              <span className="text-[#138c9f] bg-[#e6f6f5] px-3 py-1 rounded-md font-medium">{docInfo.speciality}</span>
              <span className="text-gray-300">|</span>
              <p>{docInfo.degree}</p>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md">سنوات خبرة {docInfo.experience}</span>
            </div>
            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                <img loading="lazy" decoding="async" width="14" height="14" className="w-3.5 h-3.5" src={assets.info_icon} alt="" /> عن الطبيب
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed mt-1 max-w-2xl">{docInfo.about}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <p className="text-gray-600 text-sm font-medium">
              كشفية الطبيب: <span className="text-[#138c9f] font-bold text-base">{docInfo.fees} {currencySymbol}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2 border-r-4 border-[#138c9f] pr-2">
          مواعيد الحجز المتاحة
        </h3>

        {loadingCalendar ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#138C9F]"></div>
          </div>
        ) : activeDays.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg font-bold">لا توجد مواعيد متاحة حالياً</p>
            <p className="text-sm mt-1">يرجى المحاولة في وقت لاحق</p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-center w-full overflow-x-auto pb-3 scrollbar-none">
              {activeDays.map((day, index) => (
                <div
                  key={day.date}
                  onClick={() => { setSlotIndex(calendarData.indexOf(day)); setSlotTime(''); setSelectedSlot(null); }}
                  className={`text-center py-3 px-4 rounded-lg rounded-xl cursor-pointer transition-all duration-150 border flex flex-col gap-1 ${slotIndex === calendarData.indexOf(day) ? "bg-[#138c9f] text-white border-[#138c9f]" : "border-gray-200 text-gray-500 hover:border-teal-200"}`}
                >
                  <p className="text-[15px]">{day.dayNameAr}</p>
                  <p className="text-base font-bold">{day.dayNumber}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 items-center w-full mt-5 pb-2">
              {(() => {
                const availableSlots = calendarData[slotIndex]?.slots?.filter(s => s.isAvailable) || [];
                if (availableSlots.length === 0) {
                  return (
                    <p className="text-sm text-gray-400 py-2">لا توجد مواعيد متاحة في هذا اليوم</p>
                  );
                }
                return availableSlots.map((slot, index) => {
                  const timeLabel = formatTime(slot.start);
                  return (
                    <p
                      key={index}
                      onClick={() => { setSlotTime(timeLabel); setSelectedSlot(slot); }}
                      className={`text-[15px] shrink-0 px-4 py-2 rounded-full cursor-pointer transition-all border ${timeLabel === slotTime ? "bg-[#138c9f] text-white border-[#138c9f]" : "text-gray-500 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {timeLabel}
                    </p>
                  );
                });
              })()}
            </div>
          </>
        )}

        <div className="mt-5">
          <label className="block text-[15px] font-semibold text-gray-600 mb-2">ملاحظات إضافية</label>
          <textarea
            placeholder="ما أعراضك؟ (اختياري)"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#138c9f] text-[15px]"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={bookAppointment}
            disabled={!selectedSlot || booking}
            className={`px-8 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 ${selectedSlot && !booking ? "bg-[#138c9f] hover:bg-[#008f84] cursor-pointer shadow-sm" : "bg-[#c3cacf] cursor-not-allowed"}`}
          >
            {booking ? 'جاري الحجز...' : 'حجز الموعد'}
          </button>
        </div>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}

function formatTime(timeOnly) {
  if (!timeOnly) return '';
  const parts = timeOnly.split(':');
  let h = parseInt(parts[0]);
  const m = parts[1] || '00';
  const period = h >= 12 ? 'م' : 'ص';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

export default Appointment
