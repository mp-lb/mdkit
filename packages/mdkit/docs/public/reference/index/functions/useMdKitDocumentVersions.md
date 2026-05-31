# Function: useMdKitDocumentVersions()

```ts
function useMdKitDocumentVersions(options: UseMdKitDocumentVersionsOptions): MdKitDocumentVersionsController;
```

Defined in: [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:32](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L32)

Lists a document's checkpoints and lazily reads checkpoint detail, tracking
loading state for checkpoint-history UI.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`UseMdKitDocumentVersionsOptions`](../type-aliases/UseMdKitDocumentVersionsOptions.md) |

## Returns

[`MdKitDocumentVersionsController`](../type-aliases/MdKitDocumentVersionsController.md)
