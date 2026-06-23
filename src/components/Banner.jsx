import React from 'react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-["Cairo"]' dir='rtl'>
      <div className='bg-[#eef7fa] rounded-[2.5rem] flex flex-col md:flex-row items-stretch justify-between overflow-hidden relative min-h-105'>
        
        <div className='w-full md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-start text-right z-10'>
          
          <h2 className='text-3xl sm:text-[2.3rem] font-black text-[#0c2340] mb-8 tracking-tight leading-tight'>
            لماذا تختار طبيبي؟
          </h2>

          <div className='flex flex-col gap-6 w-full mb-8'>
            
            <div className='flex items-center gap-4 w-full justify-start'>
              <div className='w-11 h-11 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0 shadow-xs'>
                <svg className="w-5 h-5 text-[#312e81]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className='flex flex-col items-start text-right'>
                <h4 className='text-sm sm:text-base font-black text-slate-800 leading-tight mb-1'>حجز سريع وسهل</h4>
                <p className='text-xs sm:text-sm text-slate-500 font-bold'>احجز موعدك في أقل من دقيقة.</p>
              </div>
            </div>

            <div className='flex items-center gap-4 w-full justify-start'>
              <div className='w-11 h-11 rounded-xl bg-[#e2e8f0] flex items-center justify-center shrink-0 shadow-xs'>
                <svg className="w-5 h-5 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className='flex flex-col items-start text-right'>
                <h4 className='text-sm sm:text-base font-black text-slate-800 leading-tight mb-1'>أطباء موثوقون</h4>
                <p className='text-xs sm:text-sm text-slate-500 font-bold'>جميع الأطباء في منصتنا مسجلون ومعتمدون من الجهات الصحية المختصة.</p>
              </div>
            </div>

            <div className='flex items-center gap-4 w-full justify-start'>
              <div className='w-11 h-11 rounded-xl bg-[#22c55e] flex items-center justify-center shrink-0 shadow-xs'>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className='flex flex-col items-start text-right'>
                <h4 className='text-sm sm:text-base font-black text-slate-800 leading-tight mb-1'>دعم فني متواصل</h4>
                <p className='text-xs sm:text-sm text-slate-500 font-bold'>فريقنا متواجد دائماً لمساعدتك في أي استفسار حول حجوزاتك الطبية.</p>
              </div>
            </div>

          </div>

          <div className='w-full flex justify-start mt-2'>
            <button 
              onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}
              className='bg-[#3a96b7] text-white font-black text-base px-14 py-3.5 rounded-2xl hover:bg-[#2c7a96] hover:shadow-xl hover:shadow-[#3a96b7]/20 transition-all duration-300 transform active:scale-95 cursor-pointer select-none'
            >
              أنشئ حسابك الآن
            </button>
          </div>
          
        </div>

        <div className='w-full md:w-1/2 h-80 md:h-auto min-h-87.5 relative flex items-stretch'>
          <div className='w-full h-full md:rounded-l-none md:rounded-tr-[16rem] overflow-hidden relative'>
            <img 
              src='https://artedivinoeg.com/wp-content/uploads/2025/07/%D8%A3%D9%81%D9%83%D8%A7%D8%B1-%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D8%B9%D9%8A%D8%A7%D8%AF%D8%A7%D8%AA-%D8%B7%D8%A8%D9%8A%D8%A9.png' 
              alt="تصميم عيادات طبيبي المتميزة" 
              className='w-full h-full object-cover object-center scale-100' 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;