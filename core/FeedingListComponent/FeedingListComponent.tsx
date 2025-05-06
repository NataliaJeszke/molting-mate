import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";

import { getAllSpiders, Spider } from "@/db/database";
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

export type ExtendedSpider = Omit<Spider, "status"> & {
  status: FeedingStatus | null;
  nextFeedingDate: string;
};

const FeedingListComponent = () => {
  const [spiders, setSpiders] = useState<Spider[]>([]);
  const filters = useFiltersStore((state) => state.filters.feeding);
  const viewType = ViewTypes.VIEW_FEEDING;

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
