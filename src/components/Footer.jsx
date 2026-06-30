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
    <div className='w-full bg-[#f3f4f6] grid grid-cols-1 lg:grid-cols-12 font-["Cairo"] border-gray-100 mt-20' dir='rtl'>
      {/* الجزء الأيمن (الشعار والتعريف) - متجاوب بالكامل في الانحناءات والمساحات */}
      <div className='col-span-1 lg:col-span-4 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-between items-center lg:items-start relative z-10 border-none rounded-b-[100px] sm:rounded-b-[100px] lg:rounded-b-none lg:rounded-l-[150px] xl:rounded-l-[250px] shadow-sm'>
        <div className='flex flex-col gap-6 w-full mt-4 text-center lg:text-right'>
          <Link 
            className='block transform hover:scale-105 transition-transform duration-300 mx-auto lg:mx-0 w-fit' 
            to='/' 
            onClick={() => window.scrollTo(0, 0)}
          >
            <img className='h-16 md:h-20 lg:h-24 object-contain' alt="شعار طبيبي" src={assets.logo} />
          </Link>

          <div className='space-y-2 mt-4'>
            <h2 className='text-2xl md:text-3xl font-black text-black'>وجهتك الأولى</h2>
            <h3 className='text-xl md:text-2xl font-black text-[#138C9F]'>للبحث عن أفضل الأطباء</h3>
            <p className='text-base md:text-xl text-gray-400 font-bold mt-1'>وحجز مواعيدك الطبية بسهولة وأمان.</p>
          </div>

          <div className='mt-8 lg:mt-12 font-black text-gray-500 text-center lg:text-right'>
            <p>© 2026 عيادة غزة الطبية</p>
          </div>
        </div>
      </div>

      {/* القسم الأيسر (العنوان، الأزرار، وقوائم الروابط) */}
      <div className='col-span-1 lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-between z-20 text-right'>
        {/* حاوية العنوان والأزرار - تتحول من عمودي في الموبايل إلى أفقي متباعد في الشاشات الكبيرة */}
        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 w-full text-center lg:text-right'>
          <h2 className='text-2xl md:text-3xl xl:text-4xl font-black text-gray-900 leading-relaxed max-w-xl'>
            احصل على استشارتك الطبية في
            <span className='block'> أي وقت ومن أي مكان مع تطبيق</span>
            <span className='text-[#138C9F] block mt-2 md:mt-3 font-black animate-pulse'>طبيبي!</span>
          </h2>

          {/* حاوية أزرار المتاجر الموحدة العرض تماماً والمصطفة بذكاء */}
          <div className='flex flex-col md:flex-row lg:flex-col items-center justify-center gap-4 w-full lg:w-auto sm:justify-center'>
            {/* زر Google Play */}
            <a 
              href='https://play.google.com' 
              target='_blank' 
              rel='noopener noreferrer' 
              className='inline-flex items-center justify-center transition-all hover:opacity-90 h-14 w-52 cursor-pointer shadow-sm hover:shadow-md rounded-xl overflow-hidden bg-black shrink-0'
            >
              <img src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg' className='h-full w-full object-cover' alt='Google Play' />
            </a>

            {/* زر App Store */}
            <a 
              href='https://www.apple.com/app-store/' 
              target='_blank' 
              rel='noopener noreferrer' 
              className='inline-flex items-center justify-center gap-2 sm:gap-3 bg-black text-white px-3 sm:px-4 rounded-xl hover:bg-gray-900 transition-all shadow-sm hover:shadow-md h-14 w-52 cursor-pointer border border-neutral-800 shrink-0'
            >
              <img src='https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg' className='h-6 md:h-7 w-auto object-contain shrink-0' alt='App Store' />
              <div className='flex flex-col text-left leading-tight font-sans select-none'>
                <span className='text-[9px] text-gray-300 block font-light tracking-wide'>Download on the</span>
                <span className='text-xs font-semibold block text-left mt-0.5 tracking-tight'>App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* قوائم الروابط السفلية (الفوتر) - شبكة مرنة متجاوبة تبدأ من عمودين وتصل لـ 3 أعمدة */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full pt-8 mt-10 border-t border-gray-300/60 text-center sm:text-right'>
          {/* قائمة المنصة */}
          <div className='flex flex-col items-center sm:items-start gap-4'>
            <p className='text-base md:text-lg font-black text-gray-900'>المنصة</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 text-sm md:text-base font-bold'>
              {platformLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#138C9F] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* قائمة الدعم */}
          <div className='flex flex-col items-center sm:items-start gap-4'>
            <p className='text-base md:text-lg font-black text-gray-900'>الدعم</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 text-sm md:text-base font-bold'>
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#138C9F] transition-colors duration-200 block w-fit'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* قائمة قانوني */}
          <div className='flex flex-col items-center sm:items-start gap-4 col-span-1 sm:col-span-2 md:col-span-1'>
            <p className='text-base md:text-lg font-black text-gray-900'>قانوني</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 text-sm md:text-base font-bold'>
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link onClick={() => window.scrollTo(0, 0)} to={link.path} className='hover:text-[#138C9F] transition-colors duration-200 block w-fit'>
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