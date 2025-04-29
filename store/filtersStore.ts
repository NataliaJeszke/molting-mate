import { create } from "zustand";
import { FilterType } from "@/models/Filters.model";
import { DEFAULT_FILTERS } from "@/constants/Filters";

type FiltersStore = {
  filters: {
    molting: FilterType;
    feeding: FilterType;
    collection: FilterType;
  };
  setFilters: (key: keyof FiltersStore["filters"], filters: FilterType) => void;
  setRangeFilters: (
    key: keyof FiltersStore["filters"],
    ageFrom: number,
    ageTo: number
  ) => void;
  resetFilters: (key: keyof FiltersStore["filters"]) => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {
    molting: { ...DEFAULT_FILTERS },
    feeding: { ...DEFAULT_FILTERS },
    collection: { ...DEFAULT_FILTERS },
  },
  setFilters: (key, filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: {
          ...state.filters[key],
          ...filters,
          isActive: true,
        },
      },
    }));
  },
  setRangeFilters: (key, ageFrom, ageTo) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: {
          ...state.filters[key],
          ageFrom,
          ageTo,
          isActive: true,
        },
      },
    }));
  },
  resetFilters: (key) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: { ...DEFAULT_FILTERS },
        isActive: false,
      },
    }));
  },
}));
