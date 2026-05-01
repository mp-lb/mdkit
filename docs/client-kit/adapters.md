# Adapters

The target model is three independent adapter families.

## Storage Adapter

Storage answers: what is the current document content?

Storage should persist markdown as the durable document content. A JSON envelope
is acceptable when we need metadata, format versioning, or future migration
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

## Version Adapter

Versioning answers: what did this document look like before?

Expected responsibilities:

- list versions for a document
- read a specific version
- restore a version by handing content back to storage

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

Version snapshots should preserve the same durable representation used by
storage. A version is a snapshot of the source markdown and its storage metadata,
not just the rendered markdown text.

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

## Adapter Composition

Consumers should be able to provide any subset:

| Provided Adapters                  | Behavior                       |
| ---------------------------------- | ------------------------------ |
| none                               | basic local editing            |
| storage                            | load/save/autosave             |
| storage + versions                 | load/save/version history      |
| collaboration                      | live collaborative editing     |
| storage + collaboration            | live editing with durable sync |
| storage + versions + collaboration | full connected editing         |

The UI should degrade by capability. It should not show controls backed by missing adapters.
