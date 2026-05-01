# Markdown Editor QA

Manual QA is required for editor behavior that jsdom cannot reliably prove. Use
this document as the regression checklist before changing editor hydration,
serialization, focus, hitbox, persistence, versioning, or conflict handling.

## Start The Testbench

Use Zapper when possible:

```bash
zap start testbench
zap start testbench-api
```

If zap is unavailable:

```bash
TESTBENCH_API_PORT=4312 pnpm --filter=@mp-lb/mdkit-testbench-backend dev
pnpm --filter=@mp-lb/mdkit-testbench dev
```

Find the testbench and API URLs with `zap ps`. The testbench examples below
assume `http://localhost:60573`; replace that with the current testbench URL.

## What Is Under QA

The system under test is the mdkit library output inside the checkerboard
workbench. In focused QA mode, the page renders only the library components:

- Unconnected editor: `http://localhost:60573/qa-unconnected`
- Connected panels: `http://localhost:60573/qa-connected-base`
- Connected shadcn reference: `http://localhost:60573/qa-connected-shadcn`

Use the normal debugger URL, `http://localhost:60573/`, only when you need the
inspector, raw markdown, storage controls, debug logs, or styling controls to
understand a failure. Do not treat the inspector or textarea as the thing under
test unless a check explicitly says to use them as a fixture.

## Backend Fixtures

Connected QA uses the in-memory backend. Set these shell variables before using
fixture commands:

```bash
API=http://127.0.0.1:4312
DOC='docs%2Fexample.md'
```

Use the Zapper-assigned backend URL from `zap ps` if it is not `4312`.

Reset connected storage before a connected QA run:

```bash
curl -s -X POST "$API/test/reset"
```

Create a remote change while the connected editor has unsaved local edits:

```bash
curl -s -X POST "$API/test/remote-change?documentId=$DOC" \
  -H 'content-type: application/json' \
  --data '{"content":"Remote fixture change"}'
```

## Unconnected Editor

Open `/qa-unconnected`.

### Controlled Typing

1. Click low in the empty area near the bottom of the editor page.
2. Type a short sentence.
3. Continue typing one character at a time.

Expected:

- The caret appears on the first click.
- The caret remains visible after every keystroke.
- Characters appear in the editor without remount flicker.

### Empty-Area Hitbox

1. Open the normal debugger URL.
2. Use the Storage tab to click `Clear memory`.
3. Click inside the checkerboard editor near the bottom of the blank page.

Expected:

- The editor focuses on the first click.
- The caret appears at the end of the document.
- The Debug tab ends with `editorIsFocused: true` and `viewHasFocus: true`.

### Hydration And Restore

1. Open the normal debugger URL.
2. Use the Storage tab to click `Reset sample`.
3. In the checkerboard editor, add several blank lines around the whitespace
   probe.
4. Click `Store`.
5. Click `Clear memory`.
6. Click `Restore`.
7. Use the State tab only to inspect the raw markdown.

Expected:

- Stored markdown and restored markdown match exactly.
- Extra blank lines render in the editor after restore.
- Removing blank lines in the editor removes them from the raw markdown state.

### List Editing

1. In the focused QA route, type `- first`.
2. Press `Enter`.
3. Type `second`.
4. Press `Enter`.

Expected:

- A new list item is created.
- No literal `&nbsp;` appears in the raw markdown when inspected in the
  debugger.
- List item spacing is compact and paragraph spacing remains readable.

## Connected Base Panels

Open `/qa-connected-base`. This focused route exercises `MdKitEditor`,
`MdKitDocumentToolbar`, `MdKitConflictPanel`, and `VersionHistoryPanel` without
the debugger inspector. It uses a longer autosave debounce so conflict fixtures
are easier to trigger manually. Use `Save now` when a check needs an immediate
write.

### Initial Load

1. Reset the backend.
2. Open `/qa-connected-base`.

Expected:

- `MdKitDocumentToolbar` renders above `MdKitEditor`.
- The toolbar shows the current save state, version, collaboration state, and
  version count.
- There is no `Resync` button in the toolbar.
- There is no `Resolve conflict` button before a conflict exists.
- The editor loads without a duplicate collaboration status strip inside the
  editor body.

### Connected Debugger Variants

1. Open the normal debugger URL.
2. Click `Connected (panels)`.
3. Click `Connected (shadcn)`.

Expected:

- `Connected (panels)` renders the package exports:
  `MdKitDocumentToolbar`, `MdKitConflictPanel`, `VersionHistoryPanel`, and
  `MdKitEditor`.
- `Connected (shadcn)` renders one app-local workflow component that owns
  its toolbar, version dialog, and conflict dialog, matching the intended future
  registry plugin shape.
- Typing and autosave work in both variants.

### Basic Persistence

1. Reset the backend.
2. Open `/qa-connected-base`.
3. Type a unique sentence in the editor.
4. Click `Save now`.
5. Reload the page.

Expected:

- The toolbar returns to a saved/idle state.
- The unique sentence is still present after reload.
- The version number has advanced.

### Version History Restore

1. Reset the backend.
2. Open `/qa-connected-base`.
3. Type `Version one` and click `Save now`.
4. Replace the content with `Version two` and click `Save now`.
5. Click `Version history` in the toolbar.
6. Select the saved version containing `Version one`.
7. Click `Restore`.

Expected:

- `VersionHistoryPanel` opens in the app-owned modal shell.
- Selecting a version previews its markdown.
- Restoring the first version puts `Version one` back in the editor.
- The toolbar version advances after restore.

### Conflict: Keep Remote

1. Reset the backend.
2. Open `/qa-connected-base`.
3. Type `Local unsaved change` but do not click `Save now`.
4. Within a few seconds, run the remote-change fixture command.
5. Wait for the toolbar to show a conflict.
6. Click `Resolve conflict`.
7. Inspect the `Keep remote` and `Keep local` tabs.
8. Click `Keep remote`.

Expected:

- The toolbar shows only the warning-colored `Resolve conflict` action for the
  conflict path.
- Normal `Save now` and `Version history` are disabled while the conflict
  exists.
- The editor is read-only while the conflict exists.
- The conflict panel opens in the app-owned modal shell.
- The conflict panel previews the remote content and the local unsaved content.
- `Keep remote` replaces the editor content with `Remote fixture change`.
- The conflict state clears.

### Conflict: Overwrite Remote

1. Reset the backend.
2. Open `/qa-connected-base`.
3. Type `Local wins` but do not click `Save now`.
4. Within a few seconds, run the remote-change fixture command.
5. Wait for the toolbar to show a conflict.
6. Click `Resolve conflict`.
7. Confirm the `Local` tab contains `Local wins`.
8. Click `Keep local`.
9. Reload the page.

Expected:

- The editor is read-only until the conflict is resolved.
- The conflict state clears.
- The editor still contains `Local wins`.
- After reload, `Local wins` is still persisted.

## Connected Shadcn Reference

Open `/qa-connected-shadcn`. This focused route exercises the testbench's
shadcn-composed reference workflow. It is not exported by the npm package yet,
but it is the target shape for the future shadcn registry/plugin entry.

### Shadcn Reference Smoke

1. Reset the backend.
2. Open `/qa-connected-shadcn`.
3. Type a unique sentence in the editor.
4. Wait for autosave, then reload.
5. Click `Version history`.

Expected:

- The sentence persists after reload.
- The toolbar has no `Resync` button.
- `Version history` opens in the shadcn workflow component's own modal shell.
- The connected editor remains the same `MdKitEditor` surface used by the base
  panel route.

### Shadcn Reference Conflict

1. Reset the backend.
2. Open `/qa-connected-shadcn`.
3. Type `Local shadcn conflict` but do not wait for autosave.
4. Run the remote-change fixture command.
5. Wait for the toolbar to show a conflict.
6. Click `Resolve conflict`.

Expected:

- The warning-colored conflict button is hidden until the conflict exists.
- Version history is disabled while the conflict exists.
- The editor is read-only while the conflict exists.
- The conflict modal allows the remote and local content to be inspected before
  choosing `Keep remote` or `Keep local`.

### Collaboration Smoke Check

Single-user manual QA cannot prove collaborative editing. Use the normal
debugger URL and switch to the connected tab for this smoke check. Check only
the library output inside the checkerboard:

- the toolbar reaches `Collaboration connected`
- the editor remains usable in collaboration mode
- no duplicate collaboration status appears inside the editor body

## Serialization Cases

Type or paste each case into the checkerboard editor, then store, clear memory,
and restore through the normal debugger. Use the State tab only to inspect the
emitted markdown.

### Multiple Blank Lines

```markdown
one

two
```

### Code Block Whitespace

````markdown
```ts
const value = {
  one: 1,

  two: 2,
};
```
````

### List Separation

````markdown
- one

- two


- three
````

### Leading And Trailing Whitespace

```markdown
starts after blank lines
```

## Record Bugs With

- focused QA URL used
- original markdown
- markdown emitted after edit
- markdown after cold restore
- editor library path involved
- whether the issue appears in rendered output, raw markdown output, or both
- Debug tab entries if the bug involves focus, cursor visibility, hitbox, or
  typing
