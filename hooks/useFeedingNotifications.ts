import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { addDays, isSameDay, parse } from "date-fns";
import { getNextFeedingDate } from "@/utils/feedingUtils";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { Spider } from "@/db/database";
import { useTranslation } from "./useTranslation";
import { useUserStore } from "@/store/userStore";

export function useFeedingNotifications(spiders: Spider[]) {
  const { t } = useTranslation();
  const notificationsEnabled = useUserStore(
    (store) => store.notificationsEnabled,
  );
  const setNotificationsEnabled = useUserStore(
    (store) => store.setNotificationsEnabled,
  );

  useEffect(() => {
    const setupNotifications = async () => {
      if (!notificationsEnabled) {
        return;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        setNotificationsEnabled(false);
        console.warn("Brak pozwolenia na powiadomienia");
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();

      const feedingsByDate: Record<string, number> = {};

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
          const dateToCheck = addDays(now, i);
          if (isSameDay(nextFeedingDate, dateToCheck)) {
            const key = nextFeedingDateString;
            feedingsByDate[key] = (feedingsByDate[key] || 0) + 1;
            break;
          }
        }
      }

      for (const [dateString, count] of Object.entries(feedingsByDate)) {
        const feedingDate = parse(dateString, "yyyy-MM-dd", new Date());

        const diffDays = Math.round(
          (feedingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        const daysText =
          diffDays === 1
            ? t("notifications.feeding.day")
            : t("notifications.feeding.days", { count: diffDays });

        const bodyText = t("notifications.feeding.bodyGroup", {
          count,
          days: daysText,
        });

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🕷️ ${t("notifications.feeding.title")}`,
            body: bodyText,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            year: feedingDate.getFullYear(),
            month: feedingDate.getMonth() + 1,
            day: feedingDate.getDate(),
            hour: 10,
            minute: 0,
            second: 0,
          },
        });
      }
    };

    if (spiders.length > 0) {
      setupNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spiders, notificationsEnabled]);
}
