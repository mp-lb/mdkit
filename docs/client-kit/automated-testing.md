# Automated Testing

Tests should focus on contracts that can be checked deterministically.

## Current Coverage

`MdKitEditor.test.tsx` verifies:

- initial hydration from markdown
- external `value` replacement
- cold remount restore from serialized markdown

Run it with:

```bash
pnpm --filter=@mp-lb/mdkit test
```

## Required Coverage Areas

### Basic Editor

- hydrates from markdown
- emits markdown on edit
- accepts external `value` changes
- remounts from serialized markdown
- does not call `onChange` for parent-driven value replacement loops

### Serialization

- blank-line runs
- leading and trailing whitespace
- lists separated by blank lines
- code blocks with preserved whitespace
- blockquotes separated by blank lines
- tables
- links
- mixed markdown with HTML if supported

Current exact unit coverage exists for:

- blank-line runs between unchanged paragraph blocks
- blank-line runs between unchanged list and paragraph blocks
- blank-line runs between unchanged blockquote and table blocks
- hydration of expanded blank-line runs as visible empty editor paragraphs
- normalization of TipTap placeholder paragraphs back to plain markdown newline
  runs
- leading and trailing blank-line runs when the document body is unchanged
- unchanged separators around fenced code blocks
- changed block content where the helper must not invent source formatting

### Storage Adapter

- save with base version
- conflict response
- resync behavior
- autosave debounce behavior
- no data loss when remote content changes while local edits are dirty

### Version Adapter

- list versions
- read version detail
- restore version through storage
- raw markdown fidelity for restored snapshots

### Collaboration Adapter

- connection status lifecycle
- room naming
- participant metadata
- no duplicate content after reconnect
- interaction between collaboration state and durable markdown snapshots

## Expected Failing Tests

If we decide byte-for-byte markdown preservation is a product requirement, add failing tests first. In particular, blank-line preservation should be pinned with exact markdown string assertions, not DOM text assertions.

Until then, tests should distinguish between:

- supported canonicalization
- accidental data loss
- unknown behavior that needs manual QA
