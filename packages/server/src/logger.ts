// Adopts the shared FSS Stack logger rather than carrying its own copy.
// Re-exported here so existing import sites are unchanged. The shared logger
// uses a single root pino instance, real pino child() bindings, opt-in pretty
// printing via LOG_PRETTY=true, and a per-logger level override (pass
// { level: "silent" } to mute in tests).
export {
  createLogger,
  logger,
  type Logger,
  type LogMeta,
} from "@mp-lb/fssstack-platform/logger/server";
