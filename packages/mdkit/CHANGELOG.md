# @mp-lb/mdkit

## 0.3.10

### Patch Changes

- 695e416: Trim first and last markdown block margins inside document margins so container spacing defines the document edges.

## 0.3.9

### Patch Changes

- 31ab5ff: Apply fill-height document bottom spacing to the final markdown block so it follows document flow.

## 0.3.8

### Patch Changes

- d9d1333: Render document bottom spacing with a concrete spacer element instead of a ProseMirror pseudo-element.

## 0.3.7

### Patch Changes

- 82382c5: Render bottom document spacing as a trailing content spacer.

## 0.3.6

### Patch Changes

- 8da0b79: Let fill-height markdown document content grow so bottom padding remains scrollable.

## 0.3.5

### Patch Changes

- c86ae57: Apply fill-height document margins to the editable markdown content element.

## 0.3.4

### Patch Changes

- c04bb5e: Add bottom document spacing for fill-height markdown editors with document margins.

## 0.3.3

### Patch Changes

- 6988b75: Add optional document margins for markdown editors and move Doctrine's markdown heading and document layout defaults into mdkit.

## 0.3.2

### Patch Changes

- 04dad84: Avoid forcing a ProseMirror blur during pointerdown on external native focus targets.

## 0.3.1

### Patch Changes

- 588790f: Fix markdown heading level hydration

## 0.3.0

### Minor Changes

- 541f3de: Add built-in markdown search and YAML front matter helpers

## 0.2.5

### Patch Changes

- 915af53: Prevent late controlled value updates from being applied into collaborative Yjs editor documents.

## 0.2.4

### Patch Changes

- 89b10f9: Streamline the MDKit release process so pushing a changeset to main publishes directly without a release PR.

## 0.2.3

### Patch Changes

- a02af5d: Hide the markdown formatting bubble menu when clicking non-focusable page chrome outside the editor.

## 0.2.2

### Patch Changes

- de6c879: Hide the markdown formatting bubble menu when the editor loses focus.

## 0.2.1

### Patch Changes

- eb126fb: Keep read-only code blocks from shrinking into nested scroll areas in fill-height views.

## 0.2.0

### Minor Changes

- 279fac7: Add `MdKitView`, a read-only markdown rendering surface that shares the editor styling and fill-height sizing contract without mounting Tiptap.

## 0.1.0

### Minor Changes

- Harden the markdown editor bubble menu for dialog and reset-heavy integrations, and rename package-owned classes and CSS variables to the `mp-lb-mdkit-*` namespace.

  The bubble menu now stays inside the editor DOM boundary, handles toolbar actions before selection collapse, and subscribes to Tiptap editor state for accurate active formatting. Styling docs now list every supported class hook grouped by component.
