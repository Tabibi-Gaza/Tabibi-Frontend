import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MedicalHistory = () => {
    const { backendUrl, token } = useContext(AppContext);
    
    // حالات التحكم في البيانات والتحميل
    const [recordData, setRecordData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); 
    const [submitting, setSubmitting] = useState(false);

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
                const { data } = await axios.get(`${backendUrl}/api/user/patient-record`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (data.success && data.record) {
                    setRecordData(data.record);
                    const rec = data.record;
                    
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
                } else {
                    setRecordData(null);
                }
            } catch (error) {
                console.error("خطأ أثناء جلب السجل الطبي:", error);
                setRecordData(null);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPatientRecord();
        }
    }, [token, backendUrl]);

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
            toast.warn("الرجاء ملء حقول الدواء بالكامل (الاسم، الجرعة، التكرار)");
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
                vitals: { bloodPressure, bloodSugar, weight, height },
                chronicDiseases,
                allergies,
                currentMedicines
            };

            const { data } = await axios.post(`${backendUrl}/api/user/update-patient-record`, recordPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("تم تحديث السجل الطبي بنجاح!");
                // تحديث الـ State محلياً فوراً ليعكس العرض دون رندرة cascading أو Fetch إضافي
                setRecordData({
                    ...recordPayload,
                    updatedAt: new Date().toISOString()
                });
                setIsEditing(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-100 font-["Cairo"]' dir='rtl'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#138C9F]'></div>
                <p className='mr-3 text-sm font-bold text-gray-500'>جاري تحميل السجل الطبي الذكي...</p>
            </div>
        );
    }

    return (
        <div className='max-w-5xl mx-auto p-4 sm:p-6 font-["Cairo"]' dir='rtl'>
            
            {/* واجهة العرض الافتراضية (View Mode) */}
            {!isEditing && (
                <div className='bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden transition-all duration-300'>
                    {/* هيدر الكرت */}
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-50 bg-radial from-white to-slate-50/40'>
                        <div>
                            <h1 className='text-xl sm:text-2xl font-black text-gray-800 flex items-center gap-2'>
                                <span className='p-2 bg-teal-50 rounded-xl text-[#138C9F] text-lg'>🩺</span>
                                السجل المرضي الشخصي
                            </h1>
                            <p className='text-xs font-bold text-gray-400 mt-1.5 mr-1'>
                                آخر تحديث للبيانات الموثقة: {recordData?.updatedAt ? new Date(recordData.updatedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'غير محدد'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className='self-start sm:self-center bg-[#138C9F] hover:bg-[#0f7282] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-xs active:scale-98'
                        >
                            📝 تعديل السجل المرضي
                        </button>
                    </div>

                    {!recordData ? (
                        /* حالة السجل فارغ تماماً */
                        <div className='flex flex-col items-center justify-center p-12 text-center'>
                            <div className='w-20 h-20 bg-teal-50/60 rounded-full flex items-center justify-center mb-4'>
                                <span className='text-3xl grayscale-20 opacity-70'>📁</span>
                            </div>
                            <p className='text-gray-400 font-bold text-sm max-w-sm leading-relaxed'>
                                لا يوجد سجل طبي مضاف حالياً لهذا الحساب. اضغط على زر التعديل بالأعلى لإنشاء ملفك الصحي الأول.
                            </p>
                        </div>
                    ) : (
                        /* عرض تفاصيل السجل الطبي المثالي للعيادة */
                        <div className='p-6 space-y-6'>
                            
                            {/* الصف الأول: المؤشرات الحيوية وفصيلة الدم */}
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4'>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>فصيلة الدم</p>
                                    <p className='text-lg font-black text-red-600'>{recordData.bloodType || 'غير محدد'}</p>
                                </div>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>ضغط الدم</p>
                                    <p className='text-base font-extrabold text-gray-700'>{recordData.vitals?.bloodPressure || '--/--'}</p>
                                </div>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>سكر الدم</p>
                                    <p className='text-base font-extrabold text-gray-700'>{recordData.vitals?.bloodSugar ? `${recordData.vitals.bloodSugar} mg/dL` : '--'}</p>
                                </div>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>الوزن</p>
                                    <p className='text-base font-extrabold text-gray-700'>{recordData.vitals?.weight ? `${recordData.vitals.weight} كجم` : '--'}</p>
                                </div>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>الطول</p>
                                    <p className='text-base font-extrabold text-gray-700'>{recordData.vitals?.height ? `${recordData.vitals.height} سم` : '--'}</p>
                                </div>
                                <div className='bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center transition-hover hover:bg-slate-50'>
                                    <p className='text-xs font-bold text-gray-400 mb-1'>حالة التدخين</p>
                                    <p className={`text-xs font-black px-2 py-1 inline-block rounded-md mt-1 ${recordData.isSmoker ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                        {recordData.isSmoker ? '🚬 مدخن' : '🚭 غير مدخن'}
                                    </p>
                                </div>
                            </div>

                            {/* الصف الثاني: الأمراض المزمنة والحساسية */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='border border-gray-100 p-5 rounded-2xl bg-white'>
                                    <h3 className='text-sm font-black text-gray-800 mb-3 flex items-center gap-1.5'>
                                        <span className='text-blue-500'>🦠</span> الأمراض المزمنة أو السابقة
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {recordData.chronicDiseases && recordData.chronicDiseases.length > 0 ? (
                                            recordData.chronicDiseases.map((disease, idx) => (
                                                <span key={idx} className='bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-xl'>
                                                    {disease}
                                                </span>
                                            ))
                                        ) : (
                                            <p className='text-xs text-gray-400 italic mr-1'>لا يوجد أمراض مزمنة مسجلة.</p>
                                        )}
                                    </div>
                                </div>

                                <div className='border border-gray-100 p-5 rounded-2xl bg-white'>
                                    <h3 className='text-sm font-black text-gray-800 mb-3 flex items-center gap-1.5'>
                                        <span className='text-red-500'>⚠️</span> الحساسية (الأدوية والأطعمة)
                                    </h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {recordData.allergies && recordData.allergies.length > 0 ? (
                                            recordData.allergies.map((allergy, idx) => (
                                                <span key={idx} className='bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl'>
                                                    {allergy}
                                                </span>
                                            ))
                                        ) : (
                                            <p className='text-xs text-gray-400 italic mr-1'>لا توجد حالات حساسية مسجلة.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* الصف الثالث: الأدوية الحالية */}
                            <div className='border border-gray-100 rounded-2xl overflow-hidden bg-white'>
                                <div className='p-4 bg-slate-50/50 border-b border-gray-50 flex items-center gap-2'>
                                    <span className='text-teal-600 text-base'>💊</span>
                                    <h3 className='text-sm font-black text-gray-800'>الأدوية والعلاجات الحالية الملتزم بها</h3>
                                </div>
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-right text-xs border-collapse'>
                                        <thead>
                                            <tr className='bg-slate-50 text-gray-500 font-black border-b border-gray-100'>
                                                <th className='p-3'>اسم الدواء العلمي/التجاري</th>
                                                <th className='p-3'>الجرعة المقررة</th>
                                                <th className='p-3'>التكرار والمواعيد</th>
                                                <th className='p-3'>الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recordData.currentMedicines && recordData.currentMedicines.length > 0 ? (
                                                recordData.currentMedicines.map((med, idx) => (
                                                    <tr key={idx} className='hover:bg-slate-50/40 border-b border-gray-50/60 transition-colors'>
                                                        <td className='p-3 font-extrabold text-[#138C9F]'>{med.name}</td>
                                                        <td className='p-3 text-gray-700 font-bold'>{med.dosage}</td>
                                                        <td className='p-3 text-gray-600 font-medium'>{med.frequency}</td>
                                                        <td className='p-3'>
                                                            <span className='bg-teal-50 text-teal-600 font-black text-[10px] px-2.5 py-1 rounded-md border border-teal-100'>نشط حالياً</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className='p-5 text-center text-gray-400 italic'>لا توجد أدوية مدرجة بالسجل حالياً.</td>
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
                <div className='bg-white rounded-3xl border border-gray-100 shadow-md p-5 sm:p-6 transition-all duration-300 animate-fadeIn'>
                    <div className='border-b border-gray-100 pb-4 mb-5 flex items-center justify-between'>
                        <div>
                            <h2 className='text-lg sm:text-xl font-black text-gray-800 flex items-center gap-2'>
                                <span className='p-1.5 bg-sky-50 rounded-lg text-sky-600 text-sm'>📝</span>
                                نموذج تحديث السجل المرضي الشامل
                            </h2>
                            <p className='text-xs text-gray-400 font-medium mt-1'>الرجاء ملء البيانات بدقة لضمان تشخيص طبي سليم متكامل داخل العيادة.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        
                        {/* 1. العلامات الحيوية وفصيلة الدم */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100'>
                            <div>
                                <label className='block text-xs font-black text-gray-700 mb-1.5'>فصيلة الدم</label>
                                <select 
                                    value={bloodType} 
                                    onChange={(e) => setBloodType(e.target.value)}
                                    className='w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#138C9F] text-gray-700'
                                >
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
                                <label className='block text-xs font-black text-gray-700 mb-1.5'>ضغط الدم (مثال: 120/80)</label>
                                <input 
                                    type="text" 
                                    value={bloodPressure}
                                    onChange={(e) => setBloodPressure(e.target.value)}
                                    placeholder="120/80"
                                    className='w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-black text-gray-700 mb-1.5'>مستوى السكر بالدم (mg/dL)</label>
                                <input 
                                    type="number" 
                                    value={bloodSugar}
                                    onChange={(e) => setBloodSugar(e.target.value)}
                                    placeholder="105"
                                    className='w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-black text-gray-700 mb-1.5'>الوزن الحالي (كجم)</label>
                                <input 
                                    type="number" 
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="75"
                                    className='w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-black text-gray-700 mb-1.5'>الطول الحالي (سم)</label>
                                <input 
                                    type="number" 
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="170"
                                    className='w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-black text-gray-700 mb-2'>هل أنت مدخن؟</label>
                                <div className='flex gap-2'>
                                    <button
                                        type="button"
                                        onClick={() => setIsSmoker(true)}
                                        className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${isSmoker ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-2xs' : 'bg-white text-gray-500 border-gray-200'}`}
                                    >
                                        🚬 نعم، مدخن
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsSmoker(false)}
                                        className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all duration-150 ${!isSmoker ? 'bg-green-50 text-green-600 border-green-200 shadow-2xs' : 'bg-white text-gray-500 border-gray-200'}`}
                                    >
                                        🚭 لا، لست مدخن
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. الـ Tags - الأمراض والحساسية */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            {/* حقل الأمراض المزمنة */}
                            <div className='border border-gray-100 p-4 rounded-2xl bg-white'>
                                <label className='block text-xs font-black text-gray-800 mb-1.5'>🦠 إضافة مرض مزمن أو سابق</label>
                                <div className='flex gap-2 mb-3'>
                                    <input 
                                        type="text"
                                        value={diseaseInput}
                                        onChange={(e) => setDiseaseInput(e.target.value)}
                                        placeholder="مثال: السكري، ضغط الدم، أزمة صدرية..."
                                        className='flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#138C9F]'
                                    />
                                    <button 
                                        type="button"
                                        onClick={addDisease}
                                        className='bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282]'
                                    >
                                        إضافة
                                    </button>
                                </div>
                                <div className='flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200'>
                                    {chronicDiseases.length > 0 ? chronicDiseases.map((disease, idx) => (
                                        <span key={idx} className='bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 select-none'>
                                            {disease}
                                            <button type="button" onClick={() => removeDisease(disease)} className='text-blue-400 hover:text-red-500 font-black text-[10px]'>✕</button>
                                        </span>
                                    )) : <span className='text-[11px] text-gray-400 italic p-1'>لم يتم إدراج أي تاق حتى الآن...</span>}
                                </div>
                            </div>

                            {/* حقل الحساسية */}
                            <div className='border border-gray-100 p-4 rounded-2xl bg-white'>
                                <label className='block text-xs font-black text-gray-800 mb-1.5'>⚠️ إضافة حساسية معينة</label>
                                <div className='flex gap-2 mb-3'>
                                    <input 
                                        type="text"
                                        value={allergyInput}
                                        onChange={(e) => setAllergyInput(e.target.value)}
                                        placeholder="مثال: بنسلين، الفول السوداني، الفراولة..."
                                        className='flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#138C9F]'
                                    />
                                    <button 
                                        type="button"
                                        onClick={addAllergy}
                                        className='bg-[#138C9F] text-white px-4 rounded-xl text-xs font-black hover:bg-[#0f7282]'
                                    >
                                        إضافة
                                    </button>
                                </div>
                                <div className='flex flex-wrap gap-1.5 min-h-10 p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200'>
                                    {allergies.length > 0 ? allergies.map((allergy, idx) => (
                                        <span key={idx} className='bg-red-50 text-red-600 border border-red-100 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 select-none'>
                                            {allergy}
                                            <button type="button" onClick={() => removeAllergy(allergy)} className='text-red-400 hover:text-red-600 font-black text-[10px]'>✕</button>
                                        </span>
                                    )) : <span className='text-[11px] text-gray-400 italic p-1'>لم يتم إدراج أي تاق للحساسية...</span>}
                                </div>
                            </div>
                        </div>

                        {/* 3. إضافة وتعديل الأدوية الحالية */}
                        <div className='border border-gray-100 p-4 rounded-2xl bg-white space-y-4'>
                            <h3 className='text-xs font-black text-gray-800 flex items-center gap-1'>
                                <span>💊</span> إدارة قائمة الأدوية والعلاجات الحالية
                            </h3>
                            
                            {/* حقول مدخلات الدواء الجديد */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/40 p-3 rounded-xl border border-slate-100'>
                                <input 
                                    type="text"
                                    value={medName}
                                    onChange={(e) => setMedName(e.target.value)}
                                    placeholder="اسم الدواء (مثل: Concor 5mg)"
                                    className='bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                                <input 
                                    type="text"
                                    value={medDosage}
                                    onChange={(e) => setMedDosage(e.target.value)}
                                    placeholder="الجرعة المقررة (نصف حبة، 500 ملجم...)"
                                    className='bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                />
                                <div className='flex gap-2'>
                                    <input 
                                        type="text"
                                        value={medFrequency}
                                        onChange={(e) => setMedFrequency(e.target.value)}
                                        placeholder="التكرار (مرة صباحاً، كل 12 ساعة...)"
                                        className='flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#138C9F]'
                                    />
                                    <button 
                                        type="button"
                                        onClick={addMedicine}
                                        className='bg-sky-500 hover:bg-sky-600 text-white px-3.5 rounded-xl text-xs font-black transition-colors'
                                    >
                                        ➕ إدراج
                                    </button>
                                </div>
                            </div>

                            {/* جدول استعراض وحذف الأدوية المضافة للفورم مؤقتاً */}
                            {currentMedicines.length > 0 && (
                                <div className='overflow-x-auto border border-gray-100 rounded-xl'>
                                    <table className='w-full text-right text-xs border-collapse'>
                                        <thead>
                                            <tr className='bg-slate-50 text-gray-500 font-bold border-b border-gray-100'>
                                                <th className='p-2.5'>الدواء</th>
                                                <th className='p-2.5'>الجرعة</th>
                                                <th className='p-2.5'>التكرار المجدول</th>
                                                <th className='p-2.5 text-center' style={{ width: '60px' }}>حذف</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentMedicines.map((med, idx) => (
                                                <tr key={idx} className='border-b border-gray-50/60 font-bold text-gray-700'>
                                                    <td className='p-2.5 text-[#138C9F]'>{med.name}</td>
                                                    <td className='p-2.5'>{med.dosage}</td>
                                                    <td className='p-2.5 text-gray-500'>{med.frequency}</td>
                                                    <td className='p-2.5 text-center'>
                                                        <button type="button" onClick={() => removeMedicine(idx)} className='text-red-500 font-bold hover:text-red-700 text-sm active:scale-90 transition-transform'>🗑️</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* أزرار الحفظ والإلغاء النهائية */}
                        <div className='flex items-center justify-end gap-3 border-t border-gray-50 pt-5 mt-2'>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                                className='px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-black transition-colors'
                            >
                                إلغاء وعودة
                            </button>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className='bg-[#138C9F] hover:bg-[#0f7282] disabled:bg-gray-300 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all duration-200 active:scale-98'
                            >
                                {submitting ? 'جاري الحفظ والتحديث...' : '💾 حفظ التعديلات كاملة'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;