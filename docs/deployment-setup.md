# Deployment Setup

One-time setup for the deployment infrastructure. All future projects reuse this.

## Google Cloud

**Console (console.cloud.google.com):**
- Create project → note the Project ID
- Billing → link a billing account

**Terminal (gcloud CLI):**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com \
  compute.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com iam.googleapis.com

# Create service account
gcloud iam service-accounts create terraform --display-name="Terraform"

# Grant roles
for role in run.admin iam.serviceAccountUser artifactregistry.admin secretmanager.admin storage.admin; do
  gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:terraform@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/$role"
done

# Worker VM permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:terraform@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.admin"

# Download key
gcloud iam service-accounts keys create terraform-key.json \
  --iam-account=terraform@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Create Terraform state bucket
gsutil mb -p YOUR_PROJECT_ID -l asia-southeast1 gs://YOUR_PROJECT_ID-terraform-state
gsutil versioning set on gs://YOUR_PROJECT_ID-terraform-state
```

**Google Search Console (search.google.com/search-console):**
- Add property → `maplab.dev`
- Verify via DNS TXT record
- This enables Cloud Run to use any `*.maplab.dev` subdomain

## Cloudflare

**Dashboard → My Profile → API Tokens:**
- Create Token → Custom → Zone:DNS:Edit → Include: maplab.dev → Create
- Copy the token

**Dashboard → maplab.dev → Overview (right sidebar):**
- Copy the Zone ID

## Vercel

**Dashboard → Settings → Tokens:**
- Create token, copy it

**GitHub:**
- Install Vercel app on your GitHub org: github.com/apps/vercel

## GitHub Secrets

There are two levels of secrets: **organization** (shared across all repos) and **repository** (project-specific).

### Organization Secrets (one-time setup)

**GitHub → Your Org → Settings → Secrets and variables → Actions → Secrets tab:**
These are **org-level secrets**, not Actions variables.

| Secret | Value | Notes |
|--------|-------|-------|
| `GCP_PROJECT_ID` | Your GCP project ID | e.g. `maplab-projects` |
| `GCP_SA_KEY` | Contents of `terraform-key.json` | The raw JSON, not base64 |
| `GCP_REGION` | `asia-southeast1` | Or preferred region |
| `VERCEL_API_TOKEN` | From Vercel | |
| `CLOUDFLARE_API_TOKEN` | From Cloudflare | |
| `CLOUDFLARE_ZONE_ID` | From Cloudflare | |

Set visibility to "Private repositories" so all private repos inherit these.

### Repository Secrets (per-project)

For projects with application secrets (API keys, database URLs, etc.), add these at the **repo level**:

**GitHub → Repo → Settings → Secrets and variables → Actions → Secrets tab:**

| Secret | Value |
|--------|-------|
| `PRODUCTION_SECRETS` | All app secrets as KEY=value pairs (see below) |
| `UPSTASH_EMAIL` | Upstash account email (Terraform) |
| `UPSTASH_API_KEY` | Upstash API key (Terraform) |
| `UPSTASH_REDIS_URL` | Optional override if your Upstash account already has a Redis DB |

**PRODUCTION_SECRETS format:**
```
DATABASE_URL=postgresql://...
# REDIS_URL now comes from Terraform (Upstash)
OPENAI_API_KEY=sk-...
# Add all secrets your app needs
```

If Redis is provisioned via Terraform (e.g., Upstash from `../extensions/redis.md`), omit `REDIS_URL` here — Terraform injects it into Cloud Run/worker.

Non-secret config goes in `.env.production` (committed to git). The workflow appends `PRODUCTION_SECRETS` at deploy time.

### How to tell what goes where

- **Org secrets**: Infrastructure credentials shared across projects (GCP, Vercel, Cloudflare)
- **Repo secrets**: App-specific secrets (database URLs, API keys for services your app uses)
- **`.env.production`**: Non-sensitive config (regions, bucket names, public URLs)

The workflow accesses all of these via `secrets.*` - GitHub merges org + repo secrets automatically.
