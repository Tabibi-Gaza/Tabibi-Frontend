import axiosInstance from "../api/axiosInstance";

export const login = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const sendEmailOtp = async (email) => {
  const { data } = await axiosInstance.post("/auth/send-email-otp", { email });
  return data;
};

export const verifyEmailOtp = async (email, code) => {
  const { data } = await axiosInstance.post("/auth/verify-email-otp", { email, code });
  return data;
};

export const resetPassword = async (email, token, newPassword) => {
  const { data } = await axiosInstance.post("/auth/reset-password", { email, token, newPassword });
  return data;
};

export const refresh = async () => {
  const { data } = await axiosInstance.post("/auth/refresh", null, { withCredentials: true });
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post("/auth/logout", null, { withCredentials: true });
  return data;
};
