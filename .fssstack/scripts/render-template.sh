#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: $0 /path/to/target-project project-slug package-scope project-name project-description project-emoji" >&2
}

if [ "$#" -ne 6 ]; then
  usage
  exit 1
fi

TARGET_ROOT="$1"
PROJECT_SLUG="$2"
PACKAGE_SCOPE="$3"
PROJECT_NAME="$4"
PROJECT_DESCRIPTION="$5"
PROJECT_EMOJI="$6"
PACKAGE_PREFIX="$PACKAGE_SCOPE/$PROJECT_SLUG"

find "$TARGET_ROOT" \
  -path "$TARGET_ROOT/.git" -prune -o \
  -path "$TARGET_ROOT/node_modules" -prune -o \
  -path "$TARGET_ROOT/.fssstack" -prune -o \
  -type f \
  \( -name "package.json" -o -name "zap.yaml" -o -name "AGENTS.md" -o -name "README.md" -o -name "index.html" -o -name "*.ts" -o -name "*.tsx" \) \
  -print0 |
  PACKAGE_PREFIX="$PACKAGE_PREFIX" PROJECT_SLUG="$PROJECT_SLUG" PROJECT_NAME="$PROJECT_NAME" PROJECT_DESCRIPTION="$PROJECT_DESCRIPTION" PROJECT_EMOJI="$PROJECT_EMOJI" \
    xargs -0 perl -0pi -e 's#__PACKAGE_PREFIX__#$ENV{PACKAGE_PREFIX}#g; s#__PROJECT_SLUG__#$ENV{PROJECT_SLUG}#g; s#__PROJECT_NAME__#$ENV{PROJECT_NAME}#g; s#__PROJECT_DESCRIPTION__#$ENV{PROJECT_DESCRIPTION}#g; s#__PROJECT_EMOJI__#$ENV{PROJECT_EMOJI}#g'

if [ -d "$TARGET_ROOT/apps/frontend/public" ]; then
  cat >"$TARGET_ROOT/apps/frontend/public/favicon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y="75" font-size="80">$PROJECT_EMOJI</text>
</svg>
SVG
fi
