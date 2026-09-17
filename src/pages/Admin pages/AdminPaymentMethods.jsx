import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Plus, Edit2, Trash2, CheckCircle, XCircle, Eye, X, Loader2, Building2, Wallet, ToggleLeft, ToggleRight, Clock, Users, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { formatDate } from '../../utils/dateFormatter';
import { useTranslation } from 'react-i18next';

const bankOptions = [
    'بنك فلسطين', 'البنك الأهلي الأردني', 'بنك القدس', 'البنك الوطني',
    'البنك الإسلامي الفلسطيني', 'البنك العربي الإسلامي', ' بنك الاسكان والتهيئة العقارية',
    'البنك التجاري الدولي', 'بنك مصر_intf', 'البنك العربي'
];
const walletOptions = ['جواال باي', 'بال باي'];

const BANK_IBAN_CODES = {
    'بنك فلسطين': 'PALS',
    'البنك الأهلي الأردني': 'JOAR',
    'بنك القدس': 'QUDS',
    'البنك الوطني': 'TNBK',
    'البنك الإسلامي الفلسطيني': 'PISB',
    'البنك العربي الإسلامي': 'AIBK',
};

const getBankPlaceholder = (bankName) => {
    const code = BANK_IBAN_CODES[bankName];
    if (!code) return 'PS00 0000 0000 0000 0000 0000 0000';
    return `PS00${code}00000000000000000000000`;
};

const formatIban = (value) => {
    return value.replace(/\s/g, '').toUpperCase();
};

const validateIban = (iban, bankName) => {
    const clean = formatIban(iban);
    if (clean.length !== 29) return t('adminPaymentMethods.ibanLengthError');
    if (!clean.startsWith('PS')) return t('adminPaymentMethods.ibanStartError');
    const expectedCode = BANK_IBAN_CODES[bankName];
    if (expectedCode && clean.substring(4, 8) !== expectedCode) {
        return `رمز البنك غير صحيح، يجب أن يكون ${expectedCode}`;
    }
    return null;
};

export default function AdminPaymentMethods() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('methods');
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [ibanError, setIbanError] = useState('');

    const [formData, setFormData] = useState({
        methodType: 'Bank',
        providerName: '',
        accountHolderName: '',
        phoneNumber: '',
        iban: '',
    });

    const [pendingPayments, setPendingPayments] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [stats, setStats] = useState({ totalActiveSubscriptions: 0, totalTrialSubscriptions: 0, totalExpiredSubscriptions: 0, pendingPayments: 0, totalRevenue: 0 });
    const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null, reason: '' });

    const fetchPaymentMethods = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/payment-methods');
            if (data.succeeded && data.data) setPaymentMethods(data.data);
        } catch (error) {
            toast.error('فشل في جلب طرق الدفع');
        } finally { setLoading(false); }
    }, []);

    const fetchPendingPayments = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/payments/pending');
            if (data.succeeded && data.data) setPendingPayments(data.data);
        } catch (error) {}
    }, []);

    const fetchAllPayments = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/payments/all');
            if (data.succeeded && data.data) setAllPayments(data.data);
        } catch (error) {}
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/admin/subscriptions/stats');
            if (data.succeeded && data.data) setStats(data.data);
        } catch (error) {}
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
        if (activeTab === 'payments') {
            fetchPendingPayments();
            fetchAllPayments();
            fetchStats();
        }
    }, [activeTab, fetchPaymentMethods, fetchPendingPayments, fetchAllPayments, fetchStats]);

    const resetForm = () => {
        setFormData({ methodType: 'Bank', providerName: '', accountHolderName: '', phoneNumber: '', iban: '' });
        setEditMode(false);
        setEditId(null);
        setIsModalOpen(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.providerName || !formData.accountHolderName || !formData.phoneNumber) {
            toast.error(t('adminPaymentMethods.fillRequiredFields'));
            return;
        }
        if (formData.phoneNumber.length !== 10) {
            toast.error(t('adminPaymentMethods.phoneLengthError'));
            return;
        }
        if (formData.methodType === 'Bank' && !formData.iban) {
            toast.error(t('adminPaymentMethods.enterIban'));
            return;
        }
        if (formData.methodType === 'Bank') {
            const err = validateIban(formData.iban, formData.providerName);
            if (err) { toast.error(err); return; }
        }
        setSubmitting(true);
        try {
            if (editMode) {
                const { data } = await axiosInstance.put('/admin/subscriptions/payment-methods', {
                    id: editId, ...formData
                });
                if (data.succeeded) { toast.success(t('adminPaymentMethods.editSuccess')); resetForm(); fetchPaymentMethods(); }
                else toast.error(data.errors?.[0]?.message || t('adminPaymentMethods.editFailed'));
            } else {
                const { data } = await axiosInstance.post('/admin/subscriptions/payment-methods', formData);
                if (data.succeeded) { toast.success(t('adminPaymentMethods.addSuccess')); resetForm(); fetchPaymentMethods(); }
                else toast.error(data.errors?.[0]?.message || t('adminPaymentMethods.addFailed'));
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('adminPaymentMethods.deleteConfirm'))) return;
        try {
            const { data } = await axiosInstance.delete(`/admin/subscriptions/payment-methods/${id}`);
            if (data.succeeded) { toast.success(t('adminPaymentMethods.deleteSuccess')); fetchPaymentMethods(); }
            else toast.error(data.errors?.[0]?.message || t('adminPaymentMethods.deleteFailed'));
        } catch (error) { toast.error(t('adminPaymentMethods.deleteError')); }
    };

    const handleApprove = async (paymentId) => {
        if (!window.confirm(t('adminPaymentMethods.approveConfirm'))) return;
        try {
            const { data } = await axiosInstance.post(`/admin/subscriptions/payments/${paymentId}/approve`);
            if (data.succeeded) { toast.success(t('adminPaymentMethods.approveSuccess')); fetchPendingPayments(); fetchAllPayments(); fetchStats(); }
            else toast.error(data.errors?.[0]?.message || t('adminPaymentMethods.approveFailed'));
        } catch (error) { toast.error('حدث خطأ'); }
    };

    const handleReject = async () => {
        if (!rejectModal.reason.trim()) { toast.error(t('adminPaymentMethods.enterRejectionReason')); return; }
        try {
            const { data } = await axiosInstance.post(`/admin/subscriptions/payments/${rejectModal.paymentId}/reject`, { reason: rejectModal.reason });
            if (data.succeeded) { toast.success(t('adminPaymentMethods.rejectSuccess')); setRejectModal({ open: false, paymentId: null, reason: '' }); fetchPendingPayments(); fetchAllPayments(); fetchStats(); }
            else toast.error(data.errors?.[0]?.message || t('adminPaymentMethods.rejectFailed'));
        } catch (error) { toast.error('حدث خطأ'); }
    };

    const openEdit = (method) => {
        setFormData({ methodType: method.methodType, providerName: method.providerName, accountHolderName: method.accountHolderName, phoneNumber: method.phoneNumber, iban: method.iban || '' });
        setEditMode(true);
        setEditId(method.id);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full bg-[#ecf8fa] dark:bg-gray-900 flex flex-col gap-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h2 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.64px] text-[#138C9F]">{t('adminPaymentMethods.title')}</h2>
            </div>

            <div className="flex gap-2 bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-1 w-fit">
                <button onClick={() => setActiveTab('methods')} className={`px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors cursor-pointer ${activeTab === 'methods' ? 'bg-[#138C9F] text-white' : 'text-[#526069] dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>{t('adminPaymentMethods.paymentMethods')}</button>
                <button onClick={() => setActiveTab('payments')} className={`px-6 py-2.5 rounded-lg text-[14px] font-bold transition-colors cursor-pointer ${activeTab === 'payments' ? 'bg-[#138C9F] text-white' : 'text-[#526069] dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-900'}`}>
                    مدفوعات الاشتراكات
                    {pendingPayments.length > 0 && (
                        <span className="mr-2 bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{pendingPayments.length}</span>
                    )}
                </button>
            </div>

            {activeTab === 'methods' ? (
                <>
                    <div className="flex justify-end">
                        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#138C9F] text-white rounded-xl font-bold text-[14px] hover:bg-[#0f7282] transition-colors cursor-pointer">
                            <Plus size={18} />{t('adminPaymentMethods.addPaymentMethod')}</button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#138C9F] animate-spin" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {method.methodType === 'Bank' ? <Building2 size={20} className="text-[#003D9B]" /> : <Wallet size={20} className="text-[#138C9F]" />}
                                            <span className="font-bold text-[15px] text-[#0B1C30] dark:text-gray-200">{method.providerName}</span>
                                        </div>
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${method.isActive ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                                            {method.isActive ? t('adminPaymentMethods.active') : t('adminPaymentMethods.inactive')}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-[13px]">
                                        <div className="flex justify-between"><span className="text-[#526069]">{t('adminPaymentMethods.accountHolder')}</span><span className="font-bold text-[#0B1C30] dark:text-gray-200">{method.accountHolderName}</span></div>
                                        <div className="flex justify-between"><span className="text-[#526069]">{t('adminPaymentMethods.phone')}</span><span className="font-bold text-[#0B1C30] dark:text-gray-200" dir="ltr">{method.phoneNumber}</span></div>
                                        {method.iban && <div className="flex justify-between"><span className="text-[#526069]">{t('adminPaymentMethods.iban')}</span><span className="font-bold text-[#0B1C30] dark:text-white text-[11px]" dir="ltr">{method.iban}</span></div>}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <button onClick={() => openEdit(method)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-bold text-[#003D9B] hover:bg-blue-50 transition-colors cursor-pointer">
                                            <Edit2 size={14} /> تعديل
                                        </button>
                                        <button onClick={() => handleDelete(method.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                                            <Trash2 size={14} /> حذف
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {paymentMethods.length === 0 && (
                                <div className="col-span-full text-center py-12 text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.noPaymentMethods')}</div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-4 h-[78px] flex items-center justify-between">
                            <div className="flex flex-col"><span className="font-semibold text-[12px] text-[#526069]">{t('adminPaymentMethods.activeSubscriptions')}</span><span className="font-semibold text-[20px] text-[#0B1C30] dark:text-gray-200">{stats.totalActiveSubscriptions}</span></div>
                            <div className="w-[30px] h-[30px] bg-[#DCFCE7] rounded-full flex items-center justify-center text-[#166534]"><CheckCircle size={16} /></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-4 h-[78px] flex items-center justify-between">
                            <div className="flex flex-col"><span className="font-semibold text-[12px] text-[#526069]">{t('adminPaymentMethods.trialPeriods')}</span><span className="font-semibold text-[20px] text-[#0B1C30] dark:text-gray-200">{stats.totalTrialSubscriptions}</span></div>
                            <div className="w-[30px] h-[30px] bg-[#FFF7E6] rounded-full flex items-center justify-center text-[#B45309]"><Clock size={16} /></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-4 h-[78px] flex items-center justify-between">
                            <div className="flex flex-col"><span className="font-semibold text-[12px] text-[#526069]">{t('adminPaymentMethods.pendingPayments')}</span><span className="font-semibold text-[20px] text-[#0B1C30] dark:text-gray-200">{stats.pendingPayments}</span></div>
                            <div className="w-[30px] h-[30px] bg-[#FFF7E6] rounded-full flex items-center justify-center text-[#B45309]"><AlertCircle size={16} /></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-4 h-[78px] flex items-center justify-between">
                            <div className="flex flex-col"><span className="font-semibold text-[12px] text-[#526069]">{t('adminPaymentMethods.totalRevenue')}</span><span className="font-semibold text-[20px] text-[#0B1C30] dark:text-gray-200">{stats.totalRevenue} ₪</span></div>
                            <div className="w-[30px] h-[30px] bg-[#E5EEFF] rounded-full flex items-center justify-center text-[#003D9B]"><DollarSign size={16} /></div>
                        </div>
                    </div>

                    {pendingPayments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#C3C6D6]"><h3 className="font-bold text-[16px] text-[#0B1C30] dark:text-gray-200">{t('adminPaymentMethods.pendingPaymentsReview')}</h3></div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-right">
                                    <thead><tr className="bg-[#e2f4f7] dark:bg-gray-800 h-[48px]">
                                        <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.doctor')}</th>
                                        <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.amount')}</th>
                                        <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400 hidden md:table-cell">{t('adminPaymentMethods.paymentMethod')}</th>
                                        <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400 hidden md:table-cell">{t('adminPaymentMethods.date')}</th>
                                        <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">الإجراءات</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-[#C3C6D6]">
                                        {pendingPayments.map((payment) => (
                                            <tr key={payment.id} className="h-[60px] hover:bg-slate-50">
                                                <td className="px-6 py-3 font-semibold text-[14px] text-[#0B1C30] dark:text-gray-200">{payment.doctorName}</td>
                                                <td className="px-6 py-3 font-bold text-[14px] text-[#138C9F]">{payment.amount} ₪</td>
                                                <td className="px-6 py-3 text-[13px] text-[#526069] dark:text-gray-400 hidden md:table-cell">{payment.adminPaymentMethodName || payment.adminPaymentMethodType}</td>
                                                <td className="px-6 py-3 text-[13px] text-[#526069] dark:text-gray-400 hidden md:table-cell">{formatDate(payment.createdAt)}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        {payment.receiptImageUrl && (
                                                            <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${payment.receiptImageUrl}`} target="_blank" rel="noreferrer" className="p-1.5 text-[#003D9B] hover:bg-blue-50 rounded cursor-pointer" title={t('adminPaymentMethods.viewReceipt')}>
                                                                <Eye size={18} />
                                                            </a>
                                                        )}
                                                        <button onClick={() => handleApprove(payment.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded cursor-pointer" title={t('adminPaymentMethods.approvePayment')}><CheckCircle size={18} /></button>
                                                        <button onClick={() => setRejectModal({ open: true, paymentId: payment.id, reason: '' })} className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer" title="رفض"><XCircle size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#C3C6D6]"><h3 className="font-bold text-[16px] text-[#0B1C30] dark:text-gray-200">{t('adminPaymentMethods.allPayments')}</h3></div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-right">
                                <thead><tr className="bg-[#e2f4f7] dark:bg-gray-800 h-[48px]">
                                    <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.doctor')}</th>
                                    <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.amount')}</th>
                                    <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">الحالة</th>
                                    <th className="px-6 py-3 font-bold text-[14px] text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.date')}</th>
                                </tr></thead>
                                <tbody className="divide-y divide-[#C3C6D6]">
                                    {allPayments.map((payment) => (
                                        <tr key={payment.id} className="h-[55px] hover:bg-slate-50">
                                            <td className="px-6 py-3 font-semibold text-[14px] text-[#0B1C30] dark:text-gray-200">{payment.doctorName}</td>
                                            <td className="px-6 py-3 font-bold text-[14px] text-[#138C9F]">{payment.amount} ₪</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${payment.status === 'Approved' ? 'bg-[#DCFCE7] text-[#166534]' : payment.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#FFF7E6] text-[#B45309]'}`}>
                                                    {payment.status === 'Approved' ? t('adminPaymentMethods.approved') : payment.status === 'Rejected' ? t('adminPaymentMethods.rejected') : t('adminPaymentMethods.pending')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-[13px] text-[#526069] dark:text-gray-400">{formatDate(payment.createdAt)}</td>
                                        </tr>
                                    ))}
                                    {allPayments.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-10 text-center text-[#526069] dark:text-gray-400">{t('adminPaymentMethods.noPayments')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 shadow-2xl rounded-2xl w-full max-w-lg p-8 relative">
                        <button onClick={resetForm} className="absolute top-4 left-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 rounded-full hover:bg-gray-100 dark:bg-gray-800 cursor-pointer"><X size={20} /></button>
                        <h3 className="font-extrabold text-[20px] text-[#0B1C30] dark:text-white mb-6">{editMode ? t('adminPaymentMethods.editPaymentMethod') : t('adminPaymentMethods.addNewPaymentMethod')}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setFormData(p => ({ ...p, methodType: 'Bank', providerName: '', iban: '' }))} className={`flex-1 py-3 rounded-xl font-bold text-[14px] border-2 transition-colors cursor-pointer ${formData.methodType === 'Bank' ? 'border-[#003D9B] bg-[#003D9B]/5 text-[#003D9B]' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                    <Building2 size={16} className="inline ml-2" />{t('adminPaymentMethods.bankAccount')}</button>
                                <button type="button" onClick={() => setFormData(p => ({ ...p, methodType: 'Wallet', providerName: '', iban: '' }))} className={`flex-1 py-3 rounded-xl font-bold text-[14px] border-2 transition-colors cursor-pointer ${formData.methodType === 'Wallet' ? 'border-[#138C9F] bg-[#138C9F]/5 text-[#138C9F]' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                    <Wallet size={16} className="inline ml-2" />{t('adminPaymentMethods.electronicWallet')}</button>
                            </div>

                            <div>
                                <label className="block font-bold text-[13px] text-[#526069] dark:text-gray-400 mb-1.5">{formData.methodType === 'Bank' ? t('adminPaymentMethods.bank') : t('adminPaymentMethods.serviceProvider')}</label>
                                <select value={formData.providerName} onChange={e => setFormData(p => ({ ...p, providerName: e.target.value }))} className="w-full h-[44px] px-4 border border-[#C3C6D6] dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30] dark:text-gray-200" required>
                                    <option value="">{t('adminPaymentMethods.select')}</option>
                                    {(formData.methodType === 'Bank' ? bankOptions : walletOptions).map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-[13px] text-[#526069] dark:text-gray-400 mb-1.5">{t('adminPaymentMethods.accountHolderName')}</label>
                                <input type="text" value={formData.accountHolderName} onChange={e => setFormData(p => ({ ...p, accountHolderName: e.target.value }))} className="w-full h-[44px] px-4 border border-[#C3C6D6] dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30] dark:text-gray-200" placeholder={t('adminPaymentMethods.fullName')} required />
                            </div>

                            <div>
                                <label className="block font-bold text-[13px] text-[#526069] dark:text-gray-400 mb-1.5">{t('adminPaymentMethods.phoneNumber')}</label>
                                <input type="text" value={formData.phoneNumber} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData(p => ({ ...p, phoneNumber: val })); }} className="w-full h-[44px] px-4 border border-[#C3C6D6] dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30] dark:text-gray-200" dir="ltr" placeholder="059XXXXXXXX" maxLength={10} required />
                            </div>

                            {formData.methodType === 'Bank' && (
                                <div>
                                    <label className="block font-bold text-[13px] text-[#526069] dark:text-gray-400 mb-1.5">{t('adminPaymentMethods.ibanNumber')}</label>
                                    <input type="text" value={formData.iban} onChange={e => { const cleaned = formatIban(e.target.value); setFormData(p => ({ ...p, iban: cleaned })); const err = validateIban(cleaned, formData.providerName); setIbanError(err); }} onBlur={() => { const err = validateIban(formData.iban, formData.providerName); setIbanError(err); }} placeholder={getBankPlaceholder(formData.providerName)} maxLength={29} className={`w-full h-[44px] px-4 border rounded-xl text-[14px] focus:outline-none text-[#0B1C30] dark:text-white ${ibanError ? 'border-red-300 focus:border-red-400' : 'border-[#C3C6D6] dark:border-gray-700 focus:border-[#138C9F]'}`} dir="ltr" required />
                                    {ibanError && <p className="text-[11px] text-red-500 mt-1">{ibanError}</p>}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 h-[46px] border border-[#138C9F] text-[#138C9F] rounded-xl font-bold hover:bg-gray-50 dark:bg-gray-900 transition-colors cursor-pointer">إلغاء</button>
                                <button type="submit" disabled={submitting} className="flex-1 h-[46px] bg-[#138C9F] text-white rounded-xl font-bold hover:bg-[#0f7282] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    {editMode ? 'حفظ التعديلات' : t('adminPaymentMethods.add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {rejectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 shadow-2xl rounded-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setRejectModal({ open: false, paymentId: null, reason: '' })} className="absolute top-4 left-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 rounded-full hover:bg-gray-100 dark:bg-gray-800 cursor-pointer"><X size={20} /></button>
                        <h3 className="font-extrabold text-[20px] text-[#0B1C30] dark:text-white mb-4">{t('adminPaymentMethods.rejectPayment')}</h3>
                        <textarea value={rejectModal.reason} onChange={e => setRejectModal(p => ({ ...p, reason: e.target.value }))} className="w-full h-24 px-4 py-3 border border-[#C3C6D6] dark:border-gray-700 rounded-xl text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30] dark:text-white resize-none" placeholder={t('adminPaymentMethods.rejectionReason')} required />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setRejectModal({ open: false, paymentId: null, reason: '' })} className="flex-1 h-[42px] border border-gray-300 text-gray-600 dark:text-gray-400 dark:text-gray-500 rounded-xl font-bold hover:bg-gray-50 dark:bg-gray-900 cursor-pointer">إلغاء</button>
                            <button onClick={handleReject} className="flex-1 h-[42px] bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 cursor-pointer">{t('adminPaymentMethods.rejectPayment')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
