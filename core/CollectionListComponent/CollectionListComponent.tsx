import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";

import { getAllSpiders, Spider } from "@/db/database";
import { useFiltersStore } from "@/store/filtersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { IndividualType } from "@/models/Spider.model";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "@/components/commons/SpiderSectionHeader/SpiderSectionHeader";

const CollectionListComponent = () => {
  const [spiders, setSpiders] = useState<Spider[]>([]);
  const filters = useFiltersStore((state) => state.filters.collection);
  const viewType = ViewTypes.VIEW_COLLECTION;

  useEffect(() => {
    const fetchSpiders = async () => {
      const spiders = await getAllSpiders();
      if (spiders) {
        const typedSpiders = spiders as Spider[];
        setSpiders(typedSpiders);
      }
    };

    fetchSpiders();
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
