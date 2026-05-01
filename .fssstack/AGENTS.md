# fssstack

This is the **flatpack repo**: a source kit that an AI coding agent uses to
create an application repo somewhere else. It is not an application repo itself.

The separate empty repository where the application is assembled is the
**target repo**.

The expected flow is:

1. Start with an empty target repo.
2. Run an AI coding agent from the target repo.
3. Download this flatpack repo into `.fssstack/`.
4. Have the agent read `.fssstack/SETUP_PROCESS.md` and follow it.

During setup, the agent moves files out of `.fssstack/`, generates additional
files with tools such as `create-vite` and `shadcn`, installs dependencies,
renders project-specific placeholders, and validates the result. The output is a
runnable pnpm monorepo in the target repo; the flatpack repo is only the input
used to assemble it.

Do not run, lint, build, or test the flatpack repo as if it were the generated
project. Validate the generated project from the target repo after setup is
complete.

## Notes For Agents

- `SETUP_PROCESS.md` is the source of truth for creating a project.
- If the target repository is not empty, stop and ask for an empty one.
- Keep the flatpack repo focused on project assembly, not app implementation.
- This root `AGENTS.md` is for agents working on the flatpack repo. It should
  not be copied to the root of the target repo.
- `layers/foundation/root/AGENTS.md` is the `AGENTS.md` that gets copied into
  generated target repos.
