# @mp-lb/mdkit

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
