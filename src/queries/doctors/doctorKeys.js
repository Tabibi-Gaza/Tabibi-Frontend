// queries/doctorKeys.js

export const doctorKeys = {
  all: ["doctors"],

  list: (params) => [
    "doctors",
    params.Page ?? 1,
    params.PageSize ?? 12,
    params.Search ?? "",
    params.SpecializationId ?? null,
    params.SortBy ?? "name",
    params.Desc ?? true,
    params.IsActive ?? null,
  ],

  detail: (id) => ["doctors", "detail", id],
};