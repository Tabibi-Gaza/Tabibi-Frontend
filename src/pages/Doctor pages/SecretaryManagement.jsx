import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { secretaryService } from '../../services/secretaryService';
import { faPlus, faTrash, faShieldHalved, faUserTie, faEnvelope, faToggleOn, faToggleOff, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PERMISSIONS_LIST = [
    { key: 1, label: 'إدارة المواعيد', description: 'عرض وإدارة مواعيد المرضى' },
    { key: 2, label: 'إدارة المرضى', description: 'عرض وإدارة بيانات المرضى' },
    { key: 4, label: 'إدارة الجداول', description: 'تعديل جداول المواعيد والإجازات' },
    { key: 8, label: 'إدارة المدفوعات', description: 'عرض وتأكيد المدفوعات' },
    { key: 16, label: 'عرض المحادثات', description: 'الاطلاع على محادثات المرضى' },
    { key: 32, label: 'بدء الاستشارة', description: 'بدء محادثات جديدة مع المرضى' },
];

const SecretaryManagement = () => {
    const [secretaries, setSecretaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState(63);
    const [editingId, setEditingId] = useState(null);
    const [editPermissions, setEditPermissions] = useState(0);

    useEffect(() => {
        fetchSecretaries();
    }, []);

    const fetchSecretaries = async () => {
        try {
            const { data } = await secretaryService.getSecretaries();
            if (data.succeeded) {
                setSecretaries(data.data);
            }
        } catch {
            toast.error('فشل جلب قائمة السكرتاراة');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!email.trim()) {
            toast.error('يرجى إدخال البريد الإلكتروني');
            return;
        }
        setAdding(true);
        try {
            const { data } = await secretaryService.addSecretary(email.trim(), selectedPermissions);
            if (data.succeeded) {
                toast.success('تم ربط السكرتير بنجاح');
                setEmail('');
                setSelectedPermissions(63);
                fetchSecretaries();
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'حدث خطأ');
            }
        } catch (err) {
            toast.error(err.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء الإضافة');
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (secretaryId, name) => {
        if (!window.confirm(`هل أنت متأكد من إزالة السكرتير "${name}"؟`)) return;
        try {
            const { data } = await secretaryService.removeSecretary(secretaryId);
            if (data.succeeded) {
                toast.success('تم إزالة السكرتير بنجاح');
                fetchSecretaries();
            }
        } catch {
            toast.error('فشل إزالة السكرتير');
        }
    };

    const handleSavePermissions = async (secretaryId) => {
        try {
            const { data } = await secretaryService.updatePermissions(secretaryId, editPermissions);
            if (data.succeeded) {
                toast.success('تم تحديث الصلاحيات بنجاح');
                setEditingId(null);
                fetchSecretaries();
            }
        } catch {
            toast.error('فشل تحديث الصلاحيات');
        }
    };

    const togglePermission = (current, flag) => {
        return (current & flag) ? (current & ~flag) : (current | flag);
    };

    const getPermissionLabel = (flags) => {
        if (flags === 63) return 'جميع الصلاحيات';
        if (flags === 0) return 'بدون صلاحيات';
        return PERMISSIONS_LIST.filter(p => flags & p.key).map(p => p.label).join('، ');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FontAwesomeIcon icon={faSpinner} spin className="text-[#1b8b99] text-3xl" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6" dir="rtl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#1b8b99] mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserTie} />
                    إدارة السكرتير
                </h1>
                <p className="text-gray-500 text-sm">إضافة وإدارة صلاحيات السكرتير المربوط بعيادتك</p>
            </div>

            {/* Add Secretary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} className="text-[#1b8b99]" />
                    إضافة سكرتير جديد
                </h2>
                <div className="flex gap-3 mb-4">
                    <div className="flex-1 relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="البريد الإلكتروني للسكرتير"
                            className="w-full h-12 pr-10 pl-4 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#1b8b99] transition"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={adding}
                        className="h-12 px-6 bg-[#1b8b99] text-white rounded-xl text-sm font-bold hover:bg-[#138C9F] transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {adding ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPlus} />}
                        ربط
                    </button>
                </div>

                {/* Permissions Selection */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">الصلاحيات الممنوحة</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {PERMISSIONS_LIST.map((perm) => (
                            <label
                                key={perm.key}
                                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                                    selectedPermissions & perm.key
                                        ? 'border-[#1b8b99] bg-[#ecf8fa]'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={!!(selectedPermissions & perm.key)}
                                    onChange={() => setSelectedPermissions(prev => togglePermission(prev, perm.key))}
                                    className="w-4 h-4 accent-[#1b8b99]"
                                />
                                <div>
                                    <span className="text-sm font-bold text-gray-800">{perm.label}</span>
                                    <p className="text-[10px] text-gray-400">{perm.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Secretaries List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">السكرتاراة الحاليون</h2>
                {secretaries.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <FontAwesomeIcon icon={faUserTie} className="text-4xl mb-3" />
                        <p>لا يوجد سكرتاراة مرتبطون بعد</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {secretaries.map((sec) => (
                            <div
                                key={sec.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition ${
                                    sec.isActive ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50 opacity-60'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#ecf8fa] flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUserTie} className="text-[#1b8b99]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{sec.fullName}</p>
                                        <p className="text-xs text-gray-400">{sec.email}</p>
                                        {editingId !== sec.id && (
                                            <p className="text-xs text-[#1b8b99] mt-1">
                                                <FontAwesomeIcon icon={faShieldHalved} className="ml-1" />
                                                {getPermissionLabel(sec.permissionsFlags)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingId === sec.id ? (
                                        <>
                                            <div className="flex flex-wrap gap-1 max-w-[300px]">
                                                {PERMISSIONS_LIST.map((perm) => (
                                                    <label
                                                        key={perm.key}
                                                        className={`text-[10px] px-2 py-1 rounded-lg border cursor-pointer transition ${
                                                            editPermissions & perm.key
                                                                ? 'border-[#1b8b99] bg-[#ecf8fa] text-[#1b8b99] font-bold'
                                                                : 'border-gray-200 text-gray-400'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={!!(editPermissions & perm.key)}
                                                            onChange={() => setEditPermissions(prev => togglePermission(prev, perm.key))}
                                                            className="hidden"
                                                        />
                                                        {perm.label}
                                                    </label>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleSavePermissions(sec.id)}
                                                className="text-xs px-3 py-1.5 bg-[#1b8b99] text-white rounded-lg font-bold hover:bg-[#138C9F]"
                                            >
                                                حفظ
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50"
                                            >
                                                إلغاء
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditingId(sec.id);
                                                    setEditPermissions(sec.permissionsFlags);
                                                }}
                                                className="text-xs px-3 py-1.5 border border-[#1b8b99] text-[#1b8b99] rounded-lg font-bold hover:bg-[#ecf8fa] transition flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faShieldHalved} />
                                                تعديل الصلاحيات
                                            </button>
                                            <button
                                                onClick={() => handleRemove(sec.id, sec.fullName)}
                                                className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded-lg font-bold hover:bg-red-50 transition flex items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecretaryManagement;
