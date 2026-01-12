import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

import { parse } from "date-fns";

import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { t } from "@/language/i18n";

let BackgroundTask: typeof import("expo-background-task") | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  BackgroundTask = require("expo-background-task");
} catch {
  // expo-background-task not available
}

const BACKGROUND_TASK_IDENTIFIER = "background-feeding-check";
const NOTIFICATION_ID = "daily-feeding-reminder";
const NOTIFICATION_HOUR = 12;

const getFeedingStatus = (
  lastFed: string,
  frequencyInDays: FeedingFrequency,
): FeedingStatus | null => {
  if (!lastFed || !frequencyInDays) return null;

  const lastFedDate = parse(lastFed, "yyyy-MM-dd", new Date());
  const today = new Date();

  if (isNaN(lastFedDate.getTime())) return null;

  const frequencyMap: Record<FeedingFrequency, number> = {
    [FeedingFrequency.FewTimesWeek]: 3,
    [FeedingFrequency.OnceWeek]: 7,
    [FeedingFrequency.OnceTwoWeeks]: 14,
    [FeedingFrequency.OnceMonth]: 30,
    [FeedingFrequency.Rarely]: 60,
  };

  const frequency = frequencyMap[frequencyInDays];
  const daysSinceLastFed = Math.floor(
    (today.getTime() - lastFedDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSinceLastFed === frequency) return FeedingStatus.FEED_TODAY;
  if (daysSinceLastFed > frequency) return FeedingStatus.HUNGRY;

  return FeedingStatus.NOT_HUNGRY;
};

TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  const now = new Date();

  try {
    const db = await SQLite.openDatabaseAsync("spiders.db");

    const spiders = await db.getAllAsync<{
      lastFed: string;
      feedingFrequency: string;
    }>(`SELECT lastFed, feedingFrequency FROM spiders`);

    const spidersToFeedToday = spiders.filter((spider) => {
      const status = getFeedingStatus(
        spider.lastFed,
        spider.feedingFrequency as FeedingFrequency,
      );
      return (
        status === FeedingStatus.FEED_TODAY || status === FeedingStatus.HUNGRY
      );
    }).length;

    await Notifications.setBadgeCountAsync(spidersToFeedToday);

    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

    if (spidersToFeedToday === 0) {
      return BackgroundTask?.BackgroundTaskResult?.Success ?? 1;
    }

    const triggerDate = new Date();
    triggerDate.setHours(NOTIFICATION_HOUR, 0, 0, 0);

    const secondsUntilNoon = Math.floor(
      (triggerDate.getTime() - now.getTime()) / 1000,
    );

    const notificationTitle = t("notifications.background.title");
    const notificationBody =
      spidersToFeedToday === 1
        ? t("notifications.background.bodySingular")
        : t("notifications.background.bodyPlural", {
            count: spidersToFeedToday,
          });

    if (secondsUntilNoon > 0) {
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: notificationTitle,
          body: notificationBody,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilNoon,
        },
      });
    } else {
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: notificationTitle,
          body: notificationBody,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: null,
      });
    }

    return BackgroundTask?.BackgroundTaskResult?.Success ?? 1;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundTask?.BackgroundTaskResult?.Failed ?? 0;
  }
});

export async function registerBackgroundTaskAsync(): Promise<boolean> {
  if (Platform.OS === "ios" && !BackgroundTask) {
    return false;
  }

  try {
    if (!BackgroundTask) {
      return false;
    }

    const status = await BackgroundTask.getStatusAsync();

    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_TASK_IDENTIFIER,
    );

    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
        minimumInterval: 60,
      });
    }

    return true;
  } catch (error) {
    console.error("Error registering background task:", error);
    return false;
  }
}

export async function unregisterBackgroundTaskAsync(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_TASK_IDENTIFIER,
    );

    if (isRegistered && BackgroundTask) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
    }

    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
  } catch (error) {
    console.error("Error unregistering background task:", error);
  }
}

export async function checkFeedingNotificationsNow(): Promise<void> {
  try {
    const db = await SQLite.openDatabaseAsync("spiders.db");

    const spiders = await db.getAllAsync<{
      lastFed: string;
      feedingFrequency: string;
    }>(`SELECT lastFed, feedingFrequency FROM spiders`);

    const spidersToFeedToday = spiders.filter((spider) => {
      const status = getFeedingStatus(
        spider.lastFed,
        spider.feedingFrequency as FeedingFrequency,
      );
      return (
        status === FeedingStatus.FEED_TODAY || status === FeedingStatus.HUNGRY
      );
    }).length;

    await Notifications.setBadgeCountAsync(spidersToFeedToday);
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
}
