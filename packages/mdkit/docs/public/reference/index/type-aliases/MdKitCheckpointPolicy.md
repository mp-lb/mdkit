# Type Alias: MdKitCheckpointPolicy

```ts
type MdKitCheckpointPolicy = {
  shouldCheckpoint: boolean | Promise<boolean>;
};
```

Defined in: [packages/mdkit/src/core/checkpointPolicy.ts:18](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L18)

## Methods

### shouldCheckpoint()

```ts
shouldCheckpoint(input: MdKitCheckpointPolicyInput): boolean | Promise<boolean>;
```

Defined in: [packages/mdkit/src/core/checkpointPolicy.ts:19](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | [`MdKitCheckpointPolicyInput`](MdKitCheckpointPolicyInput.md) |

#### Returns

`boolean` \| `Promise`\<`boolean`\>
