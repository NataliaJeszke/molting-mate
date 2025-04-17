const path = require("path");
const currentDir = path.resolve();

module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "react-native", "import"],
  rules: {
    "prettier/prettier": "error",
    "react-native/no-unused-styles": "error",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", path.resolve(currentDir, "src")]],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
