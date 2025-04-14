import React, { useMemo } from "react";

import { useSpidersStore } from "@/store/spidersStore";
import { convertToISODate } from "@/utils/dateUtils";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import { getFeedingStatus } from "./utils/feedingUtils";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import FiltersComponent from "../FiltersComponent/FiltersComponent";
import { ScrollView } from "react-native";

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_FEEDING;

  const sortedSpidersWithStatus = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastFed)
      .map((spider) => ({
        ...spider,
        status: getFeedingStatus(spider.lastFed, spider.feedingFrequency),
      }))
      .sort((a, b) => {
        const dateA = new Date(convertToISODate(a.lastFed)).getTime();
        const dateB = new Date(convertToISODate(b.lastFed)).getTime();
        return dateA - dateB;
      });
  }, [spiders]);

  return (
    <>
      <FiltersComponent
        title="Karmienie"
        spiderCount={sortedSpidersWithStatus.length}
        info="Lista pająków według karmienia."
      />
      <ScrollView>
        <SpiderFullList data={sortedSpidersWithStatus} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default FeedingListComponent;
