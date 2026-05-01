#!/usr/bin/env node
import fs from "node:fs";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("usage: normalize-package-versions.mjs <package.json> [...]");
  process.exit(1);
}

const sections = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const section of sections) {
    const dependencies = pkg[section];
    if (!dependencies) continue;

    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version === "string") {
        dependencies[name] = version.replace(/^[~^]/, "");
      }
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
}
