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
