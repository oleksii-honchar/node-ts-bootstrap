const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.es20');

console.log("[config:jest] config loaded");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsConfig: '<rootDir>/configs/tsconfig.es20.json'
    }
  },
  globalSetup: "<rootDir>/src/__tests__/globalSetup.js",
  globalTeardown: "<rootDir>/src/__tests__/globalTeardown.js",
  rootDir: "../",
  roots: ["<rootDir>", "<rootDir>/src"],
  modulePaths: ["<rootDir>"],
  modulePathIgnorePatterns: [ "globalSetup", "globalTeardown" ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths,{ prefix: "<rootDir>" }),
  moduleDirectories: ["node_modules"],
  collectCoverage: false,
  coverageReporters: ["json", "lcov", "text"],
  collectCoverageFrom: ["**/src/**/*.ts", "!**/node_modules/**"],
  transform: {
    "^.+\\.ts$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
  },
};
