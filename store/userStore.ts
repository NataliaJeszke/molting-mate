import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  hasFinishedOnboarding: boolean;
  toggleHasOnboarded: () => void;
  currentTheme: "light" | "dark";
  toggleTheme: () => void;
};

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      hasFinishedOnboarding: false,
      currentTheme: "light",
      toggleHasOnboarded: () => {
        return set((state) => ({
          ...state,
          hasFinishedOnboarding: !state.hasFinishedOnboarding,
        }));
      },
      toggleTheme: () => {
        return set((state) => ({
          ...state,
          currentTheme: state.currentTheme === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: "moltingmate-user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
