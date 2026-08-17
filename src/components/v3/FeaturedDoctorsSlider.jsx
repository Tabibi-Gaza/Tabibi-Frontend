import React from "react";
import StickySlider from "./StickySlider";

const doctorItems = [
  { name: "د. أحمد محمد", specialty: "طب عام", rating: 4.9, reviews: 127, experience: "15 سنة خبرة", image: "https://randomuser.me/api/portraits/men/32.jpg", clinic: "مجمع الشفاء" },
  { name: "د. سارة علي", specialty: "نسائية وتوليد", rating: 4.8, reviews: 89, experience: "12 سنة خبرة", image: "https://randomuser.me/api/portraits/women/44.jpg", clinic: "مستشفى النور" },
  { name: "د. خالد عبدالله", specialty: "جلدية وتجميل", rating: 4.9, reviews: 203, experience: "18 سنة خبرة", image: "https://randomuser.me/api/portraits/men/67.jpg", clinic: "مركز البشرة" },
  { name: "د. فاطمة حسن", specialty: "طب أطفال", rating: 4.7, reviews: 156, experience: "10 سنوات خبرة", image: "https://randomuser.me/api/portraits/women/23.jpg", clinic: "مستشفى الأطفال" },
  { name: "د. عمر يوسف", specialty: "مخ وأعصاب", rating: 4.8, reviews: 94, experience: "14 سنة خبرة", image: "https://randomuser.me/api/portraits/men/12.jpg", clinic: "مركز الأعصاب" },
  { name: "د. ليلى محمود", specialty: "جهاز هضمي", rating: 4.9, reviews: 112, experience: "11 سنة خبرة", image: "https://randomuser.me/api/portraits/women/56.jpg", clinic: "مجمع الطب" },
];

function FeaturedDoctorsSlider() {
  const renderDoctor = (doctor, index, isActive) => (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isActive ? "ring-2 ring-[#138C9F]/30 scale-[1.02]" : ""}`}>
      <div className="relative h-56 md:h-64 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          متاح
        </div>
      </div>
      <div className="p-5 md:p-6 text-right">
        <h3 className="font-black text-slate-900 mb-1 text-base md:text-lg">{doctor.name}</h3>
        <p className="text-[#138C9F] font-black text-sm mb-2">{doctor.specialty}</p>
        <div className="flex items-center gap-2 mb-3">
          <svg className="text-amber-400 text-sm" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.383-.57-.03-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          <span className="text-sm font-black text-slate-700">{doctor.rating}</span>
          <span className="text-xs text-slate-400 font-bold">({doctor.reviews} تقييم)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>{doctor.clinic}</span>
        </div>
        <p className="text-xs text-slate-400 font-bold mb-4">{doctor.experience}</p>
        <button className="w-full text-[11px] md:text-sm bg-[#138C9F]/10 text-[#138C9F] font-black py-3 rounded-xl hover:bg-[#138C9F] hover:text-white transition-all duration-300 shadow-sm">
          احجز الآن
        </button>
      </div>
    </div>
  );

  return (
    <StickySlider
      title="نخبة الأطباء"
      subtitle="الأطباء الأعلى تقييماً في المنصة"
      items={doctorItems}
      renderItem={renderDoctor}
      pinHeight="400vh"
    />
  );
}

export default FeaturedDoctorsSlider;