# Variable: yjs

```ts
const yjs: {
  markdownToMdKitYjs: (markdown: string, options?: MdKitMarkdownYjsOptions) => Uint8Array;
  mdKitYjsToMarkdown: (yjsState: Uint8Array, options?: MdKitMarkdownYjsOptions) => string;
  replaceMdKitYjsMarkdown: (ydoc: Doc, markdown: string, options?: MdKitMarkdownYjsOptions) => Uint8Array;
};
```

Defined in: [packages/mdkit/src/yjs/MdKitMarkdownYjs.ts:107](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/yjs/MdKitMarkdownYjs.ts#L107)

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-markdowntomdkityjs"></a> `markdownToMdKitYjs()` | (`markdown`: `string`, `options?`: [`MdKitMarkdownYjsOptions`](../type-aliases/MdKitMarkdownYjsOptions.md)) => `Uint8Array` | [packages/mdkit/src/yjs/MdKitMarkdownYjs.ts:108](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/yjs/MdKitMarkdownYjs.ts#L108) |
| <a id="property-mdkityjstomarkdown"></a> `mdKitYjsToMarkdown()` | (`yjsState`: `Uint8Array`, `options?`: [`MdKitMarkdownYjsOptions`](../type-aliases/MdKitMarkdownYjsOptions.md)) => `string` | [packages/mdkit/src/yjs/MdKitMarkdownYjs.ts:109](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/yjs/MdKitMarkdownYjs.ts#L109) |
| <a id="property-replacemdkityjsmarkdown"></a> `replaceMdKitYjsMarkdown()` | (`ydoc`: `Doc`, `markdown`: `string`, `options?`: [`MdKitMarkdownYjsOptions`](../type-aliases/MdKitMarkdownYjsOptions.md)) => `Uint8Array` | [packages/mdkit/src/yjs/MdKitMarkdownYjs.ts:110](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/yjs/MdKitMarkdownYjs.ts#L110) |
