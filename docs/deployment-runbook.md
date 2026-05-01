# Deployment Runbook

Everything is automated through GitHub Actions.

## URLs

| Surface | URL |
|---------|-----|
| Docs | `https://mdkit.mp-lb.dev` by default, unless `docs_domain` is overridden |
| npm | `@mp-lb/mdkit` |

## Required Secrets

GitHub Actions needs these secrets:

- `GCP_PROJECT_ID`
- `GCP_SA_KEY`
- `VERCEL_API_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`
- `NPM_TOKEN`

Optional:

- `VERCEL_ORG_ID` for Vercel team projects

There is no `PRODUCTION_SECRETS` requirement because mdkit does not deploy a backend.

## Verify Docs Deploy

After `Deploy Docs` succeeds:

1. Open the docs URL.
2. Confirm the Quick Start page renders.
3. Confirm Terraform output includes `docs_url`.

## Verify npm Publish

After `Publish Package` succeeds:

```bash
npm view @mp-lb/mdkit dist-tags
npm view @mp-lb/mdkit versions --json
```

The workflow publishes run-numbered prereleases under the `main` npm tag.
