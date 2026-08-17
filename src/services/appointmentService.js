import axiosInstance from "../api/axiosInstance";

export const initiateBooking = async (bookingData) => {
  const { data } = await axiosInstance.post("/patient/appointments/initiate-booking", bookingData);
  return data;
};

export const submitReceipt = async (receiptData) => {
  const { data } = await axiosInstance.post("/patient/appointments/submit-receipt", receiptData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const cancelAppointment = async (appointmentId) => {
  const { data } = await axiosInstance.post("/patient/appointments/cancel", { appointmentId });
  return data;
};

export const rescheduleAppointment = async (appointmentData) => {
  const { data } = await axiosInstance.post("/patient/appointments/reschedule", appointmentData);
  return data;
};

export const getMyAppointments = async () => {
  const { data } = await axiosInstance.get("/patient/appointments");
  return data;
};

export const getUpcomingAppointments = async () => {
  const { data } = await axiosInstance.get("/patient/appointments/upcoming");
  return data;
};

export const getAppointmentHistory = async () => {
  const { data } = await axiosInstance.get("/patient/appointments/history");
  return data;
};

export const getAppointmentDetails = async (id) => {
  const { data } = await axiosInstance.get(`/patient/appointments/${id}`);
  return data;
};

export const getDoctorCalendarSlots = async (doctorId) => {
  const { data } = await axiosInstance.get(`/booking/doctor/${doctorId}/calendar-slots`);
  return data;
};