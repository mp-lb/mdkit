import * as Y from "yjs";
import {
  mdKitYjsToMarkdown,
  type MdKitMarkdownYjsOptions,
} from "./MdKitMarkdownYjs";

/** Serialize the current collaborative body and metadata without modifying either. */
export const readMdKitYjsMarkdown = (
  ydoc: Y.Doc,
  options?: MdKitMarkdownYjsOptions,
): string => mdKitYjsToMarkdown(Y.encodeStateAsUpdate(ydoc), options);
