module.exports = {
  presets: [
    [
      "babel-preset-expo",
      {
        unstable_transformImportMeta: true,
      },
    ],
  ],
  plugins: [
    "react-native-reanimated/plugin",
  ],
};
