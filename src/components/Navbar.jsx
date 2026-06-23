import React, { useState } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [token, setToken] = useState(true); // اجعلها false لاختبار أزرار التسجيل

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'الأطباء', path: '/doctors' },
        { name: 'من نحن', path: '/about' },
        { name: 'اتصل بنا', path: '/contact' },
    ];

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300 relative w-full' dir='rtl'>

            {/* ---- اللوجو المتجاوب ---- */}
            <div className='shrink-0 z-50'>
                <img
                    onClick={() => navigate('/')}
                    className='h-9 sm:h-11 md:h-13 w-auto cursor-pointer object-contain transform hover:scale-105 transition-all duration-300'
                    src={assets.logo}
                    alt="شعار طبيبي"
                />
            </div>

            {/* ---- القائمة المركزية (معدلة لتجنب التصادم والتداخل) ---- */}
            <ul className='hidden lg:flex items-center gap-6 font-medium absolute left-1/2 -translate-x-1/2'>
                {navLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) => isActive ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1" : "text-gray-700 hover:text-blue-600 transition-colors pb-1"}
                    >
                        <li>{link.name}</li>
                    </NavLink>
                ))}
            </ul>

            {/* روابط بديلة تظهر في الشاشات المتوسطة (md إلى lg) لتفادي اختفاء القائمة أو تداخلها */}
            <ul className='hidden md:flex lg:hidden items-center gap-4 font-medium mx-4 grow justify-center text-xs lg:text-sm'>
                {navLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600 transition-colors"}
                    >
                        <li>{link.name}</li>
                    </NavLink>
                ))}
            </ul>

            {/* ---- القسم الأيسر: البروفايل أو أزرار التسجيل ---- */}
            <div className='flex items-center gap-2 sm:gap-4 relative z-50 shrink-0'>
                {token ? (
                    <div className='flex items-center gap-1.5 cursor-pointer relative'>
                        {/* زر البروفايل */}
                        <div
                            onClick={() => setShowProfileMenu(prev => !prev)}
                            className='flex items-center gap-1.5 z-50 relative select-none'
                        >
                            <img className='w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm' src={assets.profile_pic} alt="Profile" />
                            <img className='w-2.5 opacity-60' src={assets.dropdown_icon} alt="" />
                        </div>

                        {/* طبقة إغلاق القائمة عند الضغط بالخارج (تعمل على كل الشاشات لحماية التجربة) */}
                        {showProfileMenu && (
                            <div
                                onClick={() => setShowProfileMenu(false)}
                                className='fixed inset-0 bg-transparent z-40'
                            />
                        )}

                        <div className={`absolute top-full left-0 mt-3 text-sm font-medium text-gray-700 z-50 transition-all ${showProfileMenu ? 'block' : 'hidden'}`}>
                            <div className='min-w-44 bg-white shadow-xl rounded-lg border border-gray-100 flex flex-col p-2 whitespace-nowrap'>
                                <p onClick={() => { navigate('/my-profile'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-blue-600 px-4 py-2.5 rounded transition-colors cursor-pointer text-right'>
                                    ملفي الشخصي
                                </p>
                                <p onClick={() => { navigate('/my-appointment'); setShowProfileMenu(false); }} className='hover:bg-gray-50 hover:text-blue-600 px-4 py-2.5 rounded transition-colors cursor-pointer text-right'>
                                    مواعيدي
                                </p>
                                <hr className='my-1 border-gray-100' />
                                <p onClick={() => { setToken(false); setShowProfileMenu(false); }} className='hover:bg-red-50 hover:text-red-600 px-4 py-2.5 rounded transition-colors cursor-pointer text-right font-medium'>
                                    تسجيل الخروج
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='hidden md:flex items-center gap-2 lg:gap-3'>
                        <button
                            onClick={() => navigate('/login')}
                            className='bg-[#3a96b7] text-white px-3 lg:px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-[#2f7d99] transition-all whitespace-nowrap text-xs lg:text-sm shadow-sm'
                        >
                            تسجيل دخول
                        </button>
                        {/* <button
                            onClick={() => navigate('/login?')}
                            className='bg-[#3a96b7] text-white px-3 lg:px-5 py-2 rounded-full font-medium cursor-pointer hover:bg-[#2f7d99] transition-all whitespace-nowrap text-xs lg:text-sm shadow-sm'
                        >
                            إنشاء حساب
                        </button> */}
                    </div>
                )}

                {/* زر القائمة الهامبرغر للموبايل والشاشات الصغيرة */}
                <img
                    onClick={() => setShowMenu(true)}
                    className='w-6 h-6 md:hidden cursor-pointer opacity-85 z-50 relative shrink-0 active:scale-95 transition-transform'
                    src={assets.menu_icon}
                    alt="Menu"
                />
            </div>

            {/* ---- قائمة الموبايل والتابلت الجانبية المتجاوبة ---- */}
            <div className={`md:hidden fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-300 overflow-hidden ${showMenu ? 'w-full sm:w-80 border-l border-gray-200 shadow-2xl' : 'w-0'}`}>
                <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
                    <img className='h-9 w-auto' src={assets.logo} alt="شعار طبيبي" />
                    <img onClick={() => setShowMenu(false)} className='w-7 cursor-pointer hover:rotate-90 transition-transform duration-200' src={assets.cross_icon} alt="Close" />
                </div>
                <ul className='flex flex-col items-center gap-5 mt-8 px-5 text-base font-medium text-gray-800 w-full'>
                    {navLinks.map((link, index) => (
                        <NavLink key={index} onClick={() => setShowMenu(false)} to={link.path} className="w-full text-center">
                            <p className='py-2.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors w-full'>{link.name}</p>
                        </NavLink>
                    ))}

                    {/* أزرار التسجيل داخل قائمة الموبايل في حال عدم تسجيل الدخول */}
                    {!token && (
                        <div className='flex flex-col gap-2.5 w-full mt-6 px-4 border-t border-gray-100 pt-6'>
                            <button onClick={() => { navigate('/login?role=doctor'); setShowMenu(false); }} className='bg-[#3a96b7] text-white py-2.5 rounded-full font-medium text-center text-sm w-full active:scale-98 transition-transform shadow-sm'>
                                تسجيل دخول
                            </button>
                            {/* <button onClick={() => { navigate('/login?role=patient'); setShowMenu(false); }} className='bg-[#3a96b7] text-white py-2.5 rounded-full font-medium text-center text-sm w-full active:scale-98 transition-transform shadow-sm'>
                                التسجيل كمريض
                            </button> */}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;