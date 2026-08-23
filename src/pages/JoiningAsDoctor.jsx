import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
const JoiningAsDoctor = () => {
    const navigate = useNavigate();

    // المزايا الأربعة الظاهرة في الصورة
    const features = [
        "توسيع نطاق وصولك للمرضى",
        "إدارة سهلة ومؤتمتة للمواعيد",
        "بناء سمعة رقمية احترافية",
        "تقارير وتحليلات ذكية لأدائك"
    ];

    return (
      <section
        className="relative  bg-[#118fa6]  mx-2 sm:mx-4 md:mx-6 lg:mx-8 text-white py-12 md:py-30 px-6 md:px-16 overflow-hidden rounded-4xl font-['Tajawal']"
        dir="rtl"
      >
        {/* الخلفية المائية الخفيفة (أيقونة البطاقة الطبية المدمجة أسفل اليسار كعلامة مائية) */}
        <div className="absolute bottom-[-20px] right-4 md:right-12 w-48 h-48 opacity-10 pointer-events-none select-none">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <FontAwesomeIcon
              icon={faCheck}
              className="w-3.5 h-3.5 text-white stroke-[2]"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* الجانب الأيمن: النصوص والمزايا */}
          <div className="w-full md:w-2/3 text-right">
            <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight tracking-wide">
              هل أنت طبيب؟ انضم إلى عائلتنا
            </h2>
            <p className="text-sm md:text-base text-cyan-50/90 max-w-2xl mb-8 leading-relaxed font-medium">
              كن جزءاً من أكبر شبكة طبية وساهم في تقديم رعاية صحية متميزة للمرضى
              عبر منصة رقمية متطورة تمنحك الأدوات اللازمة للنجاح.
            </p>

            {/* شبكة المزايا المكونة من صفين وعمودين */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-2xl">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-3"
                >
                  {/* أيقونة الصح (Checkmark) داخل مربع بخلفية دائرية خفيفة متناسقة */}
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
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
              className="w-full sm:w-auto bg-white text-[#118fa6] font-extrabold text-lg px-8 py-4 rounded-xl shadow-md hover:bg-cyan-50 transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              {" "}
              <span>سجل كطبيب الآن</span>
              {/* سهم يتجه لليسار يظهر في الزر ويتفاعل عند التحويم */}
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="transition-transform group-hover:-translate-x-1 text-lg"
              />
            </button>
          </div>
        </div>
      </section>
    );
};

export default JoiningAsDoctor;