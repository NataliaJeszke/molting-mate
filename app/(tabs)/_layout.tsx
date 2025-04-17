import React from "react";
import { Platform } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

import { useUserStore } from "@/store/userStore";

import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/ui/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const { currentTheme } = useUserStore();
  const hasFinishedOnboarding = useUserStore(
    (state) => state.hasFinishedOnboarding,
  );

  if (!hasFinishedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[currentTheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="molting"
        options={{
          title: "Linienie",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="tshirt-v" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feeding"
        options={{
          title: "Karmienie",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="utensils" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Kolekcja",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="bugs" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="spider-web" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
