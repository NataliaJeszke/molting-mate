import React, { useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";

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
import {
  useSpidersStore,
  useSpiders,
  useSortConfig,
} from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";

export type ExtendedSpider = Omit<SpiderDetailType, "status"> & {
  status: FeedingStatus | string | null;
  nextFeedingDate: string;
};

const FeedingListComponent = () => {
  const { t } = useTranslation();

  // Use the custom hook that reacts to store changes
  const spiders = useSpiders();
  const fetchSpiders = useSpidersStore((state) => state.fetchSpiders);
  const { sortType, sortOrder } = useSortConfig();

  const filters = useFiltersStore((state) => state.filters.feeding);
  const viewType = ViewTypes.VIEW_FEEDING;

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchSpiders();
    }, [fetchSpiders]),
  );

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastFed",
  });

  // Memoized date parser
  const parseDateMemo = useMemo(() => {
    const cache = new Map<string, Date | null>();
    return (dateString: string): Date | null => {
      if (!dateString) return null;
      if (!cache.has(dateString)) {
        cache.set(dateString, parseDate(dateString));
      }
      return cache.get(dateString)!;
    };
  }, []);

  // Memoized processed spiders with feeding status
  const processedSpiders: ExtendedSpider[] = useMemo(() => {
    const enriched = filteredSpiders.map((spider) => {
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
    });

    return enriched.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      if (sortType === "lastFed") {
        aValue = parseDateMemo(a.lastFed)?.getTime() || 0;
        bValue = parseDateMemo(b.lastFed)?.getTime() || 0;
      } else if (sortType === "nextFeedingDate") {
        aValue = parseDateMemo(a.nextFeedingDate)?.getTime() || 0;
        bValue = parseDateMemo(b.nextFeedingDate)?.getTime() || 0;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [filteredSpiders, sortType, sortOrder, parseDateMemo]);

  return (
    <>
      <SpiderSectionHeader
        title={t("feeding.core.title")}
        spiderCount={processedSpiders.length}
        info={t("feeding.core.info")}
        viewType={viewType}
      />
      <SpiderFullList data={processedSpiders} viewType={viewType} />
    </>
  );
};

export default FeedingListComponent;
