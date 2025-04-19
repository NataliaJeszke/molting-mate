import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { parse } from "date-fns";

import { useSpidersStore } from "@/store/spidersStore";
import { ViewTypes } from "@/constants/ViewTypes.enums";

import { getFeedingStatus, getNextFeedingDate } from "../../utils/feedingUtils";

import SpiderFullList from "@/components/commons/SpiderFullList/SpiderFullList";
import SpiderSectionHeader from "../../components/commons/SpiderSectionHeader/SpiderSectionHeader";
import { useFiltersStore } from "@/store/filtersStore";

const FeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);
  const filters = useFiltersStore((state) => state.filters.feeding);
  const viewType = ViewTypes.VIEW_FEEDING;

  const sortedSpidersWithStatus = useMemo(() => {
    return [...spiders]
      .filter((spider) => !!spider.lastFed)
      .filter((spider) => {
        const matchAge = filters.age ? spider.age === filters.age : true;
        const matchGender = filters.gender
          ? spider.individualType === filters.gender
          : true;
        const matchSpecies = filters.species
          ? spider.spiderSpecies?.includes(filters.species)
          : true;
        const matchDateFrom = filters.dateFrom
          ? new Date(spider.lastFed) >= new Date(filters.dateFrom)
          : true;
        const matchDateTo = filters.dateTo
          ? new Date(spider.lastFed) <= new Date(filters.dateTo)
          : true;

        return (
          matchAge &&
          matchGender &&
          matchSpecies &&
          matchDateFrom &&
          matchDateTo
        );
      })
      .map((spider) => ({
        ...spider,
        status: getFeedingStatus(spider.lastFed, spider.feedingFrequency),
        nextFeedingDate: getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency,
        ),
      }))
      .sort((a, b) => {
        const dateA = parse(a.lastFed, "dd-MM-yyyy", new Date()).getTime();
        const dateB = parse(b.lastFed, "dd-MM-yyyy", new Date()).getTime();
        return dateA - dateB;
      });
  }, [spiders, filters]);

  return (
    <>
      <SpiderSectionHeader
        title="Karmienie"
        spiderCount={sortedSpidersWithStatus.length}
        info="Lista pająków według karmienia."
        viewType={viewType}
      />
      <ScrollView>
        <SpiderFullList data={sortedSpidersWithStatus} viewType={viewType} />
      </ScrollView>
    </>
  );
};

export default FeedingListComponent;
