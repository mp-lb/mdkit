import type * as Y from "yjs";
import { getMdKitFrontMatterField } from "./getMdKitFrontMatterField";

/** Subscribe to local and remote metadata changes. Returns an unsubscribe function. */
export const observeMdKitYjsFrontMatter = (
  ydoc: Y.Doc,
  listener: () => void,
  fragmentName = "default",
) => {
  const { map, key } = getMdKitFrontMatterField(ydoc, fragmentName);

  const observe = (event: Y.YMapEvent<string>) => {
    if (event.keysChanged.has(key)) listener();
  };

  map.observe(observe);
  return () => map.unobserve(observe);
};
