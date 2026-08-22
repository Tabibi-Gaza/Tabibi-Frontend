import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from '../context/AppContext';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiFileText, FiDownload, FiEye, FiX, FiUser, FiCalendar, FiTrash2 } from 'react-icons/fi';
let html2canvas, jsPDF;
const loadPdfLibs = async () => {
  if (!html2canvas) {
    const mod1 = await import('html2canvas');
    html2canvas = mod1.default;
  }
  if (!jsPDF) {
    const mod2 = await import('jspdf');
    jsPDF = mod2.default;
  }
};

const FILES_BASE = import.meta.env.VITE_Files_URL || '';

const MyPrescriptions = () => {
    const { token } = useContext(AppContext);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRx, setSelectedRx] = useState(null);
    const printRef = useRef(null);

    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await axiosInstance.get('/patient/prescriptions');
            if (data.succeeded && data.data) {
                setPrescriptions(data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error('فشل تحميل الوصفات الطبية');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getDoctorImageSrc = (img) => {
        if (!img || img.trim() === '') return null;
        if (img.startsWith('http')) return img;
        const path = img.startsWith('/') ? img : `/${img}`;
        return `${FILES_BASE}${path}`;
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        try {
            await loadPdfLibs();
            const element = printRef.current;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`prescription-${selectedRx.doctorName.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('تم تحميل الوصفة بنجاح');
        } catch (err) {
            console.error(err);
            toast.error('فشل تحميل ملف PDF');
        }
    };

    const getDoctorInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(' ');
        return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    };

    const specializations = [...new Set(prescriptions.map(rx => rx.doctorSpecialization).filter(Boolean))];

    const filteredPrescriptions = prescriptions.filter(rx => {
        if (filterDoctor && !rx.doctorName?.includes(filterDoctor)) return false;
        if (filterSpecialization && rx.doctorSpecialization !== filterSpecialization) return false;
        if (filterDate) {
            const rxDate = new Date(rx.sentAt).toISOString().split('T')[0];
            if (rxDate !== filterDate) return false;
        }
        return true;
    });

    const clearFilters = () => {
        setFilterDoctor('');
        setFilterSpecialization('');
        setFilterDate('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الوصفة الطبية؟')) return;
        try {
            await axiosInstance.delete(`/patient/prescriptions/${id}`);
            setPrescriptions(prev => prev.filter(rx => rx.id !== id));
            if (selectedRx?.id === id) setSelectedRx(null);
            toast.success('تم حذف الوصفة الطبية بنجاح');
        } catch (err) {
            console.error(err);
            toast.error('فشل حذف الوصفة الطبية');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20" dir="rtl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1b8b99]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6" dir="rtl">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0B1C30]">وصفاتي الطبية</h1>
                    <p className="text-sm font-bold text-gray-500 mt-1">عرض جميع الوصفات الطبية المستلمة من الأطباء</p>
                </div>

                {prescriptions.length === 0 ? (
                    <div className="text-center py-20">
                        <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-400">لا توجد وصفات طبية بعد</p>
                        <p className="text-sm font-bold text-gray-300 mt-1">ستظهر هنا الوصفات التي يرسلها الأطباء لك</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-[#C3C6D6]/60 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-end gap-3">
                            <div className="flex-1 w-full">
                                <label className="text-[10px] font-bold text-gray-400 block mb-1">تاريخ الزيارة</label>
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="w-full border border-[#C3C6D6]/60 rounded-lg px-3 py-2 text-xs font-bold text-[#0B1C30] outline-none focus:border-[#138C9F] transition-colors"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-[10px] font-bold text-gray-400 block mb-1">اسم الطبيب</label>
                                <input
                                    type="text"
                                    value={filterDoctor}
                                    onChange={(e) => setFilterDoctor(e.target.value)}
                                    placeholder="كل"
                                    className="w-full border border-[#C3C6D6]/60 rounded-lg px-3 py-2 text-xs font-bold text-[#0B1C30] outline-none focus:border-[#138C9F] transition-colors"
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-[10px] font-bold text-gray-400 block mb-1">التخصص</label>
                                <select
                                    value={filterSpecialization}
                                    onChange={(e) => setFilterSpecialization(e.target.value)}
                                    className="w-full border border-[#C3C6D6]/60 rounded-lg px-3 py-2 text-xs font-bold text-[#0B1C30] outline-none focus:border-[#138C9F] transition-colors bg-white"
                                >
                                    <option value="">الكل</option>
                                    {specializations.map((spec, i) => (
                                        <option key={i} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#138C9F] text-[#138C9F] text-xs font-bold hover:bg-[#138C9F]/5 transition-all cursor-pointer whitespace-nowrap"
                            >
                                <FiX className="w-3.5 h-3.5" />
                                إعادة تعيين
                            </button>
                        </div>

                        {filteredPrescriptions.length === 0 ? (
                            <div className="text-center py-16">
                                <FiFileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                                <p className="text-base font-bold text-gray-400">لا توجد نتائج مطابقة للفلتر</p>
                                <button onClick={clearFilters} className="mt-2 text-xs font-bold text-[#138C9F] hover:underline cursor-pointer">مسح الفلتر</button>
                            </div>
                        ) : (
                    <div className="grid gap-5">
                        {filteredPrescriptions.map((rx) => (
                            <div key={rx.id} className="bg-white border border-[#C3C6D6]/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                                <div className="bg-[#EBF3F5] px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#C3C6D6]/40">
                                    <div className="flex items-center gap-3">
                                        {getDoctorImageSrc(rx.doctorImage) ? (
                                            <img loading="lazy" src={getDoctorImageSrc(rx.doctorImage)} alt={rx.doctorName} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                                        ) : (
                                            <div className="w-11 h-11 rounded-xl bg-[#138C9F] text-white flex items-center justify-center shrink-0 text-sm font-black">
                                                {getDoctorInitials(rx.doctorName)}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-black text-[#0B1C30]">د. {rx.doctorName}</p>
                                            <p className="text-xs font-bold text-gray-500">{rx.doctorSpecialization || ""}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FiCalendar className="w-3.5 h-3.5" />
                                            {formatDate(rx.sentAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-5 py-4">
                                    {rx.diagnosis && (
                                        <div className="mb-3">
                                            <span className="text-xs font-black text-[#138C9F]">التشخيص:</span>
                                            <p className="text-sm font-bold text-[#0B1C30] mt-0.5">{rx.diagnosis}</p>
                                        </div>
                                    )}
                                    {rx.symptoms && (
                                        <div className="mb-3">
                                            <span className="text-xs font-black text-[#138C9F]">الأعراض:</span>
                                            <p className="text-sm font-bold text-gray-600 mt-0.5">{rx.symptoms}</p>
                                        </div>
                                    )}
                                    {rx.medications?.length > 0 && (
                                        <div className="mt-3">
                                            <span className="text-xs font-black text-[#138C9F] mb-2 block">الأدوية الموصوفة:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {rx.medications.map((med, i) => (
                                                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs">
                                                        <span className="font-black text-[#0B1C30]">{med.medicationName}</span>
                                                        <span className="text-gray-400 mx-1">•</span>
                                                        <span className="text-[#138C9F] font-bold">{med.dosage}</span>
                                                        <span className="text-gray-400 mx-1">•</span>
                                                        <span className="text-gray-500 font-bold">{med.frequency} مرات</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 pb-4 flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedRx(rx)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#138C9F] text-[#138C9F] text-xs font-bold hover:bg-[#138C9F]/5 transition-all cursor-pointer">
                                        <FiEye className="w-3.5 h-3.5" />
                                        معاينة التفاصيل
                                    </button>
                                    <button
                                        onClick={() => setSelectedRx(rx)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#138C9F] text-white text-xs font-bold hover:bg-[#0f7585] transition-all cursor-pointer shadow-xs">
                                        <FiDownload className="w-3.5 h-3.5" />
                                        تحميل PDF
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rx.id)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-red-500 text-xs font-bold hover:bg-red-50 transition-all cursor-pointer">
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                    </>
                )}
            </div>

            {selectedRx && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRx(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-black text-[#0B1C30]">تفاصيل الوصفة الطبية</h3>
                            <button onClick={() => setSelectedRx(null)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-all">
                                <FiX className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                {getDoctorImageSrc(selectedRx.doctorImage) ? (
                                    <img loading="lazy" src={getDoctorImageSrc(selectedRx.doctorImage)} alt={selectedRx.doctorName} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-[#138C9F] text-white flex items-center justify-center shrink-0 text-base font-black">
                                        {getDoctorInitials(selectedRx.doctorName)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-black text-[#0B1C30]">د. {selectedRx.doctorName}</p>
                                    <p className="text-xs font-bold text-gray-500">{selectedRx.doctorSpecialization || ""}</p>
                                    <p className="text-xs font-bold text-gray-400 mt-0.5">{formatDate(selectedRx.sentAt)}</p>
                                </div>
                            </div>

                            {selectedRx.diagnosis && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-1">التشخيص</h4>
                                    <p className="text-sm font-bold text-[#0B1C30] bg-[#EBF3F5] rounded-lg px-4 py-2.5">{selectedRx.diagnosis}</p>
                                </div>
                            )}
                            {selectedRx.chiefComplaint && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-1">الشكوى الرئيسية</h4>
                                    <p className="text-sm font-bold text-[#0B1C30] bg-gray-50 rounded-lg px-4 py-2.5">{selectedRx.chiefComplaint}</p>
                                </div>
                            )}
                            {selectedRx.symptoms && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-1">الأعراض</h4>
                                    <p className="text-sm font-bold text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">{selectedRx.symptoms}</p>
                                </div>
                            )}
                            {selectedRx.visitNotes && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-1">ملاحظات الزيارة</h4>
                                    <p className="text-sm font-bold text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">{selectedRx.visitNotes}</p>
                                </div>
                            )}
                            {selectedRx.recommendations && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-1">التوصيات</h4>
                                    <p className="text-sm font-bold text-gray-600 bg-gray-50 rounded-lg px-4 py-2.5">{selectedRx.recommendations}</p>
                                </div>
                            )}

                            {selectedRx.medications?.length > 0 && (
                                <div className="mt-5">
                                    <h4 className="text-xs font-black text-[#138C9F] mb-3">الأدوية الموصوفة</h4>
                                    <div className="space-y-2.5">
                                        {selectedRx.medications.map((med, i) => (
                                            <div key={i} className="bg-[#EBF3F5] border border-[#C3C6D6]/40 rounded-xl p-3.5">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-black text-[#0B1C30]">{med.medicationName}</span>
                                                    <span className="text-xs font-bold text-[#138C9F] bg-white px-2 py-0.5 rounded-md">{med.dosage}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-500">
                                                    <span>{med.frequency} مرات</span>
                                                    <span>المدة: {med.duration}</span>
                                                    {med.instructions && <span>ملاحظات: {med.instructions}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-2">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#138C9F] text-white text-sm font-bold hover:bg-[#0f7585] transition-all cursor-pointer shadow-xs">
                                <FiDownload className="w-4 h-4" />
                                تحميل PDF
                            </button>
                            <button
                                onClick={() => setSelectedRx(null)}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-all cursor-pointer">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden div for PDF generation */}
            {selectedRx && (
                <div className="fixed -left-[9999px] top-0" dir="rtl">
                    <div ref={printRef} style={{ width: '794px', padding: '40px', fontFamily: 'Cairo, Arial, sans-serif', background: '#fff', color: '#0B1C30' }}>
                        <div style={{ textAlign: 'center', borderBottom: '3px solid #138C9F', paddingBottom: '20px', marginBottom: '25px' }}>
                            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#138C9F', margin: 0 }}>وصفة طبية</h1>
                            <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0' }}>Tabibi Platform - Medical Prescription</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '15px', background: '#f8fafb', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {getDoctorImageSrc(selectedRx.doctorImage) ? (
                                    <img loading="lazy" src={getDoctorImageSrc(selectedRx.doctorImage)} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#138C9F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800' }}>
                                        {getDoctorInitials(selectedRx.doctorName)}
                                    </div>
                                )}
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#138C9F' }}>الطبيب المعالج</p>
                                    <p style={{ fontSize: '15px', fontWeight: '800', margin: '4px 0' }}>د. {selectedRx.doctorName}</p>
                                    <p style={{ fontSize: '12px', color: '#666' }}>{selectedRx.doctorSpecialization || ""}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '13px', fontWeight: '700', color: '#138C9F' }}>التاريخ</p>
                                <p style={{ fontSize: '13px', fontWeight: '700', margin: '4px 0' }}>{formatDate(selectedRx.sentAt)}</p>
                            </div>
                        </div>

                        {selectedRx.diagnosis && (
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '13px', fontWeight: '800', color: '#138C9F', marginBottom: '5px' }}>التشخيص</p>
                                <p style={{ fontSize: '13px', fontWeight: '600', background: '#f0f7f8', padding: '10px 15px', borderRadius: '8px' }}>{selectedRx.diagnosis}</p>
                            </div>
                        )}
                        {selectedRx.symptoms && (
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '13px', fontWeight: '800', color: '#138C9F', marginBottom: '5px' }}>الأعراض</p>
                                <p style={{ fontSize: '13px', fontWeight: '600', background: '#f8f8f8', padding: '10px 15px', borderRadius: '8px' }}>{selectedRx.symptoms}</p>
                            </div>
                        )}
                        {selectedRx.recommendations && (
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '13px', fontWeight: '800', color: '#138C9F', marginBottom: '5px' }}>التوصيات</p>
                                <p style={{ fontSize: '13px', fontWeight: '600', background: '#f8f8f8', padding: '10px 15px', borderRadius: '8px' }}>{selectedRx.recommendations}</p>
                            </div>
                        )}

                        <div style={{ borderTop: '2px solid #C3C6D6', paddingTop: '15px', marginTop: '15px' }}>
                            <p style={{ fontSize: '15px', fontWeight: '800', color: '#138C9F', marginBottom: '12px' }}>الأدوية الموصوفة</p>
                            {selectedRx.medications?.map((med, i) => (
                                <div key={i} style={{ background: '#f8fafb', border: '1px solid #e8ecf0', borderRadius: '10px', padding: '12px 15px', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '800' }}>{i + 1}. {med.medicationName}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#138C9F', background: '#fff', padding: '2px 8px', borderRadius: '6px' }}>{med.dosage}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
                                        <span>{med.frequency} مرات</span>
                                        <span style={{ margin: '0 8px' }}>|</span>
                                        <span>المدة: {med.duration}</span>
                                        {med.instructions && <><span style={{ margin: '0 8px' }}>|</span><span>{med.instructions}</span></>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #C3C6D6', marginTop: '30px', paddingTop: '15px', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: '#999' }}>تم إنشاء هذه الوصفة عبر منصة طبيبي - Tabibi Platform</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPrescriptions;
