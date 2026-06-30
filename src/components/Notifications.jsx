import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Notifications = () => {
    const navigate = useNavigate()
    const { notifications } = useContext(AppContext)

    // بيانات مطابقة للتصميم لضمان العرض المثالي
    const displayNotifications = notifications && notifications.length > 0 ? notifications : [
        { id: 1, title: "تأكيد موعد", message: "تم تأكيد موعدك بنجاح مع د. أحمد العوضي.", time: "منذ 5 دقائق", isRead: false },
        { id: 2, title: "تنبيه جديد", message: "لديك رسالة جديدة من عيادة غزة الطبية.", time: "منذ ساعة", isRead: false },
        { id: 3, title: "تذكير بالموعد", message: "تذكير: موعدك القادم غداً الساعة 4:00 مساءً.", time: "منذ يوم", isRead: true }
    ];

    return (
        <div className='w-full font-sans p-6 max-w-4xl mx-auto text-right min-h-[70vh]' dir='rtl'>
            
            {/* ---- زر العودة العلوي - متموضع في اليمين تماماً ---- */}
            <div className='flex justify-start mb-8'>
                <button 
                    onClick={() => navigate(-1)} 
                    className='flex items-center gap-2.5 text-gray-700 hover:text-gray-900 font-bold text-base border border-gray-200 bg-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95'
                >
                    {/* السهم يتجه لليمين ليناسب العودة في الواجهات العربية */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-150">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>العودة</span>
                </button>
            </div>

            {/* ---- رأس الصفحة: الإشعارات ---- */}
            <div className='flex flex-col items-center justify-center text-center gap-3 mb-12'>
                <div className='p-5 bg-gray-50 rounded-full border border-gray-100 shadow-sm'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-14 h-14 text-gray-800">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </div>
                <h1 className='text-3xl font-extrabold text-gray-900 tracking-wide'>الإشعارات</h1>
                <p className='text-sm text-gray-500 font-medium'>إدارة التحديثات الخاصة بصحتك ومواعيدك</p>
            </div>

            {/* ---- قائمة بطاقات الإشعارات (خطوط أكبر وتنسيق محاذي لليمين) ---- */}
            <div className='flex flex-col gap-5 mb-16'>
                {displayNotifications.map((notif) => (
                    <div 
                        key={notif.id}
                        className='bg-white border border-gray-200 hover:border-teal-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                    >
                        {/* المحتوى النصي الأيمن */}
                        <div className='flex-1 text-right'>
                            <h3 className='text-lg font-bold text-gray-800 mb-1.5'>{notif.title}</h3>
                            <p className='text-base text-gray-600 leading-relaxed font-medium'>{notif.message}</p>
                        </div>

                        {/* التوقيت والأيقونة التنبيهية في الجانب الأيسر للبطاقة */}
                        <div className='flex items-center gap-3 shrink-0 justify-end sm:justify-start min-w-30'>
                            <span className='text-sm text-gray-400 font-medium whitespace-nowrap'>{notif.time}</span>
                            {!notif.isRead && (
                                <span className='w-2.5 h-2.5 rounded-full bg-blue-600 block shrink-0 animate-pulse'></span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Notifications