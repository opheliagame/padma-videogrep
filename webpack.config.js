const path = require("path");

module.exports = {
  mode: "production",
  entry: "./app/utils/nearleyEntry.js",
  output: {
    filename: "nearley-bundle.js",
    path: path.resolve(__dirname, "dist"),
    globalObject: "globalThis",
  },
  resolve: {
    extensions: [".js"],
  },
};
