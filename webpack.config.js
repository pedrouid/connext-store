const path = require("path");
const pkg = require("./package.json");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    libraryTarget: "umd",
    library: pkg.name,
    umdNamedDefine: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: "source-map",
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  }
};
