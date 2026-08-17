import React, { useState, useEffect, useCallback } from 'react';
import {
    FiSearch, FiEye, FiCornerUpLeft, FiTrash2,
    FiX, FiSend, FiCheckCircle, FiAlertCircle,
    FiMessageSquare, FiTrendingUp, FiChevronDown
} from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminContactUs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('جميع الحالات');

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
        'غير مقروءة': false,
        'تمت معالجتها': true,
        'قيد المعالجة': false,
    };

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, pageSize: 10 };
            if (appliedSearch) params.search = appliedSearch;
            if (statusFilter !== 'جميع الحالات') params.isReplied = statusToIsReplied[statusFilter];
            const { data } = await axiosInstance.get('/admin/contact-messages', { params });
            if (data.succeeded) {
                setMessages(data.data.items);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            toast.error('فشل تحميل الرسائل');
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
                toast.success('تم حذف الرسالة بنجاح');
                setMessages(prev => prev.filter(msg => msg.id !== id));
                setIsDetailsOpen(false);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || 'فشل الحذف');
            }
        } catch (error) {
            toast.error('فشل حذف الرسالة');
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('هل أنت متأكد من حذف جميع الرسائل؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
        try {
            const { data } = await axiosInstance.delete('/admin/contact-messages');
            if (data.succeeded) {
                toast.success('تم حذف جميع الرسائل بنجاح');
                setMessages([]);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || 'فشل الحذف');
            }
        } catch (error) {
            toast.error('فشل حذف جميع الرسائل');
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
                toast.success(`تم إرسال الرد بنجاح إلى: ${selectedMessage.fullName}`);
                setMessages(prev => prev.map(msg =>
                    msg.id === selectedMessage.id ? { ...msg, isReplied: true } : msg
                ));
                setReplyText('');
                setIsReplyOpen(false);
                fetchStats();
            } else {
                toast.error(data.errors?.[0]?.message || 'فشل إرسال الرد');
            }
        } catch (error) {
            toast.error('فشل إرسال الرد');
        }
    };

    const getStatusBadge = (isReplied) => {
        if (isReplied) {
            return { label: 'تمت معالجتها', className: 'bg-[#004F20]/10 text-[#004F20]' };
        }
        return { label: 'غير مقروءة', className: 'bg-[#BA1A1A]/10 text-[#BA1A1A]' };
    };

    const filteredMessages = messages;

    return (
        <div className="w-full  bg-[#ecf8fa]/20 flex flex-col gap-6" style={{ direction: 'rtl' }}>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 w-full">
                <div className="flex flex-col gap-1">
                    <h2 className="font-['Cairo'] font-extrabold text-[32px] leading-10 text-[#138C9F]">
                        رسائل تواصل معنا
                    </h2>
                    <p className="font-['Cairo'] font-semibold text-[16px] leading-6 text-[#434654]">
                        إدارة ومتابعة استفسارات المرضى والزوار وطلبات المساعدة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-white/70 border-r-4 border-y border-l border-[#004F20] backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-['Cairo'] font-bold text-sm text-[#434654] uppercase tracking-wider">تمت معالجتها</span>
                        <span className="font-['Cairo'] font-bold text-3xl text-[#004F20]">{stats.processedMessages}</span>
                        <div className="flex items-center gap-1 text-[#004F20] text-sm font-semibold mt-1">
                            <FiTrendingUp size={14} />
                            <span>{stats.totalMessages > 0 ? Math.round(stats.processedMessages / stats.totalMessages * 100) : 0}% معدل الإغلاق</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#006A2D]/10 rounded-2xl flex items-center justify-center text-[#004F20]">
                        <FiCheckCircle size={26} />
                    </div>
                </div>

                <div className="bg-white/70 border-r-4 border-y border-l border-[#BA1A1A] backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-['Cairo'] font-bold text-sm text-[#434654] uppercase tracking-wider">غير مقروءة</span>
                        <span className="font-['Cairo'] font-bold text-3xl text-[#BA1A1A]">{stats.unprocessedMessages}</span>
                        <div className="flex items-center gap-1 text-[#BA1A1A] text-sm font-semibold mt-1">
                            <FiAlertCircle size={14} />
                            <span>تتطلب استجابة فورية</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#BA1A1A]/10 rounded-2xl flex items-center justify-center text-[#BA1A1A]">
                        <FiAlertCircle size={26} />
                    </div>
                </div>

                <div className="bg-white/70 border border-[#E2E8F0]/80 backdrop-blur-[5px] p-6 rounded-xl flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                        <span className="font-['Cairo'] font-bold text-sm text-[#434654] uppercase tracking-wider">إجمالي الرسائل</span>
                        <span className="font-['Cairo'] font-bold text-3xl text-[#138C9F]">{stats.totalMessages}</span>
                        <div className="flex items-center gap-1 text-[#138C9F] text-sm font-semibold mt-1">
                            <FiMessageSquare size={14} />
                            <span>إجمالي الرسائل</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-[#138C9F]/10 rounded-2xl flex items-center justify-center text-[#138C9F]">
                        <FiMessageSquare size={26} />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#C3C6D6] rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="relative flex-grow w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="تصفية حسب الاسم، البريد، أو الموضوع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        className="w-full h-[38px] bg-[#ecf8fa] border border-[#C3C6D6] rounded-lg pr-10 pl-4 font-['Cairo'] font-medium text-sm text-[#0B1C30] focus:outline-none focus:border-[#138C9F]"
                    />
                    <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737685]" size={18} />
                </div>

                <div className="relative w-full md:w-32">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="w-full h-[38px] bg-[#ecf8fa] border border-[#C3C6D6] rounded-lg px-3 font-['Cairo'] font-medium text-sm text-[#0B1C30] appearance-none focus:outline-none"
                    >
                        <option>جميع الحالات</option>
                        <option>غير مقروءة</option>
                        <option>قيد المعالجة</option>
                        <option>تمت معالجتها</option>
                    </select>
                    <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B1C30] pointer-events-none" />
                </div>

                <button onClick={handleSearch} className="bg-[#138C9F] text-white px-6 h-[36px] rounded-lg font-['Cairo'] font-semibold text-sm flex items-center justify-center gap-2 w-full md:w-auto hover:bg-[#117a8c] transition-colors">
                    <span>بحث</span>
                    <FiSearch size={14} />
                </button>
                <button onClick={handleDeleteAll} className="bg-[#BA1A1A] text-white px-6 h-[36px] rounded-lg font-['Cairo'] font-semibold text-sm flex items-center justify-center gap-2 w-full md:w-auto hover:bg-[#a01515] transition-colors">
                    <FiTrash2 size={14} />
                    <span>مسح الكل</span>
                </button>
            </div>

            <div className="bg-white border border-[#C3C6D6] rounded-xl overflow-hidden w-full">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-right">
                        <thead>
                            <tr className="bg-[#E5EEFF] border-b border-[#C3C6D6]">
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654]">اسم المرسل</th>
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654]">البريد الإلكتروني</th>
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654]">الموضوع</th>
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654]">التاريخ</th>
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654]">الحالة</th>
                                <th className="p-4 font-['Cairo'] font-bold text-base text-[#434654] text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8 font-['Cairo'] text-[#434654]">جاري التحميل...</td></tr>
                            ) : filteredMessages.length === 0 ? (
                                <tr><td colSpan={6} className="text-center p-8 font-['Cairo'] text-[#434654]">لا توجد رسائل</td></tr>
                            ) : filteredMessages.map((msg) => {
                                const badge = getStatusBadge(msg.isReplied);
                                return (
                                <tr key={msg.id} className="border-b border-[#C3C6D6] last:border-none hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-['Cairo'] font-bold text-base text-[#138C9F]">{msg.fullName}</td>
                                    <td className="p-4 font-['Cairo'] font-semibold text-sm text-[#434654]">{msg.email}</td>
                                    <td className="p-4 font-['Cairo'] font-semibold text-sm text-[#0B1C30]">{msg.subject || 'بدون موضوع'}</td>
                                    <td className="p-4 font-['Cairo'] font-bold text-sm text-[#434654]">{msg.createdAt}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold font-['Cairo'] ${badge.className}`}>
                                            {badge.label}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center items-center gap-2">
                                        <button onClick={() => handleOpenReply(msg)} className="p-2 text-[#138C9F] hover:bg-[#138C9F]/10 rounded-lg transition-colors" title="رد سريع">
                                            <FiCornerUpLeft size={18} />
                                        </button>
                                        <button onClick={() => handleOpenDetails(msg)} className="p-2 text-[#004F20] hover:bg-[#004F20]/10 rounded-lg transition-colors" title="عرض التفاصيل">
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
                        className="px-3 py-1 rounded border border-[#C3C6D6] text-[#434654] disabled:opacity-50 hover:bg-[#ecf8fa] font-['Cairo'] text-sm">السابق</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded font-['Cairo'] text-sm ${p === page ? 'bg-[#138C9F] text-white' : 'border border-[#C3C6D6] text-[#434654] hover:bg-[#ecf8fa]'}`}>{p}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-3 py-1 rounded border border-[#C3C6D6] text-[#434654] disabled:opacity-50 hover:bg-[#ecf8fa] font-['Cairo'] text-sm">التالي</button>
                </div>
            )}

            {isDetailsOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-['Cairo'] font-bold text-lg text-[#0B1C30]">تفاصيل الرسالة</h3>
                            <button onClick={() => setIsDetailsOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-[#138C9F] font-bold font-['Cairo'] text-lg">
                                        {selectedMessage.fullName.split(' ').map(n => n[0]).join(' ')}
                                    </div>
                                    <div>
                                        <h4 className="font-['Cairo'] font-bold text-[#138C9F] text-base">{selectedMessage.fullName}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-400 font-['Cairo'] font-medium">تاريخ الإرسال</p>
                                    <p className="text-sm font-semibold text-gray-700 font-['Cairo']">{selectedMessage.createdAt}</p>
                                </div>
                            </div>
                            <div className="border border-gray-200 rounded-xl p-4 bg-[#ecf8fa] flex flex-col gap-3">
                                <h5 className="font-['Cairo'] font-bold text-[#138C9F] text-sm">
                                    الموضوع: <span className="text-[#0B1C30]">{selectedMessage.subject || 'بدون موضوع'}</span>
                                </h5>
                                <hr className="border-gray-200" />
                                <p className="font-['Cairo'] font-medium text-sm text-[#434654] leading-relaxed whitespace-pre-line">{selectedMessage.message}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-between bg-gray-50">
                            <button onClick={() => handleOpenReply(selectedMessage)}
                                className="bg-[#138C9F] text-white px-6 py-2 rounded-lg font-['Cairo'] font-bold text-sm flex items-center gap-2 hover:bg-[#117a8c] transition-colors">
                                <FiCornerUpLeft size={16} /><span>الرد الآن</span>
                            </button>
                            <button onClick={() => handleDeleteMessage(selectedMessage.id)}
                                className="border border-[#BA1A1A] text-[#BA1A1A] px-4 py-2 rounded-lg font-['Cairo'] font-bold text-sm flex items-center gap-2 hover:bg-[#BA1A1A]/5 transition-colors">
                                <FiTrash2 size={16} /><span>حذف</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isReplyOpen && selectedMessage && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSendReply} className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-['Cairo'] font-bold text-lg text-[#0B1C30]">رد سريع</h3>
                            <button type="button" onClick={() => setIsReplyOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-[#138C9F] font-bold font-['Cairo'] text-sm">
                                    {selectedMessage.fullName.split(' ').map(n => n[0]).join(' ')}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-['Cairo'] font-medium">إلى:</p>
                                    <h4 className="font-['Cairo'] font-bold text-[#138C9F] text-sm">{selectedMessage.fullName}</h4>
                                    <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <textarea required rows={6} value={replyText} onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="اكتب ردك هنا..."
                                    className="w-full border border-gray-200 rounded-xl p-4 font-['Cairo'] text-sm text-[#0B1C30] focus:outline-none focus:border-[#138C9F] bg-[#ecf8fa] resize-none" />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                            <button type="button" onClick={() => setIsReplyOpen(false)}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-600 font-['Cairo'] font-semibold text-sm hover:bg-gray-100 transition-colors">إلغاء</button>
                            <button type="submit"
                                className="bg-[#138C9F] text-white px-6 py-2 rounded-lg font-['Cairo'] font-bold text-sm flex items-center gap-2 hover:bg-[#117a8c] transition-colors">
                                <FiSend size={14} /><span>إرسال الرد</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
