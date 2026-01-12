import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

import { parse } from "date-fns";

import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

// Dynamic import to handle simulator case gracefully
let BackgroundTask: typeof import("expo-background-task") | null = null;

try {
  BackgroundTask = require("expo-background-task");
} catch {
  console.log("expo-background-task not available (likely running on simulator)");
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

// Define the background task
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  const now = new Date();
  console.log("Background task running at:", now.toISOString());

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

    // Update badge count
    await Notifications.setBadgeCountAsync(spidersToFeedToday);

    // Cancel any existing scheduled notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

    if (spidersToFeedToday === 0) {
      console.log("No spiders to feed today");
      return BackgroundTask?.BackgroundTaskResult?.Success ?? 1;
    }

    // Calculate time until noon
    const triggerDate = new Date();
    triggerDate.setHours(NOTIFICATION_HOUR, 0, 0, 0);

    const secondsUntilNoon = Math.floor(
      (triggerDate.getTime() - now.getTime()) / 1000,
    );

    // Schedule notification for noon if we haven't passed it yet
    if (secondsUntilNoon > 0) {
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: "Czas na karmienie!",
          body:
            spidersToFeedToday === 1
              ? "Masz 1 pajaka do nakarmienia dzisiaj"
              : `Masz ${spidersToFeedToday} pajakow do nakarmienia dzisiaj`,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilNoon,
        },
      });

      console.log(
        `Notification scheduled for 12:00 (in ${Math.floor(secondsUntilNoon / 60)} minutes)`,
      );
    } else {
      // It's past noon, show notification now
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: "Czas na karmienie!",
          body:
            spidersToFeedToday === 1
              ? "Masz 1 pajaka do nakarmienia dzisiaj"
              : `Masz ${spidersToFeedToday} pajakow do nakarmienia dzisiaj`,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: null,
      });

      console.log("Notification shown immediately (past noon)");
    }

    return BackgroundTask?.BackgroundTaskResult?.Success ?? 1;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundTask?.BackgroundTaskResult?.Failed ?? 0;
  }
});

export async function registerBackgroundTaskAsync(): Promise<boolean> {
  // Background tasks are not available on iOS simulator
  if (Platform.OS === "ios" && !BackgroundTask) {
    console.log("Background tasks not available (simulator or module not loaded)");
    return false;
  }

  try {
    if (!BackgroundTask) {
      console.log("BackgroundTask module not available");
      return false;
    }

    const status = await BackgroundTask.getStatusAsync();

    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) {
      console.log("Background task status restricted (likely on simulator)");
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_TASK_IDENTIFIER,
    );

    if (!isRegistered) {
      // Register task with minimum interval of 60 minutes (runs ~once per hour)
      // The system will execute it at optimal times
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
        minimumInterval: 60, // minutes (minimum is 15)
      });
      console.log("Background task registered (runs approximately hourly)");
    } else {
      console.log("Background task already registered");
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
      console.log("Background task unregistered");
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
