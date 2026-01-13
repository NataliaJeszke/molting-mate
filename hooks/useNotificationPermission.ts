import { useEffect, useCallback } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "./useTranslation";
import {
  registerBackgroundTaskAsync,
  unregisterBackgroundTaskAsync,
} from "@/services/backgroundNotifications";

export function useNotificationPermission() {
  const { t } = useTranslation();

  const notificationsEnabled = useUserStore(
    (state) => state.notificationsEnabled,
  );
  const hasAskedForNotifications = useUserStore(
    (state) => state.hasAskedForNotifications,
  );
  const setNotificationsEnabled = useUserStore(
    (state) => state.setNotificationsEnabled,
  );
  const setHasAskedForNotifications = useUserStore(
    (state) => state.setHasAskedForNotifications,
  );

  const checkSystemPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  }, []);

  const syncWithSystemPermission = useCallback(async () => {
    const isGranted = await checkSystemPermission();

    // Only sync if system permission was REVOKED
    // Don't override user's choice to disable notifications in-app
    if (!isGranted && notificationsEnabled) {
      setNotificationsEnabled(false);
    }
  }, [checkSystemPermission, notificationsEnabled, setNotificationsEnabled]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    const isGranted = status === "granted";
    setNotificationsEnabled(isGranted);
    return isGranted;
  }, [setNotificationsEnabled]);

  const showPermissionPrompt = useCallback(() => {
    Alert.alert(
      t("notifications.permission.title"),
      t("notifications.permission.message"),
      [
        {
          text: t("notifications.permission.deny"),
          style: "cancel",
          onPress: () => {
            setHasAskedForNotifications(true);
            setNotificationsEnabled(false);
          },
        },
        {
          text: t("notifications.permission.allow"),
          onPress: async () => {
            setHasAskedForNotifications(true);
            await requestPermission();
          },
        },
      ],
      { cancelable: false },
    );
  }, [
    t,
    setHasAskedForNotifications,
    setNotificationsEnabled,
    requestPermission,
  ]);

  useEffect(() => {
    if (!hasAskedForNotifications) {
      const timer = setTimeout(() => {
        showPermissionPrompt();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasAskedForNotifications, showPermissionPrompt]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        syncWithSystemPermission();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [syncWithSystemPermission]);

  useEffect(() => {
    if (hasAskedForNotifications) {
      syncWithSystemPermission();
    }
  }, [hasAskedForNotifications, syncWithSystemPermission]);

  useEffect(() => {
    if (notificationsEnabled) {
      registerBackgroundTaskAsync();
    } else {
      unregisterBackgroundTaskAsync();
    }
  }, [notificationsEnabled]);

  return {
    notificationsEnabled,
    requestPermission,
    checkSystemPermission,
    syncWithSystemPermission,
  };
}
