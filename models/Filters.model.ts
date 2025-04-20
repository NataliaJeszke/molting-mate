import { IndividualType } from "./Spider.model";

export type FilterType = {
  age?: string;
  individualType?: IndividualType[];
  spiderSpecies?: string;
  dateFrom?: string;
  dateTo?: string;
};
