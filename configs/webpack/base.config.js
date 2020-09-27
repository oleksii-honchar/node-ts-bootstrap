const path = require("path");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

console.log("[config:webpack:snippet] Base loaded");

module.exports = (env) => ({
  target: "node",
  cache: true,
  entry: {
    "bundle": "./src/main.ts",
  },
  stats: {
    warnings: false
  },
  resolve: {
    alias: {
      'pg-native': 'noop2',
      tedious: 'noop2',
      sqlite3: 'noop2',
      mysql2: 'noop2',
    },
    extensions: [".js", ".jsx", ".html", ".ts", ".tsx"],
    modules: [
      "src",
      "node_modules",
    ],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: path.join(__dirname, "../tsconfig.es20.json"),
        logLevel: "info"
      })
    ]
  },
  output: {
    chunkFilename: '[name].chunk.js',
    filename: "[name].js",
    path: path.join(__dirname, "../../dist"),
    publicPath: "./assets/",
    sourceMapFilename: "[name].map",
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new LoaderOptionsPlugin({
      debug: process.env.NODE_ENV !== "production",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets",
          to: "./assets",
          globOptions: {
            ignore: ["*.js.map", "*.css.map"]
          }
        },
        {
          from: "./src/swagger.json",
          to: "./swagger.json"
        },
      ]
    })
  ],
  node: { // for wa should be false
    fs: "empty",
    global: true,
    crypto: "empty",
    process: true,
    console: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
    __dirname: false,
    __filename: false
  },
  watchOptions: {
    aggregateTimeout: 3000,
  } 
});
