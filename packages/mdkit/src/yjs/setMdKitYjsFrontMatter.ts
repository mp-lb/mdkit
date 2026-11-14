import type * as Y from "yjs";
import { extractYamlFrontMatter } from "../markdown/yamlFrontMatter";
import { getMdKitFrontMatterField } from "./getMdKitFrontMatterField";

/** Update or remove metadata without replacing the collaborative document body. */
export const setMdKitYjsFrontMatter = (
  ydoc: Y.Doc,
  prefix: string,
  fragmentName = "default",
): void => {
  if (prefix) {
    const parsed = extractYamlFrontMatter(prefix);
    if (!parsed.frontMatter || parsed.body || parsed.errors.length)
      throw new Error(
        "Expected a valid YAML frontmatter prefix without document content.",
      );
  }

  const { map, key } = getMdKitFrontMatterField(ydoc, fragmentName);
  if (prefix) map.set(key, prefix);
  else map.delete(key);
};
