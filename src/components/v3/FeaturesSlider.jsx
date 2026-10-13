import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo, faCalendarCheck, faHeartbeat, faPrescriptionBottle,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    number: "01",
    icon: faVideo,
    title: "استشارة طبية عن بعد",
    titleEn: "Remote medical consultation",
    desc: "تواصل مع طبيبك أينما كنت عبر مكالمات فيديو عالية الجودة. احصل على الاستشارة الطبية وأنت في منزلك.",
    descEn: "Connect with your doctor from anywhere through high-quality video calls. Get your medical consultation while staying at home.",
    accent: "#138C9F",
    image: "/images/features/feature-1.webp",
  },
  {
    number: "02",
    icon: faCalendarCheck,
    title: "حجز مواعيد ذكي",
    titleEn: "Smart appointment booking",
    desc: "ابحث عن أفضل الأطباء حسب التخصص والمنطقة، واحجز موعدك في ثوانٍ. نظام ذكي يقترح لك المواعيد المناسبة.",
    descEn: "Find the best doctors by specialty and area, and book in seconds. A smart system that suggests the right slots for you.",
    accent: "#10b981",
    image: "/images/features/feature-2.webp",
  },
  {
    number: "03",
    icon: faHeartbeat,
    title: "ملفك الصحي المتكامل",
    titleEn: "Your complete health file",
    desc: "سجل طبي شامل يتابع حالتك الصحية. تذكير بالأدوية، تقارير الفحوصات، ومتابعة دورية لحالتك.",
    descEn: "A comprehensive medical record that follows your health: medication reminders, test reports, and periodic follow-up.",
    accent: "#8b5cf6",
    image: "/images/features/feature-3.webp",
  },
  {
    number: "04",
    icon: faPrescriptionBottle,
    title: "وصفات إلكترونية آمنة",
    titleEn: "Secure e-prescriptions",
    desc: "استلم وصفاتك الطبية مباشرة على هاتفك. وصفات رقمية معتمدة ترسل لأقرب صيدلية تختارها.",
    descEn: "Receive your prescriptions directly on your phone. Certified digital prescriptions sent to the pharmacy you choose.",
    accent: "#f59e0b",
    image: "/images/features/feature-4.webp",
  },
];

const TOTAL = features.length;
const SLIDE_DURATION = 6000;

function FeaturesSlider() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
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
    <section className="relative bg-white dark:bg-gray-800 min-h-screen flex flex-col items-center justify-center py-16 md:py-24" dir={isEn ? "ltr" : "rtl"}>
      <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-20 px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Text Side */}
        <div className="w-full md:w-1/2 text-center md:text-start">
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
            {(isEn ? current.titleEn : current.title).split(" ")[0]}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 leading-tight">
            {isEn ? current.titleEn : current.title}
          </h2>
          <p className="text-slate-500 dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-bold">
            {isEn ? current.descEn : current.desc}
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
                loading="lazy"
                decoding="async"
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
                loading="lazy"
                decoding="async"
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
            type="button"
            onClick={() => jumpTo(i)}
            className="relative flex items-center justify-center px-3 py-3 -mx-2 -my-2 md:-mx-2.5 md:-my-2.5 cursor-pointer"
            aria-label={isEn ? `Go to slide ${i + 1}` : `اضغط للانتقال إلى الشريحة ${i + 1}`}
          >
            <span
              className={`block h-2 md:h-2.5 rounded-full transition-all duration-500 bg-black/15 dark:bg-white/30 ${
                i === currentIndex ? "w-6 md:w-8" : "w-2 md:w-2.5 hover:opacity-80"
              }`}
              style={i === currentIndex ? { backgroundColor: current.accent } : undefined}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSlider;
