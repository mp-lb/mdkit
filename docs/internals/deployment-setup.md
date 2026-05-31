# Deployment Setup

One-time setup for docs deployment and npm publishing.

## Google Cloud

Google Cloud is only used for Terraform state. It does not host any mdkit app code.

The deployment workflow expects a state bucket named:

```bash
${GCP_PROJECT_ID}-terraform-state
```

If that bucket already exists from the shared setup, no new Google Cloud setup is needed.

The service account in `GCP_SA_KEY` needs access to read and write that bucket.

## Cloudflare

Terraform manages the DNS record for `mdkit.mp-lb.dev`.

- `mp-lb.dev` must exist as a Cloudflare zone.
- Create or update a Cloudflare API token with:
  - `Zone -> Zone -> Read`
  - `Zone -> DNS -> Edit`
- Scope the token to `Zone Resources -> Include -> Specific zone -> mp-lb.dev`.
- Add the token as `CLOUDFLARE_API_TOKEN`.
- Add the `mp-lb.dev` zone ID as `CLOUDFLARE_ZONE_ID`.

## Vercel

- Create a Vercel API token and add it as `VERCEL_API_TOKEN`.
- If the project belongs to a Vercel team, add the team/org ID as `VERCEL_ORG_ID`.

## npm

Create an npm automation token with publish access to `@mp-lb/mdkit` and add it as `NPM_TOKEN`.

## GitHub Secrets

Required:

| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | GCP project ID that owns the Terraform state bucket |
| `GCP_SA_KEY` | Service account JSON with access to the state bucket |
| `VERCEL_API_TOKEN` | Vercel API token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare DNS token scoped to `mp-lb.dev` |
| `CLOUDFLARE_ZONE_ID` | Cloudflare zone ID for `mp-lb.dev` |
| `NPM_TOKEN` | npm automation token |

Optional:

| Secret | Value |
|--------|-------|
| `VERCEL_ORG_ID` | Vercel team/org ID |

## Upload Secrets

Put the required values in `prod-secrets.txt` using dotenv format, then run:

```bash
scripts/set-github-actions-secrets.sh prod-secrets.txt
```

To target a specific repo explicitly:

```bash
scripts/set-github-actions-secrets.sh prod-secrets.txt --repo mp-lb/mdkit
```

The script uses `gh secret set -f`, so values are encrypted by the GitHub CLI and are not printed. After a successful upload, it deletes `prod-secrets.txt`.
