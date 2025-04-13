import React from "react";

import { useSpidersStore } from "@/store/spidersStore";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders); 
  const collectionSpiders = spiders.map((spider) => ({
    ...spider,
    status: "Po linieniu",
  }));

  return (
    <>
    <FiltersComponent title="Kolekcja" spiderCount={spiders.length} info="Lista wszystkich pająków"/>
      <SpiderFullList
        data={collectionSpiders}
        info="Lista wszystkich pająków"
      />
    </>
  );
};

export default FeedingListComponent;