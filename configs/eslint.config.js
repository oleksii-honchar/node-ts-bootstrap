console.log("[config:eslint] config loaded");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaVersion: 2018,
    errorOnUnknownASTType: true,
    errorOnTypeScriptSyntacticAndSemanticIssues: true,
    project: "tsconfig.json",
    sourceType: "module"
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  rules: {
    "class-methods-use-this": "off",
    "default-case": "off",
    "dot-notation": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/no-unresolved": "error",
    "import/no-extraneous-dependencies": "off", // we using bundled js - no deps loaded in prod
    "import/prefer-default-export": "off",
    "jest/no-disabled-tests": 1,
    "jest/no-focused-tests": 1,
    "jest/no-identical-title": 2,
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "max-len": [
      "error",
      {
        code: 124,
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    "no-throw-literal": "off",
    "no-unused-vars": "off",
    "no-underscore-dangle": "off",
    "object-curly-spacing": ["error", "always"],
    "prettier/prettier": ["error", { printWidth: 124 }],
    "quote-props": ["error", "consistent-as-needed"],
    "radix": "off",
    "function-paren-newline": "off",
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  env: {
    browser: false,
    node: true,
    es6: true,
    "jest/globals": true
  },
  globals: {
    beforeEach: true,
    afterEach: true,
    describe: true,
    it: true,
    expect: true,
  },
  plugins: [
    "@typescript-eslint",
    "jest",
    "json",
    "node",
    "prettier",
    "import"
  ],
  settings: {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {}
    }
  },
  root: true,
  ignorePatterns: ["/node_modules/*", "/configs/*", "/devops/*", "/scripts/*", ".eslintrc.js", "**/*.d.ts", "*.json"],
};
