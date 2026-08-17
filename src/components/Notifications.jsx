import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Notifications = () => {
    const navigate = useNavigate()
    const { groupedNotifications, deleteNotification } = useContext(AppContext)

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) return
        try {
            await deleteNotification(id)
            toast.success('تم حذف الإشعار بنجاح')
        } catch {
            toast.error('فشل حذف الإشعار')
        }
    }

    // بيانات مطابقة للتصميم لضمان العرض المثالي
    const displayNotifications = groupedNotifications && groupedNotifications.length > 0 ? groupedNotifications : [];

    return (
      <div
        className="w-full font-sans p-6 pt-40 max-w-4xl mx-auto text-right min-h-[70vh]"
        dir="rtl"
      >
        {/* ---- زر العودة العلوي - متموضع في اليمين تماماً ---- */}
        <div className="flex justify-start mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 font-bold text-base border border-gray-200 bg-white px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            {/* السهم يتجه لليمين ليناسب العودة في الواجهات العربية */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 cursor-pointer hover:scale-110 transition-all duration-150"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span>العودة</span>
          </button>
        </div>

        {/* ---- رأس الصفحة: الإشعارات ---- */}
        <div className="flex flex-col items-center justify-center text-center gap-3 mb-12">
          <div className="p-5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"   
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-14 h-14 text-[#138c9f]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            الإشعارات
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            إدارة التحديثات الخاصة بصحتك ومواعيدك
          </p>
        </div>

        {/* ---- قائمة بطاقات الإشعارات (خطوط أكبر وتنسيق محاذي لليمين) ---- */}
        <div className="flex flex-col gap-5 mb-16">
          {displayNotifications.length > 0 ? displayNotifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white border border-gray-200 hover:border-teal-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* المحتوى النصي الأيمن */}
              <div className="flex-1 text-right">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-lg font-bold text-gray-800">
                    {notif.title}
                  </h3>
                  {notif.count > 1 && (
                    <span className="text-xs font-black bg-[#138C9F] text-white px-2.5 py-1 rounded-full">
                      {notif.count}
                    </span>
                  )}
                </div>
                <p className="text-base text-gray-600 leading-relaxed font-medium">
                  {notif.message}
                </p>
              </div>

              {/* التوقيت والأيقونة التنبيهية في الجانب الأيسر للبطاقة */}
              <div className="flex items-center gap-3 shrink-0 justify-end sm:justify-start min-w-30">
                <span className="text-sm text-gray-400 font-medium whitespace-nowrap">
                  {notif.time || notif.createdAt}
                </span>
                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block shrink-0 animate-pulse"></span>
                )}
                {notif.id && (
                  <button
                    onClick={(e) => handleDelete(e, notif.id)}
                    title="حذف الإشعار"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer border border-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            </div>
          )) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <p className="text-gray-400 font-bold text-base">لا توجد إشعارات حالياً</p>
            </div>
          )}
        </div>
      </div>
    );
}

export default Notifications