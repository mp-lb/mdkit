# MDKit

A toolkit for building integrated, feature rich markdown editor experiences.

Read [PRODUCT.md](PRODUCT.md) if you need to understand the product.

### Packages

- **`core`** - Browser-safe code: types, constants, schemas, pure functions. Safe to import anywhere including frontend.
- **`server`** - Node.js-only infrastructure: tRPC instance (`t`), logger, context types. Only import from backend.
- **`trpc`** - The tRPC router and procedures. Exports `createTrpcRouter` and `AppRouter` type.

Read the shared architecture philosophy with `fm read modular-monolith.md --store mp-lb/dev`.

### Project mode

The project is currently in development and does not yet have production users. Data can be freely reset or removed, and schema changes can be made without requiring migrations or backward compatibility.

### Related tooling

Shared tooling is developed in sibling checkouts under `~/Work`: Zapper (`zapper`) runs tasks, Forum (`forum`) provides `fm`, Tools (`tools`) provides ArcNet, and Stackforge (`stackforge`) owns setup conventions. When a change belongs in an owned dependency, inspect and update that source repository as needed, follow its `AGENTS.md`, then rebuild/relink the CLI or update the consuming dependency. Verify the command resolves to the intended build.

### Development

Manage running services and non-secret environment configuration as part of development. Rely on hot reload for ordinary edits; restart services for non-hot-reloadable changes or when diagnosing a broken process. Leave secret `.env` updates to the developer.

See [Zapper usage](docs/zapper.md) for starting/restarting services and viewing logs.
