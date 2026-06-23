import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
  const platformLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    
  ];

  const supportLinks = [
    { name: 'الأسئلة الشائعة', path: '/faqs' },
    { name: 'اتصل بنا', path: '/contact' },
    
  ];

  const legalLinks = [
    { name: 'سياسة الخصوصية', path: '/privacy' },
    { name: 'شروط الاستخدام', path: '/terms' },
    
  ];

  return (
    <div className='w-full bg-white grid grid-cols-1 lg:grid-cols-12 relative font-["Cairo"] border-t border-gray-100' dir='rtl' >

      <div className='col-span-1 lg:col-span-5 bg-linear-to-b from-[#eef7fa] to-[#e6f3f7] p-8 md:p-12 lg:p-16 flex flex-col justify-between items-center text-center relative z-10 rounded-[50px] border-none   lg:rounded-l-[300px] shadow-sm'>
        <div className="flex flex-col items-center gap-6 w-full mt-4">
          <Link className="block transform hover:scale-105 transition-transform duration-300" to="/" onClick={() => window.scrollTo(0, 0)}>
            <img className="h-20 md:h-24 w-auto object-contain" alt="شعار طبيبي" src={assets.logo} />
          </Link>
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">وجهتك الأولى</h2>
            <h3 className="text-xl md:text-2xl font-bold text-[#2f7d99]">للبحث عن أفضل الأطباء</h3>
            <p className="text-base text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
              وحجز المواعيد الطبية بسهولة وأمان.
            </p>
          </div>
        </div>
        <div className="mt-12 lg:mt-0 text-sm font-bold text-gray-800 tracking-wide">
          <p>2026 طبيبي</p>
        </div>
      </div>

      <div className='col-span-1 lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-white z-20'>
        <h2 className='text-xl md:text-2xl font-bold text-gray-900 leading-snug max-w-md'>
          احصل على استشارتك الطبية في أي وقت ومن أي مكان مع تطبيق
          <span className='text-[#3a96b7] inline-block mr-1.5 font-extrabold'>طبيبي!</span>
        </h2>

        {/* أزرار المتاجر متجاوبة */}
        <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-6'>

          {/* زر Google Play */}
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className='w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-md group cursor-pointer'
          >
            <img src={assets.play_store_icon || "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"} className='h-8 w-auto' alt="Google Play" />
            <div className='flex flex-col text-right'>
              {/* <span className='text-[10px] text-gray-400 uppercase tracking-wider font-sans'>احصل عليه من</span>
              <span className='text-sm font-bold font-sans tracking-tight'>Google Play</span> */}
            </div>
          </a>

          {/* زر App Store */}
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className='w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-900 transition-all shadow-md group cursor-pointer'
          >
            <img src={assets.app_store_icon || "https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg"} className='h-7 w-auto' alt="App Store" />
            <div className='flex flex-col text-right'>
              <span className='text-[10px] text-gray-400 uppercase tracking-wider font-sans'>حمل من تطبيق</span>
              <span className='text-sm font-bold font-sans tracking-tight'>App Store</span>
            </div>
          </a>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full border-t border-gray-100 pt-8 mt-8 text-right'>

          <div className='flex flex-col gap-3.5'>
            <p className='text-sm font-black text-gray-900'>المنصة</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-xs font-semibold'>
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#3a96b7] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-3.5'>
            <p className='text-sm font-black text-gray-900'>الدعم</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-xs font-semibold'>
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#3a96b7] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-3.5 col-span-2 sm:col-span-1 mt-4 sm:mt-0'>
            <p className='text-sm font-black text-gray-900'>قانوني</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-xs font-semibold'>
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#3a96b7] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Footer;