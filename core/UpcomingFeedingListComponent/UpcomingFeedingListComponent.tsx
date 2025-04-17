import React, { useMemo } from "react";
import { addDays, parse, isSameDay } from "date-fns";

import { useSpidersStore } from "@/store/spidersStore";
import { getNextFeedingDate } from "@/utils/feedingUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";

import SpiderList from "@/components/commons/SpiderList/SpiderList";

const UpcomingFeedingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);

  const spidersToFeedInThreeDays = useMemo(() => {
    const targetDate = addDays(new Date(), 3);

    return spiders
      .filter((spider) => {
        const nextFeedingDateString = getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency as FeedingFrequency,
        );

        if (!nextFeedingDateString) return false;

        const nextFeedingDate = parse(
          nextFeedingDateString,
          "dd-MM-yyyy",
          new Date(),
        );

        return isSameDay(nextFeedingDate, targetDate);
      })
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastFed,
        imageUri: spider.imageUri,
        status: "ZA 3 DNI",
      }));
  }, [spiders]);

  return (
    <SpiderList
      title="Pająki do nakarmienia za 3 dni"
      data={spidersToFeedInThreeDays}
      info={"Pająki, które wkrótce trzeba nakarmić"}
    />
  );
};

export default UpcomingFeedingListComponent;
