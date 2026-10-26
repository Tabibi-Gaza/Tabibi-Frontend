import axios from "axios";
import i18n from "../i18n";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// تنبيه موحّد لانقطاع الاتصال (بحد أقصى مرة كل 5 ثواني لتفادي الازدحام)
let lastOfflineToastAt = 0;
export const notifyOffline = () => {
  const now = Date.now();
  if (now - lastOfflineToastAt < 5000) return;
  lastOfflineToastAt = now;
  const msg = i18n.language === "en"
    ? "No internet connection — please check your network."
    : "لا يوجد اتصال بالإنترنت — تحقق من شبكتك.";
  toast.error(msg);
};
export const isNetworkError = (error) => !error?.response;

let onAuthFailure = null;
export const setOnAuthFailure = (cb) => { onAuthFailure = cb; };

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          null,
          { withCredentials: true }
        );
        if (data.succeeded && data.data?.accessToken) {
          const newToken = data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        processQueue(error, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (onAuthFailure) onAuthFailure();
        else window.location.href = "/login";
        return Promise.reject(error);
      } catch (refreshError) {
        // انقطاع الاتصال أثناء تجديد الرمز → لا تمسح الجلسة، اجعل الطلب يفشل (سيظهر تنبيه offline)
        if (!refreshError?.response) {
          processQueue(refreshError, null);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (onAuthFailure) onAuthFailure();
        else window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response) {
      // انقطاع الاتصال / timeout — لا تمسح الجلسة، أظهر تنبيهاً موحّداً
      notifyOffline();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;