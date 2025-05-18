import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

import { SpiderDetailType } from "@/db/database";
import { useFiltersStore } from "@/store/filtersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { IndividualType } from "@/constants/IndividualType.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "@/components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useSpidersStore } from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";

const CollectionListComponent = () => {
  const spiders = useSpidersStore(
    (state: any) => state.spiders,
  ) as SpiderDetailType[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);

  const filters = useFiltersStore((state) => state.filters.collection);
  const { t } = useTranslation();
  const viewType = ViewTypes.VIEW_COLLECTION;

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("CollectionListComponent: fetchSpiders", spiders);
  }, []);

  const filteredSpiders = useMemo(() => {
    return spiders
      .filter((spider) => {
        const matchspiderSpecies = filters.spiderSpecies
          ? spider.spiderSpecies?.includes(filters.spiderSpecies)
          : true;
        const matchAge =
          (filters.ageFrom === undefined || spider.age >= filters.ageFrom) &&
          (filters.ageTo === undefined || spider.age <= filters.ageTo);
        const matchGender =
          !filters.individualType?.length ||
          (filters.individualType || []).includes(
            spider.individualType! as IndividualType,
          );

        return matchspiderSpecies && matchAge && matchGender;
      })
      .map((spider) => ({ ...spider }));
  }, [spiders, filters]);

  return (
    <>
      <SpiderSectionHeader
        title={t("collection.core.title")}
        spiderCount={spiders.length}
        info={t("collection.core.info")}
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={filteredSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default CollectionListComponent;
