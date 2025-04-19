import React, { useMemo } from "react";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { ScrollView } from "react-native";
import { useFiltersStore } from "@/store/filtersStore";

const CollectionListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const filters = useFiltersStore((state) => state.filters.collection);
  const viewType = ViewTypes.VIEW_COLLECTION;

  const filteredSpiders = useMemo(() => {
    return spiders
      .filter((spider) => {
        const matchSpecies = filters.species
          ? spider.spiderSpecies?.includes(filters.species)
          : true;
        const matchAge = filters.age ? spider.age === filters.age : true;
        const matchGender = filters.gender
          ? spider.individualType === filters.gender
          : true;

        return matchSpecies && matchAge && matchGender;
      })
      .map((spider) => ({
        ...spider,
      }));
  }, [spiders, filters]);

  return (
    <>
      <SpiderSectionHeader
        title="Kolekcja"
        spiderCount={spiders.length}
        info="Lista wszystkich pająków"
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={filteredSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default CollectionListComponent;
