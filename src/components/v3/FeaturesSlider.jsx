import React, { useState, useRef, useEffect } from "react";
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
    image: "/images/features/feature-1.jpg",
  },
  {
    number: "02",
    icon: faCalendarCheck,
    title: "حجز مواعيد ذكي",
    desc: "ابحث عن أفضل الأطباء حسب التخصص والمنطقة، واحجز موعدك في ثوانٍ. نظام ذكي يقترح لك المواعيد المناسبة.",
    accent: "#10b981",
    image: "/images/features/feature-2.jpg",
  },
  {
    number: "03",
    icon: faHeartbeat,
    title: "ملفك الصحي المتكامل",
    desc: "سجل طبي شامل يتابع حالتك الصحية. تذكير بالأدوية، تقارير الفحوصات، ومتابعة دورية لحالتك.",
    accent: "#8b5cf6",
    image: "/images/features/feature-3.jpg",
  },
  {
    number: "04",
    icon: faPrescriptionBottle,
    title: "وصفات إلكترونية آمنة",
    desc: "استلم وصفاتك الطبية مباشرة على هاتفك. وصفات رقمية معتمدة ترسل لأقرب صيدلية تختارها.",
    accent: "#f59e0b",
    image: "/images/features/feature-4.jpg",
  },
];

const TOTAL = features.length;
const SLIDE_DURATION = 6000;

function FeaturesSlider() {
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const [state, setState] = useState({ progress: 0, currentIndex: 0 });

  useEffect(() => {
    const animate = (timestamp) => {
      startTimeRef.current ??= timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawIndex = elapsed / SLIDE_DURATION;
      const currentIndex = Math.floor(rawIndex) % TOTAL;
      const progress = rawIndex - Math.floor(rawIndex);

      setState({
        progress,
        currentIndex: currentIndex % TOTAL,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const jumpTo = (index) => {
    startTimeRef.current = performance.now() - index * SLIDE_DURATION;
  };

  const { progress, currentIndex } = state;
  const current = features[currentIndex];
  const next = features[(currentIndex + 1) % TOTAL];

  return (
    <section className="relative bg-white min-h-screen flex flex-col items-center justify-center py-16 md:py-24" dir="rtl">
      <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20 px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Text Side */}
        <div className="w-full md:w-1/2 text-center md:text-right">
          <span
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black select-none leading-none block mb-1"
            style={{ color: `${current.accent}15` }}
          >
            {current.number}
          </span>
          <span
            className="text-[10px] sm:text-xs font-black tracking-widest mb-2 inline-block"
            style={{ color: current.accent }}
          >
            {current.title.split(" ")[0]}
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 mb-3 md:mb-4 leading-tight">
            {current.title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed font-bold">
            {current.desc}
          </p>
        </div>

        {/* Image Side */}
        <div className="shrink-0 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] relative">
          {/* Decorative Frame Border */}
          <div
            className="absolute rounded-2xl border-2"
            style={{ inset: "3px", borderColor: `${current.accent}40` }}
          />

          {/* Current Image - Full Circle */}
          <div className="absolute inset-2" style={{ clipPath: "circle(100%)" }}>
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src={current.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${current.accent}20 0%, transparent 100%)` }}
              />
            </div>
          </div>

          {/* Next Image - Animated Circle Reveal */}
          <div
            className="absolute inset-2 z-10"
            style={{ clipPath: `circle(${progress * 100}%)` }}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src={next.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${next.accent}20 0%, transparent 100%)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex items-center gap-2 md:gap-3 z-20 mt-10 md:mt-14">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            className={`h-2 md:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === currentIndex ? "w-6 md:w-8" : "w-2 md:w-2.5 hover:opacity-80"
            }`}
            style={{
              backgroundColor: i === currentIndex ? current.accent : "rgba(0,0,0,0.15)",
            }}
            aria-label={`اضغط للانتقال إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSlider;
