import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { addDays, isSameDay, parse } from "date-fns";
import { getNextFeedingDate } from "@/utils/feedingUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { Spider } from "@/db/database";
import { useTranslation } from "./useTranslation";

export function useFeedingNotifications(spiders: Spider[]) {
  const { t } = useTranslation();
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Brak pozwolenia na powiadomienia");
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();

      for (const spider of spiders) {
        const nextFeedingDateString = getNextFeedingDate(
          spider.lastFed,
          spider.feedingFrequency as FeedingFrequency,
        );

        if (!nextFeedingDateString) continue;

        const nextFeedingDate = parse(
          nextFeedingDateString,
          "yyyy-MM-dd",
          new Date(),
        );

        for (let i = 1; i <= 3; i++) {
          if (isSameDay(nextFeedingDate, addDays(now, i))) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `🕷️ ${t("notifications.feeding.title")}`,
                body: t("notifications.feeding.body", {
                  count: i,
                  name: spider.name,
                }),
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
              },
            });
            break;
          }
        }
      }
    };

    if (spiders.length > 0) {
      setupNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiders]);
}
