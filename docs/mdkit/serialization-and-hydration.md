# Serialization and Hydration

This is the highest-risk area in the package.

## Problem

The consumer sees markdown text. The editor stores a structured document model in memory. Converting between those representations can lose information.

Known example:

- user starts with markdown containing multiple blank lines
- editor parses markdown into a document model
- editor serializes the model back to markdown through `onChange`
- blank-line runs may be compacted
- a cold restore from stored markdown no longer matches the original source

This is a dual-source-of-truth problem. The React `value` is the durable serialized state, while the mounted editor also has internal state.

## Rule

A change is not proven correct until it survives a cold restore from serialized data.

Manual testing must include:

1. edit markdown
2. store serialized value
3. clear in-memory editor state
4. remount editor from stored value
5. compare raw markdown, not only rendered output

## What We Can Guarantee Today

The MdKit editor can:

- hydrate from a markdown `value`
- accept external `value` replacement
- remount from a markdown `value`
- ignore external `value` replacement in collaborative mode, where Yjs owns the
  editor content
- hydrate expanded blank-line runs as visible empty editor paragraphs
- serialize internal empty editor paragraphs back to plain markdown newline runs
- preserve leading and trailing blank-line runs

The package does not yet guarantee byte-for-byte markdown preservation across
all parse and serialize cases. Duplicate adjacent block pairs, fenced-code
content edits, block ordering, and edited blocks must be tested directly whenever
serialization behavior changes.

## Possible Fix Directions

### Rejected: Accept Only Canonical Markdown

Store only markdown emitted by the editor and treat it as canonical. This is simplest but loses source formatting.

Risk: users may care about blank lines and source formatting.

### Rejected As A Standalone Strategy: Preserve Raw Markdown Separately

Store a raw markdown string alongside editor state or canonical markdown.

Risk: raw markdown and editor state can diverge unless synchronization is carefully defined.

### Rejected As The Primary Format: Store Editor JSON

Store the editor document model as JSON and optionally derive markdown for export.

Risk: markdown stops being the true durable source. It may also couple storage to a specific editor library.

### Decision: Markdown Is The Durable Content

Storage must treat the markdown string as the durable document content. Markdown
can represent extra blank lines, so whitespace loss is an editor round-trip bug,
not a reason to abandon markdown as the source of truth.

The editor may store metadata around the markdown when that metadata has a clear
consumer-visible purpose:

```json
{
  "format": "markdown-editor-document",
  "version": 1,
  "markdown": "...",
  "metadata": {}
}
```

That envelope does not solve serialization loss by itself. If the markdown string
cannot survive parse, edit, serialize, store, clear, and restore, the bug is in
the editor integration and needs a test or an explicit documented limitation.

Current mitigation:

- `MdKitEditor` treats markdown as the durable public value
- expanded markdown newline runs are converted to empty editor paragraphs during
  TipTap hydration
- TipTap `&nbsp;` placeholder paragraphs are normalized back to plain markdown
  newline runs before `onChange`
- placeholder paragraphs are not persisted as the public storage format
- the testbench exposes store, clear memory, restore, and newline-run stats for
  manual cold-restore checks

### Blank-Line Semantics

The intended behavior is:

- one blank line between two blocks is a normal markdown block separator and
  should not create extra visible vertical space beyond the editor's block
  styling
- additional blank lines are user-authored spacing and should render as visible
  empty editor paragraphs
- the durable stored value remains plain markdown with newline runs
- `&nbsp;` placeholder paragraphs are only an internal TipTap hydration and
  serialization detail

For example:

```markdown
Before

After
```

is just two adjacent blocks. This:

```markdown
Before



After
```

should hydrate with visible empty paragraphs between the two blocks, and should
serialize back to the same plain markdown newline run.

Back-burner cases:

- byte-for-byte preservation for all markdown constructs
- recovering original formatting inside blocks that were edited
- resolving ambiguous duplicate adjacent block pairs with different separator
  lengths
- deciding whether to support source-format fidelity for raw HTML and unusual
  markdown extensions

## Current Testbench Coverage

`apps/mdkit-testbench` includes:

- one in-memory markdown value
- one mock storage slot
- store, clear memory, restore, and clear storage controls
- newline-run stats so blank-line compaction is visible

The testbench is intentionally small because it exists to expose representation drift.
