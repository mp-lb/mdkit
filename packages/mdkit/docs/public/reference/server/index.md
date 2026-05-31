---
title: "server"
---

# server

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [MdKitCreateCheckpointInput](type-aliases/MdKitCreateCheckpointInput.md) | - |
| [MdKitBackendStore](type-aliases/MdKitBackendStore.md) | Application-owned persistence contract consumed by [createMdKitBackend](functions/createMdKitBackend.md). Implement it with your database; mdkit calls `createCheckpoint` when the configured [CheckpointPolicy](../index/variables/CheckpointPolicy.md) triggers — the store never interprets the policy itself. |
| [CreateMdKitBackendOptions](type-aliases/CreateMdKitBackendOptions.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [createMdKitBackend](functions/createMdKitBackend.md) | Wraps an application [MdKitBackendStore](type-aliases/MdKitBackendStore.md) with checkpoint-policy orchestration, producing the transport-ready surface the Fastify and tRPC helpers mount. The store owns persistence, auth, and metadata; this owns checkpoint timing and restore ordering. |
