import { defineConfig, mergeConfig } from "vitest/config";
import nodeConfig from "../../etc/vitest.node.config";

export default mergeConfig(
  nodeConfig,
  defineConfig({
    resolve: {
      alias: {
        "@mp-lb/mdkit/core": "../../packages/mdkit/src/core/index.ts",
        "@mp-lb/mdkit/fastify": "../../packages/mdkit/src/fastify.ts",
        "@mp-lb/mdkit/server": "../../packages/mdkit/src/server.ts",
        "@mp-lb/mdkit/trpc/client": "../../packages/mdkit/src/trpc/client.ts",
        "@mp-lb/mdkit/trpc/server": "../../packages/mdkit/src/trpc/server.ts",
        "@mp-lb/mdkit/trpc": "../../packages/mdkit/src/trpc.ts",
        "@mp-lb/mdkit": "../../packages/mdkit/src/index.ts",
      },
      conditions: ["source"],
    },
  }),
);
