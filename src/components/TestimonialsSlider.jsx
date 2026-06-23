import React, { useState, useEffect } from 'react';
import { reviewsData } from '../assets/assets_frontend/assets';

const TestimonialsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reviews = reviewsData || [];

    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, reviews.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

    if (reviews.length === 0) return null;

    return (
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-["Cairo"]' dir='rtl'>
            <div className='bg-white border border-slate-100 rounded-3xl p-8 lg:p-12 shadow-[0_4px_25px_rgba(0,0,0,0.01)] relative overflow-hidden'>

                <div className='absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(58,150,183,0.03),transparent_35%)] pointer-events-none'></div>

                <div className='flex items-center justify-between w-full mb-10 z-10 relative'>
                    <div className='text-right'>
                        <span className='text-xs font-black text-[#3a96b7] bg-[#3a96b7]/10 px-4 py-2 rounded-full mb-3 inline-block tracking-wide select-none'>
                            تجارب حية
                        </span>
                        <h3 className='text-xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1'>
                            ماذا يقول مرضانا عن منصتنا؟
                        </h3>
                    </div>

                    <div className='flex items-center gap-2 select-none'>
                        <button
                            onClick={prevSlide}
                            className='w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 font-extrabold hover:bg-[#3a96b7] hover:text-white hover:border-[#3a96b7] hover:shadow-md hover:shadow-[#3a96b7]/10 transition-all duration-300 active:scale-[0.95] cursor-pointer'
                            title="المراجعة السابقة"
                        >
                            <span className='text-base font-black'>→</span>
                        </button>
                        <button
                            onClick={nextSlide}
                            className='w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 font-extrabold hover:bg-[#3a96b7] hover:text-white hover:border-[#3a96b7] hover:shadow-md hover:shadow-[#3a96b7]/10 transition-all duration-300 active:scale-[0.95] cursor-pointer'
                            title="المراجعة التالية"
                        >
                            <span className='text-base font-black'>←</span>
                        </button>
                    </div>
                </div>

                <div
                    key={currentIndex}
                    className='w-full min-h-40 flex flex-col md:flex-row items-start md:items-center gap-6 z-10 relative animate-fade-in transition-all duration-500'
                >
                    <div className='w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100/70 flex items-center justify-center text-3xl shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.015)] select-none'>
                        {reviews[currentIndex].avatar}
                    </div>

                    {/* نصوص وتفاصيل المراجعة */}
                    <div className='flex-1 text-right flex flex-col items-start min-w-0 w-full'>
                        <div className='flex flex-wrap items-center gap-2.5 mb-2 w-full'>
                            <h4 className='text-base font-black text-slate-900 truncate'>{reviews[currentIndex].patient}</h4>
                            <span className='text-[10px] font-black text-[#3a96b7] bg-[#3a96b7]/5 border border-[#3a96b7]/10 px-2.5 py-1 rounded-lg select-none'>
                                {reviews[currentIndex].clinic}
                            </span>
                            <span className='text-xs text-amber-500 select-none tracking-xs mt-0.5'>{reviews[currentIndex].rating}</span>
                        </div>

                        <p className='text-xs sm:text-sm text-slate-600 leading-relaxed font-bold max-w-4xl mb-4 text-justify md:text-right w-full'>
                            " {reviews[currentIndex].text} "
                        </p>

                        <span className='text-[11px] font-bold text-slate-400 select-none'>{reviews[currentIndex].date}</span>
                    </div>
                </div>

                <div className='flex items-center justify-center gap-2 mt-10 z-10 relative select-none'>
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index ? 'w-8 bg-[#3a96b7]' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                            title={`الانتقال للمراجعة ${index + 1}`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TestimonialsSlider;