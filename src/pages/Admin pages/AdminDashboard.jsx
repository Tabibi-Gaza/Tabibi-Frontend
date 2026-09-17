import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FiUserCheck, FiUsers, FiClock, FiDollarSign, FiTrendingUp, FiTrendingDown, FiChevronDown, FiChevronUp, FiExternalLink, FiEye, FiX, FiDownload, FiAlertTriangle, FiBriefcase, FiUser } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useTranslation } from 'react-i18next';

const STATUS_BADGES = {
    مكتمل: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    مؤكد: 'bg-sky-50 text-sky-700 border border-sky-200',
    ملغي: 'bg-red-50 text-red-700 border border-red-200',
};

const AdminDashboard = () => {
    const { token, dashboardData, loadDashboardData, changeDoctorStatus } = useContext(AppContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
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
                try {
                    if (typeof loadDashboardData === 'function') {
                        await loadDashboardData();
                    }
                } catch (error) {
                    // silently handle dashboard load error
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
        try {
            if (typeof changeDoctorStatus === 'function') {
                await changeDoctorStatus(doctorId, status);
            } else {
                await new Promise(resolve => setTimeout(resolve, 600));
            }
            setProcessedDoctorIds(prev => [...prev, doctorId]);
        } catch (error) {
            // silently handle action error
        } finally {
            setActionLoading(null);
        }
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
            toast.success(t('adminDashboard.downloadSuccess'));
        } catch (error) {
            toast.error(t('adminDashboard.downloadFailed'));
        }
    };

    const handleConfirmReject = async () => {
        if (!rejectReasonInput.trim()) {
            toast.error(t('adminDashboard.writeRejectionReason'));
            return;
        }
        const currentId = selectedRequest?.id;
        const currentName = selectedRequest?.name;
        if (!currentId) return;
        setActionLoading(currentId);
        try {
            const { data } = await axiosInstance.post('/admin/doctor-applications/reject', {
                Id: currentId,
                Reason: rejectReasonInput
            });
            if (data.succeeded) {
                toast.success(data.message || t('adminDashboard.requestRejected'));
                setShowRejectModal(false);
                setSelectedRequest(null);
                setSelectedDetails(null);
                setProcessedDoctorIds(prev => [...prev, currentId]);
                try {
                    await loadDashboardData();
                } catch (e) {
                    // silently handle refresh error
                }
            } else {
                toast.error(data.errors?.[0]?.message || data.message || t('adminDashboard.rejectFailed'));
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || t('adminDashboard.rejectError'));
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
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-32 rounded-2xl p-5 flex flex-col justify-between">
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
        return value?.toLocaleString('en-US') || '0';
    };

    const cards = [
        {
            id: 1, title: t('adminDashboard.totalDoctors'), value: statsData.totalDoctors || 0,
            badge: t('adminDashboard.active'), badgeBg: 'bg-[#138C9F]/10', badgeText: 'text-[#138C9F]',
            icon: <FiUserCheck size={20} />, iconBg: 'bg-[#138C9F]/10', iconColor: 'text-[#138C9F]',
            valueColor: 'text-[#138C9F]', borderHover: 'hover:border-[#138C9F]/40',
        },
        {
            id: 2, title: t('adminDashboard.totalPatients'), value: statsData.totalPatients || 0,
            badge: t('adminDashboard.registered'), badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700',
            icon: <FiUsers size={20} />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
            valueColor: 'text-emerald-600', borderHover: 'hover:border-emerald-400/40',
        },
        {
            id: 3, title: t('adminDashboard.todayAppointments'), value: statsData.todayAppointments || 0,
            badge: t('adminDashboard.live'), badgeBg: 'bg-sky-50', badgeText: 'text-sky-700',
            icon: <FiClock size={20} />, iconBg: 'bg-sky-50', iconColor: 'text-sky-600',
            valueColor: 'text-sky-600', borderHover: 'hover:border-sky-400/40',
        },
        {
            id: 4, title: t('adminDashboard.totalRevenue'), value: (statsData.totalRevenue || 0) + subscriptionRevenue,
            badge: statsData.revenueGrowth != null ? (statsData.revenueGrowth >= 0 ? `+${statsData.revenueGrowth}%` : `${statsData.revenueGrowth}%`) : '0%',
            badgeBg: statsData.revenueGrowth != null ? (statsData.revenueGrowth >= 0 ? 'bg-emerald-50' : 'bg-red-50') : 'bg-emerald-50',
            badgeText: statsData.revenueGrowth != null ? (statsData.revenueGrowth >= 0 ? 'text-emerald-700' : 'text-red-700') : 'text-emerald-700',
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
            <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl shadow-lg p-3 text-right" dir="rtl">
                <p className="text-xs font-bold text-[#0B1C30] dark:text-white mb-1">{label}</p>
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
                <h1 className="text-2xl md:text-[28px] font-extrabold text-[#138C9F] tracking-tight">{t('adminDashboard.dashboard')}</h1>
                <p className="text-xs md:text-sm font-semibold text-[#526069] dark:text-gray-400 mt-1">{t('adminDashboard.overview')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((stat) => (
                    <div key={stat.id} className={`bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-all duration-300 ${stat.borderHover}`}>
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
                            <p className="text-[11px] font-bold text-[#526069] dark:text-gray-400 mb-0.5">{stat.title}</p>
                            <h3 className={`text-2xl font-extrabold ${stat.valueColor}`}>
                                {stat.isRevenue ? formatRevenue(stat.value) : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-start">

                <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-2xl p-5 flex flex-col min-h-[300px] shadow-xs">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-gray-700 mb-4">
                        <h3 className="font-bold text-[15px] text-[#138C9F]">{t('adminDashboard.newDoctorRequests')}</h3>
                        <span className="text-[10px] font-bold bg-[#138C9F]/10 text-[#138C9F] px-2 py-0.5 rounded-full">
                            {localDoctorRequests.length} {t('adminDashboard.requestCount')}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pl-1 custom-scrollbar">
                        {localDoctorRequests.length > 0 ? (
                            localDoctorRequests.map((req, index) => (
                                <div key={req.id || index} className="bg-[#ecf8fa] dark:bg-gray-900 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-3.5 flex flex-col gap-2.5 transition-all hover:shadow-xs">
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
                                            <h4 className="font-bold text-[13px] text-[#0B1C30] dark:text-white truncate">{req.name}</h4>
                                            <p className="text-[11px] font-semibold text-[#138C9F] truncate">{req.specialty || t('adminDashboard.unspecified')}</p>
                                        </div>
                                        <button
                                            onClick={() => fetchDetails(req)}
                                            className="w-8 h-8 rounded-lg bg-[#138C9F]/10 text-[#138C9F] flex items-center justify-center hover:bg-[#138C9F]/20 transition-colors shrink-0"
                                            title={t('adminDashboard.viewDetails')}
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
                                            {actionLoading === req.id ? '...' : t('adminDashboard.accept')}
                                        </button>
                                        <button
                                            disabled={actionLoading === req.id}
                                            onClick={() => { setSelectedRequest(req); setShowRejectModal(true); setRejectReasonInput(''); }}
                                            className="h-8 rounded-lg border border-[#C3C6D6] dark:border-gray-700 text-[#526069] dark:text-gray-400 text-xs font-bold hover:bg-slate-100 dark:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {t('adminDashboard.reject')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-500 gap-2">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
                                    <FiUserCheck size={20} className="text-gray-300" />
                                </div>
                                <p className="text-xs font-semibold text-gray-400">{t('adminDashboard.noPendingRequests')}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/admin/join-requests')}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#138C9F]/30 text-[#138C9F] text-xs font-bold hover:bg-[#138C9F]/5 transition-colors cursor-pointer"
                    >
                        {t('adminDashboard.viewAllRequests')}
                        <FiExternalLink size={12} />
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-2xl p-5 flex flex-col min-h-[300px] shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-[15px] text-[#138C9F]">{t('adminDashboard.appointmentStats')}</h3>
                            <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">{t('adminDashboard.appointmentTrend')}</p>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#138C9F] rounded-sm"></span>
                                <span className="text-slate-500">{t('adminDashboard.completed')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-[#60a5fa] rounded-sm"></span>
                                <span className="text-slate-500">{t('adminDashboard.confirmed')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 bg-red-300 rounded-sm"></span>
                                <span className="text-slate-500">{t('adminDashboard.cancelled')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1" style={{ minHeight: 220 }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
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
                                <p className="text-xs font-semibold">{t('adminDashboard.noDataAvailable')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-[15px] text-[#138C9F]">{t('adminDashboard.latestBookings')}</h3>
                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {t('adminDashboard.lastBookings', { count: displayedAppointments.length })}
                    </span>
                </div>

                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f0fafb] text-[#138C9F] font-bold h-11 border-b border-[#C3C6D6] dark:border-gray-700/60">
                                <th className="px-4 rounded-r-xl text-[12px]">{t('adminDashboard.patient')}</th>
                                <th className="px-4 text-[12px]">{t('adminDashboard.doctor')}</th>
                                <th className="px-4 text-[12px] hidden md:table-cell">{t('adminDashboard.specialty')}</th>
                                <th className="px-4 text-[12px] hidden md:table-cell">{t('adminDashboard.amount')}</th>
                                <th className="px-4 text-[12px]">{t('adminDashboard.dateTime')}</th>
                                <th className="px-4 rounded-l-xl text-[12px]">{t('adminDashboard.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {displayedAppointments.length > 0 ? (
                                displayedAppointments.map((appt, index) => {
                                    const statusLabel = appt.cancelled ? t('adminDashboard.cancelled') : appt.isCompleted ? t('adminDashboard.completed') : t('adminDashboard.confirmed');
                                    return (
                                        <tr key={appt.id || index} className="hover:bg-slate-50 dark:bg-gray-900/50 transition-colors h-12">
                                            <td className="px-4 text-[#0B1C30] dark:text-white font-bold text-[13px]">{appt.patient}</td>
                                            <td className="px-4 text-[#138C9F] font-semibold text-[13px]">{appt.doctor}</td>
                                            <td className="px-4 text-slate-500 dark:text-gray-400 text-[12px] hidden md:table-cell">{appt.specialty || '-'}</td>
                                            <td className="px-4 text-[#0B1C30] dark:text-white font-bold text-[12px] hidden md:table-cell" dir="ltr" style={{ textAlign: 'right' }}>
                                                {appt.amount ? `${appt.amount} ₪` : '-'}
                                            </td>
                                            <td className="px-4 text-slate-500 dark:text-gray-400 text-[11px]" dir="ltr" style={{ textAlign: 'right' }}>
                                                {appt.slotDate} — {appt.slotTime}
                                            </td>
                                            <td className="px-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${STATUS_BADGES[statusLabel] || 'bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400'}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-10 text-center text-gray-300 dark:text-gray-500 text-xs font-semibold">
                                        {t('adminDashboard.noBookings')}
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
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-xs font-bold hover:bg-slate-200 transition-all duration-200 cursor-pointer"
                            >
                                <FiChevronUp size={14} /> عرض أقل
                            </button>
                        )}
                    </div>
                )}
            </div>

            {selectedRequest && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[650px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-[16px] shadow-2xl border border-gray-100 dark:border-gray-700 text-right flex flex-col">
                        {/* Header */}
                        <div className="w-full bg-[#138C9F] relative flex items-end justify-between px-6 pb-4 shrink-0">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white dark:bg-gray-800/20 text-white flex items-center justify-center hover:bg-white dark:bg-gray-800/30"
                            >
                                <FiX size={16} />
                            </button>
                                <div className="absolute -bottom-8 right-6 flex items-center gap-4">
                                <div className="w-[100px] h-[100px] bg-white dark:bg-gray-800 rounded-[12px] p-1 shadow-md">
                                    {selectedRequest.img ? (
                                        <img loading="lazy" decoding="async" width="96" height="96" src={resolveImageUrl(selectedRequest.img)} alt={selectedRequest.name} className="w-full h-full rounded-[10px] object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                                    ) : null}
                                    <div className={`w-full h-full bg-[#E5EEFF] rounded-[10px] items-center justify-center text-[#138C9F] font-bold text-[28px] ${selectedRequest.img ? 'hidden' : 'flex'}`}>
                                        {selectedRequest.name ? selectedRequest.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 px-6 md:px-8 pb-4 flex flex-col gap-5 overflow-y-auto flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#434654]">{selectedRequest.name}</h3>
                                <span className="bg-[#E5EEFF] text-[#138C9F] text-[13px] font-bold px-3 py-1 rounded-md">
                                    {t('adminDashboard.doctorLabel')}
                                </span>
                            </div>

                            {selectedDetails && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* التفاصيل المهنية */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-[12px] p-4 space-y-3">
                                        <h4 className="text-[14px] font-bold text-[#138C9F] border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                                            <FiBriefcase size={14} />
                                            {t('adminDashboard.professionalDetails')}
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.specialization')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.specialization || selectedRequest.specialty || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.yearsOfExperience')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.yearsOfExperience || '-'} {t('adminDashboard.yearsSuffix')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.licenseNumber')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.licenseNumber || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.sessionPrice')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.sessionPrice ? `${selectedDetails.sessionPrice} ₪` : '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.clinic')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.clinicName || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.clinicAddress')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.clinicAddress || '-'}</span>
                                        </div>
                                        {selectedDetails.bio && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="text-[12px] font-bold text-[#737685] block mb-1">{t('adminDashboard.professionalBio')}</span>
                                                <p className="text-[12px] text-[#434654] leading-relaxed">{selectedDetails.bio}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* المعلومات الشخصية */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-[12px] p-4 space-y-3">
                                        <h4 className="text-[14px] font-bold text-[#138C9F] border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                                            <FiUser size={14} />
                                            {t('adminDashboard.personalInfo')}
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.email')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654] truncate max-w-[180px]">{selectedDetails.email || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.phoneNumber')}</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.phoneNumber || '-'}</span>
                                        </div>
                                        {selectedDetails.secretaryEmail && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">{t('adminDashboard.secretaryEmail')}</span>
                                                <span className="text-[13px] font-semibold text-[#434654] truncate max-w-[180px]">{selectedDetails.secretaryEmail}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* أزرار التحميل */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDownload(selectedRequest.id, 'cv')}
                                    className="flex-1 h-12 bg-[#138C9F] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#0f7282] transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <FiDownload size={14} />
                                    {t('adminDashboard.downloadCV')}
                                </button>
                                <button
                                    onClick={() => handleDownload(selectedRequest.id, 'id')}
                                    className="flex-1 h-12 border border-[#138C9F] text-[#138C9F] bg-white dark:bg-gray-800 rounded-[8px] text-[13px] font-bold hover:bg-[#138C9F]/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <FiDownload size={14} />
                                    {t('adminDashboard.downloadId')}
                                </button>
                            </div>

                            {selectedRequest.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-[#BA1A1A] font-bold text-[14px]">
                                        <FiAlertTriangle size={14} />
                                        <span>{t('adminDashboard.rejectionReason')}</span>
                                    </div>
                                    <p className="text-[13px] text-[#961212] pr-6 font-medium">{selectedRequest.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 md:px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="px-5 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] hover:bg-gray-50 dark:bg-gray-900 w-full sm:w-auto"
                            >
                                {t('adminDashboard.close')}
                            </button>
                            <button
                                onClick={() => { setShowRejectModal(true); setRejectReasonInput(''); }}
                                className="px-5 h-[42px] border border-[#BA1A1A] text-[#BA1A1A] rounded-[8px] text-[14px] font-bold hover:bg-red-50 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <FiX size={14} />
                                <span>{t('adminDashboard.rejectRequest')}</span>
                            </button>
                            <button
                                onClick={async () => {
                                    setActionLoading(selectedRequest.id);
                                    await handleAction(selectedRequest.id, 'approved');
                                    setSelectedRequest(null);
                                    setSelectedDetails(null);
                                }}
                                disabled={actionLoading === selectedRequest.id}
                                className="px-6 h-[42px] bg-[#138C9F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#0f7282] flex items-center justify-center gap-2 w-full sm:w-auto flex-1 disabled:opacity-50"
                            >
                                {actionLoading === selectedRequest.id ? t('adminDashboard.processing') : t('adminDashboard.acceptAndActivate')}
                            </button>
                        </div>
                    </div>
            </div>
            )}
            {/* ── Modal تأكيد الرفض ── */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[440px] bg-white dark:bg-gray-800 rounded-[16px] p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-gray-700 text-center text-right">
                        <div className="w-[56px] h-[56px] bg-red-50 text-[#BA1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={28} />
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#434654] text-center">{t('adminDashboard.rejectReasonTitle')}</h3>
                        <p className="text-[13px] text-[#737685] mt-1 px-4 text-center">
                            {t('adminDashboard.rejectReasonDescription')}
                        </p>
                        <div className="mt-4 text-right">
                            <label className="text-[13px] font-bold text-[#434654] block mb-1">{t('adminDashboard.reasonDetails')}</label>
                            <textarea
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                placeholder={t('adminDashboard.reasonPlaceholder')}
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
                                {actionLoading ? t('adminDashboard.processing') : t('adminDashboard.confirmRejection')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminDashboard;
