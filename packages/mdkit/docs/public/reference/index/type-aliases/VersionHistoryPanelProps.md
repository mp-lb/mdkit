---
title: "VersionHistoryPanelProps"
---

# Type Alias: VersionHistoryPanelProps

```ts
type VersionHistoryPanelProps = {
  className?: string;
  controller: MdKitDocumentVersionsController;
  onRestoreVersion?: (version: MdKitDocumentVersionDetail) => Promise<void> | void;
  title?: string;
};
```

Defined in: [packages/mdkit/src/versioning/VersionHistoryPanel.tsx:6](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/VersionHistoryPanel.tsx#L6)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="classname"></a> `className?` | `string` | [packages/mdkit/src/versioning/VersionHistoryPanel.tsx:7](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/VersionHistoryPanel.tsx#L7) |
| <a id="controller"></a> `controller` | [`MdKitDocumentVersionsController`](MdKitDocumentVersionsController.md) | [packages/mdkit/src/versioning/VersionHistoryPanel.tsx:8](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/VersionHistoryPanel.tsx#L8) |
| <a id="onrestoreversion"></a> `onRestoreVersion?` | (`version`: [`MdKitDocumentVersionDetail`](MdKitDocumentVersionDetail.md)) => `Promise`\<`void`\> \| `void` | [packages/mdkit/src/versioning/VersionHistoryPanel.tsx:9](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/VersionHistoryPanel.tsx#L9) |
| <a id="title"></a> `title?` | `string` | [packages/mdkit/src/versioning/VersionHistoryPanel.tsx:12](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/VersionHistoryPanel.tsx#L12) |
