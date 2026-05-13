# Releases

Runbook for publishing `@mp-lb/mdkit` to npm.

## Current State

The package uses Changesets for versioning. Stable releases are direct from
`main`: when a pushed commit contains one or more pending changeset files, the
release workflow versions `@mp-lb/mdkit`, runs release checks, publishes to npm,
then pushes the generated version commit and git tags back to `main`.

The normal stable release path no longer creates a Changesets release PR.

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
pnpm -C packages/mdkit pack --pack-destination /tmp
MDKIT_VERSION=$(node -p "JSON.parse(require('fs').readFileSync('packages/mdkit/package.json', 'utf8')).version")
tar -tf "/tmp/mp-lb-mdkit-${MDKIT_VERSION}.tgz" | sort
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

## Stable Release

Create a changeset for every public API or behavior change:

```bash
pnpm changeset
```

Enter the release type and summary when prompted, then push the changeset to
`main`.

For agent-managed releases, do not stop after creating the changeset. The agent
doing the release is responsible for committing the code/docs changes and the
generated `.changeset/*.md` file, then pushing that commit to GitHub. That push
is the release trigger.

After the changeset commit reaches `main`, the release workflow will:

1. run `pnpm changeset version`
2. run the release checks
3. commit the generated package version, changelog, and removed changeset with
   a `chore: release @mp-lb/mdkit@<version> [skip ci]` commit
4. publish the package to npm
5. push the release commit and git tags back to `main`

No release PR should be opened for this path.

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

## Main Prereleases

The separate `Publish Package` workflow still publishes `main` prerelease
versions for package changes that do not include a changeset. If a push includes
a pending changeset, that workflow skips publishing and leaves the stable
release workflow to publish `latest`. Workflow-only and docs-only changes
outside the published package do not publish prereleases.

## Release Blockers

- failing typecheck
- failing package tests
- failing docs build
- failing testbench build
- unresolved serialization/hydration regression
- stale docs for changed public behavior
- tarball missing `dist`, `docs`, or `src/styles.css`
- tarball includes generated cache/build artifacts that should not ship
