const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/customVis",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/i, use: "babel-loader" },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
    ],
  },
};
