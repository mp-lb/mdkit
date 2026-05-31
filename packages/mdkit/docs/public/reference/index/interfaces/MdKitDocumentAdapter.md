---
title: "MdKitDocumentAdapter"
---

# Interface: MdKitDocumentAdapter

Defined in: [packages/mdkit/src/document/documentTypes.ts:48](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L48)

Storage contract the document hooks talk to. Implement it over tRPC, REST, or
anything else; only `readDocument`/`writeDocument` are required, the
checkpoint methods are optional and enable version-history UI.

## Methods

### readDocument()

```ts
readDocument(documentId: string): Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:49](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L49)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

`Promise`\<[`MdKitDocumentSnapshot`](../type-aliases/MdKitDocumentSnapshot.md)\>

***

### writeDocument()

```ts
writeDocument(input: MdKitDocumentWriteInput): Promise<MdKitDocumentWriteResult>;
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:50](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L50)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitDocumentWriteInput`](../type-aliases/MdKitDocumentWriteInput.md) |

#### Returns

`Promise`\<[`MdKitDocumentWriteResult`](../type-aliases/MdKitDocumentWriteResult.md)\>

***

### resyncDocument()?

```ts
optional resyncDocument(documentId: string): Promise<MdKitDocumentSnapshot>;
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:53](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L53)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

`Promise`\<[`MdKitDocumentSnapshot`](../type-aliases/MdKitDocumentSnapshot.md)\>

***

### listDocumentVersions()?

```ts
optional listDocumentVersions(documentId: string): Promise<MdKitDocumentVersionSummary[]>;
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:54](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L54)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `documentId` | `string` |

#### Returns

`Promise`\<[`MdKitDocumentVersionSummary`](../type-aliases/MdKitDocumentVersionSummary.md)[]\>

***

### readDocumentVersion()?

```ts
optional readDocumentVersion(input: {
  documentId: string;
  versionId: string;
}): Promise<
  | MdKitDocumentVersionDetail
| null>;
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:57](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L57)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `documentId`: `string`; `versionId`: `string`; \} |
| `input.documentId` | `string` |
| `input.versionId` | `string` |

#### Returns

`Promise`\<
  \| [`MdKitDocumentVersionDetail`](../type-aliases/MdKitDocumentVersionDetail.md)
  \| `null`\>
