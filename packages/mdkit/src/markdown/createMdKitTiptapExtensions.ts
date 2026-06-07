import type { Extensions } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  defaultMdKitLowlight,
  type MdKitSyntaxHighlightingOptions,
} from "./codeThemes";
import { MarkdownPasteExtension } from "./MarkdownPasteExtension";
import { MarkdownSearchExtension } from "./MarkdownSearchExtension";

type CreateMdKitTiptapExtensionsOptions = {
  placeholder?: string;
  syntaxHighlighting?: boolean | MdKitSyntaxHighlightingOptions;
  undoRedo?: boolean;
};

export const defaultMdKitMarkdownPlaceholder = "Start writing...";

export const createMdKitTiptapExtensions = ({
  placeholder = defaultMdKitMarkdownPlaceholder,
  syntaxHighlighting = true,
  undoRedo = true,
}: CreateMdKitTiptapExtensionsOptions = {}): Extensions => [
  StarterKit.configure({
    codeBlock: syntaxHighlighting ? false : undefined,
    heading: { levels: [1, 2, 3, 4, 5, 6] },
    link: {
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
      autolink: true,
      linkOnPaste: true,
      openOnClick: true,
    },
    undoRedo: undoRedo ? undefined : false,
  }),
  ...(syntaxHighlighting
    ? [
        CodeBlockLowlight.configure({
          defaultLanguage:
            typeof syntaxHighlighting === "object"
              ? syntaxHighlighting.defaultLanguage
              : undefined,
          enableTabIndentation:
            typeof syntaxHighlighting === "object"
              ? syntaxHighlighting.enableTabIndentation
              : undefined,
          lowlight:
            typeof syntaxHighlighting === "object" &&
            syntaxHighlighting.lowlight
              ? syntaxHighlighting.lowlight
              : defaultMdKitLowlight,
          tabSize:
            typeof syntaxHighlighting === "object"
              ? syntaxHighlighting.tabSize
              : undefined,
        }),
      ]
    : []),
  Placeholder.configure({
    placeholder,
  }),
  Markdown.configure({
    markedOptions: {
      gfm: true,
    },
  }),
  MarkdownPasteExtension,
  MarkdownSearchExtension,
];
