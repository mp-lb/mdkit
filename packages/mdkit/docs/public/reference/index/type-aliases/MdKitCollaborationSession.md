---
title: "MdKitCollaborationSession"
---

# Type Alias: MdKitCollaborationSession

```ts
type MdKitCollaborationSession = {
  collaborator: MdKitCollaborationParticipant;
  document: Y.Doc;
  isCollaborating: boolean;
  otherParticipants: MdKitCollaborationPresence[];
  participants: MdKitCollaborationPresence[];
  provider: HocuspocusProvider | null;
  roomName: string;
  status: MdKitCollaborationStatus;
};
```

Defined in: [packages/mdkit/src/document/documentTypes.ts:80](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L80)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="collaborator"></a> `collaborator` | [`MdKitCollaborationParticipant`](MdKitCollaborationParticipant.md) | [packages/mdkit/src/document/documentTypes.ts:81](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L81) |
| <a id="document"></a> `document` | `Y.Doc` | [packages/mdkit/src/document/documentTypes.ts:82](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L82) |
| <a id="iscollaborating"></a> `isCollaborating` | `boolean` | [packages/mdkit/src/document/documentTypes.ts:83](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L83) |
| <a id="otherparticipants"></a> `otherParticipants` | [`MdKitCollaborationPresence`](MdKitCollaborationPresence.md)[] | [packages/mdkit/src/document/documentTypes.ts:84](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L84) |
| <a id="participants"></a> `participants` | [`MdKitCollaborationPresence`](MdKitCollaborationPresence.md)[] | [packages/mdkit/src/document/documentTypes.ts:85](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L85) |
| <a id="provider"></a> `provider` | `HocuspocusProvider` \| `null` | [packages/mdkit/src/document/documentTypes.ts:86](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L86) |
| <a id="roomname"></a> `roomName` | `string` | [packages/mdkit/src/document/documentTypes.ts:87](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L87) |
| <a id="status"></a> `status` | [`MdKitCollaborationStatus`](MdKitCollaborationStatus.md) | [packages/mdkit/src/document/documentTypes.ts:88](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/document/documentTypes.ts#L88) |
