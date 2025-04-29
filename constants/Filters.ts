import { FilterType } from "@/models/Filters.model";

export const DEFAULT_FILTERS: FilterType = {
  ageFrom: 0,
  ageTo: 20,
  individualType: [],
  spiderSpecies: "",
  dateFrom: undefined,
  dateTo: undefined,
  isActive: false,
};
