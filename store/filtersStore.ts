import { create } from "zustand";
import { FilterType } from "@/models/Filters.model";

export type FilterViewTypes = "molting" | "feeding" | "collection";

type FiltersStore = {
  filters: {
    molting: FilterType;
    feeding: FilterType;
    collection: FilterType;
  };
  setFilters: (key: keyof FiltersStore["filters"], filters: FilterType) => void;
  resetFilters: (key: keyof FiltersStore["filters"]) => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {
    molting: {},
    feeding: {},
    collection: {},
  },
  setFilters: (key, filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: filters,
      },
    })),
  resetFilters: (key) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: {},
      },
    })),
}));
