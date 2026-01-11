import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";

import { parse } from "date-fns";

import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";

const BACKGROUND_FETCH_TASK = "background-feeding-notification";
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

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log("🔄 Daily background task running at:", new Date().toISOString());

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

    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);

    if (spidersToFeedToday === 0) {
      console.log("✅ No spiders to feed today");
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(NOTIFICATION_HOUR, 0, 0, 0);

    const secondsUntilNoon = Math.floor(
      (triggerDate.getTime() - now.getTime()) / 1000,
    );

    if (secondsUntilNoon > 0) {
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: "🕷️ Czas na karmienie!",
          body:
            spidersToFeedToday === 1
              ? "Masz 1 pająka do nakarmienia dzisiaj"
              : `Masz ${spidersToFeedToday} pająków do nakarmienia dzisiaj`,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilNoon,
        },
      });

      console.log(
        `📅 Notification scheduled for 12:00 (in ${Math.floor(secondsUntilNoon / 60)} minutes)`,
      );
    } else {
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: "🕷️ Czas na karmienie!",
          body:
            spidersToFeedToday === 1
              ? "Masz 1 pająka do nakarmienia dzisiaj"
              : `Masz ${spidersToFeedToday} pająków do nakarmienia dzisiaj`,
          sound: "default",
          badge: spidersToFeedToday,
        },
        trigger: null,
      });
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("❌ Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchAsync(): Promise<boolean> {
  try {
    const status = await BackgroundFetch.getStatusAsync();

    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 24 * 60 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("✅ Background task registered (runs once daily)");
    } else {
      console.log("ℹ️ Background task already registered");
    }

    return true;
  } catch (error) {
    console.error("❌ Error registering background task:", error);
    return false;
  }
}

export async function unregisterBackgroundFetchAsync(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );

    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log("✅ Background task unregistered");
    }

    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
  } catch (error) {
    console.error("❌ Error unregistering background task:", error);
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
    console.error("❌ Error checking notifications:", error);
  }
}
