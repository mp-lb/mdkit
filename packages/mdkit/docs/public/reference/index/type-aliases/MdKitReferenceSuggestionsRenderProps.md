---
title: "MdKitReferenceSuggestionsRenderProps"
---

# Type Alias: MdKitReferenceSuggestionsRenderProps

```ts
type MdKitReferenceSuggestionsRenderProps = {
  activeIndex: number;
  isLoading: boolean;
  placement: MdKitReferenceSuggestionPlacement;
  query: string;
  selectedTarget: MdKitReferenceTarget | null;
  style: CSSProperties;
  targets: MdKitReferenceTarget[];
  trigger: MdKitReferenceTrigger;
  onSelect: (target: MdKitReferenceTarget) => void;
};
```

Defined in: [packages/mdkit/src/markdown/markdownReferences.tsx:23](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L23)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="activeindex"></a> `activeIndex` | `number` | [packages/mdkit/src/markdown/markdownReferences.tsx:24](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L24) |
| <a id="isloading"></a> `isLoading` | `boolean` | [packages/mdkit/src/markdown/markdownReferences.tsx:25](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L25) |
| <a id="placement"></a> `placement` | `MdKitReferenceSuggestionPlacement` | [packages/mdkit/src/markdown/markdownReferences.tsx:26](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L26) |
| <a id="query"></a> `query` | `string` | [packages/mdkit/src/markdown/markdownReferences.tsx:27](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L27) |
| <a id="selectedtarget"></a> `selectedTarget` | [`MdKitReferenceTarget`](MdKitReferenceTarget.md) \| `null` | [packages/mdkit/src/markdown/markdownReferences.tsx:28](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L28) |
| <a id="style"></a> `style` | `CSSProperties` | [packages/mdkit/src/markdown/markdownReferences.tsx:29](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L29) |
| <a id="targets"></a> `targets` | [`MdKitReferenceTarget`](MdKitReferenceTarget.md)[] | [packages/mdkit/src/markdown/markdownReferences.tsx:30](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L30) |
| <a id="trigger"></a> `trigger` | [`MdKitReferenceTrigger`](MdKitReferenceTrigger.md) | [packages/mdkit/src/markdown/markdownReferences.tsx:31](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L31) |
| <a id="onselect"></a> `onSelect` | (`target`: [`MdKitReferenceTarget`](MdKitReferenceTarget.md)) => `void` | [packages/mdkit/src/markdown/markdownReferences.tsx:32](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L32) |
