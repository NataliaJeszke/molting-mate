import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";

import { SpiderDetailType } from "@/db/database";
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
import { useTranslation } from "@/hooks/useTranslation";

export type ExtendedSpider = Omit<SpiderDetailType, "status"> & {
  status: FeedingStatus | string | null;
  nextFeedingDate: string;
};

const FeedingListComponent = () => {
  const { t } = useTranslation();
  const spiders = useSpidersStore(
    (state: any) => state.spiders,
  ) as SpiderDetailType[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);
  const sortType = useSpidersStore((state: any) => state.sortType);
  const sortOrder = useSpidersStore((state: any) => state.sortOrder);

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
          spider.feedingFrequency as FeedingFrequency,
        );

        const status = getFeedingStatus(
          spider.lastFed,
          spider.feedingFrequency as FeedingFrequency,
        );

        return {
          ...spider,
          status,
          nextFeedingDate,
        };
      })
      .sort((a, b) => {
        let aValue: number = 0;
        let bValue: number = 0;

        if (sortType === "lastFed") {
          aValue = parseDate(a.lastFed)?.getTime() || 0;
          bValue = parseDate(b.lastFed)?.getTime() || 0;
        } else if (sortType === "nextFeedingDate") {
          aValue = parseDate(a.nextFeedingDate)?.getTime() || 0;
          bValue = parseDate(b.nextFeedingDate)?.getTime() || 0;
        }

        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
  }, [filteredSpiders, sortType, sortOrder]);

  return (
    <>
      <SpiderSectionHeader
        title={t("feeding.core.title")}
        spiderCount={processedSpiders.length}
        info={t("feeding.core.info")}
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={processedSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default FeedingListComponent;
