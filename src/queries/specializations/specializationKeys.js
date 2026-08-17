export const specializationKeys = {
  all: ["specializations"],
  list: () => ["specializations", "list"],
  adminList: (params) => ["specializations", "admin", params],
  detail: (id) => ["specializations", "detail", id],
};
