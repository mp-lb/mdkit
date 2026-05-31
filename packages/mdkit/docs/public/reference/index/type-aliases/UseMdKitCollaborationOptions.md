---
title: "UseMdKitCollaborationOptions"
---

# Type Alias: UseMdKitCollaborationOptions

```ts
type UseMdKitCollaborationOptions = {
  collaborator: MdKitCollaborationParticipant;
  documentId: string | null;
  enabled?: boolean;
  endpoint: string | null;
  getToken?: () => Promise<string | null>;
  resolveRoomName?: (documentId: string) => string;
};
```

Defined in: [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:11](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L11)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="collaborator"></a> `collaborator` | [`MdKitCollaborationParticipant`](MdKitCollaborationParticipant.md) | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:12](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L12) |
| <a id="documentid"></a> `documentId` | `string` \| `null` | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L13) |
| <a id="enabled"></a> `enabled?` | `boolean` | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:14](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L14) |
| <a id="endpoint"></a> `endpoint` | `string` \| `null` | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:15](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L15) |
| <a id="gettoken"></a> `getToken?` | () => `Promise`\<`string` \| `null`\> | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:16](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L16) |
| <a id="resolveroomname"></a> `resolveRoomName?` | (`documentId`: `string`) => `string` | [packages/mdkit/src/collaboration/useMdKitCollaboration.ts:17](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/collaboration/useMdKitCollaboration.ts#L17) |
