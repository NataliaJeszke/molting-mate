import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

import { Spider } from "@/db/database";
import { useFiltersStore } from "@/store/filtersStore";

import { useSpiderFilter } from "@/hooks/useSpiderFilter";

import { parseDate } from "@/utils/dateUtils";
import { getNextFeedingDate } from "@/utils/feedingUtils";

import { ViewTypes } from "@/constants/ViewTypes.enums";
import { getFeedingStatus } from "@/utils/feedingUtils";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "@/components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { useSpidersStore } from "@/store/spidersStore";

export type ExtendedSpider = Omit<Spider, "status"> & {
  status: FeedingStatus | string | null;
  nextFeedingDate: string;
};

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state: any) => state.spiders) as Spider[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);
  const filters = useFiltersStore((state) => state.filters.feeding);
  const viewType = ViewTypes.VIEW_FEEDING;

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastFed",
  });

  const processedSpiders: ExtendedSpider[] = useMemo(() => {
    return [...filteredSpiders]
      .map((spider) => {
        const nextFeedingDate = getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency as unknown as FeedingFrequency,
        );

        const status = getFeedingStatus(
          spider.lastFed,
          spider.feedingFrequency as unknown as FeedingFrequency,
        );

        return {
          ...spider,
          status: status as FeedingStatus | null,
          nextFeedingDate,
        };
      })
      .sort((a, b) => {
        const dateA = parseDate(a.lastFed)?.getTime() || 0;
        const dateB = parseDate(b.lastFed)?.getTime() || 0;
        return dateA - dateB;
      });
  }, [filteredSpiders]);

  return (
    <>
      <SpiderSectionHeader
        title="Karmienie"
        spiderCount={processedSpiders.length}
        info="Lista pająków według karmienia."
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={processedSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default FeedingListComponent;
