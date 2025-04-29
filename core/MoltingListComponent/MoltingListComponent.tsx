import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { parseDate } from "@/utils/dateUtils";
import { useSpiderFilter } from "@/hooks/useSpiderFilter";

const MoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const filters = useFiltersStore((state) => state.filters.molting);
  const viewType = ViewTypes.VIEW_MOLTING;

  const filteredSpiders = useSpiderFilter({
    spiders,
    filters,
    datePropertyKey: "lastMolt",
  });
  const processedSpiders = useMemo(() => {
    console.log("Filtered spiders:", filteredSpiders);
    return [...filteredSpiders]
      .map((spider) => ({
        ...spider,
      }))
      .sort((a, b) => {
        const dateA = parseDate(a.lastMolt)?.getTime() || 0;
        const dateB = parseDate(b.lastMolt)?.getTime() || 0;
        return dateA - dateB;
      });
  }, [filteredSpiders]);
  return (
    <>
      <SpiderSectionHeader
        title="Linienie"
        spiderCount={processedSpiders.length}
        info="Lista pająków według linienia."
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={processedSpiders} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default MoltingListComponent;
