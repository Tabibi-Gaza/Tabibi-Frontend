import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import { FiSliders } from 'react-icons/fi';
import { faQrcode, faPenToSquare, faFloppyDisk, faPlus, faTrashAlt, faSmoking, faBanSmoking, faVirus, faTriangleExclamation, faCapsules } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from "../../api/axiosInstance";
import { resolveImageUrl } from "../../utils/imageUrl";
import { formatDate as formatDateDdMmYyyy } from "../../utils/dateFormatter";

const FILES_URL = import.meta.env.VITE_Files_URL || "";

const MedicalExamination = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [patient, setPatient] = useState(null);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [medicalHistoryData, setMedicalHistoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDoctorId, setCurrentDoctorId] = useState(null);

    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'examination');
    const [examinationData, setExaminationData] = useState({ symptoms: '', clinicalNotes: '', diagnosis: '' });
    const [currentMed, setCurrentMed] = useState({ name: '', dosage: '', frequency: '', duration: '' });
    const [addedMedicines, setAddedMedicines] = useState([]);
    const [historyFilter, setHistoryFilter] = useState({ date: '', diagnosis: '' });
    const [showQrModal, setShowQrModal] = useState(false);
    const [qrToken, setQrToken] = useState('');
    const [qrExpiry, setQrExpiry] = useState('');
    const [generatingQr, setGeneratingQr] = useState(false);

    // حالات تعديل السجل المرضي الشخصي للطبيب
    const [editingMedicalHistory, setEditingMedicalHistory] = useState(false);
    const [savingMedicalHistory, setSavingMedicalHistory] = useState(false);
    const [mhBloodType, setMhBloodType] = useState('');
    const [mhBloodPressure, setMhBloodPressure] = useState('');
    const [mhBloodSugar, setMhBloodSugar] = useState('');
    const [mhWeight, setMhWeight] = useState('');
    const [mhHeight, setMhHeight] = useState('');
    const [mhIsSmoker, setMhIsSmoker] = useState(false);
    const [mhChronicDiseases, setMhChronicDiseases] = useState([]);
    const [mhDiseaseInput, setMhDiseaseInput] = useState('');
    const [mhAllergies, setMhAllergies] = useState([]);
    const [mhAllergyInput, setMhAllergyInput] = useState('');
    const [mhCurrentMedicines, setMhCurrentMedicines] = useState([]);
    const [mhMedName, setMhMedName] = useState('');
    const [mhMedDosage, setMhMedDosage] = useState('');
    const [mhMedFrequency, setMhMedFrequency] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientRes = await axiosInstance.get(`/doctor/appointments/patient/${id}`);

                if (patientRes.data.succeeded && patientRes.data.data) {
                    setPatient(patientRes.data.data);
                } else {

                }

                try {
                    const recordsRes = await axiosInstance.get("/doctor/medical-records");
                    if (recordsRes.data.succeeded && recordsRes.data.data) {
                        const filtered = recordsRes.data.data.filter(r => r.patientId === id);
                        setMedicalRecords(filtered);
                        setMedicalHistory(filtered);
                    }
                    if (recordsRes.data.currentDoctorId) {
                        setCurrentDoctorId(recordsRes.data.currentDoctorId);
                        localStorage.setItem('doctorId', recordsRes.data.currentDoctorId);
                    }
                } catch (e) {

                }

                try {
                    const historyRes = await axiosInstance.get(`/doctor/appointments/patient/${id}/medical-history`);
                    if (historyRes.data.succeeded && historyRes.data.data) {
                        setMedicalHistoryData(historyRes.data.data);
                    }
                } catch (e) {

                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const filteredMedicalHistory = useMemo(() => {
        return medicalHistory.filter(visit => {
            if (historyFilter.date) {
                const visitDate = new Date(visit.visitDate).toISOString().split('T')[0];
                if (visitDate !== historyFilter.date) return false;
            }
            if (historyFilter.diagnosis) {
                if (visit.doctorSpecialization !== historyFilter.diagnosis) return false;
            }
            return true;
        });
    }, [medicalHistory, historyFilter]);

    const getPatientImage = () => {
        return resolveImageUrl(patient?.profileImageUrl);
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

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        } catch { return ""; }
    };

    const generateQrForPatient = async () => {
        try {
            setGeneratingQr(true);
            const { data } = await axiosInstance.post(`/doctor/medical-records/patients/${id}/qr-token`);
            if (data.succeeded && data.data) {
                setQrToken(data.data.token);
                setQrExpiry(data.data.expiresAt);
                setShowQrModal(true);
            } else {
                toast.error('فشل إنشاء رمز QR');
            }
        } catch {
            toast.error('حدث خطأ أثناء إنشاء رمز QR');
        } finally {
            setGeneratingQr(false);
        }
    };

    const qrUrl = qrToken ? `${window.location.origin}/qr/${encodeURIComponent(qrToken)}` : '';

    const handleDeleteRecord = async (recordId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا السجل الطبي؟')) return;
        try {
            const res = await axiosInstance.delete(`/doctor/medical-records/${recordId}`);
            if (res.data.succeeded) {
                setMedicalHistory(prev => prev.filter(r => r.id !== recordId));
                toast.success('تم حذف السجل الطبي بنجاح');
            } else {
                toast.error('فشل حذف السجل');
            }
        } catch (err) {
            toast.error('حدث خطأ أثناء الحذف');
        }
    };

    const handleSendPrescription = async (recordId) => {
        try {
            const res = await axiosInstance.post(`/doctor/appointments/medical-records/${recordId}/send-prescription`);
            if (res.data.succeeded) {
                toast.success('تم إرسال الروشتة للمريض بنجاح');
                setMedicalHistory(prev => prev.map(r =>
                    r.id === recordId
                        ? { ...r, prescriptionStatus: 'Sent' }
                        : r
                ));
            } else {
                toast.error(res.data.message || 'فشل إرسال الروشتة');
            }
        } catch (err) {
            toast.error('حدث خطأ أثناء إرسال الروشتة');
        }
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setExaminationData(prev => ({ ...prev, [name]: value }));
    };

    const handleMedInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentMed(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMedicine = (e) => {
        e.preventDefault();
        if (!currentMed.name.trim()) return;
        const newMed = {
            id: Date.now(),
            name: currentMed.name,
            dosage: currentMed.dosage || '500 ملغ',
            frequency: currentMed.frequency || '3 مرات يومياً',
            duration: currentMed.duration || '7 أيام',
        };
        setAddedMedicines(prev => [...prev, newMed]);
        setCurrentMed({ name: '', dosage: '', frequency: '', duration: '' });
    };

    const handleSaveExamination = async () => {
        try {
            const payload = {
                patientId: id,
                symptoms: examinationData.symptoms,
                diagnosis: examinationData.diagnosis,
                clinicalNotes: examinationData.clinicalNotes,
                medicines: addedMedicines.map(m => ({
                    name: m.name,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    duration: m.duration,
                })),
            };

            const res = await axiosInstance.post("/doctor/appointments/complete-examination", payload);

            if (res.data.succeeded) {
                setExaminationData({ symptoms: '', clinicalNotes: '', diagnosis: '' });
                setAddedMedicines([]);

                try {
                    const recordsRes = await axiosInstance.get("/doctor/medical-records");
                    if (recordsRes.data.succeeded && recordsRes.data.data) {
                        const filtered = recordsRes.data.data.filter(r => r.patientId === id);
                        setMedicalRecords(filtered);
                        setMedicalHistory(filtered);
                    }
                    if (recordsRes.data.currentDoctorId) {
                        setCurrentDoctorId(recordsRes.data.currentDoctorId);
                    }
                } catch (e) {}

                try {
                    const historyRes = await axiosInstance.get(`/doctor/appointments/patient/${id}/medical-history`);
                    if (historyRes.data.succeeded && historyRes.data.data) {
                        setMedicalHistoryData(historyRes.data.data);
                    }
                } catch (e) {}

                setActiveTab('medical_file');
                toast.success('تم حفظ بيانات الكشف الطبي بنجاح!');
            } else {
                toast.error(res.data.message || "لم يتم الحفظ");
            }
        } catch (err) {

            toast.error("حدث خطأ أثناء حفظ البيانات");
        }
    };

    const handleStartEditMedicalHistory = () => {
        if (medicalHistoryData) {
            setMhBloodType(medicalHistoryData.bloodType || '');
            setMhBloodPressure(medicalHistoryData.vitals?.bloodPressure || '');
            setMhBloodSugar(medicalHistoryData.vitals?.bloodSugar || '');
            setMhWeight(medicalHistoryData.vitals?.weight || '');
            setMhHeight(medicalHistoryData.vitals?.height || '');
            setMhIsSmoker(medicalHistoryData.isSmoker || false);
            setMhChronicDiseases(medicalHistoryData.chronicDiseases || []);
            setMhAllergies(medicalHistoryData.allergies || []);
            setMhCurrentMedicines(medicalHistoryData.currentMedicines || []);
        } else {
            setMhBloodType('');
            setMhBloodPressure('');
            setMhBloodSugar('');
            setMhWeight('');
            setMhHeight('');
            setMhIsSmoker(false);
            setMhChronicDiseases([]);
            setMhAllergies([]);
            setMhCurrentMedicines([]);
        }
        setEditingMedicalHistory(true);
    };

    const handleSaveMedicalHistory = async () => {
        try {
            setSavingMedicalHistory(true);
            const payload = {
                bloodType: mhBloodType,
                isSmoker: mhIsSmoker,
                bloodPressure: mhBloodPressure,
                bloodSugar: mhBloodSugar,
                weight: mhWeight ? Number(mhWeight) : null,
                height: mhHeight ? Number(mhHeight) : null,
                chronicDiseases: mhChronicDiseases,
                allergies: mhAllergies,
                currentMedicines: mhCurrentMedicines,
                hasInflammations: medicalHistoryData?.hasInflammations || false,
                hasMentalIllness: medicalHistoryData?.hasMentalIllness || false,
                hasEpilepsyOrSeizures: medicalHistoryData?.hasEpilepsyOrSeizures || false,
                inflammationDetails: medicalHistoryData?.inflammationDetails || '',
            };
            const res = await axiosInstance.put(`/doctor/appointments/patient/${id}/medical-history`, payload);
            if (res.data.succeeded) {
                toast.success('تم تحديث السجل المرضي الشخصي بنجاح!');
                setEditingMedicalHistory(false);
                try {
                    const historyRes = await axiosInstance.get(`/doctor/appointments/patient/${id}/medical-history`);
                    if (historyRes.data.succeeded && historyRes.data.data) {
                        setMedicalHistoryData(historyRes.data.data);
                    }
                } catch (e) {}
            } else {
                toast.error(res.data.message || 'فشل تحديث السجل المرضي');
            }
        } catch (err) {
            toast.error('حدث خطأ أثناء تحديث السجل المرضي');
        } finally {
            setSavingMedicalHistory(false);
        }
    };

    const addMhDisease = () => {
        if (mhDiseaseInput.trim() && !mhChronicDiseases.includes(mhDiseaseInput.trim())) {
            setMhChronicDiseases([...mhChronicDiseases, mhDiseaseInput.trim()]);
            setMhDiseaseInput('');
        }
    };

    const removeMhDisease = (item) => {
        setMhChronicDiseases(mhChronicDiseases.filter(d => d !== item));
    };

    const addMhAllergy = () => {
        if (mhAllergyInput.trim() && !mhAllergies.includes(mhAllergyInput.trim())) {
            setMhAllergies([...mhAllergies, mhAllergyInput.trim()]);
            setMhAllergyInput('');
        }
    };

    const removeMhAllergy = (item) => {
        setMhAllergies(mhAllergies.filter(a => a !== item));
    };

    const addMhMedicine = () => {
        if (mhMedName.trim() && mhMedDosage.trim() && mhMedFrequency.trim()) {
            setMhCurrentMedicines([...mhCurrentMedicines, {
                name: mhMedName.trim(),
                dosage: mhMedDosage.trim(),
                frequency: mhMedFrequency.trim()
            }]);
            setMhMedName('');
            setMhMedDosage('');
            setMhMedFrequency('');
        } else {
            toast.warn("الرجاء ملء حقول الدواء بالكامل");
        }
    };

    const removeMhMedicine = (index) => {
        setMhCurrentMedicines(mhCurrentMedicines.filter((_, idx) => idx !== index));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ecf8fa] flex items-center justify-center" dir="rtl">
                <p className="text-gray-400 font-bold text-lg">جاري تحميل بيانات المريض...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-[#ecf8fa] flex items-center justify-center" dir="rtl">
                <p className="text-gray-400 font-bold text-lg">لم يتم العثور على بيانات المريض</p>
            </div>
        );
    }

    const patientImage = getPatientImage();
    const patientAge = calculateAge(patient.dateOfBirthRaw);

    return (
        <div className="min-h-screen bg-[#ecf8fa] flex" dir="rtl">
            <div className="flex-1 flex flex-col min-w-0">
                <main className="p-4 md:p-8 max-w-[1240px] w-full mx-auto space-y-6 overflow-y-auto">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-black text-[#138C9F]">
                            {activeTab === 'examination' && 'بدء الكشف الطبي'}
                            {activeTab === 'patient_record' && 'السجل المرضي الشخصي'}
                            {activeTab === 'medical_file' && 'التاريخ الطبي'}
                        </h1>
                        {activeTab === 'examination' && (
                            <button onClick={handleSaveExamination} className="bg-[#138C9F] hover:bg-[#0f6f7f] text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer">
                                💾 حفظ وإنهاء الكشف
                            </button>
                        )}
                    </div>

                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-12 w-full lg:w-auto">
                            <div className="flex items-center gap-4">
                                {patientImage ? (
                                    <img loading="lazy" decoding="async" width="64" height="64" src={patientImage} alt={patient.fullName} className="w-16 h-16 rounded-2xl object-cover border border-[#C3C6D6]" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                ) : null}
                                <div className={`w-16 h-16 rounded-2xl bg-[#C4D2FF] text-[#0B1C30] items-center justify-center font-black text-lg ${patientImage ? 'hidden' : 'flex'}`}>
                                    {(patient.fullName || "م").charAt(0)}
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 font-bold block">اسم المريض</span>
                                    <span className="text-base md:text-lg font-black text-[#0B1C30]">{patient.fullName}</span>
                                </div>
                            </div>
                            <div className="text-right"><span className="text-xs text-gray-400 font-bold block">العمر</span><span className="text-base font-bold text-[#0B1C30]">{patientAge}</span></div>
                            <div className="text-right"><span className="text-xs text-gray-400 font-bold block">فصيلة الدم</span><span className="text-base font-bold text-[#0B1C30]">{patient.bloodType || "غير معروف"}</span></div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
                            <button onClick={() => setActiveTab('examination')} className={`h-10 px-4 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer ${activeTab === 'examination' ? 'bg-[#138C9F] text-white' : 'border border-[#138C9F] text-[#138C9F]'}`}>شاشة الكشف الحالية</button>
                            <button onClick={() => setActiveTab('patient_record')} className={`h-10 px-4 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer ${activeTab === 'patient_record' ? 'bg-[#138C9F] text-white' : 'border border-[#138C9F] text-[#138C9F]'}`}>السجل المرضي الشخصي</button>
                            <button onClick={() => setActiveTab('medical_file')} className={`h-10 px-4 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer ${activeTab === 'medical_file' ? 'bg-[#138C9F] text-white' : 'border border-[#138C9F] text-[#138C9F]'}`}>التاريخ الطبي</button>
                            <button onClick={generateQrForPatient} disabled={generatingQr} className="h-10 px-4 rounded-xl border border-[#138C9F] text-[#138C9F] hover:bg-[#138C9F] hover:text-white disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-bold text-xs md:text-sm" title="إنشاء رمز QR للسجل الطبي">
                                <FontAwesomeIcon icon={faQrcode} className="text-base" />
                                {generatingQr ? 'جاري الإنشاء...' : 'رمز QR للسجل'}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'examination' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-3">
                                    <div className="flex items-center gap-2 text-[#138C9F] font-black text-base"><span>📝</span> <h3>الأعراض</h3></div>
                                    <textarea name="symptoms" value={examinationData.symptoms} onChange={handleTextChange} placeholder="أدخل الأعراض هنا..." className="w-full h-32 p-4 border border-[#C3C6D6] rounded-xl text-sm font-semibold focus:outline-hidden focus:border-[#138C9F] resize-none" />
                                </div>
                                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-3">
                                    <div className="flex items-center gap-2 text-[#138C9F] font-black text-base"><span></span> <h3>الملاحظات السريرية</h3></div>
                                    <textarea name="clinicalNotes" value={examinationData.clinicalNotes} onChange={handleTextChange} placeholder="أدخل الملاحظات السريرية هنا..." className="w-full h-32 p-4 border border-[#C3C6D6] rounded-xl text-sm font-semibold focus:outline-hidden focus:border-[#138C9F] resize-none" />
                                </div>
                                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-3">
                                    <div className="flex items-center gap-2 text-[#138C9F] font-black text-base"><span>📋</span> <h3>التشخيص</h3></div>
                                    <textarea name="diagnosis" value={examinationData.diagnosis} onChange={handleTextChange} placeholder="أدخل التشخيص الطبي النهائي هنا..." className="w-full h-32 p-4 border border-[#C3C6D6] rounded-xl text-sm font-semibold focus:outline-hidden focus:border-[#138C9F] resize-none" />
                                </div>
                            </div>

                            <div className="lg:col-span-4 bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-5 shadow-xs">
                                <div className="flex items-center gap-2 text-[#138C9F] font-black text-base border-b pb-3"><span>📋</span> <h3>إنشاء وصفة طبية</h3></div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-xs font-black text-[#0B1C30]">اسم الدواء</label>
                                    <input type="text" name="name" value={currentMed.name} onChange={handleMedInputChange} placeholder="مثلاً: بنادول..." className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl font-semibold text-sm focus:outline-hidden" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5 text-right">
                                        <label className="text-xs font-black text-[#0B1C30]">الجرعة</label>
                                        <input type="text" name="dosage" value={currentMed.dosage} onChange={handleMedInputChange} placeholder="500 ملغ" className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-center text-sm focus:outline-hidden" />
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <label className="text-xs font-black text-[#0B1C30]">التكرار</label>
                                        <input type="text" name="frequency" value={currentMed.frequency} onChange={handleMedInputChange} placeholder="3 مرات" className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-center text-sm focus:outline-hidden" />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <label className="text-xs font-black text-[#0B1C30]">المدة</label>
                                    <input type="text" name="duration" value={currentMed.duration} onChange={handleMedInputChange} placeholder="5 أيام" className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-center text-sm focus:outline-hidden" />
                                </div>
                                <button onClick={handleAddMedicine} className="w-full h-11 bg-[#138C9F] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-[#0f7282] transition-colors cursor-pointer">➕ إضافة إلى الوصفة</button>

                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center"><span className="text-sm font-black text-[#0B1C30]">الأدوية المضافة</span></div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {addedMedicines.map(med => (
                                            <div key={med.id} className="p-3 border border-[#C3C6D6] rounded-xl flex items-center justify-between bg-slate-50/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-[#138C9F] text-sm">💊</div>
                                                    <div className="text-right">
                                                        <h5 className="text-sm font-black text-[#0B1C30]">{med.name}</h5>
                                                        <p className="text-[11px] font-bold text-gray-400">{med.frequency} • {med.duration}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setAddedMedicines(prev => prev.filter(m => m.id !== med.id))} className="text-red-400 hover:text-red-600 text-sm cursor-pointer px-2">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'patient_record' && (
                        <div className="space-y-6">
                            {/* زر تعديل السجل المرضي */}
                            {!editingMedicalHistory && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleStartEditMedicalHistory}
                                        className="bg-[#138C9F] hover:bg-[#0f7282] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-xs flex items-center gap-2 cursor-pointer"
                                    >
                                        تعديل السجل المرضي الشخصي
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                </div>
                            )}

                            {/* واجهة العرض */}
                            {!editingMedicalHistory ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
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

                                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
                                        <div className="flex items-center gap-2 text-[#138C9F] font-black text-base border-b pb-2">
                                            <span>📊</span> <h3>القياسات الحيوية</h3>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <span className="text-xs text-gray-400 font-bold block">ضغط الدم</span>
                                                <span className="text-sm font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.bloodPressure || "—"}</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <span className="text-xs text-gray-400 font-bold block">سكر الدم</span>
                                                <span className="text-sm font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.bloodSugar || "—"}</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <span className="text-xs text-gray-400 font-bold block">الوزن</span>
                                                <span className="text-sm font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.weight ? `${medicalHistoryData.vitals.weight} كغ` : "—"}</span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-xl text-center">
                                                <span className="text-xs text-gray-400 font-bold block">الطول</span>
                                                <span className="text-sm font-black text-[#0B1C30]">{medicalHistoryData?.vitals?.height ? `${medicalHistoryData.vitals.height} سم` : "—"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
                                        <div className="flex items-center gap-2 text-[#138C9F] font-black text-base border-b pb-2">
                                            <span>🚬</span> <h3>التدخين ونمط الحياة</h3>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 p-2">{medicalHistoryData?.isSmoker ? "مدخن" : "غير مدخن"}</p>
                                    </div>

                                    <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 space-y-4 shadow-xs md:col-span-2">
                                        <div className="flex items-center gap-2 text-[#138C9F] font-black text-base border-b pb-2">
                                                <span>💊</span> <h3>الأدوية والمعلومات الطبية الملتزم بها</h3>
                                            </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-100">
                                                        <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">اسم الدواء/العلمي</th>
                                                        <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">الجرعة</th>
                                                        <th className="p-3 md:p-4 text-right font-black text-[#0B1C30]">التكرار</th>
                                                        <th className="hidden md:table-cell p-3 md:p-4 text-right font-black text-[#0B1C30]">المدة</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {medicalHistoryData?.currentMedicines?.filter(m => m.name !== "لا يوجد").length > 0
                                                        ? medicalHistoryData.currentMedicines.filter(m => m.name !== "لا يوجد").map((med, idx) => (
                                                            <tr key={idx} className="border-b border-gray-50 last:border-0">
                                                                <td className="p-3 md:p-4 font-bold text-[#0B1C30]">{med.name}</td>
                                                                <td className="p-3 md:p-4 font-bold text-gray-600">{med.dosage || "—"}</td>
                                                                <td className="p-3 md:p-4 font-bold text-gray-600">{med.frequency || "—"}</td>
                                                                <td className="hidden md:table-cell p-3 md:p-4 font-bold text-gray-600">{med.duration || "—"}</td>
                                                            </tr>
                                                        ))
                                                        : <tr><td colSpan="4" className="p-3 md:p-4 text-center text-gray-400 font-bold">لا يوجد أدوية مسجلة</td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* واجهة التعديل */
                                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
                                    <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faPenToSquare} className="text-[#138C9F]" />
                                                تعديل السجل المرضي الشخصي
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-1">تعديل البيانات الطبية للمريض</p>
                                        </div>
                                    </div>

                                    {/* 1. القياسات الحيوية وفصيلة الدم */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-1.5">فصيلة الدم</label>
                                            <select value={mhBloodType} onChange={(e) => setMhBloodType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F] text-gray-700">
                                                <option value="">اختر الفصيلة...</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-1.5">ضغط الدم (مثال: 120/80)</label>
                                            <input type="text" value={mhBloodPressure} onChange={(e) => setMhBloodPressure(e.target.value)} placeholder="120/80" className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-1.5">سكر الدم (mg/dL)</label>
                                            <input type="number" value={mhBloodSugar} onChange={(e) => setMhBloodSugar(e.target.value)} placeholder="105" className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-1.5">الوزن (كجم)</label>
                                            <input type="number" value={mhWeight} onChange={(e) => setMhWeight(e.target.value)} placeholder="75" className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-1.5">الطول (سم)</label>
                                            <input type="number" value={mhHeight} onChange={(e) => setMhHeight(e.target.value)} placeholder="170" className="w-full bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-700 mb-2">هل المريض مدخن؟</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setMhIsSmoker(true)} className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${mhIsSmoker ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white text-gray-500 border-gray-200"}`}>
                                                    <FontAwesomeIcon icon={faSmoking} /> نعم
                                                </button>
                                                <button type="button" onClick={() => setMhIsSmoker(false)} className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${!mhIsSmoker ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-gray-500 border-gray-200"}`}>
                                                    <FontAwesomeIcon icon={faBanSmoking} /> لا
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. الأمراض المزمنة والحساسية */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-gray-100 p-4 rounded-2xl bg-white">
                                            <label className="block text-xs font-black text-gray-800 mb-1.5">
                                                <FontAwesomeIcon icon={faVirus} className="text-blue-500" /> إضافة مرض مزمن
                                            </label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={mhDiseaseInput} onChange={(e) => setMhDiseaseInput(e.target.value)} placeholder="مثال: السكري، ضغط الدم..." className="flex-1 border border-gray-200 rounded-xl px-3 h-11 text-xs font-medium focus:outline-none focus:border-[#138C9F]" />
                                                <button type="button" onClick={addMhDisease} className="bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282] cursor-pointer">إضافة</button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                {mhChronicDiseases.length > 0 ? mhChronicDiseases.map((disease, idx) => (
                                                    <span key={idx} className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                        {disease}
                                                        <button type="button" onClick={() => removeMhDisease(disease)} className="text-blue-400 hover:text-red-500 font-black text-[10px] cursor-pointer">✕</button>
                                                    </span>
                                                )) : <span className="text-[11px] text-gray-400 italic p-1">لم يتم إدراج أي مرض بعد...</span>}
                                            </div>
                                        </div>
                                        <div className="border border-gray-100 p-4 rounded-2xl bg-white">
                                            <label className="block text-xs font-black text-gray-800 mb-1.5">
                                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" /> إضافة حساسية
                                            </label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={mhAllergyInput} onChange={(e) => setMhAllergyInput(e.target.value)} placeholder="مثال: بنسلين، الفول السوداني..." className="flex-1 border border-gray-200 rounded-xl px-3 h-11 text-xs font-medium focus:outline-none focus:border-[#138C9F]" />
                                                <button type="button" onClick={addMhAllergy} className="bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282] cursor-pointer">إضافة</button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                {mhAllergies.length > 0 ? mhAllergies.map((allergy, idx) => (
                                                    <span key={idx} className="bg-red-50 text-red-600 border border-red-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                                                        {allergy}
                                                        <button type="button" onClick={() => removeMhAllergy(allergy)} className="text-red-400 hover:text-red-600 font-black text-[10px] cursor-pointer">✕</button>
                                                    </span>
                                                )) : <span className="text-[11px] text-gray-400 italic p-1">لم يتم إدراج أي حساسية بعد...</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. الأدوية الحالية */}
                                    <div className="border border-gray-100 p-4 rounded-2xl bg-white space-y-4">
                                        <h3 className="text-xs font-black text-gray-800 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCapsules} className="text-[#138C9F]" />
                                            إدارة الأدوية الحالية
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                                            <input type="text" value={mhMedName} onChange={(e) => setMhMedName(e.target.value)} placeholder="اسم الدواء" className="bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                            <input type="text" value={mhMedDosage} onChange={(e) => setMhMedDosage(e.target.value)} placeholder="الجرعة" className="bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                            <div className="flex gap-2">
                                                <input type="text" value={mhMedFrequency} onChange={(e) => setMhMedFrequency(e.target.value)} placeholder="التكرار" className="flex-1 bg-white border border-gray-200 rounded-xl px-3 h-11 text-xs font-bold focus:outline-none focus:border-[#138C9F]" />
                                                <button type="button" onClick={addMhMedicine} className="bg-[#138C9F] hover:bg-[#0f6b7a] text-white px-3.5 rounded-xl text-xs font-black transition-colors cursor-pointer">
                                                    <FontAwesomeIcon icon={faPlus} /> إدراج
                                                </button>
                                            </div>
                                        </div>
                                        {mhCurrentMedicines.length > 0 && (
                                            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                                <table className="w-full text-right text-xs border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-gray-500 font-bold border-b border-gray-100">
                                                            <th className="p-3">الدواء</th>
                                                            <th className="p-3">الجرعة</th>
                                                            <th className="p-3">التكرار</th>
                                                            <th className="p-3 text-center" style={{ width: "50px" }}>حذف</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {mhCurrentMedicines.map((med, idx) => (
                                                            <tr key={idx} className="border-b border-gray-50/60 font-bold text-gray-700">
                                                                <td className="p-3 text-[#138C9F]">{med.name}</td>
                                                                <td className="p-3">{med.dosage}</td>
                                                                <td className="p-3 text-gray-500">{med.frequency}</td>
                                                                <td className="p-3 text-center">
                                                                    <button type="button" onClick={() => removeMhMedicine(idx)} className="text-red-500 font-bold hover:text-red-700 text-sm cursor-pointer">
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    {/* أزرار الحفظ والإلغاء */}
                                    <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
                                        <button type="button" onClick={() => setEditingMedicalHistory(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-black transition-colors cursor-pointer">إلغاء</button>
                                        <button type="button" onClick={handleSaveMedicalHistory} disabled={savingMedicalHistory} className="bg-[#138C9F] hover:bg-[#0f7282] disabled:bg-gray-300 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all duration-200 cursor-pointer">
                                            <FontAwesomeIcon icon={faFloppyDisk} />
                                            <span className="mr-1">{savingMedicalHistory ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'medical_file' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-[#C3C6D6]/80 rounded-2xl p-5 shadow-xs">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-4 flex flex-col gap-2 text-right">
                                        <label className="text-xs font-black text-[#0B1C30]">بحث حسب التاريخ</label>
                                        <input className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-sm focus:outline-none focus:border-[#138C9F]" type="date" value={historyFilter.date} onChange={(e) => setHistoryFilter(prev => ({ ...prev, date: e.target.value }))} />
                                    </div>
                                    <div className="md:col-span-4 flex flex-col gap-2 text-right">
                                        <label className="text-xs font-black text-[#0B1C30]">التخصص</label>
                                        <select className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-sm font-bold bg-white focus:outline-none focus:border-[#138C9F]" value={historyFilter.diagnosis} onChange={(e) => setHistoryFilter(prev => ({ ...prev, diagnosis: e.target.value }))}>
                                            <option value="">الكل</option>
                                            {[...new Set(medicalHistory.map(v => v.doctorSpecialization).filter(Boolean))].map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-4 flex gap-3">
                                        <button type="button" className="flex-1 h-11 bg-[#138C9F] text-white font-bold rounded-xl text-sm shadow-xs cursor-pointer">تطبيق الفلاتر</button>
                                        <button type="button" onClick={() => setHistoryFilter({ date: '', diagnosis: '' })} className="flex-1 h-11 border-2 border-[#138C9F] text-[#138C9F] font-bold rounded-xl text-sm hover:bg-gray-50 cursor-pointer">إعادة ضبط</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {filteredMedicalHistory.length > 0 ? filteredMedicalHistory.map((visit, idx) => {
                                    const visitDate = new Date(visit.visitDate);
                                    const dayNum = String(visitDate.getDate()).padStart(2, '0');
                                    const monthNum = String(visitDate.getMonth() + 1).padStart(2, '0');
                                    const yearNum = visitDate.getFullYear();
                                    const timeStr = visitDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
                                    return (
                                        <div key={visit.id || idx} className="bg-white border border-[#C3C6D6]/80 rounded-2xl overflow-hidden shadow-xs">
                                            <div className="bg-[#EBF3F5] px-4 py-3 md:px-6 flex items-center justify-between border-b border-[#C3C6D6]/80">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-[#138C9F] text-white rounded-lg p-2 flex flex-col items-center justify-center min-w-[70px] h-[64px]">
                                                        <span className="text-xl font-black leading-none">{dayNum}/{monthNum}</span>
                                                        <span className="text-xs font-bold mt-1 leading-none">{yearNum}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <h3 className="text-base md:text-lg font-black text-[#138C9F]">زيارة طبية</h3>
                                                        <p className="text-xs font-bold text-gray-400 mt-0.5">الساعة {timeStr}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#BCE3E6] text-[#138C9F] font-bold text-xs px-4 py-1.5 rounded-full">منتهية</span>
                                                    {String(visit.doctorId) === String(currentDoctorId) && (
                                                        <button onClick={() => handleDeleteRecord(visit.id)} title="حذف السجل" className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer border border-red-200">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                <div className="lg:col-span-8 space-y-4 text-right">
                                                    <div className="flex flex-col gap-2">
                                                        <span className="text-lg font-black text-[#138C9F] pb-2 flex gap-2 items-center">
                                                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                            اسم الطبيب
                                                        </span>
                                                        <p className="text-sm font-black text-[#0B1C30] mt-0.5">
                                                            {visit.doctorName || patient.doctorName || 'الطبيب المعالج'}
                                                        </p>
                                                        <p className="text-xs font-bold text-[#138C9F]">{visit.doctorSpecialization || ''}</p>
                                                    </div>
                                                    {visit.symptoms && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-lg font-black text-[#138C9F] pb-2 flex gap-2 items-center">
                                                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                                                الأعراض
                                                            </span>
                                                            <p className="text-sm font-bold text-[#0B1C30] mt-0.5">{visit.symptoms}</p>
                                                        </div>
                                                    )}
                                                    {visit.diagnosis && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-lg font-black text-[#138C9F] pb-2 flex gap-2 items-center">
                                                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                                                التشخيص
                                                            </span>
                                                            <p className="text-sm font-bold text-[#0B1C30] mt-0.5">{visit.diagnosis}</p>
                                                        </div>
                                                    )}
                                                    {visit.visitNotes && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-lg font-black text-[#138C9F] pb-2 flex gap-2 items-center">
                                                                📝 الملاحظات
                                                            </span>
                                                            <p className="text-sm font-bold text-[#0B1C30] mt-0.5">{visit.visitNotes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {visit.prescribedMedications?.length > 0 && (
                                                    <div className="lg:col-span-4 flex items-start justify-start lg:justify-end">
                                                        <div className="w-full max-w-[280px] border border-dashed border-[#C3C6D6] rounded-xl bg-[#FDFDFD]">
                                                            <span className="text-lg p-4 font-black text-[#138C9F] block mb-3 border-b border-dashed border-[#C3C6D6] pb-2 flex gap-2 items-center justify-center">
                                                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                                الوصفة الطبية
                                                            </span>
                                                            <div className="p-4">
                                                                <div className="space-y-3">
                                                                    {visit.prescribedMedications.map((med, i) => (
                                                                        <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                                                            <div className="flex justify-between items-center text-xs font-bold mb-1">
                                                                                <span className="text-[#0B1C30]">{med.medicationName}</span>
                                                                                <span className="text-[#138C9F]">{med.dosage || ''}</span>
                                                                            </div>
                                                                            <div className="flex gap-2 text-[10px] text-gray-400">
                                                                                {med.frequency && <span>{med.frequency}</span>}
                                                                                {med.duration && <span>• {med.duration}</span>}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {visit.prescriptionStatus === 'Sent' ? (
                                                                <div className="px-4 pb-4">
                                                                    <div className="w-full py-2.5 rounded-xl bg-green-50 text-green-600 text-xs font-bold text-center border border-green-200 mb-2">
                                                                        تم الإرسال للمريض ✓
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleSendPrescription(visit.id)}
                                                                        className="w-full py-2.5 rounded-xl bg-[#138C9F] text-white text-xs font-bold cursor-pointer hover:bg-[#0f7585] transition-all shadow-xs">
                                                                        إعادة إرسال الروشتة
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="px-4 pb-4">
                                                                    <button
                                                                        onClick={() => handleSendPrescription(visit.id)}
                                                                        className="w-full py-2.5 rounded-xl bg-[#138C9F] text-white text-xs font-bold cursor-pointer hover:bg-[#0f7585] transition-all shadow-xs">
                                                                        إرسال وتصدير الروشتة
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="bg-white border border-[#C3C6D6]/80 rounded-2xl p-8 text-center text-gray-400 font-bold text-sm">
                                        لا توجد سجلات كشف طبي سابقة لهذا المريض.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {showQrModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
                                <h3 className="text-lg font-black text-gray-800 mb-2">رمز QR للسجل الطبي</h3>
                                <p className="text-xs text-gray-400 mb-4">امسح هذا الرمز للوصول السريع للسجل المرضي</p>
                                <div className="flex justify-center mb-4 p-4 bg-white rounded-2xl border-2 border-gray-100 inline-block mx-auto">
                                    <QRCodeCanvas value={qrUrl} size={200} level="H" includeMargin={true} />
                                </div>
                                <p className="text-[10px] text-gray-400 mb-4">صالح حتى: {formatDateDdMmYyyy(qrExpiry)}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => window.open(qrUrl, '_blank')} className="flex-1 bg-[#138C9F] hover:bg-[#0f7282] text-white py-2.5 rounded-xl text-xs font-black transition-colors">
                                        فتح الرابط
                                    </button>
                                    <button onClick={() => setShowQrModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-black transition-colors">
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MedicalExamination;
