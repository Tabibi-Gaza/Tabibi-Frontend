import React, { useState, useMemo, useEffect } from 'react';
import { FiSave } from "react-icons/fi";
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const DAYS_ORDER = [
  { key: 'saturday', name: 'السبت', dayOfWeek: 6 },
  { key: 'sunday', name: 'الأحد', dayOfWeek: 0 },
  { key: 'monday', name: 'الإثنين', dayOfWeek: 1 },
  { key: 'tuesday', name: 'الثلاثاء', dayOfWeek: 2 },
  { key: 'wednesday', name: 'الأربعاء', dayOfWeek: 3 },
  { key: 'thursday', name: 'الخميس', dayOfWeek: 4 },
  { key: 'friday', name: 'الجمعة', dayOfWeek: 5 },
];

const buildDefaultSchedule = () => {
  const s = {};
  DAYS_ORDER.forEach(d => {
    s[d.key] = { active: false, from: '09:00', to: '17:00', slotDuration: 30, note: d.key === 'friday' ? 'عطلة نهاية الأسبوع' : '' };
  });
  return s;
};

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState(buildDefaultSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const { data } = await axiosInstance.get('/doctor/schedule/my-slots');
        if (data.succeeded && data.data?.days) {
          const newSchedule = buildDefaultSchedule();
          data.data.days.forEach(day => {
            const match = DAYS_ORDER.find(d => d.dayOfWeek === day.dayOfWeek);
            if (match) {
              newSchedule[match.key] = {
                active: day.isActive,
                from: day.startTime?.substring(0, 5) || '09:00',
                to: day.endTime?.substring(0, 5) || '17:00',
                slotDuration: day.slotDurationMinutes || 30,
                note: match.key === 'friday' ? 'عطلة نهاية الأسبوع' : ''
              };
            }
          });
          setSchedule(newSchedule);
        }
      } catch (err) {
        console.error('Failed to load schedule', err);
      } finally {
        setLoading(false);
      }
    };
    loadSchedule();
  }, []);

  const handleToggleDay = (dayKey) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], active: !prev[dayKey].active }
    }));
  };

  const handleTimeChange = (dayKey, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value }
    }));
  };

  const overviewStats = useMemo(() => {
    let activeDaysCount = 0;
    let totalHours = 0;
    let slotDuration = 30;

    Object.keys(schedule).forEach(key => {
      const day = schedule[key];
      if (day.active) {
        activeDaysCount++;
        slotDuration = day.slotDuration;
        const [fromH, fromM] = day.from.split(':').map(Number);
        const [toH, toM] = day.to.split(':').map(Number);
        const diffInMinutes = (toH * 60 + toM) - (fromH * 60 + fromM);
        if (diffInMinutes > 0) {
          totalHours += diffInMinutes / 60;
        }
      }
    });

    return { activeDays: activeDaysCount, totalHours: totalHours.toFixed(1), slotDuration };
  }, [schedule]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = DAYS_ORDER.map(d => ({
        dayOfWeek: d.dayOfWeek,
        startTime: schedule[d.key].from + ':00',
        endTime: schedule[d.key].to + ':00',
        isActive: schedule[d.key].active,
        slotDurationMinutes: schedule[d.key].slotDuration || 30
      }));

      const { data } = await axiosInstance.post('/doctor/schedule/save', payload);
      if (data.succeeded) {
        toast.success('تم حفظ التغييرات بنجاح!');
      } else {
        toast.error(data.errors?.[0]?.message || data.message || 'فشل الحفظ');
      }
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#138C9F]"></div>
      </div>
    );
  }

  return (
    <div className="font-['Cairo'] space-y-6 md:space-y-8 w-full pb-8 pr-4 relative" dir="rtl">
      <div className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-2 border-b border-[#C3C6D6]/30 sm:border-none">
          <h1 className="text-2xl md:text-3xl font-black text-[#138C9F] tracking-wide w-full text-center sm:text-right">
            إدارة ساعات العمل
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none h-11 px-5 bg-[#138C9F] hover:bg-[#0f6f7f] active:scale-[0.98] text-white font-black rounded-xl text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-center whitespace-nowrap disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : <>حفظ التغييرات <FiSave className="text-lg stroke-[3]" /></>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-[#C3C6D6]/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#ecf8fa] px-6 py-4 border-b border-[#C3C6D6]/50 text-right">
              <h3 className="text-base font-black text-[#0B1C30]">جدولة الأيام</h3>
            </div>
            <div className="divide-y divide-[#C3C6D6]/40">
              {DAYS_ORDER.map((d) => {
                const day = schedule[d.key];
                return (
                  <div key={d.key} className={`p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${day.active ? "bg-white" : "bg-slate-50/50"}`}>
                    <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                      <span className="text-base md:text-lg font-black text-[#0B1C30] min-w-[70px] text-right">{d.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={day.active} onChange={() => handleToggleDay(d.key)} className="sr-only peer" />
                        <div className="w-12 h-6 bg-zinc-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#138C9F]"></div>
                      </label>
                    </div>
                    <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end">
                      {day.active ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="relative flex-1 sm:flex-none">
                            <input type="time" value={day.from} onChange={(e) => handleTimeChange(d.key, "from", e.target.value)}
                              className="w-full sm:w-32 h-11 px-3 bg-[#EBF3F5]/60 border border-[#C3C6D6]/70 rounded-xl text-sm font-bold text-[#0B1C30] focus:outline-hidden focus:border-[#138C9F] text-center" />
                          </div>
                          <span className="text-xs font-bold text-gray-400 px-2">إلى</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input type="time" value={day.to} onChange={(e) => handleTimeChange(d.key, "to", e.target.value)}
                              className="w-full sm:w-32 h-11 px-3 bg-[#EBF3F5]/60 border border-[#C3C6D6]/70 rounded-xl text-sm font-bold text-[#0B1C30] focus:outline-hidden focus:border-[#138C9F] text-center" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center sm:text-right py-1">
                          <span className="text-sm font-black text-gray-400 block">غير متوفر لاستقبال المواعيد</span>
                          {day.note && <span className="text-xs font-bold text-gray-400/80 mt-0.5 block">{day.note}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 w-full">
            <div className="bg-white border border-[#C3C6D6]/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 text-right">
              <h3 className="text-lg font-black text-[#0B1C30] border-b border-gray-100 pb-3">نظرة عامة</h3>
              <div className="space-y-3">
                <div className="p-3.5 bg-[#F4F6FC] rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-[#526069]">أيام العمل الأسبوعية</span>
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.activeDays} أيام</span>
                </div>
                <div className="p-3.5 bg-[#F4F6FC] rounded-xl flex justify-between items-center">
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.totalHours} ساعة</span>
                  <span className="text-sm font-bold text-[#526069]">إجمالي ساعات التوافر</span>
                </div>
                <div className="p-3.5 bg-[#F4F6FC] rounded-xl flex justify-between items-center">
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.slotDuration} دقيقة</span>
                  <span className="text-sm font-bold text-[#526069]">مدة الموعد الافتراضية</span>
                </div>
              </div>
            </div>

            <div className="bg-[#138C9F] rounded-2xl p-6 md:p-7 shadow-sm text-center text-white relative overflow-hidden space-y-4 flex flex-col items-center justify-center min-h-[240px]">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold">ℹ️</div>
              <h4 className="text-xl font-black tracking-wide">نصيحة ذكية</h4>
              <p className="text-sm md:text-base font-medium leading-relaxed max-w-[280px] opacity-95">
                حدد ساعات العمل بدقة لضمان ظهور مواعيدك المتاحة للمريض بشكل صحيح. يمكنك تعديلها في أي وقت.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
