# Distribution

The package has two distribution surfaces:

- npm package for the editor runtime, hooks, types, styles, and adapters
- publishable docs site for usage, architecture, and adapter contracts

We may also add a shadcn registry surface.

## npm Package

The npm package is the primary distribution path because this editor is not a tiny copy-paste component. It depends on real runtime libraries, adapter contracts, tests, and eventually optional reference integrations.

The npm package should contain:

- MdKit editor
- adapter contracts
- hooks
- styles
- test utilities where useful
- reference adapters where dependency boundaries allow it

## VitePress Docs

`packages/mdkit/docs` is the source for the public library documentation site. These docs explain how to use the package and why it behaves the way it does.

They are distinct from repo-level internal docs under `docs/`, which document mdkit as a project.

## shadcn Registry Option

shadcn is no longer only a set of UI components. The official docs describe shadcn/ui as a component system and code distribution platform, and custom registries can distribute components, hooks, pages, config, rules, docs, and other files.

That makes a shadcn registry worth considering, but probably not as the core distribution path.

### Good Fit

A registry item could install:

- shadcn-styled editor shell components
- toolbar components
- status bars
- checkpoint history panels
- adapter wiring examples
- app-specific wrapper components
- recommended CSS variables and theme tokens

This matches shadcn's model: install editable application code that fits a shadcn app.

### Poor Fit

A registry item is not ideal for the whole editor runtime:

- ProseMirror/Tiptap/Yjs dependencies are non-trivial
- serialization and hydration behavior needs package-level tests
- collaboration adapters may depend on Hocuspocus and server infrastructure
- checkpoint and storage adapters should remain typed package APIs

Copying all internals into an app would make upgrades and bug fixes harder.

## Recommended Direction

Use npm for the engine. Use a shadcn registry for the shadcn-first frontend layer.

That means:

```text
@mp-lb/mdkit
  core runtime, React hooks, editor components, adapter contracts

shadcn registry item
  editable app-facing wrappers and shadcn composition
```

The registry item can depend on the npm package and install opinionated wrappers around it. This gives consumers a plug-and-play path while keeping core behavior testable and upgradeable.

## Open Questions

- Should registry items be maintained in this repo or generated from package examples?
- Should we publish a registry item for `MdKitEditor` first, or wait for stronger storage/checkpoint examples?
- How much of the shadcn UI layer should be copied into consumer apps versus imported from npm?
