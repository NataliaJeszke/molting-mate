import React, { useMemo } from "react";
import { addDays, parse, isSameDay } from "date-fns";

import { getNextFeedingDate } from "@/utils/feedingUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { SpiderListItem } from "@/models/SpiderList.model";

import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { Spider } from "@/db/database";

interface UpcomingFeedingListComponentProps {
  spiders: Spider[];
}

const UpcomingFeedingListComponent = ({
  spiders,
}: UpcomingFeedingListComponentProps) => {
  const upcomingSpiders = useMemo(() => {
    const now = new Date();

    return spiders
      .map((spider) => {
        const nextFeedingDateString = getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency as FeedingFrequency,
        );

        if (!nextFeedingDateString) return null;

        const nextFeedingDate = parse(
          nextFeedingDateString,
          "yyyy-MM-dd",
          new Date(),
        );

        for (let i = 1; i <= 3; i++) {
          if (isSameDay(nextFeedingDate, addDays(now, i))) {
            return {
              id: spider.id,
              name: spider.name,
              date: spider.lastFed,
              imageUri: spider.imageUri,
              status: `ZA ${i} ${i === 1 ? "DZIEŃ" : "DNI"}`,
            };
          }
        }

        return null;
      })
      .filter(Boolean) as SpiderListItem[];
  }, [spiders]);

  return (
    <SpiderList
      title="Zbliające się karmienie"
      data={upcomingSpiders}
      info="Lista pająków do nakarmienia za 1–3 dni"
    />
  );
};

export default UpcomingFeedingListComponent;
