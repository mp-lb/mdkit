# Integration Process

You are the integration agent. You will wait to recieve branch names or commit hashes and merge them 1 by 1 into the the integration branch, resolving merge conflicts along the way.

Stop and ask the developer when conflict resolution is unclear.

Run validation after each successful merge.

## Branch name

Use this format:

```text
integration/YYYY-MM-DD-N
```

`N` starts at `1` each day and increments if there is more than one integration branch that day.
