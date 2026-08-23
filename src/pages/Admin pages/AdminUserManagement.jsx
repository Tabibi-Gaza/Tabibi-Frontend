import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Trash2, Users, UserCheck, UserPlus, Ban, ChevronRight, ChevronLeft, X, User, Briefcase, Award, Download, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { specializationKeys } from '../../queries/specializations/specializationKeys';

const FILES_URL = import.meta.env.VITE_Files_URL || '';
const ADMIN_EMAILS = ['admin@tabibi.com', 'Mazen@gmail.com'];

const seedImages = {};
const seedCtx = import.meta.glob('../../assets/assets_frontend/doc*.png', { eager: true, query: '?url' });
Object.entries(seedCtx).forEach(([key, val]) => {
    const match = key.match(/doc(\d+)\.png/);
    if (match) seedImages[`doc${match[1]}.png`] = val.default || val;
});
const getDoctorImg = (path) => {
    if (!path) return '';
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    if (seedImages[filename]) return seedImages[filename];
    return `${FILES_URL}/${path}`;
};
const genderMap = { Male: 'ذكر', Female: 'أنثى', PreferNotToSay: 'يفضل عدم القول' };

export default function AdminUserManagement() {
    const queryClient = useQueryClient();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const usersPerPage = 4;

    const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, totalActiveDoctors: 0, totalPatients: 0, totalInactiveUsers: 0 });

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/admin/users', { params: { Page: currentPage, PageSize: usersPerPage } });
            if (data.succeeded && data.data) {
                const items = (data.data.items || [])
                    .filter(u => !ADMIN_EMAILS.includes(u.email))
                    .map(u => ({
                        id: u.profileId || u.id,
                        userId: u.id,
                        name: u.fullName,
                        email: u.email,
                        userType: u.userType || '',
                        createdAt: u.createdAt,
                        isActive: u.isActive,
                        profileImageUrl: u.profileImageUrl || '',
                    }));
                setUsers(items);
                setTotalPages(data.data.totalPages || 1);
                setTotalCount(data.data.totalCount || items.length);
            }
        } catch (error) {

            toast.error('فشل في جلب بيانات المستخدمين');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/admin/users/stats');
            if (data.succeeded && data.data) {
                setStats(data.data);
            }
        } catch (error) {

        }
    }, []);

    useEffect(() => { fetchUsers(); fetchStats(); }, [fetchUsers, fetchStats]);

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setDetailsLoading(true);
        setUserDetails(null);
        if (user.userType === 'Secretary') {
            setDetailsLoading(false);
            return;
        }
        try {
            const type = user.userType === 'Doctor' ? 'doctors' : 'patients';
            const { data } = await axiosInstance.get(`/admin/users/${type}/${user.id}`);
            if (data.succeeded && data.data) {
                setUserDetails(data.data);
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'فشل في جلب التفاصيل');
            }
        } catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message || 'فشل في جلب التفاصيل';

            toast.error(msg);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) return;
        try {
            const { data } = await axiosInstance.delete(`/admin/users/${user.userId}`);
            if (data.succeeded) {
                toast.success(data.message || 'تم حذف المستخدم بنجاح');
                fetchUsers();
                setIsModalOpen(false);
                queryClient.invalidateQueries({ queryKey: specializationKeys.all });
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'فشل في حذف المستخدم');
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء الحذف');
        }
    };

    const handleToggleActivation = async (user) => {
        const action = user.isActive ? 'تعطيل' : 'تفعيل';
        if (!window.confirm(`هل أنت متأكد من ${action} هذا المستخدم؟`)) return;
        try {
            const { data } = await axiosInstance.post('/admin/users/toggle-activation', { userId: user.userId });
            if (data.succeeded) {
                toast.success(data.message || `تم ${action} المستخدم بنجاح`);
                fetchUsers();
                fetchStats();
                queryClient.invalidateQueries({ queryKey: specializationKeys.all });
                if (isModalOpen && selectedUser?.userId === user.userId) {
                    setSelectedUser(prev => ({ ...prev, isActive: !prev.isActive }));
                }
            } else {
                toast.error(data.errors?.[0]?.message || data.message || `فشل ${action} المستخدم`);
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ');
        }
    };

    const handleDownload = async (doctorId, type) => {
        if (!doctorId) {
            toast.info('لا توجد ملفات مرفوعة لهذا الطبيب');
            return;
        }
        try {
            const endpoint = type === 'cv'
                ? `/admin/users/doctors/${doctorId}/download-cv`
                : `/admin/users/doctors/${doctorId}/download-id`;
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

    const [imgErrors, setImgErrors] = useState({});
    const handleImgError = (id) => setImgErrors(prev => ({ ...prev, [id]: true }));
    const showImg = (user) => user.profileImageUrl && !imgErrors[user.id];
    const imgSrc = (user) => showImg(user) ? getDoctorImg(user.profileImageUrl) : '';

    const totalCountDisplay = totalCount;

    return (
        <div className="w-full bg-[#ecf8fa] flex flex-col gap-6" dir="rtl">
            <div className="flex justify-between items-center w-full flex-wrap gap-2">
                <h2 className="font-['Tajawal'] font-extrabold text-[32px] leading-[40px] tracking-[-0.64px] text-[#138C9F]">
                    إدارة المستخدمين
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="bg-white border border-[#C3C6D6] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-['Tajawal'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-[#526069]">إجمالي الأطباء</span>
                        <span className="font-['Tajawal'] font-semibold text-[20px] leading-[28px] text-[#0B1C30]">{stats.totalDoctors}</span>
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#DAE2FF] rounded-full flex items-center justify-center text-[#003D9B]"><Users size={16} /></div>
                </div>
                <div className="bg-white border border-[#C3C6D6] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-['Tajawal'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-[#526069]">الأطباء النشطون</span>
                        <span className="font-['Tajawal'] font-semibold text-[20px] leading-[28px] text-[#0B1C30]">{stats.totalActiveDoctors}</span>
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#6BFF8F]/30 rounded-full flex items-center justify-center text-[#004F20]"><UserCheck size={16} /></div>
                </div>
                <div className="bg-white border border-[#C3C6D6] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-['Tajawal'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-[#526069]">إجمالي المستخدمين</span>
                        <span className="font-['Tajawal'] font-semibold text-[20px] leading-[28px] text-[#0B1C30]">{stats.totalUsers}</span>
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#D6E5EF] rounded-full flex items-center justify-center text-[#526069]"><UserPlus size={16} /></div>
                </div>
                <div className="bg-white border border-[#C3C6D6] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-['Tajawal'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-[#526069]">حسابات معطلة</span>
                        <span className="font-['Tajawal'] font-semibold text-[20px] leading-[28px] text-[#0B1C30]">{stats.totalInactiveUsers}</span>
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#FFDAD6] rounded-full flex items-center justify-center text-[#BA1A1A]"><Ban size={16} /></div>
                </div>
            </div>

            <div className="bg-white border border-[#C3C6D6] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-xl w-full flex flex-col overflow-hidden">
                <div className="border-b border-[#C3C6D6] px-6 py-4 flex items-center justify-start">
                    <button className="h-full border-b-2 border-[#003D9B] px-4 font-semibold text-[16px] text-[#003D9B] flex items-center justify-center cursor-pointer">الكل</button>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-right">
                        <thead>
                            <tr className="bg-[#e2f4f7] py-3">
                                <th className="px-6 py-3 font-bold text-[14px] text-[#526069] tracking-[0.6px]">المستخدم</th>
                                <th className="px-6 py-3 font-bold text-[14px] text-[#526069] tracking-[0.6px]">نوع الحساب</th>
                                <th className="px-6 py-3 font-bold text-[14px] text-[#526069] tracking-[0.6px] hidden md:table-cell">تاريخ الانضمام</th>
                                <th className="px-6 py-3 font-bold text-[14px] text-[#526069] tracking-[0.6px] hidden sm:table-cell">الحالة</th>
                                <th className="px-6 py-3 font-bold text-[14px] text-[#526069] tracking-[0.6px] text-center w-[120px]">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C3C6D6]">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-[#526069]">جاري تحميل البيانات...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {showImg(user) ? (
                                                <img loading="lazy" decoding="async" width="40" height="40" src={imgSrc(user)} onError={() => handleImgError(user.id)} alt={user.name} className="w-10 h-10 rounded-full border border-[#138C9F] object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full border border-[#138C9F] bg-[#e2f4f7] flex items-center justify-center text-[#138C9F] font-bold text-[14px]">
                                                    {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-['Tajawal'] font-semibold text-[16px] text-[#0B1C30]">{user.name}</span>
                                                <span className="font-['Tajawal'] font-medium text-[14px] text-[#526069]">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold ${user.userType === 'Doctor' ? 'bg-[#138C9F]/20 text-[#138C9F]' : user.userType === 'Secretary' ? 'bg-purple-100 text-purple-700' : 'bg-[#003D9B]/20 text-[#003D9B]'}`}>
                                            {user.userType === 'Doctor' ? 'طبيب' : user.userType === 'Secretary' ? 'سكرتير' : 'مريض'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap font-medium text-[14px] text-[#434654] hidden md:table-cell">{user.createdAt}</td>
                                    <td className="px-6 py-3 whitespace-nowrap hidden sm:table-cell">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold ${user.isActive ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                                            {user.isActive ? 'نشط' : 'معطل'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-3 text-[#526069]">
                                            <button onClick={() => handleToggleActivation(user)} className={`transition-colors p-1.5 cursor-pointer ${user.isActive ? 'hover:text-amber-600' : 'hover:text-green-600'}`} title={user.isActive ? 'تعطيل' : 'تفعيل'}>
                                                {user.isActive ? <ToggleLeft size={22} /> : <ToggleRight size={22} className="text-green-600" />}
                                            </button>
                                            <button onClick={() => handleViewUser(user)} className="hover:text-[#003D9B] transition-colors p-1.5 cursor-pointer" title="عرض">
                                                <Eye size={22} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user)} className="hover:text-red-600 transition-colors p-1.5 cursor-pointer" title="حذف">
                                                <Trash2 size={22} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && users.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-[#526069]">لا يوجد مستخدمين لعرضهم.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-[#C3C6D6] px-6 py-4 flex items-center justify-between flex-wrap gap-4 bg-white">
                    <span className="font-['Tajawal'] text-[14px] text-[#526069]">
                        عرض <strong className="text-[#0B1C30]">{users.length}</strong> من أصل <strong className="text-[#0B1C30]">{totalCountDisplay}</strong> مستخدم
                    </span>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5" dir="ltr">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"><ChevronLeft size={16} /></button>
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`w-8 h-8 rounded flex items-center justify-center text-[14px] cursor-pointer transition-colors ${currentPage === pageNumber ? 'bg-[#003D9B] text-white font-bold' : 'border border-transparent hover:border-gray-200 text-[#0b1c30] font-semibold'}`}>{pageNumber}</button>
                                );
                            })}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"><ChevronRight size={16} /></button>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in" dir="rtl">
                    <div className="bg-[#ecf8fa] border border-[#C3C6D6] shadow-2xl rounded-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setIsModalOpen(false); setUserDetails(null); }} className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <X size={20} />
                        </button>

                        <div className="bg-white border border-[#D3E2ED] shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                            <button onClick={() => { handleDeleteUser(selectedUser); setIsModalOpen(false); }} className="border border-red-200 text-red-600 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer order-3 md:order-1">
                                حذف الحساب
                            </button>

                            <div className="flex items-center gap-4 order-1 md:order-3">
                                <div className="text-right flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-white text-[13px] font-bold px-3 py-1 rounded-md ${selectedUser.userType === 'Doctor' ? 'bg-[#138C9F]' : selectedUser.userType === 'Secretary' ? 'bg-purple-600' : 'bg-[#003D9B]'}`}>
                                            {selectedUser.userType === 'Doctor' ? 'طبيب' : selectedUser.userType === 'Secretary' ? 'سكرتير' : 'مريض'}
                                        </span>
                                        <h3 className="font-['Tajawal'] font-extrabold text-[24px] text-[#0B1C30]">{selectedUser.name}</h3>
                                    </div>
                                </div>
                                {showImg(selectedUser) ? (
                                    <img loading="lazy" decoding="async" width="84" height="84" src={imgSrc(selectedUser)} onError={() => handleImgError(selectedUser.id)} alt={selectedUser.name} className="w-[84px] h-[84px] rounded-full object-cover border-2 border-[#138C9F] shadow-sm" />
                                ) : (
                                    <div className="w-[84px] h-[84px] rounded-full border-2 border-[#138C9F] bg-[#e2f4f7] flex items-center justify-center text-[#138C9F] font-bold text-[24px]">
                                        {selectedUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {detailsLoading ? (
                            <div className="text-center py-8 text-[#526069]">جاري تحميل التفاصيل...</div>
                        ) : userDetails ? (
                            selectedUser.userType === 'Doctor' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                                    <div className="bg-white border border-[#D3E2ED] rounded-2xl p-6 flex flex-col gap-4 w-full">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#138C9F] w-full">
                                            <Briefcase size={20} />
                                            <h4 className="font-['Tajawal'] font-bold text-[17px]">التفاصيل المهنية</h4>
                                        </div>
                                        <div className="flex flex-col gap-5 w-full">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">التخصص</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.specializationName || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">سنوات الخبرة</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.yearsOfExperience || 0} سنة</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">رقم الترخيص</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.licenseNumber || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">سعر الكشفية</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.sessionPrice || 0} ₪</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">العيادة</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.clinicName || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">عنوان العيادة</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.clinicAddress || '-'}</span>
                                            </div>
                                            {userDetails.detailedAddress && (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">العنوان بالتفصيل</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.detailedAddress}</span>
                                            </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">النبذة المهنية</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.bio || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-[#D3E2ED] rounded-2xl p-6 flex flex-col gap-4 w-full">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#138C9F] w-full">
                                            <User size={20} />
                                            <h4 className="font-['Tajawal'] font-bold text-[17px]">المعلومات الشخصية</h4>
                                        </div>
                                        <div className="flex flex-col gap-5 w-full">
                                            <div className="flex flex-col gap-0.5 w-full">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">البريد الإلكتروني</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold" dir="ltr" style={{ textAlign: 'right' }}>{userDetails.email || selectedUser.email}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5 w-full">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">رقم الهاتف</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold" dir="ltr">{userDetails.phoneNumber || '-'}</span>
                                            </div>
                                            <div className="flex flex-row w-full gap-16 mt-1">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-[#0B1C30] text-[16px]">تاريخ الميلاد</span>
                                                    <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.dateOfBirth || '-'}</span>
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-[#0B1C30] text-[16px]">الجنس</span>
                                                    <span className="text-[#3D4A5C] text-[16px] font-semibold">{genderMap[userDetails.gender] || userDetails.gender || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-2 md:col-span-2">
                                        <button onClick={() => handleDownload(selectedUser.id, 'id')} className="bg-[#003D9B]/10 text-[#003D9B] font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#003D9B]/20 transition-colors w-full sm:w-auto justify-center cursor-pointer text-[15px]">
                                            <Download size={20} />
                                            صورة الهوية / مزاولة المهنة
                                        </button>
                                        <button onClick={() => handleDownload(selectedUser.id, 'cv')} className="bg-[#138C9F] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#0f7282] transition-colors w-full sm:w-auto justify-center cursor-pointer text-[15px]">
                                            <Award size={20} />
                                            تنزيل السيرة الذاتية (CV)
                                        </button>
                                    </div>
                                </div>
                            ) : selectedUser.userType === 'Secretary' ? (
                                <div className="bg-white border border-[#D3E2ED] rounded-2xl p-6 flex flex-col gap-4 w-full mb-6">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-purple-600 w-full">
                                        <User size={20} />
                                        <h4 className="font-['Tajawal'] font-bold text-[17px]">معلومات السكرتير</h4>
                                    </div>
                                    <div className="flex flex-col gap-5 w-full">
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <span className="font-bold text-[#0B1C30] text-[16px]">البريد الإلكتروني</span>
                                            <span className="text-[#3D4A5C] text-[16px] font-semibold" dir="ltr" style={{ textAlign: 'right' }}>{selectedUser.email}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <p className="text-[#526069] text-[14px]">هذا المستخدم مسجل كسكرتير ومرتبط بطبيب في المنصة.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white border border-[#D3E2ED] rounded-2xl p-6 flex flex-col gap-4 w-full mb-6">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-[#003D9B] w-full">
                                        <User size={20} />
                                        <h4 className="font-['Tajawal'] font-bold text-[17px]">المعلومات الشخصية</h4>
                                    </div>
                                    <div className="flex flex-col gap-5 w-full">
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <span className="font-bold text-[#0B1C30] text-[16px]">البريد الإلكتروني</span>
                                            <span className="text-[#3D4A5C] text-[16px] font-semibold" dir="ltr" style={{ textAlign: 'right' }}>{userDetails.email || selectedUser.email}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <span className="font-bold text-[#0B1C30] text-[16px]">رقم الهاتف</span>
                                            <span className="text-[#3D4A5C] text-[16px] font-semibold" dir="ltr">{userDetails.phoneNumber || '-'}</span>
                                        </div>
                                        <div className="flex flex-row w-full gap-16 mt-1">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">تاريخ الميلاد</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.dateOfBirth || '-'}</span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-bold text-[#0B1C30] text-[16px]">الجنس</span>
                                                <span className="text-[#3D4A5C] text-[16px] font-semibold">{genderMap[userDetails.gender] || userDetails.gender || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <span className="font-bold text-[#0B1C30] text-[16px]">العنوان</span>
                                            <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.address || '-'}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 w-full">
                                            <span className="font-bold text-[#0B1C30] text-[16px]">فصيلة الدم</span>
                                            <span className="text-[#3D4A5C] text-[16px] font-semibold">{userDetails.bloodType || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-8 text-[#526069]">لا توجد تفاصيل</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
