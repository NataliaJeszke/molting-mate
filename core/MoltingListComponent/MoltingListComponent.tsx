import React, { useEffect, useMemo } from "react";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { parseDate } from "@/utils/dateUtils";
import { useSpiderFilter } from "@/hooks/useSpiderFilter";
import { SpiderDetailType } from "@/db/database";
import { useSpidersStore } from "@/store/spidersStore";
import { useTranslation } from "@/hooks/useTranslation";

const MoltingListComponent = () => {
  const spiders = useSpidersStore(
    (state: any) => state.spiders,
  ) as SpiderDetailType[];
  const fetchSpiders = useSpidersStore((state: any) => state.fetchSpiders);
  const filters = useFiltersStore((state) => state.filters.molting);
  const sortOrder = useSpidersStore((state: any) => state.sortOrder);
  const { t } = useTranslation();
  const viewType = ViewTypes.VIEW_MOLTING;

  useEffect(() => {
    fetchSpiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastMolt",
  });

  const parseDateMemo = useMemo(() => {
    const cache = new Map<string, Date | null>();
    return (dateString: string): Date | null => {
      if (!cache.has(dateString)) {
        cache.set(dateString, parseDate(dateString));
      }
      return cache.get(dateString)!;
    };
  }, []);

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
