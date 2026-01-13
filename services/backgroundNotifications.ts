import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";

import { parse } from "date-fns";

import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { t } from "@/language/i18n";
import { getDatabase, isDatabaseReady } from "@/db/database";

// Helper to safely get database - uses shared connection when available
const getDatabaseSafely = async (): Promise<SQLite.SQLiteDatabase | null> => {
  try {
    // If database is already initialized, use the shared connection
    if (isDatabaseReady()) {
      return await getDatabase();
    }
    // For background tasks when app might not be fully initialized,
    // open a separate connection
    return await SQLite.openDatabaseAsync("spiders.db");
  } catch (error) {
    console.warn("Failed to get database:", error);
    return null;
  }
};

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
const NOTIFICATION_MINUTE = 0;

// Minimum interval for background task (in seconds)
// Android WorkManager has 15 min minimum, we set to 4 hours for battery efficiency
const BACKGROUND_TASK_INTERVAL = 4 * 60 * 60; // 4 hours

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

const getSpidersToFeed = async (): Promise<number> => {
  const db = await getDatabaseSafely();
  if (!db) {
    return 0;
  }

  const spiders = await db.getAllAsync<{
    lastFed: string;
    feedingFrequency: string;
  }>(`SELECT lastFed, feedingFrequency FROM spiders`);

  return spiders.filter((spider) => {
    const status = getFeedingStatus(
      spider.lastFed,
      spider.feedingFrequency as FeedingFrequency,
    );
    return (
      status === FeedingStatus.FEED_TODAY || status === FeedingStatus.HUNGRY
    );
  }).length;
};

/**
 * Schedule a daily notification at noon.
 * Called only by background task.
 * If it's already past noon, skip today and schedule for tomorrow.
 */
async function scheduleDailyNotification(): Promise<void> {
  try {
    // Cancel existing scheduled notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

    const spidersToFeedToday = await getSpidersToFeed();

    // Update badge count
    await Notifications.setBadgeCountAsync(spidersToFeedToday);

    if (spidersToFeedToday === 0) {
      return;
    }

    const notificationTitle = t("notifications.background.title");
    const notificationBody =
      spidersToFeedToday === 1
        ? t("notifications.background.bodySingular")
        : t("notifications.background.bodyPlural", {
            count: spidersToFeedToday,
          });

    // Schedule daily notification for noon
    // If it's past noon today, it will fire tomorrow at noon
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: notificationTitle,
        body: notificationBody,
        sound: "default",
        badge: spidersToFeedToday,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: NOTIFICATION_HOUR,
        minute: NOTIFICATION_MINUTE,
      },
    });
  } catch (error) {
    console.error("Error scheduling daily notification:", error);
  }
}

// Define background task - runs periodically to update the scheduled notification
// On Android: WorkManager runs this when system allows (every few hours)
// On iOS: Background App Refresh runs this periodically
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    // Recalculate spiders to feed and update the scheduled notification
    await scheduleDailyNotification();

    return BackgroundTask?.BackgroundTaskResult?.Success ?? 1;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundTask?.BackgroundTaskResult?.Failed ?? 0;
  }
});

export async function registerBackgroundTaskAsync(): Promise<boolean> {
  try {
    if (!BackgroundTask) {
      console.warn("Background task module not available");
      return false;
    }

    const status = await BackgroundTask.getStatusAsync();

    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.warn("Background tasks are restricted by the system");
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_TASK_IDENTIFIER,
    );

    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
        minimumInterval: BACKGROUND_TASK_INTERVAL,
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
    // Cancel scheduled notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

    // Clear badge
    await Notifications.setBadgeCountAsync(0);

    // Unregister background task
    if (BackgroundTask) {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_TASK_IDENTIFIER,
      );

      if (isRegistered) {
        try {
          await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
        } catch {
          // Task might not exist in BackgroundTask module
        }
      }
    }
  } catch (error) {
    console.error("Error unregistering background task:", error);
  }
}

export async function checkFeedingNotificationsNow(): Promise<void> {
  try {
    // Only update badge count - notification scheduling is handled by background task
    const spidersToFeedToday = await getSpidersToFeed();
    await Notifications.setBadgeCountAsync(spidersToFeedToday);
  } catch (error) {
    console.error("Error checking notifications:", error);
  }
}
