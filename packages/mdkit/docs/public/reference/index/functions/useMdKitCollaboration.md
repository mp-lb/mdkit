---
title: "useMdKitCollaboration"
---

# Function: useMdKitCollaboration()

```ts
function useMdKitCollaboration(options: UseMdKitCollaborationOptions): 
  | MdKitCollaborationSession
  | null;
```

Defined in: [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:195](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L195)

Creates a Hocuspocus/Yjs collaboration session for [MdKitEditor](MdKitEditor.md),
managing the provider connection, local participant, and presence.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`UseMdKitCollaborationOptions`](../type-aliases/UseMdKitCollaborationOptions.md) |

## Returns

  \| [`MdKitCollaborationSession`](../type-aliases/MdKitCollaborationSession.md)
  \| `null`
