import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildLlmsFull } from "./docsLib";

test("ESM fixer handles nested output, declarations and repeat builds", () => {
  const root = mkdtempSync(join(tmpdir(), "mdkit-esm-"));

  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "dist/nested"), { recursive: true });
    writeFileSync(join(root, "package.json"), '{"type":"module"}');
    copyFileSync(
      new URL("./addJsExtensions.ts", import.meta.url),
      join(root, "scripts/addJsExtensions.ts"),
    );

    const input =
      'export { x } from "./nested/x";\nexport { y } from "../y.js";\nexport { z } from "external";\nconst lazy = import("./nested/lazy");\n';

    const expected = input
      .replace('"./nested/x"', '"./nested/x.js"')
      .replace('"./nested/lazy"', '"./nested/lazy.js"');

    for (const file of ["index.js", "nested/index.d.ts", "untouched.txt"])
      writeFileSync(join(root, "dist", file), input);

    for (let iteration = 0; iteration < 2; iteration++) {
      const result = spawnSync(
        process.execPath,
        [
          "--import",
          import.meta.resolve("tsx"),
          join(root, "scripts/addJsExtensions.ts"),
        ],
        { cwd: tmpdir(), encoding: "utf8" },
      );

      assert.equal(result.status, 0, result.stderr);
      assert.equal(readFileSync(join(root, "dist/index.js"), "utf8"), expected);
      assert.equal(
        readFileSync(join(root, "dist/nested/index.d.ts"), "utf8"),
        expected,
      );

      assert.equal(
        readFileSync(join(root, "dist/untouched.txt"), "utf8"),
        input,
      );
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("documentation bundle includes Markdown in stable path order", async () => {
  const root = mkdtempSync(join(tmpdir(), "mdkit-docs-"));

  try {
    mkdirSync(join(root, "reference"));
    writeFileSync(join(root, "reference/api.mdx"), "# API\n");
    writeFileSync(join(root, "guide.md"), "  # Guide\n");
    writeFileSync(join(root, "ignored.json"), "{}");
    assert.equal(
      await buildLlmsFull(root),
      "<!-- source: guide.md -->\n\n# Guide\n\n\n---\n\n<!-- source: reference/api.mdx -->\n\n# API\n\n",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
