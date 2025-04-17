const path = require("path");

module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-native", "import"],
  rules: {
    "prettier/prettier": "error",
    "react-native/no-unused-styles": "error",
    "import/no-unresolved": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {},
      alias: {
        map: [["@", path.resolve(__dirname)]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};