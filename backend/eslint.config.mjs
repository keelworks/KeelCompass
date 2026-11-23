import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // this codebase's existing convention for "intentionally unused" -
      // a handful of migrations/middleware already name unused params
      // _, _req, _next rather than omitting them for signature clarity
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  pluginJs.configs.recommended,
];
