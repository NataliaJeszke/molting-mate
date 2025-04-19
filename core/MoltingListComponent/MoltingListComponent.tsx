import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { parse } from "date-fns";

import { useSpidersStore } from "@/store/spidersStore";

import { ViewTypes } from "@/constants/ViewTypes.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";

const MoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const filters = useFiltersStore((state) => state.filters.molting);
  const viewType = ViewTypes.VIEW_MOLTING;

  const filteredAndSortedSpiders = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastMolt)
      .filter((spider) => {
        const matchAge = filters.age ? spider.age === filters.age : true;
        const matchGender = filters.gender
          ? spider.individualType === filters.gender
          : true;
        const matchSpecies = filters.species
          ? spider.spiderSpecies?.includes(filters.species)
          : true;
        const matchDateFrom = filters.dateFrom
          ? new Date(spider.lastMolt) >= new Date(filters.dateFrom)
          : true;
        const matchDateTo = filters.dateTo
          ? new Date(spider.lastMolt) <= new Date(filters.dateTo)
          : true;

        return (
          matchAge &&
          matchGender &&
          matchSpecies &&
          matchDateFrom &&
          matchDateTo
        );
      })
      .map((spider) => ({
        ...spider,
        status: "predykcja linienia",
      }))
      .sort((a, b) => {
        const dateA = parse(a.lastFed, "dd-MM-yyyy", new Date()).getTime();
        const dateB = parse(b.lastFed, "dd-MM-yyyy", new Date()).getTime();
        return dateA - dateB;
      });
  }, [spiders, filters]);

  return (
    <>
      <SpiderSectionHeader
        title="Linienie"
        spiderCount={spiders.length}
        info="Lista pająków według linienia."
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={filteredAndSortedSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default MoltingListComponent;
