import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSave } from "react-icons/fi";
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

const DAYS_ORDER = [
  { key: 'saturday', nameKey: 'doctorSchedule.saturday', dayOfWeek: 6 },
  { key: 'sunday', nameKey: 'doctorSchedule.sunday', dayOfWeek: 0 },
  { key: 'monday', nameKey: 'doctorSchedule.monday', dayOfWeek: 1 },
  { key: 'tuesday', nameKey: 'doctorSchedule.tuesday', dayOfWeek: 2 },
  { key: 'wednesday', nameKey: 'doctorSchedule.wednesday', dayOfWeek: 3 },
  { key: 'thursday', nameKey: 'doctorSchedule.thursday', dayOfWeek: 4 },
  { key: 'friday', nameKey: 'doctorSchedule.friday', dayOfWeek: 5 },
];

const toMinutes = (hhmm) => {
  const [h, m] = (hhmm || '00:00').split(':').map(Number);
  return h * 60 + m;
};

const fromMinutes = (mins) => {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, mins));
  const h = String(Math.floor(clamped / 60)).padStart(2, '0');
  const m = String(clamped % 60).padStart(2, '0');
  return `${h}:${m}`;
};

const buildDefaultSchedule = () => {
  const s = {};
  DAYS_ORDER.forEach(d => {
    s[d.key] = {
      active: false,
      intervals: [{ from: '09:00', to: '17:00' }],
      slotDuration: 30,
      note: d.key === 'friday' ? 'doctorSchedule.weekendNote' : ''
    };
  });
  return s;
};

const DoctorSchedule = () => {
  const { t } = useTranslation();
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
            if (!match) return;
            const entry = newSchedule[match.key];
            const from = day.startTime?.substring(0, 5) || '09:00';
            const to = day.endTime?.substring(0, 5) || '17:00';
            if (day.isActive) {
              entry.active = true;
              entry.intervals.push({ from, to });
              entry.slotDuration = day.slotDurationMinutes || 30;
            } else if (entry.intervals.length === 1 && entry.intervals[0].from === '09:00' && entry.intervals[0].to === '17:00') {
              entry.intervals = [{ from, to }];
            }
          });
          DAYS_ORDER.forEach(d => {
            const entry = newSchedule[d.key];
            if (!entry.active && entry.intervals.length > 1) entry.intervals = [entry.intervals[0]];
            if (entry.intervals.length === 0) entry.intervals = [{ from: '09:00', to: '17:00' }];
          });
          setSchedule(newSchedule);
        }
      } catch (err) {

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

  const handleIntervalChange = (dayKey, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        intervals: prev[dayKey].intervals.map((iv, i) =>
          i === index ? { ...iv, [field]: value } : iv
        )
      }
    }));
  };

  const handleAddInterval = (dayKey) => {
    setSchedule(prev => {
      const day = prev[dayKey];
      const last = day.intervals[day.intervals.length - 1];
      const startMin = toMinutes(last?.to || '17:00');
      const from = fromMinutes(startMin);
      const to = fromMinutes(startMin + 120);
      return {
        ...prev,
        [dayKey]: { ...day, intervals: [...day.intervals, { from, to }] }
      };
    });
  };

  const handleRemoveInterval = (dayKey, index) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        intervals: prev[dayKey].intervals.filter((_, i) => i !== index)
      }
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
        day.intervals.forEach(iv => {
          const diffInMinutes = toMinutes(iv.to) - toMinutes(iv.from);
          if (diffInMinutes > 0) totalHours += diffInMinutes / 60;
        });
      }
    });

    return { activeDays: activeDaysCount, totalHours: totalHours.toFixed(1), slotDuration };
  }, [schedule]);

  const validateSchedule = () => {
    for (const d of DAYS_ORDER) {
      const day = schedule[d.key];
      if (!day.active) continue;
      const sorted = [...day.intervals].sort((a, b) => toMinutes(a.from) - toMinutes(b.from));
      for (const iv of sorted) {
        if (toMinutes(iv.to) <= toMinutes(iv.from)) {
          toast.error(`${t(d.nameKey)}: ${t('doctorSchedule.invalidInterval')}`);
          return false;
        }
      }
      for (let i = 1; i < sorted.length; i++) {
        if (toMinutes(sorted[i].from) < toMinutes(sorted[i - 1].to)) {
          toast.error(`${t(d.nameKey)}: ${t('doctorSchedule.overlapError')}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSchedule()) return;
    setSaving(true);
    try {
      const payload = [];
      DAYS_ORDER.forEach(d => {
        const day = schedule[d.key];
        if (day.active) {
          day.intervals.forEach(iv => {
            payload.push({
              dayOfWeek: d.dayOfWeek,
              startTime: iv.from + ':00',
              endTime: iv.to + ':00',
              isActive: true,
              slotDurationMinutes: day.slotDuration || 30
            });
          });
        } else {
          const iv = day.intervals[0] || { from: '09:00', to: '17:00' };
          payload.push({
            dayOfWeek: d.dayOfWeek,
            startTime: iv.from + ':00',
            endTime: iv.to + ':00',
            isActive: false,
            slotDurationMinutes: day.slotDuration || 30
          });
        }
      });

      const { data } = await axiosInstance.post('/doctor/schedule/save', payload);
      if (data.succeeded) {
        toast.success(t('doctorSchedule.saveSuccess'));
      } else {
        toast.error(data.errors?.[0]?.message || data.message || t('doctorSchedule.saveFailed'));
      }
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || t('doctorSchedule.saveError'));
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
    <div className="space-y-6 md:space-y-8 w-full pb-8 relative" dir="rtl">
      <div className="space-y-6 text-right">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-2 border-b border-[#C3C6D6] dark:border-gray-700/30 sm:border-none">
          <h1 className="text-2xl md:text-3xl font-black text-[#138C9F] tracking-wide w-full text-center sm:text-right">
            {t('doctorSchedule.title')}
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none h-11 px-5 bg-[#138C9F] hover:bg-[#0f6f7f] active:scale-[0.98] text-white font-black rounded-xl text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-center whitespace-nowrap disabled:opacity-50"
            >
              {saving ? t('doctorSchedule.saving') : <>{t('doctorSchedule.saveChanges')} <FiSave className="text-lg stroke-[3]" /></>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#ecf8fa] dark:bg-gray-900 px-6 py-4 border-b border-[#C3C6D6] dark:border-gray-700/50 text-right">
              <h3 className="text-base font-black text-[#0B1C30] dark:text-gray-200">{t('doctorSchedule.scheduleDays')}</h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">{t('doctorSchedule.intervalsHint')}</p>
            </div>
            <div className="divide-y divide-[#C3C6D6]/40">
              {DAYS_ORDER.map((d) => {
                const day = schedule[d.key];
                return (
                  <div key={d.key} className={`p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${day.active ? "bg-white dark:bg-gray-800" : "bg-slate-50 dark:bg-gray-900/50"}`}>
                    <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                      <span className="text-base md:text-lg font-black text-[#0B1C30] dark:text-white min-w-[70px] text-right">{t(d.nameKey)}</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={day.active} onChange={() => handleToggleDay(d.key)} className="sr-only peer" />
                        <div className="w-12 h-6 bg-zinc-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:bg-gray-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#138C9F]"></div>
                      </label>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col gap-2 items-stretch sm:items-end">
                      {day.active ? (
                        <>
                          {day.intervals.map((iv, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="relative flex-1 sm:flex-none min-w-0">
                                <input type="time" value={iv.from} onChange={(e) => handleIntervalChange(d.key, idx, "from", e.target.value)}
                                  className="w-full sm:w-28 h-11 px-3 bg-[#EBF3F5] dark:bg-gray-800/60 border border-[#C3C6D6] dark:border-gray-700/70 rounded-xl text-sm font-bold text-[#0B1C30] dark:text-white focus:outline-hidden focus:border-[#138C9F] text-center" />
                              </div>
                              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 px-1">{t('doctorSchedule.to')}</span>
                              <div className="relative flex-1 sm:flex-none min-w-0">
                                <input type="time" value={iv.to} onChange={(e) => handleIntervalChange(d.key, idx, "to", e.target.value)}
                                  className="w-full sm:w-28 h-11 px-3 bg-[#EBF3F5] dark:bg-gray-800/60 border border-[#C3C6D6] dark:border-gray-700/70 rounded-xl text-sm font-bold text-[#0B1C30] dark:text-white focus:outline-hidden focus:border-[#138C9F] text-center" />
                              </div>
                              {day.intervals.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInterval(d.key, idx)}
                                  aria-label={t('doctorSchedule.removeInterval')}
                                  className="w-9 h-11 shrink-0 rounded-xl border border-red-200 dark:border-red-900/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-black text-sm transition-colors cursor-pointer"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInterval(d.key)}
                            className="h-9 px-3 rounded-xl border border-dashed border-[#138C9F]/50 text-[#138C9F] hover:bg-[#138C9F]/10 text-xs font-black transition-colors cursor-pointer w-full sm:w-auto"
                          >
                            + {t('doctorSchedule.addInterval')}
                          </button>
                        </>
                      ) : (
                        <div className="text-center sm:text-right py-1">
                          <span className="text-sm font-black text-gray-400 dark:text-gray-500 block">{t('doctorSchedule.notAvailable')}</span>
                          {day.note && <span className="text-xs font-bold text-gray-400 dark:text-gray-500/80 mt-0.5 block">{t(day.note)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6 w-full">
            <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 text-right">
              <h3 className="text-lg font-black text-[#0B1C30] dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">{t('doctorSchedule.overview')}</h3>
              <div className="space-y-3">
                  <div className="p-3.5 bg-[#F4F6FC] dark:bg-gray-800 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-[#526069] dark:text-gray-400">{t('doctorSchedule.weeklyWorkDays')}</span>
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.activeDays} {t('doctorSchedule.days')}</span>
                </div>
                <div className="p-3.5 bg-[#F4F6FC] dark:bg-gray-800 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.totalHours} {t('doctorSchedule.hours')}</span>
                  <span className="text-sm font-bold text-[#526069] dark:text-gray-400">{t('doctorSchedule.totalAvailableHours')}</span>
                </div>
                <div className="p-3.5 bg-[#F4F6FC] dark:bg-gray-800 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-black text-[#138C9F]">{overviewStats.slotDuration} {t('doctorSchedule.minutes')}</span>
                  <span className="text-sm font-bold text-[#526069] dark:text-gray-400">{t('doctorSchedule.defaultSlotDuration')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#138C9F] rounded-2xl p-6 md:p-7 shadow-sm text-center text-white relative overflow-hidden space-y-4 flex flex-col items-center justify-center min-h-[240px]">
              <div className="w-9 h-9 bg-white dark:bg-gray-800/10 rounded-full flex items-center justify-center text-xl font-bold">ℹ️</div>
              <h4 className="text-xl font-black tracking-wide">{t('doctorSchedule.smartTip')}</h4>
              <p className="text-sm md:text-base font-medium leading-relaxed max-w-[280px] opacity-95">
                {t('doctorSchedule.smartTipText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
