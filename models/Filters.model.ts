import { IndividualType } from "./Spider.model";

export type FilterType = {
  age?: number;
  individualType?: IndividualType[];
  spiderSpecies?: string;
  dateFrom?: string;
  dateTo?: string;
};
