---
title: "MdKitBackendStore"
---

# Type Alias: MdKitBackendStore

```ts
type MdKitBackendStore = {
  createCheckpoint?:   | MdKitDocumentVersionSummary
     | Promise<MdKitDocumentVersionSummary>;
  getLatestCheckpoint?:   | MdKitDocumentVersionDetail
     | Promise<
     | MdKitDocumentVersionDetail
     | null>
     | null;
  listDocumentVersions?:   | MdKitDocumentVersionSummary[]
     | Promise<MdKitDocumentVersionSummary[]>;
  readCollaborationState?:   | Uint8Array<ArrayBufferLike>
     | Promise<Uint8Array<ArrayBufferLike> | null>
     | null;
  readDocument:   | MdKitDocumentSnapshot
     | Promise<MdKitDocumentSnapshot>;
  readDocumentVersion?:   | MdKitDocumentVersionDetail
     | Promise<
     | MdKitDocumentVersionDetail
     | null>
     | null;
  resyncDocument?:   | MdKitDocumentSnapshot
     | Promise<MdKitDocumentSnapshot>;
  restoreDocumentVersion?:   | MdKitDocumentWriteResult
     | Promise<MdKitDocumentWriteResult>;
  writeCollaborationState?: void | Promise<void>;
  writeDocument:   | MdKitDocumentWriteResult
     | Promise<MdKitDocumentWriteResult>;
};
```

Defined in: [packages/mdkit/src/transport/backend.ts:32](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L32)

Application-owned persistence contract consumed by [createMdKitBackend](../functions/createMdKitBackend.md).
Implement it with your database; mdkit calls `createCheckpoint` when the
configured [CheckpointPolicy](../../index/variables/CheckpointPolicy.md) triggers — the store never interprets the
policy itself.

## Methods

### createCheckpoint()?

```ts
optional createCheckpoint(input: MdKitCreateCheckpointInput): 
  | MdKitDocumentVersionSummary
| Promise<MdKitDocumentVersionSummary>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:33](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitCreateCheckpointInput`](MdKitCreateCheckpointInput.md) |

#### Returns

  \| [`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)
  \| `Promise`\<[`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)\>

***

### getLatestCheckpoint()?

```ts
optional getLatestCheckpoint(documentId: string): 
  | MdKitDocumentVersionDetail
  | Promise<
  | MdKitDocumentVersionDetail
  | null>
  | null;
```

Defined in: [packages/mdkit/src/transport/backend.ts:36](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md)
  \| `Promise`\<
  \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md)
  \| `null`\>
  \| `null`

***

### listDocumentVersions()?

```ts
optional listDocumentVersions(documentId: string): 
  | MdKitDocumentVersionSummary[]
| Promise<MdKitDocumentVersionSummary[]>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:39](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[]
  \| `Promise`\<[`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[]\>

***

### readCollaborationState()?

```ts
optional readCollaborationState(documentName: string): 
  | Uint8Array<ArrayBufferLike>
  | Promise<Uint8Array<ArrayBufferLike> | null>
  | null;
```

Defined in: [packages/mdkit/src/transport/backend.ts:42](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L42)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentName` | `string` |

#### Returns

  \| `Uint8Array`\<`ArrayBufferLike`\>
  \| `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>
  \| `null`

***

### readDocument()

```ts
readDocument(documentId: string): 
  | MdKitDocumentSnapshot
| Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:45](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L45)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)
  \| `Promise`\<[`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\>

***

### readDocumentVersion()?

```ts
optional readDocumentVersion(input: {
  documentId: string;
  versionId: string;
}): 
  | MdKitDocumentVersionDetail
  | Promise<
  | MdKitDocumentVersionDetail
  | null>
  | null;
```

Defined in: [packages/mdkit/src/transport/backend.ts:48](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `documentId`: `string`; `versionId`: `string`; \} |
| `input.documentId` | `string` |
| `input.versionId` | `string` |

#### Returns

  \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md)
  \| `Promise`\<
  \| [`MdKitDocumentVersionDetail`](../../index/type-aliases/MdKitDocumentVersionDetail.md)
  \| `null`\>
  \| `null`

***

### resyncDocument()?

```ts
optional resyncDocument(documentId: string): 
  | MdKitDocumentSnapshot
| Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:55](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)
  \| `Promise`\<[`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\>

***

### restoreDocumentVersion()?

```ts
optional restoreDocumentVersion(input: MdKitRestoreDocumentVersionInput): 
  | MdKitDocumentWriteResult
| Promise<MdKitDocumentWriteResult>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:58](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L58)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitRestoreDocumentVersionInput`](../../fastify/type-aliases/MdKitRestoreDocumentVersionInput.md) |

#### Returns

  \| [`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)
  \| `Promise`\<[`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)\>

***

### writeCollaborationState()?

```ts
optional writeCollaborationState(documentName: string, state: Uint8Array): void | Promise<void>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:61](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentName` | `string` |
| `state` | `Uint8Array` |

#### Returns

`void` \| `Promise`\<`void`\>

***

### writeDocument()

```ts
writeDocument(input: MdKitDocumentWriteInput): 
  | MdKitDocumentWriteResult
| Promise<MdKitDocumentWriteResult>;
```

Defined in: [packages/mdkit/src/transport/backend.ts:65](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L65)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitDocumentWriteInput`](../../index/type-aliases/MdKitDocumentWriteInput.md) |

#### Returns

  \| [`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)
  \| `Promise`\<[`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)\>
