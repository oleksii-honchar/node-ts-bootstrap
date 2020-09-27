/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node").register({
  transpileOnly: true,
  files: true,
  project: "configs/tsconfig.es20.json",
});

const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require("../../configs/tsconfig.es20.json");

const baseUrl = "./"; // Either absolute or relative path. If relative it's resolved to current working directory.
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

const { stop } = require("../main");

module.exports = async function () {
  await stop();
};
