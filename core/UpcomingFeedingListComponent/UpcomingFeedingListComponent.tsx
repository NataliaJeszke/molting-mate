import React, { useMemo } from "react";
import { addDays, parse, isSameDay } from "date-fns";

import { getNextFeedingDate } from "@/utils/feedingUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { SpiderListItem } from "@/models/SpiderList.model";

import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { SpiderDetailType } from "@/db/database";
import { useTranslation } from "@/hooks/useTranslation";

interface UpcomingFeedingListComponentProps {
  spiders: SpiderDetailType[];
}

const UpcomingFeedingListComponent = ({
  spiders,
}: UpcomingFeedingListComponentProps) => {
  const { t } = useTranslation();

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

        for (let i = 0; i <= 3; i++) {
          if (isSameDay(nextFeedingDate, addDays(now, i))) {
            const statusTemplate =
              i === 0
                ? t("upcoming-feeding-list.statusToday")
                : t("upcoming-feeding-list.status", {
                    i: i,
                    days:
                      i === 1
                        ? t("upcoming-feeding-list.day")
                        : t("upcoming-feeding-list.days"),
                  });

            return {
              id: spider.id,
              name: spider.name,
              date: spider.lastFed,
              imageUri: spider.imageUri,
              status: statusTemplate,
            };
          }
        }

        return null;
      })
      .filter(Boolean)
      .slice(0, 20) as SpiderListItem[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiders]);

  return (
    <SpiderList
      title={t("upcoming-feeding-list.title")}
      data={upcomingSpiders}
      info={t("upcoming-feeding-list.info")}
    />
  );
};

export default UpcomingFeedingListComponent;
