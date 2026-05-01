# @mp-lb/mdkit

## 0.1.0

### Minor Changes

- Harden the markdown editor bubble menu for dialog and reset-heavy integrations, and rename package-owned classes and CSS variables to the `mp-lb-mdkit-*` namespace.

  The bubble menu now stays inside the editor DOM boundary, handles toolbar actions before selection collapse, and subscribes to Tiptap editor state for accurate active formatting. Styling docs now list every supported class hook grouped by component.
