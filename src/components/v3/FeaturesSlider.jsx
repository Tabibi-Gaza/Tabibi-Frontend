import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo, faCalendarCheck, faHeartbeat, faPrescriptionBottle,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    number: "01",
    icon: faVideo,
    title: "استشارة طبية عن بعد",
    desc: "تواصل مع طبيبك أينما كنت عبر مكالمات فيديو عالية الجودة. احصل على الاستشارة الطبية وأنت في منزلك.",
    accent: "#138C9F",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80",
  },
  {
    number: "02",
    icon: faCalendarCheck,
    title: "حجز مواعيد ذكي",
    desc: "ابحث عن أفضل الأطباء حسب التخصص والمنطقة، واحجز موعدك في ثوانٍ. نظام ذكي يقترح لك المواعيد المناسبة.",
    accent: "#10b981",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
  },
  {
    number: "03",
    icon: faHeartbeat,
    title: "ملفك الصحي المتكامل",
    desc: "سجل طبي شامل يتابع حالتك الصحية. تذكير بالأدوية، تقارير الفحوصات، ومتابعة دورية لحالتك.",
    accent: "#8b5cf6",
    image: "https://images.pexels.com/photos/8949860/pexels-photo-8949860.jpeg?w=800",
  },
  {
    number: "04",
    icon: faPrescriptionBottle,
    title: "وصفات إلكترونية آمنة",
    desc: "استلم وصفاتك الطبية مباشرة على هاتفك. وصفات رقمية معتمدة ترسل لأقرب صيدلية تختارها.",
    accent: "#f59e0b",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
  },
];

const TOTAL = features.length;
const DURATION = 6000;

function FeaturesSlider() {
  const startRef = useRef(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf;
    const tick = (now) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      setTime((elapsed / DURATION) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const goTo = (i) => {
    startRef.current = performance.now() - i * DURATION;
  };

  const rawProgress = time;
  const currentIndex = Math.min(TOTAL - 1, Math.max(0, Math.floor(rawProgress)));
  const slideFrac = rawProgress - currentIndex;
  const textIndex = Math.round(rawProgress) % TOTAL;
  const current = features[currentIndex];
  const next = features[(currentIndex + 1) % TOTAL];
  const textFeature = features[textIndex];

  return (
    <section className="relative bg-white min-h-screen flex flex-col items-center justify-center py-16 md:py-24" dir="rtl">
      <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20 px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Text */}
        <div className="w-full md:w-1/2 text-center md:text-right" key={textIndex}>
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black select-none leading-none block mb-1" style={{ color: `${textFeature.accent}15` }}>
            {textFeature.number}
          </span>
          <span className="text-[10px] sm:text-xs font-black tracking-widest mb-2 inline-block" style={{ color: textFeature.accent }}>
            {textFeature.title.split(" ")[0]}
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 mb-3 md:mb-4 font-['Cairo'] leading-tight">
            {textFeature.title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed font-bold font-['Cairo']">
            {textFeature.desc}
          </p>
        </div>

        {/* Image */}
        <div className="shrink-0 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] relative">
          {/* Border ring */}
          <div className="absolute rounded-2xl border-2" style={{ inset: '3px', borderColor: `${current.accent}40` }} />

          {/* Current image */}
          <div className="absolute inset-2" style={{ clipPath: "circle(100%)" }}>
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img src={current.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${current.accent}20 0%, transparent 100%)` }} />
            </div>
          </div>

          {/* Next image - circle reveal */}
          <div
            className="absolute inset-2 z-10"
            style={{ clipPath: `circle(${slideFrac * 100}%)` }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img src={next.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${next.accent}20 0%, transparent 100%)` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2 md:gap-3 z-20 mt-10 md:mt-14">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${i === currentIndex ? "w-6 md:w-8" : "w-2 md:w-2.5 hover:opacity-80"}`}
            style={{ backgroundColor: i === currentIndex ? textFeature.accent : "rgba(0,0,0,0.15)" }}
            aria-label={`الانتقال للميزة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSlider;
