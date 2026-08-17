import axiosInstance from "../api/axiosInstance";

export const getNotifications = async (params = {}) => {
  const { data } = await axiosInstance.get("/notifications", { params });
  return data;
};

export const getNotificationsPaged = async (params = {}) => {
  const { data } = await axiosInstance.get("/notifications/paged", { params });
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await axiosInstance.get("/notifications/unread-count");
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await axiosInstance.put(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await axiosInstance.put("/notifications/read-all");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await axiosInstance.delete(`/notifications/${id}`);
  return data;
};