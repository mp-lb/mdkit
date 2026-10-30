<!-- Standard -->
## Agent context

Agent instructions are compiled from reusable blocks in `context/`, with `context/index.md` listing the blocks in order. This keeps shared and project-specific instructions easy to maintain.

Edit the blocks and index in `context/`, then run `zap task context-build` to regenerate `AGENTS.md` and `CLAUDE.md`.

## Code style

- Use PascalCase for components
- Files should have 1 export, and should be named the same. E.g. MyComponent lives in MyComponent.tsx
- Use camelCase for constants, functions, mongo collections
- Use train_case for typed strings
- File routers are an exception
- Generally 1 function/class per file

### Functional decomposition

Good functional decomposition is essential. This applies to react components, hooks, backend functions. Continuously abstract and centralise important code. Functions should be small and "do one thing".

### Code organization

Maintain an extreme approach to code organization. Functions/components should never be large or complex. Generally every function should have it's own file. Those files should be well organised. Continuously break down programs and organise files so that it's always crystal clear what modules relate to each other. You have permission to do this at all times. Flag concerns with the developer if unsure.

Take extra care when organizing tests.

### Tech debt

In general, follow the boy scout principle. But if you come across tech debt that's too big to address, add a .md doc to docs/tech-debt and raise it with the user.


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

## Standards

Read the relevant MAP Lab standards before changing the corresponding code. List them with `fm ls --store mp-lb/dev` and read one with `fm read <file>.md --store mp-lb/dev`.

- `style-guide.md` and `component-decomposition.md`: code and component structure.
- `crud.md`, `errors.md`, `trpc.md` and `logging.md`: backend APIs, services and error handling; list the store for current available guidance.
- `event-schema.md` and `event-sourcing.md`: event schemas and event-sourced domains.
- `libs.md`, `lib-release.md` and `clis.md`: libraries, publishing and command-line tools.
- `context-files.md`: maintaining agent context.



## Development

Use Zapper for processes and tasks: `zap status`, `zap up`, `zap logs <service> --no-follow`, and `zap task <task>`. Inspect the existing stack before starting another copy. Services and tasks that need environment variables must receive Zapper's resolved environment.

Keep service names, dynamic ports and task commands in `zap.yaml`; do not hardcode development ports. Non-secret defaults live in `.env.local`; secrets belong in ignored `.env` or the configured secret source. Never put secret values in context.

The canonical tool versions are `.node-version` and `package.json#packageManager`; preserve them when changing local tooling or CI.
### Local tool versions

Mise is the base layer: it selects Node and the package manager. Zapper runs tasks and services on top of those tools. Run `mise trust` and `mise install` for checkout setup, then use an activated mise shell or `mise exec -- zap task <task>`.

Read Node from `.node-version` and pnpm from `package.json#packageManager`; `mise.toml` reads these pins rather than duplicating them. npm projects use npm bundled with Node. Preserve the project's versions and package manager. Keep locally built CLI entrypoints in a version-independent PATH directory so switching Node does not hide `zap` or `fm`.


## Validation

For small changes, run `zap t check` to run linting and typechecking. For bigger system level changes run that and also `zap t build` to check that all the builds still succeed.

The developer will do most of the manual testing.

You can test for debugging purposes but if there's auth its probably better to leave it to the developer.

## Scripts

Write project scripts in TypeScript in the package that owns the behaviour, or `packages/scripts` when there is no natural owner, and include them in normal lint and typecheck checks. Expose each script as a thin Zap task that invokes it with `tsx` (for example, `zap t somemigration` runs `packages/scripts/somemigration.ts`); keep CI callers aligned when moving scripts.



## Documentation

Keep project-specific documentation in `docs/` and update it with behavior changes. Follow the project's own instructions for any Forum sync mapping; read shared standards and extension setup from their Forum stores.


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
## Delivery

Push `main` to deploy configured services and publish changed eligible npm packages; check the GitHub Actions runs.

<!-- Project types -->

## Frontend

Use shadcn/ui consistently for supported UI patterns. Reuse installed components before creating anything new; when a suitable component is missing, install it through the CLI rather than hand-building a substitute. Use the existing `cn` utility for conditional classes.

Run these commands from the frontend package containing `components.json`:

```sh
pnpm dlx shadcn@latest list @shadcn
pnpm dlx shadcn@latest search @shadcn -q dialog
pnpm dlx shadcn@latest add dialog
```

`components.json` defines component aliases and the theme CSS location; resolve its `aliases.ui` through the app's TypeScript aliases to find installed components. Review existing files before installation and preserve local customizations; do not blindly use `--overwrite`.

Use the shared theme tokens and existing component variants for colors, typography, spacing and radii. UI consistency takes priority over making one screen look different. Do not override theme-owned styles in individual components without a concrete reason; make intentional design-system changes at the shared theme or component level.

MAP Lab's public Shad repository provides additional components at `https://shad.mp-lb.dev`. Consult its catalog before building an equivalent, for example:

```sh
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/ui-states.json
```

CLI reference: https://ui.shadcn.com/docs/cli.


## Project UI

Frontend packages: `apps/mdkit-testbench`, `apps/frontend`. Run component installation in the relevant package.

Installed shadcn component locations: `apps/mdkit-testbench/src/components/ui` (configuration: `apps/mdkit-testbench/components.json`, theme: `apps/mdkit-testbench/src/index.css`); `apps/frontend/src/components/ui` (configuration: `apps/frontend/components.json`, theme: `apps/frontend/src/index.css`).

<!-- Extensions -->

## ArcNet

This project uses ArcNet. `.arcnet/arcnet.yaml` records its configured sources, consumers and selected deployment services. Read that configuration and the project’s delivery instructions before changing infrastructure. Minimal installations may only manage secrets/variables; do not assume an application is deployed.

Keep deployment build paths, runtime entrypoints, health settings and domains aligned with the actual applications. Local databases are not automatically deployment services. Verify the relevant workflow and runtime result after delivery.

Setup and updates: `fm read extensions/arcnet/README.md --store mp-lb/fssstack` and `fm read SETUP.md --store mp-lb/arcnet`.

## ArcNet secrets and variables

Read `.arcnet/arcnet.yaml` for the actual Forum sources and configured consumers. Source values live in those stores; encrypted snapshots under `.arcnet/secrets/` are committed. GitHub repository secrets contain CI decryption keys, not the plaintext source values.

After changing sources, run `arcnet secrets sync` or `arcnet variables sync` as appropriate and commit refreshed snapshots. Use `arcnet env check --password` for local validation and `arcnet env run --consumer <name> -- <command>` for a configured consumer. Keep plaintext, passwords and decryption keys out of context and Git.

These delivery sources are distinct from local `.env` secrets and `.env.local` non-secret defaults where the project uses those files.
