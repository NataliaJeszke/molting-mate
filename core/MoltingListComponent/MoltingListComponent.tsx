import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { ViewTypes } from "@/constants/ViewTypes.enums";
import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";
import { parseDate } from "@/utils/dateUtils";
import { useSpiderFilter } from "@/hooks/useSpiderFilter";
import { getAllSpiders, Spider } from "@/db/database";

const MoltingListComponent = () => {
  const [spiders, setSpiders] = useState<Spider[]>([]);
  const filters = useFiltersStore((state) => state.filters.molting);
  const viewType = ViewTypes.VIEW_MOLTING;

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
