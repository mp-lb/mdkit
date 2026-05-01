# fssstack

## Getting Started

Create a new empty repo, open it with your coding agent, and paste this prompt:

```text
1. Create a new directory in this repo called `.fssstack`.
2. Download fssstack with `curl -fsSL https://github.com/mp-lb/fssstack/archive/refs/heads/main.tar.gz | tar -xz --strip-components=1 -C .fssstack`.
3. Read .fssstack/SETUP_PROCESS.md and follow the instructions.
```

## How It Works

fssstack is a flatpack repo: a source kit meant to be downloaded into a separate
empty target repo and assembled there by an AI coding agent. The flatpack repo is
not the app; the target repo becomes the app after the agent follows the setup
process.
