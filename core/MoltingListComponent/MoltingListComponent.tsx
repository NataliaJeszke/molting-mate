import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { parse } from "date-fns";

import { useSpidersStore } from "@/store/spidersStore";

import { ViewTypes } from "@/constants/ViewTypes.enums";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";

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
        const dateA = parse(a.lastFed, "dd-MM-yyyy", new Date()).getTime();
        const dateB = parse(b.lastFed, "dd-MM-yyyy", new Date()).getTime();
        return dateA - dateB;
      });
  }, [spiders]);

  return (
    <>
      <SpiderSectionHeader
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
