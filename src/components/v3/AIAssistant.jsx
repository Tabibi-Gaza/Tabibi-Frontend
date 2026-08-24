import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSpecializations } from "../../hooks/specializations/useSpecializations";
import { AppContext } from "../../context/AppContext";
import axiosInstance from "../../api/axiosInstance";
import { resolveImageUrl } from "../../utils/imageUrl";

const keywordMap = [
  { keywords: ["جلد", "بشرة", "حبوب", "احمرار", "حكة", "تساقط", "صدفية", "ندبات", "بشره", "طفح", "بثور", "رؤوس سودا", "حب شباب", "اكزيما", "حساسية جلد", "فطريات", "ثعلبة", "ورم جلدي", "تشقق", "جفاف جلد", "تحسس", "حروق", "كدمات", "تبييض", "تقشير", "ليزر", "تجميل"], specialty: "جلدية وتجميل", icon: "🩺" },
  { keywords: ["معدة", "بطن", "اسهال", "قيء", "حموضة", "امعاء", "هضم", "كرش", "قولون", "كبد", "غثيان", "ارتجاع", "قرحة", "انتفاخ", "غازات", "امساك", "دم في البراز", "الم في البطن", "الم معدة", "قولون عصبي", "تقلصات"], specialty: "جهاز هضمي", icon: "🏥" },
  { keywords: ["اطفال", "طفل", "رضاعة", "مواليد", "تطعيم", "رضيع", "طفلك", "ولدي", "ابني", "ابنتي", "طفلي", "بكاء طفل"], specialty: "طب الأطفال", icon: "👶" },
  { keywords: ["عام", "طبيب عام", "حمى", "حرارة", "تعب عام", "ارهاق", "دوخة", "تعب", "ضعف"], specialty: "طبيب عام", icon: "👨‍⚕️" },
  { keywords: ["صداع", "رأس", "نص راس", "صرع", "دوار", "اغمى", "خدر", "تنميل", "هزة", "شلل", "العصاب", "اعصاب", "الزهايمر", "خرف", "نسيان", "التهاب أعصاب", "خدر اليد", "خدر الرجل", "ارتعاش", "رعشة", "نوبات"], specialty: "طب المخ والأعصاب", icon: "🧠" },
  { keywords: ["نساء", "ولادة", "حامل", "فترة شهرية", "دورة شهرية", "الولادة", "فطام", "تأخر الحمل", "ألم الدورة", "نزول دم", "حكة نسائية"], specialty: "نسائية وتوليد", icon: "🤰" },
  { keywords: ["قلب", "ضغط", "نبض", "التهاب قلب", "الم صدر", "خفقان", "تسارع نبض", "احمرار", "شريان", "الدموية", "الوريد", "الشريان"], specialty: "أمراض القلب والأوعية الدموية", icon: "❤️" },
  { keywords: ["مفصل", "عظم", "ركبة", "ظهر", "عمود فقري", "عظام", "كسر", "التهاب مفاصل", "الم ظهر", "الم ركبة", "الم كتف", "الم صابع", "التهاب مفاصل", "روماتيزم", "انزلاق غضروفي"], specialty: "العظام والمفاصل", icon: "🦴" },
  { keywords: ["أسنان", "سن", "طقم", "خلع", "حشوة", "لثة", "جراحة فم", "اسنان", "ألم الأسنان", "تسوس", "التهاب اللثة", "تقويم", "ابيضاض الأسنان", "زراعة سن", "جراحة أسنان"], specialty: "طب وجراحة الأسنان", icon: "🦷" },
  { keywords: ["انف", "اذن", "حنجرة", "جيوب انفيه", "جيوب أنفيه", "صداع انفي", "لوزتين", "زكام", "انفلونزا", "الم الحلق", "الم اذن", "ضبابية الانف", "السمع", "الطنين"], specialty: "الأنف والأذن والحنجرة", icon: "👂" },
  { keywords: ["عين", "عينين", "نظر", "عدسة", "نظارة", "حول", "جفاف العين", "الم عين", "احمرار عين", "دمعة", "مياه بيضاء", "قلة النظر", "تصحيح نظر"], specialty: "طب وجراحة العيون", icon: "👁️" },
  { keywords: ["كلى", "بول", "حصوات", "مسالك", "الم كلى", "دم في البول", "المثانة", "البروستاتا", "عقم", "ضعف انتصاب"], specialty: "المسالك البولية والتناسلية", icon: "🫘" },
  { keywords: ["نفسي", "توتر", "قلق", "اكتئاب", "نوم", "ارق", "خوف", "هلاوس", "توتر نفسي", "ضغط نفسي", "حزن", "عصبية"], specialty: "الطب النفسي", icon: "🧠" },
  { keywords: ["علاج طبيعي", "تأهيل", "إعادة تأهيل", "تمارين", "تأخر مشي", "شلل نصفي", "بعد العملية", "بعد الجراحة", "إصابات رياضية", "تأهيل بعد اصابة"], specialty: "العلاج الطبيعي والتأهيل", icon: "🏋️" },
  { keywords: ["تغذية", "نظام غذائي", " dieta", "وزن", "سمنة", "نقص وزن", "فقر دم", "فيتامينات", " האמר", "تغذية علاجية", "حمية", "حرمان غذائي"], specialty: "التغذية العلاجية", icon: "🥗" },
  { keywords: ["باطنة", "سكري", "ضغط", "الغدة", "هرمون", "دموية", "سرطان", "التهاب", "تشخيص"], specialty: "طب الباطنة", icon: "🏥" },
];

const initialMessages = [
  { type: "bot", text: "مرحباً! أنا مساعد طبي ذكي 🩺" },
  { type: "bot", text: "أخبرني عن أعراضك وأنا أوجهك للتخصص المناسب." },
];

const AIAssistant = () => {
  const navigate = useNavigate();
  const { data: specializationsList = [] } = useSpecializations();
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState(null);
  const [matchedDoctors, setMatchedDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const chatContainerRef = useRef(null);

  const patientLocation = userData?.address?.line1 || "";

  const findSpecialty = (text) => {
    const lower = text.toLowerCase().trim();
    for (const entry of keywordMap) {
      for (const kw of entry.keywords) {
        if (lower.includes(kw.toLowerCase())) {
          const matched = specializationsList.find(
            (s) => s.name === entry.specialty
          );
          if (matched) {
            return { ...entry, id: matched.id, name: matched.name };
          }
        }
      }
    }
    return null;
  };

  const fetchMatchingDoctors = async (specializationName) => {
    setLoadingDoctors(true);
    try {
      const { data } = await axiosInstance.get("/Doctors/get-all-doctors", {
        params: { PageSize: 100 },
      });
      if (data.succeeded && data.data?.items) {
        let filtered = data.data.items.filter(
          (d) => d.specializationName === specializationName
        );
        if (patientLocation) {
          const locationDoctors = filtered.filter(
            (d) => d.clinicAddress && d.clinicAddress.includes(patientLocation)
          );
          if (locationDoctors.length > 0) {
            filtered = locationDoctors;
          }
        }
        setMatchedDoctors(filtered.slice(0, 5));
      }
    } catch (error) {

    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/login");
      return;
    }

    const userMsg = { type: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setMatchedDoctors([]);

    setTimeout(() => {
      const match = findSpecialty(userMsg.text);
      if (match) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: `بناءً على أعراضك، أقترح عليك التخصص التالي:` },
        ]);
        setResult(match);
        fetchMatchingDoctors(match.name);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "لم أتمكن من تحديد التخصص المناسب. حاول وصف أعراضك بشكل أوضح، مثل: صداع، ألم أسنان، جيوب أنفية، مشكلة في الجلد..." },
        ]);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBook = () => {
    if (result) {
      navigate(`/doctors/${result.id}`);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setResult(null);
    setMatchedDoctors([]);
    setInput("");
  };

  return (
    <div className="relative py-16 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#0B1437] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Right Side - Chat */}
            <div className="p-8 lg:p-12 flex flex-col min-h-[500px]">
              <div className="flex justify-end mb-6">
                <span className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-lg">🩺</span> مساعد طبي ذكي
                </span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                أدخل أعراضك
                <br />
                وسنوجهك
                <br />
                <span className="text-[#4FC3F7]">للتخصص الطبي</span>
                <br />
                <span className="text-[#4FC3F7]">الصحيح</span>
              </h2>

              <p className="text-slate-300 text-sm font-medium mb-6 max-w-md">
                بمساعدتنا ننصحك، يمكنك الآن معرفة التخصص الطبي المناسب لحالتك ونوجهك عليه ونبحث لك عن الأطباء المتخصصين.
              </p>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[250px] pr-2">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium ${
                      msg.type === "user"
                        ? "bg-[#138C9F] text-white rounded-bl-sm"
                        : "bg-white/10 text-white rounded-br-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm">
                      <span className="animate-pulse">يُحلّل أعراضك...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب أعراضك هنا... (مثال: جيوب أنفية، صداع، ألم أسنان)"
                  className="flex-1 bg-white/10 text-white placeholder-slate-400 text-sm font-medium px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-[#138C9F] focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#138C9F] hover:bg-[#0f6c7a] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm cursor-pointer disabled:opacity-40"
                >
                  أرسل
                </button>
              </div>
            </div>

            {/* Left Side - Result */}
            <div className="bg-[#0a1030] p-8 lg:p-12 flex items-center justify-center min-h-[500px]">
              {!result ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">🩺</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    سيظهر التخصص الطبي المناسب
                    <br />
                    هنا بعد وصف الأعراض
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-sm space-y-4">
                  <div className="bg-white rounded-3xl p-6 shadow-xl">
                    <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">{result.icon}</span>
                    </div>
                    <p className="text-xs text-[#138C9F] font-bold text-center mb-1">التخصص الموصى به</p>
                    <h3 className="text-lg font-black text-slate-800 text-center mb-4">
                      {result.name}
                    </h3>
                    <button
                      onClick={handleBook}
                      className="w-full bg-[#1a237e] hover:bg-[#0d1452] text-white font-bold py-3 rounded-xl transition-all text-sm cursor-pointer mb-3"
                    >
                      احجز موعد الآن
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs transition-all cursor-pointer"
                    >
                      إعادة التحديد
                    </button>
                  </div>

                  {loadingDoctors && (
                    <div className="bg-white/10 rounded-2xl p-4 text-center">
                      <span className="text-white/60 text-sm animate-pulse">جاري البحث عن أطباء متاحين...</span>
                    </div>
                  )}

                  {!loadingDoctors && matchedDoctors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs font-bold text-center">
                        {patientLocation ? `أطباء متوفرون في ${patientLocation}` : "أطباء متوفرون"}
                      </p>
                      {matchedDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => navigate(`/doctors/get-doctor-by-id/${doc.id}`)}
                          className="bg-white/10 hover:bg-white/15 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all"
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
                            <p className="text-white/50 text-xs truncate">{doc.clinicAddress || doc.clinicName}</p>
                          </div>
                          <div className="text-left shrink-0">
                            <p className="text-[#4FC3F7] text-xs font-bold">{doc.sessionPrice} ₪</p>
                            {doc.averageRating > 0 && (
                              <p className="text-yellow-400 text-[10px]">★ {doc.averageRating}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingDoctors && matchedDoctors.length === 0 && result && (
                    <div className="bg-white/5 rounded-2xl p-4 text-center">
                      <p className="text-white/40 text-xs">
                        {patientLocation
                          ? `لم نجد أطباء متوفرين في ${patientLocation} حالياً`
                          : "لم نجد أطباء متوفرين حالياً"}
                      </p>
                      <button
                        onClick={handleBook}
                        className="mt-2 text-[#4FC3F7] text-xs font-bold hover:underline cursor-pointer"
                      >
                        عرض جميع الأطباء
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
