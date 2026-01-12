import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { SpiderDetailType } from "@/db/database";
import { useUserStore } from "@/store/userStore";
import {
  registerBackgroundTaskAsync,
  unregisterBackgroundTaskAsync,
  checkFeedingNotificationsNow,
} from "@/services/backgroundNotifications";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useFeedingNotifications(spiders: SpiderDetailType[]) {
  const notificationsEnabled = useUserStore(
    (store) => store.notificationsEnabled,
  );

  useEffect(() => {
    if (notificationsEnabled) {
      registerBackgroundTaskAsync();
    } else {
      unregisterBackgroundTaskAsync();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (notificationsEnabled && spiders.length > 0) {
      checkFeedingNotificationsNow();
    }
  }, [notificationsEnabled, spiders]);
}
