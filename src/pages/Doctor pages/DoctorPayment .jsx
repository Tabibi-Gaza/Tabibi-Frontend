import React, { useState, useEffect } from 'react';
import {
    FiPlus, FiInfo, FiCreditCard, FiSmartphone,
    FiEdit3, FiClock, FiCheck, FiX, FiCopy, FiChevronDown, FiAlertCircle,
    FiTrash2, FiLoader
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import { useTranslation } from 'react-i18next';

const BANKS = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'بنك فلسطين', logo: '/images/payment/bank-of-palestine.webp' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'بنك الأردن', logo: '/images/payment/bank-of-jordan.svg' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'بنك القدس', logo: '/images/payment/quds-bank.jpg' },
    { id: '66666666-6666-6666-6666-666666666666', name: 'البنك الوطني', logo: '/images/payment/national-bank.webp' },
    { id: '77777777-7777-7777-7777-777777777777', name: 'البنك الإسلامي الفلسطيني', logo: '/images/payment/islamic-bank-palestine.png' },
    { id: '88888888-8888-8888-8888-888888888888', name: 'البنك الإسلامي العربي', logo: '/images/payment/arab-islamic-bank.webp' },
    { id: '99999999-9999-9999-9999-999999999999', name: 'البنك الأهلي الفلسطيني', logo: '/images/payment/national-bank.webp' },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'البنك التجاري الفلسطيني', logo: '/images/payment/bank-of-palestine.webp' },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'بنك الاستثمار الفلسطيني', logo: '/images/payment/quds-bank.jpg' },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', name: 'البنك الإسلامي العربي - فرع رام الله', logo: '/images/payment/arab-islamic-bank.webp' },
];

const WALLET_PROVIDERS = [
    { id: '44444444-4444-4444-4444-444444444444', name: 'Jawwal Pay', logo: '/images/payment/jawwal-pay.png' },
    { id: '55555555-5555-5555-5555-555555555555', name: 'PalPay', logo: '/images/payment/palpay.webp' },
];

const BANK_IBAN_CODES = {
    '11111111-1111-1111-1111-111111111111': 'PALS',
    '22222222-2222-2222-2222-222222222222': 'JOAR',
    '33333333-3333-3333-3333-333333333333': 'QUDS',
    '66666666-6666-6666-6666-666666666666': 'TNBK',
    '77777777-7777-7777-7777-777777777777': 'PISB',
    '88888888-8888-8888-8888-888888888888': 'AIBK',
};

const getBankPlaceholder = (bankId) => {
    const code = BANK_IBAN_CODES[bankId];
    if (!code) return 'PS00 0000 0000 0000 0000 0000 0000';
    return `PS00${code}00000000000000000000000`;
};

const formatIban = (value) => {
    return value.replace(/\s/g, '').toUpperCase();
};

const validateIban = (iban, bankId) => {
    const clean = formatIban(iban);
    if (clean.length !== 29) return 'الآيبان يجب أن يكون 29 خانة بالضبط';
    if (!clean.startsWith('PS')) return 'الآيبان يجب أن يبدأ بـ PS';
    const expectedCode = BANK_IBAN_CODES[bankId];
    if (expectedCode && clean.substring(4, 8) !== expectedCode) {
        return `رمز البنك غير صحيح، يجب أن يكون ${expectedCode}`;
    }
    return null;
};

const getBankLogo = (bankName) => {
    const bank = BANKS.find(b => b.name === bankName);
    return bank?.logo || '/images/payment/bank-of-palestine.svg';
};

const getWalletLogo = (providerName) => {
    const provider = WALLET_PROVIDERS.find(p => p.name === providerName);
    return provider?.logo || '/images/payment/jawwal-pay.svg';
};

const DoctorPayment = () => {
    const [viewMode, setViewMode] = useState('list');
    const [addType, setAddType] = useState('bank');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [ibanError, setIbanError] = useState('');

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [wallets, setWallets] = useState([]);

    const [editData, setEditData] = useState(null);

    const [bankForm, setBankForm] = useState({
        bankId: BANKS[0].id,
        accountHolderName: '',
        phoneNumber: '',
        accountNumber: '',
        iban: '',
    });

    const [walletForm, setWalletForm] = useState({
        walletProviderId: WALLET_PROVIDERS[0].id,
        accountHolderName: '',
        phoneNumber: '',
    });

    const [copied, setCopied] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get('/doctor/payment-methods');
            const methods = res.data.data || [];
            setPaymentMethods(methods);

            const banks = methods.filter(m => m.type === t('doctorPayment.bankTransfer'));
            const allBanks = [];
            for (const b of banks) {
                try {
                    const bankRes = await axiosInstance.get(`/doctor/payment-methods/bank/${b.id}`);
                    allBanks.push({ ...bankRes.data.data, id: b.id });
                } catch {
                    allBanks.push({ id: b.id, bankName: b.name, accountHolderName: b.accountHolderName, phoneNumber: b.phoneNumber, iban: '' });
                }
            }
            setBankList(allBanks);

            const walletMethods = methods.filter(m => m.type === t('doctorPayment.electronicWallet'));
            const walletDetails = [];
            for (const w of walletMethods) {
                try {
                    const wRes = await axiosInstance.get(`/doctor/payment-methods/wallet/${w.id}`);
                    walletDetails.push({ ...wRes.data.data, id: w.id });
                } catch {
                    walletDetails.push({ id: w.id, providerName: w.name, accountHolderName: w.accountHolderName, phoneNumber: w.phoneNumber });
                }
            }
            setWallets(walletDetails);
        } catch (err) {
            setError(t('doctorPayment.errorLoadingPaymentMethods'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCopyIban = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddBank = async () => {
        if (!bankForm.accountHolderName || !bankForm.phoneNumber || !bankForm.iban) {
            setError(t('doctorPayment.fillRequiredFields'));
            return;
        }
        const ibanErr = validateIban(bankForm.iban, bankForm.bankId);
        if (ibanErr) {
            setIbanError(ibanErr);
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = {
                type: 'Bank',
                accountHolderName: bankForm.accountHolderName,
                phoneNumber: bankForm.phoneNumber,
                bankId: bankForm.bankId,
                iban: formatIban(bankForm.iban),
            };
            const res = await axiosInstance.post('/doctor/payment-methods', payload);
            setViewMode('list');
            setBankForm({ bankId: BANKS[0].id, accountHolderName: '', phoneNumber: '', accountNumber: '', iban: '' });
            setIbanError('');
            await fetchData();
        } catch (err) {

            setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || t('doctorPayment.addBankFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleAddWallet = async () => {
        if (!walletForm.accountHolderName || !walletForm.phoneNumber) {
            setError(t('doctorPayment.fillRequiredFields'));
            return;
        }
        setSaving(true);
        setError('');
        try {
            await axiosInstance.post('/doctor/payment-methods', {
                type: 'Wallet',
                accountHolderName: walletForm.accountHolderName,
                phoneNumber: walletForm.phoneNumber,
                walletProviderId: walletForm.walletProviderId,
            });
            setViewMode('list');
            setWalletForm({ walletProviderId: WALLET_PROVIDERS[0].id, accountHolderName: '', phoneNumber: '' });
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || t('doctorPayment.addWalletFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateBank = async () => {
        if (!editData) return;
        setSaving(true);
        setError('');
        try {
            await axiosInstance.put('/doctor/payment-methods', {
                id: editData.id,
                type: 'Bank',
                accountHolderName: bankForm.accountHolderName,
                phoneNumber: bankForm.phoneNumber,
                bankId: bankForm.bankId,
                iban: bankForm.iban,
            });
            setViewMode('list');
            setEditData(null);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || t('doctorPayment.updateBankFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateWallet = async () => {
        if (!editData) return;
        setSaving(true);
        setError('');
        try {
            await axiosInstance.put('/doctor/payment-methods', {
                id: editData.id,
                type: 'Wallet',
                accountHolderName: walletForm.accountHolderName,
                phoneNumber: walletForm.phoneNumber,
                walletProviderId: walletForm.walletProviderId,
            });
            setViewMode('list');
            setEditData(null);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || t('doctorPayment.updateWalletFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, type) => {
        setSaving(true);
        setError('');
        try {
            const apiType = type === t('doctorPayment.bankTransfer') ? 'Bank' : 'Wallet';
            await axiosInstance.delete(`/doctor/payment-methods/${id}?type=${apiType}`);
            setDeleteConfirm(null);
            await fetchData();
        } catch (err) {
            setError(t('doctorPayment.deletePaymentFailed'));
        } finally {
            setSaving(false);
        }
    };

    const openEditBank = (bankDetail) => {
        if (!bankDetail) return;
        const bankId = BANKS.find(b => b.name === bankDetail.bankName)?.id || BANKS[0].id;
        setEditData({ id: bankDetail.id, type: 'bank' });
        setBankForm({
            bankId,
            accountHolderName: bankDetail.accountHolderName || '',
            phoneNumber: bankDetail.phoneNumber || '',
            accountNumber: '',
            iban: bankDetail.iban || '',
        });
        setViewMode('edit_bank');
    };

    const openEditWallet = (wallet) => {
        const providerId = WALLET_PROVIDERS.find(p => p.name === wallet.providerName)?.id || WALLET_PROVIDERS[0].id;
        setEditData({ id: wallet.id, type: 'wallet' });
        setWalletForm({
            walletProviderId: providerId,
            accountHolderName: wallet.accountHolderName || '',
            phoneNumber: wallet.phoneNumber || '',
        });
        setViewMode('edit_wallet');
    };

    if (loading) {
        return (
            <div className="w-full bg-slate-50 dark:bg-gray-900/50" dir="rtl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs p-8">
                    <div className="flex items-center justify-center gap-3 text-[#1b8b99]">
                        <FiLoader className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-bold">{t('doctorPayment.loadingPaymentMethods')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-gray-900/50 space-y-6 md:space-y-8 pb-8 pr-4" dir="rtl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs overflow-hidden">

                {error && (
                    <div className="bg-red-50 border-r-4 border-red-400 p-4 mx-4 mt-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-gray-700 pb-6">
                            <div className="space-y-1 text-right">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#1b8b99]">{t('doctorPayment.pageTitle')}</h1>
                                <p className="text-xs sm:text-sm text-gray-500">{t('doctorPayment.pageDescription')}</p>
                            </div>
                            <button
                                onClick={() => { setViewMode("add"); setAddType("bank"); setError(''); }}
                                className="flex items-center justify-center gap-2 bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold py-3 px-5 rounded-xl transition-all shadow-xs cursor-pointer text-sm self-start sm:self-auto"
                            >
                                <FiPlus className="w-5 h-5" />{t('doctorPayment.addNewMethod')}</button>
                        </div>

                        <div className="bg-cyan-50/40 border-r-4 border-[#1b8b99] p-4 rounded-xl flex items-start gap-3">
                            <FiInfo className="w-5 h-5 text-[#1b8b99] shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 leading-relaxed text-right">
                                <strong className="text-[#1b8b99]">{t('doctorPayment.noteLabel')}</strong>{t('doctorPayment.noteDescription')}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                            {/* قسم الحسابات البنكية */}
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-right">
                                    <FiCreditCard className="text-[#1b8b99] w-5 h-5" />{t('doctorPayment.bankAccountsTitle')}</h2>

                                {bankList.length > 0 ? bankList.map((bankDetail) => (
                                    <div key={bankDetail.id} className="text-white p-4 rounded-2xl relative overflow-hidden shadow-md space-y-3 text-right" style={{
                                        backgroundImage: `url(${getBankLogo(bankDetail.bankName)})`,
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'top right',
                                        backgroundColor: '#1b8b99'
                                    }}>
                                        <div className="absolute inset-0 bg-black/50 rounded-2xl" />
                                        <div className="relative z-10">
                                        <div className="flex justify-between items-start">
                                            <span className="bg-white dark:bg-gray-800/20 text-white text-[11px] font-bold px-3 py-1 rounded-full">{t('doctorPayment.activeStatus')}</span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 pt-2">
                                            <div>
                                                <p className="text-sm text-white/70 font-bold">{t('doctorPayment.accountName')}</p>
                                                <p className="text-lg font-bold truncate">{bankDetail.accountHolderName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/70 font-bold">{t('doctorPayment.bankName')}</p>
                                                <p className="text-lg font-bold truncate">{bankDetail.bankName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/70 font-bold">{t('doctorPayment.accountPhoneNumber')}</p>
                                                <p className="text-lg font-mono font-bold truncate" dir="ltr">{bankDetail.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-white/20">
                                            <p className="text-sm text-white/70 font-bold mb-0.5">{t('doctorPayment.ibanLabel')}</p>
                                            <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg font-mono text-base">
                                                <span className="truncate">{bankDetail.iban}</span>
                                                <button
                                                    onClick={() => handleCopyIban(bankDetail.iban)}
                                                    className="text-white/80 hover:text-white transition-colors p-1"
                                                >
                                                    {copied ? <FiCheck className="w-4 h-4 text-green-300" /> : <FiCopy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 -mx-4 -mb-4 mt-2 bg-black/10 px-4 py-2 rounded-b-2xl">
                                            <button
                                                onClick={() => {
                                                    setDeleteConfirm({ id: bankDetail.id, type: t('doctorPayment.bankTransfer'), name: bankDetail.bankName });
                                                }}
                                                className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-gray-800/20 hover:bg-white dark:bg-gray-800/30 px-3 py-1 rounded-lg transition-all"
                                            >
                                                <FiTrash2 className="w-3 h-3" />{t('doctorPayment.delete')}</button>
                                            <button
                                                onClick={() => openEditBank(bankDetail)}
                                                className="flex items-center gap-1.5 text-xs font-bold bg-white dark:bg-gray-800/20 hover:bg-white dark:bg-gray-800/30 px-3 py-1 rounded-lg transition-all"
                                            >
                                                <FiEdit3 className="w-3 h-3" />{t('doctorPayment.editData')}</button>
                                        </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-2xl p-8 text-center text-gray-400">
                                        <FiCreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">{t('doctorPayment.noBankAccountYet')}</p>
                                        <button
                                            onClick={() => { setViewMode("add"); setAddType("bank"); }}
                                            className="mt-3 text-sm text-[#1b8b99] font-bold hover:underline"
                                        >{t('doctorPayment.addBankAccount')}</button>
                                    </div>
                                )}
                            </div>

                            {/* قسم المحافظ الرقمية */}
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-right">
                                    <FiSmartphone className="text-[#1b8b99] w-5 h-5" />{t('doctorPayment.digitalWalletsTitle')}</h2>

                                <div className="space-y-4">
                                    {wallets.length > 0 ? wallets.map((wallet) => (
                                        <div
                                            key={wallet.id}
                                            className="rounded-xl p-3 flex items-center justify-between shadow-md relative overflow-hidden text-white transition-hover min-h-[80px]"
                                            style={{
                                                backgroundImage: `url(${getWalletLogo(wallet.providerName)})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center center',
                                                backgroundColor: wallet.providerName === 'Jawwal Pay' ? '#4CAF50' : '#7B1FA2'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-black/20 rounded-xl" />
                                            <div className="relative z-10 flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2.5 text-right">
                                                    <div className="w-11 h-11 rounded-lg flex items-center justify-center shadow-sm bg-white dark:bg-gray-800 p-1">
                                                        <img loading="lazy" decoding="async" width="40" height="24" src={getWalletLogo(wallet.providerName)} alt={wallet.providerName} className="h-full w-auto object-contain" onError={(e)=>{e.target.style.display='none'}} />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-white">{wallet.accountHolderName}</p>
                                                        <p className="text-base font-mono text-white/80 mt-0.5" dir="ltr">{wallet.phoneNumber}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setDeleteConfirm({ id: wallet.id, type: t('doctorPayment.electronicWallet'), name: wallet.providerName })}
                                                        className="text-xs text-white/80 hover:text-red-200 p-1.5 rounded-lg hover:bg-white dark:bg-gray-800/10 transition-colors"
                                                    >
                                                        <FiTrash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditWallet(wallet)}
                                                        className="flex items-center gap-1 text-xs text-white hover:text-white/90 font-bold"
                                                    >
                                                        <FiEdit3 className="w-3.5 h-3.5" />{t('doctorPayment.editWallet')}</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-2xl p-8 text-center text-gray-400">
                                            <FiSmartphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">{t('doctorPayment.noWalletYet')}</p>
                                            <button
                                                onClick={() => { setViewMode("add"); setAddType("wallet"); }}
                                                className="mt-3 text-sm text-[#1b8b99] font-bold hover:underline"
                                            >{t('doctorPayment.addDigitalWallet')}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border border-dashed border-slate-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-2 bg-slate-50 dark:bg-gray-900/50 mt-6">
                            <FiAlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-center">
                                                                 <strong className="text-gray-700 dark:text-gray-300">{t('doctorPayment.technicalTip')}</strong> يفضل دائماً توفير خيار محفظة رقمية واحد على الأقل وخيار بنكي واحد.
                            </p>
                        </div>
                    </div>
                )}

                {viewMode === "add" && (
                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                        <div className="text-center space-y-2 border-b border-slate-100 dark:border-gray-700 pb-6">
                            <h1 className="text-2xl font-bold text-[#1b8b99]">{t('doctorPayment.addNewMethod')}</h1>
                            <p className="text-xs sm:text-sm text-gray-500">{t('doctorPayment.addNewMethodDescription')}</p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-500 text-right">{t('doctorPayment.choosePaymentType')}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onClick={() => { setAddType("bank"); setError(''); }}
                                    className={`border-2 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                                        addType === "bank" ? "border-[#1b8b99] bg-cyan-50/20" : "border-slate-100 dark:border-gray-700 hover:border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${addType === "bank" ? "bg-[#1b8b99] text-white" : "bg-slate-100 dark:bg-gray-800 text-gray-500"}`}>
                                        <FiCreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{t('doctorPayment.bankAccountType')}</h3>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('doctorPayment.bankTransferDesc')}</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => { setAddType("wallet"); setError(''); }}
                                    className={`border-2 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                                        addType === "wallet" ? "border-[#1b8b99] bg-cyan-50/20" : "border-slate-100 dark:border-gray-700 hover:border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${addType === "wallet" ? "bg-[#1b8b99] text-white" : "bg-slate-100 dark:bg-gray-800 text-gray-500"}`}>
                                        <FiSmartphone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">{t('doctorPayment.walletType')}</h3>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('doctorPayment.walletProvidersDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-100 dark:border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 space-y-4">
                            {addType === "bank" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.bankNameLabel')}</label>
                                        <div className="relative flex items-center border border-slate-200 dark:border-gray-700 rounded-xl px-3 bg-slate-50 dark:bg-gray-900 h-12">
                                            <select
                                                value={bankForm.bankId}
                                                onChange={(e) => {
                                                    setBankForm({ ...bankForm, bankId: e.target.value, iban: '' });
                                                    setIbanError('');
                                                }}
                                                className="w-full bg-transparent outline-none border-none text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 appearance-none font-medium"
                                            >
                                                {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                            <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.accountHolderName')}</label>
                                        <input
                                            type="text"
                                            value={bankForm.accountHolderName}
                                            onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                                            placeholder={t('doctorPayment.accountHolderPlaceholder')}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 bg-slate-50 dark:bg-gray-900 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 outline-none focus:border-[#1b8b99] focus:bg-white dark:bg-gray-800 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.accountPhoneNumber')}</label>
                                        <input
                                            type="text"
                                            value={bankForm.phoneNumber}
                                            onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setBankForm({ ...bankForm, phoneNumber: val }); }}
                                            placeholder="059XXXXXXXX"
                                            maxLength={10}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 bg-slate-50 dark:bg-gray-900 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none focus:border-[#1b8b99] focus:bg-white dark:bg-gray-800 transition-all text-right"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.ibanNumberLabel')}</label>
                                        <input
                                            type="text"
                                            value={bankForm.iban}
                                            onChange={(e) => {
                                                const cleaned = formatIban(e.target.value);
                                                setBankForm({ ...bankForm, iban: cleaned });
                                                const err = validateIban(cleaned, bankForm.bankId);
                                                setIbanError(err);
                                            }}
                                            onBlur={() => {
                                                const err = validateIban(bankForm.iban, bankForm.bankId);
                                                setIbanError(err);
                                            }}
                                            placeholder={getBankPlaceholder(bankForm.bankId)}
                                            maxLength={29}
                                            className={`w-full border rounded-xl px-4 bg-slate-50 dark:bg-gray-900 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none focus:bg-white dark:bg-gray-800 transition-all text-right ${
                                                ibanError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 dark:border-gray-700 focus:border-[#1b8b99]'
                                            }`}
                                        />
                                        {ibanError && <p className="text-[11px] text-red-500 mt-1">{ibanError}</p>}
                                        {bankForm.iban && !ibanError && bankForm.iban.length === 29 && (
                                            <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                                                <FiCheck className="w-3 h-3" />{t('doctorPayment.ibanValid')}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.walletTypeLabel')}</label>
                                        <div className="relative flex items-center border border-slate-200 dark:border-gray-700 rounded-xl px-3 bg-slate-50 dark:bg-gray-900 h-12">
                                            <select
                                                value={walletForm.walletProviderId}
                                                onChange={(e) => setWalletForm({ ...walletForm, walletProviderId: e.target.value })}
                                                className="w-full bg-transparent outline-none border-none text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 appearance-none font-medium"
                                            >
                                                {WALLET_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.walletHolderName')}</label>
                                        <input
                                            type="text"
                                            value={walletForm.accountHolderName}
                                            onChange={(e) => setWalletForm({ ...walletForm, accountHolderName: e.target.value })}
                                            placeholder={t('doctorPayment.walletHolderPlaceholder')}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 bg-slate-50 dark:bg-gray-900 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 outline-none focus:border-[#1b8b99] focus:bg-white dark:bg-gray-800 transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-[#1b8b99]">{t('doctorPayment.walletPhoneNumber')}</label>
                                        <input
                                            type="text"
                                            value={walletForm.phoneNumber}
                                            onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setWalletForm({ ...walletForm, phoneNumber: val }); }}
                                            placeholder="059XXXXXXXX"
                                            maxLength={10}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 bg-slate-50 dark:bg-gray-900 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none focus:border-[#1b8b99] focus:bg-white dark:bg-gray-800 transition-all text-right"
                                        />
                                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{t('doctorPayment.walletPhoneNote')}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                <button
                                    disabled={saving}
                                    onClick={addType === "bank" ? handleAddBank : handleAddWallet}
                                    className="bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                                    إضافة الوسيلة
                                </button>
                                <button
                                    onClick={() => { setViewMode("list"); setError(''); }}
                                    className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm"
                                >{t('common.cancel')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === "edit_bank" && (
                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                        <div className="border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xs">
                            <div className="bg-slate-50 dark:bg-gray-900 px-4 py-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#1b8b99]">
                                    <FiCreditCard className="w-5 h-5" />
                                    <h2 className="font-bold text-sm sm:text-base">{t('doctorPayment.editPaymentTitle')}</h2>
                                </div>
                                <button onClick={() => { setViewMode("list"); setEditData(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 space-y-6">
                                <div className="bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700 p-4 rounded-xl flex items-start gap-3">
                                    <FiInfo className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                                    <div className="text-right space-y-0.5">
                                         <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.importantInstructions')}</h4>
                                         <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('doctorPayment.importantInstructionsDesc')}</p>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                                     <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.accountName')}</label>
                                        <input type="text" value={bankForm.accountHolderName}
                                            onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 outline-none focus:border-[#1b8b99] transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.bankNameLabel')}</label>
                                        <div className="relative flex items-center border border-slate-200 dark:border-gray-700 rounded-xl px-3 h-12 bg-white dark:bg-gray-800">
                                            <select value={bankForm.bankId}
                                                onChange={(e) => setBankForm({ ...bankForm, bankId: e.target.value })}
                                                className="w-full bg-transparent outline-none border-none text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 appearance-none font-medium">
                                                {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                            <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.accountPhoneNumber')}</label>
                                        <input type="text" value={bankForm.phoneNumber}
                                            onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setBankForm({ ...bankForm, phoneNumber: val }); }}
                                            maxLength={10}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none focus:border-[#1b8b99] transition-all text-right" />
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.ibanNumberLabel')}</label>
                                        <input type="text" value={bankForm.iban}
                                            onChange={(e) => { const cleaned = formatIban(e.target.value); setBankForm({ ...bankForm, iban: cleaned }); const err = validateIban(cleaned, bankForm.bankId); setIbanError(err); }}
                                            onBlur={() => { const err = validateIban(bankForm.iban, bankForm.bankId); setIbanError(err); }}
                                            placeholder={getBankPlaceholder(bankForm.bankId)}
                                            maxLength={29}
                                            className={`w-full border rounded-xl px-4 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none transition-all text-right ${ibanError ? 'border-red-300 focus:border-red-400' : 'border-slate-200 dark:border-gray-700 focus:border-[#1b8b99]'}`} />
                                        {ibanError && <p className="text-[11px] text-red-500 mt-1">{ibanError}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <button disabled={saving} onClick={handleUpdateBank}
                                        className="bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50 flex items-center gap-2">
                                        {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                                        حفظ التغييرات
                                    </button>
                                    <button onClick={() => { setViewMode("list"); setEditData(null); }}
                                        className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm">{t('common.cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === "edit_wallet" && (
                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                        <div className="border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xs">
                            <div className="bg-slate-50 dark:bg-gray-900 px-4 py-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#1b8b99]">
                                    <FiSmartphone className="w-5 h-5" />
                                    <h2 className="font-bold text-sm sm:text-base">{t('doctorPayment.editWalletTitle')}</h2>
                                </div>
                                <button onClick={() => { setViewMode("list"); setEditData(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 transition-colors">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 sm:p-6 space-y-6">
                                <div className="bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-gray-700 p-4 rounded-xl flex items-start gap-3">
                                    <FiInfo className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                                    <div className="text-right space-y-0.5">
                                         <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.importantInstructions')}</h4>
                                         <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('doctorPayment.importantInstructionsDesc')}</p>
                                     </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                                     <div className="md:col-span-2 space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.walletHolderName')}</label>
                                        <input type="text" value={walletForm.accountHolderName}
                                            onChange={(e) => setWalletForm({ ...walletForm, accountHolderName: e.target.value })}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 outline-none focus:border-[#1b8b99] transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.walletTypeLabel')}</label>
                                        <div className="relative flex items-center border border-slate-200 dark:border-gray-700 rounded-xl px-3 h-12 bg-white dark:bg-gray-800">
                                            <select value={walletForm.walletProviderId}
                                                onChange={(e) => setWalletForm({ ...walletForm, walletProviderId: e.target.value })}
                                                className="w-full bg-transparent outline-none border-none text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 appearance-none font-medium">
                                                {WALLET_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                         <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{t('doctorPayment.walletNumber')}</label>
                                        <input type="text" value={walletForm.phoneNumber}
                                            onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setWalletForm({ ...walletForm, phoneNumber: val }); }}
                                            maxLength={10}
                                            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl px-4 h-12 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-500 font-mono outline-none focus:border-[#1b8b99] transition-all text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                    <button disabled={saving} onClick={handleUpdateWallet}
                                        className="bg-[#1b8b99] hover:bg-[#15727e] text-white font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50 flex items-center gap-2">
                                        {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                                        حفظ التغييرات
                                    </button>
                                    <button onClick={() => { setViewMode("list"); setEditData(null); }}
                                        className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-bold h-11 px-6 rounded-xl transition-all cursor-pointer text-sm">{t('common.cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{t('doctorPayment.deletePaymentTitle')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">
                                هل أنت متأكد من حذف "{deleteConfirm.name}"؟ لن تتمكن من التراجع عن هذا الإجراء.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    disabled={saving}
                                    onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving && <FiLoader className="w-4 h-4 animate-spin" />}
                                    نعم، حذف
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-gray-600 dark:text-gray-400 dark:text-gray-500 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
                                >{t('common.cancel')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPayment;
