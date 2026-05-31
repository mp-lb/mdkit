---
title: "UseMdKitDocumentOptions"
---

# Type Alias: UseMdKitDocumentOptions

```ts
type UseMdKitDocumentOptions = {
  adapter: Pick<MdKitDocumentAdapter, "readDocument" | "writeDocument" | "resyncDocument">;
  debounceMs?: number;
  documentId: string | null;
  pollMs?: number;
};
```

Defined in: [packages/mdkit/src/document/useMdKitDocument.ts:7](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L7)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="adapter"></a> `adapter` | `Pick`\<[`MdKitDocumentAdapter`](../interfaces/MdKitDocumentAdapter.md), `"readDocument"` \| `"writeDocument"` \| `"resyncDocument"`\> | [packages/mdkit/src/document/useMdKitDocument.ts:8](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L8) |
| <a id="debouncems"></a> `debounceMs?` | `number` | [packages/mdkit/src/document/useMdKitDocument.ts:12](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L12) |
| <a id="documentid"></a> `documentId` | `string` \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L13) |
| <a id="pollms"></a> `pollMs?` | `number` | [packages/mdkit/src/document/useMdKitDocument.ts:14](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L14) |
