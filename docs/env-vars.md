# Environment Variables

## Mental Model

Environment variables have two orthogonal properties:

| | **Not Secret** | **Secret** |
|---|---|---|
| **Present in both envs** | Standard case | Needs secure handling |
| **Only in one env** | Local debugging / prod-only services | Rare |

**Key insight:** "Secret" is a property of the value in a specific environment, not of the variable itself. `DATABASE_URL` might be `localhost:5432/dev` locally (not secret) but `user:password@prod-host` in prod (secret).

**Values are always different between environments.** We never try to share values. What we share is the list of variables each app validates and consumes.

## Where Things Live

| Environment | Not Secret | Secret |
|-------------|------------|--------|
| **Local** | `.env.local` (committed) | `.env` (gitignored) |
| **Prod** | `.env.production` (committed) | GitHub Secrets |

The storage location implies secrecy — no metadata needed.

## Minimal env vars

Treat configuration as part of your deployment contract: use environment variables only for values that **vary by environment, are secrets, or must be changed without a deploy**, and keep everything else in typed code config (e.g., a `config.ts`). For example, `REMAIL_API_KEY` → env var (secret), `EMAIL_PROVIDER` → env var if it differs between dev/staging/prod, but `REMAIL_SENDER_EMAIL` → code config if it’s stable like `no-reply@yourdomain.com`. Avoid grouping things into env vars just because they’re related—this increases operational overhead and failure risk. Prefer code config for stable, non-sensitive application decisions, env vars for deployment-specific and operational concerns, and always validate env inputs at startup; if a value needs frequent non-engineering changes, it likely belongs in a database, feature flag, or admin system instead.

## Adding a New Environment Variable

### Standard case (present in both envs, not secret)

1. Add to `zap.yaml` under the service's `env:` array
2. Add value to `.env.local` (local value)
3. Add value to the deployment environment when deployment exists
4. Add to app's `src/config.ts` for validation

### Secret (in prod)

1. Add local value to `.env.local` or `.env` (depending on local secrecy)
2. Add prod value to the deployment secret store when deployment exists
3. **Add to [deployment-runbook.md](./deployment-runbook.md)** "Production Secrets" table when deployment exists

### Local-only variable

1. Add to `zap.yaml` only
2. Add to `.env.local` or `.env`
3. Don't add it to deployment config

### Prod-only variable

1. Add it to deployment config when deployment exists
2. Don't add it to `zap.yaml` or `.env.local`

## File Reference

| File | Committed | Purpose |
|------|-----------|---------|
| `.env.local` | Yes | Local non-secret values |
| `.env` | No | Local secret values |
| deployment env config | Depends | Added later with deployment |

## GitHub Secrets Baseline

mdkit's production automation only deploys the docs site and publishes the npm package.

Required secrets:

- `GCP_PROJECT_ID`
- `GCP_SA_KEY`
- `VERCEL_API_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`
- `NPM_TOKEN`

Optional:

- `VERCEL_ORG_ID` — set when deploying to a Vercel team.

## Config Validation

Each app validates its env vars at startup:

```typescript
// apps/api/src/config.ts
import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(["development", "production"]).default("production"),
  API_PORT: z.string().transform(Number),
  PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

## Packages

Packages must NOT access `process.env` directly. They receive config through context:

```typescript
// App validates and wires
import { env } from './config';
createClient(env.DATABASE_URL);

// Package receives, never reads process.env
export function createClient(databaseUrl: string) { ... }
```
