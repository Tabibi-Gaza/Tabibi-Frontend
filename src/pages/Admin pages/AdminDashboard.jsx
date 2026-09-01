import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FiUserCheck, FiUsers, FiClock, FiDollarSign, FiTrendingUp, FiTrendingDown, FiChevronDown, FiChevronUp, FiExternalLink, FiEye, FiX, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { resolveImageUrl } from '../../utils/imageUrl';

const STATUS_BADGES = {
    مكتمل: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    مؤكد: 'bg-sky-50 text-sky-700 border border-sky-200',
    ملغي: 'bg-red-50 text-red-700 border border-red-200',
};

const AdminDashboard = () => {
    const { token, dashboardData, loadDashboardData, changeDoctorStatus } = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [processedDoctorIds, setProcessedDoctorIds] = useState([]);
    const [visibleAppointmentsCount, setVisibleAppointmentsCount] = useState(5);
    const [subscriptionRevenue, setSubscriptionRevenue] = useState(0);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReasonInput, setRejectReasonInput] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            if (token) {
                setLoading(true);
                if (typeof loadDashboardData === 'function') {
                    await loadDashboardData();
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        fetchDashboard();

        const fetchSubscriptionStats = async () => {
            try {
                const { data } = await axiosInstance.get('/admin/subscriptions/stats');
                if (data.succeeded && data.data) {
                    setSubscriptionRevenue(data.data.totalRevenue || 0);
                }
            } catch (error) {

            }
        };
        fetchSubscriptionStats();
    }, [token]);

    const localDoctorRequests = (dashboardData?.doctorRequests || []).filter(req => !processedDoctorIds.includes(req.id));

    const handleAction = async (doctorId, status) => {
        setActionLoading(doctorId);
        setProcessedDoctorIds(prev => [...prev, doctorId]);
        if (typeof changeDoctorStatus === 'function') {
            await changeDoctorStatus(doctorId, status);
        } else {
            await new Promise(resolve => setTimeout(resolve, 600));
        }
        setActionLoading(null);
    };

    const fetchDetails = async (req) => {
        try {
            const { data } = await axiosInstance.get(`/admin/doctor-applications/${req.id}`);
            if (data.succeeded && data.data) {
                setSelectedDetails(data.data);
            } else {
                setSelectedDetails(null);
            }
        } catch (error) {
            setSelectedDetails(null);
        }
        setSelectedRequest(req);
    };

    const handleDownload = async (applicationId, type) => {
        try {
            const endpoint = type === 'cv'
                ? `/admin/doctor-applications/${applicationId}/download-cv`
                : `/admin/doctor-applications/${applicationId}/download-id-document`;

            const response = await axiosInstance.get(endpoint, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = type === 'cv' ? 'CV.pdf' : 'ID_Document.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('تم تحميل الملف بنجاح');
        } catch (error) {
            toast.error('فشل في تحميل الملف');
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectReasonInput.trim()) {
            toast.error("يرجى كتابة سبب الرفض أولاً");
            return;
        }
        setActionLoading(selectedRequest.id);
        setProcessedDoctorIds(prev => [...prev, selectedRequest.id]);
        try {
            const { data } = await axiosInstance.post('/admin/doctor-applications/reject', {
                Id: selectedRequest.id,
                Reason: rejectReasonInput
            });
            if (data.succeeded) {
                toast.success(data.message || 'تم رفض الطلب بنجاح');
                setShowRejectModal(false);
                setSelectedRequest(null);
                setSelectedDetails(null);
                await loadDashboardData();
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'فشل في رفض الطلب');
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء رفض الطلب');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full flex flex-col gap-8 text-right animate-pulse" dir="rtl">
                <div className="h-10 bg-gray-200 rounded-xl w-64 mb-2"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-gray-100 border border-gray-200 h-32 rounded-2xl p-5 flex flex-col justify-between">
                            <div className="flex justify-between items-start"><div className="w-10 h-10 bg-gray-200 rounded-xl"></div><div className="w-16 h-5 bg-gray-200 rounded-md"></div></div>
                            <div className="space-y-2"><div className="w-20 h-3 bg-gray-200 rounded"></div><div className="w-12 h-7 bg-gray-200 rounded"></div></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const statsData = dashboardData?.stats || {};
    const latestAppointments = dashboardData?.latestAppointments || [];
    const appointmentTrend = dashboardData?.appointmentTrend || [];
    const displayedAppointments = latestAppointments.slice(0, visibleAppointmentsCount);

    const formatRevenue = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value?.toLocaleString('ar-IQ') || '0';
    };

    const cards = [
        {
            id: 1, title: 'إجمالي الأطباء', value: statsData.totalDoctors || 0,
            badge: 'نشط', badgeBg: 'bg-[#138C9F]/10', badgeText: 'text-[#138C9F]',
            icon: <FiUserCheck size={20} />, iconBg: 'bg-[#138C9F]/10', iconColor: 'text-[#138C9F]',
            valueColor: 'text-[#138C9F]', borderHover: 'hover:border-[#138C9F]/40',
        },
        {
            id: 2, title: 'إجمالي المرضى', value: statsData.totalPatients || 0,
            badge: 'مسجل', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700',
            icon: <FiUsers size={20} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
            valueColor: 'text-emerald-600', borderHover: 'hover:border-emerald-400/40',
        },
        {
            id: 3, title: 'مواعيد اليوم', value: statsData.todayAppointments || 0,
            badge: 'مباشر', badgeBg: 'bg-sky-50', badgeText: 'text-sky-700',
            icon: <FiClock size={20} />, iconBg: 'bg-sky-50', iconColor: 'text-sky-600',
            valueColor: 'text-sky-600', borderHover: 'hover:border-sky-400/40',
        },
        {
            id: 4, title: 'إجمالي أرباح المنصة', value: (statsData.totalRevenue || 0) + subscriptionRevenue,
            badge: statsData.revenueGrowth >= 0 ? `+${statsData.revenueGrowth}%` : `${statsData.revenueGrowth}%`,
            badgeBg: statsData.revenueGrowth >= 0 ? 'bg-emerald-50' : 'bg-red-50',
            badgeText: statsData.revenueGrowth >= 0 ? 'text-emerald-700' : 'text-red-700',
            icon: <FiDollarSign size={20} />, iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
            valueColor: 'text-amber-600', borderHover: 'hover:border-amber-400/40',
            isRevenue: true,
            growthIcon: statsData.revenueGrowth >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />,
        },
    ];

    const chartData = appointmentTrend.map(item => ({
        name: new Date(item.date).toLocaleDateString('ar-IQ', { weekday: 'short' }),
        مكتمل: item.completed || 0,
        مؤكد: Math.max(0, (item.totalAppointments || 0) - (item.completed || 0) - (item.cancelled || 0)),
        ملغي: item.cancelled || 0,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white border border-[#C3C6D6] rounded-xl shadow-lg p-3 text-right" dir="rtl">
                <p className="text-xs font-bold text-[#0B1C30] mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-[11px] font-semibold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-7 text-right" dir="rtl">

            <div>
                <h1 className="text-2xl md:text-[28px] font-extrabold text-[#138C9F] tracking-tight">لوحة التحكم</h1>
                <p className="text-xs md:text-sm font-semibold text-[#526069] mt-1">نظرة عامة على أداء المنصة وإحصائياتها المباشرة</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((stat) => (
                    <div key={stat.id} className={`bg-white border border-[#C3C6D6] rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all duration-300 ${stat.borderHover}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${stat.badgeBg} ${stat.badgeText}`}>
                                    {stat.growthIcon}{stat.badge}
                                </span>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-[#526069] mb-0.5">{stat.title}</p>
                            <h3 className={`text-2xl font-extrabold ${stat.valueColor}`}>
                                {stat.isRevenue ? formatRevenue(stat.value) : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-start">

                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 flex flex-col min-h-[300px] shadow-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-bold text-[15px] text-[#138C9F]">طلبات الأطباء الجديدة</h3>
                        <span className="text-[10px] font-bold bg-[#138C9F]/10 text-[#138C9F] px-2 py-0.5 rounded-full">
                            {localDoctorRequests.length} طلب
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pl-1 custom-scrollbar">
                        {localDoctorRequests.length > 0 ? (
                            localDoctorRequests.map((req, index) => (
                                <div key={req.id || index} className="bg-[#ecf8fa] border border-[#C3C6D6] rounded-xl p-3.5 flex flex-col gap-2.5 transition-all hover:shadow-xs">
                                    <div className="flex items-center gap-3">
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            width="40"
                                            height="40"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                            src={resolveImageUrl(req.image || req.img) || 'https://via.placeholder.com/150'}
                                            alt={req.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                        />
                                        <div className="text-right flex-1 min-w-0">
                                            <h4 className="font-bold text-[13px] text-[#0B1C30] truncate">{req.name}</h4>
                                            <p className="text-[11px] font-semibold text-[#138C9F] truncate">{req.specialty || 'غير محدد'}</p>
                                        </div>
                                        <button
                                            onClick={() => fetchDetails(req)}
                                            className="w-8 h-8 rounded-lg bg-[#138C9F]/10 text-[#138C9F] flex items-center justify-center hover:bg-[#138C9F]/20 transition-colors shrink-0"
                                            title="عرض التفاصيل"
                                        >
                                            <FiEye size={14} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <button
                                            disabled={actionLoading === req.id}
                                            onClick={() => handleAction(req.id, 'approved')}
                                            className="h-8 rounded-lg bg-[#138C9F] text-white text-xs font-bold hover:bg-[#107585] transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {actionLoading === req.id ? '...' : 'قبول'}
                                        </button>
                                        <button
                                            disabled={actionLoading === req.id}
                                            onClick={() => { setSelectedRequest(req); setShowRejectModal(true); setRejectReasonInput(''); }}
                                            className="h-8 rounded-lg border border-[#C3C6D6] text-[#526069] text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            رفض
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                    <FiUserCheck size={20} className="text-gray-300" />
                                </div>
                                <p className="text-xs font-semibold text-gray-400">لا توجد طلبات معلقة</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/admin/join-requests')}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#138C9F]/30 text-[#138C9F] text-xs font-bold hover:bg-[#138C9F]/5 transition-colors cursor-pointer"
                    >
                        عرض جميع الطلبات
                        <FiExternalLink size={12} />
                    </button>
                </div>

                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 flex flex-col min-h-[300px] shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-[15px] text-[#138C9F]">إحصائيات المواعيد</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">حركة المواعيد خلال آخر 7 أيام</p>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#138C9F] rounded-sm"></span>
                                <span className="text-slate-500">مكتمل</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#60a5fa] rounded-sm"></span>
                                <span className="text-slate-500">مؤكد</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-red-300 rounded-sm"></span>
                                <span className="text-slate-500">ملغي</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#526069', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(19,140,159,0.04)' }} />
                                    <Bar dataKey="مكتمل" radius={[6, 6, 0, 0]} maxBarSize={32}>
                                        {chartData.map((_, idx) => <Cell key={idx} fill="#138C9F" />)}
                                    </Bar>
                                    <Bar dataKey="مؤكد" radius={[6, 6, 0, 0]} maxBarSize={32}>
                                        {chartData.map((_, idx) => <Cell key={idx} fill="#60a5fa" />)}
                                    </Bar>
                                    <Bar dataKey="ملغي" radius={[6, 6, 0, 0]} maxBarSize={32}>
                                        {chartData.map((_, idx) => <Cell key={idx} fill="#fca5a5" />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300">
                                <p className="text-xs font-semibold">لا توجد بيانات كافية</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#C3C6D6] rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[15px] text-[#138C9F]">أحدث الحجوزات</h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                        آخر {displayedAppointments.length} حجوزات
                    </span>
                </div>

                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f0fafb] text-[#138C9F] font-bold h-11 border-b border-[#C3C6D6]/60">
                                <th className="px-4 rounded-r-xl text-[12px]">المريض</th>
                                <th className="px-4 text-[12px]">الطبيب</th>
                                <th className="px-4 text-[12px] hidden md:table-cell">التخصص</th>
                                <th className="px-4 text-[12px] hidden md:table-cell">المبلغ</th>
                                <th className="px-4 text-[12px]">التاريخ والوقت</th>
                                <th className="px-4 rounded-l-xl text-[12px]">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {displayedAppointments.length > 0 ? (
                                displayedAppointments.map((appt, index) => {
                                    const statusLabel = appt.cancelled ? 'ملغي' : appt.isCompleted ? 'مكتمل' : 'مؤكد';
                                    return (
                                        <tr key={appt.id || index} className="hover:bg-slate-50/50 transition-colors h-12">
                                            <td className="px-4 text-[#0B1C30] font-bold text-[13px]">{appt.patient}</td>
                                            <td className="px-4 text-[#138C9F] font-semibold text-[13px]">{appt.doctor}</td>
                                            <td className="px-4 text-slate-500 text-[12px] hidden md:table-cell">{appt.specialty || '-'}</td>
                                            <td className="px-4 text-[#0B1C30] font-bold text-[12px] hidden md:table-cell" dir="ltr" style={{ textAlign: 'right' }}>
                                                {appt.amount ? `${appt.amount} د.ع` : '-'}
                                            </td>
                                            <td className="px-4 text-slate-500 text-[11px]" dir="ltr" style={{ textAlign: 'right' }}>
                                                {appt.slotDate} — {appt.slotTime}
                                            </td>
                                            <td className="px-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${STATUS_BADGES[statusLabel] || 'bg-slate-100 text-slate-500'}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-10 text-center text-gray-300 text-xs font-semibold">
                                        لا توجد حجوزات حالياً
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {latestAppointments.length > 5 && (
                    <div className="flex justify-center items-center mt-4 pt-3 border-t border-slate-100">
                        {visibleAppointmentsCount < latestAppointments.length ? (
                            <button
                                onClick={() => setVisibleAppointmentsCount(prev => Math.min(prev + 5, latestAppointments.length))}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#138C9F]/10 text-[#138C9F] text-xs font-bold hover:bg-[#138C9F] hover:text-white transition-all duration-200 cursor-pointer shadow-xs"
                            >
                                <FiChevronDown size={14} /> عرض المزيد
                            </button>
                        ) : (
                            <button
                                onClick={() => setVisibleAppointmentsCount(5)}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all duration-200 cursor-pointer"
                            >
                                <FiChevronUp size={14} /> عرض أقل
                            </button>
                        )}
                    </div>
                )}
            </div>

            {selectedRequest && (
            <div className="w-full max-w-[650px] max-h-[90vh] bg-white rounded-[16px] overflow-hidden shadow-2xl border border-gray-100 text-right flex flex-col">
                        {/* Header */}
                        <div className="w-full bg-[#138C9F] relative flex items-end justify-between px-6 pb-4 shrink-0">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                            >
                                <FiX size={16} />
                            </button>
                            <div className="absolute -bottom-8 right-6 flex items-center gap-4">
                                <div className="w-[84px] h-[84px] bg-white rounded-[12px] p-1 shadow-md">
                                    {selectedRequest.img ? (
                                        <img loading="lazy" decoding="async" width="480" height="480" src={resolveImageUrl(selectedRequest.img)} alt={selectedRequest.name} className="w-full h-full rounded-[10px] object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#E5EEFF] rounded-[10px] flex items-center justify-center text-[#138C9F] font-bold text-[24px]">
                                            {selectedRequest.name ? selectedRequest.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 px-6 md:px-8 pb-4 flex flex-col gap-5 overflow-y-auto flex-1">
                            <div className="flex flex-col items-start">
                                <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#434654]">{selectedRequest.name}</h3>
                                <span className="bg-[#E5EEFF] text-[#138C9F] text-[13px] font-bold px-3 py-1 rounded-md mt-1">
                                    {selectedRequest.specialty}
                                </span>
                            </div>

                            {selectedDetails && (
                                <>
                                    {selectedDetails.bio && (
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-[14px] font-bold text-[#737685]">النبذة المهنية</h4>
                                            <p className="text-[14px] text-[#434654] bg-[#ecf8fa] p-3 rounded-[8px] border border-gray-100 leading-relaxed">
                                                {selectedDetails.bio}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4 text-center">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">سنوات الخبرة</span>
                                            <span className="text-[16px] md:text-[18px] font-extrabold text-[#138C9F]">{selectedDetails.yearsOfExperience || selectedRequest.experience}+ سنة</span>
                                        </div>
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4 text-center">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">رقم الترخيص</span>
                                            <span className="text-[16px] md:text-[18px] font-extrabold text-[#138C9F]">{selectedDetails.licenseNumber || selectedRequest.licenseNumber || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">البريد الإلكتروني</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block truncate">{selectedDetails.email || '-'}</span>
                                        </div>
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">سعر الجلسة</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block">{selectedDetails.sessionPrice ? `${selectedDetails.sessionPrice} د.ع` : '-'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">اسم العيادة</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block">{selectedDetails.clinicName || '-'}</span>
                                        </div>
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">عنوان العيادة</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block truncate">{selectedDetails.clinicAddress || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">رقم الهاتف</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block">{selectedDetails.phoneNumber || '-'}</span>
                                        </div>
                                        <div className="bg-[#ecf8fa] border border-gray-200 rounded-[12px] p-4">
                                            <span className="text-[13px] font-bold text-[#737685] block mb-1">البريد الإلكتروني للسكرتير</span>
                                            <span className="text-[13px] font-semibold text-[#434654] block truncate">{selectedDetails.secretaryEmail || '-'}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col gap-2">
                                <h4 className="text-[14px] font-bold text-[#737685]">الشهادات والوثائق</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleDownload(selectedRequest.id, 'id')}
                                        className="border border-gray-200 rounded-[8px] p-3 flex flex-row-reverse items-center justify-between bg-white text-[13px] font-medium text-[#434654] hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <FiDownload size={14} className="text-[#138C9F]" />
                                        <span className="truncate max-w-[180px]">مزاولة المهنة / الهوية</span>
                                    </button>
                                    <button
                                        onClick={() => handleDownload(selectedRequest.id, 'cv')}
                                        className="border border-gray-200 rounded-[8px] p-3 flex flex-row-reverse items-center justify-between bg-white text-[13px] font-medium text-[#434654] hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <FiDownload size={14} className="text-[#138C9F]" />
                                        <span className="truncate max-w-[180px]">السيرة الذاتية (CV)</span>
                                    </button>
                                </div>
                            </div>

                            {selectedRequest.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-[#BA1A1A] font-bold text-[14px]">
                                        <FiAlertTriangle size={14} />
                                        <span>سبب الرفض:</span>
                                    </div>
                                    <p className="text-[13px] text-[#961212] pr-6 font-medium">{selectedRequest.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="px-5 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] hover:bg-gray-50 w-full sm:w-auto"
                            >
                                إغلاق
                            </button>
                            <button
                                onClick={() => { setShowRejectModal(true); setRejectReasonInput(''); }}
                                className="px-5 h-[42px] border border-[#BA1A1A] text-[#BA1A1A] rounded-[8px] text-[14px] font-bold hover:bg-red-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <FiX size={14} />
                                <span>رفض الطلب</span>
                            </button>
                            <button
                                onClick={async () => {
                                    setActionLoading(selectedRequest.id);
                                    setProcessedDoctorIds(prev => [...prev, selectedRequest.id]);
                                    await handleAction(selectedRequest.id, 'approved');
                                    setSelectedRequest(null);
                                    setSelectedDetails(null);
                                }}
                                disabled={actionLoading === selectedRequest.id}
                                className="px-6 h-[42px] bg-[#138C9F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#0f7282] flex items-center justify-center gap-2 w-full sm:w-auto flex-1 disabled:opacity-50"
                            >
                                {actionLoading === selectedRequest.id ? 'جاري...' : 'قبول وتفعيل الملف'}
                            </button>
                        </div>
                    </div>
            )}
            {/* ── Modal تأكيد الرفض ── */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[440px] bg-white rounded-[16px] p-4 sm:p-6 shadow-2xl border border-gray-100 text-center text-right">
                        <div className="w-[56px] h-[56px] bg-red-50 text-[#BA1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={28} />
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#434654] text-center">سبب الرفض</h3>
                        <p className="text-[13px] text-[#737685] mt-1 px-4 text-center">
                            يرجى توضيح سبب رفض طلب انضمام الطبيب ليتم إبلاغه بشكل رسمي.
                        </p>
                        <div className="mt-4 text-right">
                            <label className="text-[13px] font-bold text-[#434654] block mb-1">تفاصيل السبب</label>
                            <textarea
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                placeholder="اكتب هنا تفاصيل الرفض بدقة..."
                                className="w-full h-[100px] border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-[#138C9F] text-right resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] hover:bg-gray-50"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                disabled={actionLoading}
                                className="flex-1 h-[42px] bg-[#BA1A1A] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#961212] disabled:opacity-50"
                            >
                                {actionLoading ? 'جاري...' : 'تأكيد الرفض'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminDashboard;
