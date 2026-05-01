# Library Tradeoffs

The editor library choice is not settled forever. The package should keep enough documentation around alternatives that switching remains possible.

## ProseMirror

Pros:

- mature document model
- strong plugin ecosystem
- basis for Tiptap and many other editors

Cons:

- low-level API
- document model does not preserve all markdown source trivia
- direct integration work is non-trivial

## Tiptap

Pros:

- ergonomic React integration
- built on ProseMirror
- strong extension ecosystem
- collaboration support works naturally with Yjs and Hocuspocus

Cons:

- default rendering can feel like a generic web editor without heavy styling
- markdown is not the native source of truth
- serialization can normalize markdown whitespace and formatting
- collaboration-first paths can make basic controlled editing harder to reason about

## Hocuspocus

Pros:

- standard Yjs websocket collaboration server
- integrates cleanly with Tiptap collaboration
- removes a large amount of custom collaboration work

Cons:

- it is infrastructure the frontend package does not control
- setup, auth, persistence, and scaling are outside a basic editor component
- consumers need either clear adapter contracts or reference server adapters

## Current Bias

Use the editor library that gives the best markdown fidelity and user experience while keeping collaboration pluggable. Do not let a collaboration implementation force the basic editor API to leak backend concerns.
