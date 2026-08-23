import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useSpecializations } from "../hooks/specializations/useSpecializations"; // استدعاء هوك التخصصات الجديد

// استيراد Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faUserMd,
  faBaby,
  faBrain,
  faBabyCarriage,
  faSearch,
  faChevronDown,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const navigate = useNavigate();
  const [speciality, setSpeciality] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // جلب البيانات من الـ API عبر الـ Hook الخاص بك
  const { data: serverSpecializations, isLoading } = useSpecializations();

  // تحويل البيانات القادمة من السيرفر للهيكل المطلوب داخل الكومبوننت
  // افترضنا أن السيرفر يعيد id و name (أو يمكنك تعديل المسميات حسب الـ API لديك)
  const options =
    serverSpecializations?.map((spec) => ({
      id: spec.id, // استخدمنا spec.name ليتوافق مع الـ Filter الحالي في صفحة الأطباء بناءً على طلبك السابق
      label: spec.name,
    })) || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (speciality) {
      navigate(`/doctors/${speciality}`);
    } else {
      navigate("/doctors");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        boxIsOpen(false);
      }
    };
    const boxIsOpen = (val) => setIsOpen(val);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === speciality);

  return (
    <div
      className="relative w-full  overflow-visible bg-cover bg-center bg-no-repeat pb-12 sm:pb-18 md:pb-26 lg:pb-34 pt-50 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center border border-gray-100 shadow-sm mb-16"
      style={{
        backgroundImage: `url(${assets.header_img})`,
      }}
      dir="rtl"
    >
      {/* حاوية الصندوق الزجاجي */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6 md:gap-8 z-20 bg-white/40 backdrop-blur-md p-4 sm:p-10 rounded-2xl md:rounded-3xl border border-white/40 shadow-lg animate-fadeIn">
        <h1 className='text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug select-none font-["Tajawal"] px-2'>
          رعاية طبية متميزة وخدمات صحية موثوقة لجميع أفراد الأسرة.
        </h1>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-white p-2 md:p-1.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-3 md:gap-2 shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 relative z-30"
        >
          <div className="w-full flex-1 relative" ref={dropdownRef}>
            <div
              onClick={() => !isLoading && setIsOpen(!isOpen)}
              className={`w-full text-slate-900 text-sm md:text-base px-4 sm:px-5 py-3 md:py-2.5 rounded-xl md:rounded-full cursor-pointer flex items-center justify-between transition-all duration-200
                ${isOpen ? "bg-slate-50" : "bg-transparent hover:bg-slate-50/50"} ${isLoading ? "opacity-60 cursor-wait" : ""}`}
            >
              <div className="flex items-center gap-3 select-none overflow-hidden">
                <span className="text-lg text-[#138C9F] shrink-0 flex items-center justify-center">
                  {selectedOption ? (
                    <FontAwesomeIcon icon={selectedOption.icon} />
                  ) : (
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-slate-400"
                    />
                  )}
                </span>
                <span
                  className={`font-extrabold font-["Tajawal"] text-right tracking-wide text-xs sm:text-sm md:text-base truncate ${speciality ? "text-slate-900" : "text-slate-400"}`}
                >
                  {isLoading
                    ? "جاري تحميل التخصصات..."
                    : selectedOption?.label || "ابحث عن تخصص الطبيب المطلوب..."}
                </span>
              </div>

              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-xs mr-2 shrink-0 transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180 text-[#138C9F]" : ""}`}
              />
            </div>

            {isOpen && (
              <div className="absolute top-[115%] left-0 right-0 bg-white border border-slate-100 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-50 grid grid-cols-1 sm:grid-cols-2 gap-1 animate-fadeIn max-h-72 overflow-y-auto">
                <div
                  onClick={() => {
                    setSpeciality("");
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-bold text-xs md:text-sm transition-all duration-150 select-none border border-transparent sm:col-span-2
                    ${
                      speciality === ""
                        ? "bg-slate-100 text-slate-900 font-black"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="text-base text-slate-500"
                    />
                    <span className="tracking-tight whitespace-nowrap">
                      جميع التخصصات الطبية
                    </span>
                  </div>
                  {speciality === "" && (
                    <span className="text-slate-900 font-black text-xs ml-1">
                      ✓
                    </span>
                  )}
                </div>

                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setSpeciality(option.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-bold text-xs md:text-sm transition-all duration-150 select-none border border-transparent
                      ${
                        speciality === option.id
                          ? "bg-[#138C9F] text-white"
                          : "text-slate-700 hover:bg-slate-50 hover:text-[#138C9F]"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FontAwesomeIcon
                        icon={option.icon}
                        className={`text-base shrink-0 ${speciality === option.id ? "text-white" : "text-[#138C9F]"}`}
                      />
                      <span className="font-extrabold tracking-tight truncate">
                        {option.label}
                      </span>
                    </div>

                    {speciality === option.id && (
                      <span className="text-white font-black text-xs ml-1 shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-[#138C9F] text-white font-extrabold text-sm md:text-base px-6 sm:px-9 py-3 rounded-xl md:rounded-full hover:bg-[#0f7282] hover:shadow-md transition-all duration-200 active:scale-[0.98] whitespace-nowrap shadow-sm shrink-0 disabled:opacity-50"
          >
            بحث سريع
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
