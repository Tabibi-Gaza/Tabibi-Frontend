import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5227/api';

const QrScanPage = () => {
  const { token } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/qr/record/${encodeURIComponent(token)}`);
        if (data.succeeded && data.data) {
          setRecord(data.data);
        } else {
          setError(data.errors?.[0]?.message || data.message || 'الرمز غير صالح');
        }
      } catch (err) {
        setError(err.response?.data?.errors?.[0]?.message || 'الرمز غير صالح أو منتهي الصلاحية');
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#138C9F] mx-auto mb-3"></div>
          <p className="text-sm font-bold text-gray-500">جاري تحميل السجل الطبي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center max-w-sm mx-auto p-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-black text-gray-800 mb-2">خطأ في الوصول</h2>
          <p className="text-sm text-gray-500 font-medium mb-4">{error}</p>
          <Link to="/" className="inline-block bg-[#138C9F] text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-[#0f7282] transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
          <div className="w-14 h-14 bg-[#138C9F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-xl font-black text-gray-800">السجل الطبي</h1>
          <p className="text-xs text-gray-400 font-bold mt-1">تم الوصول عبر رمز QR — صلاحية محدودة</p>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-sm font-black text-[#138C9F] mb-4">معلومات المريض</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400">الاسم</p>
              <p className="text-sm font-black text-gray-800">{record.patientName}</p>
            </div>
            {record.gender && (
              <div className="bg-slate-50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400">الجنس</p>
                <p className="text-sm font-black text-gray-800">{record.gender === 'Male' ? 'ذكر' : record.gender === 'Female' ? 'أنثى' : record.gender}</p>
              </div>
            )}
            {record.bloodType && (
              <div className="bg-red-50 p-3 rounded-xl text-center">
                <p className="text-[10px] font-bold text-gray-400">فصيلة الدم</p>
                <p className="text-sm font-black text-red-600">{record.bloodType}</p>
              </div>
            )}
          </div>
        </div>

        {/* Vitals */}
        {record.vitals && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">المؤشرات الحيوية</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {record.vitals.bloodPressure && (
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-gray-400">ضغط الدم</p>
                  <p className="text-sm font-black text-gray-800">{record.vitals.bloodPressure}</p>
                </div>
              )}
              {record.vitals.bloodSugar && (
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-gray-400">سكر الدم</p>
                  <p className="text-sm font-black text-gray-800">{record.vitals.bloodSugar} mg/dL</p>
                </div>
              )}
              {record.vitals.weight && (
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-gray-400">الوزن</p>
                  <p className="text-sm font-black text-gray-800">{record.vitals.weight} كجم</p>
                </div>
              )}
              {record.vitals.height && (
                <div className="bg-slate-50 p-3 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-gray-400">الطول</p>
                  <p className="text-sm font-black text-gray-800">{record.vitals.height} سم</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chronic Diseases */}
        {record.chronicDiseases?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">🦠 الأمراض المزمنة</h2>
            <div className="flex flex-wrap gap-2">
              {record.chronicDiseases.map((d, i) => (
                <span key={i} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-xl">{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Allergies */}
        {record.allergies?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">⚠️ الحساسية</h2>
            <div className="flex flex-wrap gap-2">
              {record.allergies.map((a, i) => (
                <span key={i} className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1.5 rounded-xl">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Current Medicines */}
        {record.currentMedicines?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">💊 الأدوية الحالية</h2>
            <div className="space-y-2">
              {record.currentMedicines.map((m, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-black text-[#138C9F]">{m.name}</span>
                  <span className="text-xs text-gray-500 font-bold">{m.dosage} — {m.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visits */}
        {record.visits?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">📋 الزيارات الطبية</h2>
            <div className="space-y-3">
              {record.visits.map((v, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-black text-gray-800">{v.doctorName}</p>
                      <p className="text-[10px] font-bold text-[#138C9F]">{v.specialization}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold">{new Date(v.visitDate).toLocaleDateString('ar-EG')}</p>
                  </div>
                  {v.diagnosis && <p className="text-xs text-gray-600 mb-1"><span className="font-black">التشخيص:</span> {v.diagnosis}</p>}
                  {v.symptoms && <p className="text-xs text-gray-600 mb-1"><span className="font-black">الأعراض:</span> {v.symptoms}</p>}
                  {v.notes && <p className="text-xs text-gray-500"><span className="font-black">ملاحظات:</span> {v.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prescriptions */}
        {record.prescriptions?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-black text-[#138C9F] mb-4">💊 الوصفات الطبية</h2>
            <div className="space-y-3">
              {record.prescriptions.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-black text-gray-800">{p.doctorName}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : ''}</p>
                  </div>
                  {p.medications?.map((med, j) => (
                    <div key={j} className="bg-slate-50 p-2 rounded-lg mb-1 flex justify-between items-center text-xs">
                      <span className="font-black text-[#138C9F]">{med.medicationName}</span>
                      <span className="text-gray-500 font-bold">{med.dosage} — {med.frequency}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-[10px] text-gray-400 font-bold">تم الوصول عبر رمز QR — منصة طبيبي</p>
        </div>
      </div>
    </div>
  );
};

export default QrScanPage;
