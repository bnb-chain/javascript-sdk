module.exports = {
  parserOptions: {
    parser: require.resolve("babel-eslint"),
    ecmaVersion: 2018,
    sourceType: "module"
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true
  },
  extends: "eslint:recommended",
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["warn", "double"],
    semi: ["warn", "never"],
    "no-buffer-constructor": 1,
    indent: ["error", 2, { SwitchCase: 1 }]
  }
}
