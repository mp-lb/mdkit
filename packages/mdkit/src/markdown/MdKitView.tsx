import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { joinClassNames } from "../ui/joinClassNames";

export type MdKitViewProps = {
  className?: string;
  fillHeight?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  value: string;
};

export const MdKitView = ({
  className,
  fillHeight = false,
  placeholder,
  style,
  value,
}: MdKitViewProps) => {
  const renderedValue = value.trim().length > 0 ? value : (placeholder ?? "");

  return (
    <div
      className={joinClassNames(
        "mp-lb-mdkit-markdown-editor",
        "mp-lb-mdkit-markdown-view",
        fillHeight && "mp-lb-mdkit-markdown-editor-fill-height",
        className,
      )}
      data-read-only="true"
      style={style}
    >
      <div className="mp-lb-mdkit-editor-shell">
        <div className="mp-lb-mdkit-editor-surface">
          {renderedValue.length > 0 ? (
            <div className="mp-lb-mdkit-tiptap mp-lb-mdkit-view-content">
              <ReactMarkdown
                components={{
                  a: ({ children, ...linkProps }) => (
                    <a
                      {...linkProps}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {children}
                    </a>
                  ),
                }}
                remarkPlugins={[remarkGfm]}
              >
                {renderedValue}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="mp-lb-mdkit-editor-empty" />
          )}
        </div>
      </div>
    </div>
  );
};
