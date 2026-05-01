# Layout

Layout is a separate responsibility from component design.

Components should describe what they are. Layout should describe how those components sit together.

## Core Rule

Prefer layout wrappers over component margins.

A component should usually not create whitespace around itself. It can have internal padding when that padding is part of its own shape, such as a button, card, input, badge, or table cell. But it should not usually decide how far away the next component is.

Good:

```tsx
<div className="flex flex-col gap-4">
  <MatterHeader matter={matter} />
  <MatterSummary matter={matter} />
  <MatterTasks tasks={tasks} />
</div>
```

Avoid:

```tsx
<MatterHeader className="mb-4" />
<MatterSummary className="mb-4" />
<MatterTasks />
```

The parent owns the spacing between children. The child owns its own internal layout.

## Layout Components

Some components exist only to arrange other components. That is a good thing.

Examples:

- app shell
- sidebar/detail layout
- split pane
- toolbar
- page header
- form section
- empty-state frame
- scroll area with fixed actions

These components may have little or no domain meaning. Their job is to make positioning, scrolling, wrapping, and spacing consistent.

Use a layout component when the same structure appears in multiple places or when the layout has enough behavior to deserve a name.

```tsx
<SidebarDetailLayout
  sidebar={<MatterSidebar matter={matter} />}
  detail={<MatterDetail matter={matter} />}
/>
```

Do not extract every `div` into a component. A simple stack is usually just Tailwind:

```tsx
<div className="flex flex-col gap-3">
  {children}
</div>
```

## Gap Over Margins

Use `gap` for spacing between siblings.

This keeps spacing symmetrical, avoids "last child" exceptions, and makes the parent layout easier to scan.

Good:

```tsx
<div className="flex items-center gap-2">
  <Label>Go to:</Label>
  <Badge>Home</Badge>
</div>
```

Avoid:

```tsx
<Label className="mr-2">Go to:</Label>
<Badge>Home</Badge>
```

Use margin when something genuinely needs to escape the normal rhythm or align with an external boundary. Treat that as the exception.

## Padding Is Internal

Padding belongs to the thing being padded.

Use padding for the inside of a surface:

```tsx
<section className="rounded-md border bg-card p-4">
  <div className="flex flex-col gap-3">
    <h2 className="text-sm font-medium">Tasks</h2>
    <TaskList tasks={tasks} />
  </div>
</section>
```

Do not use padding as a substitute for spacing between unrelated siblings. Reach for `gap` on the parent first.

## Flexbox First

Most product UI is rows, columns, alignment, wrapping, and available-space management. Flexbox should be the default layout tool for that.

Common shapes:

```tsx
// vertical stack
<div className="flex flex-col gap-4" />

// inline row
<div className="flex items-center gap-2" />

// split header
<div className="flex items-center justify-between gap-4" />

// fill remaining space
<div className="flex min-h-0 flex-1 flex-col" />
```

Nested flex layouts are normal. A page can be a column, containing a header row and a body row, containing a sidebar column and a detail column.

Use CSS grid when the UI is actually two-dimensional: dashboards, fixed column matrices, image grids, calendar-like surfaces, or forms where both row and column alignment matter.

## Whitespace Discipline

Whitespace should be visible in one place when reading the code.

If a layout feels wrong, first look at the parent containers:

- Are siblings spaced with `gap`?
- Is the main axis clear?
- Is the cross-axis alignment explicit?
- Is the scroll boundary obvious?
- Are children adding their own margins?

Avoid hidden spacing caused by default margins on headings, paragraphs, or lists. When using raw HTML elements, reset or control their spacing with Tailwind classes.

```tsx
<div className="flex flex-col gap-2">
  <h2 className="text-base font-semibold">Workflow</h2>
  <p className="text-sm text-muted-foreground">Current step and owner.</p>
</div>
```

## Tailwind Vocabulary

Tailwind is the low-level styling vocabulary. It does not remove the need for layout thinking.

Think in reusable layout shapes:

- stack: `flex flex-col gap-*`
- inline: `flex items-center gap-*`
- cluster: `flex flex-wrap items-center gap-*`
- split: `flex items-center justify-between gap-*`
- fill: `min-h-0 flex-1`
- scroll body: `min-h-0 flex-1 overflow-auto`

These do not all need components. They are still concepts worth naming in reviews and code discussions.

## Practical Rules

- Components should not usually have outer margins.
- Parents should control spacing between children.
- Prefer `gap` over sibling margins.
- Use padding for internal space inside a surface or control.
- Reach for flexbox first.
- Use grid for genuinely two-dimensional layouts.
- Extract layout components for repeated structural patterns, not for every stack.
- Make scroll and fill behavior explicit with `min-h-0`, `flex-1`, and `overflow-*`.
- Keep component APIs about behavior and content, not incidental spacing.
