import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import {
  buildLlmsFull,
  generateReference,
  llmsFullName,
  publicDir,
  referenceDirName,
} from "./docs-lib.mjs";

async function listFiles(dir, root = dir) {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(path, root)));
      continue;
    }

    if (entry.isFile()) {
      files.push(relative(root, path));
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

async function diffDirectories(expectedDir, committedDir) {
  const [expected, committed] = await Promise.all([
    listFiles(expectedDir),
    listFiles(committedDir),
  ]);

  const drift = [];
  const expectedSet = new Set(expected);
  const committedSet = new Set(committed);

  for (const file of expected) {
    if (!committedSet.has(file)) {
      drift.push(`missing from committed docs: ${file}`);
    }
  }

  for (const file of committed) {
    if (!expectedSet.has(file)) {
      drift.push(`stale committed file (no longer generated): ${file}`);
    }
  }

  for (const file of expected) {
    if (!committedSet.has(file)) continue;

    const [a, b] = await Promise.all([
      readFile(join(expectedDir, file), "utf8"),
      readFile(join(committedDir, file), "utf8"),
    ]);

    if (a !== b) drift.push(`content differs: ${file}`);
  }

  return drift;
}

const tempRoot = await mkdtemp(join(tmpdir(), "mdkit-docs-check-"));

try {
  const freshReference = join(tempRoot, referenceDirName);
  await generateReference(freshReference);

  const drift = await diffDirectories(
    freshReference,
    join(publicDir, referenceDirName),
  );

  const expectedBundle = await buildLlmsFull(publicDir);
  const committedBundle = await readFile(
    join(publicDir, llmsFullName),
    "utf8",
  ).catch(() => null);

  if (expectedBundle !== committedBundle) {
    drift.push(`content differs: ${llmsFullName}`);
  }

  if (drift.length > 0) {
    console.error("docs:check failed — committed docs are stale:\n");
    for (const line of drift) console.error(`  - ${line}`);
    console.error("\nRun `pnpm --filter @mp-lb/mdkit docs:gen` and commit.");
    process.exitCode = 1;
  } else {
    console.log("docs:check passed — committed docs are up to date.");
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
