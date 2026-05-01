import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { joinClassNames } from "../ui/joinClassNames";

type MarkdownBubbleMenuProps = {
  editor: Editor;
};

const setLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes("link").href;
  const nextUrl = window.prompt("URL", previousUrl);

  if (nextUrl === null) {
    return;
  }

  if (nextUrl === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: nextUrl })
    .run();
};

const ToolbarButton = ({
  ariaLabel,
  children,
  isActive,
  onClick,
}: {
  ariaLabel: string;
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    className={joinClassNames(
      "hsk-toolbar-button",
      isActive && "hsk-toolbar-button-active",
    )}
    aria-label={ariaLabel}
    onClick={onClick}
    onMouseDown={(event) => event.preventDefault()}
  >
    {children}
  </button>
);

export const MarkdownBubbleMenu = ({ editor }: MarkdownBubbleMenuProps) => (
  <BubbleMenu
    appendTo={() => document.body}
    className="hsk-toolbar"
    editor={editor}
    options={{
      placement: "top",
      strategy: "fixed",
    }}
    shouldShow={({ editor: currentEditor, state }) => {
      const { empty } = state.selection;
      return currentEditor.isEditable && !empty;
    }}
  >
    <ToolbarButton
      ariaLabel="Bold"
      isActive={editor.isActive("bold")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Italic"
      isActive={editor.isActive("italic")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Strikethrough"
      isActive={editor.isActive("strike")}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Code block"
      isActive={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 />
    </ToolbarButton>
    <div className="hsk-toolbar-divider" />
    <ToolbarButton
      ariaLabel="Heading 1"
      isActive={editor.isActive("heading", { level: 1 })}
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <Heading1 />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Heading 2"
      isActive={editor.isActive("heading", { level: 2 })}
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading2 />
    </ToolbarButton>
    <div className="hsk-toolbar-divider" />
    <ToolbarButton
      ariaLabel="Bullet list"
      isActive={editor.isActive("bulletList")}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Ordered list"
      isActive={editor.isActive("orderedList")}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <ListOrdered />
    </ToolbarButton>
    <ToolbarButton
      ariaLabel="Blockquote"
      isActive={editor.isActive("blockquote")}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <Quote />
    </ToolbarButton>
    <div className="hsk-toolbar-divider" />
    <ToolbarButton
      ariaLabel="Link"
      isActive={editor.isActive("link")}
      onClick={() => setLink(editor)}
    >
      <Link2 />
    </ToolbarButton>
  </BubbleMenu>
);
