# Function: createMdKitTrpcAdapter()

```ts
function createMdKitTrpcAdapter(__namedParameters: CreateMdKitTrpcAdapterOptions): MdKitDocumentAdapter;
```

Defined in: [packages/mdkit/src/transport/trpcClient.ts:58](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/trpcClient.ts#L58)

Turns an mdkit tRPC client (standalone or a nested sub-client of your app
router) into an [MdKitDocumentAdapter](../../index/interfaces/MdKitDocumentAdapter.md) for the document hooks.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateMdKitTrpcAdapterOptions`](../type-aliases/CreateMdKitTrpcAdapterOptions.md) |

## Returns

[`MdKitDocumentAdapter`](../../index/interfaces/MdKitDocumentAdapter.md)
