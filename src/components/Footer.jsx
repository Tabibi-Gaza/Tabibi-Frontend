import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets_frontend/assets';

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
    { name: 'سياسة الخصوصية', path: '/privacy-policy' },
    { name: 'شروط الاستخدام', path: '/terms' },
  ];

  return (
    <div className='w-full bg-[#f3f4f6] grid grid-cols-1 lg:grid-cols-12  font-["Cairo"]  border-gray-100 ' dir='rtl'>
      
      <div className='col-span-1 lg:col-span-5  bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-between items-center text-center relative z-10 rounded-[100px] border-none  lg:rounded-l-[500px] shadow-sm '>
        <div className="flex flex-col items-center gap-6 w-full mt-4">
          <Link className="block transform hover:scale-105 transition-transform duration-300" to="/" onClick={() => window.scrollTo(0, 0)}>
            <img className="h-20 md:h-24 w-auto object-contain" alt="شعار طبيبي" src={assets.logo} />
          </Link>
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl md:text-3xl font-black text-black">وجهتك الأولى</h2>
            <h3 className="text-xl md:text-2xl font-black text-[#3a96b7]">للبحث عن أفضل الأطباء</h3>
            <p className="text-sm text-gray-400 font-bold max-w-xs mx-auto leading-relaxed mt-1">
              وحجز مواعيد الطبية بسهولة وأمان.
            </p>
          </div>
        </div>
        <div className="mt-12 lg:mt-6 text-xs font-black text-black tracking-wide">
          <p>2026 طبيبي</p>
        </div>
      </div>

      {/* القسم الأيسر (يحتوي على روابط المنصة وأزرار التحميل) - ممتد على الخلفية الرمادية الفاتحة */}
      <div className='col-span-1 lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-between z-20 text-right'>
        <div>
          <h2 className='text-xl md:text-2xl font-black text-gray-900 leading-snug max-w-md'>
            احصل على استشارتك الطبية في أي وقت ومن أي مكان مع تطبيق
            <br />
            <span className='text-[#3a96b7] inline-block mt-1 font-black'>طبيبي!</span>
          </h2>

          {/* أزرار تحميل التطبيقات المحدثة والمطابقة للصورة */}
          <div className='flex flex-row items-center justify-start gap-4 mt-6'>
            {/* زر Google Play الكامل */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className='inline-flex items-center justify-center transition-all hover:opacity-90 max-w-38.75 cursor-pointer'
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                className='w-full h-auto object-contain' 
                alt="Google Play" 
              />
            </a>

            {/* زر App Store */}
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className='inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all shadow-xs max-w-35 h-11 cursor-pointer'
            >
              <img src={assets.app_store_icon || "https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg"} className='h-5 w-auto' alt="App Store" />
              <div className='flex flex-col text-left leading-tight font-sans'>
                <span className='text-[8px] text-gray-300 block'>Download on the</span>
                <span className='text-xs font-bold block -mt-0.5'>App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* قوائم الروابط السفلية الفوتر */}
        <div className='grid grid-cols-3 gap-6 w-full pt-8 mt-8 border-t border-gray-200/50'>
          
          <div className='flex flex-col gap-3.5'>
            <p className='text-xs font-black text-gray-900'>المنصة</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-[11px] font-bold'>
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
            <p className='text-xs font-black text-gray-900'>الدعم</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-[11px] font-bold'>
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#3a96b7] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex flex-col gap-3.5 mt-0'>
            <p className='text-xs font-black text-gray-900'>قانوني</p>
            <ul className='flex flex-col gap-2.5 text-gray-500 text-[11px] font-bold'>
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