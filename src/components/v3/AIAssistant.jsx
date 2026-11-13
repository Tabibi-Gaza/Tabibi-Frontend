import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";
import axiosInstance from "../../api/axiosInstance";
import { resolveImageUrl } from "../../utils/imageUrl";

const SORT_OPTIONS = [
  { key: "rating", ar: "الأعلى تقييماً", en: "Top rated" },
  { key: "price", ar: "السعر", en: "Price" },
  { key: "location", ar: "الأقرب", en: "Nearest" },
  { key: "availability", ar: "التوفر", en: "Availability" },
];

const AIAssistant = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const { userData } = useContext(AppContext);
  const patientLocation = userData?.address?.line1 || "";

  const [messages, setMessages] = useState(() =>
    isEn
      ? [
          { type: "bot", text: "Hello! I'm your smart medical assistant 🩺" },
          { type: "bot", text: "Tell me your symptoms in any way you like — \u201cmy eye hurts\u201d, \u201cheadache since yesterday\u201d. I'll understand and guide you." },
        ]
      : [
          { type: "bot", text: "مرحباً! أنا مساعد طبي ذكي 🩺" },
          { type: "bot", text: "أخبرني عن أعراضك بأي لهجة وأنا فاهم — «عيني بتوجعني»، «راسي بوجعني من مبارح». سأحلل وأرشحك للتخصص الصحيح." },
        ]
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const chatContainerRef = useRef(null);

  const L = isEn ? {
    badge: "Smart medical assistant",
    h1: "Enter your symptoms",
    h2: "and we'll guide you",
    h3: "to the right",
    h4: "medical specialty",
    intro: "Our smart assistant understands your symptoms, asks the right questions, and finds real verified doctors in our platform.",
    typing: "Analyzing your symptoms...",
    placeholder: "Type your symptoms... (e.g. my eye hurts)",
    send: "Send",
    emptyResult: "Your analysis will appear",
    emptyResult2: "here after you describe your symptoms",
    recommended: "Recommended specialty",
    unavailable: "Not available in the platform yet",
    bookNow: "Book an appointment now",
    reset: "Start over",
    searching: "Searching for available doctors...",
    doctorsAvailable: "Available doctors",
    doctorsIn: (loc) => `Doctors available in ${loc}`,
    bookBtn: "Book now",
    noDoctors: "No available doctors right now",
    viewAll: "View all doctors",
    emergency: "Possible emergency",
    callAmbulance: "Call emergency services (101)",
    error: "Something went wrong. Please try again.",
    symptomsDetected: "Detected symptoms",
    unavailableNote: "This specialty doesn't exist in the platform — your safest first step is a general physician.",
  } : {
    badge: "مساعد طبي ذكي",
    h1: "أدخل أعراضك",
    h2: "وسأحللها",
    h3: "وأوجّهك",
    h4: "للتخصص الصحيح",
    intro: "مساعدنا الذكي يفهم أعراضك بالعربي وللهجات المختلفة، يسألك الأسئلة الصح، ويلاقي لك أطباء حقيقيين معتمدين بالمنصة.",
    typing: "يُحلّل أعراضك...",
    placeholder: "اكتب أعراضك بأي لهجة... (مثال: عيني بتوجعني)",
    send: "أرسل",
    emptyResult: "سيظهر التحليل",
    emptyResult2: "هنا بعد وصف الأعراض",
    recommended: "التخصص الموصى به",
    unavailable: "غير متوفر حالياً بالمنصة",
    bookNow: "احجز موعد الآن",
    reset: "إعادة التحديد",
    searching: "جاري البحث عن أطباء متاحين...",
    doctorsAvailable: "أطباء متوفرون",
    doctorsIn: (loc) => `أطباء متوفرون في ${loc}`,
    bookBtn: "احجز الآن",
    noDoctors: "لم نجد أطباء متوفرين حالياً",
    viewAll: "عرض جميع الأطباء",
    emergency: "قد تكون حالة طارئة",
    callAmbulance: "اتصل بالإسعاف (101)",
    error: "صار خلل، حاول مرة تانية.",
    symptomsDetected: "الأعراض المثبتة",
    unavailableNote: "هذا التخصص غير موجود بالمنصة — خطوتك الأكثر أماناً هي طبيب عام.",
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const chosenSpecialtyId = (() => {
    const list = analysis?.suggestedSpecialties || [];
    const available = list.find((s) => s.availableInPlatform && s.specialtyId);
    return available ? available.specialtyId : null;
  })();

  const fetchDoctors = async (specialtyId, sort) => {
    if (!specialtyId) return;
    setDoctorsLoading(true);
    try {
      const { data } = await axiosInstance.get("/medical-assistant/doctors", {
        params: { specialtyId, location: patientLocation, sortBy: sort, take: 5 },
      });
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setIsTyping(true);
    setAnalysis(null);
    setDoctors([]);

    try {
      const { data } = await axiosInstance.post("/medical-assistant/analyze", {
        message: text,
        location: patientLocation,
        language: isEn ? "en" : "ar",
      });

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data?.patientFriendlyResponse || L.error,
          emergency: Boolean(data?.needsEmergencyCare),
        },
      ]);
      setAnalysis(data || null);

      const available = (data?.suggestedSpecialties || []).find((s) => s.availableInPlatform && s.specialtyId);
      if (available) {
        fetchDoctors(available.specialtyId, sortBy);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: L.error }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSortChange = (key) => {
    setSortBy(key);
    if (chosenSpecialtyId) fetchDoctors(chosenSpecialtyId, key);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBook = () => {
    if (doctors.length > 0) {
      const user = localStorage.getItem("user");
      if (!user) { navigate("/login"); return; }
      navigate(`/appointment/${doctors[0].id}`);
    } else if (chosenSpecialtyId) {
      navigate(`/doctors`);
    }
  };

  const handleReset = () => {
    setMessages(isEn
      ? [{ type: "bot", text: "Hello! I'm your smart medical assistant 🩺" },
         { type: "bot", text: "Tell me your symptoms in any way you like." }]
      : [{ type: "bot", text: "مرحباً! أنا مساعد طبي ذكي 🩺" },
         { type: "bot", text: "أخبرني عن أعراضك بأي لهجة وأنا فاهم." }]);
    setAnalysis(null);
    setDoctors([]);
    setInput("");
    setSortBy("rating");
  };

  const presentSymptoms = (analysis?.symptoms || []).filter((s) => s.status === "Present");
  const absentSymptoms = (analysis?.symptoms || []).filter((s) => s.status === "Absent");
  const specialties = analysis?.suggestedSpecialties || [];
  const availableSpecialties = specialties.filter((s) => s.availableInPlatform);
  const unavailableSpecialties = specialties.filter((s) => !s.availableInPlatform);
  const isEmergency = Boolean(analysis?.needsEmergencyCare);

  return (
    <div className="relative py-16 px-4 dark:bg-gray-900" dir={isEn ? "ltr" : "rtl"}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0B1437] dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Right Side - Chat */}
            <div className="p-5 sm:p-8 lg:p-12 flex flex-col min-h-[420px] sm:min-h-[500px]">
              <div className="flex justify-end mb-6">
                <span className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-lg">🩺</span> {L.badge}
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {L.h1}
                <br />
                {L.h2}
                <br />
                <span className="text-[#4FC3F7]">{L.h3}</span>
                <br />
                <span className="text-[#4FC3F7]">{L.h4}</span>
              </h2>

              <p className="text-slate-300 text-sm font-medium mb-6 max-w-md">
                {L.intro}
              </p>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[250px] pe-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium whitespace-pre-line ${
                      msg.type === "user"
                        ? "bg-[#138C9F] text-white rounded-bl-sm"
                        : msg.emergency
                          ? "bg-red-500/20 border border-red-500/50 text-red-100 rounded-br-sm"
                          : "bg-white/10 text-white rounded-br-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm">
                      <span className="animate-pulse">{L.typing}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 min-w-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={L.placeholder}
                  className="flex-1 min-w-0 bg-white/10 text-white placeholder-slate-400 text-sm font-medium px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold px-4 sm:px-6 py-3 rounded-xl transition-all text-sm cursor-pointer disabled:opacity-40"
                >
                  {L.send}
                </button>
              </div>
            </div>

            {/* Left Side - Result */}
            <div className="bg-[#0a1030] dark:bg-gray-900 p-5 sm:p-8 lg:p-12 flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
              {!analysis ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">🩺</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    {L.emptyResult}
                    <br />
                    {L.emptyResult2}
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-md space-y-4">
                  {/* Emergency banner */}
                  {isEmergency && (
                    <div className="bg-red-500/20 border border-red-500/60 rounded-2xl p-4">
                      <p className="text-red-300 text-sm font-black mb-2">🚨 {L.emergency}</p>
                      <p className="text-red-200 text-xs leading-6 mb-3">{analysis.emergencyAdviceAr}</p>
                      <a href="tel:101" className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                        {L.callAmbulance}
                      </a>
                    </div>
                  )}

                  {/* Detected symptoms */}
                  {(presentSymptoms.length > 0 || absentSymptoms.length > 0) && (
                    <div className="bg-white/5 rounded-2xl p-3">
                      <p className="text-white/50 text-[10px] font-bold mb-2">{L.symptomsDetected}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {presentSymptoms.map((s) => (
                          <span key={s.code} className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">✓ {s.nameAr}</span>
                        ))}
                        {absentSymptoms.map((s) => (
                          <span key={s.code} className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-500/15 text-slate-300 border border-slate-500/30 line-through">✗ {s.nameAr}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended specialties */}
                  {availableSpecialties.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 shadow-xl">
                      <p className="text-xs text-[#138C9F] font-bold text-center mb-1">{L.recommended}</p>
                      <h3 className="text-lg font-black text-slate-800 dark:text-gray-200 text-center">
                        {availableSpecialties[0].name}
                      </h3>
                      {typeof availableSpecialties[0].confidence === "number" && (
                        <p className="text-center text-[#138C9F] text-[10px] font-bold mt-1">
                          {Math.round(availableSpecialties[0].confidence * 100)}%
                        </p>
                      )}
                      <button
                        onClick={handleBook}
                        className="mt-3 w-full bg-[#1a237e] hover:bg-[#0d1452] text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer"
                      >
                        {L.bookNow}
                      </button>
                      <button
                        onClick={handleReset}
                        className="mt-2 w-full text-slate-400 hover:text-slate-600 font-bold text-xs transition-all cursor-pointer"
                      >
                        {L.reset}
                      </button>
                    </div>
                  )}

                  {/* Unavailable specialty note */}
                  {unavailableSpecialties.length > 0 && !isEmergency && (
                    <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-3">
                      <p className="text-amber-300 text-[11px] font-bold">{L.unavailable}: {unavailableSpecialties.map((s) => s.name).join("، ")}</p>
                      <p className="text-amber-200/70 text-[10px] mt-1 leading-5">{L.unavailableNote}</p>
                    </div>
                  )}

                  {/* Sort controls */}
                  {chosenSpecialtyId && !isEmergency && (
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleSortChange(opt.key)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            sortBy === opt.key
                              ? "bg-[#138C9F] border-[#138C9F] text-white"
                              : "border-white/20 text-white/60 hover:text-white"
                          }`}
                        >
                          {isEn ? opt.en : opt.ar}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Doctors */}
                  {doctorsLoading && (
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <span className="text-white/60 text-sm animate-pulse">{L.searching}</span>
                    </div>
                  )}

                  {!doctorsLoading && doctors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs font-bold text-center">
                        {patientLocation ? L.doctorsIn(patientLocation) : L.doctorsAvailable}
                      </p>
                      {doctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white/10 hover:bg-white/15 rounded-xl p-3 flex items-center gap-3 transition-all dark:hover:bg-gray-700"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {doc.profileImageUrl ? (
                              <img loading="lazy" decoding="async" width="40" height="40" src={resolveImageUrl(doc.profileImageUrl)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-sm font-bold">{doc.fullName?.[0]}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold truncate">{doc.fullName}</p>
                            <p className="text-white/50 text-[10px] truncate">{doc.clinicAddress || doc.clinicName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {doc.availableToday && (
                                <span className="text-[9px] font-bold text-emerald-400">● {isEn ? "Available today" : "متاح اليوم"}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-left">
                              <p className="text-[#4FC3F7] text-xs font-bold">{doc.sessionPrice} ₪</p>
                              {doc.averageRating > 0 && (
                                <p className="text-yellow-400 text-[10px]">★ {doc.averageRating} ({doc.totalReviews})</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const user = localStorage.getItem("user");
                                if (!user) { navigate("/login"); return; }
                                navigate(`/appointment/${doc.id}`);
                                window.scrollTo(0, 0);
                              }}
                              className="bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
                            >
                              {L.bookBtn}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!doctorsLoading && doctors.length === 0 && chosenSpecialtyId && (
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <p className="text-white/40 text-xs">{L.noDoctors}</p>
                      <button
                        onClick={() => navigate("/doctors")}
                        className="mt-2 text-[#4FC3F7] text-xs font-bold hover:underline cursor-pointer"
                      >
                        {L.viewAll}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
