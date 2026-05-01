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

if [ ! -d "$KIT_ROOT/layers/foundation" ]; then
  echo "missing foundation layer at $KIT_ROOT/layers/foundation" >&2
  exit 1
fi

if [ ! -d "$KIT_ROOT/docs" ]; then
  echo "missing docs at $KIT_ROOT/docs" >&2
  exit 1
fi

shopt -s dotglob nullglob

mkdir -p "$TARGET_ROOT/etc"
rmdir "$TARGET_ROOT/docs" 2>/dev/null || true
mv "$KIT_ROOT/docs" "$TARGET_ROOT/docs"
mv "$KIT_ROOT/layers/foundation/root"/* "$TARGET_ROOT/"
mv "$KIT_ROOT/layers/foundation/etc"/* "$TARGET_ROOT/etc/"
