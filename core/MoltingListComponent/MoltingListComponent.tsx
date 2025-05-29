import React, { useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
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
  const processedSpiders = useMemo(() => {
    return [...filteredSpiders]
      .map((spider) => ({
        ...spider,
        status: "predykcja linienia",
      }))
      .sort((a, b) => {
        const dateA = parseDate(a.lastMolt)?.getTime() || 0;
        const dateB = parseDate(b.lastMolt)?.getTime() || 0;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [filteredSpiders, sortOrder]);
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
