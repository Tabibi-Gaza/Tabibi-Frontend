import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getSpecializations,
  getAdminSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  toggleSpecializationStatus,
} from "../../services/specializationService";
import { specializationKeys } from "./specializationKeys";

export const useSpecializationsQuery = () => {
  return useQuery({
    queryKey: specializationKeys.list(),
    queryFn: getSpecializations,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useAdminSpecializationsQuery = (params = {}) => {
  return useQuery({
    queryKey: specializationKeys.adminList(params),
    queryFn: () => getAdminSpecializations(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
};

export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSpecialization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.all });
    },
  });
};

export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSpecialization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.all });
    },
  });
};

export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSpecialization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.all });
    },
  });
};

export const useToggleSpecializationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleSpecializationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specializationKeys.all });
    },
  });
};
