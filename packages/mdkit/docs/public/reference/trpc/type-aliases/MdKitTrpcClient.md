---
title: "MdKitTrpcClient"
---

# Type Alias: MdKitTrpcClient

```ts
type MdKitTrpcClient = {
  listDocumentVersions: MdKitTrpcQuery<MdKitDocumentInput, {
     versions: MdKitDocumentVersionSummary[];
  }>;
  readDocument: MdKitTrpcQuery<MdKitDocumentInput, MdKitDocumentSnapshot>;
  readDocumentVersion: MdKitTrpcQuery<MdKitVersionInput, 
     | MdKitDocumentVersionDetail
    | null>;
  resyncDocument: MdKitTrpcMutation<MdKitDocumentInput, MdKitDocumentSnapshot>;
  writeDocument: MdKitTrpcMutation<MdKitDocumentWriteInput, MdKitDocumentWriteResult>;
};
```

Defined in: [packages/mdkit/src/transport/trpcClient.ts:33](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L33)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="listdocumentversions"></a> `listDocumentVersions` | `MdKitTrpcQuery`\<`MdKitDocumentInput`, \{ `versions`: [`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[]; \}\> | [packages/mdkit/src/transport/trpcClient.ts:34](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L34) |
| <a id="readdocument"></a> `readDocument` | `MdKitTrpcQuery`\<`MdKitDocumentInput`, [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\> | [packages/mdkit/src/transport/trpcClient.ts:38](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L38) |
| <a id="readdocumentversion"></a> `readDocumentVersion` | `MdKitTrpcQuery`\<`MdKitVersionInput`, \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md) \| `null`\> | [packages/mdkit/src/transport/trpcClient.ts:39](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L39) |
| <a id="resyncdocument"></a> `resyncDocument` | `MdKitTrpcMutation`\<`MdKitDocumentInput`, [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\> | [packages/mdkit/src/transport/trpcClient.ts:43](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L43) |
| <a id="writedocument"></a> `writeDocument` | `MdKitTrpcMutation`\<[`MdKitDocumentWriteInput`](../../index/type-aliases/MdKitDocumentWriteInput.md), [`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)\> | [packages/mdkit/src/transport/trpcClient.ts:44](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L44) |
