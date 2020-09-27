/* eslint-disable @typescript-eslint/no-var-requires */
require("ts-node").register({
  transpileOnly: true,
  files: true,
  project: "configs/tsconfig.es20.json",
});

const tsConfigPaths = require("tsconfig-paths");
const envCmd = require("env-cmd");
const path = require("path");
const util = require("util");
const childProcess = require("child_process");
const tsConfig = require("../../configs/tsconfig.es20.json");

const exec = util.promisify(childProcess.exec);

const baseUrl = "./"; // Either absolute or relative path. If relative it's resolved to current working directory.
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

module.exports = async function () {
  await exec("npm run docker:up:test");

  const projectEnvVars = await envCmd.GetEnvVars({
    envFile: {
      filePath: path.join(__dirname, "../../project.env"),
    },
    verbose: true,
  });

  const testEnvVars = await envCmd.GetEnvVars({
    envFile: {
      filePath: path.join(__dirname, "../../configs/envs/test.env"),
    },
    verbose: true,
  });

  const envVars = {
    ...testEnvVars,
    ...projectEnvVars,
  };

  Object.keys(envVars).forEach((key) => (process.env[key] = envVars[key]));

  const { start } = require("../main");
  const { dbService } = require("@src/services");

  await start(envVars);
  await dbService.dropAllTables();
};
