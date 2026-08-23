import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

const MedicalFile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [medicalHistoryData, setMedicalHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientRes, historyRes] = await Promise.all([
                    axiosInstance.get(`/doctor/appointments/patient/${id}`),
                    axiosInstance.get(`/doctor/appointments/patient/${id}/medical-history`),
                ]);

                if (patientRes.data.succeeded && patientRes.data.data) {
                    setPatient(patientRes.data.data);
                }

                if (historyRes.data.succeeded && historyRes.data.data) {
                    setMedicalHistoryData(historyRes.data.data);
                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getPatientImage = () => {
        if (!patient?.profileImageUrl) return null;
        if (patient.profileImageUrl.startsWith("http")) return patient.profileImageUrl;
        return `${FILES_URL}/${patient.profileImageUrl}`;
    };

    const calculateAge = (dob) => {
        if (!dob) return "غير محدد";
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return `${age} سنة`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ecf8fa] font-['Tajawal'] flex items-center justify-center" dir="rtl">
                <p className="text-gray-400 font-bold text-lg">جاري تحميل السجل المرضي...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-[#ecf8fa] font-['Tajawal'] flex items-center justify-center" dir="rtl">
                <p className="text-gray-400 font-bold text-lg">لم يتم العثور على بيانات المريض</p>
            </div>
        );
    }

    const patientImage = getPatientImage();
    const patientAge = calculateAge(patient.dateOfBirthRaw);

    return (
        <div className="min-h-screen bg-[#ecf8fa] font-['Tajawal'] pr-6" dir="rtl">
            <div className="space-y-6">

                <div className="flex flex-col gap-1 text-right">
                    <button onClick={() => navigate(-1)} className="text-[#138C9F] font-bold text-sm hover:underline text-right w-fit cursor-pointer">
                        العودة
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#138C9F] flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-[#138C9F]">السجل المرضي الشخصي</h1>
                            <p className="text-sm font-semibold text-gray-500">البيانات الطبية الخاصة بالمريض {patient.fullName}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">فصيلة الدم</span>
                        <span className="text-lg font-black text-[#0B1C30]">{medicalHistoryData?.bloodType || "—"}</span>
                    </div>
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">ضغط الدم</span>
                        <span className="text-lg font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.bloodPressure || "—"}</span>
                    </div>
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">سكر الدم</span>
                        <span className="text-lg font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.bloodSugar ? `mg/dL ${medicalHistoryData.vitals.bloodSugar}` : "—"}</span>
                    </div>
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">الوزن</span>
                        <span className="text-lg font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.weight ? `${medicalHistoryData.vitals.weight} كجم` : "—"}</span>
                    </div>
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">الطول</span>
                        <span className="text-lg font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.height ? `${medicalHistoryData.vitals.height} سم` : "—"}</span>
                    </div>
                    <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 text-center">
                        <span className="text-xs text-gray-400 font-bold block mb-1">مدة التدخين</span>
                        <span className="text-sm font-bold text-[#0B1C30]">{medicalHistoryData?.isSmoker ? "مدخن" : "غير مدخن"}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center gap-2 text-amber-600 font-black text-base border-b pb-2">
                            <span>⚠️</span> <h3>الأمراض المزمنة</h3>
                        </div>
                        {medicalHistoryData?.chronicDiseases?.filter(d => d !== "لا يوجد").length > 0
                            ? medicalHistoryData.chronicDiseases.filter(d => d !== "لا يوجد").map((disease, idx) => (
                                <div key={idx} className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-xl">
                                    <h4 className="font-bold text-gray-800 text-sm">{disease}</h4>
                                </div>
                            ))
                            : <p className="text-sm text-gray-400 font-bold">لا توجد أمراض مزمنة مسجلة</p>
                        }
                    </div>

                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-base border-b pb-2">
                            <span>🚫</span> <h3>الحساسية الغذائية والدوائية</h3>
                        </div>
                        {medicalHistoryData?.allergies?.filter(a => a !== "لا يوجد").length > 0
                            ? medicalHistoryData.allergies.filter(a => a !== "لا يوجد").map((allergy, idx) => (
                                <div key={idx} className="p-4 bg-rose-50/40 border border-rose-200/60 border-r-4 border-r-red-500 rounded-xl">
                                    <h4 className="font-bold text-rose-700 text-sm">{allergy}</h4>
                                </div>
                            ))
                            : <p className="text-sm text-gray-400 font-bold">لا توجد حساسية مسجلة</p>
                        }
                    </div>
                </div>

                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs">
                    <div className="flex items-center gap-2 text-[#138C9F] font-black text-base border-b pb-2">
                        <span>💊</span> <h3>الأدوية والمعلومات الطبية الملتزم بها</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">اسم الدواء/العلمي</th>
                                    <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">الجرعة اليومية</th>
                                    <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">التكرار والاستخدام</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicalHistoryData?.currentMedicines?.filter(m => m.name !== "لا يوجد").length > 0
                                    ? medicalHistoryData.currentMedicines.filter(m => m.name !== "لا يوجد").map((med, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0">
                                            <td className="p-3 md:p-4 font-bold text-[#0B1C30]">{med.name}</td>
                                            <td className="p-3 md:p-4 font-bold text-gray-600">{med.dosage || "—"}</td>
                                            <td className="p-3 md:p-4 font-bold text-gray-600">{med.frequency || "—"}</td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="3" className="p-3 md:p-4 text-center text-gray-400 font-bold">لا يوجد أدوية مسجلة</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MedicalFile;
