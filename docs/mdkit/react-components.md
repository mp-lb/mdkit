# React Components

The React surface should make mdkit easy to adopt in layers.

The model is similar to authentication libraries:

- use the off-the-shelf UI when you want the whole workflow working quickly
- use base panels when you want usable UI without adopting a design system
- use hooks when you want application-specific UI
- drop down to core functions when you want to own the workflow completely

## Target Layers

### Editor

`MdKitEditor` is the editor surface.

It should eventually use one editor engine for local and collaborative editing.
The public component can stay the same while the internals switch between local
state and collaborative state.

The editor has a `fillHeight` mode for the common full-pane editing layout. When
enabled, mdkit owns the scrollable editor surface and makes empty space below the
last line part of the editor hitbox, so clicking there focuses the cursor at the
end. The default remains content-sized so host applications can fully own
framing, scrolling, and page layout.

Styling should stay CSS-variable based where possible. The package stylesheet
should provide a reset-resistant markdown baseline so headings, lists,
blockquotes, and code blocks render correctly inside Tailwind, shadcn, and other
CSS-reset-heavy environments. Consumers can override variables on the editor root
or parent scope instead of needing bespoke React props for every visual token.

### Hooks And Workflow Logic

The core React product is the hooks and workflow logic:

- current markdown value
- autosave state
- dirty state
- conflict state
- restore/version state
- collaboration connection state
- actions needed to resolve conflicts
- actions needed to open version history and restore a version

These hooks should remain the main reusable abstraction. They should contain the
workflow logic without dictating layout or visual style, and they must never
depend on mdkit UI components.

Example shape:

```tsx
<MdKitDocumentController documentId="docs/example.md" adapter={adapter}>
  {({ editor, autosave, versions, conflict, collaboration }) => (
    // Consumer renders header, modal, warning banner, and editor.
  )}
</MdKitDocumentController>
```

## Default Workflow UI

We should provide a complete workflow UI that can be dropped into an app, but it
should not own global application chrome by default. The default component should
render plain, unstyled HTML regions that can sit inline above or next to the
editor. Consumers can put those regions inside their own modal, drawer, split
pane, route, or popover.

It should handle:

- autosave status in a header
- no manual save button by default
- version history trigger and inline version history content
- conflict warning
- frozen editor while unresolved conflict exists
- conflict resolution actions
- collaboration status/presence where available

This component should be useful for getting started quickly. If a consumer wants
custom product UI, they can use the headless controller instead.

### Shell Ownership

Mdkit should avoid owning modal and overlay shells in the design-system agnostic
package. Modals, drawers, and flyouts depend on focus traps, portals, z-index
policy, scroll locking, accessibility conventions, animation, and app-level
stacking context. A generic package-level modal is likely to look wrong or
fight the host application.

The recommended boundary is:

- mdkit owns workflow state, actions, and unstyled content components
- the consuming application owns placement and shell components
- optional design-system packages can own richer shells later

For example, the default toolbar can expose or render version history inline.
The app can place that version history content in a shadcn dialog, a side panel,
or directly below the toolbar. The same applies to conflict details and future
diff views.

### Component Layers

The public React layers should be:

1. Hooks and core functions. These are the non-negotiable foundation and must
   never depend on mdkit UI.
2. Headless workflow controller. This composes document, versions,
   collaboration, autosave, and conflict state into one ergonomic contract.
3. Base panels. These render raw semantic HTML for toolbar, version history,
   and conflict details, with stable mp-lb-mdkit-prefixed classes and optional mdkit
   CSS.
4. Shadcn plugin/registry components. These are copied into the consuming app
   the shadcn way and can own dialogs, drawers, buttons, and polished layout.

This keeps the default path useful without making the base library responsible
for every design system.

The base npm package should not export a "shadcn component" at runtime. Shadcn
is source installed into an application, not a peer dependency. A proper shadcn
integration should be a registry/plugin item that installs app-local files using
the consumer's aliases from `components.json`.

## Base Panels

Base panels are for non-shadcn apps and existing companies with their own design
systems. They are not shadcn components and they are not meant to look polished.
They should:

- render inline, not through portals
- use semantic HTML and stable `mp-lb-mdkit-*` class names
- be usable as raw HTML when no stylesheet is imported
- work acceptably when the package `styles.css` is imported
- be easy to override with plain CSS, CSS modules, Tailwind, styled-components,
  or a host design system
- avoid app-level shell decisions such as z-index, focus traps, scroll locking,
  and animations

The fallback CSS should be deliberately generic: square corners, one-pixel
borders, clear spacing, plain buttons, and no design-system-specific polish. It
should be robust in CSS-reset-heavy environments, not visually impressive.

The target base panels are:

- `MdKitDocumentToolbar`
- `MdKitConflictPanel`
- `VersionHistoryPanel` / future `MdKitVersionHistoryPanel` alias
- future `MdKitDocumentWorkflow` composition helper

These panels should provide the full workflow when rendered inline or inside an
app-owned shell. A consuming app can place the same panels in its own modal,
drawer, side panel, or editor replacement view.

## Shadcn Plugin

If we support shadcn, we should do it the shadcn way: a registry/plugin item that
copies source files into the consuming app. Those copied files can import local
app components such as:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
```

The plugin can use the user's shadcn aliases and theme tokens. It can provide a
near-zero-code polished experience with dialogs, drawers, tabs, and application
layout because the code now lives inside the host app.

We should not:

- make shadcn a peer dependency
- pass a map of local components into mdkit
- bundle our own copies of shadcn primitives in the core npm package
- export Tailwind-only "shadcn" wrappers from the base package and hope the
  consumer's Tailwind build scans them correctly

The mdkit testbench should act as the reference consumer for both paths:

- connected base panels: package exports plus mdkit CSS
- connected shadcn plugin reference: one app-local workflow component copied
  into the testbench, shaped like the future registry-installed source

The shadcn reference component should be all-in-one for workflow UI. A consumer
should call the document, version, and collaboration hooks, render
`MdKitEditor`, and render one installed shadcn workflow component above it. That
component should own the toolbar, version history dialog, conflict dialog,
buttons, tabs, and any shadcn shell components. It should not reuse the base
panels internally because the point of this layer is a polished app-local
implementation, not a wrapper around generic fallback HTML.

The future registry item should declare registry dependencies for the shadcn UI
primitives it imports, such as `button`, `badge`, `dialog`, `tabs`, and
`textarea`, plus npm dependencies such as `lucide-react` if needed. The
installed source can then import from the consumer's configured aliases such as
`@/components/ui/button` and `@/lib/utils`.

That boundary is important: the registry installs mdkit workflow source into the
app, and that source imports the app's own shadcn primitives. The mdkit npm
package should only provide hooks, editor components, core logic, and base
panels. It should not bundle shadcn primitives, depend on shadcn as a package,
or ask consumers to pass a map of local UI components into mdkit.

## Conflict UX

Conflicts are a workflow, not just an error.

The default behavior should be:

1. Detect stale base version or remote change while local edits are dirty.
2. Freeze editing until the conflict is handled.
3. Show enough state for the user to understand what happened.
4. Offer resolution actions:
   - keep local version
   - use remote version
   - inspect local, remote, and base markdown
   - manually edit/merge and then force-save
5. Resume autosave after resolution.

The conflict resolution logic should live in core functions and controller
state, not inside a styled component.

The complete default workflow should include conflict details, not just the two
resolution buttons. The unstyled conflict component can start with local/remote
metadata and actions; a diff view is the obvious next layer once the underlying
diff helper is available.

## Version History UX

Version history is mostly workflow and backend/data modeling, but a headless UI
component is still valuable.

The default version UI should work without custom application code beyond
passing a versions controller and restore callback. It should not require the
consumer to wire the toolbar trigger manually before it does anything useful.

The default version history surface should be an unstyled content component that
can be rendered inline. The toolbar can either render it inline itself or expose
open/close state through a controller. If a consumer wants a modal, they should
wrap that content in their own modal shell.

Useful surfaces:

- headless controller for listing/selecting/restoring versions
- base version history panel
- base conflict details panel
- shadcn plugin version history dialog/drawer component
- read-only markdown viewer that visually matches `MdKitEditor`

## Styling Strategy

The most reusable layer should be headless and design-system agnostic.

Styled components should be optional. A shadcn-oriented surface is a good fit for
the first styled implementation, but it should not be required by the core
package.

Potential distribution:

- npm package exports headless primitives and base editor styles
- optional shadcn registry item installs app-editable wrappers
- future design-system wrappers can sit on top of the same controller contracts

## Current Gap

Current implementation is not there yet.

We have:

- `MdKitEditor`
- `useMdKitDocument`
- `useMdKitDocumentVersions`
- `useMdKitCollaboration`
- `MdKitDocumentToolbar`
- `MdKitConflictPanel`
- `VersionHistoryPanel`
- testbench-only shadcn workflow reference component

Missing or incomplete:

- one editor engine for local and collaborative editing
- headless document workflow component
- `MdKitVersionHistoryPanel` naming alias
- complete default document workflow composition helper
- shadcn registry packaging for the testbench workflow reference component
- conflict details/diff component
- backend/core conflict helpers integrated into hooks
- read-only markdown viewer
