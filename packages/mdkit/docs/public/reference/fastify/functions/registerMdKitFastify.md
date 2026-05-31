---
title: "registerMdKitFastify"
---

# Function: registerMdKitFastify()

```ts
function registerMdKitFastify(app: FastifyInstance, __namedParameters: RegisterMdKitFastifyOptions): Promise<void>;
```

Defined in: [packages/mdkit/src/transport/fastify.ts:28](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/transport/fastify.ts#L28)

Registers the mdkit REST endpoints on a Fastify app under `prefix`, backed by
a transport store (typically from `createMdKitBackend`).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `app` | `FastifyInstance` |
| `__namedParameters` | [`RegisterMdKitFastifyOptions`](../type-aliases/RegisterMdKitFastifyOptions.md) |

## Returns

`Promise`\<`void`\>
