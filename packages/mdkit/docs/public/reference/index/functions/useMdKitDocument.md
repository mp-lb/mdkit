# Function: useMdKitDocument()

```ts
function useMdKitDocument(options: UseMdKitDocumentOptions): MdKitDocumentController;
```

Defined in: [packages/mdkit/src/document/useMdKitDocument.ts:54](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L54)

Connects an editor to a storage adapter: loads the document, debounces
autosave, tracks dirty/save status, and surfaces conflicts for resolution.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`UseMdKitDocumentOptions`](../type-aliases/UseMdKitDocumentOptions.md) |

## Returns

[`MdKitDocumentController`](../type-aliases/MdKitDocumentController.md)
