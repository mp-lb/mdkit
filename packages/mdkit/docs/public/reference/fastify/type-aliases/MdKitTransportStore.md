# Type Alias: MdKitTransportStore

```ts
type MdKitTransportStore = {
  readDocument:   | MdKitDocumentSnapshot
     | Promise<MdKitDocumentSnapshot>;
  writeDocument:   | MdKitDocumentWriteResult
     | Promise<MdKitDocumentWriteResult>;
  resyncDocument?:   | MdKitDocumentSnapshot
     | Promise<MdKitDocumentSnapshot>;
  listDocumentVersions?:   | MdKitDocumentVersionSummary[]
     | Promise<MdKitDocumentVersionSummary[]>;
  readDocumentVersion?:   | MdKitDocumentVersionDetail
     | Promise<
     | MdKitDocumentVersionDetail
     | null>
     | null;
  restoreDocumentVersion?:   | MdKitDocumentWriteResult
     | Promise<MdKitDocumentWriteResult>;
  readCollaborationState?:   | Uint8Array<ArrayBufferLike>
     | Promise<Uint8Array<ArrayBufferLike> | null>
     | null;
  writeCollaborationState?: void | Promise<void>;
};
```

Defined in: [packages/mdkit/src/transport/store.ts:9](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L9)

## Methods

### readDocument()

```ts
readDocument(documentId: string): 
  | MdKitDocumentSnapshot
| Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/transport/store.ts:10](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)
  \| `Promise`\<[`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\>

***

### writeDocument()

```ts
writeDocument(input: MdKitDocumentWriteInput): 
  | MdKitDocumentWriteResult
| Promise<MdKitDocumentWriteResult>;
```

Defined in: [packages/mdkit/src/transport/store.ts:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L13)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitDocumentWriteInput`](../../index/type-aliases/MdKitDocumentWriteInput.md) |

#### Returns

  \| [`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)
  \| `Promise`\<[`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)\>

***

### resyncDocument()?

```ts
optional resyncDocument(documentId: string): 
  | MdKitDocumentSnapshot
| Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/transport/store.ts:16](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)
  \| `Promise`\<[`MdKitDocumentSnapshot`](../../index/type-aliases/MdKitDocumentSnapshot.md)\>

***

### listDocumentVersions()?

```ts
optional listDocumentVersions(documentId: string): 
  | MdKitDocumentVersionSummary[]
| Promise<MdKitDocumentVersionSummary[]>;
```

Defined in: [packages/mdkit/src/transport/store.ts:19](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

  \| [`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[]
  \| `Promise`\<[`MdKitDocumentVersionSummary`](../../index/type-aliases/MdKitDocumentVersionSummary.md)[]\>

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

Defined in: [packages/mdkit/src/transport/store.ts:22](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L22)

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

### restoreDocumentVersion()?

```ts
optional restoreDocumentVersion(input: {
  documentId: string;
  versionId: string;
}): 
  | MdKitDocumentWriteResult
| Promise<MdKitDocumentWriteResult>;
```

Defined in: [packages/mdkit/src/transport/store.ts:29](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `documentId`: `string`; `versionId`: `string`; \} |
| `input.documentId` | `string` |
| `input.versionId` | `string` |

#### Returns

  \| [`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)
  \| `Promise`\<[`MdKitDocumentWriteResult`](../../index/type-aliases/MdKitDocumentWriteResult.md)\>

***

### readCollaborationState()?

```ts
optional readCollaborationState(documentName: string): 
  | Uint8Array<ArrayBufferLike>
  | Promise<Uint8Array<ArrayBufferLike> | null>
  | null;
```

Defined in: [packages/mdkit/src/transport/store.ts:33](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L33)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentName` | `string` |

#### Returns

  \| `Uint8Array`\<`ArrayBufferLike`\>
  \| `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>
  \| `null`

***

### writeCollaborationState()?

```ts
optional writeCollaborationState(documentName: string, state: Uint8Array): void | Promise<void>;
```

Defined in: [packages/mdkit/src/transport/store.ts:36](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/store.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentName` | `string` |
| `state` | `Uint8Array` |

#### Returns

`void` \| `Promise`\<`void`\>
