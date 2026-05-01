# API Reference

This page lists the current public exports from
`@mp-lb/mdkit`. It is hand-written for now; a generated API
reference from JSDoc/TypeScript declarations is a good follow-up once the public
surface settles.

## Editor

### `MdKitEditor`

Primary editor component.

Local mode:

```tsx
<MdKitEditor value={markdown} onChange={setMarkdown} />
```

Collaborative mode:

```tsx
<MdKitEditor collaboration={collaboration} />
```

### `MdKitEditorProps`

Props for `MdKitEditor`.

Local editing props:

- `value: string`
- `onChange?: (markdown: string) => void`
- `onFocusChange?: (focused: boolean) => void`
- `fillHeight?: boolean`
- `instanceKey?: string | number`
- `className?: string`
- `style?: CSSProperties`

Collaborative editing props:

- `collaboration: MdKitCollaborationSession`
- `onFocusChange?: (focused: boolean) => void`
- `fillHeight?: boolean`
- `className?: string`
- `style?: CSSProperties`

`fillHeight` makes the editor fill its parent height, own its scroll area, and
keep blank space below the last line clickable so it focuses the cursor at the
end. Leave it off when the host application owns sizing and scrolling.

The package stylesheet includes reset-resistant markdown rules for headings,
lists, code blocks, blockquotes, and links. Styling is controlled with CSS
variables on `.mdkit-markdown-editor`. See [Styling](./styling.md) for setup,
dark mode, fonts, sizing, and theme customization.

## Document Persistence

### `useMdKitDocument`

Hook for loading, editing, saving, autosaving, and resyncing a markdown document
through a storage adapter.

### `MdKitDocumentController`

Return type for `useMdKitDocument`. It contains the current markdown value,
status flags, save actions, resync actions, conflict details, and state setters
used by editor UI.

### `MdKitDocumentToolbar`

Unstyled workflow controls for a connected markdown document. Render this above
or near `MdKitEditor` when you want mdkit to handle common document actions
without adopting a design system.

```tsx
<MdKitDocumentToolbar
  document={document}
  versions={versions}
  collaboration={collaboration}
  onOpenConflict={() => setConflictDialogOpen(true)}
  onOpenVersionHistory={() => setVersionPanelOpen(true)}
/>
```

It renders save status, collaboration status, an optional version-history entry
point labelled with the current version, and a conflict entry point via
`onOpenConflict`.

Related type:

- `MdKitDocumentToolbarProps`

### `MdKitConflictPanel`

Base panel for conflict resolution. It renders inline semantic HTML, previews the
remote and local content snapshots, and uses the document controller actions to
keep the remote document or keep the local editor content.

```tsx
<MdKitConflictPanel document={document} />
```

It returns `null` when `document.conflict` is false. Use it next to
`MdKitDocumentToolbar` when you want the base-panel workflow. If your app uses a
modal, drawer, or editor-replacement view, put this panel inside your own shell.

Related type:

- `MdKitConflictPanelProps`

### `MdKitDocumentAdapter`

Storage adapter contract. Implement this to connect document persistence to your
backend.

```ts
type MdKitDocumentAdapter = {
  readDocument(documentId: string): Promise<MdKitDocumentSnapshot>;
  writeDocument(
    input: MdKitDocumentWriteInput,
  ): Promise<MdKitDocumentWriteResult>;
  resyncDocument?(documentId: string): Promise<MdKitDocumentSnapshot>;
  listDocumentVersions?(
    documentId: string,
  ): Promise<MdKitDocumentVersionSummary[]>;
  readDocumentVersion?(input: {
    documentId: string;
    versionId: string;
  }): Promise<MdKitDocumentVersionDetail | null>;
};
```

Required storage methods:

- `readDocument` returns the current markdown snapshot.
- `writeDocument` persists markdown with the caller's base version.
- `resyncDocument` is optional and can force a fresh read from the canonical
  source.

Optional versioning methods:

- `listDocumentVersions` returns available versions for the document.
- `readDocumentVersion` returns a saved markdown snapshot for one version.

Related storage types:

- `MdKitDocumentSnapshot`
- `MdKitDocumentWriteInput`
- `MdKitDocumentWriteResult`

```ts
type MdKitDocumentSnapshot = {
  content: string;
  version: MdKitDocumentVersionToken;
  updatedAt?: string | null;
};

type MdKitDocumentWriteInput = {
  documentId: string;
  content: string;
  baseVersion: MdKitDocumentVersionToken;
};

type MdKitDocumentWriteResult =
  | {
      version: MdKitDocumentVersionToken;
      updatedAt?: string | null;
    }
  | {
      conflict: true;
      version?: MdKitDocumentVersionToken;
      updatedAt?: string | null;
    };
```

## Styling

### `MdKitThemeEditor`

Reusable controls for editing an `MdKitEditorTheme`. This component is optional
and mainly intended for theme builders, documentation, and debug tools.

```tsx
const [theme, setTheme] = useState(darkMdKitEditorTheme);
const style = createMdKitEditorThemeStyle(theme);

<MdKitThemeEditor theme={theme} onChange={setTheme} />
<MdKitEditor style={style} value={markdown} onChange={setMarkdown} />
```

Related exports:

- `MdKitEditorTheme`
- `MdKitEditorThemeStyle`
- `createMdKitEditorThemeStyle`
- `defaultMdKitEditorTheme`
- `darkMdKitEditorTheme`

`MdKitThemeEditor` also relies on the optional package stylesheet for its own
layout. Without that stylesheet, it still renders normal form controls.

## Version History

### `useMdKitDocumentVersions`

Hook for listing versions, reading a version detail, and tracking version
history loading state.

### `VersionHistoryPanel`

UI component for rendering version history from `useMdKitDocumentVersions`.

Related types:

- `MdKitDocumentVersionSummary`
- `MdKitDocumentVersionDetail`
- `MdKitDocumentVersionToken`
- `MdKitDocumentVersionsController`
- `UseMdKitDocumentVersionsOptions`
- `VersionHistoryPanelProps`

```ts
type MdKitDocumentVersionToken = string | number | null;

type MdKitDocumentVersionSummary = {
  id: string;
  label?: string;
  createdAt: string;
  authorLabel?: string | null;
  version?: MdKitDocumentVersionToken;
};

type MdKitDocumentVersionDetail = MdKitDocumentVersionSummary & {
  content: string;
};
```

## Collaboration

### `useMdKitCollaboration`

Hook for creating a Hocuspocus/Yjs collaboration session for `MdKitEditor`.

Related types:

- `MdKitCollaborationParticipant`
- `MdKitCollaborationSession`
- `MdKitCollaborationStatus`

```ts
type MdKitCollaborationSession = {
  collaborator: MdKitCollaborationParticipant;
  document: Y.Doc;
  provider: HocuspocusProvider | null;
  roomName: string;
  status: MdKitCollaborationStatus;
};
```

## Transport Helpers

### `createMdKitRestAdapter`

Creates an `MdKitDocumentAdapter` that talks to the mdkit REST endpoint shape.

```ts
const adapter = createMdKitRestAdapter({
  baseUrl: "https://api.example.com/mdkit",
});
```

Exported from `@mp-lb/mdkit`.

### `registerMdKitFastify`

Registers the matching REST endpoints on a Fastify app.

```ts
await registerMdKitFastify(app, {
  prefix: "/mdkit",
  store,
});
```

Exported from `@mp-lb/mdkit/fastify`.

### `createMdKitTrpcRouter`

Creates a tRPC router for document reads, writes, resync, version list/read, and
version restore.

```ts
await app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: createMdKitTrpcRouter(store),
  },
});
```

Exported from `@mp-lb/mdkit/trpc/server`.

### `createMdKitTrpcClient` and `createMdKitTrpcAdapter`

Creates a typed tRPC client and turns it into an `MdKitDocumentAdapter`.

```ts
const client = createMdKitTrpcClient({ url: `${apiUrl}/trpc` });
const adapter = createMdKitTrpcAdapter({ client });
```

Exported from `@mp-lb/mdkit/trpc/client`.

### `MdKitTransportStore`

Backend store contract used by the Fastify and tRPC helpers.

```ts
type MdKitTransportStore = {
  readDocument(documentId: string): Promise<MdKitDocumentSnapshot>;
  writeDocument(
    input: MdKitDocumentWriteInput,
  ): Promise<MdKitDocumentWriteResult>;
  resyncDocument?(documentId: string): Promise<MdKitDocumentSnapshot>;
  listDocumentVersions?(
    documentId: string,
  ): Promise<MdKitDocumentVersionSummary[]>;
  readDocumentVersion?(input: {
    documentId: string;
    versionId: string;
  }): Promise<MdKitDocumentVersionDetail | null>;
  restoreDocumentVersion?(input: {
    documentId: string;
    versionId: string;
  }): Promise<MdKitDocumentWriteResult>;
  readCollaborationState?(documentName: string): Promise<Uint8Array | null>;
  writeCollaborationState?(
    documentName: string,
    state: Uint8Array,
  ): Promise<void>;
};
```
