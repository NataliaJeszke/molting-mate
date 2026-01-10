import { useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { getSpidersToFeedToday } from "@/utils/feedingUtils";
import { Spider } from "@/db/database";
import { useTranslation } from "./useTranslation";
import { useUserStore } from "@/store/userStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const DAILY_NOTIFICATION_ID = "daily-feeding-reminder";

export function useFeedingNotifications(spiders: Spider[]) {
  const { t } = useTranslation();
  const notificationsEnabled = useUserStore(
    (store) => store.notificationsEnabled,
  );

  const cancelDailyNotification = useCallback(async () => {
    await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
  }, []);

  const scheduleDailyNotification = useCallback(async () => {
    await cancelDailyNotification();

    if (!notificationsEnabled) {
      return;
    }

    try {
      const spidersToFeed = getSpidersToFeedToday(spiders);

      if (spidersToFeed === 0) {
        return;
      }

      const notificationBody =
        spidersToFeed === 1
          ? t("notifications.feeding.todaySingular")
          : t("notifications.feeding.todayPlural");

      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(12, 0, 0, 0);

      if (now.getHours() >= 12) {
        triggerDate.setDate(triggerDate.getDate() + 1);
        console.log("ℹ️ Past 12:00, scheduling notification for tomorrow");
      }

      const secondsUntilTrigger = Math.floor(
        (triggerDate.getTime() - now.getTime()) / 1000,
      );

      await Notifications.scheduleNotificationAsync({
        identifier: DAILY_NOTIFICATION_ID,
        content: {
          title: `🕷️ ${t("notifications.feeding.title")}`,
          body: notificationBody,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
          badge: spidersToFeed,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilTrigger,
        },
      });

      console.log(
        `✅ Scheduled feeding notification at 12:00 (in ${Math.floor(secondsUntilTrigger / 60)} minutes) for ${spidersToFeed} spider(s)`,
      );
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }, [notificationsEnabled, spiders, t, cancelDailyNotification]);

  useEffect(() => {
    if (notificationsEnabled && spiders.length > 0) {
      scheduleDailyNotification();
    } else {
      cancelDailyNotification();
    }
  }, [
    notificationsEnabled,
    spiders,
    scheduleDailyNotification,
    cancelDailyNotification,
  ]);

  return {
    scheduleDailyNotification,
    cancelDailyNotification,
  };
}
