module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime",
  ],
}
