---
title: "MdKitEditor"
---

# Function: MdKitEditor()

```ts
function MdKitEditor(props: MdKitEditorProps): Element;
```

Defined in: [packages/mdkit/src/markdown/MdKitEditor.tsx:45](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/MdKitEditor.tsx#L45)

Markdown-first rich text editor. Behaves like a controlled textarea in local
mode and switches to a Yjs-backed engine when given a collaboration session.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | [`MdKitEditorProps`](../type-aliases/MdKitEditorProps.md) |

## Returns

`Element`

## Remarks

In collaborative mode the Yjs document is the content source; external
`value` changes are not applied into the shared document.
