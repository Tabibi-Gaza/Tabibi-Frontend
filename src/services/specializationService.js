import axiosInstance from "../api/axiosInstance";

export const getSpecializations = async () => {
  const { data } = await axiosInstance.get("/specializations/lookup");
  return data.data;
};

export const getAdminSpecializations = async (params = {}) => {
  const { data } = await axiosInstance.get("/admin/specializations", {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      search: params.search || undefined,
      sortBy: params.sortBy || "Name",
      sortOrder: params.sortOrder || "Asc",
    },
  });
  return data.data;
};

export const createSpecialization = async (name) => {
  const { data } = await axiosInstance.post("/admin/specializations", { name });
  return data;
};

export const updateSpecialization = async ({ id, name }) => {
  const { data } = await axiosInstance.put(`/admin/specializations/${id}`, {
    id,
    name,
  });
  return data;
};

export const deleteSpecialization = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/specializations/${id}`);
  return data;
};

export const toggleSpecializationStatus = async (id) => {
  const { data } = await axiosInstance.post(
    `/admin/specializations/${id}/toggle-activation`
  );
  return data;
};
