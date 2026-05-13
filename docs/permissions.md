# MDKit Permissions

MDKit should make collaboration and connected storage secure by default without
owning an application's auth system.

The application owns:

- authentication
- user identity
- tenancy
- document ownership
- roles and teams
- audit logging
- permission policy

MDKit owns where permission checks happen in the document, checkpoint, restore,
and collaboration lifecycle.

## Permission Contract

The default permission contract should be one `can` function:

```ts
type MdKitPermissionAction = "read" | "write" | "restore";

type MdKitPermissions<User = unknown, Document = unknown, Context = unknown> = {
  can(
    action: MdKitPermissionAction,
    user: User,
    document: Document,
    context: Context,
  ): Promise<boolean> | boolean;
};
```

This is intentionally not a fine-grained list of every operation. The goal is a
simple middle ground that covers normal products without making permission
configuration harder than the editor integration.

## Action Semantics

### `read`

Allows the user to read the current document and read checkpoint history.

MDKit should require `read` for:

- reading the current markdown document
- listing checkpoints
- reading a checkpoint detail
- opening non-editing document surfaces

### `write`

Allows the user to change the current document.

MDKit should require `write` for:

- writing the current markdown document
- creating manual checkpoints
- creating rule-driven checkpoints during a write
- joining a collaboration room
- writing or snapshotting collaboration state

Collaboration requires `write`. MDKit does not need read-only collaboration for
the initial permission model. If a user cannot write the document, they cannot
join the collaborative editor session.

`write` implies `read` at the product level. MDKit can still call `can("read")`
for read endpoints and `can("write")` for write endpoints, but applications
should treat a writer as someone who can also read.

### `restore`

Allows the user to restore a checkpoint into the current document.

Restore is technically a write, but it is higher risk than normal editing
because it can replace the whole document and reset an active collaboration
session. Keeping it separate lets products require elevated permission for
restore without needing a large fine-grained action enum.

MDKit should require `restore` for:

- restoring a checkpoint
- restore-time collaboration reset

Products that do not need a separate restore permission can implement
`restore` as equivalent to `write`.

## Required Permissions

Permissions should be mandatory for the opinionated backend helper. The package
can expose an explicit allow-all implementation for local development,
prototypes, tests, and applications that intentionally handle permissions
outside mdkit.

```ts
export const mdKitDisablePermissions: MdKitPermissions = {
  can: () => true,
};
```

The important point is that disabling permission checks should be visible in
code. It should not be the accidental default.

## Collaboration Security

Collaboration room names are not secrets. The server must authorize every
collaboration join attempt.

Joining a collaboration room is both read access and write access to the live
Yjs document. Once a client is connected, it can receive the current
collaboration state and send Yjs updates unless the server rejects or constrains
that connection. Storage callbacks alone are not enough, because an active Yjs
document lives in server memory and can be read or changed before a persistence
callback runs.

The default join rule is simple:

- `can("write", user, document, context)` is required to join collaboration.
- There is no built-in read-only collaboration mode.

Join-time authorization is necessary, but it is not sufficient for strict
mid-session revocation. If the product needs the guarantee that no writes are
accepted after a permission revocation response succeeds, the collaboration
server needs a write fence.

For mid-session permission changes, the reliable default is:

- synchronously mark the user or room connection as revoked
- reject future Yjs update messages from that connection before applying them
- close or reset affected collaboration sessions
- require clients to reconnect
- re-run permission checks on reconnect
- reject users who no longer have access

This may reset cursors and require the editor to reload. That is acceptable:
correct access control is more important than preserving session continuity.

Closing the WebSocket alone is an eventual cleanup mechanism. It is not the
write fence. The write fence is the server-side check that prevents a Yjs update
from being applied after revocation has been committed.

### Enforcement Levels

MDKit should let applications choose how strictly to enforce collaboration
permissions after a session has already joined.

#### Join Only

Check `can("write")` when the user joins the collaboration room.

This is the simplest model and is probably what many applications do in
practice. It is acceptable when permissions rarely change while a user is
actively editing, or when eventual revocation is enough.

Tradeoff: if permissions are revoked mid-session, that active WebSocket may keep
editing until it disconnects, is closed by the server, or is forced to reconnect.
Normal WebSocket ping timeouts are liveness checks, not permission expiry. They
do not provide a security guarantee for permission changes.

#### Per-Message Permission Check

Check `can("write")` in `beforeHandleMessage` before every incoming Yjs message
is applied.

This is the closest equivalent to checking permissions before every HTTP write
request. It can read directly from the database, which is the clearest
correctness model.

Tradeoff: it may be too expensive for high-volume collaborative editing if the
permission check is slow.

#### Per-Message Revocation Check

Check a cheap revocation source in `beforeHandleMessage`, such as an in-memory
set, cache entry, permission generation, or short-lived authorization record.

This is the practical compromise for many systems. Full permission policy runs
on join and when permissions change. Each packet checks whether the already
authorized session is still valid.

Tradeoff: the revocation source must have the ordering guarantee the product
needs. If a revocation request returns success before every collaboration server
can observe the revoked state, the system has eventual revocation rather than
strict post-response write prevention.

### Hocuspocus/Yjs Enforcement Points

Hocuspocus exposes the hooks needed to enforce this model on the server:

- `onConnect` runs when the client first asks to connect to a document.
- `onAuthenticate` runs when authentication is enabled and receives the token
  sent by the client provider.
- `beforeHandleMessage` runs before an incoming collaboration message is
  applied to the Yjs document.

MDKit should use connection-time authorization as the first security boundary:

- resolve the user from the provider token or request context
- resolve the mdkit document from the collaboration room name
- call `can("write", user, document, context)`
- reject or close the WebSocket before the client receives document state or
  sends accepted Yjs updates if permission is denied

The client already has a token hook through `useMdKitCollaboration`. That token
is not the permission policy; it is just how the server identifies the user and
request context before calling `can`.

`beforeHandleMessage` is the write-fence hook. It runs before an incoming Yjs
message is applied. MDKit should use it for a cheap revocation check, such as
comparing the connection's permission generation with the current permission
generation for that user/document pair. Throwing from this hook closes the
connection before the message is applied.

The hook is asynchronous, so it can check the database directly on every packet
if the product wants regular-request-style authorization before each write. That
is the clearest correctness model: when a permission change commits in the
database before the revocation request returns, the next Yjs packet checks that
database state and is rejected before it is applied.

For high-volume collaboration, checking the database on every packet may be too
expensive. A precomputed revocation flag, permission generation, or cached
authorization result can be used as an optimization. The optimization must keep
the same ordering guarantee: after revocation returns success, every
collaboration server that can apply updates must observe the revoked state
before accepting another update from that user/session.

For a single collaboration server process, the revoke operation can update an
in-memory revocation set before returning success. For multiple collaboration
server processes, the revoke operation must either update a strongly consistent
shared revocation source that every process checks before applying updates, or
wait for every relevant process to install the revocation fence before returning
success. Otherwise the system only has eventual revocation, not strict
post-response write prevention.

Hocuspocus also has read-only connection support, but MDKit does not need to
expose read-only collaboration in the initial permission model. Collaboration is
an editing mode, so it requires `write`.

## Backend Helper Responsibilities

Any opinionated mdkit backend helper should call permissions at every
server-side entry point:

| Operation | Required Action |
| --- | --- |
| Read current document | `read` |
| Write current document | `write` |
| List checkpoints | `read` |
| Read checkpoint | `read` |
| Create checkpoint | `write` |
| Restore checkpoint | `restore` |
| Join collaboration | `write` |
| Persist collaboration state from an authorized room | `write` |
| Reset collaboration state during restore | `restore` |

The frontend may hide controls based on permission information, but frontend UI
checks are only convenience. Server-side checks are the security boundary.

## Context

`context` is caller-owned. It can contain request information, auth tokens,
tenant ids, feature flags, audit metadata, or anything else the application
needs to answer permission checks.

MDKit should pass `context` through and not inspect it.
