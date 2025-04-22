import { create } from "zustand";
import { FilterType } from "@/models/Filters.model";

export type FilterViewTypes = "molting" | "feeding" | "collection";

const DEFAULT_FILTERS: FilterType = {
  ageFrom: 0,
  ageTo: 20,
  individualType: [],
  spiderSpecies: "",
  dateFrom: undefined,
  dateTo: undefined,
  isActive: false,
};

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
    console.log(`setFilters for ${key}:`, filters);
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
    console.log(
      `setRangeFilters for ${key}: ageFrom=${ageFrom}, ageTo=${ageTo}`
    );
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
    console.log(`resetFilters for ${key}`);
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: { ...DEFAULT_FILTERS },
        isActive: false,
      },
    }));
  },
}));
