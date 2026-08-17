import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientFile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // قاعدة بيانات متكاملة ومطابقة لكل المرضى بقائمتك الرئيسية
    const database = {
        "1": { name: "فاطمة علي", age: "62 سنة", bloodType: "O+", height: "160 سم", weight: "70 كجم", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop", chronicDiseases: [{ id: 1, name: "ارتفاع ضغط الدم", date: "تم التشخيص في: 2018", status: "مستقر" }], allergies: [{ id: 1, title: "بنسلين", desc: "طفح جلدي شديد", color: "border-r-red-500" }], smoking: "غير مدخنة" },
        "2": { name: "محمد أحمد", age: "34 سنة", bloodType: "B-", height: "175 سم", weight: "78 كجم", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop", chronicDiseases: [], allergies: [], smoking: "غير مدخن" },
        "3": { name: "سلطان العبدالله", age: "64 سنة", bloodType: "A+", height: "178 سم", weight: "82 كجم", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", chronicDiseases: [{ id: 1, name: "داء السكري - النوع الثاني", date: "تم التشخيص في: يونيو 2015", status: "متحكم به" }, { id: 2, name: "ارتفاع ضغط الدم", date: "تم التشخيص في: مارس 2012", status: "مستقر" }], allergies: [{ id: 1, title: "بنسلين (Penicillin)", desc: "رد فعل شديد: طفح جلدي وضيق تنفس", color: "border-r-red-500" }, { id: 2, title: "غبار الطلع", desc: "موسمي: عطاس وحكة في العين", color: "border-r-blue-500" }], smoking: "مدخن سابق (أقلع منذ 4 سنوات)." },
        "4": { name: "حلا محمد", age: "45 سنة", bloodType: "AB+", height: "168 سم", weight: "65 كجم", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop", chronicDiseases: [{ id: 1, name: "الربو الشعبى", date: "منذ الطفولة", status: "مستقر" }], allergies: [{ id: 1, title: "غبار المنزلي", desc: "ضيق تنفس خفيف", color: "border-r-yellow-500" }], smoking: "غير مدخنة" },
        "5": { name: "ليلى محمود", age: "8 سنوات", bloodType: "O-", height: "120 سم", weight: "24 كجم", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop", chronicDiseases: [], allergies: [{ id: 1, title: "الفول السوداني", desc: "حساسية هضمية حادة", color: "border-r-red-500" }], smoking: "لا ينطبق" },
        "6": { name: "أحمد منصور", age: "29 سنة", bloodType: "A-", height: "182 سم", weight: "85 كجم", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=100&auto=format&fit=crop", chronicDiseases: [], allergies: [], smoking: "مدخن حالي" }
    };

    const patientData = database[id] || database["3"]; // استرجاع المريض حسب المعرف أو افتراضي سلطان العبدالله 

    return (
        <div className="min-h-screen bg-[#ecf8fa] font-['Cairo'] p-6" dir="rtl">
            <main className="max-w-[1000px] mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-[#138C9F]">السجل المرضي الشخصي</h1> 
                        <p className="text-xs font-bold text-gray-400 mt-1">عرض وتتبع الحالة المزمنة والحساسية الحالية للمريض.</p> 
                    </div>
                    <button onClick={() => navigate(-1)} className="text-[#138C9F] font-bold text-sm hover:underline cursor-pointer">
                        ◀ العودة للخلف
                    </button>
                </div>

                {/* كارت المريض العلوي */}
                <div className="bg-white border border-[#C3C6D6]/70 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs"> 
                    <div className="flex items-center gap-5 text-right w-full md:w-auto"> 
                        <img src={patientData.avatar} alt={patientData.name} className="w-20 h-20 rounded-2xl object-cover border border-[#C3C6D6]" /> 
                        <h2 className="text-2xl font-black text-[#0B1C30]">{patientData.name}</h2> 
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto"> 
                        <div className="bg-[#EBF7F9] rounded-xl px-5 py-3 text-center min-w-[90px]"> 
                            <span className="text-[11px] font-bold text-gray-400 block">الوزن</span> 
                            <span className="text-base font-black text-[#138C9F] mt-1 block">{patientData.weight}</span> 
                        </div>
                        <div className="bg-[#EBF7F9] rounded-xl px-5 py-3 text-center min-w-[90px]"> 
                            <span className="text-[11px] font-bold text-gray-400 block">الطول</span> 
                            <span className="text-base font-black text-[#138C9F] mt-1 block">{patientData.height}</span> 
                        </div>
                        <div className="bg-[#EBF7F9] rounded-xl px-5 py-3 text-center min-w-[90px]"> 
                            <span className="text-[11px] font-bold text-gray-400 block">فصيلة الدم</span> 
                            <span className="text-base font-black text-red-500 mt-1 block">{patientData.bloodType}</span> 
                        </div>
                        <div className="bg-[#EBF7F9] rounded-xl px-5 py-3 text-center min-w-[90px]"> 
                            <span className="text-[11px] font-bold text-gray-400 block">العمر</span> 
                            <span className="text-base font-black text-[#138C9F] mt-1 block">{patientData.age}</span> 
                        </div>
                    </div>
                </div>

                {/* التفاصيل المرضية */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 bg-white border border-[#C3C6D6]/70 rounded-2xl p-5 shadow-xs space-y-4"> 
                        <div className="flex items-center gap-2 text-red-500 font-black text-sm border-b pb-3"> 
                            <span>⚠️</span><h3>الحساسية</h3> 
                        </div>
                        <div className="space-y-3">
                            {patientData.allergies.length > 0 ? (
                                patientData.allergies.map(allergy => (
                                    <div key={allergy.id} className={`p-3 bg-slate-50/60 border-r-4 ${allergy.color} rounded-xl text-right`}> 
                                        <h4 className="text-xs font-black text-red-600">{allergy.title}</h4> 
                                        <p className="text-[11px] font-bold text-gray-500 mt-1">{allergy.desc}</p> 
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-400 font-bold text-center">لا توجد ردود فعل حساسية مسجلة.</p>}
                        </div>
                    </div>

                    <div className="lg:col-span-8 bg-white border border-[#C3C6D6]/70 rounded-2xl overflow-hidden shadow-xs"> 
                        <div className="p-5 flex items-center gap-2 text-[#138C9F] font-black text-sm border-b bg-slate-50/40"> 
                            <span>🧬</span><h3>الأمراض المزمنة</h3> 
                        </div>
                        <div className="p-5 space-y-4">
                            {patientData.chronicDiseases.length > 0 ? (
                                patientData.chronicDiseases.map(disease => (
                                    <div key={disease.id} className="p-4 border border-[#C3C6D6]/60 rounded-xl flex items-center justify-between text-right"> 
                                        <div className="space-y-1"> 
                                            <h4 className="text-sm font-black text-[#0B1C30] flex items-center gap-2"> 
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#138C9F]"></span>{disease.name} 
                                            </h4>
                                            <p className="text-[11px] font-bold text-gray-400 pr-3.5">{disease.date}</p> 
                                        </div>
                                        <span className="text-[11px] font-black px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{disease.status}</span> 
                                    </div>
                                ))
                            ) : <p className="text-sm text-gray-400 font-bold p-2">لا يعاني المريض من أمراض مزمنة مسجلة.</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#C3C6D6]/70 rounded-2xl overflow-hidden shadow-xs"> 
                    <div className="p-4 flex items-center gap-2 text-[#138C9F] font-black text-sm border-b bg-slate-50/40"> 
                        <span>🚬</span><h3>التدخين</h3> 
                    </div>
                    <div className="p-6 text-right">
                        <p className="text-sm font-black text-[#0B1C30] leading-relaxed">{patientData.smoking}</p> 
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientFile;