# Quick Start

Markdown Editor Kit is a React package for teams that need more than a bare
markdown editor widget. It starts with a controlled markdown editor that behaves
like a textarea, then adds autosave, version history, conflict handling, and
collaboration through adapters.

```bash
pnpm add @mp-lb/mdkit
```

Import the stylesheet once if you want reset-resistant markdown defaults and
generic fallback styling for the base panels:

```ts
import "@mp-lb/mdkit/styles.css";
```

See [Styling](./styling.md) for reset handling, dark mode, fonts, sizing, and
custom panel styles.

## Basic Editor

`MdKitEditor` is the textarea-like entry point. It has no persistence, no
version history, and no collaboration. You own the `value` and `onChange` state.

```tsx
import { useState } from "react";
import { MdKitEditor } from "@mp-lb/mdkit";
import "@mp-lb/mdkit/styles.css";

export function MarkdownEditorExample() {
  const [markdown, setMarkdown] = useState("# Hello markdown");

  return <MdKitEditor value={markdown} onChange={setMarkdown} />;
}
```

Use this when you want a local editor, a form field, or a debug surface.

## Connected Editor

The connected workflow combines:

- `useMdKitDocument` for loading, autosave, dirty state, and conflict detection
- `useMdKitDocumentVersions` for version browsing and restore
- `useMdKitCollaboration` for Hocuspocus/Yjs collaboration
- `MdKitDocumentToolbar`, `VersionHistoryPanel`, and `MdKitConflictPanel` for
  a complete base-panel UI

The TypeScript-first path is tRPC. REST is also supported for high-compatibility
backends and non-TypeScript stacks.

### Frontend With tRPC

```tsx
import { useMemo, useState } from "react";
import {
  MdKitConflictPanel,
  MdKitDocumentToolbar,
  MdKitEditor,
  VersionHistoryPanel,
  useMdKitCollaboration,
  useMdKitDocument,
  useMdKitDocumentVersions,
  type MdKitDocumentVersionDetail,
} from "@mp-lb/mdkit";
import {
  createMdKitTrpcAdapter,
  createMdKitTrpcClient,
} from "@mp-lb/mdkit/trpc/client";

const documentId = "docs/example.md";

export function ConnectedMarkdownEditor({
  apiUrl,
}: {
  apiUrl: string;
}) {
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);

  const trpc = useMemo(
    () => createMdKitTrpcClient({ url: `${apiUrl}/trpc` }),
    [apiUrl],
  );
  const adapter = useMemo(() => createMdKitTrpcAdapter({ client: trpc }), [trpc]);

  const document = useMdKitDocument({ adapter, documentId });
  const versions = useMdKitDocumentVersions({ adapter, documentId });
  const collaboration = useMdKitCollaboration({
    collaborator: { id: "user-1", name: "Ada" },
    documentId,
    endpoint: `${apiUrl.replace(/^http/, "ws")}/collaboration`,
  });

  const restoreVersion = async (version: MdKitDocumentVersionDetail) => {
    await trpc.restoreDocumentVersion.mutate({
      documentId,
      versionId: version.id,
    });
    await document.resync();
    await versions.refresh();
  };

  return (
    <>
      <MdKitDocumentToolbar
        collaboration={collaboration}
        document={document}
        versions={versions}
        onOpenConflict={() => setConflictOpen(true)}
        onOpenVersionHistory={() => setVersionHistoryOpen(true)}
      />

      <MdKitEditor
        collaboration={collaboration}
        fillHeight
        readOnly={document.conflict}
        value={document.value}
        onChange={document.setContent}
        onFocusChange={document.setFocused}
      />

      {versionHistoryOpen ? (
        <div role="dialog" aria-label="Version history">
          <VersionHistoryPanel
            controller={versions}
            onRestoreVersion={restoreVersion}
          />
        </div>
      ) : null}

      {document.conflict && conflictOpen ? (
        <div role="dialog" aria-label="Resolve conflict">
          <MdKitConflictPanel document={document} />
        </div>
      ) : null}
    </>
  );
}
```

The modal shells above are intentionally plain. Put `VersionHistoryPanel` and
`MdKitConflictPanel` inside your own dialog, drawer, side panel, or editor
replacement view. If your app uses shadcn/ui, see [Shadcn Plugin](./shadcn.md)
for the source-installed workflow component.

### Backend With Fastify And tRPC

The backend only needs a store object. Replace `createYourDocumentStore()` with
Postgres, MongoDB, Redis, files, or any other durable storage.

```ts
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { createMdKitTrpcRouter } from "@mp-lb/mdkit/trpc/server";

const app = Fastify();
const store = createYourDocumentStore();

const collaboration = Server.configure({
  extensions: [
    new Database({
      fetch: ({ documentName }) => store.readCollaborationState(documentName),
      store: ({ documentName, state }) =>
        store.writeCollaborationState(documentName, state),
    }),
  ],
});

await app.register(cors, { origin: true });
await app.register(websocket);

await app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: createMdKitTrpcRouter(store),
  },
});

app.get("/collaboration", { websocket: true }, (socket, request) => {
  collaboration.handleConnection(socket, request.raw, {});
});

await app.listen({ port: Number(process.env.PORT ?? 4312) });
```

The store object implements `MdKitTransportStore`: current document reads and
writes, version list/read/restore, and optional collaboration state storage. See
[API Reference](./api.md#transport-helpers).

### REST Compatibility

If you want REST instead of tRPC, use the REST frontend adapter:

```tsx
import { createMdKitRestAdapter } from "@mp-lb/mdkit";

const adapter = createMdKitRestAdapter({
  baseUrl: "https://api.example.com/mdkit",
});
```

On Fastify, register the matching REST endpoints:

```ts
import { registerMdKitFastify } from "@mp-lb/mdkit/fastify";

await registerMdKitFastify(app, {
  prefix: "/mdkit",
  store,
});
```

The mdkit testbench uses this split deliberately: `Connected (panels)` uses the
REST adapter, while `Connected (shadcn)` uses the tRPC adapter.

## Questions

### Do the backends need to know about each other?

Storage, version history, and collaboration can stay separate. Storage stores
the current markdown snapshot. Version history stores markdown snapshots.
Hocuspocus stores live Yjs collaboration state. They only need glue if your
product wants collaborative edits to automatically become saved markdown
versions.

### Does mdkit require tRPC or these exact REST endpoints?

No. The frontend hooks only need an `MdKitDocumentAdapter`. You can use REST,
tRPC, GraphQL, server actions, IndexedDB, Rails, Go, or anything else as long as
your adapter returns the documented shapes.

### Do I have to use the base panels?

No. The base panels are the fastest way to get a complete workflow working in
any React app. If you want a fully custom UI, use `useMdKitDocument`,
`useMdKitDocumentVersions`, and `useMdKitCollaboration` directly and render your
own controls.
