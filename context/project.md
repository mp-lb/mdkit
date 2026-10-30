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

## Documentation

Read these before making changes:

- **`env-vars.md` in `mp-lb/dev`** - Must read when adding or modifying environment variables
- **[deployment-runbook.md](docs/tech/deployment-runbook.md)** - Production URLs and secrets checklist
- **[deployment-setup.md](docs/tech/deployment-setup.md)** - Project deployment setup and infrastructure notes
- **`style-guide.md` in `mp-lb/dev`** - For significant code changes
- **`crud.md` in `mp-lb/dev`** - For implementing simple CRUD patterns
- **`errors.md` in `mp-lb/dev`** - For throwing and handling errors
- **`trpc.md` in `mp-lb/dev`** - For doing frontend queries/mutations
- **`logging.md` in `mp-lb/dev`** - For logging on backend (via tRPC context) and frontend
- **`event-schema.md` in `mp-lb/dev`** - For sending/storing any kind of events: errors, logs, analytics, real time events follow this

This project has no dedicated Forum store or `.forum/` sync configuration. Read shared standards with `fm read <file>.md --store mp-lb/dev` (list them with `fm ls --store mp-lb/dev`). Read shared extensions with `fm read extensions/<extension>/README.md --store mp-lb/fssstack` (list them with `fm ls extensions --store mp-lb/fssstack`).

## Project UI

Frontend packages: `apps/mdkit-testbench`, `apps/frontend`. Run component installation in the relevant package.

Installed shadcn component locations: `apps/mdkit-testbench/src/components/ui` (configuration: `apps/mdkit-testbench/components.json`, theme: `apps/mdkit-testbench/src/index.css`); `apps/frontend/src/components/ui` (configuration: `apps/frontend/components.json`, theme: `apps/frontend/src/index.css`).

## Validation

For small changes, run `zap t check` to run linting and typechecking. For bigger system level changes run that and also `zap t build` to check that all the builds still succeed.

The developer will do most of the manual testing.

You can test for debugging purposes but if there's auth its probably better to leave it to the developer.
