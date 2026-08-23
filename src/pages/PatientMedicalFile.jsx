import React, { useState, useEffect } from 'react';
import {
    FiSearch, FiCalendar, FiUser, FiActivity, FiFileText,
    FiSliders, FiRotateCcw, FiStar, FiArrowLeft, FiArrowRight, FiSend, FiX
} from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const FILES_BASE = import.meta.env.VITE_Files_URL || '';

const STATUS_MAP = {
    Completed: 'منتهية',
    Confirmed: 'مؤكد',
    PendingPayment: 'قيد الانتظار',
    Cancelled: 'ملغي',
};

const ARABIC_MONTHS = {
    '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
    '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
    '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر',
};

const formatDate = (dateString) => {
    if (!dateString) return { month: '', day: '' };
    const d = new Date(dateString);
    const month = ARABIC_MONTHS[String(d.getMonth() + 1).padStart(2, '0')] || '';
    const day = String(d.getDate());
    return { month, day };
};

const PatientMedicalFile = () => {
    const [searchDate, setSearchDate] = useState('');
    const [specialty, setSpecialty] = useState('الكل');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [selectedVisit, setSelectedVisit] = useState(null);

    const [platformRating, setPlatformRating] = useState(0);
    const [doctorRating, setDoctorRating] = useState(0);
    const [platformComment, setPlatformComment] = useState('');
    const [doctorComment, setDoctorComment] = useState('');

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/patient/medical-history/visits');
                if (res.data.succeeded) {
                    setVisits(res.data.data);
                } else {
                    setError('فشل في تحميل البيانات');
                }
            } catch (err) {
                setError('حدث خطأ أثناء تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };
        fetchVisits();
    }, []);

    const handleResetFilters = () => {
        setSearchDate('');
        setSpecialty('الكل');
    };

    const filteredVisits = visits.filter((v) => {
        if (specialty !== 'الكل' && v.specializationName !== specialty) return false;
        if (searchDate && v.visitDate) {
            const visitDateStr = new Date(v.visitDate).toISOString().slice(0, 10);
            if (visitDateStr !== searchDate) return false;
        }
        return true;
    });

    const openModal = (visit) => {
        setSelectedVisit(visit);
        setIsModalOpen(true);
        setModalStep(1);
        setPlatformRating(0);
        setDoctorRating(0);
        setPlatformComment('');
        setDoctorComment('');
    };

    const handleDeleteVisit = async (visitId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الزيارة؟')) return;
        try {
            const res = await axiosInstance.delete(`/patient/medical-records/${visitId}`);
            if (res.data.succeeded) {
                setVisits(prev => prev.filter(v => v.id !== visitId));
                alert('تم حذف الزيارة بنجاح');
            } else {
                alert('فشل حذف الزيارة');
            }
        } catch (err) {
            alert('حدث خطأ أثناء الحذف');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen p-3 pt-40 font-['Tajawal']" dir="rtl">
                <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1b8b99]" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen p-3 pt-40 font-['Tajawal']" dir="rtl">
                <div className="max-w-5xl mx-auto text-center text-red-500 py-20 text-sm font-bold">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-3 pt-40 font-['Tajawal']" dir="rtl">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* الهيدر العلوي للسجل الطبي */}
                <div className="text-right space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1b8b99]">السجل الطبي</h1>
                    <p className="text-xs sm:text-sm text-gray-500">عرض وتتبع تاريخك الطبي، التشخيصات، والوصفات الطبية السابقة.</p>
                </div>

                {/* قسم الفلترة والبحث */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1.5 text-right">
                            <label className="text-xs font-bold text-gray-500">البحث حسب التاريخ</label>
                            <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50/50 h-11 focus-within:border-[#1b8b99] focus-within:bg-white transition-all">
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-700 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 text-right">
                            <label className="text-xs font-bold text-gray-500">التخصص</label>
                            <div className="relative flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50/50 h-11 focus-within:border-[#1b8b99] focus-within:bg-white transition-all">
                                <select
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-700 font-medium appearance-none"
                                >
                                    <option value="الكل">الكل</option>
                                    {[...new Set(visits.map((v) => v.specializationName).filter(Boolean))].map((spec) => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 rounded-xl transition-all shadow-xs cursor-pointer text-sm">
                                <FiSliders className="w-4 h-4" />
                                تطبيق الفلاتر
                            </button>
                            <button
                                onClick={handleResetFilters}
                                className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-gray-600 font-bold h-11 px-4 rounded-xl transition-all cursor-pointer text-sm"
                            >
                                <FiRotateCcw className="w-4 h-4" />
                                إعادة ضبط
                            </button>
                        </div>
                    </div>
                </div>

                {filteredVisits.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-10 text-center">
                        <p className="text-sm text-gray-400 font-bold">لا توجد زيارات طبية مسجلة</p>
                    </div>
                ) : (
                    filteredVisits.map((visit) => {
                        const { month, day } = formatDate(visit.visitDate);
                        return (
                            <div key={visit.id} className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
                                {/* هيدر الكرت */}
                                <div className="bg-cyan-50/40 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-100/30">
                                    <div className="flex items-center gap-4 text-right">
                                        <div className="bg-[#1b8b99] text-white rounded-xl px-3 py-1.5 text-center min-w-[75px]">
                                            <p className="text-xs font-medium tracking-tight opacity-90">{month}</p>
                                            <p className="text-lg font-black leading-none mt-0.5">{day}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                                                زيارة طبية
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium mt-0.5">{visit.specializationName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                                        <span className="bg-teal-50 text-[#1b8b99] text-xs font-bold px-3 py-1 rounded-full">
                                            {STATUS_MAP[visit.appointmentStatus] || visit.appointmentStatus}
                                        </span>
                                        <button
                                            onClick={() => openModal(visit)}
                                            className="bg-[#1b8b99] hover:bg-[#15727e] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                                        >
                                            تقييم
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVisit(visit.id)}
                                            className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>

                                {/* محتويات وتفاصيل الزيارة */}
                                <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                                    <div className="md:col-span-2 space-y-5">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                <FiUser className="w-3.5 h-3.5 text-[#1b8b99]" /> اسم الطبيب
                                            </p>
                                            <h4 className="font-black text-gray-800 text-sm sm:text-base">{visit.doctorName}</h4>
                                            <p className="text-xs font-bold text-[#1b8b99]">{visit.specializationName}</p>
                                        </div>

                                        {visit.symptoms && (
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                    <FiActivity className="w-3.5 h-3.5 text-[#1b8b99]" /> الأعراض
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{visit.symptoms}</p>
                                            </div>
                                        )}

                                        {visit.diagnosis && (
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                    <FiFileText className="w-3.5 h-3.5 text-[#1b8b99]" /> التشخيص
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{visit.diagnosis}</p>
                                            </div>
                                        )}

                                        {visit.visitNotes && (
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                    <FiFileText className="w-3.5 h-3.5 text-[#1b8b99]" /> ملاحظات الزيارة
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{visit.visitNotes}</p>
                                            </div>
                                        )}

                                        {visit.recommendations && (
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                                                    <FiFileText className="w-3.5 h-3.5 text-[#1b8b99]" /> التوصيات
                                                </p>
                                                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{visit.recommendations}</p>
                                            </div>
                                        )}
                                    </div>

                                    {visit.prescriptionMedications && visit.prescriptionMedications.length > 0 && (
                                        <div className="border border-dashed border-slate-200 bg-slate-50/40 rounded-xl p-4 space-y-3">
                                            <h5 className="text-xs font-bold text-[#1b8b99] border-b border-dashed border-slate-200 pb-2 flex items-center gap-1.5">
                                                <FiFileText className="w-4 h-4" />
                                                الوصفة الطبية
                                            </h5>
                                            <div className="space-y-2">
                                                {visit.prescriptionMedications.map((med, idx) => (
                                                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs space-y-1">
                                                        <div className="flex justify-between items-center text-xs font-semibold">
                                                            <span className="text-gray-800">{med.medicationName}</span>
                                                            <span className="text-gray-400 font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{med.dosage}</span>
                                                        </div>
                                                        {med.frequency && (
                                                            <p className="text-[10px] text-gray-400">{med.frequency}{med.duration ? ` • ${med.duration}` : ''}</p>
                                                        )}
                                                        {med.instructions && (
                                                            <p className="text-[10px] text-gray-400">{med.instructions}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-50/50 border-t border-slate-100 p-3 text-center">
                                    <p className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-1.5">
                                        <span>يتم تحديث السجلات الطبية تلقائياً بعد كل زيارة.</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* نافذة التقييم المنبثقة */}
            {isModalOpen && selectedVisit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-all animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden relative transform transition-all scale-100">
                        <div className="p-4 bg-white border-b border-slate-50 flex items-center justify-between relative">
                            {modalStep === 2 && (
                                <button
                                    onClick={() => setModalStep(1)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 absolute right-4"
                                    title="الرجوع للخطوة السابقة"
                                >
                                    <FiArrowRight className="w-5 h-5" />
                                </button>
                            )}
                            <div className="mx-auto">
                                <span className="bg-cyan-50 text-[#1b8b99] text-[10px] font-black px-3 py-1 rounded-full border border-cyan-100/30">
                                    الخطوة {modalStep} من 2
                                </span>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 absolute left-4"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {modalStep === 1 && (
                            <div className="p-5 sm:p-6 text-center space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-base sm:text-lg font-extrabold text-gray-800">كيف تقيّم تجربتك مع المنصة بشكل عام؟</h3>
                                </div>
                                <div className="flex justify-center items-center gap-2" dir="ltr">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setPlatformRating(star)}
                                            className="p-1 transition-transform active:scale-95 cursor-pointer"
                                        >
                                            <FiStar
                                                className={`w-7 h-7 transition-colors ${star <= platformRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-xs font-bold text-gray-500">أخبرنا المزيد عن تجربتك (اختياري)</label>
                                    <textarea
                                        value={platformComment}
                                        onChange={(e) => setPlatformComment(e.target.value)}
                                        placeholder="اكتب ملاحظاتك هنا..."
                                        rows={4}
                                        className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-gray-700 bg-slate-50/50 outline-none focus:border-[#1b8b99] focus:bg-white transition-all resize-none text-right"
                                    />
                                </div>
                                <div className="space-y-2.5 pt-2">
                                    <button
                                        onClick={() => setModalStep(2)}
                                        className="w-full bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-xs"
                                    >
                                        التالي
                                        <FiArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setModalStep(2)}
                                        className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-gray-500 font-bold h-11 rounded-xl transition-all cursor-pointer text-sm"
                                    >
                                        تخطي
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalStep === 2 && (
                            <div className="p-5 sm:p-6 text-center space-y-6">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3 text-right">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 border border-white shadow-xs overflow-hidden flex items-center justify-center text-gray-400 shrink-0">
                                        {selectedVisit.doctorImageUrl ? (
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                width="48"
                                                height="48"
                                                src={`${FILES_BASE}${selectedVisit.doctorImageUrl}`}
                                                alt={selectedVisit.doctorName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FiUser className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-extrabold text-gray-800 text-sm">{selectedVisit.doctorName}</h4>
                                        <p className="text-xs text-[#1b8b99] font-semibold">{selectedVisit.specializationName}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base sm:text-lg font-extrabold text-gray-800">كيف تقيّم تجربتك مع الطبيب؟</h3>
                                </div>
                                <div className="flex justify-center items-center gap-2" dir="ltr">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setDoctorRating(star)}
                                            className="p-1 transition-transform active:scale-95 cursor-pointer"
                                        >
                                            <FiStar
                                                className={`w-7 h-7 transition-colors ${star <= doctorRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-xs font-bold text-gray-500">أخبرنا المزيد عن تجربتك (اختياري)</label>
                                    <textarea
                                        value={doctorComment}
                                        onChange={(e) => setDoctorComment(e.target.value)}
                                        placeholder="اكتب ملاحظاتك هنا..."
                                        rows={4}
                                        className="w-full border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-gray-700 bg-slate-50/50 outline-none focus:border-[#1b8b99] focus:bg-white transition-all resize-none text-right"
                                    />
                                </div>
                                <div className="space-y-2.5 pt-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            alert('تم إرسال تقييمك بنجاح! شكراً لك.');
                                        }}
                                        className="w-full bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-xs"
                                    >
                                        <FiSend className="w-4 h-4" />
                                        إرسال التقييم
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-gray-500 font-bold h-11 rounded-xl transition-all cursor-pointer text-sm"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientMedicalFile;
