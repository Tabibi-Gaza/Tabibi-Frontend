import axiosInstance from "../api/axiosInstance";

export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put("/patient/profile/update", profileData);
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await axiosInstance.post("/patient/profile/change-password", passwordData);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete("/patient/profile/delete-my-account");
  return data;
};

export const getMedicalHistory = async () => {
  const { data } = await axiosInstance.get("/patient/medical-history");
  return data;
};

export const updateMedicalHistory = async (historyData) => {
  const { data } = await axiosInstance.put("/patient/medical-history", historyData);
  return data;
};

export const getMedicalRecords = async () => {
  const { data } = await axiosInstance.get("/patient/medical-records");
  return data;
};

export const getTransactions = async () => {
  const { data } = await axiosInstance.get("/patient/transactions");
  return data;
};

export const getMyAppointments = async () => {
  const { data } = await axiosInstance.get("/patient/appointments");
  return data;
};

export const submitDoctorReview = async (reviewData) => {
  const { data } = await axiosInstance.post("/reviews/doctor", reviewData);
  return data;
};

export const getMyReviewForDoctor = async (doctorId) => {
  const { data } = await axiosInstance.get(`/reviews/doctor/${doctorId}/my-review`);
  return data;
};