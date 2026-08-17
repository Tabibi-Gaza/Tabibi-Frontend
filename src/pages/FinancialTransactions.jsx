import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

const FinancialTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [cursor, setCursor] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const fetchTransactions = useCallback(async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);
        try {
            const params = { PageSize: 50 };
            if (cursor) params.Cursor = cursor;
            const { data } = await axiosInstance.get('/patient/transactions', { params });
            if (data.succeeded && data.data) {
                const newTx = data.data.transactions || [];
                setTransactions(prev => isLoadMore ? [...prev, ...newTx] : newTx);
                setTotalCount(data.data.totalCount || 0);
                setTotalAmount(data.data.totalAmount || 0);
                setHasNextPage(data.data.hasNextPage || false);
                if (newTx.length > 0) {
                    setCursor(newTx[newTx.length - 1].transactionDate);
                }
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [cursor]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleLoadMore = () => {
        if (hasNextPage && !loadingMore) {
            fetchTransactions(true);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(item => {
            const matchesSearch = !searchTerm ||
                (item.doctorName && item.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.doctorSpecialization && item.doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            if (dateFrom || dateTo) {
                const txDate = new Date(item.transactionDate);
                const from = dateFrom ? new Date(dateFrom) : null;
                const to = dateTo ? new Date(dateTo) : null;
                if (from && txDate < from) return false;
                if (to && txDate > to) return false;
            }

            return true;
        });
    }, [transactions, searchTerm, dateFrom, dateTo]);

    const displayTotal = useMemo(() => {
        if (searchTerm || dateFrom || dateTo) {
            return filteredTransactions.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2);
        }
        return totalAmount.toFixed(2);
    }, [filteredTransactions, totalAmount, searchTerm, dateFrom, dateTo]);

    const handleDownloadInvoice = (invoiceUrl) => {
        if (invoiceUrl) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
            window.open(`${baseUrl}/${invoiceUrl}`, '_blank');
        }
    };

    const getInitial = (name) => {
        if (!name) return '؟';
        return name.charAt(0);
    };

    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'paid' || s === 'تم الدفع' || s === 'approved') return 'bg-[#DCFCE7] text-[#166534]';
        if (s === 'pending' || s === 'قيد الانتظار' || s === 'قيد المراجعة') return 'bg-[#FFF7E6] text-[#B45309]';
        if (s === 'rejected' || s === 'مرفوض') return 'bg-[#FEE2E2] text-[#991B1B]';
        return 'bg-[#DCFCE7] text-[#166534]';
    };

    const getStatusText = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'paid' || s === 'تم الدفع' || s === 'approved') return 'تم الدفع';
        if (s === 'pending' || s === 'قيد الانتظار' || s === 'قيد المراجعة') return 'قيد المراجعة';
        if (s === 'rejected' || s === 'مرفوض') return 'مرفوض';
        return status || 'تم الدفع';
    };

    if (loading) {
        return (
            <div className="bg-[#ecf8fa] min-h-screen font-['Cairo'] flex items-center justify-center" dir="rtl">
                <Loader2 className="w-8 h-8 text-[#138C9F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#ecf8fa] min-h-screen font-['Cairo'] py-6 px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <section className="bg-white border border-[#C3C6D6] rounded-2xl p-6 md:p-8">
                    <div className="text-right mb-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#138C9F] mb-2">
                            المعاملات المالية
                        </h1>
                        <p className="text-sm md:text-base text-[#526069]">
                            تتبع جميع المعاملات المالية، الفواتير، وحالة الدفعات الخاصة بك بكل سهولة.
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-xl border border-[#e2e8f0]">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="ابحث باسم الطبيب أو التخصص..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-11 px-4 border border-[#C3C6D6] rounded-xl text-sm bg-white text-[#0B1C30] outline-none focus:border-[#138C9F] placeholder-gray-400 font-['Cairo']"
                            />
                        </div>
                        <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-3 w-full justify-end" dir="ltr">
                            <div className="w-full sm:w-auto flex items-center gap-2">
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full sm:w-52 px-3 h-11 border border-[#C3C6D6] rounded-xl bg-[#138C9F]/5 text-[#138C9F] text-sm font-semibold text-center outline-none focus:border-[#138C9F] cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-500 min-w-[20px] text-center">إلى</span>
                            </div>
                            <div className="w-full sm:w-auto">
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full sm:w-52 px-3 h-11 border border-[#C3C6D6] rounded-xl bg-[#138C9F]/5 text-[#138C9F] text-sm font-semibold text-center outline-none focus:border-[#138C9F] cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-2">
                        <span className="text-xl font-extrabold text-[#138C9F]">المعاملات الأخيرة</span>
                        <span className="text-sm font-bold text-[#526069]">
                            إجمالي المدفوعات ({displayTotal} ₪)
                        </span>
                    </div>

                    <div className="hidden md:block overflow-x-auto border border-[#C3C6D6] rounded-t-xl">
                        <table className="w-full table-fixed min-w-[700px] border-collapse">
                            <thead>
                                <tr className="h-14 bg-[#e2f4f7]">
                                    <th className="w-[20%] text-sm font-bold text-[#526069] text-center px-4">التاريخ</th>
                                    <th className="w-[35%] text-sm font-bold text-[#526069] text-center px-4">الطبيب/الخدمة</th>
                                    <th className="w-[15%] text-sm font-bold text-[#526069] text-center px-4">المبلغ</th>
                                    <th className="w-[15%] text-sm font-bold text-[#526069] text-center px-4">الحالة</th>
                                    <th className="w-[15%] text-sm font-bold text-[#526069] text-center px-4">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((item) => (
                                    <tr key={item.id} className="border-b border-[#C3C6D6]/50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-5 text-center text-sm font-medium text-[#526069] align-middle">
                                            {item.transactionDate}
                                        </td>
                                        <td className="px-4 py-5 align-middle">
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="w-10 h-10 rounded-full bg-[#138C9F]/10 text-[#138C9F] grid place-items-center text-sm font-bold shrink-0 select-none">
                                                    {getInitial(item.doctorName)}
                                                </span>
                                                <div className="text-right">
                                                    <strong className="block text-[#0B1C30] text-sm font-bold">{item.doctorName}</strong>
                                                    <small className="block text-[#526069] text-xs mt-0.5">{item.doctorSpecialization}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center text-[15px] font-bold text-[#138C9F] align-middle">
                                            {item.amount?.toFixed(2)} {item.currency || 'ILS'}
                                        </td>
                                        <td className="px-4 py-5 text-center align-middle">
                                            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyle(item.status)}`}>
                                                {getStatusText(item.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 align-middle text-center">
                                            <div className="flex justify-center items-center">
                                                {item.hasReceipt && item.invoiceUrl ? (
                                                    <button
                                                        onClick={() => handleDownloadInvoice(item.invoiceUrl)}
                                                        className="p-2 rounded-lg hover:bg-[#138C9F]/10 transition-colors cursor-pointer"
                                                        title="تحميل الإيصال"
                                                    >
                                                        <Download size={18} className="text-[#138C9F]" />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredTransactions.map((item) => (
                            <div key={item.id} className="bg-white border border-[#C3C6D6] rounded-xl p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-9 h-9 rounded-full bg-[#138C9F]/10 text-[#138C9F] grid place-items-center text-sm font-bold shrink-0">
                                            {getInitial(item.doctorName)}
                                        </span>
                                        <div className="text-right">
                                            <strong className="block text-[#0B1C30] text-sm font-bold">{item.doctorName}</strong>
                                            <small className="block text-[#526069] text-xs">{item.doctorSpecialization}</small>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)}`}>
                                        {getStatusText(item.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-[#526069] pt-1">
                                    <span>{item.transactionDate}</span>
                                    <span className="font-bold text-[#138C9F] text-sm">{item.amount?.toFixed(2)} {item.currency || 'ILS'}</span>
                                    {item.hasReceipt && item.invoiceUrl ? (
                                        <button onClick={() => handleDownloadInvoice(item.invoiceUrl)} className="p-1.5 rounded-lg bg-[#138C9F]/10 cursor-pointer">
                                            <Download size={14} className="text-[#138C9F]" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12 text-[#526069] border border-dashed border-[#C3C6D6] rounded-xl">
                            لم يتم العثور على أي معاملات تطابق معايير البحث الحالية.
                        </div>
                    )}

                    {hasNextPage && !searchTerm && !dateFrom && !dateTo && (
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="w-full h-14 grid place-items-center bg-[#138C9F]/10 text-[#138C9F] text-lg font-extrabold border border-[#C3C6D6] border-t-0 cursor-pointer rounded-b-xl hover:bg-[#138C9F]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loadingMore ? <><Loader2 size={18} className="animate-spin" /> جاري التحميل...</> : 'عرض المزيد من المعاملات'}
                        </button>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FinancialTransactions;
