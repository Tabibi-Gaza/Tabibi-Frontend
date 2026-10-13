import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
const JoiningAsDoctor = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const isEn = i18n.language === "en";

    const L = isEn ? {
        title: "Are you a doctor? Join our family",
        sub: "Be part of the largest medical network and help deliver outstanding patient care through a modern digital platform with all the tools you need to succeed.",
        features: [
            "Expand your reach to more patients",
            "Easy, automated appointment management",
            "Build a professional digital reputation",
            "Smart reports and analytics on your performance",
        ],
        cta: "Register as a doctor now",
    } : {
        title: "هل أنت طبيب؟ انضم إلى عائلتنا",
        sub: "كن جزءاً من أكبر شبكة طبية وساهم في تقديم رعاية صحية متميزة للمرضى عبر منصة رقمية متطورة تمنحك الأدوات اللازمة للنجاح.",
        features: [
            "توسيع نطاق وصولك للمرضى",
            "إدارة سهلة ومؤتمتة للمواعيد",
            "بناء سمعة رقمية احترافية",
            "تقارير وتحليلات ذكية لأدائك",
        ],
        cta: "سجل كطبيب الآن",
    };

    return (
      <section
        className="relative  bg-[#118fa6]  mx-2 sm:mx-4 md:mx-6 lg:mx-8 text-white py-12 md:py-30 px-6 md:px-16 overflow-hidden rounded-4xl"
        dir={isEn ? "ltr" : "rtl"}
      >
        {/* الخلفية المائية الخفيفة (أيقونة البطاقة الطبية المدمجة أسفل اليسار كعلامة مائية) */}
        <div className="absolute bottom-[-20px] end-4 md:end-12 w-48 h-48 opacity-10 pointer-events-none select-none">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800/15 flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faCheck}
              className="w-3.5 h-3.5 text-white stroke-[2]"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* الجانب الأيمن: النصوص والمزايا */}
          <div className="w-full md:w-2/3 text-start">
            <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-wide">
              {L.title}
            </h2>
            <p className="text-sm md:text-base text-cyan-50/90 max-w-2xl mb-8 leading-relaxed font-medium">
              {L.sub}
            </p>

            {/* شبكة المزايا المكونة من صفين وعمودين */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-2xl">
              {L.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-3"
                >
                  {/* أيقونة الصح (Checkmark) داخل مربع بخلفية دائرية خفيفة متناسقة */}
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 stroke-white stroke-[3] fill-none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-base md:text-lg font-bold text-white">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* الجانب الأيسر: زر الانتقال لصفحة التسجيل */}
          <div className="w-full md:w-1/3 flex justify-start md:justify-end items-center">
            <button
              onClick={() => {
                const user = JSON.parse(localStorage.getItem("user") || "null");
                if (!user) {
                  navigate("/login");
                } else {
                  navigate("/register-doctor");
                }
              }}
              className="w-full sm:w-auto bg-white dark:bg-gray-800 text-[#118fa6] font-extrabold text-lg px-8 py-4 rounded-xl shadow-md hover:bg-cyan-50 transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              {" "}
              <span>{L.cta}</span>
              {/* سهم يتجه للاتجاه الأمامي وتفاعل عند التحويم */}
              <FontAwesomeIcon
                icon={isEn ? faArrowRight : faArrowLeft}
                className={`transition-transform text-lg ${isEn ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"}`}
              />
            </button>
          </div>
        </div>
      </section>
    );
};

export default JoiningAsDoctor;