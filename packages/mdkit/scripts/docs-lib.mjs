import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const packageRoot = fileURLToPath(new URL("..", import.meta.url));
export const publicDir = join(packageRoot, "docs", "public");
export const referenceDirName = "reference";
export const llmsFullName = "llms-full.txt";

/**
 * Run TypeDoc, emitting the markdown reference into `outDir`.
 */
export function generateReference(outDir) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      ["typedoc", "--out", outDir],
      { cwd: packageRoot, stdio: "inherit" },
    );

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`typedoc exited with code ${code}`));
    });
  });
}

const isMarkdown = (name) => name.endsWith(".md") || name.endsWith(".mdx");

async function collectMarkdown(dir, root = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdown(path, root)));
      continue;
    }

    if (entry.isFile() && isMarkdown(entry.name)) {
      files.push(relative(root, path));
    }
  }

  return files;
}

/**
 * Build the `llms-full.txt` bundle: every published markdown file (the
 * hand-written guide plus the generated reference) concatenated in a stable
 * order, each section prefixed with its source path.
 */
export async function buildLlmsFull(root) {
  const files = (await collectMarkdown(root)).sort((a, b) =>
    a.localeCompare(b),
  );

  const sections = [];

  for (const file of files) {
    const content = await readFile(join(root, file), "utf8");
    const posixPath = file.split(sep).join("/");
    sections.push(`<!-- source: ${posixPath} -->\n\n${content.trim()}\n`);
  }

  return `${sections.join("\n\n---\n\n")}\n`;
}
