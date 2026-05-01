# Deployment Runbook

Everything is automated. Push to `main` and it deploys.

## URLs

| Service | URL |
|---------|-----|
| Frontend | https://helloworld.maplab.dev |
| Backend | https://api.helloworld.maplab.dev |

## Production Secrets

Secrets must be set in **GitHub Secrets** as a single repo-level secret named `PRODUCTION_SECRETS`.
Each line is `KEY=value`. CI appends these to `.env.production` at deploy time.

Required entries for Hello World (if used):
- `MONGODB_URL` (backend)

Terraform-specific secrets (set as GitHub Secrets, not in `PRODUCTION_SECRETS`):
- `UPSTASH_EMAIL`
- `UPSTASH_API_KEY`
- `UPSTASH_REDIS_URL` (optional if your Upstash account already has a Redis DB)

Non-secret prod config belongs in `.env.production` (committed).

`REDIS_URL` is provisioned by Terraform (Upstash) and injected into the backend and worker. Do not include it in `PRODUCTION_SECRETS`.

## Verify

After deploy:
- Frontend loads at https://helloworld.maplab.dev
- Backend responds at https://api.helloworld.maplab.dev/health

## Related

- [env-vars.md](./env-vars.md) - Environment variable management
