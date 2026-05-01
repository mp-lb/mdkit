# Local Development

This guide covers working on `@mp-lb/mdkit` locally and testing it in another local project before publishing to npm.

## Prerequisites

- Node.js and pnpm matching the monorepo
- a fresh `pnpm install` from the mdkit repo root
- a local consumer project that uses React

## Package Workspace Development

From the repo root:

```bash
pnpm install
pnpm --filter=@mp-lb/mdkit typecheck
pnpm --filter=@mp-lb/mdkit test
pnpm --filter=@mp-lb/mdkit build
```

Use the testbench for browser debugging:

```bash
zap start mdkit
```

`mdkit` starts the Vite testbench and its in-memory backend. The backend exposes
HTTP document/version APIs and a Hocuspocus websocket route on the
Zapper-assigned `MDKIT_TESTBENCH_API_PORT`.

If zap is unavailable:

```bash
MDKIT_TESTBENCH_API_PORT=4312 pnpm --filter=@mp-lb/mdkit-testbench-backend dev
pnpm --filter=@mp-lb/mdkit-testbench dev
```

Run backend integration tests with:

```bash
pnpm --filter=@mp-lb/mdkit-testbench-backend test
```

## Local Docs

Run the publishable docs site locally:

```bash
zap start mdkit-docs
```

If zap is unavailable:

```bash
MDKIT_DOCS_PORT=4314 pnpm --filter=@mp-lb/mdkit docs:dev
```

## Test A Local Build In Another Project

The most publish-like local test is a tarball install. It tests the package `files`, exports, built output, styles export, and dependency metadata more accurately than importing source from the monorepo.

Build and pack:

```bash
pnpm --filter=@mp-lb/mdkit release:check
pnpm --filter=@mp-lb/mdkit pack --pack-destination /tmp
```

Install the tarball in a separate local project:

```bash
cd /path/to/consumer-app
pnpm add /tmp/mp-lb-mdkit-0.0.1.tgz
```

Use the package:

```tsx
import { MdKitEditor } from "@mp-lb/mdkit";
import "@mp-lb/mdkit/styles.css";
```

After making changes in mdkit, rebuild and repack:

```bash
cd /Users/felixsebastian/Code/mdkit
pnpm --filter=@mp-lb/mdkit release:check
pnpm --filter=@mp-lb/mdkit pack --pack-destination /tmp

cd /path/to/consumer-app
pnpm add /tmp/mp-lb-mdkit-0.0.1.tgz
```

If the version has not changed, the consumer package manager may reuse cache. Remove the dependency and add it again if needed:

```bash
pnpm remove @mp-lb/mdkit
pnpm add /tmp/mp-lb-mdkit-0.0.1.tgz
```

## Link-Based Testing

Use tarballs first. Link-based testing is faster but less representative of what npm consumers receive.

If you do use a link:

```bash
cd /Users/felixsebastian/Code/mdkit/packages/mdkit
pnpm build
pnpm link --global

cd /path/to/consumer-app
pnpm link --global @mp-lb/mdkit
```

When done:

```bash
cd /path/to/consumer-app
pnpm unlink @mp-lb/mdkit
pnpm add @mp-lb/mdkit

cd /Users/felixsebastian/Code/mdkit/packages/mdkit
pnpm unlink --global
```

## What To Verify In A Consumer App

- package import works
- stylesheet import works
- `MdKitEditor` renders
- external `value` replacement updates the editor
- cold restore from serialized markdown works
- blank-line behavior is understood and documented
- no duplicate React copy is installed
- bundler does not import server-only code
