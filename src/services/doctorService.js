import axiosInstance from "../api/axiosInstance";

export const getDoctors = async (params = {}) => {
  const response = await axiosInstance.get("/Doctors/get-all-doctors", {
    params,
  });

  console.log("Doctors API:", response.data);

  return response.data.data;
};
