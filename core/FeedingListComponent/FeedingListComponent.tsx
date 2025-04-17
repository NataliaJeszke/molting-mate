import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { parse } from "date-fns";

import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import { getFeedingStatus, getNextFeedingDate } from "../../utils/feedingUtils";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const viewType = ViewTypes.VIEW_FEEDING;

  const sortedSpidersWithStatus = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastFed)
      .map((spider) => ({
        ...spider,
        status: getFeedingStatus(spider.lastFed, spider.feedingFrequency),
        nextFeedingDate: getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency,
        ),
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
