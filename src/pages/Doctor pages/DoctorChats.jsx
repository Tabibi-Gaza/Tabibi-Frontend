import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSend, FiArrowRight } from 'react-icons/fi';
import { Send, Loader2, MessageSquare, Paperclip, FileText, X, Trash2, Pin } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useInboxQuery,
  useMessagesQuery,
  useSendMessage,
  useMarkAsRead,
  useUploadChatFile,
  useDeleteConversation,
} from '../../queries/chat/chatQueries';
import { resolveImageUrl } from '../../utils/imageUrl';

const FILES_BASE = import.meta.env.VITE_Files_URL || '';

export default function DoctorChats() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const { data: inbox, isLoading: inboxLoading } = useInboxQuery();
  const { data: messagesData, isLoading: messagesLoading } = useMessagesQuery(activeConversationId);
  const sendMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const uploadMutation = useUploadChatFile();
  const deleteMutation = useDeleteConversation();

  const conversations = inbox || [];
  const messages = messagesData?.items || messagesData || [];
  const activeConversation = conversations.find(c => c.conversationId === activeConversationId);

  const filteredConversations = conversations.filter(c =>
    c.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
    }
  }, [messages, activeConversationId]);

  useEffect(() => {
    if (activeConversationId) markAsReadMutation.mutate(activeConversationId);
  }, [activeConversationId]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeConversationId) return;
    if (!newMessage.trim() && !selectedFile) return;

    let filePath = null;
    let fileType = null;

    if (selectedFile) {
      try {
        filePath = await uploadMutation.mutateAsync(selectedFile);
        fileType = selectedFile.type.startsWith('image/') ? 'image' : 'document';
      } catch (err) {
        return;
      }
    }

    sendMutation.mutate({
      conversationId: activeConversationId,
      content: newMessage.trim() || (fileType === 'image' ? 'صورة' : 'مستند'),
      filePath,
      fileType,
    });
    setNewMessage('');
    clearFile();
  };

  const handleSelectChat = (id) => {
    setActiveConversationId(id);
    setShowChatList(false);
  };

  const handleDeleteConversation = (e, conv) => {
    e.stopPropagation();
    if (conv.isAdmin) {
      toast.error('لا يمكنك حذف محادثة الأدمن');
      return;
    }
    setDeleteConfirmId(conv.conversationId);
    setDeleteConfirmName(conv.participantName || 'هذه المحادثة');
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success('تم حذف المحادثة بنجاح');
        if (activeConversationId === deleteConfirmId) {
          setActiveConversationId(null);
        }
        setDeleteConfirmId(null);
        setDeleteConfirmName('');
      },
      onError: () => {
        toast.error('فشل حذف المحادثة');
        setDeleteConfirmId(null);
      },
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return date.toLocaleDateString('ar-EG', { weekday: 'long' });
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
  };

  const renderMessageContent = (msg) => {
    if (msg.filePath && msg.fileType === 'image') {
      return (
        <img
          loading="lazy"
          decoding="async"
          width="250"
          height="250"
          src={resolveImageUrl(msg.filePath)}
          alt="صورة"
          className="max-w-[250px] max-h-[250px] rounded-lg object-cover cursor-pointer"
          onClick={() => window.open(resolveImageUrl(msg.filePath), '_blank')}
        />
      );
    }
    if (msg.filePath && msg.fileType === 'document') {
      return (
        <a href={resolveImageUrl(msg.filePath)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
          <FileText className="w-4 h-4" />
          <span>{msg.content || 'مستند'}</span>
        </a>
      );
    }
    return <p className="leading-relaxed break-words">{msg.content}</p>;
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #c7d2d8; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #9fb0b8; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #c7d2d8 transparent; }
      `}</style>
      <div className="w-full pr-4 bg-slate-50/30 flex justify-center items-start" dir="rtl">
        <div className="w-full bg-white border border-[#e9eff6] rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-[1.2fr_2.5fr] min-h-[600px] h-[calc(100vh-180px)] md:h-[700px] overflow-hidden">

          {/* Sidebar */}
          <div className={`flex flex-col min-h-0 bg-white border-l border-[#e9eff6] h-full ${showChatList ? 'flex' : 'hidden md:flex'}`}>
            <div className="p-4 border-b border-[#e9eff6] shrink-0">
              <h2 className="text-xl md:text-2xl font-black text-[#1b8b99] mb-3">المحـادثات</h2>
              <div className="relative flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-11">
                <FiSearch className="w-5 h-5 text-gray-400 pointer-events-none shrink-0" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث في المحادثات..." className="w-full bg-transparent border-none outline-none text-sm text-gray-700 pr-2 h-full text-right" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
              {inboxLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#1b8b99] animate-spin" /></div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversationId === conv.conversationId;
                  return (
                    <div key={conv.conversationId} onClick={() => handleSelectChat(conv.conversationId)} className={`group p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 ${isSelected ? 'bg-slate-100/80 border-r-4 border-r-[#1b8b99]' : 'hover:bg-slate-50/50'}`}>
                      <div className="relative shrink-0">
                        {conv.participantImageUrl ? (
                            <img loading="lazy" decoding="async" width="48" height="48" className="w-11 h-11 md:w-12 h-12 rounded-full object-cover border border-gray-100" src={resolveImageUrl(conv.participantImageUrl)} alt={conv.participantName} />
                        ) : (
                          <div className="w-11 h-11 md:w-12 h-12 rounded-full bg-[#1b8b99]/10 text-[#1b8b99] font-extrabold flex items-center justify-center text-sm md:text-base">{getInitials(conv.participantName)}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {conv.isPinned && <Pin className="w-3 h-3 text-[#1b8b99] shrink-0" />}
                            <h4 className="font-bold text-gray-800 text-sm truncate">{conv.participantName || 'مستخدم'}</h4>
                            {conv.isAdmin && <span className="text-[9px] font-bold text-[#1b8b99] bg-[#1b8b99]/10 px-1.5 py-0.5 rounded-full shrink-0">Admin</span>}
                          </div>
                          <span className="text-[10px] md:text-[11px] text-gray-400 shrink-0">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage || 'لا توجد رسائل بعد'}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-[#1b8b99] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                        )}
                        {!conv.isAdmin && (
                          <button
                            onClick={(e) => handleDeleteConversation(e, conv)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all duration-200"
                            title="حذف المحادثة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-gray-400">
                  <MessageSquare className="w-10 h-10 mb-2" />
                  <p className="text-sm font-bold">{searchQuery ? 'لا توجد نتائج' : 'لا توجد محادثات'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex flex-col min-h-0 bg-white custom-scrollbar h-full ${!showChatList ? 'flex' : 'hidden md:flex'}`}>
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-[#e9eff6] flex items-center justify-between bg-white shadow-2xs shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowChatList(true)} className="md:hidden p-1 text-gray-500 hover:text-[#1b8b99] transition-colors">
                      <FiArrowRight className="w-6 h-6" />
                    </button>
                    <div className="relative">
                      {activeConversation.participantImageUrl ? (
                            <img loading="lazy" decoding="async" width="44" height="44" className="w-10 h-10 md:w-11 h-11 rounded-full object-cover border border-gray-100" src={resolveImageUrl(activeConversation.participantImageUrl)} alt={activeConversation.participantName} />
                      ) : (
                        <div className="w-10 h-10 md:w-11 h-11 rounded-full bg-[#1b8b99]/10 text-[#1b8b99] font-bold flex items-center justify-center text-sm md:text-base">{getInitials(activeConversation.participantName)}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        {activeConversation.isPinned && <Pin className="w-3.5 h-3.5 text-[#1b8b99]" />}
                        <h3 className="font-extrabold text-gray-800 text-sm md:text-base">{activeConversation.participantName || 'مستخدم'}</h3>
                        {activeConversation.isAdmin && <span className="text-[10px] font-bold text-[#1b8b99] bg-[#1b8b99]/10 px-2 py-0.5 rounded-full">Admin</span>}
                      </div>
                      {activeConversation.participantSpecialty && <p className="text-[10px] md:text-[11px] font-bold text-gray-400">{activeConversation.participantSpecialty}</p>}
                    </div>
                  </div>
                </div>

                <div ref={messagesContainerRef} className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto custom-scrollbar bg-slate-50/40 flex flex-col gap-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#1b8b99] animate-spin" /></div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <MessageSquare className="w-10 h-10 mb-2" />
                      <span className="text-sm font-bold">ابدأ المحادثة</span>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex w-full ${msg.isMine ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] py-2.5 px-4 md:px-5 rounded-2xl text-sm font-semibold shadow-2xs ${msg.isMine ? 'bg-[#1b8b99] text-white rounded-br-none text-right' : 'bg-white border border-[#e9eff6] text-gray-800 rounded-bl-none text-right'}`}>
                          {renderMessageContent(msg)}
                          <span className={`block text-[10px] mt-1 text-left ${msg.isMine ? 'text-cyan-100' : 'text-gray-400'}`}>
                            {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedFile && (
                  <div className="px-4 py-2 border-t border-[#e9eff6] bg-slate-50 flex items-center gap-3">
                    {filePreview ? <img loading="lazy" decoding="async" width="48" height="48" src={filePreview} alt="معاينة" className="w-12 h-12 rounded-lg object-cover" /> : <FileText className="w-8 h-8 text-[#1b8b99]" />}
                    <span className="text-xs text-gray-600 truncate flex-1">{selectedFile.name}</span>
                    <button onClick={clearFile} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t sticky border-[#e9eff6] bg-white shrink-0">
                  <div className="flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-12 md:h-14 gap-2 md:gap-3 focus-within:border-[#1b8b99] focus-within:bg-white transition-all">
                    <button type="submit" disabled={sendMutation.isPending || uploadMutation.isPending || (!newMessage.trim() && !selectedFile)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#138C9F] flex items-center justify-center text-white hover:bg-[#107585] transition-colors cursor-pointer shrink-0 disabled:opacity-50">
                      {sendMutation.isPending || uploadMutation.isPending ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiSend className="w-4 h-4 md:w-5 md:h-5 transform rotate-180" />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-[#1b8b99] transition-colors cursor-pointer shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب رسالتك هنا..." className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 h-full text-right" />
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm font-medium">يُرجى تحديد محادثة من القائمة الجانبية لبدء المحادثة.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800 mb-2">حذف المحادثة</h3>
              <p className="text-sm text-gray-500">هل أنت متأكد من حذف محادثة {deleteConfirmName}؟ سيتم حذف جميع الرسائل نهائياً.</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(''); }}
                className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-r border-gray-100 disabled:opacity-50"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
