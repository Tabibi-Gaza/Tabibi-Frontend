import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpecializations } from "../../hooks/specializations/useSpecializations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faAngleDown, faGlobe } from "@fortawesome/free-solid-svg-icons";

function FramesSection() {
  const videoRef = useRef(null);
<<<<<<< HEAD
  const [videoLoaded, setVideoLoaded] = useState(false);
=======
>>>>>>> 0e79510 (feat: replace 342 frames with video + fix lookup API + auth guards)
  const [speciality, setSpeciality] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { data: specs, isLoading } = useSpecializations();

  const options = specs?.map((s) => ({ id: s.id, label: s.name })) || [];
  const selected = options.find((o) => o.id === speciality);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(speciality ? `/doctors/${speciality}` : "/doctors");
  };

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleCanPlay = () => setVideoLoaded(true);
    v.addEventListener("canplay", handleCanPlay);
    return () => v.removeEventListener("canplay", handleCanPlay);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0d1b2a]" dir="rtl">
      <img
        src="/frames/frame_0050.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover hero-ken-burns"
        loading="eager"
        fetchPriority="high"
      />
=======
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black" dir="rtl">
>>>>>>> 0e79510 (feat: replace 342 frames with video + fix lookup API + auth guards)
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
<<<<<<< HEAD
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <source src="/hero-bg.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#138C9F]/40 via-[#138C9F]/20 to-[#0d6b7a]/60" />
=======
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/hero-bg.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#138C9F]/50 via-[#138C9F]/30 to-[#138C9F]/70" />
>>>>>>> 0e79510 (feat: replace 342 frames with video + fix lookup API + auth guards)

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl text-center mb-8 md:mb-10">
          <span className="text-white/60 text-xs sm:text-sm font-bold tracking-widest block mb-4 font-['Cairo'] drop-shadow">
            — منصة طبيبي للخدمات الصحية —
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-['Cairo'] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            رحلة صحتك تبدأ
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-[#b3e5e8] font-bold mt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] font-['Cairo']">
            من هنا — أحدث التقنيات وأمهر الأطباء
          </p>
        </div>

        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.25)] rounded-2xl p-2.5 sm:p-3 border border-white/20">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
            <div className="w-full flex-1 relative" ref={dropdownRef}>
              <div
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                className={`w-full text-slate-900 text-sm md:text-base px-5 py-3 md:py-3.5 rounded-xl md:rounded-full cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  isOpen ? "bg-slate-50" : "bg-transparent hover:bg-slate-50/50"
                } ${isLoading ? "opacity-60 cursor-wait" : ""}`}
              >
                <div className="flex items-center gap-3 select-none overflow-hidden">
                  <FontAwesomeIcon icon={faSearch} className="text-[#138C9F] text-lg shrink-0" />
                  <span className={`font-extrabold text-right tracking-wide text-xs sm:text-sm md:text-base truncate font-['Cairo'] ${
                    speciality ? "text-slate-900" : "text-slate-400"
                  }`}>
                    {isLoading ? "جاري تحميل التخصصات..." : selected?.label || "ابحث عن تخصص الطبيب المطلوب..."}
                  </span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-xs mr-2 shrink-0 transition-transform duration-300 text-slate-400 ${isOpen ? "rotate-180 text-[#138C9F]" : ""}`} />
              </div>

              {isOpen && (
                <div className="absolute top-[115%] left-0 right-0 bg-white border border-slate-100 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-72 overflow-y-auto">
                  <div onClick={() => { setSpeciality(""); setIsOpen(false); }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-bold text-xs md:text-sm transition-all select-none sm:col-span-2 font-['Cairo'] ${
                      speciality === "" ? "bg-slate-100 text-slate-900 font-black" : "text-slate-500 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-2.5">
                      <FontAwesomeIcon icon={faGlobe} className="text-base text-slate-500" />
                      <span>جميع التخصصات الطبية</span>
                    </div>
                    {speciality === "" && <span className="text-slate-900 font-black text-xs ml-1">✓</span>}
                  </div>
                  {options.map((opt) => (
                    <div key={opt.id} onClick={() => { setSpeciality(opt.id); setIsOpen(false); }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-bold text-xs md:text-sm transition-all select-none font-['Cairo'] ${
                        speciality === opt.id ? "bg-[#138C9F] text-white" : "text-slate-700 hover:bg-slate-50 hover:text-[#138C9F]"
                      }`}>
                      <span className="font-extrabold truncate">{opt.label}</span>
                      {speciality === opt.id && <span className="text-white font-black text-xs ml-1 shrink-0">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full md:w-auto bg-[#138C9F] text-white font-black text-sm md:text-base px-10 py-3.5 rounded-xl md:rounded-full hover:bg-[#0f7282] hover:shadow-lg hover:shadow-[#138C9F]/20 transition-all duration-200 active:scale-[0.98] whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer font-['Cairo']">
              بحث سريع
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full max-w-xs px-4">
        <FontAwesomeIcon icon={faAngleDown} className="text-white/40 text-lg animate-bounce" />
      </div>
    </section>
  );
}

export default FramesSection;
