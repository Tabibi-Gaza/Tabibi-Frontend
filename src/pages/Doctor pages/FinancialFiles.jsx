import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    FiSearch, FiTrendingUp, FiClock, FiCheckCircle,
    FiAlertCircle, FiSmartphone, FiCreditCard, FiDollarSign, FiInfo,
    FiCalendar, FiDownload, FiFilter, FiPrinter, FiPlus, FiX,
    FiArrowDown, FiArrowUp, FiMoreVertical, FiTrash2
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';

const FILES_URL = import.meta.env.VITE_Files_URL || '';

const DATE_RANGES = [
    { label: 'الكل', value: 'all' },
    { label: 'اليوم', value: 'today' },
    { label: 'هذا الأسبوع', value: 'week' },
    { label: 'هذا الشهر', value: 'month' },
    { label: 'مخصص', value: 'custom' },
];

const PAYMENT_METHODS_FILTER = ['الكل', 'بنك فلسطين', 'Jawwal Pay', 'كاش', 'تحويل بنكي'];

const EXPENSE_CATEGORIES = ['مستلزمات طبية', 'إيجار', 'رواتب', 'مرافق', 'صيانة', 'تسويق', 'أخرى'];

const FinancialFiles = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('transactions');

    const [dateFilter, setDateFilter] = useState('all');
    const [customDateFrom, setCustomDateFrom] = useState('');
    const [customDateTo, setCustomDateTo] = useState('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('الكل');
    const [showFilters, setShowFilters] = useState(false);

    const [stats, setStats] = useState({
        totalBalance: 0,
        lastMonthEarnings: 0,
        pendingPayments: 0,
        pendingCount: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [invoiceModal, setInvoiceModal] = useState(null);
    const [expenseModal, setExpenseModal] = useState(false);
    const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '', date: '' });

    const invoiceRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, txRes, pmRes] = await Promise.all([
                    axiosInstance.get('/doctor/financial/stats'),
                    axiosInstance.get('/doctor/financial/transactions?page=1&pageSize=50'),
                    axiosInstance.get('/doctor/payment-methods'),
                ]);

                if (statsRes.data.succeeded && statsRes.data.data) {
                    setStats(statsRes.data.data);
                }

                if (txRes.data.succeeded && txRes.data.data?.items) {
                    setTransactions(txRes.data.data.items.map((tx, idx) => ({
                        id: idx,
                        patientName: tx.patientName,
                        patientImageUrl: tx.patientImageUrl,
                        initials: tx.patientName ? tx.patientName.split(' ').map(w => w[0]).join('').substring(0, 2) : '??',
                        date: tx.date,
                        method: tx.paymentMethod,
                        methodType: tx.paymentMethod?.includes('تحويل') ? 'bank' : 'wallet',
                        amount: tx.amount,
                        paidAmount: tx.paidAmount || tx.amount,
                        currency: 'ILS',
                        status: tx.status === 'Paid' ? 'مكتمل' : tx.status === 'Partial' ? 'مكتمل جزئياً' : tx.status === 'Pending' ? 'قيد المعالجة' : 'ملغى',
                        attachmentUrl: tx.attachmentUrl
                    })));
                }

                if (pmRes.data.succeeded && pmRes.data.data) {
                    setPaymentMethods(pmRes.data.data);
                }

                const savedExpenses = localStorage.getItem('doctor_expenses');
                if (savedExpenses) {
                    setExpenses(JSON.parse(savedExpenses));
                }
            } catch (err) {

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (searchQuery && !tx.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) && !tx.method?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (paymentMethodFilter !== 'الكل' && !tx.method?.includes(paymentMethodFilter)) {
                return false;
            }
            if (dateFilter !== 'all' && tx.date) {
                const txDate = new Date(tx.date);
                const now = new Date();
                if (dateFilter === 'today') {
                    if (txDate.toDateString() !== now.toDateString()) return false;
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (txDate < weekAgo) return false;
                } else if (dateFilter === 'month') {
                    if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
                } else if (dateFilter === 'custom') {
                    if (customDateFrom && new Date(tx.date) < new Date(customDateFrom)) return false;
                    if (customDateTo && new Date(tx.date) > new Date(customDateTo)) return false;
                }
            }
            return true;
        });
    }, [transactions, searchQuery, dateFilter, customDateFrom, customDateTo, paymentMethodFilter]);

    const displayedTransactions = useMemo(() => {
        if (showAll) return filteredTransactions;
        return filteredTransactions.slice(0, 5);
    }, [filteredTransactions, showAll]);

    const totalRevenue = useMemo(() => transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0), [transactions]);
    const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + (e.amount || 0), 0), [expenses]);
    const netProfit = totalRevenue - totalExpenses;
    const unpaidTotal = useMemo(() => transactions.filter(tx => tx.status === 'مكتمل جزئياً').reduce((sum, tx) => sum + ((tx.amount || 0) - (tx.paidAmount || 0)), 0), [transactions]);

    const handleAddExpense = () => {
        if (!newExpense.category || !newExpense.amount) return;
        const expense = {
            id: Date.now(),
            ...newExpense,
            amount: parseFloat(newExpense.amount),
            date: newExpense.date || new Date().toISOString().slice(0, 10)
        };
        const updated = [...expenses, expense];
        setExpenses(updated);
        localStorage.setItem('doctor_expenses', JSON.stringify(updated));
        setNewExpense({ category: '', amount: '', description: '', date: '' });
        setExpenseModal(false);
    };

    const handleDeleteExpense = (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        localStorage.setItem('doctor_expenses', JSON.stringify(updated));
    };

    const handlePrintInvoice = () => {
        const printContent = invoiceRef.current;
        if (!printContent) return;
        const win = window.open('', '_blank');
        win.document.write(`
            <html dir="rtl">
            <head>
                <title>فاتورة - طبيبي</title>
                <style>
                    body { font-family: 'Tajawal', Arial, sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; border-bottom: 2px solid #1b8b99; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { color: #1b8b99; margin: 0; font-size: 24px; }
                    .header p { color: #666; margin: 5px 0 0; font-size: 12px; }
                    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; }
                    .info-row .label { font-weight: bold; color: #1b8b99; }
                    .total { font-size: 20px; font-weight: bold; color: #1b8b99; text-align: center; margin-top: 20px; padding: 15px; border: 2px solid #1b8b99; border-radius: 10px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        win.document.close();
        win.print();
    };

    const handleExport = () => {
        const headers = ['المريض', 'التاريخ', 'طريقة الدفع', 'المبلغ', 'الحالة'];
        const rows = filteredTransactions.map(tx => [
            tx.patientName, tx.date, tx.method, tx.amount, tx.status
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial_report_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="w-full pr-4 font-['Tajawal'] bg-slate-50/30 flex items-center justify-center h-64" dir="rtl">
                <p className="text-gray-400 font-bold">جاري تحميل البيانات المالية...</p>
            </div>
        );
    }

    return (
      <div className="w-full pr-4 font-['Tajawal'] bg-slate-50/30 space-y-6" dir="rtl">
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b8b99]">السجلات المالية</h1>
            <p className="text-xs sm:text-sm text-gray-500">تتبع أرباحك وإدارة معاملاتك المالية بكل سهولة.</p>
          </div>

          {/* ===== كروت الإحصائيات ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36 text-right">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3 py-1 rounded-full">الإيرادات الإجمالية</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-[#1b8b99]"><FiDollarSign className="w-5 h-5" /></div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">{totalRevenue} <span className="text-lg font-bold text-gray-600">ILS</span></h2>
                <p className="text-[11px] text-green-600 flex items-center gap-1 font-medium"><FiTrendingUp className="w-3.5 h-3.5" /> إجمالي الكشفيات</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36 text-right">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3 py-1 rounded-full">المصروفات</span>
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500"><FiArrowDown className="w-5 h-5" /></div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">{totalExpenses} <span className="text-lg font-bold text-gray-600">ILS</span></h2>
                <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium"><FiArrowDown className="w-3.5 h-3.5" /> مصروفات تشغيلية</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36 text-right">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3 py-1 rounded-full">صافي الربح</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${netProfit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  <FiTrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h2 className={`text-2xl font-black ${netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>{netProfit} <span className="text-lg font-bold text-gray-600">ILS</span></h2>
                <p className="text-[11px] text-gray-400 flex items-center gap-1"><FiInfo className="w-3.5 h-3.5" /> إيرادات - مصروفات</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-36 text-right">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3 py-1 rounded-full">دفعات متبقية</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><FiAlertCircle className="w-5 h-5" /></div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-amber-600">{unpaidTotal} <span className="text-lg font-bold text-gray-600">ILS</span></h2>
                <p className="text-[11px] text-amber-600 flex items-center gap-1 font-medium"><FiClock className="w-3.5 h-3.5" /> مبالغ غير محصلة</p>
              </div>
            </div>
          </div>

          {/* ===== تبويبات ===== */}
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-5 py-3 text-sm font-bold transition-all cursor-pointer border-b-2 ${activeTab === 'transactions' ? 'text-[#1b8b99] border-[#1b8b99]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              جدول الإيرادات والدفعات
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-5 py-3 text-sm font-bold transition-all cursor-pointer border-b-2 ${activeTab === 'expenses' ? 'text-[#1b8b99] border-[#1b8b99]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
            >
              جدول المصاريف التشغيلية
            </button>
          </div>

          {/* ===== جدول المعاملات ===== */}
          {activeTab === 'transactions' && (
            <div className="bg-white border border-[#e9eff6] rounded-2xl shadow-xs overflow-hidden">
              {/* شريط الفلترة */}
              <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex items-center border border-slate-200 rounded-xl bg-slate-50 px-3 h-10 w-full sm:w-64 focus-within:border-[#1b8b99] focus-within:bg-white transition-all">
                      <FiSearch className="w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث بالاسم أو طريقة الدفع..." className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-gray-700 pr-2 h-full text-right" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`h-10 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${showFilters ? 'bg-[#1b8b99] text-white border-[#1b8b99]' : 'border-slate-200 text-gray-600 hover:bg-slate-50'}`}>
                      <FiFilter className="w-3.5 h-3.5" /> فلاتر
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-50 text-[#1b8b99] text-xs font-bold px-2.5 py-1 rounded-md">{filteredTransactions.length} معاملة</span>
                    <button onClick={handleExport} className="h-9 px-3 rounded-xl bg-[#1b8b99] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#15727e] transition-all cursor-pointer">
                      <FiDownload className="w-3.5 h-3.5" /> تصدير
                    </button>
                  </div>
                </div>

                {/* فلاتر إضافية */}
                {showFilters && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400">نطاق التاريخ</label>
                      <div className="flex gap-1">
                        {DATE_RANGES.map(d => (
                          <button key={d.value} onClick={() => setDateFilter(d.value)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${dateFilter === d.value ? 'bg-[#1b8b99] text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}>{d.label}</button>
                        ))}
                      </div>
                    </div>
                    {dateFilter === 'custom' && (
                      <div className="flex items-center gap-2">
                        <input type="date" value={customDateFrom} onChange={e => setCustomDateFrom(e.target.value)} className="h-8 px-2 border border-slate-200 rounded-lg text-xs" />
                        <span className="text-gray-400 text-xs">إلى</span>
                        <input type="date" value={customDateTo} onChange={e => setCustomDateTo(e.target.value)} className="h-8 px-2 border border-slate-200 rounded-lg text-xs" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400">طريقة الدفع</label>
                      <div className="flex gap-1 flex-wrap">
                        {PAYMENT_METHODS_FILTER.map(m => (
                          <button key={m} onClick={() => setPaymentMethodFilter(m)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${paymentMethodFilter === m ? 'bg-[#1b8b99] text-white' : 'bg-slate-100 text-gray-500 hover:bg-slate-200'}`}>{m}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* جول الديسكتوب */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold h-12">
                      <th className="px-6">المريض</th>
                      <th className="px-6">التاريخ والوقت</th>
                      <th className="px-6">طريقة الدفع</th>
                      <th className="px-6">المبلغ</th>
                      <th className="px-6">الحالة</th>
                      <th className="px-6">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors h-16 text-sm font-medium text-gray-700">
                        <td className="px-6">
                          <div className="flex items-center gap-3">
                            {tx.patientImageUrl ? (
                              <img loading="lazy" decoding="async" width="36" height="36" src={tx.patientImageUrl.startsWith('http') ? tx.patientImageUrl : `${FILES_URL}/${tx.patientImageUrl}`} alt={tx.patientName} className="w-9 h-9 rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                            ) : null}
                            <div className={`w-9 h-9 rounded-full bg-slate-100 text-gray-600 font-bold flex items-center justify-center text-xs ${tx.patientImageUrl ? 'hidden' : ''}`}>{tx.initials}</div>
                            <span className="font-bold text-gray-800">{tx.patientName}</span>
                          </div>
                        </td>
                        <td className="px-6"><span className="text-gray-800 text-xs font-semibold">{tx.date}</span></td>
                        <td className="px-6">
                          <div className="inline-flex items-center gap-1.5 border border-slate-100 rounded-lg px-3 py-1.5 bg-slate-50/50 text-xs font-bold text-gray-600">
                            {tx.methodType === "wallet" ? <FiSmartphone className="w-3.5 h-3.5 text-[#1b8b99]" /> : <FiCreditCard className="w-3.5 h-3.5 text-[#1b8b99]" />}
                            <span>{tx.method}</span>
                          </div>
                        </td>
                        <td className="px-6">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-gray-800">{tx.currency} {tx.amount?.toFixed(2)}</span>
                            {tx.status === 'مكتمل جزئياً' && <span className="text-[10px] text-amber-500 font-bold">مدفوع: {tx.paidAmount?.toFixed(2)} | متبقي: {(tx.amount - tx.paidAmount)?.toFixed(2)}</span>}
                          </div>
                        </td>
                        <td className="px-6">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${tx.status === "مكتمل" ? "bg-green-50 text-green-600" : tx.status === "مكتمل جزئياً" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-gray-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tx.status === "مكتمل" ? "bg-green-500" : tx.status === "مكتمل جزئياً" ? "bg-amber-500" : "bg-gray-400"}`}></span>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6">
                          <button onClick={() => setInvoiceModal(tx)} title="طباعة فاتورة" className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-50 text-[#1b8b99] hover:bg-cyan-100 transition-all cursor-pointer"><FiPrinter className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* جول الموبايل */}
              <div className="block md:hidden divide-y divide-slate-100">
                {displayedTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 space-y-3 hover:bg-slate-50/30 transition-all text-right">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {tx.patientImageUrl ? (
                            <img loading="lazy" decoding="async" width="32" height="32" src={tx.patientImageUrl.startsWith('http') ? tx.patientImageUrl : `${FILES_URL}/${tx.patientImageUrl}`} alt={tx.patientName} className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div className={`w-8 h-8 rounded-full bg-slate-100 text-gray-600 font-bold flex items-center justify-center text-xs ${tx.patientImageUrl ? 'hidden' : ''}`}>{tx.initials}</div>
                        <span className="font-bold text-gray-800 text-sm">{tx.patientName}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tx.status === "مكتمل" ? "bg-green-50 text-green-600" : tx.status === "مكتمل جزئياً" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-gray-500"}`}>{tx.status}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div><p className="text-[10px] text-gray-400">التاريخ والوقت</p><p className="font-semibold text-gray-700 mt-0.5">{tx.date}</p></div>
                      <div><p className="text-[10px] text-gray-400">طريقة الدفع</p><p className="font-semibold text-gray-700 mt-0.5">{tx.method}</p></div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl mt-2">
                      <span className="text-[11px] text-gray-500 font-medium">المبلغ الإجمالي:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-gray-800">{tx.currency} {tx.amount?.toFixed(2)}</span>
                        <button onClick={() => setInvoiceModal(tx)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-cyan-50 text-[#1b8b99]"><FiPrinter className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedTransactions.length === 0 && <div className="p-12 text-center text-gray-400 text-sm font-medium">لا توجد معاملات تطابق بحثك الحالي.</div>}

              {filteredTransactions.length > 5 && (
                <div className="border-t border-slate-100 p-4 text-center">
                  <button onClick={() => setShowAll(!showAll)} className="text-xs sm:text-sm font-bold text-[#1b8b99] hover:text-[#15727e] transition-colors cursor-pointer">
                    {showAll ? "عرض معاملات أقل" : "عرض جميع المعاملات"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== جدول المصاريف ===== */}
          {activeTab === 'expenses' && (
            <div className="bg-white border border-[#e9eff6] rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800">المصاريف التشغيلية</h3>
                <button onClick={() => setExpenseModal(true)} className="h-9 px-4 rounded-xl bg-[#1b8b99] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#15727e] transition-all cursor-pointer">
                  <FiPlus className="w-3.5 h-3.5" /> إضافة مصروف
                </button>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold h-12">
                      <th className="px-6">التصنيف</th>
                      <th className="px-6">التاريخ</th>
                      <th className="px-6">الوصف</th>
                      <th className="px-6">المبلغ</th>
                      <th className="px-6">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/40 transition-colors h-14 text-sm font-medium text-gray-700">
                        <td className="px-6"><span className="bg-red-50 text-red-600 text-[11px] font-bold px-3 py-1 rounded-full">{exp.category}</span></td>
                        <td className="px-6"><span className="text-xs font-semibold text-gray-600">{exp.date}</span></td>
                        <td className="px-6"><span className="text-gray-700 text-xs">{exp.description || '—'}</span></td>
                        <td className="px-6"><span className="font-mono font-bold text-red-600">ILS {exp.amount?.toFixed(2)}</span></td>
                        <td className="px-6">
                          <button onClick={() => handleDeleteExpense(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"><FiTrash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <div key={exp.id} className="p-4 text-right">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-red-50 text-red-600 text-[11px] font-bold px-3 py-1 rounded-full">{exp.category}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400"><FiTrash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-xs text-gray-500">{exp.date} {exp.description && `• ${exp.description}`}</p>
                    <p className="font-mono font-bold text-red-600 text-sm mt-1">ILS {exp.amount?.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {expenses.length === 0 && <div className="p-12 text-center text-gray-400 text-sm font-medium">لا توجد مصاريف مسجلة.</div>}
            </div>
          )}

          {/* ===== Modal إضافة مصروف ===== */}
          {expenseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800">إضافة مصروف جديد</h3>
                  <button onClick={() => setExpenseModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-gray-400 cursor-pointer"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">التصنيف *</label>
                    <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1b8b99]">
                      <option value="">اختر التصنيف</option>
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">المبلغ (ILS) *</label>
                    <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0.00" className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1b8b99]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">التاريخ</label>
                    <input type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1b8b99]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1.5">الوصف (اختياري)</label>
                    <textarea value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="تفاصيل المصروف..." rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#1b8b99] resize-none" />
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex gap-3">
                  <button onClick={handleAddExpense} disabled={!newExpense.category || !newExpense.amount} className="flex-1 h-11 bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">إضافة</button>
                  <button onClick={() => setExpenseModal(false)} className="flex-1 h-11 border border-slate-200 text-gray-500 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all cursor-pointer">إلغاء</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== Modal الفاتورة ===== */}
          {invoiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-800">معاينة الفاتورة</h3>
                  <button onClick={() => setInvoiceModal(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-gray-400 cursor-pointer"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="p-5">
                  <div ref={invoiceRef} className="border border-slate-200 rounded-xl p-5 text-right">
                    <div className="text-center border-b-2 border-[#1b8b99] pb-4 mb-4">
                      <h2 className="text-xl font-black text-[#1b8b99]">طبيبي</h2>
                      <p className="text-xs text-gray-500 mt-1">منصة إدارة العيادات الطبية</p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">المريض:</span><span className="font-bold text-gray-800">{invoiceModal.patientName}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">التاريخ:</span><span className="font-bold text-gray-800">{invoiceModal.date}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">طريقة الدفع:</span><span className="font-bold text-gray-800">{invoiceModal.method}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">الحالة:</span><span className="font-bold text-gray-800">{invoiceModal.status}</span></div>
                      {invoiceModal.status === 'مكتمل جزئياً' && (
                        <>
                          <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">المدفوع:</span><span className="font-bold text-green-600">{invoiceModal.paidAmount?.toFixed(2)} ILS</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500 font-bold">المتبقي:</span><span className="font-bold text-amber-600">{(invoiceModal.amount - invoiceModal.paidAmount)?.toFixed(2)} ILS</span></div>
                        </>
                      )}
                    </div>
                    <div className="text-center border-t-2 border-[#1b8b99] pt-3 mt-3">
                      <p className="text-xs text-gray-500">المبلغ الإجمالي</p>
                      <p className="text-2xl font-black text-[#1b8b99]">{invoiceModal.amount?.toFixed(2)} ILS</p>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-4">شكراً لثقتكم بمنصة طبيبي</p>
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex gap-3">
                  <button onClick={handlePrintInvoice} className="flex-1 h-11 bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <FiPrinter className="w-4 h-4" /> طباعة
                  </button>
                  <button onClick={() => setInvoiceModal(null)} className="flex-1 h-11 border border-slate-200 text-gray-500 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all cursor-pointer">إغلاق</button>
                </div>
              </div>
            </div>
          )}
      </div>
    );
};

export default FinancialFiles;
