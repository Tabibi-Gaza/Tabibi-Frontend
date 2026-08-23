import React, { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, lang, toggleTheme, toggleLang } = useTheme();
  const { token, setToken, notifications, groupedNotifications, markAllAsRead, userData } =
    useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
    useEffect(() => {
      const handleResize = () => {
        setShowMenu(false);
        setShowProfileMenu(false);
        setShowNotifMenu(false);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  const isAdmin = token === "admin-token-mock";
  const isDoctor = token === "doctor-token-mock";

  const unreadCount = notifications
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const navLinks = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.doctors'), path: "/doctors" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.contact'), path: "/contact" },
  ];

  const patientExtraLinks = [
    { name: "الصيدليات", path: "/pharmacies" },
    { name: "المراكز الطبية", path: "/medical-centers" },
    { name: "المختبرات", path: "/labs" },
  ];

  const isLoggedIn = !!token;
  const isPatient = isLoggedIn && !isAdmin && !isDoctor;
  const displayLinks = isPatient
    ? [navLinks[0], navLinks[1], ...patientExtraLinks]
    : navLinks;

  return (
    <>
      <div
        className='fixed left-1/2 -translate-x-1/2 top-4 w-[calc(100%-2rem)] sm:w-[calc(100%-1rem)]  font-["Tajawal"] z-[50] flex items-center justify-between text-base py-5 px-4 sm:px-6 md:px-10 bg-white/75 dark:bg-gray-900/75 border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-xl shadow-black/[0.03] select-none backdrop-blur-md'
        dir="rtl"
      >
        {/* ---- اللوجو ---- */}
        <div className="shrink-0 z-50">
          <img
            decoding="async"
            width="44"
            height="44"
            onClick={() => {
              navigate("/");
              setShowMenu(false);
            }}
            className="h-8 sm:h-10 md:h-11 w-auto cursor-pointer object-contain transform hover:scale-105 transition-all duration-300"
            src={assets.logo1 || assets.logo}
            alt="شعار طبيبي"
          />
        </div>

        {/* ---- القائمة المركزية للشاشات الكبيرة والمتوسطة ---- */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-gray-800 dark:text-gray-200 text-sm lg:text-base">
          {displayLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#138C9F] font-bold pb-1 border-b-2 border-[#138C9F]"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#138C9F] transition-colors pb-1"
              }
            >
              <li>{link.name}</li>
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-[#138C9F] font-bold pb-1 border-b-2 border-[#138C9F]"
                  : "text-gray-700  hover:text-[#138C9F] font-bold transition-colors pb-1"
              }
            >
              <li>لوحة التحكم (مسؤول)</li>
            </NavLink>
          )}

          {isDoctor && (
            <NavLink
              to="/doctor-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-[#138C9F] font-bold pb-1 border-b-2 border-[#138C9F]"
                  : "text-gray-700  hover:text-[#2f7d99] font-bold transition-colors pb-1"
              }
            >
              <li>لوحة التحكم (طبيب)</li>
            </NavLink>
          )}
        </ul>

        {/* ---- القسم الأيسر: التحكم، الإشعارات، البروفايل، وزر الهامبرغر ---- */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* زر تبديل اللغة */}
          <button
            onClick={toggleLang}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 font-bold text-xs cursor-pointer"
            title={t('common.language')}
          >
            {lang === 'ar' ? 'EN' : 'ع'}
          </button>

          {/* زر Dark Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 cursor-pointer"
            title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {token ? (
            <div className="flex items-center gap-1.5 sm:gap-3 relative">
              {/* 🔔 زر وقائمة الإشعارات المنبثقة المتجاوبة بالكامل */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowProfileMenu(false);
                    markAllAsRead();
                  }}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 hover:text-[#138C9F] transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1 right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse"
                      style={{ direction: "ltr" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* الحاوية المنبثقة الذكية للإشعارات */}
                {showNotifMenu && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/5 z-40 md:hidden"
                      onClick={() => setShowNotifMenu(false)}
                    />

                    <div className="fixed inset-x-4 top-28 mx-auto max-w-sm md:max-w-none md:absolute md:top-auto md:left-0 md:right-auto md:inset-x-auto md:mt-3 w-auto md:w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl md:shadow-xl py-2 z-50 text-right transition-all duration-200">
                      <div className="px-4 py-2 border-b border-gray-150 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50 rounded-t-2xl">
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">
                          الإشعارات
                        </span>
                        <span
                          className="text-xs text-[#138C9F] cursor-pointer hover:underline font-bold"
                          onClick={() => setShowNotifMenu(false)}
                        >
                          إغلاق
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto scrollbar-none">
                        {groupedNotifications && groupedNotifications.length > 0 ? (
                          groupedNotifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                if (notif.link) {
                                  navigate(notif.link);
                                } else {
                                  navigate("/notifications");
                                }
                                setShowNotifMenu(false);
                              }}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors flex flex-col gap-0.5 ${!notif.isRead ? "bg-[#138C9F]/5 dark:bg-[#138C9F]/10" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-normal font-medium text-justify">
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
                            لا توجد إشعارات حالياً
                          </p>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={() => {
                            navigate("/notifications");
                            setShowNotifMenu(false);
                          }}
                          className="w-full text-center text-xs font-bold text-[#138C9F] hover:underline py-1"
                        >
                          عرض الكل
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ---- قائمة الملف الشخصي ---- */}
              <div className="relative">
                <div
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center gap-1 sm:gap-1.5 cursor-pointer p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {userData && userData.image ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="40"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover object-top bg-gray-100 ring-2 ring-[#138C9F]/25 ring-offset-2 ring-offset-white shadow-sm shrink-0"
                      src={userData.image}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#138C9F] to-[#0f7282] text-white flex items-center justify-center font-bold text-sm select-none font-['Tajawal'] ring-2 ring-[#138C9F]/25 ring-offset-2 ring-offset-white shadow-sm shrink-0">
                      {userData
                        ? `${userData.firstname.slice(0, 1) || ""}`
                        : "?"}
                    </div>
                  )}
                  {userData && (
                    <div className="hidden lg:flex flex-col text-right font-['Tajawal'] leading-tight select-none">
                      <span className="text-xs sm:text-sm font-black text-gray-800 dark:text-gray-200 max-w-[130px] truncate">
                        {userData.firstname} {userData.lastname}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium max-w-[130px] truncate">
                        {userData.email}
                      </span>
                    </div>
                  )}
                  <FontAwesomeIcon
                    icon="chevron-down"
                    className={`text-[10px] text-gray-500 opacity-70 transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* الحاوية المنبثقة الذكية للملف الشخصي */}
                {showProfileMenu && (
                  <div className="absolute left-0 mt-3 min-w-48 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col p-2 whitespace-nowrap z-50 transition-all duration-200">
                    {isAdmin && (
                      <>
                        <p
                          onClick={() => {
                            navigate("/admin-dashboard");
                            setShowProfileMenu(false);
                          }}
                          className="hover:bg-[#138C9F]/10 text-[#138C9F] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer text-right bg-[#138C9F]/5 text-xs sm:text-sm"
                        >
                          لوحة تحكم الإدارة
                        </p>
                        <hr className="my-1 border-gray-100" />
                      </>
                    )}
                    {isDoctor && (
                      <>
                        <p
                          onClick={() => {
                            navigate("/doctor-dashboard");
                            setShowProfileMenu(false);
                          }}
                          className="hover:bg-[#138C9F]/10 text-[#138C9F] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer text-right bg-[#138C9F]/5 text-xs sm:text-sm"
                        >
                          لوحة تحكم الطبيب
                        </p>
                        <hr className="my-1 border-gray-100" />
                      </>
                    )}
                    <p
                      onClick={() => {
                        navigate("/my-profile");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      ملفي الشخصي
                    </p>
                    <p
                      onClick={() => {
                        navigate("/my-appointment");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      حجوزاتي
                    </p>
                    <p
                      onClick={() => {
                        navigate("/medical-history");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      السجل المرضي الشخصي
                    </p>
                    <p
                      onClick={() => {
                        navigate("/medical-files");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      التاريخ الطبي
                    </p>
                    <p
                      onClick={() => {
                        navigate("/my-prescriptions");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      وصفاتي الطبية
                    </p>
                    <p
                      onClick={() => {
                        navigate("/chats");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      المحادثات
                    </p>
                    <p
                      onClick={() => {
                        navigate("/financial-transactions");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      المعاملات المالية
                    </p>
                    <p
                      onClick={() => {
                        navigate("/favorites");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      المفضلة
                    </p>
                    <p
                      onClick={() => {
                        navigate("/cart");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2 rounded-lg transition-colors cursor-pointer text-right text-xs sm:text-sm"
                    >
                      السلة
                    </p>
                    <hr className="my-1 border-gray-100" />
                    <p
                      onClick={() => {
                        setToken("");
                        navigate("/");
                        setShowProfileMenu(false);
                      }}
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 px-4 py-2 rounded-lg transition-colors cursor-pointer text-right font-semibold text-xs sm:text-sm"
                    >
                      {t('nav.logout')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="bg-[#138C9F] text-white px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-[#2f7d99] transition-all whitespace-nowrap text-sm lg:text-base shadow-sm active:scale-95"
              >
                {t('nav.login')}
              </button>
            </div>
          )}

          {/* زر الهامبرغر للموبايل */}
          <button
            onClick={() => {
              setShowMenu(true);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            className="p-1.5 rounded-xl md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all focus:outline-none shrink-0 flex items-center justify-center"
          >
            <img
              loading="lazy"
              decoding="async"
              width="24"
              height="24"
              className="w-5 h-5 sm:w-6 sm:h-6 opacity-85 block"
              src={assets.menu_icon}
              alt="Menu"
            />
          </button>
        </div>
      </div>

      {/* ---- خلفية مظلمة شفافة للهامبرغر (Overlay) ---- */}
      {/* أصبحت الآن sibling مباشر على مستوى الـ Fragment، قبل الـ Drawer */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 w-full h-full bg-black/40 backdrop-blur-md z-[55] transition-all duration-300"
        />
      )}

      {/* ---- القائمة الجانبية لشاشات الموبايل (Responsive Drawer) ---- */}
      {/* تم سحبها برة div النافبار (اللي كان عليه z-[50]) عشان متبقاش محبوسة جوه الـ stacking context بتاعه */}
      <div
        className={`md:hidden rounded-l-2xl fixed top-0 right-0 h-screen z-[70] bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out flex flex-col shadow-2xl border-l border-gray-200 dark:border-gray-700 overflow-hidden ${
          showMenu
            ? "w-full sm:w-80 opacity-100 pointer-events-auto"
            : "w-0 opacity-0 pointer-events-none"
        }`}
        dir="rtl"
      >
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 w-full">
          <img
            decoding="async"
            width="36"
            height="36"
            className="h-9 w-auto object-contain"
            src={assets.logo1 || assets.logo}
            alt="شعار طبيبي"
          />
          <button
            onClick={() => setShowMenu(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none flex items-center justify-center"
          >
            <img
              loading="lazy"
              decoding="async"
              width="24"
              height="24"
              className="w-6 h-6 hover:rotate-90 transition-transform duration-200"
              src={assets.cross_icon}
              alt="Close"
            />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6 px-5 text-base font-medium text-gray-800 dark:text-gray-200 w-full overflow-y-auto flex-1 pb-12">
          {displayLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `w-full text-center rounded-xl transition-all ${isActive ? "bg-[#138C9F]/10 text-[#138C9F] font-bold" : "hover:bg-gray-50"}`
              }
            >
              <p className="py-3 w-full">{link.name}</p>
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin-dashboard"
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `w-full text-center font-bold text-amber-700 rounded-xl mt-1 ${isActive ? "bg-amber-100" : "bg-amber-50 hover:bg-amber-100/80"}`
              }
            >
              <p className="py-3 w-full">🛠️ لوحة التحكم (Admin)</p>
            </NavLink>
          )}

          {isDoctor && (
            <NavLink
              to="/doctor-dashboard"
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `w-full text-center font-bold text-[#138C9F] rounded-xl mt-1 ${isActive ? "bg-cyan-100" : "bg-cyan-50 hover:bg-cyan-100/80"}`
              }
            >
              <p className="py-3 w-full"> لوحة التحكم (Doctor)</p>
            </NavLink>
          )}

          {!token && (
            <div className="w-full mt-4 pt-6 border-t border-gray-100 dark:border-gray-700 px-2 shrink-0">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="bg-[#138C9F] text-white py-3 rounded-xl font-medium text-center text-sm w-full active:scale-98 transition-transform shadow-sm hover:bg-[#2f7d99]"
              >
                {t('nav.login')}
              </button>
            </div>
          )}

          {/* أزرار اللغة والثيم في الموبايل */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 w-full shrink-0">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 text-sm font-bold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 text-sm"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
