import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assets } from '../assets/assets_frontend/assets';

const Footer = () => {
  const { t } = useTranslation();

  const platformLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
  ];

  const supportLinks = [
    { name: t('footer.faq'), path: '/faqs' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const legalLinks = [
    { name: t('footer.privacy'), path: '/privacy-policy' },
    { name: t('footer.terms'), path: '/terms' },
  ];

  return (
    <div className='w-full bg-[#f3f4f6] dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-12 border-gray-100 dark:border-gray-700 mt-20' dir='rtl'>
      {/* الجزء الأيمن (الشعار والتعريف) - متجاوب بالكامل في الانحناءات والمساحات */}
      <div className='col-span-1 lg:col-span-4 bg-white dark:bg-gray-800 p-8 md:p-12 lg:p-16 flex flex-col justify-between items-center lg:items-start relative z-10 border-none rounded-b-[100px] sm:rounded-b-[100px] lg:rounded-b-none lg:rounded-l-[150px] xl:rounded-l-[250px] shadow-sm'>
        <div className='flex flex-col gap-6 w-full mt-4 text-center lg:text-right'>
          <Link 
            className='block transform hover:scale-105 transition-transform duration-300 mx-auto lg:mx-0 w-fit' 
            to='/' 
            onClick={() => window.scrollTo(0, 0)}
          >
            <img loading="lazy" decoding="async" width="96" height="96" className='h-16 md:h-20 lg:h-24 object-contain' alt="شعار طبيبي" src={assets.logo} />
          </Link>

          <div className='space-y-2 mt-4'>
            <h2 className='text-2xl md:text-3xl font-black text-black dark:text-white'>وجهتك الأولى</h2>
            <h3 className='text-xl md:text-2xl font-black text-[#138C9F]'>للبحث عن أفضل الأطباء</h3>
            <p className='text-base md:text-xl text-gray-400 dark:text-gray-300 font-bold mt-1'>وحجز مواعيدك الطبية بسهولة وأمان.</p>
          </div>

          <div className='mt-8 lg:mt-12 font-black text-gray-500 dark:text-gray-400 text-center lg:text-right'>
            <p>{t('footer.copyright')}</p>
          </div>

          <div className='flex items-center justify-center lg:justify-start gap-3 mt-4'>
            <a
              href='https://www.instagram.com/tabibi_gaza/'
              target='_blank'
              rel='noopener noreferrer'
              className='w-8 h-8 rounded-full bg-[#E4405F] text-white flex items-center justify-center hover:opacity-80 transition-all duration-300'
              aria-label='Instagram'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </a>
            <a
              href='https://www.linkedin.com/company/tabibi-gaza/'
              target='_blank'
              rel='noopener noreferrer'
              className='w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-all duration-300'
              aria-label='LinkedIn'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* القسم الأيسر (العنوان، الأزرار، وقوائم الروابط) */}
      <div className='col-span-1 lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-between z-20 text-right'>
        {/* حاوية العنوان والأزرار - تتحول من عمودي في الموبايل إلى أفقي متباعد في الشاشات الكبيرة */}
        <div className='flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 w-full text-center lg:text-right'>
          <h2 className='text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-relaxed max-w-xl'>
            احصل على استشارتك الطبية في
            <span className='block'> أي وقت ومن أي مكان مع تطبيق</span>
            <span className='text-[#138C9F] block mt-2 md:mt-3 font-bold animate-pulse'>طبيبي!</span>
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
              <img loading="lazy" decoding="async" width="208" height="56" src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg' className='h-full w-full object-cover' alt='Google Play' />
            </a>

            {/* زر App Store */}
            <a 
              href='https://www.apple.com/app-store/' 
              target='_blank' 
              rel='noopener noreferrer' 
              className='inline-flex items-center justify-center gap-2 sm:gap-3 bg-black text-white px-3 sm:px-4 rounded-xl hover:bg-gray-900 transition-all shadow-sm hover:shadow-md h-14 w-52 cursor-pointer border border-neutral-800 shrink-0'
            >
              <img loading="lazy" decoding="async" width="24" height="28" src='https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg' className='h-6 md:h-7 w-auto object-contain shrink-0' alt='App Store' />
              <div className='flex flex-col text-left leading-tight font-sans select-none'>
                <span className='text-[9px] text-gray-300 block font-light tracking-wide'>حمّل من</span>
                <span className='text-xs font-semibold block text-left mt-0.5 tracking-tight'>App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* قوائم الروابط السفلية (الفوتر) - شبكة مرنة متجاوبة تبدأ من عمودين وتصل لـ 3 أعمدة */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full pt-8 mt-10 border-t border-gray-300/60 dark:border-gray-700 text-center sm:text-right'>
          {/* قائمة المنصة */}
          <div className='flex flex-col items-center sm:items-start gap-4'>
            <p className='text-base md:text-lg font-black text-gray-900 dark:text-white'>المنصة</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold'>
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
            <p className='text-base md:text-lg font-black text-gray-900 dark:text-white'>الدعم</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold'>
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
            <p className='text-base md:text-lg font-black text-gray-900 dark:text-white'>قانوني</p>
            <ul className='flex flex-col items-center sm:items-start gap-3 text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold'>
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
