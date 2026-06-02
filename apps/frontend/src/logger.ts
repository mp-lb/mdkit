import { createClientLogger } from "@mp-lb/fssstack-platform/logger/client";
import { env } from "./config";

export const logger = createClientLogger({
  source: { platform: "web", env: env.APP_ENV },
});
