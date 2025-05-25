import React, { useEffect, useState } from "react";
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

import { loadUserStore, useUserStore } from "@/store/userStore";

import StatusBar from "@/components/ui/StatusBar";

import * as SplashScreen from "expo-splash-screen";
import { isLoggedIn } from "@/lib/authService";
import { initDatabase } from "@/db/database";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { currentTheme, userSelectedTheme, setTheme, logIn } = useUserStore();
  const systemTheme = useColorScheme();
  const Container = Platform.OS === "android" ? SafeAreaView : View;

  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    if (!userSelectedTheme && systemTheme) {
      setTheme(systemTheme);
    }
  }, [userSelectedTheme, systemTheme, setTheme]);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        console.log("🚀 Rozpoczynam inicjalizację aplikacji...");

        await loadUserStore();
        console.log("✅ Store użytkownika załadowany");

        const userLoggedIn = await isLoggedIn();

        if (userLoggedIn) {
          console.log("👤 Użytkownik zalogowany, inicjalizuję bazę danych...");
          logIn();

          await initDatabase();
          console.log("✅ Baza danych zainicjalizowana");
        } else {
          console.log(
            "ℹ️ Użytkownik nie jest zalogowany, pomijam inicjalizację bazy",
          );
        }

        setInitializationComplete(true);
        console.log("✅ Inicjalizacja aplikacji zakończona");
      } catch (error) {
        console.error("❌ Błąd podczas inicjalizacji aplikacji:", error);
        setInitializationComplete(true);
      }
    };

    prepareApp();
  }, [logIn]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if ((fontsLoaded || fontsError) && initializationComplete) {
        try {
          await SplashScreen.hideAsync();
          setAppReady(true);
          console.log("✅ Splash screen ukryty, aplikacja gotowa");
        } catch (error) {
          console.error("❌ Błąd podczas ukrywania splash screen:", error);
          setAppReady(true);
        }
      }
    };

    hideSplashScreen();
  }, [fontsLoaded, fontsError, initializationComplete]);

  if (!appReady) {
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
        <StatusBar currentTheme={currentTheme} systemTheme={systemTheme} />
        <Stack>
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, animation: "none" }}
          ></Stack.Screen>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              animation: "none",
            }}
          ></Stack.Screen>
        </Stack>
      </ThemeProvider>
    </Container>
  );
}
