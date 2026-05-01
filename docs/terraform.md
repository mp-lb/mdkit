# Terraform & Docs Deployment

Infrastructure is intentionally small. Terraform only manages the public mdkit docs site:

- Vercel project for the VitePress docs build
- Vercel custom domain
- Optional Cloudflare DNS record for the docs domain
- Remote Terraform state in a Google Cloud Storage bucket

There is no production backend, database, worker, Docker registry, or testbench deployment.

## Files

```
infra/
├── main.tf        # Providers and GCS backend configuration
├── docs.tf        # Vercel docs project and domain
├── dns.tf         # Optional Cloudflare DNS record
├── outputs.tf     # Docs URL, Vercel project ID, DNS record
└── variables.tf   # Inputs
```

## Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `GCP_PROJECT_ID` | GCP project that owns the Terraform state bucket |
| `GCP_SA_KEY` | Service account JSON with access to the state bucket |
| `VERCEL_API_TOKEN` | Vercel API token for project/domain management and deploys |
| `CLOUDFLARE_API_TOKEN` | Cloudflare token when Terraform manages DNS |
| `CLOUDFLARE_ZONE_ID` | Cloudflare zone ID when Terraform manages DNS |
| `VERCEL_ORG_ID` | Optional. Use when the Vercel project belongs to a team |

For npm publishing, also set:

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | npm automation token for publishing `@mp-lb/mdkit` |

## Deployment

Docs deploy automatically from `.github/workflows/deploy-docs.yml` on pushes to `main` that affect the mdkit package, docs deployment config, or workspace dependency files.

The workflow:

1. Authenticates to Google Cloud for Terraform state.
2. Runs `terraform apply` in `infra/`.
3. Installs dependencies.
4. Runs `pnpm --filter=@mp-lb/mdkit docs:build`.
5. Deploys `packages/mdkit/docs/.vitepress/dist` to Vercel.

Manual deployment is available through the workflow dispatch button in GitHub Actions.

## Publishing

`.github/workflows/publish.yml` publishes `@mp-lb/mdkit` to npm on relevant pushes to `main`.

The workflow sets a prerelease version using the GitHub run number, then runs:

```bash
pnpm --filter=@mp-lb/mdkit typecheck
pnpm --filter=@mp-lb/mdkit test
pnpm --filter=@mp-lb/mdkit build
pnpm --filter=@mp-lb/mdkit docs:build
pnpm --filter=@mp-lb/mdkit publish --no-git-checks --provenance --tag main
```
