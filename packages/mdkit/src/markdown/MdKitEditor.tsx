import type { CSSProperties } from "react";
import type { MdKitCollaborationSession } from "../document/documentTypes";
import { joinClassNames } from "../ui/joinClassNames";
import type { MdKitEditorDebugEvent } from "./editorDebug";
import type { MdKitReferencesOptions } from "./markdownReferences";
import { TiptapMarkdownSurface } from "./TiptapMarkdownSurface";

type MdKitEditorBaseProps = {
  className?: string;
  documentMargins?: boolean;
  fillHeight?: boolean;
  fixedWidth?: boolean;
  ignoreYamlFrontMatter?: boolean;
  instanceKey?: string | number;
  onDebugEvent?: (event: MdKitEditorDebugEvent) => void;
  onFocusChange?: (focused: boolean) => void;
  readOnly?: boolean;
  references?: MdKitReferencesOptions;
  search?: boolean;
  style?: CSSProperties;
};

type LocalMdKitEditorProps = MdKitEditorBaseProps & {
  collaboration?: null;
  onChange?: (markdown: string) => void;
  value: string;
};

type CollaborativeMdKitEditorProps = MdKitEditorBaseProps & {
  collaboration: MdKitCollaborationSession;
  onChange?: (markdown: string) => void;
  value?: string;
};

export type MdKitEditorProps =
  | CollaborativeMdKitEditorProps
  | LocalMdKitEditorProps;

/**
 * Markdown-first rich text editor. Behaves like a controlled textarea in local
 * mode and switches to a Yjs-backed engine when given a collaboration session.
 *
 * @remarks
 * In collaborative mode the Yjs document is the content source; external
 * `value` changes are not applied into the shared document.
 */
export const MdKitEditor = (props: MdKitEditorProps) => {
  const {
    className,
    documentMargins = false,
    fillHeight = false,
    fixedWidth = false,
    readOnly = false,
    style,
    ...surfaceProps
  } = props;

  return (
    <div
      className={joinClassNames(
        "mp-lb-mdkit-markdown-editor",
        documentMargins && "mp-lb-mdkit-markdown-editor-document-margins",
        fillHeight && "mp-lb-mdkit-markdown-editor-fill-height",
        fixedWidth && "mp-lb-mdkit-markdown-editor-fixed-width",
        className,
      )}
      data-read-only={readOnly ? "true" : undefined}
      style={style}
    >
      <TiptapMarkdownSurface
        key={props.instanceKey}
        readOnly={readOnly}
        {...surfaceProps}
      />
    </div>
  );
};
