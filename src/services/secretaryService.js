import axiosInstance from '../api/axiosInstance';

export const secretaryService = {
  // Doctor: Get all secretaries
  getSecretaries: () => axiosInstance.get('/doctor/secretaries'),

  // Doctor: Add secretary by email
  addSecretary: (email, permissions) =>
    axiosInstance.post('/doctor/secretaries', { secretaryEmail: email, permissions }),

  // Doctor: Update permissions
  updatePermissions: (secretaryId, permissions) =>
    axiosInstance.put('/doctor/secretaries/permissions', { secretaryId, permissions }),

  // Doctor: Remove secretary
  removeSecretary: (secretaryId) =>
    axiosInstance.delete(`/doctor/secretaries/${secretaryId}`),

  // Secretary: Get own permissions
  getMyPermissions: () => axiosInstance.get('/secretary/permissions'),
};
