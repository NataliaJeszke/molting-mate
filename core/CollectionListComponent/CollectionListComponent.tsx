import React, { useEffect, useMemo } from "react";

import { SpiderDetailType } from "@/db/database";
import { useFiltersStore } from "@/store/filtersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "@/components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useSpidersStore } from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";

const CollectionListComponent = () => {
  const spiders = useSpidersStore(
    (state: any) => state.spiders,
  ) as SpiderDetailType[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);
  const sortType = useSpidersStore((state: any) => state.sortType);
  const sortOrder = useSpidersStore((state: any) => state.sortOrder);

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters = useFiltersStore((state) => state.filters.collection);
  const { t } = useTranslation();
  const viewType = ViewTypes.VIEW_COLLECTION;

  const parseDateMemo = useMemo(() => {
    const cache = new Map<string, number>();
    return (dateString: string): number => {
      if (!cache.has(dateString)) {
        const date = new Date(dateString);
        cache.set(dateString, date.getTime());
      }
      return cache.get(dateString)!;
    };
  }, []);

  const filteredSpiders = useMemo(() => {
    const hasActiveFilters =
      filters.isActive ||
      (filters.ageFrom !== undefined && filters.ageFrom !== 0) ||
      (filters.ageTo !== undefined && filters.ageTo !== 20) ||
      (filters.individualType && filters.individualType.length > 0) ||
      filters.spiderSpecies;

    if (!hasActiveFilters) {
      const allSpiders = [...spiders];

      if (sortType) {
        allSpiders.sort((a, b) => {
          const aValue = a[sortType as keyof SpiderDetailType];
          const bValue = b[sortType as keyof SpiderDetailType];

          if (!aValue || !bValue) return 0;

          const aDate = typeof aValue === "string" ? parseDateMemo(aValue) : 0;
          const bDate = typeof bValue === "string" ? parseDateMemo(bValue) : 0;

          return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
        });
      }

      return allSpiders;
    }

    const filtered = spiders.filter((spider) => {
      if (
        filters.ageFrom !== undefined &&
        filters.ageFrom !== 0 &&
        spider.age < filters.ageFrom
      )
        return false;
      if (
        filters.ageTo !== undefined &&
        filters.ageTo !== 20 &&
        spider.age > filters.ageTo
      )
        return false;

      if (
        filters.individualType?.length &&
        !filters.individualType.includes(spider.individualType)
      ) {
        return false;
      }

      if (
        filters.spiderSpecies &&
        !spider.spiderSpecies
          ?.toLowerCase()
          .includes(filters.spiderSpecies.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    if (sortType) {
      filtered.sort((a, b) => {
        const aValue = a[sortType as keyof SpiderDetailType];
        const bValue = b[sortType as keyof SpiderDetailType];

        if (!aValue || !bValue) return 0;

        const aDate = typeof aValue === "string" ? parseDateMemo(aValue) : 0;
        const bDate = typeof bValue === "string" ? parseDateMemo(bValue) : 0;

        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return filtered;
  }, [spiders, filters, sortType, sortOrder, parseDateMemo]);

  return (
    <>
      <SpiderSectionHeader
        title={t("collection.core.title")}
        spiderCount={spiders.length}
        info={t("collection.core.info")}
        viewType={viewType}
      />
      <SpiderFullList data={filteredSpiders} viewType={viewType} />
    </>
  );
};

export default CollectionListComponent;
