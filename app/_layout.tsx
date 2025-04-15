import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentTheme } = useUserStore();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
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
            title: "Dodaj pająka do kolekcji",
          }}
        />
        <Stack.Screen
          name="favourites"
          options={{
            title: "Ulubione pająki",
            headerBackTitle: "Wstecz",
            headerTintColor: Colors[currentTheme].tint,
          }}
        />
        <Stack.Screen
          name="manageModal"
          options={{
            presentation: "transparentModal",
            title: "Wymagana akcja",
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
