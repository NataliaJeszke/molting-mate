import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { FeedingStatus } from "@/constants/FeedingStatus.enums";
import { parse } from "date-fns";

const BACKGROUND_FETCH_TASK = "background-feeding-notification";
const NOTIFICATION_ID = "daily-feeding-reminder";

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
  try {
    const db = await SQLite.openDatabaseAsync("spiders.db");

    const spiders = await db.getAllAsync<{
      lastFed: string;
      feedingFrequency: string;
    }>(`SELECT lastFed, feedingFrequency FROM spiders`);

    const spidersToFeed = spiders.filter((spider) => {
      const status = getFeedingStatus(
        spider.lastFed,
        spider.feedingFrequency as FeedingFrequency,
      );
      return status === FeedingStatus.FEED_TODAY;
    }).length;

    if (spidersToFeed === 0) {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const currentHour = new Date().getHours();
    if (currentHour < 11 || currentHour > 13) {
      const now = new Date();
      const triggerDate = new Date();
      triggerDate.setHours(12, 0, 0, 0);

      if (now.getHours() >= 12) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      const secondsUntilTrigger = Math.floor(
        (triggerDate.getTime() - now.getTime()) / 1000,
      );

      if (secondsUntilTrigger > 0) {
        await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
        await Notifications.scheduleNotificationAsync({
          identifier: NOTIFICATION_ID,
          content: {
            title: "🕷️ Karmienie pająka",
            body:
              spidersToFeed === 1
                ? "Dzisiaj nakarm pająka"
                : "Dzisiaj masz do nakarmienia pająki",
            sound: "default",
            badge: spidersToFeed,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsUntilTrigger,
          },
        });
      }

      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title: "🕷️ Karmienie pająka",
        body:
          spidersToFeed === 1
            ? "Dzisiaj nakarm pająka"
            : "Dzisiaj masz do nakarmienia pająki",
        sound: "default",
        badge: spidersToFeed,
      },
      trigger: null,
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("❌ Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchAsync() {
  try {
    const status = await BackgroundFetch.getStatusAsync();

    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      console.log("⚠️ Background fetch is restricted or denied");
      return false;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }

    return true;
  } catch (error) {
    console.error("❌ Error registering background task:", error);
    return false;
  }
}

export async function unregisterBackgroundFetchAsync() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );

    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
  } catch (error) {
    console.error("❌ Error unregistering background task:", error);
  }
}
