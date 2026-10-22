import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronRight, ChevronLeft, FileText, Building2, MapPin, Phone, Mail, Hash } from 'lucide-react';
import { FiEye, FiX, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useTranslation } from 'react-i18next';

const TYPE_LABEL_KEYS = {
    Pharmacy: 'adminFacilityRequests.typePharmacy',
    Lab: 'adminFacilityRequests.typeLab',
    MedicalCenter: 'adminFacilityRequests.typeCenter',
};

export default function AdminFacilityRequests() {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReasonInput, setRejectReasonInput] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const itemsPerPage = 5;

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = { Page: currentPage, PageSize: itemsPerPage };
            if (typeFilter) params.FacilityType = typeFilter;

            const { data } = await axiosInstance.get('/admin/facility-applications/pending', { params });
            if (data.succeeded && data.data) {
                setRequests(data.data.items || []);
                setTotalPages(data.data.totalPages || 1);
                setTotalCount(data.data.totalCount || 0);
            }
        } catch (error) {
            toast.error(t('adminFacilityRequests.fetchFailed'));
        } finally {
            setLoading(false);
        }
    }, [currentPage, typeFilter, t]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post('/admin/facility-applications/approve', { Id: id });
            if (data.succeeded) {
                toast.success(data.message || t('adminFacilityRequests.approveSuccess'));
                setSelectedRequest(null);
                await fetchApplications();
            } else {
                toast.error(data.errors?.[0]?.message || data.message || t('adminFacilityRequests.approveFailed'));
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || t('adminFacilityRequests.approveFailed'));
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectFlow = (req) => {
        setSelectedRequest(req);
        setRejectReasonInput('');
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post('/admin/facility-applications/reject', {
                Id: selectedRequest.id,
                Reason: rejectReasonInput || null,
            });
            if (data.succeeded) {
                toast.success(data.message || t('adminFacilityRequests.rejectSuccess'));
                setShowRejectModal(false);
                setSelectedRequest(null);
                await fetchApplications();
            } else {
                toast.error(data.errors?.[0]?.message || data.message || t('adminFacilityRequests.rejectFailed'));
            }
        } catch (error) {
            toast.error(error.response?.data?.errors?.[0]?.message || t('adminFacilityRequests.rejectFailed'));
        } finally {
            setActionLoading(false);
        }
    };

    const openLicenseDoc = (path) => {
        if (!path) return;
        window.open(resolveImageUrl(path), '_blank');
    };

    const typeFilters = [
        { key: '', label: t('adminFacilityRequests.allTypes') },
        { key: 'Pharmacy', label: t('adminFacilityRequests.typePharmacy') },
        { key: 'Lab', label: t('adminFacilityRequests.typeLab') },
        { key: 'MedicalCenter', label: t('adminFacilityRequests.typeCenter') },
    ];

    return (
        <div className="w-full flex flex-col gap-6 md:gap-8">
            <div className="w-full bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-[12px] overflow-hidden shadow-sm flex flex-col">
                <div className="w-full min-h-[75px] py-4 md:py-0 bg-[#e2f4f7] dark:bg-gray-800 border-b border-[#C3C6D6] dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center p-6">
                    <div className="flex flex-row items-center gap-3">
                        <div className="w-[48px] h-[48px] bg-white dark:bg-gray-700 rounded-[8px] flex items-center justify-center text-[#138C9F] shrink-0">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-start text-right">
                            <span className="text-[14px] font-extrabold text-[#434654]">{t('adminFacilityRequests.totalPending')}</span>
                            <span className="text-[22px] font-extrabold text-[#138C9F]">{totalCount}</span>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-2 md:gap-3 w-full sm:w-auto justify-center overflow-x-auto">
                        {typeFilters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => { setTypeFilter(f.key); setCurrentPage(1); }}
                                className={`h-[38px] md:h-[40px] px-4 md:px-5 rounded-full text-[13px] md:text-[14px] font-bold transition-all whitespace-nowrap ${typeFilter === f.key ? 'bg-[#138C9F] text-white' : 'bg-[#E5EEFF] dark:bg-gray-700 text-[#434654] dark:text-gray-300'}`}
                            >{f.label}</button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-right">
                        <thead>
                            <tr className="bg-white dark:bg-gray-800 border-b border-[#C3C6D6] dark:border-gray-700 h-[60px] text-[#434654] dark:text-gray-300 text-[14px] font-bold">
                                <th className="p-3 md:p-4 ps-8">{t('adminFacilityRequests.fullName')}</th>
                                <th className="p-3 md:p-4">{t('adminFacilityRequests.facilityType')}</th>
                                <th className="p-3 md:p-4 hidden md:table-cell">{t('adminFacilityRequests.facilityName')}</th>
                                <th className="p-3 md:p-4 hidden md:table-cell">{t('adminFacilityRequests.licenseNumber')}</th>
                                <th className="p-3 md:p-4">{t('adminFacilityRequests.area')}</th>
                                <th className="p-3 md:p-4 text-center">{t('adminFacilityRequests.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#737685] dark:text-gray-400 font-bold text-[15px]">
                                        {t('adminFacilityRequests.loading')}
                                    </td>
                                </tr>
                            ) : requests.length > 0 ? (
                                requests.map((req) => (
                                    <tr key={req.id} className="h-[75px] border-b border-[#C3C6D6] dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-3 md:p-4 ps-8">
                                            <div className="flex flex-row items-center gap-3">
                                                <div className="w-[36px] h-[36px] bg-[#138C9F]/10 text-[#138C9F] rounded-full flex items-center justify-center font-bold text-[14px] shrink-0">
                                                    {req.fullName ? req.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : '??'}
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[15px] font-bold text-[#138C9F] dark:text-teal-300">{req.fullName}</span>
                                                    <span className="text-[13px] text-[#737685] dark:text-gray-400 truncate max-w-[150px]">{req.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 md:p-4">
                                            <span className="inline-flex items-center h-[26px] rounded-full px-3 text-[12px] font-bold bg-[#E5EEFF] dark:bg-teal-900/40 text-[#138C9F] dark:text-teal-300">
                                                {t(TYPE_LABEL_KEYS[req.facilityType] || 'adminFacilityRequests.typePharmacy')}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-[14px] font-semibold text-[#434654] dark:text-gray-300 hidden md:table-cell">{req.facilityName}</td>
                                        <td className="p-3 md:p-4 text-[14px] text-[#434654] dark:text-gray-300 hidden md:table-cell" dir="ltr">{req.licenseNumber}</td>
                                        <td className="p-3 md:p-4 text-[14px] text-[#434654] dark:text-gray-300">{req.area}</td>
                                        <td className="p-3 md:p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="w-8 h-8 rounded-lg bg-[#138C9F]/10 text-[#138C9F] flex items-center justify-center hover:bg-[#138C9F]/20 transition-colors shrink-0"
                                                    title={t('adminFacilityRequests.viewDetails')}
                                                >
                                                    <FiEye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={actionLoading}
                                                    className="w-[64px] h-[28px] bg-[#D3E4FE] text-black dark:text-white rounded-[12px] font-bold text-[12px] hover:bg-blue-200 transition-colors disabled:opacity-50"
                                                >{t('adminFacilityRequests.approve')}</button>
                                                <button
                                                    onClick={() => openRejectFlow(req)}
                                                    disabled={actionLoading}
                                                    className="w-[70px] h-[28px] bg-[#BA1A1A] text-white rounded-[12px] font-bold text-[12px] hover:bg-red-700 transition-colors disabled:opacity-50"
                                                >{t('adminFacilityRequests.reject')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-[#737685] dark:text-gray-400 font-bold text-[15px]">{t('adminFacilityRequests.noResults')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-[#e2f4f7] dark:bg-gray-800 border-t border-[#C3C6D6] dark:border-gray-700 px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <div className="flex items-center gap-1.5 order-2 sm:order-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`w-9 h-9 md:w-10 md:h-10 font-bold rounded flex items-center justify-center text-[15px] transition-colors ${currentPage === pageNumber ? 'bg-[#138C9F] text-white font-extrabold' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'}`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-[13px] md:text-[14px] text-[#434654] dark:text-gray-300 font-semibold order-1 sm:order-2">
                        {t('adminFacilityRequests.showing', {
                            from: requests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
                            to: Math.min(currentPage * itemsPerPage, totalCount),
                            total: totalCount,
                        })}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRequest && !showRejectModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="w-full max-w-[600px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-[16px] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 text-right flex flex-col">
                        <div className="w-full bg-[#138C9F] relative flex items-center justify-between px-6 py-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <Building2 size={20} className="text-white" />
                                <h3 className="text-[18px] font-extrabold text-white">{selectedRequest.facilityName}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        <div className="px-6 md:px-8 py-5 flex flex-col gap-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="border border-gray-200 dark:border-gray-700 rounded-[12px] p-4 space-y-3">
                                    <h4 className="text-[14px] font-bold text-[#138C9F] dark:text-teal-300 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                                        <Building2 size={14} />
                                        {t('adminFacilityRequests.facilityDetails')}
                                    </h4>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0">{t('adminFacilityRequests.facilityType')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200">{t(TYPE_LABEL_KEYS[selectedRequest.facilityType] || 'adminFacilityRequests.typePharmacy')}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0">{t('adminFacilityRequests.licenseNumber')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200" dir="ltr">{selectedRequest.licenseNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0 flex items-center gap-1"><MapPin size={12} />{t('adminFacilityRequests.area')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200">{selectedRequest.area}</span>
                                    </div>
                                    {selectedRequest.detailedAddress && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 block mb-1">{t('adminFacilityRequests.detailedAddress')}</span>
                                            <p className="text-[12px] text-[#434654] dark:text-gray-300 leading-relaxed">{selectedRequest.detailedAddress}</p>
                                        </div>
                                    )}
                                    {selectedRequest.description && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 block mb-1">{t('adminFacilityRequests.description')}</span>
                                            <p className="text-[12px] text-[#434654] dark:text-gray-300 leading-relaxed">{selectedRequest.description}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-gray-200 dark:border-gray-700 rounded-[12px] p-4 space-y-3">
                                    <h4 className="text-[14px] font-bold text-[#138C9F] dark:text-teal-300 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                                        <FiAlertTriangle size={14} />
                                        {t('adminFacilityRequests.applicantInfo')}
                                    </h4>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0">{t('adminFacilityRequests.fullName')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200">{selectedRequest.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0 flex items-center gap-1"><Mail size={12} />{t('adminFacilityRequests.email')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200 truncate max-w-[180px]">{selectedRequest.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0 flex items-center gap-1"><Phone size={12} />{t('adminFacilityRequests.phoneNumber')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200" dir="ltr">{selectedRequest.phoneNumber || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-[12px] font-bold text-[#737685] dark:text-gray-400 shrink-0 flex items-center gap-1"><Hash size={12} />{t('adminFacilityRequests.requestDate')}</span>
                                        <span className="text-[13px] font-semibold text-[#434654] dark:text-gray-200">{selectedRequest.createdAt || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.licenseDocumentPath && (
                                <button
                                    onClick={() => openLicenseDoc(selectedRequest.licenseDocumentPath)}
                                    className="h-12 border border-[#138C9F] text-[#138C9F] bg-white dark:bg-gray-800 rounded-[8px] text-[13px] font-bold hover:bg-[#138C9F]/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <FiDownload size={14} />
                                    {t('adminFacilityRequests.viewLicense')}
                                </button>
                            )}
                        </div>

                        <div className="px-6 md:px-8 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-5 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto"
                            >
                                {t('adminFacilityRequests.close')}
                            </button>
                            <button
                                onClick={() => openRejectFlow(selectedRequest)}
                                disabled={actionLoading}
                                className="px-5 h-[42px] border border-[#BA1A1A] text-[#BA1A1A] rounded-[8px] text-[14px] font-bold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                            >
                                <FiX size={14} />
                                <span>{t('adminFacilityRequests.reject')}</span>
                            </button>
                            <button
                                onClick={() => handleApprove(selectedRequest.id)}
                                disabled={actionLoading}
                                className="px-6 h-[42px] bg-[#138C9F] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#0f7282] flex items-center justify-center gap-2 w-full sm:w-auto flex-1 disabled:opacity-50"
                            >
                                <span>{actionLoading ? t('adminFacilityRequests.processing') : t('adminFacilityRequests.approveAndActivate')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[calc(100%-2rem)] sm:max-w-[440px] bg-white dark:bg-gray-800 rounded-[16px] p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-gray-700 text-center text-right">
                        <div className="w-[56px] h-[56px] bg-red-50 dark:bg-red-900/30 text-[#BA1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={28} />
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#434654] dark:text-gray-200 text-center">{t('adminFacilityRequests.rejectionReasonTitle')}</h3>
                        <p className="text-[13px] text-[#737685] dark:text-gray-400 mt-1 px-4 text-center">{t('adminFacilityRequests.rejectionReasonDescription')}</p>
                        <div className="mt-4 text-right">
                            <label className="text-[13px] font-bold text-[#434654] dark:text-gray-300 block mb-1">{t('adminFacilityRequests.reasonDetails')}</label>
                            <textarea
                                value={rejectReasonInput}
                                onChange={(e) => setRejectReasonInput(e.target.value)}
                                placeholder={t('adminFacilityRequests.reasonPlaceholder')}
                                className="w-full h-[100px] border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-[#138C9F] text-right resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => { setShowRejectModal(false); setSelectedRequest(null); }}
                                className="flex-1 h-[42px] border border-gray-300 rounded-[8px] text-[14px] font-bold text-[#434654] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {t('adminFacilityRequests.cancel')}
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                disabled={actionLoading}
                                className="flex-1 h-[42px] bg-[#BA1A1A] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#961212] disabled:opacity-50"
                            >
                                {actionLoading ? t('adminFacilityRequests.processing') : t('adminFacilityRequests.confirmRejection')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
