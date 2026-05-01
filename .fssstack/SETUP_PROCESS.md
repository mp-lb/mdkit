# fssstack Setup

Run this in a Git repository that is empty except for the downloaded `.fssstack/` repo snapshot. If other project files already exist, stop and ask the user for an empty repo.

## Inputs

Ask for any missing values:

- Project name
- Project slug, defaulting to the lowercased project name
- Package scope, defaulting to `@fssstack`
- Project description
- Emoji for favicon/readme

Use the chosen strings directly in commands and file edits. Do not rely on exported environment variables carrying across shell sessions.

## Foundation

Install the foundation layer from the repo root:

```bash
bash .fssstack/scripts/install-foundation.sh "$PWD"
```

## Apps And Packages

Install the backend app and shared packages:

```bash
bash .fssstack/scripts/install-apps-packages.sh "$PWD"
```

## Vite Frontend

Generate the frontend with Vite, then apply the fssstack Vite layer:

```bash
CI=1 pnpm dlx create-vite@latest apps/frontend --template react-ts
bash .fssstack/scripts/apply-vite-layer.sh "$PWD"
```

## Render Template

Replace template strings once after the foundation, apps/packages, and Vite layers are in place:

```bash
bash .fssstack/scripts/render-template.sh "$PWD" "my-project" "@fssstack" "My Project" "One sentence project description." "🐱"
```

## Dependencies

```bash
pnpm add -w --save-exact lodash pino pino-pretty zod
pnpm add -w --save-dev --save-exact turbo typescript vitest ts-node jsdom @types/node @types/lodash @types/pino eslint@9 @eslint/js@9 eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks globals typescript-eslint @testing-library/react @testing-library/jest-dom
pnpm install
pnpm dlx shadcn@latest add -c apps/frontend button card --yes --overwrite
node .fssstack/scripts/normalize-package-versions.mjs package.json apps/*/package.json packages/*/package.json
pnpm exec eslint . --fix
```

## Validate

```bash
pnpm install
pnpm lint
pnpm turbo run typecheck
pnpm test
pnpm turbo run build --filter=<package-prefix>-backend
pnpm turbo run build --filter=<package-prefix>-frontend
zap up
```

Verify:

- frontend loads
- frontend calls backend through tRPC
- backend `/health` returns `{ "ok": true }`
- package names, app title, readme/favicon values, and Zap files use the chosen project values

Commit:

```bash
git add .
git commit -m init
```
