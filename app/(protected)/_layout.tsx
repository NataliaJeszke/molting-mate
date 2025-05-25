import { useEffect, useState } from "react";

import { Redirect, Stack } from "expo-router";
//import * as SplashScreen from "expo-splash-screen";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";

import { initDatabase } from "../../db/database";
import { useTranslation } from "@/hooks/useTranslation";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const { currentTheme, isLoggedIn } = useUserStore();
  const { t } = useTranslation();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setupDb = async () => {
      try {
        console.log("[🔐 ProtectedLayout] Inicjalizuję bazę danych...");
        await initDatabase();
        console.log("[✅ ProtectedLayout] Baza gotowa.");
        setDbReady(true);
      } catch (error) {
        console.error("[❌ ProtectedLayout] Błąd inicjalizacji bazy:", error);
      }
    };

    if (isLoggedIn) {
      setupDb();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors[currentTheme].tint} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
          animation: "fade",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="spiderForm"
        options={{
          presentation: "modal",
          title: t("spider-form.title"),
        }}
      />
      <Stack.Screen
        name="favourites"
        options={{
          title: t("favourites.title"),
          headerBackTitle: t("favourites.back"),
          headerTintColor: Colors[currentTheme].tint,
        }}
      />
      <Stack.Screen
        name="searched"
        options={({ route }) => {
          const { query } = (route.params as { query?: string }) || {};
          return {
            title: query
              ? `${t("searched.titlePrefix")} ${query}`
              : t("searched.titleDefault"),
            headerBackTitle: t("searched.back"),
            headerTintColor: Colors[currentTheme].tint,
          };
        }}
      />
      <Stack.Screen
        name="spider/[id]"
        options={{
          title: t("spider-detail.title"),
          headerBackTitle: t("spider-detail.back"),
          headerTintColor: Colors[currentTheme].tint,
        }}
      />
      <Stack.Screen
        name="manageModal"
        options={{
          presentation: "transparentModal",
          title: t("manage-modal.title"),
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
      <Stack.Screen
        name="addNewSPPtoList"
        options={{
          presentation: "modal",
          title: t("add-new-spp.title"),
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
