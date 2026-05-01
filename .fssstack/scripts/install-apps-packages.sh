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

if [ ! -d "$KIT_ROOT/layers/apps" ] || [ ! -d "$KIT_ROOT/layers/packages" ]; then
  echo "missing apps/packages layers under $KIT_ROOT/layers" >&2
  exit 1
fi

shopt -s dotglob nullglob

mkdir -p "$TARGET_ROOT/apps" "$TARGET_ROOT/packages"
mv "$KIT_ROOT/layers/apps"/* "$TARGET_ROOT/apps/"
mv "$KIT_ROOT/layers/packages"/* "$TARGET_ROOT/packages/"
