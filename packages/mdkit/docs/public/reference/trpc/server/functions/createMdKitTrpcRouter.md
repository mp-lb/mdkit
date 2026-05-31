---
title: "createMdKitTrpcRouter"
---

# Function: createMdKitTrpcRouter()

```ts
function createMdKitTrpcRouter(store: MdKitTransportStore): BuiltRouter<{
  ctx: object;
  meta: object;
  errorShape: DefaultErrorShape;
  transformer: false;
}, DecorateCreateRouterOptions<{
  listDocumentVersions: QueryProcedure<{
     input: {
        documentId: string;
     };
     output: {
        versions: MdKitDocumentVersionSummary[];
     };
     meta: object;
  }>;
  readDocument: QueryProcedure<{
     input: {
        documentId: string;
     };
     output: MdKitDocumentSnapshot;
     meta: object;
  }>;
  readDocumentVersion: QueryProcedure<{
     input: {
        documentId: string;
        versionId: string;
     };
     output:   | MdKitDocumentVersionDetail
        | null;
     meta: object;
  }>;
  resyncDocument: MutationProcedure<{
     input: {
        documentId: string;
     };
     output: MdKitDocumentSnapshot;
     meta: object;
  }>;
  restoreDocumentVersion: MutationProcedure<{
     input: {
        documentId: string;
        versionId: string;
     };
     output:   | {
        version: MdKitDocumentVersionToken;
        updatedAt?: string | null;
      }
        | {
        conflict: true;
        version?: MdKitDocumentVersionToken;
        updatedAt?: string | null;
      };
     meta: object;
  }>;
  writeDocument: MutationProcedure<{
     input: {
        baseVersion: string | number | null;
        content: string;
        documentId: string;
        force?: boolean;
     };
     output:   | {
        version: MdKitDocumentVersionToken;
        updatedAt?: string | null;
      }
        | {
        conflict: true;
        version?: MdKitDocumentVersionToken;
        updatedAt?: string | null;
      };
     meta: object;
  }>;
}>>;
```

Defined in: [packages/mdkit/src/transport/trpcServer.ts:30](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcServer.ts#L30)

Builds a tRPC router exposing document read/write/resync, checkpoint
list/read, and restore over a transport store (typically from
`createMdKitBackend`). Mount it standalone or nested in an app router.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `store` | [`MdKitTransportStore`](../../../fastify/type-aliases/MdKitTransportStore.md) |

## Returns

`BuiltRouter`\<\{
  `ctx`: `object`;
  `meta`: `object`;
  `errorShape`: `DefaultErrorShape`;
  `transformer`: `false`;
\}, `DecorateCreateRouterOptions`\<\{
  `listDocumentVersions`: `QueryProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
     \};
     `output`: \{
        `versions`: [`MdKitDocumentVersionSummary`](../../../index/type-aliases/MdKitDocumentVersionSummary.md)[];
     \};
     `meta`: `object`;
  \}\>;
  `readDocument`: `QueryProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
     \};
     `output`: [`MdKitDocumentSnapshot`](../../../index/type-aliases/MdKitDocumentSnapshot.md);
     `meta`: `object`;
  \}\>;
  `readDocumentVersion`: `QueryProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
        `versionId`: `string`;
     \};
     `output`:   \| [`MdKitDocumentVersionDetail`](../../../index/type-aliases/MdKitDocumentVersionDetail.md)
        \| `null`;
     `meta`: `object`;
  \}\>;
  `resyncDocument`: `MutationProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
     \};
     `output`: [`MdKitDocumentSnapshot`](../../../index/type-aliases/MdKitDocumentSnapshot.md);
     `meta`: `object`;
  \}\>;
  `restoreDocumentVersion`: `MutationProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
        `versionId`: `string`;
     \};
     `output`:   \| \{
        `version`: [`MdKitDocumentVersionToken`](../../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \}
        \| \{
        `conflict`: `true`;
        `version?`: [`MdKitDocumentVersionToken`](../../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \};
     `meta`: `object`;
  \}\>;
  `writeDocument`: `MutationProcedure`\<\{
     `input`: \{
        `baseVersion`: `string` \| `number` \| `null`;
        `content`: `string`;
        `documentId`: `string`;
        `force?`: `boolean`;
     \};
     `output`:   \| \{
        `version`: [`MdKitDocumentVersionToken`](../../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \}
        \| \{
        `conflict`: `true`;
        `version?`: [`MdKitDocumentVersionToken`](../../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \};
     `meta`: `object`;
  \}\>;
\}\>\>
