const TerserPlugin = require("terser-webpack-plugin");

console.log("[config:webpack:snippet] Production loaded");

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.[tj]sx?$|\.css$|\.html$/,
        exclude: [
          /\.(spec|e2e)\.js$/,
          /node_modules/,
        ],
        parallel: true,
      }),
    ],
  }
};
