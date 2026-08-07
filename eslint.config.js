import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import lit from "eslint-plugin-lit";
import litA11y from "eslint-plugin-lit-a11y";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  lit.configs["flat/recommended"],
  // lit-a11y ships a legacy config; register the plugin + its rules manually
  // for flat config.
  {
    plugins: { "lit-a11y": litA11y },
    rules: litA11y.configs.recommended.rules,
  },
  {
    ignores: ["dist/", "node_modules/", "test-results/", "playwright-report/"],
  },
  {
    rules: {
      // Pragmatic strictness for this codebase
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // a11y: keyboard support on clickable elements is mandatory
      "lit-a11y/click-events-have-key-events": "error",
      "lit-a11y/tabindex-no-positive": "error",
    },
  }
);
