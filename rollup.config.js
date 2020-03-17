//rollup.config.js
import commonjs from "@rollup/plugin-commonjs"

import babel from "rollup-plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import typescript from "rollup-plugin-typescript2"
import json from "@rollup/plugin-json"
import builtins from "rollup-plugin-node-builtins"

const env = process.env.NODE_ENV

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "lib",
      format: "cjs",
      sourcemap: true
    }
  ],
  external: ["lodash"],
  plugins: [
    typescript(),
    builtins(),
    babel({
      exclude: ["node_modules/**"],
      runtimeHelpers: true
    }),
    resolve({
      browser: true,
      preferBuiltins: true
    }),
    json(),
    commonjs({
      namedExports: {
        elliptic: ["ec"],
        events: ["EventEmitter"],
        "big.js": ["Big"]
      }
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(env)
    })
  ]
}
