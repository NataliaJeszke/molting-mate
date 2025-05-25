import { ThemeType } from "@/constants/Colors";
import { Language } from "@/constants/Language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import * as Localization from "expo-localization";

type UserState = {
  isLoggedIn: boolean;
  hasFinishedOnboarding: boolean;
  currentTheme: ThemeType;
  userSelectedTheme: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  toggleHasOnboarded: () => void;
  logIn: () => void;
  logOut: () => void;
};
export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
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

  logIn: () =>
    set(() => ({
      isLoggedIn: true,
    })),

  logOut: () =>
    set(() => ({
      isLoggedIn: false,
    })),
}));

export const loadUserStore = async () => {
  console.log("🔄 Loading user store...");
  try {
    const storedData = await AsyncStorage.getItem("moltingmate-user-store");
    const sessionData = await getLoginSession();

    const systemLang = Localization.getLocales()[0]?.languageCode;
    const defaultLang = systemLang === "pl" ? Language.PL : Language.EN;

    const defaultState: Partial<UserState> = {
      isLoggedIn: sessionData !== null,
      hasFinishedOnboarding: false,
      currentTheme: "light",
      userSelectedTheme: false,
      language: defaultLang,
    };

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      const mergedState = {
        ...defaultState,
        ...parsedData,
        language: defaultLang,
        isLoggedIn: sessionData !== null,
      };

      useUserStore.setState(mergedState);
      console.log("✅ Loaded store with login state:", mergedState.isLoggedIn);
      console.log("🌍 Language set to:", defaultLang);
    } else {
      useUserStore.setState(defaultState);
      console.log("🆕 First launch - initialized with defaults");
    }
  } catch (error) {
    console.error("❌ Error loading user store:", error);
  }
};

export const isLoggedIn = async () => {
  try {
    const storedData = await AsyncStorage.getItem("moltingmate-user-store");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return parsedData.isLoggedIn === true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error checking login status:", error);
    return false;
  }
};

export const saveLoginSession = async (userData: any) => {
  try {
    await AsyncStorage.setItem("user-session", JSON.stringify(userData));
    console.log("✅ Login session saved");
  } catch (error) {
    console.error("❌ Error saving login session:", error);
  }
};

export const clearLoginSession = async () => {
  try {
    await AsyncStorage.removeItem("user-session");
    console.log("✅ Login session cleared");
  } catch (error) {
    console.error("❌ Error clearing login session:", error);
  }
};

export const getLoginSession = async () => {
  try {
    const session = await AsyncStorage.getItem("user-session");
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("❌ Error getting login session:", error);
    return null;
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
