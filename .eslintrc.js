module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": ["error"],
    "import/named": ["off"],
    "import/no-unresolved": ["off"],
    "import/default": ["off"],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          ["builtin", "external"],
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "no-buffer-constructor": 1,
    "linebreak-style": ["error", "unix"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-this-alias": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
  },
}
