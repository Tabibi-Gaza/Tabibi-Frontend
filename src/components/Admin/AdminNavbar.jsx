import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_frontend/assets';
import { FiMenu, FiX, FiBell } from "react-icons/fi"; // استيراد أيقونات التحكم

const AdminNavbar = ({ setSidebarOpen, sidebarOpen }) => {
    const navigate = useNavigate();
    const { notifications, groupedNotifications, markAllAsRead, userData } = useContext(AppContext);
    const [showNotifMenu, setShowNotifMenu] = useState(false);

    const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

    return (
      <div
        className="h-16 md:h-21.5 bg-white border-b border-[#C3C6D6] flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 font-['Tajawal'] shadow-sm"
        dir="rtl"
      >
        {/* 🟦 جهة اليمين: زر القائمة، الشعار ووسم الإدارة */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* زر الهامبرغر التفاعلي للهواتف */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden transition-colors"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <FiX className="w-6 h-6 text-[#138C9F]" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>

          <img
            decoding="async"
            width="40"
            height="40"
            src={assets.logo}
            alt="شعار طبيبي غزة"
            className="h-7 md:h-10 w-auto cursor-pointer object-contain"
            onClick={() => navigate("/admin-dashboard")}
          />
          <span className="bg-[#e2f4f7] text-[#138C9F] text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-[#138C9F]/20 whitespace-nowrap">
            بوابة المسؤول
          </span>
        </div>

        {/* 🟨 جهة اليسار: الإشعارات والبروفايل */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* 🔔 زر وقائمة الإشعارات المنسدلة */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
              }}
              className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
            >
              <FiBell className="h-5 md:h-6 w-5 md:w-6 text-gray-600 hover:text-[#138C9F] transition-colors cursor-pointer" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-pulse"
                  style={{ direction: "ltr" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute left-[-50px] sm:left-0 mt-3 w-72 md:w-80 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 text-right">
                <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                  <span className="font-bold text-gray-800 text-sm">
                    إشعارات النظام
                  </span>
                  <span
                    className="text-xs text-[#138C9F] cursor-pointer hover:underline"
                    onClick={() => setShowNotifMenu(false)}
                  >
                    إغلاق
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {groupedNotifications && groupedNotifications.length > 0 ? (
                    groupedNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.link) {
                            navigate(notif.link);
                          } else {
                            navigate("/admin/notifications");
                          }
                          setShowNotifMenu(false);
                        }}
                        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors flex flex-col gap-0.5 ${!notif.isRead ? "bg-[#138C9F]/5" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-700 leading-normal font-medium">
                            {notif.message}
                          </p>
                          {notif.count > 1 && (
                            <span className="shrink-0 text-[10px] font-black bg-[#138C9F] text-white px-2 py-0.5 rounded-full">
                              {notif.count}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">
                          {notif.time || notif.createdAt}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-xs text-gray-400">
                      لا توجد إشعارات جديدة حالياً
                    </p>
                  )}
                  {notifications && notifications.length > 5 && (
                    <div
                      onClick={() => { navigate("/admin/notifications"); setShowNotifMenu(false); }}
                      className="px-4 py-2.5 text-center text-xs font-bold text-[#138C9F] hover:bg-[#138C9F]/5 cursor-pointer transition-colors"
                    >
                      عرض الكل ({notifications.length})
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 📸 تفاصيل المسؤول */}
          <div onClick={() => navigate("/admin/profile")} className="flex items-center gap-2 md:gap-3 cursor-pointer p-1.5 px-2.5 rounded-xl border border-transparent hover:bg-gray-50/60 hover:border-[#138C9F] transition-all duration-300 select-none">
            <div
              
              className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-[#C3C6D6] bg-slate-100 overflow-hidden cursor-pointer relative group transition-all duration-300 hover:border-[#138C9F] shadow-sm shrink-0 flex items-center justify-center"
              title="عرض الملف الشخصي"
            >
              {userData && userData.image ? (
                // 1. إذا كانت الصورة موجودة، تملأ الدائرة بالكامل بدون حدود داخلية مكررة
                <img
                  loading="lazy"
                  decoding="async"
                  width="44"
                  height="44"
                  className="w-full h-full object-cover"
                  src={userData.image}
                  alt="Profile"
                />
              ) : (
                // 2. إذا لم تكن الصورة موجودة، تملأ الدائرة بلون متناسق وحروف واضحة متجاوبة مع حجم الأب
                <div className="w-full h-full bg-[#138C9F] text-white flex items-center justify-center font-bold text-sm md:text-base select-none font-['Tajawal']">
                  {userData ? `${userData.firstname.slice(0, 2) || ""}` : "?"}
                </div>
              )}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs md:text-sm font-black text-[#138C9F] whitespace-nowrap">
                {userData
                  ? `${userData.firstname} ${userData.lastname}`
                  : "عمر حمد"}
              </p>
              <p className="text-[10px] md:text-[11px] font-bold text-slate-500">
                {userData.email ? userData.email : "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AdminNavbar;