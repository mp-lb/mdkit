# Deployment Setup

One-time setup for docs deployment and npm publishing.

## Google Cloud

Google Cloud is only used for the Terraform state bucket.

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud iam service-accounts create terraform --display-name="Terraform"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:terraform@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud iam service-accounts keys create terraform-key.json \
  --iam-account=terraform@YOUR_PROJECT_ID.iam.gserviceaccount.com

gsutil mb -p YOUR_PROJECT_ID -l asia-southeast1 gs://YOUR_PROJECT_ID-terraform-state
gsutil versioning set on gs://YOUR_PROJECT_ID-terraform-state
```

## Cloudflare

If Terraform manages DNS:

- Create a Cloudflare API token with `Zone:DNS:Edit` for the target zone.
- Copy the zone ID.

If DNS is managed elsewhere, set `manage_cloudflare_dns=false` when applying Terraform and configure the output DNS record manually.

## Vercel

- Create a Vercel API token.
- If the project belongs to a Vercel team, copy the team/org ID for `VERCEL_ORG_ID`.

## npm

Create an npm automation token with publish access to `@mp-lb/mdkit`.

## GitHub Secrets

Required:

| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | GCP project ID that owns the Terraform state bucket |
| `GCP_SA_KEY` | Raw JSON contents of `terraform-key.json` |
| `VERCEL_API_TOKEN` | Vercel API token |
| `CLOUDFLARE_API_TOKEN` | Cloudflare DNS token |
| `CLOUDFLARE_ZONE_ID` | Cloudflare zone ID |
| `NPM_TOKEN` | npm automation token |

Optional:

| Secret | Value |
|--------|-------|
| `VERCEL_ORG_ID` | Vercel team/org ID |
