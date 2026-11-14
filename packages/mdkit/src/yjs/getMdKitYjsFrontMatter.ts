import type * as Y from "yjs";
import { getMdKitFrontMatterField } from "./getMdKitFrontMatterField";

/** Read the exact YAML prefix, including comments and whitespace. */
export const getMdKitYjsFrontMatter = (
  ydoc: Y.Doc,
  fragmentName = "default",
): string => {
  const { map, key } = getMdKitFrontMatterField(ydoc, fragmentName);
  return map.get(key) ?? "";
};
