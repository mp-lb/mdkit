# MDKit Use Cases

This document maps the product shapes mdkit should support and checks whether
the public API makes each shape natural. MDKit should be opinionated: the
default connected editor should cover the document storage, autosave,
checkpoint history, and collaboration behavior most products need.

The two primary axes are:

- Checkpoint policy: never, always, or smart
- Collaboration: off or on

Smart checkpointing and manual checkpoint creation are not mutually exclusive.
A product can enable automatic smart checkpoints, manual checkpoints, or both.

## Core Model

MDKit should treat historical document state as checkpoint history.

A checkpoint is an immutable markdown snapshot with metadata. "Version per
write" is not a separate backend model; it is the checkpoint policy where every
successful write creates a checkpoint. No history is the checkpoint
policy where checkpoint creation is disabled.

That gives the library one checkpoint abstraction:

- Autosave writes the canonical current document.
- Checkpoint rules decide when the current document becomes user-facing history.
- History UI lists, previews, and restores checkpoints.

## Checkpoint Policies

### Never

The app stores one current markdown document. The current document still has an
opaque revision token for conflict detection, but no user-facing history.

Expected backend behavior:

- `readDocument` reads the current markdown snapshot.
- `writeDocument` updates the current markdown when `baseVersion` still matches.
- Version-history methods are omitted or return empty results.

This is a good fit for autosave without history.

### Always

Every successful write creates a checkpoint. This is the naive version-per-write
model expressed as a checkpoint policy.

Expected backend behavior:

- `writeDocument` updates the canonical current document.
- The same write creates a checkpoint containing the saved markdown.
- `listDocumentVersions` lists those checkpoints.
- `readDocumentVersion` reads one checkpoint.
- Restoring a checkpoint writes that checkpoint content back to the canonical
  current document.

This is useful for deliberate manual-save products. It is usually a poor
autosave default because autosave writes can be tiny implementation details:
single words, punctuation edits, focus-driven saves, or debounce flushes.

### Manual

Manual checkpoints are created by explicit user or product actions, such as
Save checkpoint, publish, approve, or mark milestone.

Expected backend behavior:

- The current markdown document stays canonical.
- The checkpoint request creates an immutable snapshot from the current content.
- Caller-owned metadata can describe the product action.

### Smart

Autosave keeps the canonical current document durable. A smart checkpoint policy
decides when a change is meaningful enough to become history.

Expected backend behavior:

- `writeDocument` updates the canonical current document.
- A checkpoint policy evaluates the previous checkpoint, current content, edit
  distance, elapsed time since last edit or checkpoint, and write context.
- If the policy triggers, the write also creates a checkpoint.
- Manual product events can force a checkpoint regardless of the automatic
  policy result.

This is the opinionated default for autosaving editors. A practical default
policy is edit distance plus elapsed time since the last checkpoint, with a
manual override for product actions like publish, approve, or save milestone.

Expected helper shape:

```ts
const policy = CheckpointPolicy.smart({
  minEditDistance: 250,
  minIntervalMs: 5 * 60_000,
});

const customPolicy = CheckpointPolicy.function(
  ({
    currentContent,
    editDistance,
    previousCheckpointContent,
    timeSinceLastCheckpointMs,
  }) =>
    editDistance > 500 ||
    timeSinceLastCheckpointMs > 10 * 60_000 ||
    currentContent.startsWith("# Published") !==
      previousCheckpointContent?.startsWith("# Published"),
);
```

The custom function receives both computed values and raw document content. That
lets products use mdkit's edit-distance calculation, ignore it, or compute their
own comparison from the two documents.

## Use-Case Matrix

| Checkpoint Policy | Collaboration | Product Shape | Current API Fit | Notes |
| --- | --- | --- | --- | --- |
| Never | Off | Single-user autosaving editor with conflict protection. | Good | Use `useMdKitDocument` with `readDocument` and `writeDocument`. Hide checkpoint history. |
| Always | Off | Manual-save editor where each save becomes history. | Good but narrow | This is version-per-write as a checkpoint policy. It should not be the autosave default. |
| Smart | Off | Autosaving editor with meaningful history. | Partial, should be first-class | Checkpoint listing and restore fit. Checkpoint creation and checkpoint rules should move into mdkit. |
| Always | On | Collaborative editor where explicit saves create history. | Partial and narrow | Useful for save/publish workflows. It still needs the collaboration sync policy. |
| Smart | On | Collaborative autosaving editor with meaningful history. | Partial, should be first-class | This should be the flagship connected-editor path. |

## Opinionated Backend Assumptions

These questions do not need to vary for most products. MDKit can answer them in
its helpers and let advanced users drop down to lower-level APIs when needed.

### Canonical Current Document

The canonical product document is markdown plus metadata:

- `documentId`
- `content`
- `revision`
- `updatedAt`
- optional author or source metadata

`revision` is an opaque concurrency token. It might be an integer, timestamp,
ULID, database row version, or content hash. User-facing checkpoints have their
own ids.

### Checkpoints

Checkpoints are immutable markdown snapshots:

- `checkpointId`
- `documentId`
- `content`
- `createdAt`
- `sourceRevision`
- optional label, author, reason, and policy metadata

The checkpoint content shape is mdkit-owned. Product metadata is caller-owned.
MDKit should not prescribe permission models, labels, authorship rules, audit
fields, or security policy. The default helpers should allow metadata to be
passed through opaquely and returned with checkpoint summaries/details where the
application wants to use it.

Restoring a checkpoint updates the canonical current document to the checkpoint
content. The restore can also create a new checkpoint that records the restore
event, but the restored checkpoint itself remains immutable.

### Metadata And Permissions

The application owns raw product data around the document:

- checkpoint metadata
- author identity and display labels
- restore reasons
- security and permission checks
- tenancy, document ownership, and audit records

MDKit should only require the markdown content and revision data it needs for
editor correctness. For helper APIs that create checkpoints or restores, mdkit
can accept an opaque `metadata` or `context` value and forward it to
application-provided callbacks. The library should not inspect or validate that
data beyond typing it as generic caller-owned data.

### Autosave

Autosave writes the current document. Autosave does not imply history.

After each successful write, a checkpoint policy may create a checkpoint. This
keeps the editor durable without turning every debounce flush into checkpoint
history.

### Restore

The default restore flow should preserve the current document before replacing
it:

- Read the checkpoint being restored.
- Create a checkpoint from the current document if the current state is not
  already represented by a checkpoint.
- Update the canonical current document to the restored checkpoint content.
- Create a new current revision.
- Apply the configured collaboration reset policy if collaboration is enabled.

The restored checkpoint remains immutable. MDKit can expose a small set of
restore policies for how restore is represented in history:

- preserve current before restore, then update current document
- preserve current and create a restore checkpoint at the top of history
- update current document without creating an extra restore checkpoint

The safest default is to preserve the current document before restore so users
do not lose uncheckpointed work.

### Collaboration

Yjs state is the live collaboration state. Markdown remains the canonical
snapshot format for current-document storage and checkpoint history.

The opinionated collaboration flow should be:

- When a collaboration room has no stored Yjs state, seed it from the canonical
  markdown document.
- Persist Yjs state through application-owned durable storage connected to the
  collaboration server.
- Snapshot active collaboration state to markdown before writing the canonical
  current document or creating a checkpoint.
- When restoring a checkpoint, replace the canonical markdown and reseed the
  collaboration state from the restored markdown.
- If an active collaboration room cannot be safely updated in place, close or
  reset the room and require clients to reconnect.

Advanced products can customize this, but the default helpers should make this
path easy. Correctness is more important than preserving cursor continuity. A
restore can behave like a hard document reset if that is the reliable
implementation.

## Front-Facing API Analysis

### What Already Works

`MdKitDocumentAdapter` works for current-document storage. The combination of
`readDocument`, `writeDocument`, `baseVersion`, and `MdKitDocumentWriteResult`
supports autosave and optimistic conflict detection.

Checkpoint history is capability-based. If an adapter omits `listDocumentVersions`
or `readDocumentVersion`, `useMdKitDocumentVersions` reports
`hasVersioning: false` and the base UI can hide or disable checkpoint history.

The Yjs conversion helpers make the collaboration bridge possible:

- `markdownToMdKitYjs` can seed Yjs state from markdown.
- `mdKitYjsToMarkdown` can derive markdown from stored Yjs state.
- `replaceMdKitYjsMarkdown` can replace an existing Yjs document with markdown.

### Gaps To Resolve

Checkpoint creation is not first-class. Rule-driven checkpoint history is the
autosave-compatible history model, so mdkit should expose a direct
`createCheckpoint` or `createDocumentVersion` capability.

Checkpoint rules are not represented. MDKit should provide helpers for common
policies: always, never, manual, edit-distance threshold, elapsed-time
threshold, and combined edit-distance-plus-time. It should also let callers
provide a custom function that receives the computed values and returns whether
to checkpoint.

Restore is split across surfaces. `MdKitTransportStore` and the tRPC router have
`restoreDocumentVersion`, but `MdKitDocumentAdapter` does not. The current UI
therefore requires app code to provide `onRestoreVersion`, even when the chosen
transport helper already supports restore.

The `version` name carries two meanings. In `MdKitDocumentSnapshot`, it is a
concurrency token for the current document. In `MdKitDocumentVersionSummary`, it
can also be displayed as historical version metadata. The API should document
the current-document token as an opaque revision token and reserve checkpoint
language for user-facing history.

The collaboration persistence boundary is not explicit enough. The library has
the conversion helpers, but it does not yet provide an opinionated backend
helper for seeding collaboration state, snapshotting Yjs to markdown, or
replacing active collaboration state after restore.

Metadata passthrough is not explicit. Existing APIs expose some standard
checkpoint display fields, but an opinionated backend helper should also support
caller-owned metadata/context without mdkit needing to know its shape.

## API Direction

MDKit should expose an opinionated connected backend helper built around:

- current markdown document storage
- immutable markdown checkpoints
- configurable checkpoint policy
- optional Yjs collaboration state
- markdown/Yjs bridge helpers

The lower-level helpers should still be available for products with custom
storage needs, but the default API should answer the common backend questions
instead of pushing those decisions onto every adopter.

Potential API additions:

- `CheckpointPolicy` helpers for `never`, `always`, `smart`, and custom
  functions that receive time, edit distance, previous content, current content,
  and write context.
- A `createCheckpoint` or `createDocumentVersion` method on the document or
  checkpoint adapter.
- A frontend restore method on `MdKitDocumentAdapter`, or a version controller
  option that accepts a restore function.
- A backend helper such as `createMdKitBackend({ store, checkpointPolicy })`
  that turns storage primitives into mdkit tRPC/REST procedures, evaluates the
  checkpoint policy after writes, and calls the app store's checkpoint creation
  method when the policy triggers.
- Collaboration helpers for markdown-to-Yjs seeding, Yjs-to-markdown
  checkpointing, and restore-time collaboration reset.
- Generic metadata/context passthrough for application-owned checkpoint and
  restore data.
