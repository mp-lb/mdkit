---
title: "observeMdKitYjsFrontMatter"
---

# Function: observeMdKitYjsFrontMatter()

```ts
function observeMdKitYjsFrontMatter(
   ydoc: Doc, 
   listener: () => void, 
   fragmentName?: string): () => void;
```

Defined in: packages/mdkit/src/yjs/observeMdKitYjsFrontMatter.ts:5

Subscribe to local and remote metadata changes. Returns an unsubscribe function.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `ydoc` | `Doc` | `undefined` |
| `listener` | () => `void` | `undefined` |
| `fragmentName` | `string` | `"default"` |

## Returns

() => `void`
