# Function: createMdKitBackend()

```ts
function createMdKitBackend(__namedParameters: CreateMdKitBackendOptions): MdKitTransportStore;
```

Defined in: [packages/mdkit/src/transport/backend.ts:200](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/backend.ts#L200)

Wraps an application [MdKitBackendStore](../type-aliases/MdKitBackendStore.md) with checkpoint-policy
orchestration, producing the transport-ready surface the Fastify and tRPC
helpers mount. The store owns persistence, auth, and metadata; this owns
checkpoint timing and restore ordering.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateMdKitBackendOptions`](../type-aliases/CreateMdKitBackendOptions.md) |

## Returns

[`MdKitTransportStore`](../../fastify/type-aliases/MdKitTransportStore.md)
