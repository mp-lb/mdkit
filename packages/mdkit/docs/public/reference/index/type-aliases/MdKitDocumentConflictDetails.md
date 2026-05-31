---
title: "MdKitDocumentConflictDetails"
---

# Type Alias: MdKitDocumentConflictDetails

```ts
type MdKitDocumentConflictDetails = {
  baseContent: string;
  localContent: string;
  remoteContent: string | null;
  remoteUpdatedAt: string | null;
  remoteVersion: MdKitDocumentVersionToken;
};
```

Defined in: [packages/mdkit/src/document/useMdKitDocument.ts:17](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L17)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="basecontent"></a> `baseContent` | `string` | [packages/mdkit/src/document/useMdKitDocument.ts:18](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L18) |
| <a id="localcontent"></a> `localContent` | `string` | [packages/mdkit/src/document/useMdKitDocument.ts:19](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L19) |
| <a id="remotecontent"></a> `remoteContent` | `string` \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:20](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L20) |
| <a id="remoteupdatedat"></a> `remoteUpdatedAt` | `string` \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:21](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L21) |
| <a id="remoteversion"></a> `remoteVersion` | [`MdKitDocumentVersionToken`](MdKitDocumentVersionToken.md) | [packages/mdkit/src/document/useMdKitDocument.ts:22](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L22) |
