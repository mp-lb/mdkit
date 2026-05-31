# Function: detectMdKitDocumentConflict()

```ts
function detectMdKitDocumentConflict(input: {
  baseVersion: MdKitDocumentVersionToken;
  currentVersion: MdKitDocumentVersionToken;
}): boolean;
```

Defined in: [packages/mdkit/src/core/documentEngine.ts:51](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/documentEngine.ts#L51)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | \{ `baseVersion`: [`MdKitDocumentVersionToken`](../type-aliases/MdKitDocumentVersionToken.md); `currentVersion`: [`MdKitDocumentVersionToken`](../type-aliases/MdKitDocumentVersionToken.md); \} |
| `input.baseVersion` | [`MdKitDocumentVersionToken`](../type-aliases/MdKitDocumentVersionToken.md) |
| `input.currentVersion` | [`MdKitDocumentVersionToken`](../type-aliases/MdKitDocumentVersionToken.md) |

## Returns

`boolean`
