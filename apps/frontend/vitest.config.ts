import { defineConfig, mergeConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import reactConfig from "../../etc/vitest.react.config";

export default mergeConfig(
  reactConfig,
  defineConfig({
    plugins: [react()] as any,
    test: {
      setupFiles: ["./src/test-setup.ts"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }),
);
