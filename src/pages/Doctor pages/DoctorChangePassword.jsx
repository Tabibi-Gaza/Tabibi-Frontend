import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const passwordRules = [
    { id: 1, label: '8 أحرف على الأقل', test: (p) => p.length >= 8 },
    { id: 2, label: 'حرف كبير وصغير', test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
    { id: 3, label: 'رقم واحد على الأقل', test: (p) => /\d/.test(p) },
    { id: 4, label: 'رمز خاص واحد على الأقل', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(p) },
];

const DoctorChangePassword = () => {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const allRulesPassed = passwordRules.every((r) => r.test(newPassword));
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!allRulesPassed) {
            toast.error('كلمة المرور الجديدة لا تلبي جميع المتطلبات');
            return;
        }
        if (!passwordsMatch) {
            toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('OldPassword', oldPassword);
            formData.append('NewPassword', newPassword);
            formData.append('ConfirmNewPassword', confirmPassword);

            const { default: axiosInstance } = await import('../../api/axiosInstance');
            await axiosInstance.post('/doctor/profile/change-password', formData);
            toast.success('تم تغيير كلمة المرور بنجاح');
            navigate('/doctor/profile');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.description || 'فشل تغيير كلمة المرور';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6" dir="rtl">
            <div className="max-w-lg mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#138C9F] transition-colors mb-6 cursor-pointer"
                >
                    <ArrowRight className="w-4 h-4" />
                    رجوع
                </button>

                <div className="bg-white rounded-2xl border border-[#C3C6D6]/60 shadow-sm overflow-hidden">
                    <div className="bg-[#EBF3F5] px-6 py-5 border-b border-[#C3C6D6]/40">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#138C9F] flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-[#0B1C30]">تغيير كلمة المرور</h1>
                                <p className="text-xs font-bold text-gray-500">قم بتأكيد كلمة المرور الحالية ثم اكتب الجديدة</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1.5">كلمة المرور الحالية</label>
                            <div className="relative">
                                <input
                                    type={showOld ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full border border-[#C3C6D6]/60 rounded-xl px-4 py-3 text-sm font-bold text-[#0B1C30] outline-none focus:border-[#138C9F] transition-colors pr-11"
                                    placeholder="أدخل كلمة المرور الحالية"
                                    required
                                />
                                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1.5">كلمة المرور الجديدة</label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-[#C3C6D6]/60 rounded-xl px-4 py-3 text-sm font-bold text-[#0B1C30] outline-none focus:border-[#138C9F] transition-colors pr-11"
                                    placeholder="أدخل كلمة المرور الجديدة"
                                    required
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {newPassword.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    {passwordRules.map((rule) => (
                                        <div key={rule.id} className="flex items-center gap-1.5 text-xs font-bold">
                                            {rule.test(newPassword) ? (
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                            )}
                                            <span className={rule.test(newPassword) ? 'text-green-600' : 'text-gray-400'}>{rule.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1.5">تأكيد كلمة المرور الجديدة</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm font-bold text-[#0B1C30] outline-none transition-colors pr-11 ${
                                        confirmPassword.length > 0
                                            ? passwordsMatch ? 'border-green-400 focus:border-green-500' : 'border-red-400 focus:border-red-500'
                                            : 'border-[#C3C6D6]/60 focus:border-[#138C9F]'
                                    }`}
                                    placeholder="أعد إدخال كلمة المرور الجديدة"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <p className={`mt-1.5 text-xs font-bold ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                    {passwordsMatch ? 'كلمتا المرور متطابقتان' : 'كلمتا المرور غير متطابقتين'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !allRulesPassed || !passwordsMatch || !oldPassword}
                            className="w-full py-3 rounded-xl bg-[#138C9F] text-white font-bold text-sm hover:bg-[#0f7585] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorChangePassword;
