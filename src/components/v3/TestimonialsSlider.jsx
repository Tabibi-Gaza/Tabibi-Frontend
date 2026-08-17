import React from "react";
import StickySlider from "./StickySlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

const reviews = [
  { 
    patient: "سارة أحمد", 
    avatar: "SA", 
    clinic: "مجمع الشفاء الطبي", 
    rating: 5, 
    text: "تجربة رائعة جداً! الحجز كان سهل وسريع، والدكتور كان محترف جداً وسمعني بكل اهتمام. التطبيق يوفر وقت وجهد كبير.", 
    date: "منذ أسبوعين",
    specialty: "طب عام"
  },
  { 
    patient: "محمد خالد", 
    avatar: "MK", 
    clinic: "مستشفى النور", 
    rating: 5, 
    text: "أول مرة أستخدم التطبيق وما توقعت يكون بهذه السهولة. لقيت دكتور مخ وأعصاب ممتاز وحجزت في نفس اليوم. أنصح به بشدة.", 
    date: "منذ 3 أسابيع",
    specialty: "مخ وأعصاب"
  },
  { 
    patient: "أم عبدالله", 
    avatar: "أع", 
    clinic: "مركز البشرة", 
    rating: 5, 
    text: "الدكتورة سارة كانت ممتازة مع طفلي. شرحتله كل شي بالتفصيل وطمنتني. الحجز عن طريق التطبيق وفر علي وقت الانتظار.", 
    date: "منذ شهر",
    specialty: "طب أطفال"
  },
  { 
    patient: "علي حسن", 
    avatar: "عح", 
    clinic: "مجمع الطب", 
    rating: 5, 
    text: "خدمة ممتازة ودعم فني سريع. لما احتجت أغير الموعد، عملولها في ثواني. الأطباء كلهم معتمدين ومحترمين.", 
    date: "منذ 5 أيام",
    specialty: "جهاز هضمي"
  },
  { 
    patient: "فاطمة علي", 
    avatar: "فع", 
    clinic: "مستشفى النور", 
    rating: 4, 
    text: "تطبيق ممتاز وسهل الاستخدام. لقيت دكتورة نسائية ممتازة وتابعت حملي معها. المواعيد دقيقة والدعم متاح دائماً.", 
    date: "منذ أسبوع",
    specialty: "نسائية وتوليد"
  },
  { 
    patient: "يوسف محمد", 
    avatar: "يم", 
    clinic: "مركز البشرة", 
    rating: 5, 
    text: "علاج البشرة كان ناجح جداً والدكتور خالد متابع الحالة بشكل دوري. التطبيق سهل في المتابعة وتعديل المواعيد.", 
    date: "منذ 10 أيام",
    specialty: "جلدية وتجميل"
  },
];

function TestimonialsSlider() {
  const renderReview = (review, index, isActive) => (
    <div className={`group bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${isActive ? "ring-2 ring-[#138C9F]/30" : ""}`}>
      <div className="flex items-start gap-4 mb-4">
        <FontAwesomeIcon icon={faQuoteRight} className="text-3xl md:text-4xl text-[#138C9F]/10 shrink-0 mt-1" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {[...Array(review.rating)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} className="text-amber-400 text-sm" />
            ))}
            <span className="text-xs font-bold text-[#138C9F] bg-[#138C9F]/5 px-2 py-0.5 rounded-full">{review.specialty}</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-bold text-base md:text-lg">
            "{review.text}"
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#138C9F]/10 to-[#138C9F]/5 flex items-center justify-center text-xl shrink-0 font-black text-[#138C9F]">
          {review.avatar}
        </div>
        <div className="text-right flex-1">
          <h4 className="font-black text-slate-900 text-sm">{review.patient}</h4>
          <p className="text-xs text-[#138C9F] font-bold">{review.clinic}</p>
          <p className="text-[11px] text-slate-400 font-bold">{review.date}</p>
        </div>
      </div>
    </div>
  );

  return (
    <StickySlider
      title="تجارب المرضى"
      subtitle="ماذا يقول مرضانا عن تجربتهم مع طبيبي؟"
      items={reviews}
      renderItem={renderReview}
      pinHeight="450vh"
    />
  );
}

export default TestimonialsSlider;