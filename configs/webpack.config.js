const { merge } = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// Short usage reference
// `NODE_ENV` = development | test | production
// `LOG_LEVEL` = error | warn | info | debug

const pkg = require("../package.json");

const moduleCfg = require("./webpack/module.config");
const baseCfg = require("./webpack/base.config");
const prodConfig = require("./webpack/prod.config");

console.log(`[config:webpack] "${pkg.name}" config composition started`);

module.exports = (env) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  console.log(`[config:webpack] "${process.env.NODE_ENV}" mode used...`);

  let config = baseCfg(env);

  config = merge(config, moduleCfg);

  if (env.BUILD_ANALYZE === "true") {
    console.log("[config:webpack] bundle analyzer included");

    config = merge(config, {
      plugins: [ new BundleAnalyzerPlugin() ]
    });
  }

  if (process.env.NODE_ENV !== "production") {
    config = merge(config, {
      devtool: "inline-source-map",
    });

    console.log("[config:webpack] config composition completed");

    return config;
  }

  const mainConfig = merge(config, prodConfig);
  const configWithMaps = merge(config, {
    output: {
      filename: "[name]-with-map.js"
    },
    devtool: "inline-source-map"
  });
  config = [ mainConfig, configWithMaps ];

  console.log("[config:webpack] clean prod & prod+maps configs prepared ");
  console.log("[config:webpack] config composition completed");

  return config;
}
