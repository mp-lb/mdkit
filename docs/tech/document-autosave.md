# Document autosave

`useMdKitDocument` allows one adapter write at a time. Edits whose debounce
expires during a write are queued and scheduled again after the save lock is
released, using the version returned by the completed write.

Queue draining happens in the completion handler as well as the saved-state
effect because React can run that effect before the asynchronous save releases
its lock. A completing write must not clear the timer for a newer edit.
