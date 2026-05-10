import { getSchema } from "@tiptap/core";
import { MarkdownManager } from "@tiptap/markdown";
import {
  prosemirrorJSONToYXmlFragment,
  yXmlFragmentToProsemirrorJSON,
} from "@tiptap/y-tiptap";
import * as Y from "yjs";
import { createMdKitTiptapExtensions } from "../markdown/createMdKitTiptapExtensions";
import { normalizeMarkdownSerialization } from "../markdown/normalizeMarkdownSerialization";
import { prepareMarkdownForEditorHydration } from "../markdown/prepareMarkdownForEditorHydration";

export type MdKitMarkdownYjsOptions = {
  fragmentName?: string;
};

const defaultMdKitYjsFragmentName = "default";

const getMdKitYjsFragmentName = (options?: MdKitMarkdownYjsOptions) =>
  options?.fragmentName ?? defaultMdKitYjsFragmentName;

const createMdKitMarkdownManager = () =>
  new MarkdownManager({
    extensions: createMdKitTiptapExtensions(),
    markedOptions: {
      gfm: true,
    },
  });

const createMdKitProseMirrorSchema = () =>
  getSchema(createMdKitTiptapExtensions());

const markdownToProseMirrorJson = (markdown: string) =>
  createMdKitMarkdownManager().parse(
    prepareMarkdownForEditorHydration(markdown),
  );

const proseMirrorJsonToMarkdown = (json: Record<string, any>) =>
  normalizeMarkdownSerialization(createMdKitMarkdownManager().serialize(json));

export const replaceMdKitYjsMarkdown = (
  ydoc: Y.Doc,
  markdown: string,
  options?: MdKitMarkdownYjsOptions,
): Uint8Array => {
  const fragment = ydoc.getXmlFragment(getMdKitYjsFragmentName(options));
  const schema = createMdKitProseMirrorSchema();
  const json = markdownToProseMirrorJson(markdown);

  prosemirrorJSONToYXmlFragment(schema, json, fragment);

  return Y.encodeStateAsUpdate(ydoc);
};

export const markdownToMdKitYjs = (
  markdown: string,
  options?: MdKitMarkdownYjsOptions,
): Uint8Array => {
  const ydoc = new Y.Doc();

  return replaceMdKitYjsMarkdown(ydoc, markdown, options);
};

export const mdKitYjsToMarkdown = (
  yjsState: Uint8Array,
  options?: MdKitMarkdownYjsOptions,
): string => {
  const ydoc = new Y.Doc();

  Y.applyUpdate(ydoc, yjsState);

  const json = yXmlFragmentToProsemirrorJSON(
    ydoc.getXmlFragment(getMdKitYjsFragmentName(options)),
  );

  return proseMirrorJsonToMarkdown(json);
};

export const yjs = {
  markdownToMdKitYjs,
  mdKitYjsToMarkdown,
  replaceMdKitYjsMarkdown,
};
