import axiosInstance from "../api/axiosInstance";

export const createConversation = async (participantIds, title) => {
  const { data } = await axiosInstance.post("/chat/conversations", {
    ParticipantIds: participantIds,
    Title: title || null,
  });
  return data;
};

export const getInbox = async () => {
  const { data } = await axiosInstance.get("/chat/conversations/inbox");
  return data.data;
};

export const getMessages = async (conversationId, page = 1, pageSize = 50) => {
  const { data } = await axiosInstance.get(`/chat/messages/${conversationId}`, {
    params: { page, pageSize },
  });
  return data.data;
};

export const sendMessage = async (conversationId, content, filePath, fileType, replyToMessageId, replyToContent) => {
  const payload = { ConversationId: conversationId, Content: content };
  if (filePath) payload.FilePath = filePath;
  if (fileType) payload.FileType = fileType;
  if (replyToMessageId) payload.ReplyToMessageId = replyToMessageId;
  if (replyToContent) payload.ReplyToContent = replyToContent;
  const { data } = await axiosInstance.post("/chat/messages", payload);
  return data;
};

export const deleteMessage = async (messageId) => {
  const { data } = await axiosInstance.delete(`/chat/messages/${messageId}`);
  return data;
};

export const uploadChatFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/chat/messages/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const markConversationRead = async (conversationId) => {
  const { data } = await axiosInstance.post("/chat/messages/mark-read", {
    ConversationId: conversationId,
  });
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await axiosInstance.get("/chat/meta/unread-count");
  return data.data;
};

export const deleteConversation = async (conversationId) => {
  const { data } = await axiosInstance.delete(`/chat/conversations/${conversationId}`);
  return data;
};
