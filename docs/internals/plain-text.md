# Plain Text Editor Adapters

MDKit can support non-markdown text editors without giving up the connected
document workflow. The practical target is not "make every editor collaborative."
It is:

- keep the existing markdown editor behavior unchanged
- extract the autosave, conflict, checkpoint, restore, and transport workflow so
  it works for any durable `string`
- make collaboration an optional capability that the markdown/Tiptap adapter has
  and plain text adapters usually do not have

That is a realistic shape because the current storage and workflow layer already
mostly treats the document as text. `useMdKitDocument`,
`MdKitDocumentAdapter`, checkpoint policy, restore, conflict handling, and
transport stores all operate on `content: string`. The strongest markdown
coupling is in the editor surface, viewer surface, names, CSS, and Yjs bridge.

## Current State

The reusable parts are already closer to "text document kit" than the public
names imply.

- `MdKitDocumentSnapshot.content` is a `string`.
- `MdKitDocumentWriteInput.content` is a `string`.
- `useMdKitDocument` reads, debounces, writes, polls, detects conflicts, resyncs,
  and force-saves strings.
- `useMdKitDocumentVersions` lists and opens immutable string snapshots.
- `createMdKitBackend` writes string content and can create checkpoints from the
  written string.
- `measureMdKitEditDistance` works on arbitrary strings.

The markdown-specific parts are also clear.

- `MdKitEditor` always renders `TiptapMarkdownSurface`.
- `TiptapMarkdownSurface` parses markdown into Tiptap, serializes with
  `getMarkdown()`, and contains markdown-specific hydration/normalization.
- `MdKitView` is a markdown renderer.
- `MarkdownBubbleMenu`, Tiptap extensions, markdown whitespace preservation, and
  markdown fence handling are editor-adapter internals.
- `MdKitMarkdownYjs` converts between markdown, ProseMirror JSON, and Yjs.
- Public names and docs say markdown/version in many places even where the data
  is only text/checkpoint.

The most important existing product rule is still correct after generalization:
durable content must be the serialized string, not editor-private state. For
markdown that string is markdown. For a plain text editor it is plain text. For a
code editor it is source text.

## Desired Product Shape

Consumers should be able to adopt MDKit in layers:

1. Use the existing markdown editor and get the same behavior as today.
2. Use a built-in plain text editor and still get autosave, conflict handling,
   checkpoint history, restore, toolbar state, and transport helpers.
3. Bring their own text editor component and plug it into the same document
   controller as long as it accepts a string value and emits a string change.
4. Opt into collaboration only when the chosen editor adapter supports it.

The non-collaborative text editor contract should feel like a controlled
textarea:

```tsx
type TextEditorAdapterProps = {
  value: string;
  onChange(value: string): void;
  onFocusChange?(focused: boolean): void;
  readOnly?: boolean;
};
```

This is enough for autosave, dirty state, conflict freeze, polling, and restore.
It is deliberately not enough for collaboration, because collaborative editing
requires a shared operation model, presence, cursor mapping, and server-side
state persistence. A serialized text string is a storage format, not a
collaboration protocol.

## Non-Goals

This should not turn MDKit into a universal editor framework.

- Do not require every editor adapter to support collaboration.
- Do not hide editor-specific collaboration differences behind a fake uniform
  API.
- Do not change the markdown editor internals as the first step.
- Do not rename every public `MdKit`/`markdown`/`version` symbol in one breaking
  pass.
- Do not weaken markdown serialization tests to make the generic layer easier.

## Proposed Architecture

Introduce a generic text document layer underneath the existing markdown exports.
The existing markdown API should become a compatibility and convenience layer
over that generic layer.

### 1. Generic Text Types

Add neutral names for the already-generic document primitives:

```ts
type MdKitTextDocumentSnapshot = {
  content: string;
  revision: MdKitDocumentVersionToken;
  updatedAt?: string | null;
};

type MdKitTextDocumentAdapter = {
  readDocument(documentId: string): Promise<MdKitTextDocumentSnapshot>;
  writeDocument(input: {
    documentId: string;
    content: string;
    baseRevision: MdKitDocumentVersionToken;
    force?: boolean;
  }): Promise<MdKitDocumentWriteResult>;
  resyncDocument?(documentId: string): Promise<MdKitTextDocumentSnapshot>;
};
```

The first implementation can be mostly aliases around the current types. The
goal is to create a neutral conceptual boundary, not churn all call sites.

Keep old names as compatibility exports:

- `MdKitDocumentSnapshot` aliases or extends `MdKitTextDocumentSnapshot`
- `version` remains accepted, but docs call it an opaque revision token
- `useMdKitDocument` remains available and delegates to the generic text hook

This avoids breaking markdown users while giving new code neutral names.

### 2. Text Document Controller

Either rename internally or add a wrapper:

- `useMdKitTextDocument`
- `useMdKitTextDocumentVersions` or `useMdKitCheckpoints`
- `MdKitTextDocumentToolbar`
- `MdKitTextConflictPanel`

The current hooks can stay as compatibility wrappers. The implementation should
be shared, not forked. This matters because duplicated autosave/conflict logic is
exactly how this becomes hard to maintain.

The generic controller owns:

- load
- controlled string value
- dirty state
- autosave debounce
- manual save
- optimistic conflict detection
- polling and remote resync
- checkpoint listing/detail/restore controller
- conflict details and resolution actions

It must not import markdown, Tiptap, ProseMirror, Yjs, CSS, or React editor UI.

### 3. Editor Adapter Boundary

Create a narrow adapter/component contract for local text editing:

```tsx
type MdKitTextEditorProps = {
  className?: string;
  fillHeight?: boolean;
  instanceKey?: string | number;
  onChange?: (content: string) => void;
  onFocusChange?: (focused: boolean) => void;
  readOnly?: boolean;
  value: string;
};
```

The existing `MdKitEditor` can keep this shape for markdown. Add a separate
plain text implementation, for example:

- `MdKitPlainTextEditor`
- `MdKitTextareaEditor`
- `MdKitTextEditorSurface`

For app-provided editors, the docs should recommend rendering the app editor
directly against `document.value`, `document.setContent`, and
`document.setFocused`. A separate adapter object may not be necessary at first;
a component contract and examples may be enough.

Example:

```tsx
const document = useMdKitDocument({ adapter, documentId });

return (
  <>
    <MdKitDocumentToolbar document={document} />
    <MyCodeEditor
      readOnly={document.conflict}
      value={document.value}
      onChange={document.setContent}
      onFocusChange={document.setFocused}
    />
  </>
);
```

This path reuses all connected workflow features without pretending the editor
is markdown-aware.

### 4. Capabilities Instead Of Modes

Model collaboration and rendering as capabilities.

```ts
type MdKitEditorCapabilities = {
  collaboration?: boolean;
  richMarkdown?: boolean;
  readOnlyView?: boolean;
};
```

The workflow should degrade by capability:

- no storage: local controlled editing only
- storage: load/save/autosave/conflicts
- storage + checkpoints: history and restore
- storage + markdown collaboration: Yjs-backed live editing
- storage + plain text editor: all connected features except collaboration

The toolbar already does this for versioning and collaboration. The same pattern
should become explicit in docs and types.

### 5. Keep Collaboration Editor-Specific

Collaboration should remain attached to the markdown/Tiptap adapter for now.

Current collaboration depends on:

- `HocuspocusProvider`
- `Y.Doc`
- Tiptap `Collaboration`
- Tiptap `CollaborationCaret`
- markdown-to-ProseMirror-to-Yjs conversion helpers

That is not generic text collaboration. A generic text editor would need its own
CRDT/OT binding and cursor mapping. CodeMirror, Monaco, a textarea, and a custom
editor all have different collaboration integration points.

The safe API rule is:

- `MdKitEditor` supports `collaboration` because it is the markdown/Tiptap
  adapter.
- generic text editor props do not accept `collaboration`.
- workflow UI can show collaboration status only when a collaboration session is
  passed.
- attempting to pass collaboration to an unsupported editor should be a type
  error, not a runtime warning.

Later, MDKit can add a separate collaboration-capable adapter for another editor
without changing the generic storage/checkpoint/autosave layer.

## Migration Strategy

This should be incremental and test-driven.

### Phase 1: Document The Boundary

Add docs and examples that state:

- the workflow layer is string-based
- markdown is the default rich editor adapter
- collaboration is markdown/Tiptap-only
- external text editors should use `useMdKitDocument` directly

No code needs to change in this phase. It gives us a way to validate the concept
in the testbench with a textarea or code editor before changing exports.

### Phase 2: Add A Plain Text Reference Surface

Add a small built-in textarea editor or testbench-only reference first. It should
wire to the existing document controller:

- `value={document.value}`
- `onChange={document.setContent}`
- `onFocusChange={document.setFocused}`
- `readOnly={document.conflict || readOnly}`

This validates that the current hook API is already sufficiently generic. It
also gives regression coverage for non-markdown strings before type renames add
noise.

### Phase 3: Extract Neutral Internals

Move implementation internals from markdown-named files only where they are not
actually markdown-specific.

Likely changes:

- keep `packages/mdkit/src/markdown/*` as editor-adapter code
- introduce `packages/mdkit/src/text/*` or `packages/mdkit/src/document/*`
  neutral exports for generic text workflow
- keep transport/core string logic shared
- keep markdown docs and compatibility exports in place

Avoid changing behavior in this phase. Most diffs should be file moves, aliases,
or wrapper exports.

### Phase 4: Add Neutral Public API

Add new neutral exports while keeping current exports:

- `useMdKitTextDocument`
- `MdKitTextDocumentAdapter`
- `MdKitTextDocumentSnapshot`
- `MdKitCheckpointSummary`
- `MdKitCheckpointDetail`
- `MdKitTextDocumentToolbar` if needed

Current names can remain indefinitely or until a major version:

- `useMdKitDocument`
- `MdKitDocumentAdapter`
- `MdKitDocumentVersionSummary`
- `VersionHistoryPanel`

Do not force consumers to migrate while the product is still evolving unless the
old names actively cause bugs.

### Phase 5: Optional Workflow Composition

Once the generic surface is proven, add a headless workflow/controller component
that accepts any text editor render function:

```tsx
<MdKitTextDocumentController documentId={documentId} adapter={adapter}>
  {({ document, versions }) => (
    <MyEditor value={document.value} onChange={document.setContent} />
  )}
</MdKitTextDocumentController>
```

This is ergonomic but should come after the lower-level contract is stable.

## Validation Plan

The main risk is not that this cannot be built. The risk is silently weakening
the markdown path or creating two subtly different autosave/conflict systems.
Validation should prove both that markdown did not regress and that arbitrary
text gets the same workflow semantics.

### Unit Tests

Keep all existing markdown tests. Add generic text tests that do not mount
Tiptap:

- `useMdKitDocument` or `useMdKitTextDocument` loads arbitrary string content
- autosave writes plain text after debounce
- `saveNow` flushes pending plain text
- conflict details include base, local, and remote text exactly
- force-save overwrites remote text
- polling applies remote text when local is clean and unfocused
- polling detects conflicts when local is dirty
- checkpoint policy uses text edit distance
- restore writes checkpoint text back to current storage

Use strings that are not markdown examples:

- JSON
- source code
- CSV
- leading/trailing whitespace
- repeated blank lines
- very long single-line text
- text with markdown-looking characters that should not be interpreted

### Markdown Regression Tests

Do not reduce existing markdown coverage. Add an explicit compatibility suite:

- `MdKitEditor` still hydrates markdown
- `MdKitEditor` still serializes markdown on edit
- external `value` replacement still works
- collaborative mode still ignores parent-driven value replacement
- markdown blank-line preservation tests still pass
- markdown Yjs helpers still convert markdown to Yjs and back
- `MdKitView` rendering is unchanged

The tests should import from the old public names as consumers do today. That is
how we catch accidental breaking changes.

### Adapter Contract Tests

Create a small fake editor component in tests. It should be intentionally dumb:
an input or textarea that calls `onChange(e.target.value)`.

Mount it with the document hook and assert:

- the toolbar status changes from idle/pending/saving/saved
- conflict state freezes or disables editing when the host passes `readOnly`
- version history can open snapshots created from non-markdown text

This validates the extension point without bringing in a real third-party
editor.

### Testbench Coverage

Add a testbench tab or mode for "Plain text adapter". It should use the same
backend stacks as markdown storage/checkpoint modes but render a textarea or a
simple code-style editor.

The testbench should make it easy to compare:

- markdown editor connected workflow
- plain text editor connected workflow
- collaboration mode disabled or visibly unavailable for plain text

Do not add collaboration controls to the plain text tab. That absence is part of
the product contract.

### Type-Level Tests

Add TypeScript checks for the capability boundary:

- markdown editor accepts collaboration
- plain text editor does not accept collaboration
- generic document hooks do not import or require Tiptap/Yjs types
- app-provided editors only need `value`, `onChange`, optional focus, and
  optional read-only props

This is important because an unsupported collaboration prop should fail at
compile time.

### Build And Package Checks

Run:

```bash
zap t check
zap t build
```

For the package itself, also run the focused mdkit test suite when editing
internals:

```bash
pnpm --filter=@mp-lb/mdkit test
```

If package boundaries change, inspect the built declaration files to make sure
generic exports do not pull markdown editor dependencies into headless imports.

## Maintenance Risks

### Risk: Two Workflow Implementations

Do not fork `useMdKitDocument` for markdown and plain text. Markdown should be a
consumer of the generic string workflow, not a sibling implementation.

### Risk: Naming Churn Hides Behavior Changes

Renames should be wrappers and aliases first. Behavior changes should land in
separate commits with tests.

### Risk: Markdown Collaboration Accidentally Becomes Optional-But-Broken

Keep collaboration tests importing the current markdown editor. Collaboration is
not part of the generic text editor promise, but it is part of the markdown
promise.

### Risk: Viewer Semantics Are Confused With Editor Semantics

Generic text editing does not imply generic rendering. `MdKitView` is markdown
viewing. A plain text viewer should be a separate component that preserves text
exactly, likely with `white-space: pre-wrap`.

### Risk: Storage Metadata Becomes Format-Specific

Storage should continue to store `content: string` plus revision metadata. If a
future envelope is added, it needs an explicit `contentType` or `format` field
without forcing markdown-only values.

### Risk: CSS Becomes Markdown-Only Everywhere

Current CSS names such as `mp-lb-mdkit-markdown-editor` are markdown-specific.
New generic text surfaces should get neutral class names, while markdown keeps
the old names for compatibility.

## Recommended First Implementation

The safest first implementation is small:

1. Add a plain text reference editor in the testbench that uses
   `useMdKitDocument` directly.
2. Add hook-level tests with non-markdown strings.
3. Add a built-in `MdKitPlainTextEditor` only if the testbench proves the
   contract is useful.
4. Add neutral public type aliases after the behavior is proven.
5. Keep collaboration only on `MdKitEditor`.

This validates the product idea without touching the fragile markdown
serialization/collaboration internals first.

## Testbench Coverage

`apps/mdkit-testbench` includes a connected stack option named
`Storage + checkpoints (plain text)`. It reuses the existing checkpoints backend
and document hooks, stores content under `docs/plain-text.txt`, renders a
controlled textarea instead of `MdKitEditor`, and intentionally omits
collaboration controls.

This is the current confidence check for the generic text workflow: plain text
can use the same storage, autosave, conflict, checkpoint, and restore plumbing
without requiring a separate backend or markdown editor surface.

## Bottom Line

This is feasible because MDKit's connected workflow is already string-based.
The work is mostly about making that boundary explicit, adding a plain text
reference path, and preventing markdown/Tiptap/Yjs concerns from leaking into
the generic text workflow.

The confidence path is also clear: preserve all existing markdown tests, add
non-markdown string workflow tests, and prove in the testbench that a plain text
editor can reuse storage, autosave, conflicts, checkpoints, and restore while
not exposing collaboration.
