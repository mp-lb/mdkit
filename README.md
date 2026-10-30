# 📝 MDKit

A toolkit for building integrated, feature rich markdown editor experiences.

## Tool versions

Use the exact Node version in `.node-version` and the pnpm version in
`package.json#packageManager`. `engines.node` declares the minimum supported
Node version; it is not a development pin. CI reads `.node-version`.

With mise installed, run `mise trust`, then `mise install`. Use an activated
mise shell or `mise exec -- <command>` so Zapper inherits these tools.
For nvm, run `nvm install "$(cat .node-version)"` and
`nvm use "$(cat .node-version)"`. Dependency policy lives in
`pnpm-workspace.yaml`; use `workspace:*` for internal dependencies.
