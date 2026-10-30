## Validation

For small changes, run `zap t check` to run linting and typechecking. For bigger system level changes run that and also `zap t build` to check that all the builds still succeed.

The developer will do most of the manual testing.

You can test for debugging purposes but if there's auth its probably better to leave it to the developer.
