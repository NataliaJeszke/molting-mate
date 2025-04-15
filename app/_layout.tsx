import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentTheme, userSelectedTheme, setTheme } = useUserStore();
  const systemTheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (!userSelectedTheme && systemTheme) {
      setTheme(systemTheme);
    }
  }, [userSelectedTheme, systemTheme]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
