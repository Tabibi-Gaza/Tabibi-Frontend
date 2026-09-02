import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Check, X, Eye, FileText, Download, AlertTriangle, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { specializationKeys } from '../../queries/specializations/specializationKeys';
import { doctorKeys } from '../../queries/doctors/doctorKeys';
import { resolveImageUrl } from '../../utils/imageUrl';

const STATUS_MAP = {
    'Pending': 'pending',
    'Approved': 'accepted',
    'Rejected': 'rejected',
};

export default function AdminJoinRequests() {
    const queryClient = useQueryClient();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [activeFilter, setActiveFilter] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReasonInput, setRejectReasonInput] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
    const [searchName, setSearchName] = useState('');
    const itemsPerPage = 5;

    const statusToApi = { pending: 1, accepted: 2, rejected: 3 };

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                Page: currentPage,
                PageSize: itemsPerPage,
            };
            if (searchName) params.Search = searchName;
            if (statusToApi[activeFilter]) params.Status = statusToApi[activeFilter];

            const { data } = await axiosInstance.get('/admin/doctor-applications/all', { params });
            if (data.succeeded && data.data) {
                const items = (data.data.items || []).map(item => ({
                    id: item.id,
                    name: item.fullName,
                    email: item.email,
                    avatarInitials: item.fullName ? item.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '??',
                    specialty: item.specialization || '',
                    experience: item.yearsOfExperience || 0,
                    licenseNumber: item.licenseNumber || '',
                    status: STATUS_MAP[item.status] || 'pending',
                    date: item.createdAt || '',
                    bio: '',
                    cvPath: item.cvPath || '',
                    idDocumentPath: item.idDocumentPath || '',
                    photoPath: item.photoPath || '',
                    rejectionReason: item.rejectionReason || '',
                }));
                setRequests(items);
                setTotalPages(data.data.totalPages || 1);
                setTotalCount(data.data.totalCount || 0);
            }
        } catch (error) {

            toast.error('فشل في جلب بيانات الطلبات');
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeFilter, searchName]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleAccept = async (id) => {
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post('/admin/doctor-applications/approve', { Id: id });
            if (data.succeeded) {
                toast.success(data.message || 'تم قبول الطلب بنجاح');
                setSelectedRequest(null);
                setSelectedDetails(null);
                await fetchApplications();
                queryClient.invalidateQueries({ queryKey: specializationKeys.all });
                queryClient.invalidateQueries({ queryKey: doctorKeys.all });
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'فشل في قبول الطلب');
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء قبول الطلب');
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectFlow = () => {
        setRejectReasonInput('');
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReasonInput.trim()) {
            toast.error("يرجى كتابة سبب الرفض أولاً");
            return;
        }
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post('/admin/doctor-applications/reject', {
                Id: selectedRequest.id,
                Reason: rejectReasonInput
            });
            if (data.succeeded) {
                toast.success(data.message || 'تم رفض الطلب بنجاح');
                setShowRejectModal(false);
                setSelectedRequest(null);
                setSelectedDetails(null);
                await fetchApplications();
                queryClient.invalidateQueries({ queryKey: specializationKeys.all });
                queryClient.invalidateQueries({ queryKey: doctorKeys.all });
            } else {
                toast.error(data.errors?.[0]?.message || data.message || 'فشل في رفض الطلب');
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || 'حدث خطأ أثناء رفض الطلب');
        } finally {
            setActionLoading(false);
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
            const blob = response.data;

            if (blob.type === 'application/json') {
                const text = await blob.text();
                const json = JSON.parse(text);
                if (json.url) {
                    if (type === 'cv') {
                        const link = document.createElement('a');
                        link.href = json.url;
                        link.download = 'CV.pdf';
                        link.click();
                        toast.success('تم تحميل الملف بنجاح');
                    } else {
                        window.open(json.url, '_blank');
                        toast.success('تم فتح الملف في نافذة جديدة');
                    }
                    return;
                }
            }

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

    const resetAdvancedFilters = () => {
        setSearchName('');
    };

    const filteredRequests = requests;
    const totalPending = activeFilter === 'pending' ? totalCount : requests.length;

    return (
        <div className="w-full bg-[#ecf8fa] flex flex-col items-start relative text-right" dir="rtl">
            <div className="w-full flex flex-col gap-6 md:gap-8">
                <div className="text-right">
                    <h2 className="text-[26px] md:text-[32px] font-extrabold text-[#138C9F] leading-tight">طلبات انضمام الأطباء</h2>
                    <p className="text-[14px] md:text-[16px] font-semibold text-[#434654] mt-1">إدارة ومراجعة طلبات الاعتماد للأطباء الجدد في المنصة.</p>
                </div>

                <div className="w-full flex flex-col sm:flex-row gap-4 md:gap-6">
                    <div className="flex-1 bg-white border border-[#C3C6D6] rounded-[12px] p-4 md:p-6 flex flex-row-reverse justify-between items-center shadow-sm">
                        <div className="w-[48px] h-[48px] bg-blue-50 rounded-[8px] flex items-center justify-center text-[#138C9F] shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-start text-right">
                            <span className="text-[13px] md:text-[14px] font-bold text-[#434654]">إجمالي الطلبات المعلقة</span>
                            <span className="text-[22px] md:text-[26px] font-extrabold text-[#138C9F]">{totalCount}</span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white border border-[#C3C6D6] rounded-[12px] overflow-hidden shadow-sm flex flex-col">
                    <div className="w-full min-h-[75px] py-4 md:py-0 bg-[#e2f4f7] border-b border-[#C3C6D6] flex flex-col sm:flex-row gap-4 justify-between items-center p-6">
                        <button
                            onClick={() => setShowAdvancedFilterModal(true)}
                            className="h-[38px] border border-[#138C9F] rounded-[8px] px-4 py-2 flex flex-row items-center gap-2 text-[#138C9F] text-[14px] font-bold hover:bg-[#138C9F]/5 transition-all relative w-full sm:w-auto justify-center"
                        >
                            <span>تصفية متقدمة</span>
                            <Filter className="w-3.5 h-3.5" />
                            {searchName && (
                                <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-[#BA1A1A] text-white text-[10px] rounded-full flex items-center justify-center">!</span>
                            )}
                        </button>

                        <div className="flex flex-row items-center gap-2 md:gap-3 w-full sm:w-auto justify-center overflow-x-auto">
                            <button
                                onClick={() => { setActiveFilter('pending'); setCurrentPage(1); }}
                                className={`h-[38px] md:h-[40px] px-4 md:px-6 rounded-full text-[13px] md:text-[15px] font-bold transition-all whitespace-nowrap ${activeFilter === 'pending' ? 'bg-[#138C9F] text-white' : 'bg-[#E5EEFF] text-[#434654]'}`}
                            >
                                المعلقة
                            </button>
                            <button
                                onClick={() => { setActiveFilter('accepted'); setCurrentPage(1); }}
                                className={`h-[38px] md:h-[40px] px-4 md:px-6 rounded-full text-[13px] md:text-[15px] font-bold transition-all whitespace-nowrap ${activeFilter === 'accepted' ? 'bg-[#006A2D] text-white' : 'bg-[#E5EEFF] text-[#434654]'}`}
                            >
                                المقبولة
                            </button>
                            <button
                                onClick={() => { setActiveFilter('rejected'); setCurrentPage(1); }}
                                className={`h-[38px] md:h-[40px] px-4 md:px-6 rounded-full text-[13px] md:text-[15px] font-bold transition-all whitespace-nowrap ${activeFilter === 'rejected' ? 'bg-[#BA1A1A] text-white' : 'bg-[#E5EEFF] text-[#434654]'}`}
                            >
                                المرفوضة
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-right">
                            <thead>
                                <tr className="bg-white border-b border-[#C3C6D6] h-[60px] text-[#434654] text-[14px] font-bold">
                                    <th className="p-3 md:p-4 ps-8">اسم الطبيب</th>
                                    <th className="p-3 md:p-4">التخصص</th>
                                    <th className="p-3 md:p-4 text-center hidden md:table-cell">الخبرة (سنوات)</th>
                                    <th className="p-3 md:p-4">الحالة</th>
                                    <th className="p-3 md:p-4 hidden md:table-cell">تاريخ الطلب</th>
                                    <th className="p-3 md:p-4 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-[#737685] font-bold text-[15px]">
                                            جاري تحميل البيانات...
                                        </td>
                                    </tr>
                                ) : filteredRequests.length > 0 ? (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="h-[75px] border-b border-[#C3C6D6] bg-white hover:bg-slate-50 transition-colors">
                                            <td className="p-3 md:p-4 ps-8">
                                                <div className="flex flex-row items-center gap-3">
                                                    <div className="w-[36px] h-[36px] bg-[#138C9F]/10 text-[#138C9F] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0">
                                                        {req.avatarInitials}
                                                    </div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-[15px] font-bold text-[#138C9F]">{req.name}</span>
                                                        <span className="text-[13px] text-[#737685] truncate max-w-[150px]">{req.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 md:p-4 text-[#138C9F] font-bold">{req.specialty}</td>
                                            <td className="p-3 md:p-4 text-center text-[#138C9F] font-semibold hidden md:table-cell">{req.experience}</td>
                                            <td className="p-3 md:p-4">
                                                <span className={`inline-flex items-center justify-between w-[100px] h-[24px] rounded-full px-3 text-[12px] font-bold ${req.status === 'accepted' ? 'bg-[#DCFCE7] text-[#15803D]' : req.status === 'rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                                                    <span>{req.status === 'accepted' ? 'تم القبول' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}</span>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'accepted' ? 'bg-[#16A34A]' : req.status === 'rejected' ? 'bg-[#DC2626]' : 'bg-[#D97706]'}`}></span>
                                                </span>
                                            </td>
                                            <td className="p-3 md:p-4 text-[14px] text-[#434654] hidden md:table-cell">{req.date ? new Date(req.date).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                                            <td className="p-3 md:p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => fetchDetails(req)}
                                                        className="p-2 text-[#138C9F] bg-[#138C9F]/10 rounded-full hover:bg-[#138C9F]/20 transition-colors"
                                                        title="عرض تفاصيل الطلب كاملة"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAccept(req.id)}
                                                                disabled={actionLoading}
                                                                className="w-[64px] h-[28px] bg-[#D3E4FE] text-black rounded-[12px] font-bold text-[12px] hover:bg-blue-200 transition-colors disabled:opacity-50"
                                                            >
                                                                قبول
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedRequest(req); openRejectFlow(); }}
                                                                disabled={actionLoading}
                                                                className="w-[70px] h-[28px] bg-[#BA1A1A] text-white rounded-[12px] font-bold text-[12px] hover:bg-red-700 transition-colors disabled:opacity-50"
                                                            >
                                                                رفض
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-[#737685] font-bold text-[15px]">
                                            لا توجد نتائج مطابقة لخيارات التصفية المحددة.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#e2f4f7] border-t border-[#C3C6D6] px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div className="flex items-center gap-1.5 order-2 sm:order-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-9 h-9 md:w-10 md:h-10 font-bold rounded flex items-center justify-center text-[15px] md:text-[16px] transition-colors ${currentPage === pageNumber ? 'bg-[#138C9F] text-white font-extrabold' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 bg-white border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-[13px] md:text-[14px] text-[#434654] font-semibold order-1 sm:order-2">
                            عرض {filteredRequests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} من إجمالي {totalCount} طلب
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filter Modal */}
            {showAdvancedFilterModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[460px] bg-white rounded-[16px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col text-right">
                        <div className="h-[60px] bg-[#e2f4f7] px-6 flex items-center justify-between border-b border-[#C3C6D6]">
                            <h3 className="text-[16px] font-extrabold text-[#434654]">التصفية المتقدمة للطلبات</h3>
                            <button onClick={() => setShowAdvancedFilterModal(false)} className="text-[#434654] hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[13px] font-bold text-[#434654]">اسم الطبيب أو البريد الإلكتروني</label>
                                <input
                                    type="text"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    placeholder="ابحث باسم الطبيب أو البريد..."
                                    className="w-full h-[40px] border border-gray-300 rounded-[8px] px-3 text-[14px] focus:outline-none focus:border-[#138C9F] text-right"
                                />
                            </div>
                        </div>
                        <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                            <button
                                onClick={resetAdvancedFilters}
                                className="flex-1 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>إعادة تعيين</span>
                            </button>
                            <button
                                onClick={() => { setShowAdvancedFilterModal(false); setCurrentPage(1); }}
                                className="flex-1 h-[42px] bg-[#138C9F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#0f7282]"
                            >
                                تطبيق التصفية
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[650px] max-h-[90vh] bg-white rounded-[16px] overflow-hidden shadow-2xl border border-gray-100 text-right flex flex-col">
                        <div className="w-full bg-[#138C9F] relative flex items-end justify-between px-6 pb-4 shrink-0">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute -bottom-8 right-6 flex items-center gap-4">
                                <div className="w-[100px] h-[100px] bg-white rounded-[12px] p-1 shadow-md overflow-hidden">
                                    {selectedRequest.photoPath ? (
                                        <img loading="lazy" decoding="async" width="96" height="96" src={resolveImageUrl(selectedRequest.photoPath)} alt={selectedRequest.name} className="w-full h-full rounded-[10px] object-contain" />
                                    ) : (
                                        <div className="w-full h-full bg-[#E5EEFF] rounded-[10px] flex items-center justify-center text-[#138C9F] font-bold text-[28px]">
                                            {selectedRequest.avatarInitials}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 px-6 md:px-8 pb-4 flex flex-col gap-5 overflow-y-auto flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#434654]">{selectedRequest.name}</h3>
                                <span className="bg-[#E5EEFF] text-[#138C9F] text-[13px] font-bold px-3 py-1 rounded-md">
                                    طبيب
                                </span>
                            </div>

                            {selectedDetails && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-[12px] p-4 space-y-3">
                                        <h4 className="text-[14px] font-bold text-[#138C9F] border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            التفاصيل المهنية
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">التخصص</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.specialization || selectedRequest.specialty || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">سنوات الخبرة</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedRequest.experience || selectedDetails.yearsOfExperience || '-'} سنة</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] font-bold text-[#737685]">رقم الترخيص</span>
                                            <span className="text-[13px] font-semibold text-[#434654]">{selectedRequest.licenseNumber || selectedDetails.licenseNumber || '-'}</span>
                                        </div>
                                        {selectedDetails.sessionPrice && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">سعر الكشفية</span>
                                                <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.sessionPrice} ₪</span>
                                            </div>
                                        )}
                                        {selectedDetails.clinicName && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">العيادة</span>
                                                <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.clinicName}</span>
                                            </div>
                                        )}
                                        {selectedDetails.clinicAddress && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">عنوان العيادة</span>
                                                <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.clinicAddress}</span>
                                            </div>
                                        )}
                                        {(selectedDetails.bio || selectedRequest.bio) && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <span className="text-[12px] font-bold text-[#737685] block mb-1">النبذة المهنية</span>
                                                <p className="text-[12px] text-[#434654] leading-relaxed">{selectedDetails.bio || selectedRequest.bio}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border border-gray-200 rounded-[12px] p-4 space-y-3">
                                        <h4 className="text-[14px] font-bold text-[#138C9F] border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            المعلومات الشخصية
                                        </h4>
                                        {selectedDetails.email && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">البريد الإلكتروني</span>
                                                <span className="text-[13px] font-semibold text-[#434654] truncate max-w-[180px]">{selectedDetails.email}</span>
                                            </div>
                                        )}
                                        {selectedDetails.phoneNumber && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">رقم الهاتف</span>
                                                <span className="text-[13px] font-semibold text-[#434654]">{selectedDetails.phoneNumber}</span>
                                            </div>
                                        )}
                                        {selectedDetails.secretaryEmail && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] font-bold text-[#737685]">بريد السكرتير</span>
                                                <span className="text-[13px] font-semibold text-[#434654] truncate max-w-[180px]">{selectedDetails.secretaryEmail}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDownload(selectedRequest.id, 'cv')}
                                    className="flex-1 h-12 bg-[#138C9F] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#0f7282] transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    تحميل السيرة الذاتية (CV)
                                </button>
                                <button
                                    onClick={() => handleDownload(selectedRequest.id, 'id')}
                                    className="flex-1 h-12 border border-[#138C9F] text-[#138C9F] bg-white rounded-[8px] text-[13px] font-bold hover:bg-[#138C9F]/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    صورة الهوية / مزاولة المهنة
                                </button>
                            </div>

                            {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                                <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-[#BA1A1A] font-bold text-[14px]">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>سبب الرفض:</span>
                                    </div>
                                    <p className="text-[13px] text-[#961212] pr-6 font-medium">{selectedRequest.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={() => { setSelectedRequest(null); setSelectedDetails(null); }}
                                className="px-5 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] hover:bg-gray-50 w-full sm:w-auto"
                            >
                                إغلاق
                            </button>
                            {selectedRequest.status !== 'rejected' && (
                                <button
                                    onClick={openRejectFlow}
                                    disabled={actionLoading}
                                    className="px-5 h-[42px] border border-[#BA1A1A] text-[#BA1A1A] rounded-[8px] text-[14px] font-bold hover:bg-red-50 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                    <span>رفض الطلب</span>
                                </button>
                            )}
                            {selectedRequest.status !== 'accepted' && (
                                <button
                                    onClick={() => handleAccept(selectedRequest.id)}
                                    disabled={actionLoading}
                                    className="px-6 h-[42px] bg-[#138C9F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#0f7282] flex items-center justify-center gap-2 w-full sm:w-auto flex-1 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{actionLoading ? 'جاري المعالجة...' : 'قبول وتفعيل الملف'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[440px] bg-white rounded-[16px] p-4 sm:p-6 shadow-2xl border border-gray-100 text-center text-right">
                        <div className="w-[56px] h-[56px] bg-red-50 text-[#BA1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#434654] text-center">سبب الرفض</h3>
                        <p className="text-[13px] text-[#737685] mt-1 px-4 text-center">
                            يرجى توضيح سبب رفض طلب انضمام الطبيب ليتم إبلاغه بشكل رسمي.
                        </p>
                        <div className="mt-4 text-right">
                            <label className="text-[13px] font-bold text-[#434654] block mb-1">تفاصيل السبب</label>
                            <textarea
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                placeholder="اكتب هنا تفاصيل الرفض بدقة..."
                                className="w-full h-[100px] border border-gray-300 rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-[#138C9F] text-right"
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
                                {actionLoading ? 'جاري...' : 'تأكيد الرفض'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
