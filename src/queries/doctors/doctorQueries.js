// src/queries/doctors/doctorQueries.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDoctors } from "../../services/doctorService";
import { doctorKeys } from "./doctorKeys";

export const useDoctorsQuery = (params = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => getDoctors(params),

    staleTime: 5 * 60 * 1000,

    placeholderData: keepPreviousData,
  });
};