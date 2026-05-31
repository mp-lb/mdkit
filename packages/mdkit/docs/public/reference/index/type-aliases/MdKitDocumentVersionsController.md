# Type Alias: MdKitDocumentVersionsController

```ts
type MdKitDocumentVersionsController = {
  error: string | null;
  hasVersioning: boolean;
  isLoading: boolean;
  openVersion: (versionId: string) => Promise<void>;
  refresh: () => Promise<void>;
  selectedVersion: MdKitDocumentVersionDetail | null;
  selectedVersionId: string | null;
  versions: MdKitDocumentVersionSummary[];
};
```

Defined in: [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:17](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L17)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="error"></a> `error` | `string` \| `null` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:18](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L18) |
| <a id="hasversioning"></a> `hasVersioning` | `boolean` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:19](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L19) |
| <a id="isloading"></a> `isLoading` | `boolean` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:20](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L20) |
| <a id="openversion"></a> `openVersion` | (`versionId`: `string`) => `Promise`\<`void`\> | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:21](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L21) |
| <a id="refresh"></a> `refresh` | () => `Promise`\<`void`\> | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:22](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L22) |
| <a id="selectedversion"></a> `selectedVersion` | [`MdKitDocumentVersionDetail`](MdKitDocumentVersionDetail.md) \| `null` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:23](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L23) |
| <a id="selectedversionid"></a> `selectedVersionId` | `string` \| `null` | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:24](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L24) |
| <a id="versions"></a> `versions` | [`MdKitDocumentVersionSummary`](MdKitDocumentVersionSummary.md)[] | [packages/mdkit/src/versioning/useMdKitDocumentVersions.ts:25](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/versioning/useMdKitDocumentVersions.ts#L25) |
