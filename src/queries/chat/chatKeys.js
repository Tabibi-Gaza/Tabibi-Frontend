export const chatKeys = {
  all: ["chat"],
  inbox: () => ["chat", "inbox"],
  messages: (conversationId) => ["chat", "messages", conversationId],
  unreadCount: () => ["chat", "unreadCount"],
};
