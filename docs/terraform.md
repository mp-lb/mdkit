# Terraform & Google Cloud Deployment

Infrastructure is managed with Terraform and deployed to Google Cloud Run + Vercel. Terraform files live in `infra/`.

## Architecture

GitHub Actions runs Terraform from `infra/`, which manages:

- **Google Cloud Run** - Backend API
- **Google Compute Engine** - Worker VM (BullMQ)
- **Artifact Registry** - Backend + worker Docker images
- **Upstash** - Managed Redis
- **Vercel** - Frontend hosting
- **Cloudflare** - DNS for frontend + backend subdomains

Custom domains are supported with explicit Terraform inputs for the frontend and backend hostnames. See [custom-domains.md](./custom-domains.md) before moving a project from `<project>.maplab.dev` to its own domain.

## Preconditions Checklist

Complete these **once per Google Cloud account** before deployment works.

### 1. Google Cloud Project

- [ ] Create a Google Cloud project at https://console.cloud.google.com
- [ ] Note the **Project ID** (the URL-safe one like `my-project-123456`, not the display name)
- [ ] Enable billing on the project

### 2. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  compute.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com
```

| API | Purpose |
|-----|---------|
| Cloud Run | Container hosting |
| Compute Engine | Worker VM |
| Artifact Registry | Docker image storage |
| Cloud Build | Building containers |
| Secret Manager | Storing secrets |
| IAM | Managing permissions |

### 3. Service Account for Terraform

```bash
PROJECT_ID=your-project-id

# Create the service account
gcloud iam service-accounts create terraform \
  --display-name="Terraform"

# Grant required roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:terraform@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/compute.admin"

# Create and download key
gcloud iam service-accounts keys create terraform-key.json \
  --iam-account=terraform@$PROJECT_ID.iam.gserviceaccount.com
```

**Keep `terraform-key.json` safe** - this is the credential Terraform uses.

### 4. Terraform State Backend

Terraform stores state remotely in Google Cloud Storage:

```bash
# Create a bucket for Terraform state
gsutil mb -p $PROJECT_ID -l asia-southeast1 gs://$PROJECT_ID-terraform-state

# Enable versioning (for recovery from mistakes)
gsutil versioning set on gs://$PROJECT_ID-terraform-state
```

### 5. GitHub Secrets

Add these secrets to GitHub (Settings → Secrets → Actions). These are **org-level secrets** (not Actions variables).

| Secret Name | Value | Notes |
|-------------|-------|-------|
| `GCP_PROJECT_ID` | Your project ID | e.g., `my-project-123456` |
| `GCP_SA_KEY` | Contents of `terraform-key.json` | Raw JSON |
| `GCP_REGION` | Region | e.g., `asia-southeast1` |
| `VERCEL_API_TOKEN` | Vercel token | |
| `CLOUDFLARE_API_TOKEN` | Cloudflare token | |
| `CLOUDFLARE_ZONE_ID` | Cloudflare zone ID | |
| `PRODUCTION_SECRETS` | App secrets | KEY=value pairs, one per line |
| `UPSTASH_EMAIL` | Upstash account email | |
| `UPSTASH_API_KEY` | Upstash API key | |
| `UPSTASH_REDIS_URL` | Optional override if your Upstash account already has a Redis DB | |

## File Structure

```
infra/
├── main.tf              # Providers, backend configuration
├── variables.tf         # Input variables
├── outputs.tf           # Output values (URLs, connection strings)
├── backend.tf           # Cloud Run service for backend
├── worker.tf            # GCE worker VM
├── frontend.tf          # Vercel project + domain
├── dns.tf               # Cloudflare DNS records
├── registry.tf          # Artifact Registry for backend image
├── redis.tf             # Upstash Redis
├── budget.tf            # Optional GCP budget alerts
└── terraform.tfvars     # Default variable values (non-secret)
```

## Environment Variables

### Sources

Production env vars are sourced in CI from:
- `.env.production` (committed, non-secret)
- `PRODUCTION_SECRETS` (GitHub secret, app-specific secrets)

The workflow should explicitly control what gets passed to each service.

## Deployment

### First Time Setup

After completing the preconditions:

```bash
cd infra
terraform init
terraform apply
```

### Ongoing Deployments

Automatic via GitHub Actions:
1. Push to `main`
2. GitHub Actions builds containers and runs `terraform apply`
3. Cloud Run routes traffic to new version

### Manual Deployment

```bash
cd infra
terraform apply
```

## GitHub Actions Workflow

`.github/workflows/deploy.yml`:
- **On push to main**: build backend + worker images, apply Terraform, deploy frontend to Vercel

Build flow:
1. Build Docker images for backend + worker
2. Push to Artifact Registry
3. Terraform updates Cloud Run + worker VM + DNS + Upstash
4. Frontend: build static files, deploy to Vercel

## Local Development

Local development uses `zap` - Terraform is only for production/staging.

```bash
zap start     # Start all services
zap logs be   # View backend logs
```

## Monitoring & Debugging

### View Logs

```bash
gcloud run logs read --service=backend --project=$PROJECT_ID
```

Or: Console → Cloud Run → Select service → Logs tab

Worker logs (VM):
```bash
gcloud compute ssh ${PROJECT_NAME}-worker --zone=${GCP_REGION}-a \
  --command="docker ps && sudo journalctl -u konlet-startup -n 200 --no-pager"
```

### List Services

```bash
gcloud run services list --project=$PROJECT_ID
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Permission denied | Check service account has all required roles |
| API not enabled | Run the `gcloud services enable` commands |
| Container fails to start | Check logs with `gcloud run logs read` |
| Terraform state lock | Wait for other Terraform run to finish, or force-unlock |
