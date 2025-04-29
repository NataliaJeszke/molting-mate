import { useMemo } from "react";

import { Spider } from "@/models/Spider.model";
import { parseDate } from "@/utils/dateUtils";
import { FilterType } from "@/models/Filters.model";

type UseSpiderFilterParams<T extends Spider> = {
  spiders: T[];
  filters: FilterType;
  datePropertyKey: keyof T;
  statusLabel?: string;
};

export function useSpiderFilter<T extends Spider>({
  spiders,
  filters,
  datePropertyKey,
  statusLabel = "status",
}: UseSpiderFilterParams<T>) {
  const filteredSpiders = useMemo(() => {
    return spiders
      .filter((spider) => !!spider[datePropertyKey])
      .filter((spider) => {
        const matchAge =
          (filters.ageFrom === undefined || spider.age >= filters.ageFrom) &&
          (filters.ageTo === undefined || spider.age <= filters.ageTo);
        const matchGender =
          !filters.individualType?.length ||
          (filters.individualType || []).includes(spider.individualType!);
        const matchSpecies = filters.spiderSpecies
          ? spider.spiderSpecies?.includes(filters.spiderSpecies)
          : true;

        const parsedDateFrom = filters.dateFrom
          ? parseDate(filters.dateFrom)
          : null;
        const parsedDateTo = filters.dateTo ? parseDate(filters.dateTo) : null;

        const spiderDate = parseDate(spider[datePropertyKey] as string);

        const matchDateFrom = parsedDateFrom
          ? spiderDate !== null && spiderDate >= parsedDateFrom
          : true;
        const matchDateTo = parsedDateTo
          ? spiderDate !== null && spiderDate <= parsedDateTo
          : true;

        return (
          matchAge &&
          matchGender &&
          matchSpecies &&
          matchDateFrom &&
          matchDateTo
        );
      });
  }, [spiders, filters, datePropertyKey]);

  return filteredSpiders;
}
