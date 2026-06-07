---
title: "MdKitReferencesOptions"
---

# Type Alias: MdKitReferencesOptions

```ts
type MdKitReferencesOptions = {
  enabled?: boolean;
  onSearchTargets?: (query: string, trigger: MdKitReferenceTrigger) => 
     | MdKitReferenceTarget[]
    | Promise<MdKitReferenceTarget[]>;
  renderSuggestions?: (props: MdKitReferenceSuggestionsRenderProps) => ReactNode;
  targets?: MdKitReferenceTarget[];
  triggers?: MdKitReferenceTrigger[];
};
```

Defined in: [packages/mdkit/src/markdown/markdownReferences.tsx:35](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L35)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="enabled"></a> `enabled?` | `boolean` | [packages/mdkit/src/markdown/markdownReferences.tsx:36](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L36) |
| <a id="onsearchtargets"></a> `onSearchTargets?` | (`query`: `string`, `trigger`: [`MdKitReferenceTrigger`](MdKitReferenceTrigger.md)) => \| [`MdKitReferenceTarget`](MdKitReferenceTarget.md)[] \| `Promise`\<[`MdKitReferenceTarget`](MdKitReferenceTarget.md)[]\> | [packages/mdkit/src/markdown/markdownReferences.tsx:37](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L37) |
| <a id="rendersuggestions"></a> `renderSuggestions?` | (`props`: [`MdKitReferenceSuggestionsRenderProps`](MdKitReferenceSuggestionsRenderProps.md)) => `ReactNode` | [packages/mdkit/src/markdown/markdownReferences.tsx:41](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L41) |
| <a id="targets"></a> `targets?` | [`MdKitReferenceTarget`](MdKitReferenceTarget.md)[] | [packages/mdkit/src/markdown/markdownReferences.tsx:44](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L44) |
| <a id="triggers"></a> `triggers?` | [`MdKitReferenceTrigger`](MdKitReferenceTrigger.md)[] | [packages/mdkit/src/markdown/markdownReferences.tsx:45](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/markdown/markdownReferences.tsx#L45) |
