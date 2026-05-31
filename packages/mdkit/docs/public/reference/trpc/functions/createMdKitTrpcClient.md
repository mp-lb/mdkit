---
title: "createMdKitTrpcClient"
---

# Function: createMdKitTrpcClient()

```ts
function createMdKitTrpcClient(__namedParameters: CreateMdKitTrpcClientAdapterOptions): TRPCClient<BuiltRouter<{
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
}>>>;
```

Defined in: [packages/mdkit/src/transport/trpcClient.ts:74](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L74)

Creates a typed tRPC proxy client for the mdkit router at `url`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateMdKitTrpcClientAdapterOptions`](../type-aliases/CreateMdKitTrpcClientAdapterOptions.md) |

## Returns

`TRPCClient`\<`BuiltRouter`\<\{
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
        `versions`: [`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[];
     \};
     `meta`: `object`;
  \}\>;
  `readDocument`: `QueryProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
     \};
     `output`: [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md);
     `meta`: `object`;
  \}\>;
  `readDocumentVersion`: `QueryProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
        `versionId`: `string`;
     \};
     `output`:   \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md)
        \| `null`;
     `meta`: `object`;
  \}\>;
  `resyncDocument`: `MutationProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
     \};
     `output`: [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md);
     `meta`: `object`;
  \}\>;
  `restoreDocumentVersion`: `MutationProcedure`\<\{
     `input`: \{
        `documentId`: `string`;
        `versionId`: `string`;
     \};
     `output`:   \| \{
        `version`: [`MdKitDocumentVersionToken`](../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \}
        \| \{
        `conflict`: `true`;
        `version?`: [`MdKitDocumentVersionToken`](../../index/type-aliases/MdKitDocumentVersionToken.md);
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
        `version`: [`MdKitDocumentVersionToken`](../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \}
        \| \{
        `conflict`: `true`;
        `version?`: [`MdKitDocumentVersionToken`](../../index/type-aliases/MdKitDocumentVersionToken.md);
        `updatedAt?`: `string` \| `null`;
      \};
     `meta`: `object`;
  \}\>;
\}\>\>\>
