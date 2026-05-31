# Type Alias: MdKitDocumentController

```ts
type MdKitDocumentController = {
  conflict: boolean;
  conflictDetails:   | MdKitDocumentConflictDetails
     | null;
  error: string | null;
  isDirty: boolean;
  isFocused: boolean;
  isLoading: boolean;
  revision: number;
  saveNow: () => Promise<boolean>;
  saveStatus: "idle" | "pending" | "saving" | "saved";
  forceSave: () => Promise<boolean>;
  resync: () => Promise<void>;
  setContent: (next: string) => void;
  setFocused: (focused: boolean) => void;
  updatedAt: string | null;
  value: string;
  version: MdKitDocumentVersionToken;
};
```

Defined in: [packages/mdkit/src/document/useMdKitDocument.ts:25](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L25)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="conflict"></a> `conflict` | `boolean` | [packages/mdkit/src/document/useMdKitDocument.ts:26](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L26) |
| <a id="conflictdetails"></a> `conflictDetails` | \| [`MdKitDocumentConflictDetails`](MdKitDocumentConflictDetails.md) \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:27](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L27) |
| <a id="error"></a> `error` | `string` \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:28](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L28) |
| <a id="isdirty"></a> `isDirty` | `boolean` | [packages/mdkit/src/document/useMdKitDocument.ts:29](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L29) |
| <a id="isfocused"></a> `isFocused` | `boolean` | [packages/mdkit/src/document/useMdKitDocument.ts:30](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L30) |
| <a id="isloading"></a> `isLoading` | `boolean` | [packages/mdkit/src/document/useMdKitDocument.ts:31](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L31) |
| <a id="revision"></a> `revision` | `number` | [packages/mdkit/src/document/useMdKitDocument.ts:32](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L32) |
| <a id="savenow"></a> `saveNow` | () => `Promise`\<`boolean`\> | [packages/mdkit/src/document/useMdKitDocument.ts:33](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L33) |
| <a id="savestatus"></a> `saveStatus` | `"idle"` \| `"pending"` \| `"saving"` \| `"saved"` | [packages/mdkit/src/document/useMdKitDocument.ts:34](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L34) |
| <a id="forcesave"></a> `forceSave` | () => `Promise`\<`boolean`\> | [packages/mdkit/src/document/useMdKitDocument.ts:35](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L35) |
| <a id="resync"></a> `resync` | () => `Promise`\<`void`\> | [packages/mdkit/src/document/useMdKitDocument.ts:36](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L36) |
| <a id="setcontent"></a> `setContent` | (`next`: `string`) => `void` | [packages/mdkit/src/document/useMdKitDocument.ts:37](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L37) |
| <a id="setfocused"></a> `setFocused` | (`focused`: `boolean`) => `void` | [packages/mdkit/src/document/useMdKitDocument.ts:38](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L38) |
| <a id="updatedat"></a> `updatedAt` | `string` \| `null` | [packages/mdkit/src/document/useMdKitDocument.ts:39](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L39) |
| <a id="value"></a> `value` | `string` | [packages/mdkit/src/document/useMdKitDocument.ts:40](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L40) |
| <a id="version"></a> `version` | [`MdKitDocumentVersionToken`](MdKitDocumentVersionToken.md) | [packages/mdkit/src/document/useMdKitDocument.ts:41](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/useMdKitDocument.ts#L41) |
