/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export type ThemeType = 'light' | 'dark';

const tintColorLight = '#2e1a47';
const tintColorDark = '#c9a7f5';

export const Colors = {
  light: {
    text: 'rgb(28, 28, 30)',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: {
      backgroundColor: '#ffffff',
      borderColor: '#a855f7',
      borderWidth: 0,
    },
    searchBar: {
      backgroundColor: '#ffffff',
      borderColor: '#C0C0C0',
      borderWidth: 0.5,
    },
    dot: {
      inactive: '#C0C0C0',
      active: '#2e1a47',
    }
  },
  dark: {
    text: 'rgb(255, 255, 255)',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: {
      backgroundColor: '#1f1f1f',
      borderColor: '#6a4c9c',
      borderWidth: 0.5,
    },
    searchBar: {
      backgroundColor: '#1f1f1f',
      borderColor: '#6a4c9c',
      borderWidth: 0.5,
    },
    dot: {
      inactive: '#C0C0C0',
      active: '#2e1a47',
    }
  },
};

