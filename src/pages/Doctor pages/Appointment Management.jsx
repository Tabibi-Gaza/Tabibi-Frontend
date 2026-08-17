import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiCalendar, FiClock, FiCheckCircle,
    FiSliders, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { FiRotateCcw } from 'react-icons/fi';

const FILES_URL = import.meta.env.VITE_Files_URL || '';

const STATUS_MAP = {
  'PendingPayment': 'pending',
  'PendingVerification': 'pending',
  'Confirmed': 'confirmed',
  'InProgress': 'in_progress',
  'Completed': 'completed',
  'Cancelled': 'canceled',
  'NoShow': 'canceled',
};

const STATUS_LABELS = {
  'PendingPayment': 'بانتظار الدفع',
  'PendingVerification': 'بانتظار التأكيد',
  'Confirmed': 'مؤكد',
  'InProgress': 'جاري الكشف',
  'Completed': 'مكتمل',
  'Cancelled': 'ملغي',
  'NoShow': 'لم يحضر',
};

const AppointmentManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [customDate, setCustomDate] = useState('');
    const [appliedDate, setAppliedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ todayAppointmentsCount: 0, pendingVerificationCount: 0, completedAppointmentsCount: 0 });
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [currentPage, statusFilter, activeTab, appliedDate]);

    const fetchStats = async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/appointments/stats');
            if (data.succeeded && data.data) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Failed to load stats', err);
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const params = {
                Page: currentPage,
                PageSize: itemsPerPage,
            };
            if (activeTab === 'waiting') {
                params.Status = 'PendingPayment';
            } else if (statusFilter !== 'all' && statusFilter !== 'not_completed') {
                const statusKey = Object.keys(STATUS_MAP).find(k => STATUS_MAP[k] === statusFilter);
                if (statusKey) params.Status = statusKey;
            }
            if (activeTab === 'daily') {
                params.IsToday = true;
            }
            if (appliedDate && activeTab === 'all') {
                params.DateFrom = appliedDate + 'T00:00:00';
                const parts = appliedDate.split('-');
                const nextDay = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]) + 1);
                const y = nextDay.getFullYear();
                const m = String(nextDay.getMonth() + 1).padStart(2, '0');
                const d = String(nextDay.getDate()).padStart(2, '0');
                params.DateTo = `${y}-${m}-${d}T00:00:00`;
            }

            const { data } = await axiosInstance.get('/doctor/appointments', { params });
            if (data.succeeded && data.data) {
                let items = data.data.items || [];
                if (statusFilter === 'not_completed') {
                    items = items.filter(a => a.status !== 'Completed');
                }
                setAppointments(items);
                setTotalPages(data.data.totalPages || 1);
                setTotalCount(data.data.totalCount || 0);
            } else {
                setAppointments([]);
            }
        } catch (err) {
            console.error('Failed to load appointments', err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setCurrentPage(1);
        setCustomDate('');
        setAppliedDate('');
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStartSession = async (appointmentId, patientId) => {
        try {
            const { data } = await axiosInstance.post(`/doctor/appointments/${appointmentId}/start-consultation`);
            if (data.succeeded) {
                toast.success('تم بدء الكشف بنجاح');
            }
        } catch (err) {
        }
        navigate(`/doctor/medical-examination/${patientId}`);
    };

    const mapStatus = (status) => STATUS_MAP[status] || 'pending';
    const mapStatusLabel = (status) => STATUS_LABELS[status] || status;

    const formatDateTime = (dateStr) => {
        if (!dateStr) return { time: '', date: '' };
        const d = new Date(dateStr);
        const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
        const date = d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return { time, date };
    };

    const getInitials = (name) => {
        if (!name) return '؟';
        const parts = name.split(' ');
        return parts.length > 1 ? parts[0][0] + ' ' + parts[1][0] : parts[0][0];
    };

    return (
      <div className="font-['Cairo'] space-y-6 md:space-y-8 w-full pb-8 pr-4 relative" dir="rtl">
        <div className="space-y-6 text-right">
          <div className="text-right space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112240]">إدارة المواعيد</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">لديك {stats.todayAppointmentsCount} موعداً مجدولاً لهذا اليوم.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between text-right shadow-2xs">
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-bold text-gray-400">مواعيد اليوم</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1b8b99]">{stats.todayAppointmentsCount}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#1b8b99]"><FiCalendar className="w-5 h-5" /></div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between text-right shadow-2xs">
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-bold text-gray-400">بانتظار التأكيد</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">{stats.pendingVerificationCount}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500"><FiClock className="w-5 h-5" /></div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 flex items-center justify-between text-right shadow-2xs">
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-bold text-gray-400">تم الانتهاء</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">{stats.completedAppointmentsCount}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500"><FiCheckCircle className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-4 pt-4 sm:px-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 md:border-none overflow-x-auto shrink-0 pb-2 md:pb-0">
                {[
                  { key: 'daily', label: 'الجدول اليومي' },
                  { key: 'all', label: 'جميع المواعيد' },
                  { key: 'waiting', label: 'قائمة الانتظار' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                    className={`text-sm sm:text-base font-bold pb-3.5 transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab.key ? "text-[#1b8b99] border-b-2 border-[#1b8b99]" : "text-gray-400 hover:text-gray-600"}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="pb-3 md:pb-0 self-end md:self-auto">
                <div className="relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 px-3 h-10 w-40 focus-within:border-[#1b8b99] focus-within:bg-white transition-all">
                  <FiSliders className="w-4 h-4 text-gray-400 pointer-events-none ml-2 shrink-0" />
                  <select value={statusFilter} onChange={handleStatusFilterChange}
                    className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-bold text-gray-700 cursor-pointer appearance-none text-right">
                    <option value="all">كل الحالات</option>
                    <option value="completed">مكتمل</option>
                    <option value="not_completed">غير مكتمل</option>
                  </select>
                </div>
              </div>
            </div>

            {activeTab === 'all' && (
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-xs font-bold text-slate-600 shrink-0">تخصيص التاريخ</label>
                <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
                  className="text-sm font-bold border border-slate-200 rounded-xl px-4 py-2 text-slate-700 bg-white focus:border-[#1b8b99] focus:outline-none transition-all w-full sm:w-56" />
                <div className="flex items-center gap-2">
                  <button onClick={() => { setAppliedDate(customDate); setCurrentPage(1); }}
                    className="text-sm font-bold px-5 py-2 rounded-xl bg-[#1b8b99] text-white hover:bg-[#15727e] transition-all cursor-pointer shadow-xs">
                    تطبيق الفلتر
                  </button>
                  <button onClick={() => { setCustomDate(''); setAppliedDate(''); setCurrentPage(1); }}
                    className="flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                    <FiRotateCcw className="w-3.5 h-3.5" />
                    إعادة ضبط
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="p-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b8b99] mx-auto"></div></div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 text-xs font-bold h-12">
                        <th className="px-6 text-center md:text-right">المريض</th>
                        <th className="px-6">الوقت</th>
                        <th className="px-6">نوع الزيارة</th>
                        <th className="px-6">الحالة</th>
                        <th className="px-6 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((appt) => {
                        const st = mapStatus(appt.status);
                        const canStart = appt.status === 'Confirmed' || appt.status === 'InProgress';
                        const dt = formatDateTime(appt.startTime);
                        return (
                          <tr key={appt.id} className="hover:bg-slate-50/30 transition-colors h-20 text-sm font-semibold text-gray-700">
                            <td className="px-6">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  {appt.patientImage ? (
                                    <img src={appt.patientImage.startsWith("http") ? appt.patientImage : `${FILES_URL}/${appt.patientImage}`} alt={appt.patientName} className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-gray-600 font-bold flex items-center justify-center text-xs border border-slate-200">{getInitials(appt.patientName)}</div>
                                  )}
                                </div>
                                <span className="font-bold text-gray-800 text-base">{appt.patientName}</span>
                              </div>
                            </td>
                            <td className="px-6">
                              <div className="flex flex-col text-right">
                                <span className="text-gray-900 font-bold text-sm">{dt.time}</span>
                                <span className="text-[11px] text-gray-400 mt-0.5">{dt.date}</span>
                              </div>
                            </td>
                            <td className="px-6 text-gray-600 font-medium">{appt.visitType || '-'}</td>
                            <td className="px-6">
                              <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1 rounded-full ${st === "confirmed" ? "bg-green-50 text-green-600" : st === "pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"}`}>
                                {mapStatusLabel(appt.status)}
                              </span>
                            </td>
                            <td className="px-6 text-center">
                              <button disabled={!canStart} onClick={() => handleStartSession(appt.id, appt.patientId)}
                                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${canStart ? "bg-[#1b8b99] hover:bg-[#15727e] text-white cursor-pointer shadow-2xs" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                                بدء الكشف
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="block md:hidden divide-y divide-slate-100">
                  {appointments.map((appt) => {
                    const st = mapStatus(appt.status);
                    const canStart = appt.status === 'Confirmed' || appt.status === 'InProgress';
                    const dt = formatDateTime(appt.startTime);
                    return (
                      <div key={appt.id} className="p-4 space-y-4 hover:bg-slate-50/20 transition-all text-right">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              {appt.patientImage ? (
                                <img src={appt.patientImage.startsWith("http") ? appt.patientImage : `${FILES_URL}/${appt.patientImage}`} alt={appt.patientName} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-gray-500 font-bold flex items-center justify-center text-xs">{getInitials(appt.patientName)}</div>
                              )}
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{appt.patientName}</span>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${st === "confirmed" ? "bg-green-50 text-green-600" : st === "pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"}`}>
                            {mapStatusLabel(appt.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                          <div>
                            <p className="text-[10px] text-gray-400">الوقت والتاريخ</p>
                            <p className="font-bold text-gray-800 mt-0.5">{dt.time} <span className="text-[10px] text-gray-400 font-medium">({dt.date})</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">نوع الزيارة</p>
                            <p className="font-bold text-gray-700 mt-0.5">{appt.visitType || '-'}</p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <button disabled={!canStart} onClick={() => handleStartSession(appt.id, appt.patientId)}
                            className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all text-center ${canStart ? "bg-[#1b8b99] hover:bg-[#15727e] text-white shadow-xs" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                            بدء الكشف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {appointments.length === 0 && (
                  <div className="p-12 text-center text-gray-400 text-sm font-medium">لا توجد مواعيد مجدولة.</div>
                )}
              </>
            )}

            <div className="border-t border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between flex-row-reverse">
              <p className="text-xs sm:text-sm font-bold text-gray-500">
                عرض <span className="text-gray-700">{appointments.length}</span> من أصل <span className="text-gray-700">{totalCount}</span> موعد
              </p>
              <div className="flex items-center gap-1.5" dir="ltr">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className={`w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-gray-500 hover:bg-slate-50 transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${currentPage === i + 1 ? "bg-[#1b8b99] text-white" : "border border-slate-200 bg-white text-gray-600 hover:bg-slate-50"}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className={`w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-gray-500 hover:bg-slate-50 transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AppointmentManagement;
