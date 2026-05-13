# Adapters

The target model is independent adapter families that can be composed or
omitted. Missing adapters should remove functionality, not break the editor.

## Storage Adapter

Storage answers: what is the current document content?

Storage should persist markdown as the durable document content. A JSON envelope
is acceptable when we need metadata, format revisions, or future migration
hooks, but the envelope must not become a workaround for lossy markdown
serialization.

Expected responsibilities:

- read the current markdown content, plus metadata if the adapter uses an
  envelope
- write the current markdown content with conflict protection
- optionally resync from the canonical source

Current package shape:

```ts
type MdKitDocumentAdapter = {
  readDocument(documentId: string): Promise<MdKitDocumentSnapshot>;
  writeDocument(
    input: MdKitDocumentWriteInput,
  ): Promise<MdKitDocumentWriteResult>;
  resyncDocument?(documentId: string): Promise<MdKitDocumentSnapshot>;
};
```

Optional persisted envelope shape:

```ts
type MarkdownDocumentEnvelope = {
  format: "markdown-editor-document";
  version: number;
  markdown: string;
  metadata?: Record<string, unknown>;
};
```

The current package API exposes markdown-oriented snapshots. New adapter work can
add an envelope, but exact markdown restoration remains the testable contract.

## Checkpoint Adapter

Checkpoint history answers: what did this document look like before?

MDKit treats historical document state as checkpoint history. Version-per-write
is the checkpoint policy where every write creates a checkpoint. No history is
the checkpoint policy where checkpoint creation is disabled.

Expected responsibilities:

- list checkpoints for a document
- read a specific checkpoint
- create manual or rule-driven checkpoints
- restore a checkpoint by handing content back to storage

Current package shape extends the storage adapter with:

```ts
type MdKitDocumentVersionMethods = {
  listDocumentVersions?(
    documentId: string,
  ): Promise<MdKitDocumentVersionSummary[]>;
  readDocumentVersion?(input: {
    documentId: string;
    versionId: string;
  }): Promise<MdKitDocumentVersionDetail | null>;
};
```

Checkpoint snapshots should preserve the same durable representation used by
storage. A checkpoint is a snapshot of the source markdown and caller-owned
metadata, not just the rendered markdown text.

The current public API still uses `Version` in type and method names. Treat
those names as compatibility names for checkpoint history.

## Collaboration Adapter

Collaboration answers: how do multiple clients edit the same live document?

Expected responsibilities:

- connect to a collaboration room
- provide a Yjs document
- expose connection status and participant metadata
- optionally expose provider lifecycle controls

Current package shape:

```ts
type MdKitCollaborationSession = {
  collaborator: MdKitCollaborationParticipant;
  document: Y.Doc;
  provider: HocuspocusProvider | null;
  roomName: string;
  status: MdKitCollaborationStatus;
};
```

The first supported implementation is Hocuspocus. The editor should not require callers to know Hocuspocus details when using the supported integration path.

Collaboration is optional. Without collaboration, writes go directly through
the storage adapter. With collaboration, Yjs is the live editing state and the
backend can snapshot Yjs to canonical markdown when it writes current content or
creates checkpoints.

The application owns durable Yjs storage and scaling infrastructure. MDKit
should expose the hooks and conversion helpers needed to persist Yjs state, but
it should not become the collaboration hosting platform.

## Adapter Composition

Consumers should be able to provide any subset:

| Provided Adapters                     | Behavior                                      |
| ------------------------------------- | --------------------------------------------- |
| none                                  | basic local editing                           |
| storage                               | load/save/autosave                            |
| storage + checkpoints                 | load/save/checkpoint history                  |
| storage + collaboration               | live editing with canonical markdown sync     |
| storage + checkpoints + collaboration | full connected editing                        |

Standalone collaboration without storage is not an official supported product
shape. Collaboration depends on storage for canonical markdown sync, restore,
and reliable recovery.

The UI should degrade by capability. It should not show controls backed by missing adapters.
