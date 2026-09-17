import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import { formatDate } from '../utils/dateFormatter';
import { useTranslation } from 'react-i18next';
import {
  faFileMedical,
  faPenToSquare,
  faFolderOpen,
  faNoteSticky,
  faTriangleExclamation,
  faVirus,
  faCapsules,
  faSmoking,
  faBanSmoking,
  faPlus,
  faFloppyDisk,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faQrcode, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MedicalHistory = () => {
    const { token } = useContext(AppContext);
    const { t } = useTranslation();
    
    // حالات التحكم في البيانات والتحميل
    const [recordData, setRecordData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); 
    const [submitting, setSubmitting] = useState(false);

    // QR Code
    const [hasEdited, setHasEdited] = useState(false);
    const [showEditWarning, setShowEditWarning] = useState(false);

    const [showQrModal, setShowQrModal] = useState(false);
    const [qrToken, setQrToken] = useState('');
    const [qrExpiry, setQrExpiry] = useState('');
    const [generatingQr, setGeneratingQr] = useState(false);

    // PDF Download
    const pdfRef = useRef(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // --- الستيت الخاصة بحقول النموذج (Form States) ---
    const [bloodType, setBloodType] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [bloodSugar, setBloodSugar] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [isSmoker, setIsSmoker] = useState(false);

    // التعامل مع الـ Tags ديناميكياً
    const [chronicDiseases, setChronicDiseases] = useState([]);
    const [diseaseInput, setDiseaseInput] = useState('');
    
    const [allergies, setAllergies] = useState([]);
    const [allergyInput, setAllergyInput] = useState('');

    // التعامل مع مصفوفة الأدوية الحالية
    const [currentMedicines, setCurrentMedicines] = useState([]);
    const [medName, setMedName] = useState('');
    const [medDosage, setMedDosage] = useState('');
    const [medFrequency, setMedFrequency] = useState('');

    // --- الـ useEffect مع عزل الدالة لحل مشكلة الـ Linter و الـ Render المتتالي ---
    useEffect(() => {
        const fetchPatientRecord = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/patient/medical-history');
                
                if (data.succeeded && data.data) {
                    setRecordData(data.data);
                    const rec = data.data;
                    
                    // تعبئة الفورم احتياطياً بالبيانات القادمة
                    setBloodType(rec.bloodType || '');
                    setBloodPressure(rec.vitals?.bloodPressure || '');
                    setBloodSugar(rec.vitals?.bloodSugar || '');
                    setWeight(rec.vitals?.weight || '');
                    setHeight(rec.vitals?.height || '');
                    setIsSmoker(rec.isSmoker || false);
                    setChronicDiseases(rec.chronicDiseases || []);
                    setAllergies(rec.allergies || []);
                    setCurrentMedicines(rec.currentMedicines || []);

                    // التحقق مما إذا تم تعديل السجل من قبل
                    const alreadyEdited = localStorage.getItem('medical_history_edited') === 'true';
                    if (alreadyEdited) {
                        setHasEdited(true);
                    } else if (rec.bloodType || rec.chronicDiseases?.length > 0 || rec.allergies?.length > 0 || rec.currentMedicines?.length > 0) {
                        // إذا كانت هناك بيانات، يعني تم التعديل من قبل
                        setHasEdited(true);
                        localStorage.setItem('medical_history_edited', 'true');
                    }
                } else {
                    setRecordData(null);
                }
            } catch (error) {

                setRecordData(null);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPatientRecord();
        }
    }, [token]);

    // --- دوال التحكم بالـ Tags والأدوية داخل الفورم ---
    const addDisease = () => {
        if (diseaseInput.trim() && !chronicDiseases.includes(diseaseInput.trim())) {
            setChronicDiseases([...chronicDiseases, diseaseInput.trim()]);
            setDiseaseInput('');
        }
    };

    const removeDisease = (item) => {
        setChronicDiseases(chronicDiseases.filter(d => d !== item));
    };

    const addAllergy = () => {
        if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
            setAllergies([...allergies, allergyInput.trim()]);
            setAllergyInput('');
        }
    };

    const removeAllergy = (item) => {
        setAllergies(allergies.filter(a => a !== item));
    };

    const addMedicine = () => {
        if (medName.trim() && medDosage.trim() && medFrequency.trim()) {
            setCurrentMedicines([...currentMedicines, {
                name: medName.trim(),
                dosage: medDosage.trim(),
                frequency: medFrequency.trim()
            }]);
            setMedName('');
            setMedDosage('');
            setMedFrequency('');
        } else {
            toast.warn(t('medicalHistory.fillMedicineFields'));
        }
    };

    const removeMedicine = (index) => {
        setCurrentMedicines(currentMedicines.filter((_, idx) => idx !== index));
    };

    // --- إرسال التعديلات إلى الباكيند ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const recordPayload = {
                bloodType,
                isSmoker,
                bloodPressure,
                bloodSugar,
                weight: weight ? Number(weight) : null,
                height: height ? Number(height) : null,
                chronicDiseases,
                allergies,
                currentMedicines
            };

            const { data } = await axiosInstance.put('/patient/medical-history', recordPayload);

            if (data.succeeded) {
                toast.success(t('medicalHistory.updateSuccess'));
                localStorage.setItem('medical_history_edited', 'true');
                setHasEdited(true);
                const { data: freshData } = await axiosInstance.get('/patient/medical-history');
                if (freshData.succeeded && freshData.data) {
                    setRecordData(freshData.data);
                }
                setIsEditing(false);
            } else {
                toast.error(data.errors?.[0]?.message || data.message);
            }
        } catch (error) {

            toast.error(error.response?.data?.errors?.[0]?.message || t('medicalHistory.saveError'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerateQr = async () => {
        try {
            setGeneratingQr(true);
            const { data } = await axiosInstance.post('/qr/generate');
            if (data.succeeded && data.data) {
                setQrToken(data.data.token);
                setQrExpiry(data.data.expiresAt);
                setShowQrModal(true);
            } else {
                toast.error(t('medicalHistory.qrGenerateFailed'));
            }
        } catch {
            toast.error(t('medicalHistory.qrError'));
        } finally {
            setGeneratingQr(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!recordData) return;
        try {
            setGeneratingPdf(true);
            const { default: html2canvas } = await import('html2canvas');
            const { jsPDF } = await import('jspdf');
            if (!pdfRef.current) return;
            const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`medical-record-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success(t('medicalHistory.downloadSuccess'));
        } catch {
            toast.error(t('medicalHistory.pdfFailed'));
        } finally {
            setGeneratingPdf(false);
        }
    };

    const qrUrl = qrToken ? `${window.location.origin}/qr/${encodeURIComponent(qrToken)}` : '';

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-100 pt-40' dir='rtl'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#138C9F]'></div>
                <p className='mr-3 text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500'>{t('medicalHistory.loading')}</p>
            </div>
        );
    }

    return (
      <div
        className='max-w-5xl mx-auto p-4 sm:p-6 mt-40'
        dir="rtl"
      >
        {/* واجهة العرض الافتراضية (View Mode) */}
        {!isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xs overflow-hidden ">
            {/* هيدر الكرت */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-50 bg-radial from-white to-slate-50/40">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="p-2 bg-teal-50 rounded-xl text-[#138C9F] text-lg">
                    <FontAwesomeIcon icon={faFileMedical} />
                  </span>
                  {t('medicalHistory.personalMedicalRecord')}
                </h1>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1.5 mr-1">
                  {t('medicalHistory.lastUpdated')}:{" "}
                  {recordData?.updatedAt
                    ? formatDate(recordData.updatedAt)
                    : t('medicalHistory.notSpecified')}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                <button
                  onClick={handleDownloadPdf}
                  disabled={generatingPdf || !recordData}
                  className="bg-white dark:bg-gray-800 border-2 border-[#138C9F] text-[#138C9F] px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-xs flex items-center gap-2 hover:bg-[#138C9F]/5 disabled:opacity-50"
                >
                  {generatingPdf ? t('medicalHistory.downloading') : t('medicalHistory.downloadPersonalRecord')}
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button
                  onClick={handleGenerateQr}
                  disabled={generatingQr}
                  className="bg-white dark:bg-gray-800 border-2 border-[#138C9F] text-[#138C9F] px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-xs flex items-center gap-2 hover:bg-[#138C9F]/5 disabled:opacity-50"
                >
                  {generatingQr ? t('medicalHistory.generating') : t('medicalHistory.qrCode')}
                  <FontAwesomeIcon icon={faQrcode} />
                </button>
                <button
                  onClick={() => {
                    if (hasEdited) {
                      toast.warn(t('medicalHistory.alreadyEdited'));
                      return;
                    }
                    setShowEditWarning(true);
                  }}
                  className="bg-[#138C9F] hover:bg-[#0f7282] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-xs flex items-center gap-2"
                >
                  {t('medicalHistory.editRecord')}
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
              </div>
            </div>

            {!recordData ? (
              /* حالة السجل فارغ تماماً */
              <div className="flex flex-col items-center justify-center p-6 md:p-12 text-center">
                <div className="w-20 h-20 bg-[#138C9F]/10  rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl text-[#138C9F] opacity-70">
                    <FontAwesomeIcon icon={faFolderOpen} />
                  </span>
                </div>
                <p className="text-gray-400 dark:text-gray-500 font-bold text-md max-w-sm leading-relaxed">
                  {t('medicalHistory.noRecord')}
                </p>
              </div>
            ) : (
              /* عرض تفاصيل السجل الطبي المثالي للعيادة */
              <div className="p-6 space-y-6">
                {/* الصف الأول: المؤشرات الحيوية وفصيلة الدم */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.bloodType')}
                    </p>
                    <p className="text-lg font-black text-red-600">
                      {recordData.bloodType || t('medicalHistory.notSpecified')}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.bloodPressure')}
                    </p>
                    <p className="text-base font-extrabold text-gray-700 dark:text-gray-300">
                      {recordData.vitals?.bloodPressure || "--/--"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.bloodSugar')}
                    </p>
                    <p className="text-base font-extrabold text-gray-700 dark:text-gray-300">
                      {recordData.vitals?.bloodSugar
                        ? `${recordData.vitals.bloodSugar} mg/dL`
                        : "--"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.weight')}
                    </p>
                    <p className="text-base font-extrabold text-gray-700 dark:text-gray-300">
                      {recordData.vitals?.weight
                        ? `${recordData.vitals.weight} ${t('medicalHistory.kg')}`
                        : "--"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.height')}
                    </p>
                    <p className="text-base font-extrabold text-gray-700 dark:text-gray-300">
                      {recordData.vitals?.height
                        ? `${recordData.vitals.height} ${t('medicalHistory.cm')}`
                        : "--"}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-gray-900/60 border border-slate-100 dark:border-gray-700 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">
                      {t('medicalHistory.smokingStatus')}
                    </p>
                    <p
                      className={`text-xs font-black px-2 py-1 inline-block rounded-md mt-1 ${recordData.isSmoker ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-green-50 text-green-600 border border-green-100"}`}
                    >
                      {recordData.isSmoker ? t('medicalHistory.smoker') : t('medicalHistory.nonSmoker')}
                    </p>
                  </div>
                </div>

                {/* الصف الثاني: الأمراض المزمنة والحساسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 dark:border-gray-700 p-5 rounded-2xl bg-white dark:bg-gray-800">
                    <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-1.5">
                      <span className="text-blue-500">🦠</span> {t('medicalHistory.chronicDiseases')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recordData.chronicDiseases &&
                      recordData.chronicDiseases.length > 0 ? (
                        recordData.chronicDiseases.map((disease, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-xl"
                          >
                            {disease}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic mr-1">
                          {t('medicalHistory.noChronicDiseases')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-100 dark:border-gray-700 p-5 rounded-2xl bg-white dark:bg-gray-800">
                    <h3 className="text-sm font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-1.5">
                      <span className="text-red-500">⚠️</span> {t('medicalHistory.allergies')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recordData.allergies &&
                      recordData.allergies.length > 0 ? (
                        recordData.allergies.map((allergy, idx) => (
                          <span
                            key={idx}
                            className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl"
                          >
                            {allergy}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic mr-1">
                          {t('medicalHistory.noAllergies')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* الصف الثالث: الأدوية الحالية */}
                <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                  <div className="p-4 bg-slate-50 dark:bg-gray-900/50 border-b border-gray-50 flex items-center gap-2">
                    <span className="text-teal-600 text-base">💊</span>
                    <h3 className="text-sm font-black text-gray-800 dark:text-gray-200">
                      {t('medicalHistory.currentMedications')}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-black border-b border-gray-100">
                          <th className="p-3 md:p-4">{t('medicalHistory.medicationName')}</th>
                          <th className="p-3 md:p-4">{t('medicalHistory.dosage')}</th>
                          <th className="p-3 md:p-4">{t('medicalHistory.frequency')}</th>
                          <th className="hidden sm:table-cell p-3 md:p-4">{t('medicalHistory.medicationStatus')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordData.currentMedicines &&
                        recordData.currentMedicines.length > 0 ? (
                          recordData.currentMedicines.map((med, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50 dark:bg-gray-900/40 border-b border-gray-50/60 transition-colors"
                            >
                              <td className="p-3 md:p-4 font-extrabold text-[#138C9F]">
                                {med.name}
                              </td>
                              <td className="p-3 md:p-4 text-gray-700 dark:text-gray-300 dark:text-gray-500 font-bold">
                                {med.dosage}
                              </td>
                              <td className="p-3 md:p-4 text-gray-600 dark:text-gray-400 dark:text-gray-500 font-medium">
                                {med.frequency}
                              </td>
                              <td className="hidden sm:table-cell p-3 md:p-4">
                                <span className="bg-teal-50 text-teal-600 font-black text-[10px] px-2.5 py-1 rounded-md border border-teal-100">
                                  {t('medicalHistory.activeMedication')}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="p-3 md:p-5 text-center text-gray-400 dark:text-gray-500 italic"
                            >
                              {t('medicalHistory.noMedications')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* واجهة التعديل الكاملة (Edit Mode - مطابق للنماذج والصور بدقة) */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-md p-5 sm:p-6 transition-all duration-300 animate-fadeIn">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="p-1.5 bg-sky-50 rounded-lg text-sky-600 text-sm">
                    <FontAwesomeIcon icon={faNoteSticky} />
                  </span>
                  {t('medicalHistory.updateFormTitle')}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500  mt-1">
                  {t('medicalHistory.updateFormDescription')}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. العلامات الحيوية وفصيلة الدم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-slate-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-1.5">
                    {t('medicalHistory.bloodTypeLabel')}
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] text-gray-700 dark:text-gray-300"
                  >
                    <option value="">{t('medicalHistory.selectBloodType')}</option>
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
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-1.5">
                    {t('medicalHistory.bloodPressureLabel')}
                  </label>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="120/80"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-1.5">
                    {t('medicalHistory.bloodSugarLabel')}
                  </label>
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    placeholder="105"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-1.5">
                    {t('medicalHistory.weightLabel')}
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="75"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-1.5">
                    {t('medicalHistory.heightLabel')}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 dark:text-gray-500 mb-2">
                    {t('medicalHistory.smokerLabel')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSmoker(true)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${isSmoker ? "bg-orange-50 text-orange-600 border-orange-200 shadow-2xs" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 border-gray-200"}`}
                    >
                      <FontAwesomeIcon icon={faSmoking} />
                      {t('medicalHistory.smokerYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSmoker(false)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${!isSmoker ? "bg-green-50 text-green-600 border-green-200 shadow-2xs" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 dark:text-gray-500 border-gray-200"}`}
                    >
                      <FontAwesomeIcon icon={faBanSmoking} />
                      {t('medicalHistory.smokerNo')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. الـ Tags - الأمراض والحساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* حقل الأمراض المزمنة */}
                <div className="border border-gray-100 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-800">
                  <label className="block text-xs font-black text-gray-800 dark:text-gray-200 mb-1.5">
                    <FontAwesomeIcon icon={faVirus} className="text-blue-500" />
                    {t('medicalHistory.addChronicDisease')}
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={diseaseInput}
                      onChange={(e) => setDiseaseInput(e.target.value)}
                      placeholder={t('medicalHistory.diseasePlaceholder')}
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-medium focus:outline-none focus:border-[#138C9F] dark:text-gray-300 dark:bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={addDisease}
                      className="bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282]"
                    >
                      {t('medicalHistory.add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-slate-200">
                    {chronicDiseases.length > 0 ? (
                      chronicDiseases.map((disease, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 select-none"
                        >
                          {disease}
                          <button
                            type="button"
                            onClick={() => removeDisease(disease)}
                            className="text-blue-400 hover:text-red-500 font-black text-[10px]"
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 italic p-1">
                        {t('medicalHistory.noDiseasesAdded')}
                      </span>
                    )}
                  </div>
                </div>

                {/* حقل الحساسية */}
                <div className="border border-gray-100 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-800">
                  <label className="block text-xs font-black text-gray-800 dark:text-gray-200 mb-1.5">
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="text-[#138C9F] text-md"
                    />
                    {t('medicalHistory.addAllergy')}
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      placeholder={t('medicalHistory.allergyPlaceholder')}
                      className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-medium focus:outline-none focus:border-[#138C9F] dark:text-gray-300 dark:bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282]"
                    >
                      {t('medicalHistory.add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-slate-200">
                    {allergies.length > 0 ? (
                      allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="bg-red-50 text-red-600 border border-red-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 select-none"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="text-red-400 hover:text-red-600 font-black text-[10px]"
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 italic p-1">
                        {t('medicalHistory.noAllergiesAdded')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. إضافة وتعديل الأدوية الحالية */}
              <div className="border border-gray-100 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-800 space-y-4">
                <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 flex items-center gap-1">
                  <span>
                    <FontAwesomeIcon
                      icon={faCapsules}
                      className="text-[#138C9F]"
                    />
                  </span>
                  {t('medicalHistory.manageMedications')}
                </h3>

                {/* حقول مدخلات الدواء الجديد */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-gray-900/40 p-3 rounded-xl border border-slate-100">
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder={t('medicalHistory.medNamePlaceholder')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder={t('medicalHistory.medDosagePlaceholder')}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={medFrequency}
                      onChange={(e) => setMedFrequency(e.target.value)}
                      placeholder={t('medicalHistory.medFrequencyPlaceholder')}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 h-12 text-xs font-bold focus:outline-none focus:border-[#138C9F] dark:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="bg-[#138C9F] hover:bg-[#0f6b7a] text-white px-3.5 rounded-xl text-xs font-black transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      {t('medicalHistory.insert')}
                    </button>
                  </div>
                </div>

                {/* جدول استعراض وحذف الأدوية المضافة للفورم مؤقتاً */}
                {currentMedicines.length > 0 && (
                  <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-xl">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold border-b border-gray-100">
                          <th className="p-3 md:p-4">{t('medicalHistory.medTableHeader')}</th>
                          <th className="p-3 md:p-4">{t('medicalHistory.dosageHeader')}</th>
                          <th className="p-3 md:p-4">{t('medicalHistory.frequencyHeader')}</th>
                          <th
                            className="p-3 md:p-4 text-center"
                            style={{ width: "60px" }}
                          >
                            {t('medicalHistory.deleteHeader')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentMedicines.map((med, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-50/60 font-bold text-gray-700 dark:text-gray-300"
                          >
                            <td className="p-3 md:p-4 text-[#138C9F]">{med.name}</td>
                            <td className="p-3 md:p-4">{med.dosage}</td>
                            <td className="p-3 md:p-4 text-gray-500">
                              {med.frequency}
                            </td>
                            <td className="p-3 md:p-4 text-center">
                              <button
                                type="button"
                                onClick={() => removeMedicine(idx)}
                                className="text-red-500 font-bold hover:text-red-700 text-sm active:scale-90 transition-transform"
                              >
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

              {/* أزرار الحفظ والإلغاء النهائية */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:bg-gray-900 text-xs font-black transition-colors"
                >
                  {t('medicalHistory.cancelAndReturn')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#138C9F] hover:bg-[#0f7282] disabled:bg-gray-300 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all duration-200 active:scale-98"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  <span className="mr-1">
                    {submitting
                      ? t('medicalHistory.saving')
                      : t('medicalHistory.saveAllChanges')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
        {/* تنبيه تعديل السجل المرضي */}
        {showEditWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl text-amber-500" />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 mb-2">{t('medicalHistory.editWarningTitle')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-2">
                {t('medicalHistory.editWarningText')} <span className="font-black text-red-500">{t('medicalHistory.editWarningOnce')}</span>.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                {t('medicalHistory.editWarningAfterSave')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditWarning(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 dark:text-gray-500 py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  {t('medicalHistory.cancelEdit')}
                </button>
                <button
                  onClick={() => {
                    setShowEditWarning(false);
                    setIsEditing(true);
                  }}
                  className="flex-1 bg-[#138C9F] hover:bg-[#0f7282] text-white py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  {t('medicalHistory.continueEdit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 mb-2">{t('medicalHistory.qrTitle')}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{t('medicalHistory.qrDescription')}</p>
              <div className="flex justify-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 inline-block mx-auto">
                <QRCodeCanvas value={qrUrl} size={200} level="H" includeMargin={true} />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{t('medicalHistory.qrExpiry')} {formatDate(qrExpiry)}</p>
              <p className="text-[10px] text-gray-300 dark:text-gray-500 break-all mb-4 max-h-12 overflow-hidden">{qrUrl}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(qrUrl, '_blank')}
                  className="flex-1 bg-[#138C9F] hover:bg-[#0f7282] text-white py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  {t('medicalHistory.openLink')}
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 dark:text-gray-500 py-2.5 rounded-xl text-xs font-black transition-colors"
                >
                  {t('medicalHistory.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden PDF template */}
        {recordData && (
          <div className="fixed -left-[9999px] top-0" dir="rtl">
            <div ref={pdfRef} style={{ width: '794px', padding: '40px', fontFamily: 'Tajawal, Arial, sans-serif', background: '#fff', color: '#0B1C30' }}>
              <div style={{ textAlign: 'center', borderBottom: '3px solid #138C9F', paddingBottom: '20px', marginBottom: '25px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#138C9F', margin: 0 }}>السجل المرضي الشخصي</h1>
                <p style={{ fontSize: '11px', color: '#888', margin: '5px 0 0' }}>Tabibi Platform - Personal Medical Record</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  ['فصيلة الدم', recordData.bloodType || '--'],
                  ['ضغط الدم', recordData.vitals?.bloodPressure || '--/--'],
                  ['سكر الدم', recordData.vitals?.bloodSugar ? `${recordData.vitals.bloodSugar} mg/dL` : '--'],
                  ['الوزن', recordData.vitals?.weight ? `${recordData.vitals.weight} كجم` : '--'],
                  ['الطول', recordData.vitals?.height ? `${recordData.vitals.height} سم` : '--'],
                  ['حالة التدخين', recordData.isSmoker ? 'مدخن' : 'غير مدخن']
                ].map(([label, value], i) => (
                  <div key={i} style={{ background: '#f8fafb', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', fontWeight: '700', color: '#888', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#333', margin: '4px 0 0' }}>{value}</p>
                  </div>
                ))}
              </div>

              {recordData.chronicDiseases?.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: '#138C9F', marginBottom: '6px' }}>الأمراض المزمنة</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {recordData.chronicDiseases.map((d, i) => (
                      <span key={i} style={{ background: '#eff6ff', color: '#2563eb', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {recordData.allergies?.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: '#138C9F', marginBottom: '6px' }}>الحساسية</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {recordData.allergies.map((a, i) => (
                      <span key={i} style={{ background: '#fef2f2', color: '#dc2626', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}>{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {recordData.currentMedicines?.length > 0 && (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '800', color: '#138C9F', marginBottom: '8px' }}>الأدوية الحالية</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: '700', color: '#666' }}>الدواء</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: '700', color: '#666' }}>الجرعة</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: '700', color: '#666' }}>التكرار</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recordData.currentMedicines.map((med, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '8px', fontWeight: '700', color: '#138C9F' }}>{med.name}</td>
                          <td style={{ padding: '8px', color: '#555' }}>{med.dosage}</td>
                          <td style={{ padding: '8px', color: '#555' }}>{med.frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ borderTop: '2px solid #C3C6D6', marginTop: '30px', paddingTop: '15px', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', color: '#999' }}>تم إنشاء هذا السجل عبر منصة طبيبي</p>
                <p style={{ fontSize: '9px', color: '#bbb', marginTop: '2px' }}>Tabibi Platform</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default MedicalHistory;