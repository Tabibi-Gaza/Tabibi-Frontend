import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getInbox,
  getMessages,
  sendMessage,
  markConversationRead,
  getUnreadCount,
  createConversation,
  uploadChatFile,
  deleteConversation,
  deleteMessage,
} from "../../services/chatService";
import { chatKeys } from "./chatKeys";

export const useInboxQuery = () => {
  return useQuery({
    queryKey: chatKeys.inbox(),
    queryFn: getInbox,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useMessagesQuery = (conversationId) => {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 0,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content, filePath, fileType, replyToMessageId, replyToContent }) =>
      sendMessage(conversationId, content, filePath, fileType, replyToMessageId, replyToContent),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox() });
    },
  });
};

export const useUploadChatFile = () => {
  return useMutation({
    mutationFn: uploadChatFile,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markConversationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox() });
    },
  });
};

export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: chatKeys.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 0,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ participantIds, title }) =>
      createConversation(participantIds, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox() });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox() });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.inbox() });
    },
  });
};
