import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { parseDate } from "@/utils/dateUtils";
import { useSpiderFilter } from "@/hooks/useSpiderFilter";

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const filters = useFiltersStore((state) => state.filters.feeding);
  const viewType = ViewTypes.VIEW_FEEDING;

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastFed",
  });

  const processedSpiders = useMemo(() => {
    return [...filteredSpiders]
      .map((spider) => ({
        ...spider,
        status: "predykcja karmienia",
      }))
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
