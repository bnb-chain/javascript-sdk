//rollup.config.js
import commonjs from "@rollup/plugin-commonjs"

import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import typescript from "rollup-plugin-typescript2"
import json from "@rollup/plugin-json"
import { terser } from "rollup-plugin-terser"

const env = process.env.NODE_ENV

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "cjs",
    sourcemap: true,
    exports: "named"
  },
  external: ["lodash"],
  experimentalCodeSplitting: true,
  plugins: [
    typescript(),
    babel({
      exclude: ["node_modules/**"],
      runtimeHelpers: true
    }),
    resolve(),
    json(),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        elliptic: ["ec"],
        events: ["EventEmitter"]
      }
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    }),
    env === "production" && terser()
  ]
}
