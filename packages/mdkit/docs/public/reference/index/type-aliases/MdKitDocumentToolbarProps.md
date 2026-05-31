---
title: "MdKitDocumentToolbarProps"
---

# Type Alias: MdKitDocumentToolbarProps

```ts
type MdKitDocumentToolbarProps = {
  className?: string;
  collaboration?: MdKitCollaborationSession | null;
  document: MdKitDocumentController;
  onOpenConflict?: () => Promise<void> | void;
  onOpenVersionHistory?: () => Promise<void> | void;
  showConflictActions?: boolean;
  versions?:   | MdKitDocumentVersionsController
     | null;
};
```

Defined in: [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:7](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L7)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="classname"></a> `className?` | `string` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:8](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L8) |
| <a id="collaboration"></a> `collaboration?` | [`MdKitCollaborationSession`](MdKitCollaborationSession.md) \| `null` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:9](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L9) |
| <a id="document"></a> `document` | [`MdKitDocumentController`](MdKitDocumentController.md) | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:10](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L10) |
| <a id="onopenconflict"></a> `onOpenConflict?` | () => `Promise`\<`void`\> \| `void` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:11](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L11) |
| <a id="onopenversionhistory"></a> `onOpenVersionHistory?` | () => `Promise`\<`void`\> \| `void` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:12](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L12) |
| <a id="showconflictactions"></a> `showConflictActions?` | `boolean` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L13) |
| <a id="versions"></a> `versions?` | \| [`MdKitDocumentVersionsController`](MdKitDocumentVersionsController.md) \| `null` | [packages/mdkit/src/document/MdKitDocumentToolbar.tsx:14](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/MdKitDocumentToolbar.tsx#L14) |
