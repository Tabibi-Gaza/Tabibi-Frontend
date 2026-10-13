import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCalendarCheck, FaShieldHalved, FaHeadset, FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const Banner = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const items = isEn ? [
    {
      icon: <FaCalendarCheck className="w-6 h-6" />,
      gradient: 'from-[#138C9F] to-[#0c9db5]',
      title: 'Fast & easy booking',
      desc: 'Pick your doctor and book your appointment in under a minute — no calls, no waiting.',
    },
    {
      icon: <FaShieldHalved className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-green-600',
      title: 'Verified, trusted doctors',
      desc: 'Every doctor on Tabibi is registered and licensed by the relevant health authorities.',
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      gradient: 'from-violet-500 to-purple-600',
      title: 'Support all week long',
      desc: 'Our team is ready to help you with any question about your appointments or your account.',
    },
  ] : [
    {
      icon: <FaCalendarCheck className="w-6 h-6" />,
      gradient: 'from-[#138C9F] to-[#0c9db5]',
      title: 'حجز سريع وسهل',
      desc: 'اختر طبيبك واحجز موعدك في أقل من دقيقة — بدون مكالمات وبدون انتظار.',
    },
    {
      icon: <FaShieldHalved className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-green-600',
      title: 'أطباء معتمدون وموثوقون',
      desc: 'كل أطباء المنصة مسجّلون ومرخّصون من الجهات الصحية المختصة.',
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      gradient: 'from-violet-500 to-purple-600',
      title: 'دعم متواصل طوال الأسبوع',
      desc: 'فريق الدعم مستعد لمساعدتك في أي استفسار عن حجوزاتك أو حسابك.',
    },
  ];

  const copy = isEn ? {
    title: 'Why choose Tabibi?',
    cta: 'Create your account now',
    alt: 'Tabibi clinics design',
  } : {
    title: 'لماذا تختار طبيبي؟',
    cta: 'أنشئ حسابك الآن',
    alt: 'تصميم عيادات طبيبي المتميزة',
  };

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10' dir={isEn ? 'ltr' : 'rtl'}>
      <div className='bg-[#eef7fa] dark:bg-gray-800 rounded-[2.5rem] flex flex-col md:flex-row items-stretch justify-between overflow-hidden relative min-h-105'>

        <div className='w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-start text-start z-10'>

          <h2 className='text-3xl sm:text-[2.3rem] font-black text-[#0c2340] dark:text-white mb-8 tracking-tight leading-tight'>
            {copy.title}
          </h2>

          <div className='flex flex-col gap-6 w-full mb-8'>

            {items.map((item) => (
              <div key={item.title} className='flex items-center gap-4 w-full justify-start'>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 text-white shadow-lg shadow-black/10`}>
                  {item.icon}
                </div>
                <div className='flex flex-col items-start text-start min-w-0'>
                  <h3 className='text-sm sm:text-base font-black text-slate-800 dark:text-gray-100 leading-tight mb-1'>{item.title}</h3>
                  <p className='text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-bold leading-relaxed'>{item.desc}</p>
                </div>
              </div>
            ))}

          </div>

          <div className='w-full flex justify-start mt-2'>
            <button
              onClick={() => { navigate('/login?view=register'); window.scrollTo(0, 0); }}
              className='bg-[#138C9F] text-white font-black text-base px-14 py-3.5 rounded-2xl hover:bg-[#2c7a96] hover:shadow-xl hover:shadow-[#138C9F]/20 transition-all duration-300 transform active:scale-95 cursor-pointer select-none'
            >
              {copy.cta}
            </button>
          </div>

        </div>

        <div className='w-full md:w-1/2 h-80 md:h-auto min-h-87.5 relative flex items-stretch'>
          <div className='w-full h-full md:rounded-l-none md:rounded-tr-[16rem] overflow-hidden relative'>
            <img
              loading="lazy"
              decoding="async"
              width="480"
              height="480"
              src='https://artedivinoeg.com/wp-content/uploads/2025/07/%D8%A3%D9%81%D9%83%D8%A7%D8%B1-%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D8%B9%D9%8A%D8%A7%D8%AF%D8%A7%D8%AA-%D8%B7%D8%A8%D9%8A%D8%A9.png'
              alt={copy.alt}
              className='w-full h-full object-cover object-center scale-100'
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;
