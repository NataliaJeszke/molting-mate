import { create } from "zustand";

export type FilterState = {
  age?: string;
  gender?: string;
  species?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type FilterViewTypes = "molting" | "feeding" | "collection";

type FiltersStore = {
  filters: {
    molting: FilterState;
    feeding: FilterState;
    collection: FilterState;
  };
  setFilters: (
    key: keyof FiltersStore["filters"],
    filters: FilterState,
  ) => void;
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
