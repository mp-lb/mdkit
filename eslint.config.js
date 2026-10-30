import { createBaseEslintConfig } from "@mp-lb/fssstack-config/eslint";

export default [
  ...createBaseEslintConfig({
    tsconfigRootDir: import.meta.dirname,
    ignores: [
      "**/.fssstack/**",
      "apps/docs/build/**",
      "apps/docs/.source/**",
      "apps/docs/.react-router/**",
    ],
  }),
  {
    files: ["packages/mdkit/scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./packages/mdkit/tsconfig.scripts.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["packages/scripts/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./packages/scripts/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
