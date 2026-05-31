# Type Alias: MdKitCheckpointPolicyInput

```ts
type MdKitCheckpointPolicyInput = {
  currentContent: string;
  documentId: string;
  editDistance: number;
  previousCheckpoint: MdKitDocumentVersionDetail | null;
  previousCheckpointContent: string | null;
  timeSinceLastCheckpointMs: number | null;
  writeInput: MdKitDocumentWriteInput;
  writeResult: MdKitDocumentWriteResult;
};
```

Defined in: [packages/mdkit/src/core/checkpointPolicy.ts:7](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L7)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="currentcontent"></a> `currentContent` | `string` | [packages/mdkit/src/core/checkpointPolicy.ts:8](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L8) |
| <a id="documentid"></a> `documentId` | `string` | [packages/mdkit/src/core/checkpointPolicy.ts:9](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L9) |
| <a id="editdistance"></a> `editDistance` | `number` | [packages/mdkit/src/core/checkpointPolicy.ts:10](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L10) |
| <a id="previouscheckpoint"></a> `previousCheckpoint` | [`MdKitDocumentVersionDetail`](MdKitDocumentVersionDetail.md) \| `null` | [packages/mdkit/src/core/checkpointPolicy.ts:11](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L11) |
| <a id="previouscheckpointcontent"></a> `previousCheckpointContent` | `string` \| `null` | [packages/mdkit/src/core/checkpointPolicy.ts:12](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L12) |
| <a id="timesincelastcheckpointms"></a> `timeSinceLastCheckpointMs` | `number` \| `null` | [packages/mdkit/src/core/checkpointPolicy.ts:13](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L13) |
| <a id="writeinput"></a> `writeInput` | [`MdKitDocumentWriteInput`](MdKitDocumentWriteInput.md) | [packages/mdkit/src/core/checkpointPolicy.ts:14](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L14) |
| <a id="writeresult"></a> `writeResult` | [`MdKitDocumentWriteResult`](MdKitDocumentWriteResult.md) | [packages/mdkit/src/core/checkpointPolicy.ts:15](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L15) |
