import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; // ربط السياق الشامل للتطبيق

const Navbar = () => {
    const navigate = useNavigate();

    // استهلاك الحالات الحية والدوال من الـ AppContext
    const { token, setToken, notifications, markAllAsRead } = useContext(AppContext);

    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false); // حالة قائمة الإشعارات المنسدلة

    // حساب عدد الإشعارات غير المقروءة ديناميكياً
    const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'الأطباء', path: '/doctors' },
        { name: 'من نحن', path: '/about' },
        { name: 'تواصل معنا', path: '/contact' },
    ];

    return (
        // تصميم زجاجي عصري مثبت (Sticky Glassmorphism) متناسق مع الأطراف والزوايا
        <div className='sticky mb-10 font-["Cairo"] top-4 left-4 right-4 z-50 flex items-center justify-between text-base py-3 px-6 sm:px-10 bg-white/75 backdrop-blur-md border border-white/40 rounded-2xl shadow-md' dir='rtl'>

            {/* ---- اللوجو ---- */}
            <div className='shrink-0 z-50'>
                <img
                    onClick={() => navigate('/')}
                    className='h-10 sm:h-11 w-auto cursor-pointer object-contain transform hover:scale-105 transition-all duration-300'
                    src={assets.logo}
                    alt="شعار طبيبي"
                />
            </div>

            {/* ---- القائمة المركزية للشاشات الكبيرة والمتوسطة ---- */}
            <ul className='hidden md:flex items-center gap-8 font-medium text-gray-800 text-sm lg:text-base'>
                {navLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) => isActive ? "text-[#138C9F] font-bold pb-1 border-b-2 border-[#138C9F]" : "text-gray-700 hover:text-[#138C9F] transition-colors pb-1"}
                    >
                        <li>{link.name}</li>
                    </NavLink>
                ))}
            </ul>

            {/* ---- القسم الأيسر: التحكم، الإشعارات، البروفايل، والتسجيل ---- */}
            <div className='flex items-center gap-4 shrink-0'>
                {token ? (
                    <div className='flex items-center gap-3 relative'>

                        {/* 🔔 زر وقائمة الإشعارات المطور */}
                        <div className='relative'>
                            <button
                                onClick={() => { setShowNotifMenu(!showNotifMenu); setShowProfileMenu(false); markAllAsRead(); }}
                                className='p-2 rounded-full hover:bg-gray-100/80 transition-colors duration-200 relative'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-gray-600 hover:text-[#138C9F] transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>

                                {/* شارة الإشعارات النابضة الحية */}
                                {unreadCount > 0 && (
                                    <span className='absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse' style={{ direction: 'ltr' }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* القائمة المنسدلة للإشعارات السريعة */}
                            {showNotifMenu && (
                                <div className='absolute left-0 mt-3 w-80 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl py-2 z-50 text-right animate-fadeIn'>
                                    <div className='px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-2xl'>
                                        <span className='font-bold text-gray-800 text-sm'>الإشعارات</span>
                                        <span className='text-xs text-[#138C9F] cursor-pointer hover:underline' onClick={() => setShowNotifMenu(false)}>إغلاق</span>
                                    </div>
                                    <div className='max-h-64 overflow-y-auto scrollbar-none'>
                                        {notifications && notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => {
                                                        navigate('/notifications');
                                                        setShowNotifMenu(false);
                                                    }}
                                                    className={`px-4 py-3 hover:bg-gray-50/80 border-b border-gray-50 cursor-pointer transition-colors flex flex-col gap-0.5 ${!notif.isRead ? 'bg-[#138C9F]/5' : ''}`}
                                                >
                                                    <p className='text-xs text-gray-700 leading-normal font-medium'>{notif.message}</p>
                                                    <span className='text-[10px] text-gray-400 mt-1'>{notif.time}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className='text-center py-6 text-xs text-gray-400'>لا توجد إشعارات حالياً</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ---- قائمة ملف الشخصي  ---- */}
                        <div className='flex items-center gap-1.5 cursor-pointer relative'>
                            <div
                                onClick={() => { setShowProfileMenu(prev => !prev); setShowNotifMenu(false); }}
                                className='flex items-center gap-1.5 z-50 relative select-none p-1 rounded-xl hover:bg-gray-50/60 transition-colors'
                            >
                                <img className='w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm' src={assets.profile_pic} alt="Profile" />
                                <img className='w-2.5 opacity-60 transition-transform duration-200' src={assets.dropdown_icon} alt="" />
                            </div>

                            {showProfileMenu && (
                                <div onClick={() => setShowProfileMenu(false)} className='fixed inset-0 bg-transparent z-40' />
                            )}

                            <div className={`absolute top-full left-0 mt-3 text-sm font-medium text-gray-700 z-50 transition-all ${showProfileMenu ? 'block' : 'hidden'}`}>
                                <div className='min-w-48 bg-white/95 backdrop-blur-md shadow-xl rounded-xl border border-gray-100 flex flex-col p-2 whitespace-nowrap animate-fadeIn'>
                                    <p onClick={() => { navigate('/my-profile'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>ملفي الشخصي</p>
                                    <p onClick={() => { navigate('/my-appointment'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>حجوزاتي</p>
                                    <p onClick={() => { navigate('/medical-history'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>السجل المرضي</p>
                                    <p onClick={() => { navigate('/medical-record'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>السجل الطبي</p>
                                    <p onClick={() => { navigate('/chats'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>المحادثات</p>
                                    <p onClick={() => { navigate('/financial-transactions'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-[#138C9F] px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right'>المعاملات المالية</p>
                                    <hr className='my-1 border-gray-100' />
                                    <p onClick={() => { setToken(''); navigate('/'); setShowProfileMenu(false); }} className='hover:bg-red-50 hover:text-red-600 px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-right font-semibold'>تسجيل الخروج</p>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* ---- أزرار التسجيل عند غياب التوكن ---- */
                    <div className='hidden md:flex items-center gap-3'>
                        <button
                            onClick={() => navigate('/login')}
                            className='bg-[#138C9F] text-white px-6 py-2.5 rounded-full font-medium cursor-pointer hover:bg-[#2f7d99] transition-all whitespace-nowrap text-sm lg:text-base shadow-sm active:scale-95'
                        >
                            تسجيل دخول
                        </button>

                    </div>
                )}

                {/* زر الهامبرغر للموبايل */}
                <img
                    onClick={() => setShowMenu(true)}
                    className='w-6 h-6 md:hidden cursor-pointer opacity-85 z-50 relative shrink-0 active:scale-95 transition-transform'
                    src={assets.menu_icon}
                    alt="Menu"
                />
            </div>

            {/* ---- قائمة شاشات الموبايل المتكاملة الجانبية ---- */}
            <div className={`md:hidden fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-300 overflow-hidden ${showMenu ? 'w-full sm:w-80 border-l border-gray-200 shadow-2xl' : 'w-0'}`}>
                <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200 bg-gray-50/50'>
                    <img className='h-9 w-auto' src={assets.logo} alt="شعار طبيبي" />
                    <img onClick={() => setShowMenu(false)} className='w-7 cursor-pointer hover:rotate-90 transition-transform duration-200' src={assets.cross_icon} alt="Close" />
                </div>
                <ul className='flex flex-col items-center gap-5 mt-8 px-5 text-base font-medium text-gray-800 w-full'>
                    {navLinks.map((link, index) => (
                        <NavLink key={index} onClick={() => setShowMenu(false)} to={link.path} className="w-full text-center">
                            <p className='py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors w-full'>{link.name}</p>
                        </NavLink>
                    ))}

                    {!token && (
                        <div className='flex flex-col gap-3 w-full mt-6 px-4 border-t border-gray-100 pt-6'>
                            <button onClick={() => { navigate('/login'); setShowMenu(false); }} className='bg-[#138C9F] text-white py-2.5 rounded-full font-medium text-center text-sm w-full active:scale-98 transition-transform shadow-sm'>
                                تسجيل دخول
                            </button>

                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;