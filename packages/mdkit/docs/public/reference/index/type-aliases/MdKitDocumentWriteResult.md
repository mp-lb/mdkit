# Type Alias: MdKitDocumentWriteResult

```ts
type MdKitDocumentWriteResult = 
  | {
  version: MdKitDocumentVersionToken;
  updatedAt?: string | null;
}
  | {
  conflict: true;
  version?: MdKitDocumentVersionToken;
  updatedAt?: string | null;
};
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:19](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L19)
