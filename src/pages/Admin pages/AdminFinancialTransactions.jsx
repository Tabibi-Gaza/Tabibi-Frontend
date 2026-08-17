import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, Calendar, CheckCircle2, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';

export default function AdminFinancialTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalAppointments: 0, successfulPayments: 0, pendingPayments: 0, totalRevenue: 0 });
    const [statsLoading, setStatsLoading] = useState(false);

    const [filterStatus, setFilterStatus] = useState('الكل');
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const INITIAL_VISIBLE_COUNT = 3;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/payments/all');
            if (data.succeeded && data.data) {
                const items = Array.isArray(data.data) ? data.data : data.data.items || [];
                setTransactions(items.map(t => ({
                    id: t.id,
                    doctorName: t.doctorName || '-',
                    amount: t.amount,
                    date: t.date || t.createdAt,
                    status: t.status === 'Approved' || t.status === 'مكتمل' ? 'مكتمل' : t.status === 'Rejected' || t.status === 'ملغى' || t.status === 'مرفوض' ? 'ملغى' : 'قيد الانتظار',
                    notes: t.notes || t.reason || '',
                    type: t.type || 'اشتراك',
                })));
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('خطأ في جلب المعاملات المالية:', error);
            toast.error('فشل في جلب المعاملات المالية');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/stats');
            if (data.succeeded && data.data) {
                setStats({
                    totalAppointments: data.data.totalActiveSubscriptions || 0,
                    successfulPayments: data.data.totalRevenue || 0,
                    pendingPayments: data.data.pendingPayments || 0,
                    totalRevenue: data.data.totalRevenue || 0,
                });
            }
        } catch (error) {
            console.error('خطأ في جلب الإحصائيات:', error);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
        fetchStats();
    }, [fetchTransactions, fetchStats]);

    const filteredTransactions = transactions.filter(t => filterStatus === 'الكل' || t.status === filterStatus);
    const displayedTransactions = filteredTransactions.slice(0, visibleCount);

    const handleToggleShow = () => {
        if (visibleCount >= filteredTransactions.length) {
            setVisibleCount(INITIAL_VISIBLE_COUNT);
        } else {
            setVisibleCount(filteredTransactions.length);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        } catch { return dateStr; }
    };

    return (
        <div className="w-full bg-[#ecf8fa] font-['Cairo']" dir="rtl">
            <div className="mx-auto flex flex-col gap-6">
                <div className="text-right">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#1b8b99]">
                        المعاملات المالية
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        تتبع أرباحك وإدارة معاملاتك المالية بكل سهولة.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#C3C6D6] rounded-[12px] p-6 flex items-center justify-between shadow-xs">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-[12px] font-bold text-[#434654] tracking-[0.6px]">إجمالي الاشتراكات</span>
                            <span className="text-[20px] font-semibold text-[#0B1C30]">{stats.totalAppointments}</span>
                        </div>
                        <div className="w-12 h-12 rounded-[8px] bg-[#E5EEFF] flex items-center justify-center text-[#138C9F]">
                            <Calendar className="w-[18px] h-[20px]" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#C3C6D6] rounded-[12px] p-6 flex items-center justify-between shadow-xs">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-[12px] font-bold text-[#434654] tracking-[0.6px]">إجمالي الإيرادات</span>
                            <span className="text-[20px] font-semibold text-[#0B1C30]">{stats.totalRevenue} ₪</span>
                        </div>
                        <div className="w-12 h-12 rounded-[8px] bg-[rgba(107,255,143,0.3)] flex items-center justify-center text-[#006A2D]">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#C3C6D6] rounded-[12px] p-6 flex items-center justify-between shadow-xs">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-[12px] font-bold text-[#434654] tracking-[0.6px]">مدفوعات معلقة</span>
                            <span className="text-[20px] font-semibold text-[#0B1C30]">{stats.pendingPayments}</span>
                        </div>
                        <div className="w-12 h-12 rounded-[8px] bg-[rgba(255,218,214,0.3)] flex items-center justify-center text-[#BA1A1A]">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#C3C6D6] rounded-[12px] shadow-xs flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-[#C3C6D6] flex items-center justify-between bg-white relative">
                        <h3 className="text-[20px] font-bold text-black">المعاملات المالية</h3>

                        <div className="relative">
                            <button
                                onClick={() => setIsOpenFilter(!isOpenFilter)}
                                className="bg-[#e2f4f7] border border-[#C3C6D6] rounded-full px-4 py-2 flex items-center gap-2 text-[14px] font-bold text-[#138C9F] hover:bg-[#e1ecff] transition-all cursor-pointer"
                            >
                                <span>تصفية</span>
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {isOpenFilter && (
                                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                                    {['الكل', 'مكتمل', 'قيد الانتظار', 'ملغى'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(status);
                                                setVisibleCount(INITIAL_VISIBLE_COUNT);
                                                setIsOpenFilter(false);
                                            }}
                                            className={`w-full text-right px-4 py-2 text-sm font-medium transition-colors ${filterStatus === status ? 'bg-[#e2f4f7] text-[#138C9F]' : 'text-gray-700 hover:bg-slate-50'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-right border-collapse min-w-[800px]">
                            <thead className="bg-[rgba(239,244,255,0.5)]">
                                <tr>
                                    <th className="p-4 px-6 text-[12px] font-bold text-[#434654] tracking-[0.6px]">اسم الطبيب</th>
                                    <th className="p-4 px-6 text-[12px] font-bold text-[#434654] tracking-[0.6px]">المبلغ</th>
                                    <th className="p-4 px-6 text-[12px] font-bold text-[#434654] tracking-[0.6px]">التاريخ</th>
                                    <th className="p-4 px-6 text-[12px] font-bold text-[#434654] tracking-[0.6px]">النوع</th>
                                    <th className="p-4 px-6 text-[12px] font-bold text-[#434654] tracking-[0.6px]">الحالة</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                                            جاري تحميل البيانات...
                                        </td>
                                    </tr>
                                ) : displayedTransactions.map((item) => (
                                    <tr key={item.id} className="border-t border-[#C3C6D6] hover:bg-slate-50/50 transition-colors h-[65px]">
                                        <td className="p-4 px-6 text-[14px] font-semibold text-black">{item.doctorName}</td>
                                        <td className="p-4 px-6 text-[14px] font-semibold text-black">{item.amount} ₪</td>
                                        <td className="p-4 px-6 text-[14px] font-normal text-[#434654]">{formatDate(item.date)}</td>
                                        <td className="p-4 px-6">
                                            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#e2f4f7] text-[12px] font-bold text-[#138C9F]">
                                                {item.type || 'اشتراك'}
                                            </span>
                                        </td>
                                        <td className="p-4 px-6">
                                            {item.status === 'مكتمل' && (
                                                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[rgba(107,255,143,0.2)] text-[12px] font-bold text-[#006A2D]">مكتمل</span>
                                            )}
                                            {item.status === 'قيد الانتظار' && (
                                                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#D3E2ED] text-[12px] font-bold text-[#56656E]">قيد الانتظار</span>
                                            )}
                                            {item.status === 'ملغى' && (
                                                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#FFDAD6] text-[12px] font-bold text-[#BA1A1A]">ملغى</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!loading && filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                                            لا توجد معاملات مالية تطابق خيار التصفية الحالي.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {filteredTransactions.length > INITIAL_VISIBLE_COUNT && (
                        <div className="w-full h-13 bg-[rgba(239,244,255,0.3)] flex items-center justify-center border-t border-[#C3C6D6]">
                            <button
                                onClick={handleToggleShow}
                                className="text-[14px] font-bold text-[#138C9F] hover:text-[#0f6c7c] transition-colors cursor-pointer flex items-center gap-1 w-full h-full justify-center"
                            >
                                <span>{visibleCount >= filteredTransactions.length ? 'عرض أقل' : 'عرض المزيد'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
