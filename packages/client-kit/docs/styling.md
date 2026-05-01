# Styling

`MdKitEditor` can render without package CSS, but most applications should
import the stylesheet once. It gives the editor a reset-resistant markdown
baseline and exposes CSS variables for theme changes.

```ts
import "@mp-lb/mdkit/styles.css";
```

Without this stylesheet, the editor still works, but headings, lists,
blockquotes, code blocks, spacing, and focus areas are left to your app's CSS.

## CSS Resets

Many app frameworks include CSS resets. Tailwind Preflight, for example, removes
default margins and list styling. The package stylesheet restores markdown
editor defaults under `.mdkit-markdown-editor`, including:

- heading sizes and spacing
- paragraph spacing
- unordered and ordered list markers
- compact list item spacing
- inline code and code block styling
- blockquote styling
- link color
- full-width editor layout

Import the stylesheet after global reset styles when possible:

```ts
import "./app.css";
import "@mp-lb/mdkit/styles.css";
```

If your bundler or framework controls CSS order differently, make sure the
mdkit stylesheet is not overridden by a later broad reset such as
`ul { list-style: none; }`.

## Default Styling

The simplest setup is:

```tsx
import { MdKitEditor } from "@mp-lb/mdkit";
import "@mp-lb/mdkit/styles.css";

export function Editor({ markdown, setMarkdown }) {
  return <MdKitEditor value={markdown} onChange={setMarkdown} />;
}
```

The editor fills the available width by default. Use `fillHeight` only when you
want the editor to fill its parent's height, own its scroll area, and make the
empty area below the last line clickable.

```tsx
<MdKitEditor fillHeight value={markdown} onChange={setMarkdown} />
```

## Custom Styling

The package stylesheet is intentionally controlled through CSS variables. You
can override them with a class:

```css
.my-markdown-editor {
  --hsk-background: #ffffff;
  --hsk-foreground: #172033;
  --hsk-muted: #eef1f4;
  --hsk-muted-foreground: #5b6472;
  --hsk-border: #d8dee8;
  --hsk-link: #4f46e5;
  --hsk-font-family: Inter, system-ui, sans-serif;
  --hsk-font-size: 16px;
  --hsk-line-height: 1.7;
  --hsk-surface-padding: 1rem;
  --hsk-block-gap: 0.75rem;
  --hsk-list-item-gap: 0.125rem;
  --hsk-code-background: #eef1f4;
  --hsk-code-radius: 0.35rem;
  --hsk-code-block-radius: 0.75rem;
}
```

```tsx
<MdKitEditor
  className="my-markdown-editor"
  value={markdown}
  onChange={setMarkdown}
/>
```

You can also pass variables through `style` when the values are generated at
runtime:

```tsx
<MdKitEditor
  style={{
    "--hsk-font-family": "ui-serif, Georgia, serif",
    "--hsk-font-size": "18px",
    "--hsk-line-height": "1.8",
  }}
  value={markdown}
  onChange={setMarkdown}
/>
```

See [`MdKitEditorProps`](./api.md#mdkiteditorprops) for the full component
props.

## Component Styling

Editor styling and workflow component styling are separate.

`MdKitEditor` is styled through CSS variables on `.mdkit-markdown-editor`.
Workflow panels such as `MdKitDocumentToolbar`, `MdKitConflictPanel`, and
`VersionHistoryPanel` are intentionally design-system agnostic. They render raw
semantic markup with stable `mdkit-*` class names. Without this stylesheet they
are plain HTML; with this stylesheet they get generic fallback styling: square
corners, one-pixel borders, clear spacing, and basic buttons.

Style them in your app when you want them to match your product:

```css
.mdkit-document-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  padding: 0.5rem 0;
}

.mdkit-document-toolbar-status,
.mdkit-document-toolbar-actions,
.mdkit-document-toolbar-conflict {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mdkit-document-toolbar[data-conflict="true"] {
  color: #991b1b;
}
```

The toolbar class hooks are:

- `.mdkit-document-toolbar`
- `.mdkit-document-toolbar-status`
- `.mdkit-document-toolbar-actions`
- `.mdkit-document-toolbar-error`
- `.mdkit-document-toolbar-conflict`

It also exposes `data-conflict`, `data-dirty`, and `data-save-status`
attributes for state-based styling.

Version history and conflict panels use the same fallback panel CSS and expose:

- `.mdkit-version-history-panel`
- `.mdkit-version-history-header`
- `.mdkit-version-history-list`
- `.mdkit-version-history-item`
- `.mdkit-version-history-preview`
- `.mdkit-conflict-panel`
- `.mdkit-conflict-panel-content`
- `.mdkit-conflict-panel-action-row`
- `.mdkit-panel-primary-action`
- `.mdkit-panel-secondary-action`

## Theme Helpers

For app code, CSS variables are usually the simplest integration. The package
also exports theme helpers when you want to store or generate a theme object:

```tsx
import {
  MdKitEditor,
  createMdKitEditorThemeStyle,
  darkMdKitEditorTheme,
} from "@mp-lb/mdkit";

const style = createMdKitEditorThemeStyle({
  ...darkMdKitEditorTheme,
  fontFamily: "Inter, system-ui, sans-serif",
  lineHeight: "1.75",
});

<MdKitEditor style={style} value={markdown} onChange={setMarkdown} />;
```

Related exports are listed in the [API reference](./api.md#styling).

## Dark Mode

For class-based dark mode, scope variable overrides to your dark selector:

```css
.my-markdown-editor {
  --hsk-background: #ffffff;
  --hsk-foreground: #172033;
  --hsk-muted: #eef1f4;
  --hsk-muted-foreground: #5b6472;
  --hsk-border: #d8dee8;
  --hsk-link: #4f46e5;
  --hsk-code-background: #eef1f4;
}

.dark .my-markdown-editor {
  --hsk-background: #0b1220;
  --hsk-foreground: #e5edf7;
  --hsk-muted: #172033;
  --hsk-muted-foreground: #94a3b8;
  --hsk-border: #314158;
  --hsk-link: #38bdf8;
  --hsk-code-background: #111827;
}
```

Then apply the class normally:

```tsx
<MdKitEditor
  className="my-markdown-editor"
  value={markdown}
  onChange={setMarkdown}
/>
```

You can also switch theme objects in React:

```tsx
const style = createMdKitEditorThemeStyle(
  isDark ? darkMdKitEditorTheme : defaultMdKitEditorTheme,
);

<MdKitEditor style={style} value={markdown} onChange={setMarkdown} />;
```

## What Not To Customize First

Prefer changing CSS variables before overriding internal selectors like
`.hsk-tiptap p` or `.hsk-editor-surface`. Direct selector overrides are still an
escape hatch, but they couple your app to mdkit's internal DOM.

Use `MdKitThemeEditor` for theme builders, documentation, and debug tooling. It
is not required for normal editor integration.
