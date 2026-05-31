---
title: "createMdKitRestAdapter"
---

# Function: createMdKitRestAdapter()

```ts
function createMdKitRestAdapter(__namedParameters: CreateMdKitRestAdapterOptions): MdKitDocumentAdapter;
```

Defined in: [packages/mdkit/src/transport/rest.ts:31](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/rest.ts#L31)

Builds an [MdKitDocumentAdapter](../interfaces/MdKitDocumentAdapter.md) that talks to the mdkit REST endpoint
shape. Restore is not part of the adapter contract, so REST restore needs a
separate call from application code.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateMdKitRestAdapterOptions`](../type-aliases/CreateMdKitRestAdapterOptions.md) |

## Returns

[`MdKitDocumentAdapter`](../interfaces/MdKitDocumentAdapter.md)
