import React, { useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { parseDate } from "@/utils/dateUtils";
import { useSpiderFilter } from "@/hooks/useSpiderFilter";
import {
  useSpidersStore,
  useSpiders,
  useSortConfig,
} from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";

const MoltingListComponent = () => {
  // Use the custom hook that reacts to store changes
  const spiders = useSpiders();
  const fetchSpiders = useSpidersStore((state) => state.fetchSpiders);
  const filters = useFiltersStore((state) => state.filters.molting);
  const { sortOrder } = useSortConfig();
  const { t } = useTranslation();
  const viewType = ViewTypes.VIEW_MOLTING;

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchSpiders();
    }, [fetchSpiders]),
  );

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastMolt",
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

  // Memoized processed spiders
  const processedSpiders = useMemo(() => {
    const enriched = filteredSpiders.map((spider) => ({
      ...spider,
      status: "predykcja linienia",
    }));

    return enriched.sort((a, b) => {
      const dateA = parseDateMemo(a.lastMolt)?.getTime() || 0;
      const dateB = parseDateMemo(b.lastMolt)?.getTime() || 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [filteredSpiders, sortOrder, parseDateMemo]);

  return (
    <>
      <SpiderSectionHeader
        title={t("molting-list.title")}
        spiderCount={processedSpiders.length}
        info={t("molting-list.info")}
        viewType={viewType}
      />
      <SpiderFullList data={processedSpiders} viewType={viewType} />
    </>
  );
};

export default MoltingListComponent;
