import { useDoctorsQuery } from "../../queries/doctors/doctorQueries";

export const useDoctors = (params = {}) => {
  return useDoctorsQuery(params);
};
