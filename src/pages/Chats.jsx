import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSearch, FiSend, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { Send, Loader2, MessageSquare, Paperclip, FileText, X, Trash2, Pin, Reply, CornerUpRight } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useInboxQuery,
  useMessagesQuery,
  useSendMessage,
  useMarkAsRead,
  useUploadChatFile,
  useDeleteConversation,
  useCreateConversation,
  useDeleteMessage,
} from '../queries/chat/chatQueries';

const FILES_BASE = import.meta.env.VITE_Files_URL || '';
const SWIPE_THRESHOLD = 80;

export default function Chats() {
  const location = useLocation();
  const doctorIdFromNav = location.state?.doctorId;

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showChatList, setShowChatList] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [swipedMsgId, setSwipedMsgId] = useState(null);
  const [deleteMsgConfirmId, setDeleteMsgConfirmId] = useState(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const swipeStartRef = useRef({});

  const { data: inbox, isLoading: inboxLoading } = useInboxQuery();
  const { data: messagesData, isLoading: messagesLoading } = useMessagesQuery(activeConversationId);
  const sendMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const uploadMutation = useUploadChatFile();
  const deleteMutation = useDeleteConversation();
  const createConversationMutation = useCreateConversation();
  const deleteMessageMutation = useDeleteMessage();

  const conversations = inbox || [];
  const messages = messagesData?.items || messagesData || [];
  const activeConversation = conversations.find(c => c.conversationId === activeConversationId);

  const filteredConversations = conversations.filter(c =>
    c.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!doctorIdFromNav) return;
    if (inboxLoading) return;
    if (conversations.length > 0) {
      const existingConv = conversations.find(c => c.participantUserId === doctorIdFromNav);
      if (existingConv) {
        setActiveConversationId(existingConv.conversationId);
        setShowChatList(false);
        return;
      }
    }
    if (!createConversationMutation.isPending && !createConversationMutation.isSuccess) {
      createConversationMutation.mutate(
        { participantIds: [doctorIdFromNav], title: null },
        {
          onSuccess: (res) => {
            if (res.succeeded && res.data) {
              setActiveConversationId(res.data);
              setShowChatList(false);
            }
          },
          onError: () => {
            toast.error('فشل إنشاء المحادثة');
          },
        }
      );
    }
  }, [doctorIdFromNav, conversations, inboxLoading]);

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
        toast.error('فشل رفع الملف');
        return;
      }
    }

    sendMutation.mutate({
      conversationId: activeConversationId,
      content: newMessage.trim() || (fileType === 'image' ? 'صورة' : 'مستند'),
      filePath,
      fileType,
      replyToMessageId: replyTo?.id || null,
      replyToContent: replyTo?.content || null,
    });
    setNewMessage('');
    setReplyTo(null);
    clearFile();
  };

  const handleSelectChat = (id) => {
    setActiveConversationId(id);
    setShowChatList(false);
    setReplyTo(null);
    setSwipedMsgId(null);
  };

  const handleDeleteConversation = (e, conv) => {
    e.stopPropagation();
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

  const confirmDeleteMessage = () => {
    if (!deleteMsgConfirmId) return;
    deleteMessageMutation.mutate(deleteMsgConfirmId, {
      onSuccess: () => {
        toast.success('تم حذف الرسالة');
        setDeleteMsgConfirmId(null);
        setSwipedMsgId(null);
      },
      onError: () => {
        toast.error('فشل حذف الرسالة');
        setDeleteMsgConfirmId(null);
      },
    });
  };

  const handleTouchStart = useCallback((e, msg) => {
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY, msgId: msg.id };
  }, []);

  const handleTouchEnd = useCallback((e, msg) => {
    const start = swipeStartRef.current;
    if (!start || start.msgId !== msg.id) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = Math.abs(touch.clientY - start.y);

    if (dy > 50) { setSwipedMsgId(null); return; }

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) {
        setSwipedMsgId(null);
        setDeleteMsgConfirmId(msg.id);
      } else {
        setReplyTo({ id: msg.id, content: msg.content, sender: msg.isMine ? 'أنت' : activeConversation?.participantName });
        setSwipedMsgId(null);
      }
    } else {
      setSwipedMsgId(null);
    }
    swipeStartRef.current = {};
  }, [activeConversation]);

  const handleMouseDown = useCallback((e, msg) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY, msgId: msg.id, isDragging: true };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!swipeStartRef.current.isDragging) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const msgId = swipeStartRef.current.msgId;
    if (Math.abs(dx) > 30) {
      setSwipedMsgId(dx < 0 ? `left-${msgId}` : `right-${msgId}`);
    }
  }, []);

  const handleMouseUp = useCallback((e) => {
    const start = swipeStartRef.current;
    if (!start.isDragging) return;
    const dx = e.clientX - start.x;
    const dy = Math.abs(e.clientY - start.y);

    if (dy > 50) { setSwipedMsgId(null); swipeStartRef.current = {}; return; }

    if (dx < -SWIPE_THRESHOLD) {
      setDeleteMsgConfirmId(start.msgId);
      setSwipedMsgId(null);
    } else if (dx > SWIPE_THRESHOLD) {
      const msg = messages.find(m => m.id === start.msgId);
      if (msg) {
        setReplyTo({ id: msg.id, content: msg.content, sender: msg.isMine ? 'أنت' : activeConversation?.participantName });
      }
      setSwipedMsgId(null);
    } else {
      setSwipedMsgId(null);
    }
    swipeStartRef.current = {};
  }, [messages, activeConversation]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (swipeStartRef.current.isDragging) {
        swipeStartRef.current = {};
        setSwipedMsgId(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

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
          src={`${FILES_BASE}/${msg.filePath}`}
          alt="صورة"
          className="max-w-[250px] max-h-[250px] rounded-lg object-cover cursor-pointer"
          onClick={() => window.open(`${FILES_BASE}/${msg.filePath}`, '_blank')}
        />
      );
    }
    if (msg.filePath && msg.fileType === 'document') {
      return (
        <a href={`${FILES_BASE}/${msg.filePath}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
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
        .msg-swipe { transition: transform 0.15s ease; touch-action: pan-y; user-select: none; }
      `}</style>
      <div className="w-full pt-16 px-3 pb-20 font-['Cairo'] bg-slate-50/30 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-5xl bg-white border border-[#e9eff6] rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-[1.2fr_2.5fr] h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] overflow-hidden relative">

          {/* Sidebar: drawer transition using translate3d */}
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
                          <img className="w-11 h-11 md:w-12 h-12 rounded-full object-cover border border-gray-100" src={`${FILES_BASE}/${conv.participantImageUrl}`} alt={conv.participantName} />
                        ) : (
                          <div className="w-11 h-11 md:w-12 h-12 rounded-full bg-[#1b8b99]/10 text-[#1b8b99] font-extrabold flex items-center justify-center text-sm md:text-base">{getInitials(conv.participantName)}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {conv.isPinned && <Pin className="w-3 h-3 text-[#1b8b99] shrink-0" />}
                            <h4 className="font-bold text-gray-800 text-sm truncate">{conv.participantName || 'مستخدم'}</h4>
                          </div>
                          <span className="text-[10px] md:text-[11px] text-gray-400 shrink-0">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage || 'لا توجد رسائل بعد'}</p>
                      </div>
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-[#1b8b99] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                        )}
                        <button
                          onClick={(e) => handleDeleteConversation(e, conv)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all duration-200"
                          title="حذف المحادثة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                        <img className="w-10 h-10 md:w-11 h-11 rounded-full object-cover border border-gray-100" src={`${FILES_BASE}/${activeConversation.participantImageUrl}`} alt={activeConversation.participantName} />
                      ) : (
                        <div className="w-10 h-10 md:w-11 h-11 rounded-full bg-[#1b8b99]/10 text-[#1b8b99] font-bold flex items-center justify-center text-sm md:text-base">{getInitials(activeConversation.participantName)}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        {activeConversation.isPinned && <Pin className="w-3.5 h-3.5 text-[#1b8b99]" />}
                        <h3 className="font-extrabold text-gray-800 text-sm md:text-base">{activeConversation.participantName || 'مستخدم'}</h3>
                      </div>
                      {activeConversation.participantSpecialty && <p className="text-[10px] md:text-[11px] font-bold text-gray-400">{activeConversation.participantSpecialty}</p>}
                    </div>
                  </div>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto custom-scrollbar bg-slate-50/40 flex flex-col gap-4 pb-24"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                >
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#1b8b99] animate-spin" /></div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <MessageSquare className="w-10 h-10 mb-2" />
                      <span className="text-sm font-bold">ابدأ المحادثة</span>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const swipeState = swipedMsgId === `left-${msg.id}` ? 'left' : swipedMsgId === `right-${msg.id}` ? 'right' : null;
                      return (
                        <div key={msg.id} className={`flex w-full ${msg.isMine ? 'justify-start' : 'justify-end'}`}>
                          <div
                            className={`msg-swipe relative max-w-full max-w-md flex-shrink-0 ${msg.isMine ? '' : ''}`}
                            style={{ transform: swipeState === 'left' ? 'translateX(-60px)' : swipeState === 'right' ? 'translateX(60px)' : 'translateX(0)' }}
                            onTouchStart={(e) => handleTouchStart(e, msg)}
                            onTouchEnd={(e) => handleTouchEnd(e, msg)}
                            onMouseDown={(e) => handleMouseDown(e, msg)}
                          >
                            {/* Swipe action indicators */}
                            {swipeState === 'left' && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[70px] bg-red-500 text-white p-2 rounded-full z-10">
                                <Trash2 className="w-4 h-4" />
                              </div>
                            )}
                            {swipeState === 'right' && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[70px] bg-[#1b8b99] text-white p-2 rounded-full z-10">
                                <CornerUpRight className="w-4 h-4" />
                              </div>
                            )}

                            <div className={`py-2.5 px-4 md:px-5 rounded-2xl text-sm font-semibold shadow-2xs ${msg.isMine ? 'bg-[#1b8b99] text-white rounded-br-none text-right' : 'bg-white border border-[#e9eff6] text-gray-800 rounded-bl-none text-right'}`}>
                              {msg.replyToContent && (
                                <div className={`mb-2 px-3 py-1.5 rounded-lg text-xs border-r-2 ${msg.isMine ? 'bg-white/20 border-white/50' : 'bg-gray-50 border-[#1b8b99]'}`}>
                                  <p className={`font-bold text-[10px] mb-0.5 ${msg.isMine ? 'text-white/80' : 'text-[#1b8b99]'}`}>{msg.replyToSender || 'رسالة'}</p>
                                  <p className={`truncate ${msg.isMine ? 'text-white/70' : 'text-gray-500'}`}>{msg.replyToContent}</p>
                                </div>
                              )}
                              {renderMessageContent(msg)}
                              <span className={`block text-[10px] mt-1 text-left ${msg.isMine ? 'text-cyan-100' : 'text-gray-400'}`}>
                                {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedFile && (
                  <div className="px-4 py-2 border-t border-[#e9eff6] bg-slate-50 flex items-center gap-3">
                    {filePreview ? <img src={filePreview} alt="معاينة" className="w-12 h-12 rounded-lg object-cover" /> : <FileText className="w-8 h-8 text-[#1b8b99]" />}
                    <span className="text-xs text-gray-600 truncate flex-1">{selectedFile.name}</span>
                    <button onClick={clearFile} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                )}

                {replyTo && (
                  <div className="px-4 py-2 border-t border-[#e9eff6] bg-[#1b8b99]/5 flex items-center gap-3">
                    <CornerUpRight className="w-4 h-4 text-[#1b8b99] shrink-0" />
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-[10px] font-bold text-[#1b8b99]">{replyTo.sender}</p>
                      <p className="text-xs text-gray-500 truncate">{replyTo.content}</p>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-red-500 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t pb-20 sticky border-[#e9eff6] bg-white shrink-0">
                  <div className="flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-12 md:h-14 gap-2 md:gap-3 focus-within:border-[#1b8b99] focus-within:bg-white transition-all max-w-full">
                    <button type="submit" disabled={sendMutation.isPending || uploadMutation.isPending || (!newMessage.trim() && !selectedFile)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#138C9F] flex items-center justify-center text-white hover:bg-[#107585] transition-colors cursor-pointer shrink-0 disabled:opacity-50">
                      {sendMutation.isPending || uploadMutation.isPending ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <FiSend className="w-4 h-4 md:w-5 md:h-5" />}
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
                <div className="w-16 h-16 rounded-full bg-[#1b8b99]/10 flex items-center justify-center text-[#1b8b99] mb-4">
                  <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
                  نحن هنا لتوفير أفضل رعاية طبية لك، ابحث عن الطبيب المناسب لبدء الاستشارة الطبية فوراً.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Conversation Confirmation Modal */}
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

      {/* Delete Message Confirmation Modal */}
      {deleteMsgConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-[18px] font-bold text-gray-800 mb-2">حذف الرسالة</h3>
              <p className="text-sm text-gray-500">هل أنت متأكد من حذف هذه الرسالة نهائياً؟</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => setDeleteMsgConfirmId(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDeleteMessage}
                disabled={deleteMessageMutation.isPending}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-r border-gray-100 disabled:opacity-50"
              >
                {deleteMessageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
