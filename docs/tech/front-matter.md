# YAML Front Matter

YAML front matter is a metadata block at the start of a markdown document. It is
not part of Markdown itself, but it is common in markdown-based publishing
systems.

MDKit supports YAML front matter as an opt-in feature. By default the editor and
viewer treat it as normal markdown content.

## Shape

MDKit recognizes front matter only when it appears at the very start of the
document:

```markdown
---
key: ["value"]
---

# Document body
```

The supported shape is:

```text
---
<valid yaml>
---
<maybe trailing whitespace>
<body>
```

Rules:

- The opening delimiter must be the first line of the document and exactly
  `---`.
- The closing delimiter must be a later line and exactly `---`.
- The content between delimiters must parse as valid YAML.
- Whitespace-only lines after the closing delimiter are part of the front matter
  prefix and are removed with it.
- A delimiter block that is not at the start of the document is normal markdown.
- A delimiter block with invalid YAML is not treated as front matter.
- LF and CRLF line endings are supported.

## Utilities

The public utilities are exported from `@mp-lb/mdkit`:

- `extractYamlFrontMatter(markdown)` returns `{ body, frontMatter, errors }`.
- `hasYamlFrontMatter(markdown)` returns `true` only for valid front matter.
- `removeYamlFrontMatter(markdown)` returns the markdown body without the front
  matter prefix.
- `parseYamlFrontMatter(yaml)` parses YAML content and throws on invalid YAML.
- `prependYamlFrontMatter(frontMatter, body)` reattaches an extracted front
  matter prefix to a serialized body.

`frontMatter` contains:

- `raw`: the complete front matter prefix, including delimiters and trailing
  whitespace.
- `yaml`: the YAML source between delimiters.
- `data`: the parsed YAML value.
- `trailingWhitespace`: whitespace after the closing delimiter before the body.

## Editor And Viewer

`MdKitEditor` and `MdKitView` both expose `ignoreYamlFrontMatter`.

The option defaults to `false`.

When `ignoreYamlFrontMatter` is `false`, front matter is passed through the
normal markdown pipeline and may render as horizontal rules/headings depending on
the markdown parser.

When `ignoreYamlFrontMatter` is `true`:

- `MdKitView` renders only the body.
- `MdKitEditor` hydrates only the body into ProseMirror.
- `MdKitEditor` preserves the extracted front matter prefix when it serializes
  edited body markdown back through `onChange`.

This keeps the markdown string as the durable source of truth while preventing
front matter metadata from becoming editable body content.

## Yjs Conversion

The Markdown/Yjs helpers also support `ignoreYamlFrontMatter`.

When enabled, `markdownToMdKitYjs` stores the extracted raw front matter prefix
as MDKit metadata and converts only the body into ProseMirror/Yjs state.
`mdKitYjsToMarkdown` reattaches that prefix to the serialized body.

The option defaults to `false` to preserve existing markdown conversion
behavior.
