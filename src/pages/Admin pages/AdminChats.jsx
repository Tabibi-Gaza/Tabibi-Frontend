import React, { useState, useEffect, useRef } from "react";
import { Send, Search, ArrowRight, Loader2, MessageSquare, UserPlus, X, Paperclip, Image, FileText, Trash2, Pin } from "lucide-react";
import { toast } from "react-toastify";
import {
  useInboxQuery,
  useMessagesQuery,
  useSendMessage,
  useMarkAsRead,
  useCreateConversation,
  useUploadChatFile,
  useDeleteConversation,
} from "../../queries/chat/chatQueries";
import { useDoctorsQuery } from "../../queries/doctors/doctorQueries";

const FILES_BASE = import.meta.env.VITE_Files_URL || "";

export default function AdminChats() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [newChatDoctor, setNewChatDoctor] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: inbox, isLoading: inboxLoading, refetch: refetchInbox } = useInboxQuery();
  const { data: messagesData, isLoading: messagesLoading } = useMessagesQuery(activeConversationId);
  const sendMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const createConversationMutation = useCreateConversation();
  const uploadMutation = useUploadChatFile();
  const deleteMutation = useDeleteConversation();
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctorsQuery({
    Search: doctorSearchQuery || undefined,
    PageSize: 20,
  });

  const conversations = inbox || [];
  const messages = messagesData?.items || messagesData || [];
  const doctors = doctorsData?.items || [];

  const activeConversation = conversations.find(
    (c) => c.conversationId === activeConversationId
  ) || (activeConversationId && newChatDoctor
    ? { conversationId: activeConversationId, participantName: newChatDoctor.fullName, participantImageUrl: newChatDoctor.profileImageUrl, participantSpecialty: newChatDoctor.specializationName }
    : null
  );

  const filteredConversations = conversations.filter((c) =>
    c.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeConversationId) {
      markAsReadMutation.mutate(activeConversationId);
    }
  }, [activeConversationId]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        fileType = selectedFile.type.startsWith("image/") ? "image" : "document";
      } catch (err) {
        toast.error("فشل رفع الملف");
        return;
      }
    }

    sendMutation.mutate({
      conversationId: activeConversationId,
      content: newMessage.trim() || (fileType === "image" ? "صورة" : "مستند"),
      filePath,
      fileType,
    });
    setNewMessage("");
    clearFile();
  };

  const handleSelectChat = (conversationId) => {
    setActiveConversationId(conversationId);
    setShowChatOnMobile(true);
  };

  const handleStartChatWithDoctor = async (doctor) => {
    const existingConv = conversations.find(
      (c) => c.participantName === doctor.fullName
    );

    if (existingConv) {
      setNewChatDoctor(null);
      setActiveConversationId(existingConv.conversationId);
      setShowNewChatModal(false);
      setDoctorSearchQuery("");
      setShowChatOnMobile(true);
      return;
    }

    try {
      const userId = doctor.userId;
      if (!userId) {
        toast.error("معرف المستخدم غير موجود");
        return;
      }

      setNewChatDoctor(doctor);

      const result = await createConversationMutation.mutateAsync({
        participantIds: [userId],
        title: null,
      });

      if (result.succeeded && result.data) {
        setActiveConversationId(result.data);
        setShowNewChatModal(false);
        setDoctorSearchQuery("");
        setShowChatOnMobile(true);
      } else {
        setNewChatDoctor(null);
        toast.error(result.errors?.[0]?.message || "فشل إنشاء المحادثة");
      }
    } catch (error) {
      setNewChatDoctor(null);
      toast.error(error.response?.data?.errors?.[0]?.message || "حدث خطأ");
    }
  };

  const handleDeleteConversation = (e, conv) => {
    e.stopPropagation();
    setDeleteConfirmId(conv.conversationId);
    setDeleteConfirmName(conv.participantName || "هذه المحادثة");
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success("تم حذف المحادثة بنجاح");
        if (activeConversationId === deleteConfirmId) {
          setActiveConversationId(null);
        }
        setDeleteConfirmId(null);
        setDeleteConfirmName("");
      },
      onError: () => {
        toast.error("فشل حذف المحادثة");
        setDeleteConfirmId(null);
      },
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return date.toLocaleDateString("ar-EG", { weekday: "long" });
    return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  };

  const renderMessageContent = (msg) => {
    if (msg.filePath && msg.fileType === "image") {
      return (
        <img
          loading="lazy"
          src={`${FILES_BASE}/${msg.filePath}`}
          alt="صورة"
          className="max-w-[250px] max-h-[250px] rounded-lg object-cover cursor-pointer"
          onClick={() => window.open(`${FILES_BASE}/${msg.filePath}`, "_blank")}
        />
      );
    }
    if (msg.filePath && msg.fileType === "document") {
      return (
        <a
          href={`${FILES_BASE}/${msg.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 underline"
        >
          <FileText className="w-4 h-4" />
          <span>{msg.content || "مستند"}</span>
        </a>
      );
    }
    return <p className="leading-relaxed text-right">{msg.content}</p>;
  };

  return (
    <div
      className="w-full flex font-['Cairo'] flex flex-col items-start p-0 relative text-right"
      dir="rtl"
    >
      <div className="w-full flex-1 p-2 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-4 md:gap-6">
        {/* Sidebar */}
        <div className={`bg-white border border-[#e9eff6] rounded-2xl shadow-sm flex flex-col overflow-hidden h-full ${showChatOnMobile ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 flex flex-col gap-3 border-b border-[#e9eff6]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-extrabold text-[#138C9F] text-right">المحادثات</h2>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="w-9 h-9 bg-[#138C9F] text-white rounded-full flex items-center justify-center hover:bg-[#0f7282] transition-colors"
                title="محادثة جديدة"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-10">
              <Search className="w-4 h-4 text-gray-400 pointer-events-none shrink-0 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="w-full bg-transparent border-none outline-none text-xs text-gray-700 h-full text-right"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {inboxLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#138C9F] animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <MessageSquare className="w-10 h-10 mb-2" />
                <span className="text-sm font-bold">{searchQuery ? "لا توجد نتائج" : "لا توجد محادثات"}</span>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversationId === conv.conversationId;
                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => handleSelectChat(conv.conversationId)}
                    className={`group p-4 flex items-start justify-between border-b border-gray-50 cursor-pointer transition-all duration-200 ${isSelected ? "bg-[#e2f4f7] md:border-r-4 md:border-r-[#138C9F]" : "hover:bg-slate-50/50"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0 text-right">
                      <div className="relative shrink-0">
                        {conv.participantImageUrl ? (
                          <img loading="lazy" className="w-11 h-11 rounded-full object-cover border border-gray-100" src={`${FILES_BASE}/${conv.participantImageUrl}`} alt={conv.participantName} />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#138C9F]/10 text-[#138C9F] font-bold flex items-center justify-center text-sm">{getInitials(conv.participantName)}</div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          {conv.isPinned && <Pin className="w-3 h-3 text-[#138C9F] shrink-0" />}
                          <h4 className="font-bold text-gray-800 text-sm truncate">{conv.participantName || "مستخدم"}</h4>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{conv.participantSpecialty || ""}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5 max-w-[180px]">{conv.lastMessage || "لا توجد رسائل"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 font-semibold">{formatTime(conv.lastMessageTime)}</span>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-[#138C9F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unreadCount}</span>
                      )}
                      <button
                        onClick={(e) => handleDeleteConversation(e, conv)}
                        className="opacity-0 group-hover:opacity-100 mt-1 p-1 text-gray-300 hover:text-red-500 transition-all duration-200"
                        title="حذف المحادثة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`bg-white border border-[#e9eff6] rounded-2xl shadow-sm flex flex-col overflow-hidden h-full ${!showChatOnMobile ? "hidden md:flex" : "flex"}`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-[#e9eff6] flex items-center justify-between bg-white shrink-0">
                <button onClick={() => setShowChatOnMobile(false)} className="block md:hidden p-2 text-gray-500 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 text-right ml-auto">
                  <div className="relative">
                    {activeConversation.participantImageUrl ? (
                       <img loading="lazy" className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border border-gray-100" src={`${FILES_BASE}/${activeConversation.participantImageUrl}`} alt={activeConversation.participantName} />
                    ) : (
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#138C9F]/10 text-[#138C9F] font-bold flex items-center justify-center text-sm md:text-base">{getInitials(activeConversation.participantName)}</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-gray-800 text-sm md:text-base">{activeConversation.participantName || "مستخدم"}</h3>
                    {activeConversation.participantSpecialty && <span className="text-xs text-gray-400">{activeConversation.participantSpecialty}</span>}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-slate-50/30 flex flex-col gap-4 pb-24">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#138C9F] animate-spin" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <MessageSquare className="w-10 h-10 mb-2" />
                    <span className="text-sm font-bold">ابدأ المحادثة</span>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMine ? "justify-start" : "justify-end"}`}>
                      <div className={`py-2.5 px-4 md:py-3 md:px-5 rounded-2xl text-sm md:text-[14px] font-medium ${msg.isMine ? "bg-[#0052cc] text-white rounded-br-none" : "bg-[#e5eeff] text-gray-800 rounded-bl-none"}`}>
                        {renderMessageContent(msg)}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File Preview */}
              {selectedFile && (
                <div className="px-4 py-2 border-t border-[#e9eff6] bg-slate-50 flex items-center gap-3">
                  {filePreview ? (
                    <img loading="lazy" src={filePreview} alt="معاينة" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <FileText className="w-8 h-8 text-[#138C9F]" />
                  )}
                  <span className="text-xs text-gray-600 truncate flex-1">{selectedFile.name}</span>
                  <button onClick={clearFile} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* Input */}
<form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t pb-20 border-[#e9eff6] bg-white shrink-0 max-w-full">
                  <div className="flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-12 md:h-14 gap-2 md:gap-3 focus-within:border-[#138C9F] transition-colors">
                  <button type="submit" disabled={sendMutation.isPending || uploadMutation.isPending || (!newMessage.trim() && !selectedFile)} className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center text-white hover:bg-[#0041a3] transition-colors cursor-pointer shrink-0 disabled:opacity-50">
                    {sendMutation.isPending || uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-[#138C9F] transition-colors cursor-pointer shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 h-full text-right"
                    dir="rtl"
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold gap-3">
              <MessageSquare className="w-12 h-12" />
              <span>الرجاء تحديد محادثة للبدء في العرض</span>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[calc(100%-2rem)] sm:max-w-[500px] rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[#e9eff6] flex items-center justify-between shrink-0">
              <h3 className="text-[18px] font-bold text-[#0B1C30]">محادثة جديدة مع طبيب</h3>
              <button onClick={() => { setShowNewChatModal(false); setDoctorSearchQuery(""); }} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-[#e9eff6] shrink-0">
              <div className="relative flex items-center border border-[#e9eff6] rounded-xl bg-slate-50 px-3 h-10">
                <Search className="w-4 h-4 text-gray-400 pointer-events-none shrink-0 ml-2" />
                <input type="text" value={doctorSearchQuery} onChange={(e) => setDoctorSearchQuery(e.target.value)} placeholder="ابحث عن طبيب بالاسم..." className="w-full bg-transparent border-none outline-none text-sm text-gray-700 h-full text-right" autoFocus />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {doctorsLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#138C9F] animate-spin" /></div>
              ) : doctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400"><span className="text-sm font-bold">لا يوجد أطباء</span></div>
              ) : (
                doctors.map((doc) => {
                  const existingConv = conversations.find((c) => c.participantName === doc.fullName);
                  return (
                    <div key={doc.id} onClick={() => handleStartChatWithDoctor(doc)} className="p-4 flex items-center gap-3 border-b border-gray-50 cursor-pointer hover:bg-slate-50/50 transition-all duration-200">
                      <div className="relative shrink-0">
                        {doc.profileImageUrl ? (
                           <img loading="lazy" className="w-11 h-11 rounded-full object-cover border border-gray-100" src={`${FILES_BASE}/${doc.profileImageUrl}`} alt={doc.fullName} />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#138C9F]/10 text-[#138C9F] font-bold flex items-center justify-center text-sm">{getInitials(doc.fullName)}</div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 text-right">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{doc.fullName}</h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{doc.specializationName || ""}</p>
                      </div>
                      {existingConv && <span className="text-[10px] text-[#138C9F] font-bold bg-[#138C9F]/10 px-2 py-1 rounded-full shrink-0">محادثة موجودة</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

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
                onClick={() => { setDeleteConfirmId(null); setDeleteConfirmName(""); }}
                className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-r border-gray-100 disabled:opacity-50"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
