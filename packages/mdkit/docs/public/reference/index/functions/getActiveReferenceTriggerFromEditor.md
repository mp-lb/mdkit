---
title: "getActiveReferenceTriggerFromEditor"
---

# Function: getActiveReferenceTriggerFromEditor()

```ts
function getActiveReferenceTriggerFromEditor(editor: Editor, triggers?: readonly MdKitReferenceTrigger[]): 
  | MdKitReferenceTriggerState
  | null;
```

Defined in: [packages/mdkit/src/markdown/markdownReferences.tsx:65](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L65)

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `editor` | `Editor` | `undefined` |
| `triggers` | readonly [`MdKitReferenceTrigger`](../type-aliases/MdKitReferenceTrigger.md)[] | `defaultMdKitReferenceTriggers` |

## Returns

  \| [`MdKitReferenceTriggerState`](../type-aliases/MdKitReferenceTriggerState.md)
  \| `null`
