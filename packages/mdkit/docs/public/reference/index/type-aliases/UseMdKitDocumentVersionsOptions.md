# Type Alias: UseMdKitDocumentVersionsOptions

```ts
type UseMdKitDocumentVersionsOptions = {
  adapter: Pick<MdKitDocumentAdapter, "listDocumentVersions" | "readDocumentVersion">;
  documentId: string | null;
  enabled?: boolean;
};
```

Defined in: [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:8](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L8)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="adapter"></a> `adapter` | `Pick`\<[`MdKitDocumentAdapter`](../interfaces/MdKitDocumentAdapter.md), `"listDocumentVersions"` \| `"readDocumentVersion"`\> | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:9](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L9) |
| <a id="documentid"></a> `documentId` | `string` \| `null` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L13) |
| <a id="enabled"></a> `enabled?` | `boolean` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:14](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L14) |
