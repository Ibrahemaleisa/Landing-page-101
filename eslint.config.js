// @ts-check
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.astro/**",
      "**/node_modules/**",
      "test-results/**",
      "playwright-report/**",
      "docs/reports/**",
      // placeholders replaced by create-landing; the generated files are linted in the new site
      "templates/starter/src/content/index.ts",
      "templates/starter/src/site.ts",
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // role="list" on styled lists is deliberate: Safari/VoiceOver drops list semantics when
      // list-style is none
      "astro/jsx-a11y/no-redundant-roles": ["error", { ul: ["list"], ol: ["list"] }],
      // scrollable regions and code blocks must be keyboard-focusable to be scrollable (WCAG 2.1.1)
      "astro/jsx-a11y/no-noninteractive-tabindex": ["error", { tags: ["pre"], roles: ["region", "tabpanel"] }],
    },
  },
);
