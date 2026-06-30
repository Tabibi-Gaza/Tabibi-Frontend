import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    const Speciality = (spec) => {
        const translation = {
            'General physician': 'طبيب عام',
            'Gynecologist': 'نسائية وتوليد',
            'Dermatologist': 'جلدية وتجميل',
            'Pediatricians': 'طب أطفال',
            'Neurologist': 'مخ وأعصاب',
            'Gastroenterologist': 'جهاز هضمي'
        };
        return translation[spec] || spec;
    };

    // دالة لعرض النجوم بناءً على تقييم الطبيب القادم من الباك اند
    const renderStars = (rating = 0) => {
        // تقريب التقييم لأقرب عدد صحيح لإظهار النجوم الممتلئة بشكل صحيح
        const roundedRating = Math.round(rating);
        
        return (
            <div className='flex items-center gap-0.5 text-amber-500 text-base' dir='ltr'>
                {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    return (
                        <span key={i} className='select-none'>
                            {starValue <= roundedRating ? '★' : '☆'}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className='flex flex-col items-center gap-4 my-24 text-slate-900 font-["Cairo"]' dir='rtl'>
            
            <span className='text-xs font-black text-[#3a96b7] bg-[#3a96b7]/10 px-4 py-2 rounded-full tracking-widest border border-[#3a96b7]/10 select-none'>
                نخبة الأطباء
            </span>
            
            <h2 className='text-2xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight'>
                الأطباء الأعلى تقييماً
            </h2>
            
            <p className='w-11/12 sm:w-1/2 text-center text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl px-4 sm:px-0 font-bold'>
                احجز موعدك مباشرة مع نخبة من الاستشاريين المعتمدين الحاصلين على ثقة مرضانا.
            </p>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-12 px-4 max-w-7xl mx-auto'>
                {doctors && doctors.slice(0, 8).map((item, index) => {
                    // ملاحظة: تأكد أن الباك اند يرسل الحقول (rating) و (reviewsCount) أو قم بتعديل المسميات أدناه حسب مشروعك
                    const doctorRating = item.rating || 0;
                    const totalReviews = item.reviewsCount || 0;
                    
                    return (
                        <div
                            key={index}
                            onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
                            className='group bg-white border border-slate-100 rounded-3xl overflow-hidden cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:border-[#3a96b7]/30 hover:shadow-[0_20px_40px_rgba(58,150,183,0.07)] md:hover:-translate-y-2 transition-all duration-500 flex flex-row md:flex-col h-full'
                        >
                            <div className='bg-linear-to-b from-slate-50 to-white overflow-hidden w-28 sm:w-36 md:w-full aspect-square md:h-56 shrink-0 flex items-center justify-center relative border-l border-slate-100 md:border-l-0 md:border-b'>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-center'
                                />
                            </div>

                            <div className='p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 text-right bg-white relative z-10 min-w-0'>
                                <div className='w-full'>
                                    <div className='flex items-center gap-1.5 text-[10px] md:text-xs font-black text-green-600 mb-2 bg-green-50 w-fit px-2.5 py-1 rounded-lg border border-green-100/50 select-none'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse'></span>
                                        <span>متاح اليوم</span>
                                    </div>

                                    <h3 className='text-slate-900 font-black text-sm md:text-base flex items-center gap-1.5 group-hover:text-[#3a96b7] transition-colors truncate'>
                                        <span className='truncate'>{item.name}</span>
                                        {assets.verified_icon && (
                                            <img src={assets.verified_icon} alt="موثق" className='w-4 h-4 shrink-0' />
                                        )}
                                    </h3>

                                    <div className='flex items-center gap-2 mt-1.5 select-none'>
                                        {/* استدعاء دالة عرض النجوم الثابتة */}
                                        {renderStars(doctorRating)}
                                        
                                        <span className='text-xs font-black text-slate-800 mt-0.5'>
                                            {Number(doctorRating).toFixed(1)}
                                        </span>
                                        
                                        <span className='text-[11px] font-bold text-slate-400 mt-0.5'>
                                            ({totalReviews} تقييم)
                                        </span>
                                    </div>

                                    <p className='text-[#3a96b7] font-black text-xs md:text-sm mt-2.5'>
                                        {Speciality(item.speciality)}
                                    </p>
                                    <p className='text-slate-400 text-[11px] md:text-xs mt-1.5 font-bold truncate md:line-clamp-1'>
                                        {item.experience} من الخبرة والكفاءة
                                    </p>
                                </div>

                                <div className='flex items-center justify-end border-t pt-3 md:pt-4 border-slate-100 w-full mt-2'>
                                    <span className='text-[11px] md:text-xs bg-[#3a96b7]/10 text-[#3a96b7] font-black px-5 py-2.5 rounded-xl group-hover:bg-[#3a96b7] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#3a96b7]/20 transition-all duration-300 select-none whitespace-nowrap w-full text-center'>
                                        احجز الآن
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
                className='mt-16 bg-white border-2 border-[#3a96b7]/20 text-[#3a96b7] font-black text-xs sm:text-sm px-12 py-4 rounded-full hover:border-[#3a96b7] hover:bg-[#3a96b7] hover:text-white hover:shadow-xl hover:shadow-[#3a96b7]/20 transition-all duration-300 transform active:scale-95 shadow-xs select-none cursor-pointer'
            >
                عرض جميع الأطباء
            </button>
        </div>
    );
};

export default TopDoctors;