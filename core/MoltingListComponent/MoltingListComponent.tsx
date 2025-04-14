import React, { useMemo } from "react";

import { useSpidersStore } from "@/store/spidersStore";
import { convertToISODate } from "@/utils/dateUtils";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import { ScrollView } from "react-native";

const MoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_MOLTING;

  const sortedSpiders = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastMolt)
      .map((spider) => ({
        ...spider,
        status: "predykcja linienia",
      }))
      .sort((a, b) => {
        const dateA = new Date(convertToISODate(a.lastMolt)).getTime();
        const dateB = new Date(convertToISODate(b.lastMolt)).getTime();
        return dateA - dateB;
      });
  }, [spiders]);

  return (
    <>
      <FiltersComponent
        title="Linienie"
        spiderCount={sortedSpiders.length}
        info="Lista pająków według linienia."
      />
      <ScrollView>
        <SpiderFullList data={sortedSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default MoltingListComponent;
