import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PlatformStats = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    const statsData = [
        { id: 1, value: `+${doctors?.length || 15}`, label: 'طبيب استشاري نَشِط', icon: '👨‍⚕️' },
        { id: 2, value: '98٪', label: 'نسبة رضا المرضى', icon: '⭐' },
        { id: 3, value: '15 دقيقة', label: 'متوسط زمن الاستجابة', icon: '⚡' },
        { id: 4, value: '+10000', label: 'استشارة طبية ناجحة', icon: '🎉' },
    ];

    const stepsData = [
        { step: '1', title: 'حدد التخصص', desc: 'استخدم محرك البحث الذكي في الأعلى لاختيار عيادتك.' },
        { step: '2', title: 'اختر الطبيب', desc: 'تصفح الملفات الشخصية وتقييمات المرضى الحقيقية.' },
        { step: '3', title: 'ثبّت موعدك', desc: 'اختر الوقت المناسب لك واحجز استشارتك فوراً.' },
    ];

    return (
        <div id='speciality' className='py-16 bg-[#f8fafc] border-y border-slate-200/60 font-["Cairo"]' dir='rtl'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                    {statsData.map((stat) => (
                        <div
                            key={stat.id}
                            className='bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-[#3a96b7]/30 hover:shadow-[0_10px_30px_rgba(58,150,183,0.05)] transition-all duration-300 group'
                        >
                            <div className='flex flex-col items-start text-right leading-tightOrder'>
                                <span className='text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#3a96b7] duration-200'>
                                    {stat.value}
                                </span>
                                <span className='text-xs sm:text-sm font-extrabold text-slate-500 mt-2 block'>
                                    {stat.label}
                                </span>
                            </div>

                            <div className='w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-slate-50 border border-slate-100/80 group-hover:bg-[#3a96b7]/10 group-hover:border-[#3a96b7]/20 transition-all duration-300 transform group-hover:scale-105'>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='bg-white border border-slate-100/80 rounded-3xl p-8 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.015)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-10 relative overflow-hidden'>

                    <div className='lg:w-1/3 flex flex-col items-start justify-center text-right z-10'>
                        <span className='text-xs font-black text-[#3a96b7] bg-[#3a96b7]/10 px-3 py-1.5 rounded-lg mb-4 tracking-wide border border-[#3a96b7]/10'>
                            آلية العمل
                        </span>
                        <h3 className='text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight'>
                            رعايتك الصحية في <br className='hidden md:block' /> 3 خطوات بسيطة
                        </h3>
                        <p className='text-sm text-slate-600 leading-relaxed font-bold mb-6 max-w-sm'>
                            قُمنا بهندسة المنصة وإلغاء التعقيد الورقي لتتمكن من الوصول إلى طبيبك المفضل بأقل جهد ممكن وبأعلى كفاءة رقمية.
                        </p>

                        <button
                            onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
                            className='text-sm font-black text-[#3a96b7] hover:text-[#2d7792] flex items-center gap-2 transition-all group cursor-pointer border-b-2 border-transparent hover:border-[#3a96b7]/40 pb-0.5'
                        >
                            <span>استكشف دليل الأطباء بالكامل</span>
                            <span className='transition-transform group-hover:-translate-x-1 font-sans text-lg'>←</span>
                        </button>
                    </div>

                    <div className='lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full relative z-10'>
                        {stepsData.map((item, index) => (
                            <div
                                key={index}
                                className='flex flex-col items-start text-right p-6 bg-[#f8fafc]/90 rounded-2xl border border-slate-100 relative group hover:bg-white hover:border-[#3a96b7]/30 hover:shadow-[0_12px_30px_rgba(0,0,0,0.02)] transition-all duration-300 overflow-hidden'
                            >
                                <span className='text-4xl font-black text-slate-400 group-hover:text-[#3a96b7] transition-colors duration-300 mb-4 block select-none font-sans leading-none'>
                                    {item.step}
                                </span>

                                <h4 className='text-base font-black text-slate-900 mb-2 tracking-tight group-hover:text-[#3a96b7] transition-colors duration-200'>
                                    {item.title}
                                </h4>

                                <p className='text-xs md:text-sm text-slate-600 leading-relaxed font-extrabold'>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PlatformStats;