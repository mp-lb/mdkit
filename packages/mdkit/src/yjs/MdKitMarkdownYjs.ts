import { getSchema } from "@tiptap/core";
import { MarkdownManager } from "@tiptap/markdown";
import {
  prosemirrorJSONToYXmlFragment,
  yXmlFragmentToProsemirrorJSON,
} from "@tiptap/y-tiptap";
import * as Y from "yjs";
import { createMdKitTiptapExtensions } from "../markdown/createMdKitTiptapExtensions";
import {
  extractYamlFrontMatter,
  prependYamlFrontMatter,
} from "../markdown/yamlFrontMatter";
import { normalizeMarkdownSerialization } from "../markdown/normalizeMarkdownSerialization";
import { prepareMarkdownForEditorHydration } from "../markdown/prepareMarkdownForEditorHydration";
import { getMdKitFrontMatterField } from "./getMdKitFrontMatterField";
import { getMdKitYjsFrontMatter } from "./getMdKitYjsFrontMatter";

export type MdKitMarkdownYjsOptions = {
  fragmentName?: string;
  ignoreYamlFrontMatter?: boolean;
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
  const fragmentName = getMdKitYjsFragmentName(options);
  const fragment = ydoc.getXmlFragment(fragmentName);

  const { map: metadata, key: metadataKey } = getMdKitFrontMatterField(
    ydoc,
    fragmentName,
  );

  const schema = createMdKitProseMirrorSchema();

  const frontMatter = options?.ignoreYamlFrontMatter
    ? extractYamlFrontMatter(markdown)
    : null;

  const json = markdownToProseMirrorJson(frontMatter?.body ?? markdown);

  prosemirrorJSONToYXmlFragment(schema, json, fragment);

  if (frontMatter?.frontMatter) {
    metadata.set(metadataKey, frontMatter.frontMatter.raw);
  } else {
    metadata.delete(metadataKey);
  }

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

  const fragmentName = getMdKitYjsFragmentName(options);

  const json = yXmlFragmentToProsemirrorJSON(ydoc.getXmlFragment(fragmentName));

  const frontMatterRaw = getMdKitYjsFrontMatter(ydoc, fragmentName);

  return prependYamlFrontMatter(
    frontMatterRaw,
    proseMirrorJsonToMarkdown(json),
  );
};

export const yjs = {
  markdownToMdKitYjs,
  mdKitYjsToMarkdown,
  replaceMdKitYjsMarkdown,
};
