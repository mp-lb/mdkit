# Releases

Runbook for publishing `@mp-lb/mdkit` to npm.

## Current State

The package uses Changesets for versioning and release PRs. The release workflow publishes `@mp-lb/mdkit` after a Changesets version PR lands on `main`.

## Release Requirements

Every release must pass verification with exit code 0. Warnings are acceptable; non-zero exit codes are release blockers.

Run:

```bash
pnpm --filter=@mp-lb/mdkit release:check
pnpm --filter=@mp-lb/mdkit-testbench build
pnpm turbo run typecheck
```

If any command fails, fix it before publishing.

## Documentation Requirement

Before publishing, check the package docs:

- `packages/mdkit/docs/index.md`
- `packages/mdkit/docs/architecture.md`
- `packages/mdkit/docs/api.md`

Also check internal project notes when behavior or process changes:

- `docs/mdkit/serialization-and-hydration.md`
- `docs/mdkit/adapters.md`
- `docs/mdkit/automated-testing.md`
- `docs/mdkit/distribution.md`
- `docs/mdkit/manual-qa.md`
- `docs/mdkit/local-development.md`
- `docs/mdkit/releases.md`

Any behavior or public API change should update docs in the same release.

## Prepublish Inspection

Create and inspect the tarball:

```bash
pnpm --filter=@mp-lb/mdkit pack --pack-destination /tmp
tar -tf /tmp/mp-lb-mdkit-0.0.1.tgz | sort
```

Confirm it contains:

- `dist`
- `docs`
- `src/styles.css`
- `package.json`

Confirm it does not contain:

- test files unless intentionally shipped
- `.turbo`
- VitePress cache or dist output
- app testbench files

## Changesets Release

Create a changeset for every public API or behavior change:

```bash
pnpm changeset
```

On `main`, the release workflow opens or updates a release PR. Merging that PR publishes the package to npm.

Then verify npm after the release workflow succeeds:

```bash
npm view @mp-lb/mdkit version
```

Install the published package in a separate local project:

```bash
cd /path/to/consumer-app
pnpm add @mp-lb/mdkit@latest
```

Run the consumer app and verify:

- imports work
- stylesheet import works
- editor renders
- hydration test cases from manual QA still behave as expected

## Release Blockers

- failing typecheck
- failing package tests
- failing docs build
- failing testbench build
- unresolved serialization/hydration regression
- stale docs for changed public behavior
- tarball missing `dist`, `docs`, or `src/styles.css`
- tarball includes generated cache/build artifacts that should not ship
