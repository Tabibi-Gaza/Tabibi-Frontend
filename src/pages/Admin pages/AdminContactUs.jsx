import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch, FiEye, FiCornerUpLeft, FiTrash2,
    FiX, FiSend, FiCheckCircle, FiAlertCircle,
    FiMessageSquare, FiTrendingUp, FiChevronDown
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function AdminContactUs() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(t('adminContactUs.allStatuses'));

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState('');

    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({ totalMessages: 0, processedMessages: 0, unprocessedMessages: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const statusToIsReplied = {
        [t('adminContactUs.unread')]: false,
        [t('adminContactUs.processed')]: true,
        [t('adminContactUs.underProcessing')]: false,
    };

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, pageSize: 10 };
            if (appliedSearch) params.search = appliedSearch;
            if (statusFilter !== t('adminContactUs.allStatuses')) params.isReplied = statusToIsReplied[statusFilter];
            const { data } = await axiosInstance.get('/admin/contact-messages', { params });
            if (data.succeeded) {
                setMessages(data.data.items);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            toast.error(t('adminContactUs.fetchFailed'));
        } finally {
            setLoading(false);
        }
    }, [page, appliedSearch, statusFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get('/admin/contact-messages/stats');
            if (data.succeeded) {
                setStats(data.data);
            }
        } catch (error) { }
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);
    useEffect(() => { fetchStats(); }, [fetchStats]);

    const handleSearch = () => {
        setAppliedSearch(searchTerm.trim());
        setPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handleOpenDetails = (msg) => { setSelectedMessage(msg); setIsDetailsOpen(true); };

    const handleOpenReply = (msg) => { setSelectedMessage(msg); setIsDetailsOpen(false); setIsReplyOpen(true); };

    const handleDeleteMessage = async (id) => {
        try {
            const { data } = await axiosInstance.delete(`/admin/contact-messages/${id}`);
            if (data.succeeded) {
                toast.success(t('adminContactUs.deleteSuccess'));
                setMessages(prev => prev.filter(msg => msg.id !== id));
                setIsDetailsOpen(false);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || t('adminContactUs.deleteFailed'));
            }
        } catch (error) {
            toast.error(t('adminContactUs.deleteMessageFailed'));
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm(t('adminContactUs.deleteAllConfirm'))) return;
        try {
            const { data } = await axiosInstance.delete('/admin/contact-messages');
            if (data.succeeded) {
                toast.success(t('adminContactUs.deleteAllSuccess'));
                setMessages([]);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || t('adminContactUs.deleteFailed'));
            }
        } catch (error) {
            toast.error(t('adminContactUs.deleteAllFailed'));
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post('/admin/contact-messages/reply', {
                messageId: selectedMessage.id,
                replyBody: replyText
            });
            if (data.succeeded) {
                toast.success(t('adminContactUs.replySuccess', { name: selectedMessage.fullName }));
                setMessages(prev => prev.map(msg =>
                    msg.id === selectedMessage.id ? { ...msg, isReplied: true } : msg
                ));
                setReplyText('');
                setIsReplyOpen(false);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || t('adminContactUs.replyFailed'));
            }
        } catch (error) {
            toast.error(t('adminContactUs.replyFailed'));
        }
    };

    const getStatusBadge = (isReplied) => {
        if (isReplied) {
            return { label: t('adminContactUs.processed'), className: 'bg-[#004F20]/10 text-[#004F20]' };
        }
        return { label: t('adminContactUs.unread'), className: 'bg-[#BA1A1A]/10 text-[#BA1A1A]' };
    };

    const filteredMessages = messages;

    return (
        <div className="w-full  bg-[#ecf8fa] dark:bg-gray-900/20 flex flex-col gap-6" style={{ direction: 'rtl' }}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <h2 className="font-extrabold text-[32px] leading-10 text-[#138C9F]">
                        {t('adminContactUs.title')}
                    </h2>
                    <p className="font-semibold text-[16px] leading-6 text-[#434654]">
                        {t('adminContactUs.description')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-white dark:bg-gray-800/70 border-r-4 border-y border-l border-[#004F20] backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-[#434654] uppercase tracking-wider">{t('adminContactUs.processed')}</span>
                        <span className="font-bold text-3xl text-[#004F20]">{stats.processedMessages}</span>
                        <div className="flex items-center gap-1 text-[#004F20] text-sm font-semibold mt-1">
                            <FiTrendingUp size={14} />
                            <span>{stats.totalMessages > 0 ? Math.round(stats.processedMessages / stats.totalMessages * 100) : 0}% {t('adminContactUs.closureRate')}</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#006A2D]/10 rounded-2xl flex items-center justify-center text-[#004F20]">
                        <FiCheckCircle size={26} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800/70 border-r-4 border-y border-l border-[#BA1A1A] backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-[#434654] uppercase tracking-wider">{t('adminContactUs.unread')}</span>
                        <span className="font-bold text-3xl text-[#BA1A1A]">{stats.unprocessedMessages}</span>
                        <div className="flex items-center gap-1 text-[#BA1A1A] text-sm font-semibold mt-1">
                            <FiAlertCircle size={14} />
                            <span>{t('adminContactUs.needsImmediateResponse')}</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#BA1A1A]/10 rounded-2xl flex items-center justify-center text-[#BA1A1A]">
                        <FiAlertCircle size={26} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800/70 border border-[#e2e8f0] dark:border-gray-700/80 backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm text-[#434654] uppercase tracking-wider">{t('adminContactUs.totalMessages')}</span>
                        <span className="font-bold text-3xl text-[#138C9F]">{stats.totalMessages}</span>
                        <div className="flex items-center gap-1 text-[#138C9F] text-sm font-semibold mt-1">
                            <FiMessageSquare size={14} />
                            <span>{t('adminContactUs.totalMessages')}</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#138C9F]/10 rounded-2xl flex items-center justify-center text-[#138C9F]">
                        <FiMessageSquare size={26} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="relative flex-grow w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={t('adminContactUs.filterPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        className="w-full h-[38px] bg-[#ecf8fa] dark:bg-gray-900 border border-[#C3C6D6] dark:border-gray-700 rounded-lg pr-10 pl-4 font-medium text-sm text-[#0B1C30] dark:text-white focus:outline-none focus:border-[#138C9F]"
                    />
                    <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737685]" size={18} />
                </div>

                <div className="relative w-full md:w-32">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="w-full h-[38px] bg-[#ecf8fa] dark:bg-gray-900 border border-[#C3C6D6] dark:border-gray-700 rounded-lg px-3 font-medium text-sm text-[#0B1C30] dark:text-white appearance-none focus:outline-none"
                    >
                        <option>{t('adminContactUs.allStatuses')}</option>
                        <option>{t('adminContactUs.unread')}</option>
                        <option>{t('adminContactUs.underProcessing')}</option>
                        <option>{t('adminContactUs.processed')}</option>
                    </select>
                    <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B1C30] dark:text-white pointer-events-none" />
                </div>

                <button onClick={handleSearch} className="bg-[#138C9F] text-white px-6 h-[36px] rounded-lg font-semibold text-sm flex items-center justify-center gap-2 w-full md:w-auto hover:bg-[#117a8c] transition-colors">
                    <span>{t('common.search')}</span>
                    <FiSearch size={14} />
                </button>
                <button onClick={handleDeleteAll} className="bg-[#BA1A1A] text-white px-6 h-[36px] rounded-lg font-semibold text-sm flex items-center justify-center gap-2 w-full md:w-auto hover:bg-[#a01515] transition-colors">
                    <FiTrash2 size={14} />
                    <span>{t('adminContactUs.clearAll')}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-[#C3C6D6] dark:border-gray-700 rounded-xl overflow-hidden w-full">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-right">
                        <thead>
                            <tr className="bg-[#E5EEFF] border-b border-[#C3C6D6]">
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654]">{t('adminContactUs.senderName')}</th>
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654]">{t('adminContactUs.email')}</th>
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654]">{t('adminContactUs.subject')}</th>
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654] hidden md:table-cell">{t('adminContactUs.date')}</th>
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654] hidden sm:table-cell">{t('adminContactUs.status')}</th>
                                <th className="p-3 md:p-4 font-bold text-base text-[#434654] text-center">{t('adminContactUs.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8 text-[#434654]">{t('common.loading')}</td></tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr><td colSpan={6} className="text-center p-8 text-[#434654]">{t('adminContactUs.noMessages')}</td></tr>
                            ) : filteredMessages.map((msg) => {
                                const badge = getStatusBadge(msg.isReplied);
                                return (
                                <tr key={msg.id} className="border-b border-[#C3C6D6] dark:border-gray-700 last:border-none hover:bg-slate-50 dark:bg-gray-900 transition-colors">
                                    <td className="p-3 md:p-4 font-bold text-base text-[#138C9F]">{msg.fullName}</td>
                                    <td className="p-3 md:p-4 font-semibold text-sm text-[#434654]">{msg.email}</td>
                                    <td className="p-3 md:p-4 font-semibold text-sm text-[#0B1C30]">{msg.subject || t('adminContactUs.noSubject')}</td>
                                    <td className="p-3 md:p-4 font-bold text-sm text-[#434654] hidden md:table-cell">{msg.createdAt}</td>
                                    <td className="p-3 md:p-4 hidden sm:table-cell">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                    </td>
                                    <td className="p-3 md:p-4 flex justify-center items-center gap-2">
                                        <button onClick={() => handleOpenReply(msg)} className="p-2 text-[#138C9F] hover:bg-[#138C9F]/10 rounded-lg transition-colors" title={t('adminContactUs.quickReply')}>
                                            <FiCornerUpLeft size={18} />
                                        </button>
                                        <button onClick={() => handleOpenDetails(msg)} className="p-2 text-[#004F20] hover:bg-[#004F20]/10 rounded-lg transition-colors" title={t('adminContactUs.viewDetails')}>
                                            <FiEye size={18} />
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4" style={{ direction: 'ltr' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-3 py-1 rounded border border-[#C3C6D6] dark:border-gray-700 text-[#434654] disabled:opacity-50 hover:bg-[#ecf8fa] dark:bg-gray-900 text-sm">{t('common.previous')}</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded text-sm ${p === page ? 'bg-[#138C9F] text-white' : 'border border-[#C3C6D6] dark:border-gray-700 text-[#434654] hover:bg-[#ecf8fa] dark:bg-gray-900'}`}>{p}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-3 py-1 rounded border border-[#C3C6D6] dark:border-gray-700 text-[#434654] disabled:opacity-50 hover:bg-[#ecf8fa] dark:bg-gray-900 text-sm">{t('common.next')}</button>
                </div>
            )}

            {isDetailsOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-lg text-[#0B1C30]">{t('adminContactUs.messageDetails')}</h3>
                            <button onClick={() => setIsDetailsOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600"><FiX size={20} /></button>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-[#138C9F] font-bold text-lg">
                                        {selectedMessage.fullName.split(' ').map(n => n[0]).join(' ')}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#138C9F] text-base">{selectedMessage.fullName}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('adminContactUs.sentDate')}</p>
                                    <p className="text-sm font-semibold text-gray-700">{selectedMessage.createdAt}</p>
                                </div>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-[#ecf8fa] dark:bg-gray-900 flex flex-col gap-3">
                                <h5 className="font-bold text-[#138C9F] text-sm">
                                    {t('adminContactUs.subject')}: <span className="text-[#0B1C30]">{selectedMessage.subject || t('adminContactUs.noSubject')}</span>
                                </h5>
                                <hr className="border-gray-200" />
                                <p className="font-medium text-sm text-[#434654] leading-relaxed whitespace-pre-line">{selectedMessage.message}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between bg-gray-50">
                            <button onClick={() => handleOpenReply(selectedMessage)}
                                className="bg-[#138C9F] text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#117a8c] transition-colors">
                                <FiCornerUpLeft size={16} /><span>{t('adminContactUs.replyNow')}</span>
                            </button>
                            <button onClick={() => handleDeleteMessage(selectedMessage.id)}
                                className="border border-[#BA1A1A] text-[#BA1A1A] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#BA1A1A]/5 transition-colors">
                                <FiTrash2 size={16} /><span>{t('common.delete')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReplyOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSendReply} className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-lg text-[#0B1C30]">{t('adminContactUs.quickReplyTitle')}</h3>
                            <button type="button" onClick={() => setIsReplyOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600"><FiX size={20} /></button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-[#138C9F] font-bold text-sm">
                                    {selectedMessage.fullName.split(' ').map(n => n[0]).join(' ')}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('adminContactUs.to')}</p>
                                    <h4 className="font-bold text-[#138C9F] text-sm">{selectedMessage.fullName}</h4>
                                    <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <textarea required rows={6} value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={t('adminContactUs.replyPlaceholder')}
                                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm text-[#0B1C30] dark:text-white focus:outline-none focus:border-[#138C9F] bg-[#ecf8fa] dark:bg-gray-900 resize-none" />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50">
                            <button type="button" onClick={() => setIsReplyOpen(false)}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 dark:text-gray-400 dark:text-gray-500 font-semibold text-sm hover:bg-gray-100 dark:bg-gray-800 transition-colors">{t('common.cancel')}</button>
                            <button type="submit"
                                className="bg-[#138C9F] text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#117a8c] transition-colors">
                                <FiSend size={14} /><span>{t('adminContactUs.sendReply')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
