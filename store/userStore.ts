import { ThemeType } from "@/constants/Colors";
import { Language } from "@/constants/Language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import * as Localization from "expo-localization";

type UserState = {
  hasFinishedOnboarding: boolean;
  currentTheme: ThemeType;
  userSelectedTheme: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  toggleHasOnboarded: () => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
};
export const useUserStore = create<UserState>((set) => ({
  hasFinishedOnboarding: false,
  currentTheme: "light",
  userSelectedTheme: false,
  language: Language.EN,
  setLanguage: (lang: Language) =>
    set(() => ({
      language: lang,
    })),
  toggleHasOnboarded: () =>
    set((state) => ({
      ...state,
      hasFinishedOnboarding: !state.hasFinishedOnboarding,
    })),
  toggleTheme: () =>
    set((state) => ({
      ...state,
      currentTheme: state.currentTheme === "light" ? "dark" : "light",
      userSelectedTheme: true,
    })),
  setTheme: (theme) =>
    set(() => ({
      currentTheme: theme,
      userSelectedTheme: true,
    })),

  notificationsEnabled: true,
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
}));

const loadUserStore = async () => {
  try {
    const storedData = await AsyncStorage.getItem("moltingmate-user-store");

    const systemLang = Localization.getLocales()[0]?.languageCode;
    const defaultLang = systemLang === "pl" ? Language.PL : Language.EN;

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      parsedData.language = defaultLang;

      useUserStore.setState(parsedData);
    } else {
      useUserStore.setState({
        hasFinishedOnboarding: false,
        currentTheme: "light",
        userSelectedTheme: false,
        language: defaultLang,
        notificationsEnabled: true,
      });
    }
  } catch (error) {
    console.error("❌ Error loading user store:", error);
  }
};

const saveUserStore = async () => {
  try {
    const state = useUserStore.getState();
    await AsyncStorage.setItem("moltingmate-user-store", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving user store:", error);
  }
};

useUserStore.subscribe(saveUserStore);

loadUserStore();
