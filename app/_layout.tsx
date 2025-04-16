import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import {
  Platform,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";
import { StatusBar } from "@/components/ui/StatusBar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentTheme, userSelectedTheme, setTheme } = useUserStore();
  const systemTheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const Container = Platform.OS === "android" ? SafeAreaView : View;

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
        <StatusBar currentTheme={currentTheme} systemTheme={systemTheme} />
      </ThemeProvider>
    </Container>
  );
}