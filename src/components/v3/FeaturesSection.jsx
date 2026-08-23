import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faCalendarCheck, faHeartbeat, faPrescriptionBottle } from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    number: "01",
    icon: faVideo,
    title: "استشارة طبية عن بعد",
    desc: "تواصل مع طبيبك أينما كنت عبر مكالمات فيديو عالية الجودة. احصل على الاستشارة الطبية وأنت في منزلك."
  },
  {
    number: "02",
    icon: faCalendarCheck,
    title: "حجز مواعيد ذكي",
    desc: "ابحث عن أفضل الأطباء حسب التخصص والمنطقة، واحجز موعدك في ثوانٍ. نظام ذكي يقترح لك المواعيد المناسبة."
  },
  {
    number: "03",
    icon: faHeartbeat,
    title: "ملفك الصحي المتكامل",
    desc: "سجل طبي شامل يتابع حالتك الصحية. تذكير بالأدوية، تقارير الفحوصات، ومتابعة دورية لحالتك."
  },
  {
    number: "04",
    icon: faPrescriptionBottle,
    title: "وصفات إلكترونية آمنة",
    desc: "استلم وصفاتك الطبية مباشرة على هاتفك. وصفر ورق، وصفات رقمية معتمدة ترسل لصيدلية تختارها."
  },
];

function FeaturesSection() {
  return (
    <section className="bg-white py-20 md:py-28" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs font-black text-[#138C9F] bg-[#138C9F]/10 px-4 py-2 rounded-full inline-block tracking-wide mb-5">
            مميزات طبيبي
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            كل ما تحتاجه في <span className="text-[#138C9F]">منصة واحدة</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl mx-auto font-bold">
            من الاستشارة إلى المتابعة، نرافقك في كل خطوة من رحلتك الصحية
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-gradient-to-b from-white to-slate-50 rounded-3xl border border-slate-100 p-8 md:p-10 hover:shadow-xl hover:border-[#138C9F]/20 transition-all duration-500"
            >
              {/* Number */}
              <span className="absolute top-6 left-6 text-6xl md:text-7xl font-black text-[#138C9F]/5 select-none leading-none">
                {feature.number}
              </span>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#138C9F]/10 to-[#138C9F]/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-[#138C9F] group-hover:to-[#0e7a8c] transition-all duration-500">
                <FontAwesomeIcon icon={feature.icon} className="text-2xl text-[#138C9F] group-hover:text-white transition-colors duration-500" />
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-bold text-sm md:text-base">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;