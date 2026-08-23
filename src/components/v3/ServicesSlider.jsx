import React from "react";
import StickySlider from "./StickySlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faNotesMedical, faPills, faHeartbeat, faAmbulance, faUserMd, faSyringe, faTooth } from "@fortawesome/free-solid-svg-icons";

const serviceItems = [
  { icon: faVideo, title: "استشارة عن بعد", desc: "تكلم مع طبيبك أينما كنت عبر فيديو عالي الجودة", color: "from-[#138C9F] to-[#0e7a8c]" },
  { icon: faNotesMedical, title: "وصفات إلكترونية", desc: "استلم وصفاتك الطبية مباشرة على هاتفك", color: "from-emerald-400 to-emerald-500" },
  { icon: faPills, title: "تذكير بالأدوية", desc: "نظام ذكي يذكرك بمواعيد أدويتك اليومية", color: "from-violet-400 to-violet-500" },
  { icon: faHeartbeat, title: "متابعة صحية", desc: "سجل طبي متكامل ومتابعة لحالتك الصحية", color: "from-rose-400 to-rose-500" },
  { icon: faSyringe, title: "تحاليل وفحوصات", desc: "نتائج مختبر رقمية فورية في تطبيقك", color: "from-amber-400 to-amber-500" },
  { icon: faTooth, title: "طب الأسنان", desc: "حجز موعد مع أفضل أطباء الأسنان", color: "from-cyan-400 to-cyan-500" },
  { icon: faAmbulance, title: "طوارئ 24/7", desc: "خدمة إسعاف على مدار الساعة طوال الأسبوع", color: "from-red-400 to-red-500" },
  { icon: faUserMd, title: "تخصصات متعددة", desc: "أكثر من 15 تخصص طبي تحت سقف واحد", color: "from-indigo-400 to-indigo-500" },
];

function ServicesSlider() {
  const renderService = (service, index, isActive) => (
    <div className={`group bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 ${isActive ? "ring-2 ring-[#138C9F]/30 scale-[1.02]" : ""}`}>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}>
        <FontAwesomeIcon icon={service.icon} className="text-white text-xl" />
      </div>
      <h3 className="text-base md:text-lg font-black text-slate-900 mb-2">{service.title}</h3>
      <p className="text-sm text-slate-500 font-bold leading-relaxed">{service.desc}</p>
    </div>
  );

  return (
    <StickySlider
      title="خدماتنا"
      subtitle="كل ما تحتاجه في منصة واحدة"
      items={serviceItems}
      renderItem={renderService}
      pinHeight="400vh"
    />
  );
}

export default ServicesSlider;