import React from "react";
import {
  StyleSheet,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUserStore } from "@/store/userStore";
import { Theme } from "@/constants/Theme.enums";
import { ThemeType } from "@/constants/Colors";
import { ThemedText } from "@/components/ui/ThemedText";
import WrapperComponent from "@/components/ui/WrapperComponent";
import CardComponent from "@/components/ui/CardComponent";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfileScreen() {
  const { currentTheme, toggleTheme } = useUserStore();
  const { t } = useTranslation();
  const toggleHasOnboarded = useUserStore((store) => store.toggleHasOnboarded);
  const defaultTheme = Theme.DARK;

  return (
    <WrapperComponent>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <View style={styles(currentTheme).profileHeader}>
          <View style={styles(currentTheme).avatarContainer}>
            <View style={styles(currentTheme).avatar}>
              <ThemedText style={styles(currentTheme).avatarInitial}>
                U
              </ThemedText>
            </View>
          </View>
          <ThemedText type="title" style={styles(currentTheme).username}>
            {t("profile.user")}
          </ThemedText>
          <ThemedText style={styles(currentTheme).userSubtitle}>
            {t("profile.subtitle")}
          </ThemedText>
        </View>

        {/* Settings */}
        <CardComponent customStyle={styles(currentTheme).settingsCard}>
          <ThemedText type="subtitle" style={styles(currentTheme).sectionTitle}>
            {t("profile.settings")}
          </ThemedText>

          {/* Theme Toggle */}
          <View style={styles(currentTheme).settingRow}>
            <View style={styles(currentTheme).settingLabelContainer}>
              <Ionicons
                name="color-palette-outline"
                size={22}
                color={currentTheme === "dark" ? "#c9a7f5" : "#2e1a47"}
              />
              <ThemedText style={styles(currentTheme).settingLabel}>
                {t("profile.dark_mode")}
              </ThemedText>
            </View>
            <Switch
              value={currentTheme === defaultTheme}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#767577",
                true: currentTheme === "dark" ? "#6a4c9c" : "#a855f7",
              }}
              thumbColor={
                currentTheme === defaultTheme
                  ? currentTheme === "dark"
                    ? "#c9a7f5"
                    : "#2e1a47"
                  : "#f4f3f4"
              }
            />
          </View>

          {/* Notifications */}
          <View style={styles(currentTheme).settingRow}>
            <View style={styles(currentTheme).settingLabelContainer}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={currentTheme === "dark" ? "#c9a7f5" : "#2e1a47"}
              />
              <ThemedText style={styles(currentTheme).settingLabel}>
                {t("profile.notifications")}
              </ThemedText>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{
                false: "#767577",
                true: currentTheme === "dark" ? "#6a4c9c" : "#a855f7",
              }}
              thumbColor={
                true
                  ? currentTheme === "dark"
                    ? "#c9a7f5"
                    : "#2e1a47"
                  : "#f4f3f4"
              }
            />
          </View>

          {/* Account Settings */}
          <ThemedText
            type="subtitle"
            style={[styles(currentTheme).sectionTitle, { marginTop: 20 }]}
          >
            {t("profile.account.title")}
          </ThemedText>

          <TouchableOpacity style={styles(currentTheme).settingRow}>
            <View style={styles(currentTheme).settingLabelContainer}>
              <Ionicons
                name="person-outline"
                size={22}
                color={currentTheme === "dark" ? "#c9a7f5" : "#2e1a47"}
              />
              <ThemedText style={styles(currentTheme).settingLabel}>
                {t("profile.account.edit_profile")}
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={currentTheme === "dark" ? "#9BA1A6" : "#687076"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles(currentTheme).settingRow}>
            <View style={styles(currentTheme).settingLabelContainer}>
              <Ionicons
                name="key-outline"
                size={22}
                color={currentTheme === "dark" ? "#c9a7f5" : "#2e1a47"}
              />
              <ThemedText style={styles(currentTheme).settingLabel}>
                {t("profile.account.change_password")}
              </ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={currentTheme === "dark" ? "#9BA1A6" : "#687076"}
            />
          </TouchableOpacity>

          {/* Back to Onboarding Button */}
          <TouchableOpacity
            style={styles(currentTheme).onboardingButton}
            onPress={toggleHasOnboarded}
          >
            <ThemedText style={styles(currentTheme).onboardingButtonText}>
              Powrót do ekranu powitalnego
            </ThemedText>
          </TouchableOpacity>
        </CardComponent>

        {/* App Info */}
        <CardComponent customStyle={styles(currentTheme).infoCard}>
          <ThemedText style={styles(currentTheme).appVersion}>
            Molting Mate v.1.0.0
          </ThemedText>
        </CardComponent>
      </ScrollView>
    </WrapperComponent>
  );
}

/* eslint-disable react-native/no-unused-styles */
const styles = (theme: ThemeType) =>
  StyleSheet.create({
    profileHeader: {
      alignItems: "center",
      paddingVertical: 24,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme === "dark" ? "#6a4c9c" : "#a855f7",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarInitial: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#fff",
    },
    username: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 4,
    },
    userSubtitle: {
      fontSize: 16,
      color: theme === "dark" ? "#9BA1A6" : "#687076",
      marginBottom: 8,
    },
    settingsCard: {
      borderRadius: 16,
      marginBottom: 16,
      padding: 20,
      ...(theme === "dark"
        ? {
            backgroundColor: "#1f1f1f",
            borderColor: "#6a4c9c",
            borderWidth: 0.5,
          }
        : {
            backgroundColor: "#ffffff",
            borderColor: "#a855f7",
            borderWidth: 0,
          }),
      shadowColor: theme === "dark" ? "#000" : "#2e1a47",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "dark" ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    settingLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingLabel: {
      fontSize: 16,
      marginLeft: 12,
    },
    pickerContainer: {
      borderRadius: 8,
      marginTop: 8,
      marginBottom: 8,
      overflow: "hidden",
      ...(theme === "dark"
        ? {
            backgroundColor: "#2a2a2c",
            borderColor: "#6a4c9c",
            borderWidth: 0.5,
          }
        : {
            backgroundColor: "#f7f7f7",
            borderColor: "#e0e0e0",
            borderWidth: 0.5,
          }),
    },
    picker: {
      height: 50,
      width: "100%",
      color: theme === "dark" ? "white" : "black",
    },
    languageSelector: {
      marginTop: 8,
      marginBottom: 16,
    },
    languageOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      backgroundColor: theme === "dark" ? "#2a2a2c" : "#f7f7f7",
    },
    languageOptionSelected: {
      backgroundColor:
        theme === "dark"
          ? "rgba(201, 167, 245, 0.1)"
          : "rgba(46, 26, 71, 0.05)",
      borderColor: theme === "dark" ? "#6a4c9c" : "#a855f7",
    },
    languageFlag: {
      marginRight: 12,
      fontSize: 20,
    },
    flagEmoji: {
      fontSize: 20,
    },
    languageText: {
      fontSize: 16,
      flex: 1,
    },
    languageTextSelected: {
      fontWeight: "600",
      color: theme === "dark" ? "#c9a7f5" : "#2e1a47",
    },
    checkIcon: {
      marginLeft: 8,
    },
    onboardingButton: {
      marginTop: 24,
      backgroundColor: theme === "dark" ? "#c9a7f5" : "#2e1a47",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    onboardingButtonText: {
      color: theme === "dark" ? "#1f1f1f" : "#ffffff",
      fontWeight: "600",
      fontSize: 16,
    },
    infoCard: {
      alignItems: "center",
      padding: 16,
      marginBottom: 24,
    },
    appVersion: {
      fontSize: 14,
      color: theme === "dark" ? "#9BA1A6" : "#687076",
    },
  });
