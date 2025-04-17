/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export type ThemeType = "light" | "dark";

const tintColorLight = "#2e1a47";
const tintColorDark = "#c9a7f5";

export const Colors = {
  light: {
    text: "rgb(28, 28, 30)",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    card: {
      backgroundColor: "#ffffff",
      borderColor: "#a855f7",
      borderWidth: 0,
    },
    searchBar: {
      backgroundColor: "#ffffff",
      borderColor: "#C0C0C0",
      borderWidth: 0.5,
    },
    dot: {
      inactive: "#C0C0C0",
      active: "#2e1a47",
    },
    title: "#2e1a47",
    spiderImage: {
      backgroundColor: "#ffffff",
      borderColor: "#a855f7",
      borderWidth: 0,
    },
    button: {
      text: {
        color: "#ffffff",
      },
    },
    picker: {
      background: "#ffffff",
      text: "#151718",
      borderColor: "#a855f7",
      label: {
        color: "#6e6e6e",
      },
    },
    warning: {
      text: "#FF0000",
    },
    info: {
      text: tintColorLight,
    },
    input: {
      label: "#6e6e6e",
      placeholder: "#6e6e6e",
    },
    datepicker: {
      button: {
        confirm: tintColorLight,
        cancel: "#151718",
      },
      background: "#ffffff",
    },
    feedingStatus: {
      hungry: "#FF0000",
      feedToday: "#00FF00",
      notHungry: "#FFA500",
    }
  },
  dark: {
    text: "rgb(255, 255, 255)",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    card: {
      backgroundColor: "#1f1f1f",
      borderColor: "#6a4c9c",
      borderWidth: 0.5,
    },
    searchBar: {
      backgroundColor: "#1f1f1f",
      borderColor: "#6a4c9c",
      borderWidth: 0.5,
    },
    dot: {
      inactive: "#C0C0C0",
      active: "#2e1a47",
    },
    title: "#2e1a47",
    spiderImage: {
      backgroundColor: "#ffffff",
      borderColor: "#a855f7",
      borderWidth: 0,
    },
    button: {
      text: {
        color: "#1f1f1f",
      },
    },
    picker: {
      background: "#1f1f1f",
      text: "#ffffff",
      borderColor: "#6a4c9c",
      label: {
        color: "#c0c0c0",
      },
    },
    warning: {
      text: "#FF0000",
    },
    info: {
      text: tintColorDark,
    },
    input: {
      label: "#c0c0c0",
      placeholder: "#c0c0c0",
    },
    datepicker: {
      button: {
        confirm: tintColorDark,
        cancel: "#151718",
      },
      background: "#1f1f1f",
    },
    feedingStatus: {
      hungry: "#FF0000",
      feedToday: "#00FF00",
      notHungry: "#FFA500",
    }
  },
};
