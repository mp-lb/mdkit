---
title: "index"
---

# index

## Interfaces

| Interface | Description |
| ------ | ------ |
| [MdKitDocumentAdapter](interfaces/MdKitDocumentAdapter.md) | Storage contract the document hooks talk to. Implement it over tRPC, REST, or anything else; only `readDocument`/`writeDocument` are required, the checkpoint methods are optional and enable version-history UI. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [UseMdKitCollaborationOptions](type-aliases/UseMdKitCollaborationOptions.md) | - |
| [MdKitCheckpointPolicyInput](type-aliases/MdKitCheckpointPolicyInput.md) | - |
| [MdKitCheckpointPolicy](type-aliases/MdKitCheckpointPolicy.md) | - |
| [MdKitSmartCheckpointPolicyOptions](type-aliases/MdKitSmartCheckpointPolicyOptions.md) | - |
| [MdKitDocumentRecord](type-aliases/MdKitDocumentRecord.md) | - |
| [CreateMdKitDocumentRecordInput](type-aliases/CreateMdKitDocumentRecordInput.md) | - |
| [WriteMdKitDocumentRecordInput](type-aliases/WriteMdKitDocumentRecordInput.md) | - |
| [WriteMdKitDocumentRecordResult](type-aliases/WriteMdKitDocumentRecordResult.md) | - |
| [RestoreMdKitDocumentVersionInput](type-aliases/RestoreMdKitDocumentVersionInput.md) | - |
| [RestoreMdKitDocumentVersionResult](type-aliases/RestoreMdKitDocumentVersionResult.md) | - |
| [MdKitConflictPanelProps](type-aliases/MdKitConflictPanelProps.md) | - |
| [MdKitDocumentToolbarProps](type-aliases/MdKitDocumentToolbarProps.md) | - |
| [MdKitDocumentVersionToken](type-aliases/MdKitDocumentVersionToken.md) | - |
| [MdKitDocumentSnapshot](type-aliases/MdKitDocumentSnapshot.md) | - |
| [MdKitDocumentWriteInput](type-aliases/MdKitDocumentWriteInput.md) | - |
| [MdKitDocumentWriteResult](type-aliases/MdKitDocumentWriteResult.md) | - |
| [MdKitDocumentVersionSummary](type-aliases/MdKitDocumentVersionSummary.md) | - |
| [MdKitDocumentVersionDetail](type-aliases/MdKitDocumentVersionDetail.md) | - |
| [MdKitCollaborationStatus](type-aliases/MdKitCollaborationStatus.md) | - |
| [MdKitCollaborationParticipant](type-aliases/MdKitCollaborationParticipant.md) | - |
| [MdKitCollaborationPresence](type-aliases/MdKitCollaborationPresence.md) | - |
| [MdKitCollaborationSession](type-aliases/MdKitCollaborationSession.md) | - |
| [UseMdKitDocumentOptions](type-aliases/UseMdKitDocumentOptions.md) | - |
| [MdKitDocumentConflictDetails](type-aliases/MdKitDocumentConflictDetails.md) | - |
| [MdKitDocumentController](type-aliases/MdKitDocumentController.md) | - |
| [MdKitEditorProps](type-aliases/MdKitEditorProps.md) | - |
| [MdKitViewProps](type-aliases/MdKitViewProps.md) | - |
| [MdKitCodeThemeName](type-aliases/MdKitCodeThemeName.md) | - |
| [MdKitCodeTheme](type-aliases/MdKitCodeTheme.md) | - |
| [MdKitSyntaxHighlightingOptions](type-aliases/MdKitSyntaxHighlightingOptions.md) | - |
| [MdKitEditorDebugEvent](type-aliases/MdKitEditorDebugEvent.md) | - |
| [MdKitReferenceTarget](type-aliases/MdKitReferenceTarget.md) | - |
| [MdKitReferenceTrigger](type-aliases/MdKitReferenceTrigger.md) | - |
| [MdKitReferenceTriggerState](type-aliases/MdKitReferenceTriggerState.md) | - |
| [MdKitReferenceSuggestionsRenderProps](type-aliases/MdKitReferenceSuggestionsRenderProps.md) | - |
| [MdKitReferencesOptions](type-aliases/MdKitReferencesOptions.md) | - |
| [MdKitYamlFrontMatter](type-aliases/MdKitYamlFrontMatter.md) | - |
| [MdKitYamlFrontMatterExtraction](type-aliases/MdKitYamlFrontMatterExtraction.md) | - |
| [MdKitThemeEditorProps](type-aliases/MdKitThemeEditorProps.md) | - |
| [MdKitEditorTheme](type-aliases/MdKitEditorTheme.md) | - |
| [MdKitEditorThemeStyle](type-aliases/MdKitEditorThemeStyle.md) | - |
| [CreateMdKitRestAdapterOptions](type-aliases/CreateMdKitRestAdapterOptions.md) | - |
| [VersionHistoryPanelProps](type-aliases/VersionHistoryPanelProps.md) | - |
| [UseMdKitDocumentVersionsOptions](type-aliases/UseMdKitDocumentVersionsOptions.md) | - |
| [MdKitDocumentVersionsController](type-aliases/MdKitDocumentVersionsController.md) | - |
| [MdKitMarkdownYjsOptions](type-aliases/MdKitMarkdownYjsOptions.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [CheckpointPolicy](variables/CheckpointPolicy.md) | Factories for the policy that decides when a saved document becomes a checkpoint. Pass the result to `createMdKitBackend`, not to your store. |
| [mdKitCodeThemeNames](variables/mdKitCodeThemeNames.md) | - |
| [defaultMdKitEditorTheme](variables/defaultMdKitEditorTheme.md) | - |
| [darkMdKitEditorTheme](variables/darkMdKitEditorTheme.md) | - |
| [yjs](variables/yjs.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [useMdKitCollaboration](functions/useMdKitCollaboration.md) | Creates a Hocuspocus/Yjs collaboration session for [MdKitEditor](functions/MdKitEditor.md), managing the provider connection, local participant, and presence. |
| [measureMdKitEditDistance](functions/measureMdKitEditDistance.md) | - |
| [normalizeMdKitVersionToken](functions/normalizeMdKitVersionToken.md) | - |
| [detectMdKitDocumentConflict](functions/detectMdKitDocumentConflict.md) | - |
| [createMdKitDocumentRecord](functions/createMdKitDocumentRecord.md) | - |
| [writeMdKitDocumentRecord](functions/writeMdKitDocumentRecord.md) | - |
| [restoreMdKitDocumentVersion](functions/restoreMdKitDocumentVersion.md) | - |
| [MdKitConflictPanel](functions/MdKitConflictPanel.md) | Base panel for resolving a save conflict. Previews remote and local content and keeps one side. Renders `null` when the document has no conflict. |
| [MdKitDocumentToolbar](functions/MdKitDocumentToolbar.md) | Unstyled workflow controls for a connected document: save/collaboration status plus entry points for version history and conflict resolution. Starter UI — drop it for your own controls when it doesn't fit. |
| [useMdKitDocument](functions/useMdKitDocument.md) | Connects an editor to a storage adapter: loads the document, debounces autosave, tracks dirty/save status, and surfaces conflicts for resolution. |
| [MdKitEditor](functions/MdKitEditor.md) | Markdown-first rich text editor. Behaves like a controlled textarea in local mode and switches to a Yjs-backed engine when given a collaboration session. |
| [MdKitView](functions/MdKitView.md) | Read-only markdown surface that mirrors [MdKitEditor](functions/MdKitEditor.md)'s styling and sizing contract without mounting the editor runtime. Use it for previews and restored checkpoints. |
| [formatMarkdownReferenceLink](functions/formatMarkdownReferenceLink.md) | - |
| [getActiveReferenceTriggerFromEditor](functions/getActiveReferenceTriggerFromEditor.md) | - |
| [filterMdKitReferenceTargets](functions/filterMdKitReferenceTargets.md) | - |
| [parseYamlFrontMatter](functions/parseYamlFrontMatter.md) | - |
| [extractYamlFrontMatter](functions/extractYamlFrontMatter.md) | - |
| [hasYamlFrontMatter](functions/hasYamlFrontMatter.md) | - |
| [removeYamlFrontMatter](functions/removeYamlFrontMatter.md) | - |
| [prependYamlFrontMatter](functions/prependYamlFrontMatter.md) | - |
| [MdKitThemeEditor](functions/MdKitThemeEditor.md) | Optional controls for editing an [MdKitEditorTheme](type-aliases/MdKitEditorTheme.md). Intended for theme builders, docs, and debug tools rather than production editing surfaces. |
| [createMdKitEditorThemeStyle](functions/createMdKitEditorThemeStyle.md) | - |
| [createMdKitRestAdapter](functions/createMdKitRestAdapter.md) | Builds an [MdKitDocumentAdapter](interfaces/MdKitDocumentAdapter.md) that talks to the mdkit REST endpoint shape. Restore is not part of the adapter contract, so REST restore needs a separate call from application code. |
| [VersionHistoryPanel](functions/VersionHistoryPanel.md) | Renders checkpoint history from [useMdKitDocumentVersions](functions/useMdKitDocumentVersions.md) and invokes the host's restore handler for a chosen checkpoint. |
| [useMdKitDocumentVersions](functions/useMdKitDocumentVersions.md) | Lists a document's checkpoints and lazily reads checkpoint detail, tracking loading state for checkpoint-history UI. |
