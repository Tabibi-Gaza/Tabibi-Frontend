import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Clock, CheckCircle, AlertCircle, CreditCard, Upload, Building2, Wallet, Loader2, X, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AppContext } from '../../context/AppContext';

export default function DoctorSubscription() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [subscription, setSubscription] = useState(null);
    const [adminMethods, setAdminMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [senderName, setSenderName] = useState('');
    const [senderPhone, setSenderPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const fetchSubscription = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/subscriptions/my-subscription');
            if (data.succeeded && data.data) setSubscription(data.data);
        } catch (error) { console.error(error); }
    }, []);

    const fetchAdminMethods = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/doctor/subscriptions/admin-payment-methods');
            if (data.succeeded && data.data) setAdminMethods(data.data.filter(m => m.isActive));
        } catch (error) { console.error(error); }
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchSubscription(), fetchAdminMethods()]);
            setLoading(false);
        };
        load();
    }, [fetchSubscription, fetchAdminMethods]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { toast.error('حجم الملف يتجاوز 5 ميغابايت'); return; }
            setReceiptFile(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitPayment = async () => {
        if (!selectedMethod) { toast.error('يرجى اختيار طريقة الدفع'); return; }
        if (!senderName.trim()) { toast.error('يرجى إدخال اسم صاحب الحساب'); return; }
        if (!senderPhone.trim()) { toast.error('يرجى إدخال رقم الهاتف'); return; }
        if (!receiptFile) { toast.error('يرجى رفع صورة الإيصال'); return; }

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('Amount', subscription?.isTrial ? 50 : (subscription?.amount || 50));
            fd.append('SenderAccountHolderName', senderName);
            fd.append('SenderPhoneNumber', senderPhone);
            fd.append('AdminPaymentMethodType', selectedMethod.methodType);
            fd.append('AdminPaymentMethodId', selectedMethod.id);
            fd.append('ReceiptFile', receiptFile);

            const { data } = await axiosInstance.post('/doctor/subscriptions/submit-payment', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.succeeded) {
                toast.success('تم إرسال طلب الدفع بنجاح! سيتم مراجعته من قبل الإدارة');
                setShowPaymentForm(false);
                setSelectedMethod(null);
                setReceiptFile(null);
                setReceiptPreview(null);
                setSenderName('');
                setSenderPhone('');
                fetchSubscription();
            } else {
                toast.error(data.errors?.[0]?.message || 'فشل إرسال الطلب');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب');
        } finally { setSubmitting(false); }
    };

    const getRemainingDays = () => {
        if (!subscription?.endDate) return 0;
        const end = new Date(subscription.endDate);
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#138C9F] animate-spin" />
            </div>
        );
    }

    const remainingDays = getRemainingDays();
    const isExpired = subscription && remainingDays === 0 && subscription.status !== 'Trial';
    const isTrial = subscription?.isTrial;
    const isActive = subscription?.status === 'Active' && remainingDays > 0;

    const banks = adminMethods.filter(m => m.methodType === 'Bank');
    const wallets = adminMethods.filter(m => m.methodType === 'Wallet');

    return (
        <div className="w-full bg-[#ecf8fa] flex flex-col gap-6" dir="rtl">
            <h2 className="font-['Cairo'] font-extrabold text-[32px] leading-[40px] tracking-[-0.64px] text-[#138C9F]">
                اشتراكي
            </h2>

            <div className={`bg-white border rounded-2xl p-6 shadow-sm ${isTrial ? 'border-yellow-300' : isActive ? 'border-green-300' : 'border-red-200'}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isTrial ? 'bg-yellow-50' : isActive ? 'bg-green-50' : 'bg-red-50'}`}>
                            {isTrial ? <Clock size={28} className="text-yellow-600" /> : isActive ? <CheckCircle size={28} className="text-green-600" /> : <AlertCircle size={28} className="text-red-500" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`font-['Cairo'] font-bold text-[13px] px-3 py-1 rounded-md text-white ${isTrial ? 'bg-yellow-500' : isActive ? 'bg-green-600' : 'bg-red-500'}`}>
                                    {isTrial ? 'فترة تجريبية' : isActive ? 'اشتراك نشط' : 'اشتراك منتهي'}
                                </span>
                            </div>
                            <h3 className="font-['Cairo'] font-extrabold text-[22px] text-[#0B1C30]">
                                {isTrial ? 'فترة تجريبية مجانية' : isActive ? 'الاشتراك الشهري' : 'الاشتراك منتهي الصلاحية'}
                            </h3>
                            <p className="font-['Cairo'] text-[14px] text-[#526069] mt-0.5">
                                {isTrial ? 'استمتع بالمنصة لمدة 7 أيام مجاناً' : isActive ? `ينتهي في ${formatDate(subscription?.endDate)}` : 'يجب تجديد الاشتراك للاستمرار في استخدام المنصة'}
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className={`font-['Cairo'] font-extrabold text-[42px] leading-none ${remainingDays <= 2 && !isTrial ? 'text-red-500' : 'text-[#138C9F]'}`}>
                            {remainingDays}
                        </div>
                        <span className="font-['Cairo'] text-[13px] text-[#526069] font-semibold">يوم متبقي</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
                    <div className="text-center">
                        <span className="font-['Cairo'] text-[12px] text-[#526069] block mb-1">تاريخ البدء</span>
                        <span className="font-['Cairo'] font-bold text-[14px] text-[#0B1C30]">{formatDate(subscription?.startDate)}</span>
                    </div>
                    <div className="text-center">
                        <span className="font-['Cairo'] text-[12px] text-[#526069] block mb-1">تاريخ الانتهاء</span>
                        <span className="font-['Cairo'] font-bold text-[14px] text-[#0B1C30]">{formatDate(subscription?.endDate)}</span>
                    </div>
                    <div className="text-center">
                        <span className="font-['Cairo'] text-[12px] text-[#526069] block mb-1">المبلغ</span>
                        <span className="font-['Cairo'] font-bold text-[14px] text-[#138C9F]">{subscription?.isTrial ? 'مجاني' : `${subscription?.amount || 0} ₪`}</span>
                    </div>
                </div>
            </div>

            {(isExpired || isTrial || !subscription) && (
                <button onClick={() => { setShowPaymentForm(true); fetchAdminMethods(); }} className="flex items-center justify-center gap-2 w-full py-4 bg-[#138C9F] text-white rounded-xl font-['Cairo'] font-bold text-[16px] hover:bg-[#0f7282] transition-colors cursor-pointer shadow-sm">
                    <CreditCard size={20} />
                    {isTrial ? 'اشترك الآن بعد انتهاء الفترة التجريبية' : 'تجديد الاشتراك'}
                </button>
            )}

            {showPaymentForm && (
                <div className="bg-white border border-[#C3C6D6] rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-['Cairo'] font-bold text-[20px] text-[#0B1C30]">تأكيد ودفع الاشتراك</h3>
                        <button onClick={() => setShowPaymentForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
                    </div>

                    <div className="bg-[#ecf8fa] rounded-xl p-4 mb-6 border border-[#C3C6D6]">
                        <div className="flex justify-between items-center">
                            <span className="font-['Cairo'] font-bold text-[15px] text-[#0B1C30]">المبلغ المطلوب:</span>
                            <span className="font-['Cairo'] font-extrabold text-[24px] text-[#138C9F]">50 ₪</span>
                        </div>
                        <span className="font-['Cairo'] text-[12px] text-[#526069]">اشتراك شهري - 30 يوم</span>
                    </div>

                    {banks.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-['Cairo'] font-bold text-[15px] text-[#0B1C30] mb-3 flex items-center gap-2"><Building2 size={18} className="text-[#003D9B]" /> تحويل بنكي</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {banks.map(method => (
                                    <button key={method.id} onClick={() => setSelectedMethod(method)} className={`text-right p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod?.id === method.id ? 'border-[#138C9F] bg-[#138C9F]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="font-['Cairo'] font-bold text-[14px] text-[#0B1C30]">{method.providerName}</div>
                                        <div className="font-['Cairo'] text-[12px] text-[#526069] mt-1">{method.accountHolderName}</div>
                                        {method.iban && <div className="font-['Cairo'] text-[11px] text-[#526069] mt-0.5" dir="ltr">{method.iban}</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {wallets.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-['Cairo'] font-bold text-[15px] text-[#0B1C30] mb-3 flex items-center gap-2"><Wallet size={18} className="text-[#138C9F]" /> محفظة إلكترونية</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {wallets.map(method => (
                                    <button key={method.id} onClick={() => setSelectedMethod(method)} className={`text-right p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod?.id === method.id ? 'border-[#138C9F] bg-[#138C9F]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <div className="font-['Cairo'] font-bold text-[14px] text-[#0B1C30]">{method.providerName}</div>
                                        <div className="font-['Cairo'] text-[12px] text-[#526069] mt-1">{method.accountHolderName}</div>
                                        <div className="font-['Cairo'] text-[11px] text-[#526069] mt-0.5" dir="ltr">{method.phoneNumber}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {adminMethods.length === 0 && (
                        <div className="text-center py-8 text-[#526069] font-['Cairo']">
                            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                            لا توجد طرق دفع متاحة حالياً. يرجى المحاولة لاحقاً.
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block font-['Cairo'] font-bold text-[13px] text-[#526069] mb-1.5">صورة الإيصال / التحويل</label>
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#C3C6D6] rounded-xl cursor-pointer hover:border-[#138C9F] transition-colors">
                                {receiptPreview ? (
                                    <img src={receiptPreview} alt="receipt" className="w-full h-full object-contain rounded-xl p-2" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-[#526069]">
                                        <Upload size={28} />
                                        <span className="font-['Cairo'] font-bold text-[13px]">اضغط لرفع صورة الإيصال</span>
                                        <span className="font-['Cairo'] text-[11px]">PNG, JPG (حد أقصى 5MB)</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-['Cairo'] font-bold text-[13px] text-[#526069] mb-1.5">اسم صاحب الحساب</label>
                                <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full h-[44px] px-4 border border-[#C3C6D6] rounded-xl font-['Cairo'] text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30]" placeholder="الاسم كما في الحساب" required />
                            </div>
                            <div>
                                <label className="block font-['Cairo'] font-bold text-[13px] text-[#526069] mb-1.5">رقم الهاتف</label>
                                <input type="text" value={senderPhone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setSenderPhone(val); }} className="w-full h-[44px] px-4 border border-[#C3C6D6] rounded-xl font-['Cairo'] text-[14px] focus:outline-none focus:border-[#138C9F] text-[#0B1C30]" dir="ltr" placeholder="059XXXXXXXX" maxLength={10} required />
                            </div>
                        </div>

                        <button onClick={handleSubmitPayment} disabled={submitting || !selectedMethod || !receiptFile} className="w-full py-4 bg-[#138C9F] text-white rounded-xl font-['Cairo'] font-bold text-[16px] hover:bg-[#0f7282] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? <><Loader2 size={18} className="animate-spin" /> جاري الإرسال...</> : <><FileText size={18} /> إرسال طلب الدفع</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
