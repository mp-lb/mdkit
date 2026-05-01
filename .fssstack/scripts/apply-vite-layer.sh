#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: $0 /path/to/target-project" >&2
}

if [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

TARGET_ROOT="$1"
KIT_ROOT="$TARGET_ROOT/.fssstack"
FRONTEND_ROOT="$TARGET_ROOT/apps/frontend"

if [ ! -d "$FRONTEND_ROOT" ]; then
  echo "missing $FRONTEND_ROOT; generate the Vite app first" >&2
  exit 1
fi

cp -R "$KIT_ROOT/layers/vite/." "$FRONTEND_ROOT/"
