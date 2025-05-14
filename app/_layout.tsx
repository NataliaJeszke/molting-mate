import { useEffect } from "react";
import { Platform, View, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";

import StatusBar from "@/components/ui/StatusBar";
import { initDatabase } from "@/db/database";
import { useTranslation } from "@/hooks/useTranslation";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentTheme, userSelectedTheme, setTheme } = useUserStore();
  const systemTheme = useColorScheme();
  const { t } = useTranslation();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const Container = Platform.OS === "android" ? SafeAreaView : View;

  useEffect(() => {
    if (!userSelectedTheme && systemTheme) {
      setTheme(systemTheme);
    }
  }, [userSelectedTheme, systemTheme, setTheme]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <Container
      style={{
        flex: 1,
        backgroundColor:
          currentTheme === "dark"
            ? DarkTheme.colors.background
            : DefaultTheme.colors.background,
      }}
    >
      <ThemeProvider value={currentTheme === "dark" ? DarkTheme : DefaultTheme}>
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
              title: t("spider.title"),
              headerBackTitle: t("spider.back"),
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
        <StatusBar currentTheme={currentTheme} systemTheme={systemTheme} />
      </ThemeProvider>
    </Container>
  );
}
