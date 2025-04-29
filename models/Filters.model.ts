import { IndividualType } from "./Spider.model";

export type FilterViewTypes = "molting" | "feeding" | "collection";

export type FilterType = {
  age?: number;
  ageFrom?: number;
  ageTo?: number;
  individualType?: IndividualType[];
  spiderSpecies?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
};
