import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    env: {
      node: true,
    },
    globals: {
      ...globals.node,
    },
  },
  pluginJs.configs.recommended,
];
