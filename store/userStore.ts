// import { ThemeType } from "@/constants/Colors";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// type UserState = {
//   hasFinishedOnboarding: boolean;
//   currentTheme: ThemeType;
//   userSelectedTheme: boolean;
//   setTheme: (theme: ThemeType) => void;
//   toggleTheme: () => void;
//   toggleHasOnboarded: () => void;
// };

// export const useUserStore = create(
//   persist<UserState>(
//     (set) => ({
//       hasFinishedOnboarding: false,
//       currentTheme: "light",
//       userSelectedTheme: false,
//       toggleHasOnboarded: () =>
//         set((state) => ({
//           ...state,
//           hasFinishedOnboarding: !state.hasFinishedOnboarding,
//         })),
//       toggleTheme: () =>
//         set((state) => ({
//           ...state,
//           currentTheme: state.currentTheme === "light" ? "dark" : "light",
//           userSelectedTheme: true,
//         })),
//       setTheme: (theme) =>
//         set(() => ({
//           currentTheme: theme,
//           userSelectedTheme: true,
//         })),
//     }),
//     {
//       name: "moltingmate-user-store",
//       storage: createJSONStorage(() => AsyncStorage),
//     },
//   ),
// );

import { ThemeType } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type UserState = {
  hasFinishedOnboarding: boolean;
  currentTheme: ThemeType;
  userSelectedTheme: boolean;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  toggleHasOnboarded: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  hasFinishedOnboarding: false,
  currentTheme: "light",
  userSelectedTheme: false,
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
}));

const loadUserStore = async () => {
  try {
    const storedData = await AsyncStorage.getItem("moltingmate-user-store");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      useUserStore.setState(parsedData);
    }
  } catch (error) {
    console.error("Error loading user store:", error);
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
