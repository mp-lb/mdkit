## Agent context

Shared agent instructions live in `context/`. `context/index.md` explicitly imports blocks with `@filename.md`, in order. Files that are not imported are not included.

Edit source blocks, not generated root files. To add a block, create it and add its import to the index. To remove one, remove the import and unused file. Keep rules short and specific to the actual project.

Run `zap task context-build` after changes. Review and commit the source changes together with `AGENTS.base.md`, `AGENTS.md`, and `CLAUDE.md`. Without personal additions, all three outputs should match. Missing shared imports are errors, not optional omissions.

Keep private and machine-specific instructions out of committed context. The compiler supports explicit extra context paths for a local working copy; never commit those additions. `zap task context-copy` restores the root agent files from the shared base.

Extensions are documented at `extensions/<extension>/README.md` in the FSS Stack source (read with `fm read extensions/<extension>/README.md --store mp-lb/fssstack`). Each extension owns its context and other payloads. When installing one, copy its context payload, adapt it to the project, add the import once, and rebuild. Merge updates into existing customized blocks instead of overwriting them.

# MDKit

A toolkit for building integrated, feature rich markdown editor experiences.

Read [PRODUCT.md](PRODUCT.md) if you need to understand the product.

## Development

Use Zapper for processes and tasks: `zap status`, `zap up`, `zap logs <service> --no-follow`, and `zap task <task>`. Inspect the existing stack before starting another copy. Services and tasks that need environment variables must receive Zapper's resolved environment.

Keep service names, dynamic ports and task commands in `zap.yaml`; do not hardcode development ports. Non-secret defaults live in `.env.local`; secrets belong in ignored `.env` or the configured secret source. Never put secret values in context.

The canonical tool versions are `.node-version` and `package.json#packageManager`; preserve them when changing local tooling or CI.

## Validation

For small changes, run `zap t check` to run linting and typechecking. For bigger system level changes run that and also `zap t build` to check that all the builds still succeed.

## Scripts

Write project scripts in TypeScript in the package that owns the behaviour, or `packages/scripts` when there is no natural owner, and include them in normal lint and typecheck checks. Expose each script as a thin Zap task that invokes it with `tsx` (for example, `zap t somemigration` runs `packages/scripts/somemigration.ts`); keep CI callers aligned when moving scripts.

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

Push `main` to deploy the services selected in `.arcnet/arcnet.yaml`; check the ArcNet workflow to confirm deployment.

Packages are selected by their `package.json`: use `private: true` for internal packages and `private: false` with `publishConfig.access: public` for packages intended for npm. The publisher scans immediate children of `packages/` and `apps/`; a missing `private` field also makes a package eligible. GitHub Packages uses its own registry configuration.

The npm workflow on pushes to `main` compares packed package contents with npm and publishes changed packages at the next patch version. ArcNet supplies the configured publishing credential through its `publish` secret consumer; the secret source must contain `NPM_TOKEN`. Check the workflow run to confirm publication. First publication may require an authenticated local publish, depending on npm credentials and trusted-publisher setup.

## MapLab workflow

Commit completed changes promptly, then use follow-up commits for fixes. Commit only your own changes; unrelated edits are normal and do not block work. Follow explicit project/user push preferences, and establish the preference once if unknown. Do not assume a push is harmless: it may trigger delivery.

Use Berth for project work and tasks; use `berth project list` and built-in help to locate the relevant project. Keep locally developed CLI tools built and linked after changing them. Run environment-dependent work through the project's Zap tasks.

## MapLab standards

Read relevant shared standards on demand with `fm read <file>.md --store mp-lb/dev`; list them with `fm ls --store mp-lb/dev`. Read capability setup at `fm read extensions/<extension>/README.md --store mp-lb/fssstack` and MapLab additions from `mp-lb/augmentations`.

Keep code focused and well organized, reuse domain schemas and shared components, and prefer sentence case for product copy and documentation. Follow project-specific architecture and validation policies. Document the project's actual Forum store/sync mapping in its documentation block; a project without a dedicated store does not need sync configuration.

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

## MapLab toolchain

Use mise to select the project's Node and pnpm versions from `.node-version` and `package.json#packageManager`. Do not duplicate version pins in mise configuration. Run `mise trust` and `mise install` when setting up a checkout; use an activated shell or `mise exec -- zap ...` so tasks inherit the selected tools. Zapper remains the task/process runner.

Prefer the installed tools' built-in help and verify authentication when needed; do not assume every cloud service is authenticated. Keep local CLI commands linked to the intended local build.

## Frontend

Use the UI framework and component library configured in the frontend package. For shadcn/ui frontends, add components from that package's directory with the shadcn CLI and reuse the existing utilities, preset and theme. Do not assume the frontend is named `apps/frontend`.

Keep components focused, reuse form schemas and existing loading/error patterns, and validate the affected frontend through its configured Zap tasks.

Frontend packages: `apps/mdkit-testbench`, `apps/frontend`. Run component installation in the relevant package.

## Backend

Keep application configuration at the app boundary and pass shared dependencies into packages. Reuse domain schemas rather than duplicating validation between API and UI. For tRPC backends, enforce authorization in procedures and test important behavior at the API boundary. Adapt this block to the selected backend and actual schema/package ownership.

Backend applications: `apps/backend`, `apps/mdkit-testbench-backend`.

## ArcNet secrets and variables

Read `.arcnet/arcnet.yaml` for the actual Forum sources and configured consumers. Source values live in those stores; encrypted snapshots under `.arcnet/secrets/` are committed. GitHub repository secrets contain CI decryption keys, not the plaintext source values.

After changing sources, run `arcnet secrets sync` or `arcnet variables sync` as appropriate and commit refreshed snapshots. Use `arcnet env check --password` for local validation and `arcnet env run --consumer <name> -- <command>` for a configured consumer. Keep plaintext, passwords and decryption keys out of context and Git.

These delivery sources are distinct from local `.env` secrets and `.env.local` non-secret defaults where the project uses those files.

## ArcNet

This project uses ArcNet. `.arcnet/arcnet.yaml` records its configured sources, consumers and selected deployment services. Read that configuration and the delivery block before changing infrastructure. Minimal installations may only manage secrets/variables; do not assume an application is deployed.

Keep deployment build paths, runtime entrypoints, health settings and domains aligned with the actual applications. Local databases are not automatically deployment services. Verify the relevant workflow and runtime result after delivery.

Setup and updates: `fm read extensions/arcnet/README.md --store mp-lb/fssstack` and `fm read SETUP.md --store mp-lb/arcnet`.

## Project mode

The project is currently in development and does not yet have production users. Data can be freely reset or removed, and schema changes can be made without requiring migrations or backward compatibility.

## Packages

- **`core`** - Browser-safe code: types, constants, schemas, pure functions. Safe to import anywhere including frontend.
- **`server`** - Node.js-only infrastructure: tRPC instance (`t`), logger, context types. Only import from backend.
- **`trpc`** - The tRPC router and procedures. Exports `createTrpcRouter` and `AppRouter` type.

Read the shared architecture philosophy with `fm read modular-monolith.md --store mp-lb/dev`.

## Running the Project

The project may well already be running in the background. Check and manage with:

```bash
zap ps
zap start someservice
zap logs someservice --no-follow
zap restart someservice
```

Check [zapper-usage.md](docs/zapper.md) for more details on running servers, restarting, viewing logs.

## Agent Responsibility

You are expected to check logs, check which services are running, update env vars. The developer will do most of the manual testing. You can test for debugging purposes but if there's auth its probably better to leave it to the developer.

All the servers have hot reloading so you would not need to restart after every code change. If something big or low level changes; or it seems broken it can be worth restarting.

IMPORTANT: `.env.local` is for non-secrets, its ok for you to view and edit it! The regular `.env` is for secrets so leave that to the dev, just ask them to update secrets.

## Domains

Use the project's deployment configuration and runbook for its actual canonical hostnames and authoritative DNS/provider ownership. For ArcNet, service domains live in `.arcnet/arcnet.yaml`; do not assume historical Terraform files control the current deployment.

A domain change must account for application URLs, CORS, auth callbacks, redirects and external integrations. Verify provider mappings, DNS, TLS and application health before retiring a working hostname. Use provider-reported DNS targets, not copied account-specific values.

Setup and updates: `fm read extensions/custom-domains/README.md --store mp-lb/fssstack`.

Configured service domains: `mdkit.mp-lb.dev`. Their service mapping is in `.arcnet/arcnet.yaml`.
