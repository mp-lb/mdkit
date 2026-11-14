import type * as Y from "yjs";

export const getMdKitFrontMatterField = (
  ydoc: Y.Doc,
  fragmentName = "default",
) => ({
  map: ydoc.getMap<string>("__mdkit"),
  key: `${fragmentName}:frontMatterPrefix`,
});
