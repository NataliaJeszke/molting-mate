import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

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

  const filters = useFiltersStore((state) => state.filters.collection);
  const { t } = useTranslation();
  const viewType = ViewTypes.VIEW_COLLECTION;

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("CollectionListComponent: fetchSpiders", spiders);
  }, []);

  const filteredSpiders = useMemo(() => {
    const filtered = spiders.filter((spider) => {
      const matchSpiderSpecies = filters.spiderSpecies
        ? spider.spiderSpecies?.includes(filters.spiderSpecies)
        : true;
      const matchAge =
        (filters.ageFrom === undefined || spider.age >= filters.ageFrom) &&
        (filters.ageTo === undefined || spider.age <= filters.ageTo);
      const matchGender =
        !filters.individualType?.length ||
        filters.individualType.includes(spider.individualType);

      return matchSpiderSpecies && matchAge && matchGender;
    });

    if (sortType) {
      filtered.sort((a, b) => {
        const aValue = a[sortType as keyof SpiderDetailType];
        const bValue = b[sortType as keyof SpiderDetailType];

        if (!aValue || !bValue) return 0;

        const aDate =
          typeof aValue === "string" ? new Date(aValue).getTime() : 0;
        const bDate =
          typeof bValue === "string" ? new Date(bValue).getTime() : 0;

        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return filtered;
  }, [spiders, filters, sortType, sortOrder]);

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
