import axiosInstance from "../api/axiosInstance";

export const getDoctors = async (params = {}) => {
  const response = await axiosInstance.get("/Doctors/get-all-doctors", {
    params,
  });

  return response.data.data;
};
