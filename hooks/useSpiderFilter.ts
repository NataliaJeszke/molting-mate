import { useMemo } from "react";

import { SpiderDetailType } from "@/db/database";
import { parseDate } from "@/utils/dateUtils";

import { FilterType } from "@/models/Filters.model";
import { IndividualType } from "@/models/Spider.model";

type UseSpiderFilterParams<T extends SpiderDetailType> = {
  spiders: T[];
  filters: FilterType;
  datePropertyKey: keyof T;
  statusLabel?: string;
};

export function useSpiderFilter<T extends SpiderDetailType>({
  spiders,
  filters,
  datePropertyKey,
  statusLabel = "status",
}: UseSpiderFilterParams<T>) {
  const filteredSpiders = useMemo(() => {
    const hasActiveFilters =
      filters.isActive ||
      (filters.ageFrom !== undefined && filters.ageFrom !== 0) ||
      (filters.ageTo !== undefined && filters.ageTo !== 20) ||
      (filters.individualType && filters.individualType.length > 0) ||
      filters.spiderSpecies ||
      filters.dateFrom ||
      filters.dateTo;

    if (!hasActiveFilters) {
      return spiders;
    }

    const parsedDateFrom = filters.dateFrom
      ? parseDate(filters.dateFrom)
      : null;
    const parsedDateTo = filters.dateTo ? parseDate(filters.dateTo) : null;

    return spiders.filter((spider) => {
      if (!spider[datePropertyKey]) return false;

      if (filters.ageFrom !== undefined && spider.age < filters.ageFrom)
        return false;
      if (filters.ageTo !== undefined && spider.age > filters.ageTo)
        return false;

      if (filters.individualType && filters.individualType.length > 0) {
        if (
          !filters.individualType.includes(
            spider.individualType! as IndividualType,
          )
        ) {
          return false;
        }
      }

      if (
        filters.spiderSpecies &&
        !spider.spiderSpecies
          ?.toLowerCase()
          .includes(filters.spiderSpecies.toLowerCase())
      ) {
        return false;
      }

      if (parsedDateFrom || parsedDateTo) {
        const spiderDate = parseDate(spider[datePropertyKey] as string);
        if (spiderDate === null) return false;

        if (parsedDateFrom && spiderDate < parsedDateFrom) return false;
        if (parsedDateTo && spiderDate > parsedDateTo) return false;
      }

      return true;
    });
  }, [spiders, filters, datePropertyKey]);

  return filteredSpiders;
}
