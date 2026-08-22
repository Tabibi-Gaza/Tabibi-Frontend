import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const slideProgress = (elapsed % SLIDE_DURATION) / SLIDE_DURATION;

    if (elapsed >= SLIDE_DURATION) {
      const cycles = Math.floor(elapsed / SLIDE_DURATION);
      const newIndex = cycles % TOTAL;
      setCurrentIndex(newIndex);
      setNextIndex((newIndex + 1) % TOTAL);
      startTimeRef.current = timestamp;
      setProgress(0);
    } else {
      setProgress(slideProgress * 100);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const jumpTo = (index) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCurrentIndex(index);
    setNextIndex((index + 1) % TOTAL);
    startTimeRef.current = null;
    setProgress(0);
    rafRef.current = requestAnimationFrame(animate);
  };

  const current = features[currentIndex];
  const next = features[nextIndex];

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
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 mb-3 md:mb-4 font-['Cairo'] leading-tight">
            {current.title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed font-bold font-['Cairo']">
            {current.desc}
          </p>
        </div>

        {/* Image Side */}
        <div className="shrink-0 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] relative overflow-hidden rounded-2xl shadow-xl">
          {/* Decorative border frame */}
          <div
            className="absolute rounded-2xl border-2 pointer-events-none"
            style={{
              inset: "3px",
              borderColor: `${current.accent}40`,
            }}
          />

          {/* Current slide */}
          <div
            className="absolute inset-2 rounded-2xl overflow-hidden"
            style={{ clipPath: "circle(100%)" }}
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover hero-ken-burns"
              width="480"
              height="480"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${current.accent}20 0%, transparent 100%)` }}
            />
          </div>

          {/* Next slide reveal */}
          <div
            className="absolute inset-2 rounded-2xl overflow-hidden z-10"
            style={{ clipPath: `circle(${progress}%)` }}
          >
            <img
              src={next.image}
              alt={next.title}
              className="w-full h-full object-cover hero-ken-burns"
              width="480"
              height="480"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${next.accent}20 0%, transparent 100%)` }}
            />
          </div>
        </div>
      </div>

      {/* Dot navigation */}
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
            aria-label={`الانتقال للميزة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturesSlider;
