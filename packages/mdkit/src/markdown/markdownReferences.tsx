import type { CSSProperties, ReactNode } from "react";
import type { Editor } from "@tiptap/react";

export type MdKitReferenceTarget = {
  description?: string;
  id: string;
  label: string;
  type?: string;
  url: string;
};

export type MdKitReferenceTrigger = "@" | "/";

export type MdKitReferenceTriggerState = {
  from: number;
  query: string;
  to: number;
  trigger: MdKitReferenceTrigger;
};

export type MdKitReferenceSuggestionPlacement = "top" | "bottom";

export type MdKitReferenceSuggestionsRenderProps = {
  activeIndex: number;
  isLoading: boolean;
  placement: MdKitReferenceSuggestionPlacement;
  query: string;
  selectedTarget: MdKitReferenceTarget | null;
  style: CSSProperties;
  targets: MdKitReferenceTarget[];
  trigger: MdKitReferenceTrigger;
  onSelect: (target: MdKitReferenceTarget) => void;
};

export type MdKitReferencesOptions = {
  enabled?: boolean;
  onSearchTargets?: (
    query: string,
    trigger: MdKitReferenceTrigger,
  ) => MdKitReferenceTarget[] | Promise<MdKitReferenceTarget[]>;
  renderSuggestions?: (
    props: MdKitReferenceSuggestionsRenderProps,
  ) => ReactNode;
  targets?: MdKitReferenceTarget[];
  triggers?: MdKitReferenceTrigger[];
};

export const defaultMdKitReferenceTriggers: MdKitReferenceTrigger[] = ["@"];

const escapeMarkdownLinkLabel = (label: string) =>
  label.replace(/\\/g, "\\\\").replace(/\]/g, "\\]");

const escapeMarkdownLinkDestination = (url: string) =>
  url.replace(/\\/g, "\\\\").replace(/\)/g, "\\)");

export const formatMarkdownReferenceLink = ({
  label,
  url,
}: Pick<MdKitReferenceTarget, "label" | "url">) =>
  `[${escapeMarkdownLinkLabel(label)}](${escapeMarkdownLinkDestination(url)})`;

const regexEscape = (value: string) =>
  value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");

export const getActiveReferenceTriggerFromEditor = (
  editor: Editor,
  triggers: readonly MdKitReferenceTrigger[] = defaultMdKitReferenceTriggers,
): MdKitReferenceTriggerState | null => {
  if (!editor.state.selection.empty || triggers.length === 0) {
    return null;
  }

  const { from } = editor.state.selection;
  const beforeCursor = editor.state.doc.textBetween(
    Math.max(0, from - 80),
    from,
    "\n",
    "\n",
  );

  const triggerPattern = triggers.map(regexEscape).join("");
  const tokenMatch = new RegExp(
    `(^|[\\s([{])([${triggerPattern}])([^\\s${triggerPattern}]*)$`,
  ).exec(beforeCursor);

  if (!tokenMatch) {
    return null;
  }

  const prefix = tokenMatch[1] ?? "";
  const trigger = tokenMatch[2] as MdKitReferenceTrigger;
  const query = tokenMatch[3] ?? "";
  const tokenLength = trigger.length + query.length;

  if (
    trigger === "/" &&
    prefix !== "" &&
    beforeCursor.slice(0, tokenMatch.index + prefix.length).trim()
  ) {
    return null;
  }

  return {
    from: from - tokenLength,
    query,
    to: from,
    trigger,
  };
};

export const filterMdKitReferenceTargets = (
  targets: readonly MdKitReferenceTarget[],
  query: string,
) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return [...targets];
  }

  return targets.filter((target) =>
    [target.label, target.description, target.type]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
};

export const defaultRenderMdKitReferenceSuggestions = ({
  activeIndex,
  isLoading,
  style,
  targets,
  onSelect,
}: MdKitReferenceSuggestionsRenderProps) => (
  <div
    aria-label="Reference suggestions"
    className="mp-lb-mdkit-reference-suggestions"
    role="listbox"
    style={style}
  >
    <div className="mp-lb-mdkit-reference-suggestions-scroll">
      {targets.length === 0 ? (
        <div className="mp-lb-mdkit-reference-suggestions-empty">
          {isLoading ? "Searching..." : "No references"}
        </div>
      ) : (
        targets.map((target, index) => {
          const selected = index === activeIndex;

          return (
            <button
              aria-selected={selected}
              className={
                selected
                  ? "mp-lb-mdkit-reference-suggestion mp-lb-mdkit-reference-suggestion-active"
                  : "mp-lb-mdkit-reference-suggestion"
              }
              key={target.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(target)}
              role="option"
              type="button"
            >
              <span className="mp-lb-mdkit-reference-suggestion-main">
                <span className="mp-lb-mdkit-reference-suggestion-label">
                  {target.label}
                </span>
                {target.type ? (
                  <span className="mp-lb-mdkit-reference-suggestion-type">
                    {target.type}
                  </span>
                ) : null}
              </span>
              {target.description ? (
                <span className="mp-lb-mdkit-reference-suggestion-description">
                  {target.description}
                </span>
              ) : null}
            </button>
          );
        })
      )}
    </div>
  </div>
);
