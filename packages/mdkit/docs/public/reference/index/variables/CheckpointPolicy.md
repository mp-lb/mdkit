# Variable: CheckpointPolicy

```ts
const CheckpointPolicy: {
  always: () => MdKitCheckpointPolicy;
  function: (shouldCheckpoint: (input: MdKitCheckpointPolicyInput) => boolean | Promise<boolean>) => MdKitCheckpointPolicy;
  never: () => MdKitCheckpointPolicy;
  smart: (options: MdKitSmartCheckpointPolicyOptions) => MdKitCheckpointPolicy;
};
```

Defined in: [packages/mdkit/src/core/checkpointPolicy.ts:76](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L76)

Factories for the policy that decides when a saved document becomes a
checkpoint. Pass the result to `createMdKitBackend`, not to your store.

## Type Declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="property-always"></a> `always()` | () => [`MdKitCheckpointPolicy`](../type-aliases/MdKitCheckpointPolicy.md) | [packages/mdkit/src/core/checkpointPolicy.ts:77](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L77) |
| <a id="property-function"></a> `function()` | (`shouldCheckpoint`: (`input`: [`MdKitCheckpointPolicyInput`](../type-aliases/MdKitCheckpointPolicyInput.md)) => `boolean` \| `Promise`\<`boolean`\>) => [`MdKitCheckpointPolicy`](../type-aliases/MdKitCheckpointPolicy.md) | [packages/mdkit/src/core/checkpointPolicy.ts:80](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L80) |
| <a id="property-never"></a> `never()` | () => [`MdKitCheckpointPolicy`](../type-aliases/MdKitCheckpointPolicy.md) | [packages/mdkit/src/core/checkpointPolicy.ts:85](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L85) |
| <a id="property-smart"></a> `smart()` | (`options`: [`MdKitSmartCheckpointPolicyOptions`](../type-aliases/MdKitSmartCheckpointPolicyOptions.md)) => [`MdKitCheckpointPolicy`](../type-aliases/MdKitCheckpointPolicy.md) | [packages/mdkit/src/core/checkpointPolicy.ts:88](https://github.com/mp-lb/mdkit/blob/main/packages/mdkit/src/core/checkpointPolicy.ts#L88) |

## Remarks

`smart()` applies the default autosave-friendly heuristic; `function()`
receives mdkit's computed edit distance alongside the raw content so you can
build a custom rule.
