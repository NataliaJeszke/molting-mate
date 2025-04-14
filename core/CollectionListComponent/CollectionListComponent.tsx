import React from "react";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import { ScrollView } from "react-native";

const CollectionListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_COLLECTION;
  const collectionSpiders = spiders.map((spider) => ({
    ...spider,
  }));

  return (
    <>
      <FiltersComponent
        title="Kolekcja"
        spiderCount={spiders.length}
        info="Lista wszystkich pająków"
      />
      <ScrollView>
        <SpiderFullList data={collectionSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default CollectionListComponent;
