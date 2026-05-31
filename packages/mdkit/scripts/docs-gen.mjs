import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  buildLlmsFull,
  generateReference,
  llmsFullName,
  publicDir,
  referenceDirName,
} from "./docs-lib.mjs";

const referenceDir = join(publicDir, referenceDirName);

await rm(referenceDir, { recursive: true, force: true });
await generateReference(referenceDir);

const bundle = await buildLlmsFull(publicDir);
await writeFile(join(publicDir, llmsFullName), bundle);

console.log(`docs:gen complete — reference + ${llmsFullName} regenerated`);
