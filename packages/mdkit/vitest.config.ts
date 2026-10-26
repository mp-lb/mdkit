import { defineConfig, mergeConfig } from "vitest/config";
import reactConfig from "../../etc/vitest.react.config";

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["./src/test/setup.ts"],
    },
  }),
);
