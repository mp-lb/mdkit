# Managing Services & Infrastructure

Guide for adding/modifying services in Orb0 infrastructure.

## Configuration Files

* **`zap.yaml`** - Local services (`bare_metal` for Node.js apps, `docker` for containers)

* **`infra/`** **(Terraform)** - Docs deployment infrastructure (Vercel and optional Cloudflare DNS)

* **`.env`/`.env.local`** - Environment variables for local dev

## Adding a New Service

### 1. Choose a Local Port

Use an unused local port to avoid conflicts with other projects:

```bash
node -e 'console.log(1024 + Math.floor(Math.random() * 8976))'
```

### 2. Add to zap.yaml

**Node.js service:**

```yaml
native:
  my-service:
    cmd: pnpm --filter=@mp-lb/my-service dev
    env:
      - MY_SERVICE_PORT
```

**Docker service:**

```yaml
docker:
  my-database:
    image: postgres:16
    ports:
      - "31594:5432"  # random:container
    env:
      - POSTGRES_DB=myapp
```

### 3. Add Environment Variables

In `.env`, then whitelist in the service's `env:` array in `zap.yaml`.

### 4. Add deployment infrastructure if needed

The current production setup only deploys the docs site. Add Terraform resources only when the service truly needs production infrastructure.

### 5. Create package.json

Use `@mp-lb/package-name` naming with `dev`, `start`, and `build` scripts.

### 6. Update orbitos.code-workspace

Add the new folder, maintain general priority order.

### 7. Update buildAll Task

Add to `buildAll` task in `zap.yaml` if the service is buildable.

### 8. Start Service

```bash
zap up my-service
```

## Environment Variables Checklist

When adding env vars, update:

* `.env` / `.env.local`

* `zap.yaml` service's `env:` array

## Quick Reference

```bash
zap status                      # Check running services
zap up my-service              # Start service
zap restart my-service         # Restart after changes
zap logs my-service --no-follow
```

See [zapper-usage.md](./zapper-usage.md) for more commands.
