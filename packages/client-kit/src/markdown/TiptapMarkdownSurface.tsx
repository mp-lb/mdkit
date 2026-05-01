import { useEffect, useMemo, useRef, type PointerEvent } from "react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { MdKitCollaborationSession } from "../document/documentTypes";
import type { MdKitEditorDebugEvent } from "./editorDebug";
import { MarkdownBubbleMenu } from "./MarkdownBubbleMenu";
import { normalizeMarkdownSerialization } from "./normalizeMarkdownSerialization";
import { prepareMarkdownForEditorHydration } from "./prepareMarkdownForEditorHydration";

type LocalTiptapMarkdownSurfaceProps = {
  collaboration?: null;
  onChange?: (markdown: string) => void;
  onDebugEvent?: (event: MdKitEditorDebugEvent) => void;
  onFocusChange?: (focused: boolean) => void;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
};

type CollaborativeTiptapMarkdownSurfaceProps = {
  collaboration: MdKitCollaborationSession;
  onChange?: (markdown: string) => void;
  onDebugEvent?: (event: MdKitEditorDebugEvent) => void;
  onFocusChange?: (focused: boolean) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
};

type TiptapMarkdownSurfaceProps =
  | CollaborativeTiptapMarkdownSurfaceProps
  | LocalTiptapMarkdownSurfaceProps;

type TiptapEditor = NonNullable<ReturnType<typeof useEditor>>;

const describeElement = (element: Element) => {
  const classes =
    element instanceof HTMLElement && element.className
      ? `.${String(element.className).trim().replace(/\s+/g, ".")}`
      : "";

  return `${element.tagName.toLowerCase()}${classes}`;
};

const describeEventTarget = (target: EventTarget | null) =>
  target instanceof Element ? describeElement(target) : String(target);

const isInteractiveElement = (target: Element) =>
  !!target.closest("a,button,input,select,textarea,[contenteditable='false']");

const createEditorDebugSnapshot = (editor: TiptapEditor, phase: string) => {
  const activeElement =
    typeof document === "undefined" || !document.activeElement
      ? null
      : describeElement(document.activeElement);

  const browserSelection =
    typeof window === "undefined" ? null : window.getSelection();

  let editorIsFocused: boolean | null = null;
  let selectionAnchor: number | null = null;
  let selectionEmpty: boolean | null = null;
  let selectionFrom: number | null = null;
  let selectionHead: number | null = null;
  let selectionTo: number | null = null;
  let viewHasFocus: boolean | null = null;
  let viewUnavailable = false;

  try {
    editorIsFocused = editor.isFocused;
    selectionAnchor = editor.state.selection.anchor;
    selectionEmpty = editor.state.selection.empty;
    selectionFrom = editor.state.selection.from;
    selectionHead = editor.state.selection.head;
    selectionTo = editor.state.selection.to;
    viewHasFocus = editor.view.hasFocus();
  } catch {
    viewUnavailable = true;
  }

  return {
    activeElement,
    browserSelectionAnchorNode:
      browserSelection?.anchorNode instanceof Element
        ? describeElement(browserSelection.anchorNode)
        : (browserSelection?.anchorNode?.nodeName ?? null),
    browserSelectionAnchorOffset: browserSelection?.anchorOffset ?? null,
    editorIsFocused,
    phase,
    selectionAnchor,
    selectionEmpty,
    selectionFrom,
    selectionHead,
    selectionTo,
    viewHasFocus,
    viewUnavailable,
  };
};

export const TiptapMarkdownSurface = (props: TiptapMarkdownSurfaceProps) => {
  const {
    collaboration = null,
    onDebugEvent,
    onFocusChange,
    placeholder = "Start writing...",
    readOnly = false,
  } = props;

  const markdownValue =
    "value" in props && typeof props.value === "string" ? props.value : "";

  const editorSurfaceRef = useRef<HTMLDivElement>(null);
  const onDebugEventRef = useRef(onDebugEvent);
  const onFocusChangeRef = useRef(onFocusChange);
  const onChangeRef = useRef(props.onChange);
  const currentMarkdownRef = useRef(markdownValue);
  const isApplyingExternalValueRef = useRef(false);
  const pendingControlledEchoesRef = useRef<Set<string>>(new Set());

  const pendingContentFocusRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);

  const shouldFocusAfterPointerRef = useRef(false);
  const collaborationDocument = collaboration?.document ?? null;
  const collaborationProvider = collaboration?.provider ?? null;
  const collaborationUserColor = collaboration?.collaborator.color ?? "";
  const collaborationUserName = collaboration?.collaborator.name ?? "";
  const hasCollaboration = !!collaborationDocument;

  useEffect(() => {
    onDebugEventRef.current = onDebugEvent;
  }, [onDebugEvent]);

  useEffect(() => {
    onFocusChangeRef.current = onFocusChange;
  }, [onFocusChange]);

  useEffect(() => {
    onChangeRef.current = props.onChange;
  }, [props.onChange]);

  const collaborationCaretExtensions = useMemo(
    () =>
      collaborationProvider
        ? [
            CollaborationCaret.configure({
              provider: collaborationProvider,
              render: (user) => {
                const cursor = document.createElement("span");
                cursor.classList.add("hsk-collaboration-caret");
                cursor.style.borderColor = user.color;

                const label = document.createElement("div");
                label.classList.add("hsk-collaboration-caret-label");
                label.style.backgroundColor = user.color;
                label.textContent = user.name;
                cursor.appendChild(label);

                return cursor;
              },
              selectionRender: (user) => ({
                style: `background-color: ${user.color}20`,
              }),
              user: {
                color: collaborationUserColor,
                name: collaborationUserName,
              },
            }),
          ]
        : [],
    [collaborationProvider, collaborationUserColor, collaborationUserName],
  );

  const editor = useEditor(
    {
      content: hasCollaboration
        ? undefined
        : prepareMarkdownForEditorHydration(markdownValue),
      contentType: "markdown",
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: "hsk-tiptap",
          spellcheck: "false",
        },
      },
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2] },
          link: {
            HTMLAttributes: {
              rel: "noopener noreferrer",
              target: "_blank",
            },
            autolink: true,
            linkOnPaste: true,
            openOnClick: true,
          },
          undoRedo: hasCollaboration ? false : undefined,
        }),
        Placeholder.configure({
          placeholder,
        }),
        Markdown.configure({
          markedOptions: {
            gfm: true,
          },
        }),
        ...(collaborationDocument
          ? [
              Collaboration.configure({
                document: collaborationDocument,
              }),
              ...collaborationCaretExtensions,
            ]
          : []),
      ],
      onBlur: ({ editor: blurredEditor }) => {
        onDebugEventRef.current?.({
          detail: createEditorDebugSnapshot(blurredEditor, "blur"),
          timestamp: Date.now(),
          type: "editor-blur",
        });

        onFocusChangeRef.current?.(false);
      },
      onFocus: ({ editor: focusedEditor }) => {
        onDebugEventRef.current?.({
          detail: createEditorDebugSnapshot(focusedEditor, "focus"),
          timestamp: Date.now(),
          type: "editor-focus",
        });

        onFocusChangeRef.current?.(true);
      },
      onUpdate: ({ editor: updatedEditor }) => {
        if (isApplyingExternalValueRef.current) {
          return;
        }

        const nextSerializedMarkdown = normalizeMarkdownSerialization(
          updatedEditor.getMarkdown(),
        );

        const previousMarkdown = currentMarkdownRef.current;
        const nextMarkdown = nextSerializedMarkdown;

        currentMarkdownRef.current = nextMarkdown;

        if (nextMarkdown !== previousMarkdown) {
          pendingControlledEchoesRef.current.add(nextMarkdown);
          onChangeRef.current?.(nextMarkdown);
        }
      },
    },
    [
      collaborationCaretExtensions,
      collaborationDocument,
      hasCollaboration,
      placeholder,
    ],
  );

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (markdownValue === currentMarkdownRef.current) {
      pendingControlledEchoesRef.current.clear();
      return;
    }

    if (pendingControlledEchoesRef.current.has(markdownValue)) {
      pendingControlledEchoesRef.current.delete(markdownValue);
      return;
    }

    pendingControlledEchoesRef.current.clear();
    isApplyingExternalValueRef.current = true;
    editor.commands.setContent(
      prepareMarkdownForEditorHydration(markdownValue),
      {
        contentType: "markdown",
        emitUpdate: false,
      },
    );

    currentMarkdownRef.current = markdownValue;

    window.queueMicrotask(() => {
      isApplyingExternalValueRef.current = false;
    });
  }, [editor, markdownValue]);

  if (!editor) {
    return (
      <div className="hsk-editor-shell">
        <div className="hsk-editor-empty">
          {collaboration
            ? "Connecting collaboration session..."
            : "Loading editor..."}
        </div>
      </div>
    );
  }

  const getProseMirrorElement = () =>
    editorSurfaceRef.current?.querySelector(
      ".ProseMirror",
    ) as HTMLElement | null;

  const clampEditorPosition = (position: number) =>
    Math.max(0, Math.min(position, editor.state.doc.content.size));

  const getEditorBackgroundPositionAtClientPoint = (
    proseMirror: HTMLElement,
    clientY: number,
  ) => {
    const blockElements = Array.from(proseMirror.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    if (blockElements.length === 0) {
      return null;
    }

    for (let index = 0; index < blockElements.length; index += 1) {
      const block = blockElements[index];
      const rect = block.getBoundingClientRect();

      if (clientY <= rect.bottom) {
        if (clientY >= rect.top) {
          return null;
        }

        const previousBlock = blockElements[index - 1];

        if (previousBlock) {
          const previousRect = previousBlock.getBoundingClientRect();
          const distanceFromPrevious = Math.abs(clientY - previousRect.bottom);
          const distanceFromNext = Math.abs(rect.top - clientY);

          if (distanceFromPrevious <= distanceFromNext) {
            return editor.view.posAtDOM(
              previousBlock,
              previousBlock.childNodes.length,
            );
          }
        }

        return editor.view.posAtDOM(block, 0);
      }
    }

    const lastBlock = blockElements[blockElements.length - 1];

    return editor.view.posAtDOM(lastBlock, lastBlock.childNodes.length);
  };

  const getEditorPositionAtClientPoint = (
    clientX: number,
    clientY: number,
    target: EventTarget | null,
  ) => {
    const proseMirror = getProseMirrorElement();

    const targetIsEditorBackground =
      proseMirror &&
      target instanceof Element &&
      (target === proseMirror || !proseMirror.contains(target));

    if (proseMirror && targetIsEditorBackground) {
      const backgroundPosition = getEditorBackgroundPositionAtClientPoint(
        proseMirror,
        clientY,
      );

      if (typeof backgroundPosition === "number") {
        return clampEditorPosition(backgroundPosition);
      }
    }

    let coordinatePosition: number | undefined;

    try {
      coordinatePosition = editor.view.posAtCoords({
        left: clientX,
        top: clientY,
      })?.pos;
    } catch {
      coordinatePosition = undefined;
    }

    if (typeof coordinatePosition !== "number") {
      return editor.state.doc.content.size;
    }

    return clampEditorPosition(coordinatePosition);
  };

  const focusEditorAtPosition = (position: number) => {
    if (editor.isDestroyed || readOnly) {
      return;
    }

    const { state, view } = editor;

    const nextPosition = Math.max(
      0,
      Math.min(position, state.doc.content.size),
    );

    try {
      emitDebugEvent("focus-at-position-before", {
        requestedPosition: nextPosition,
      });

      view.focus();
      editor.commands.setTextSelection(nextPosition);
      view.focus();
      emitDebugEvent("focus-at-position-after", {
        requestedPosition: nextPosition,
      });
    } catch {
      emitDebugEvent("focus-at-position-aborted", {
        requestedPosition: nextPosition,
      });
    }
  };

  const queueEditorFocusAtPosition = (position: number) => {
    emitDebugEvent("focus-queued", {
      pendingFromPointer: shouldFocusAfterPointerRef.current,
      requestedPosition: position,
    });

    window.setTimeout(() => {
      focusEditorAtPosition(position);

      window.requestAnimationFrame(() => {
        emitDebugEvent("focus-raf-run", {
          requestedPosition: position,
        });

        focusEditorAtPosition(position);
      });
    }, 0);
  };

  const emitDebugEvent = (type: string, detail: Record<string, unknown>) => {
    const event = {
      detail: {
        ...detail,
        ...createEditorDebugSnapshot(editor, type),
      },
      timestamp: Date.now(),
      type,
    };

    onDebugEventRef.current?.(event);
  };

  const shouldFocusEditorBackground = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      emitDebugEvent("hitbox-target-not-element", {
        targetType: typeof target,
      });

      return false;
    }

    const proseMirror = getProseMirrorElement();

    if (!proseMirror) {
      emitDebugEvent("hitbox-missing-prosemirror", {
        target: describeElement(target),
      });

      return false;
    }

    const targetIsInsideEditor = proseMirror.contains(target);

    const targetIsEmptyPlaceholder = !!target.closest(
      ".ProseMirror p.is-editor-empty",
    );

    const editorIsEmpty = editor.isEmpty;

    const shouldFocus =
      !isInteractiveElement(target) &&
      (target === proseMirror ||
        !targetIsInsideEditor ||
        targetIsEmptyPlaceholder ||
        (editorIsEmpty && targetIsInsideEditor));

    emitDebugEvent("hitbox-check", {
      editorIsEmpty,
      proseMirrorContainsTarget: targetIsInsideEditor,
      shouldFocus,
      target: describeElement(target),
      targetIsEmptyPlaceholder,
      targetIsProseMirror: target === proseMirror,
    });

    return shouldFocus;
  };

  const focusEditorBackgroundOnPointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const proseMirror = editorSurfaceRef.current?.querySelector(
      ".ProseMirror",
    ) as HTMLElement | null;

    const target = event.target;

    if (readOnly) {
      return;
    }

    if (
      proseMirror &&
      target instanceof Element &&
      proseMirror.contains(target) &&
      target !== proseMirror &&
      !editor.isFocused &&
      !editor.isEmpty &&
      !target.closest(".ProseMirror p.is-editor-empty") &&
      !isInteractiveElement(target)
    ) {
      pendingContentFocusRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };

      emitDebugEvent("content-pointer-focus-pending", {
        pointerType: event.pointerType,
        target: describeElement(target),
      });

      return;
    }

    if (!shouldFocusEditorBackground(event.target)) {
      return;
    }

    const requestedPosition = getEditorPositionAtClientPoint(
      event.clientX,
      event.clientY,
      event.target,
    );

    event.preventDefault();
    shouldFocusAfterPointerRef.current = false;
    emitDebugEvent("hitbox-pointer-down", {
      defaultPrevented: event.defaultPrevented,
      pointerType: event.pointerType,
      requestedPosition,
      target: describeEventTarget(event.target),
    });

    queueEditorFocusAtPosition(requestedPosition);
  };

  const focusEditorBackgroundOnPointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const pendingContentFocus = pendingContentFocusRef.current;

    if (readOnly) {
      pendingContentFocusRef.current = null;
      shouldFocusAfterPointerRef.current = false;
      return;
    }

    if (
      pendingContentFocus &&
      pendingContentFocus.pointerId === event.pointerId
    ) {
      pendingContentFocusRef.current = null;

      const moved = Math.hypot(
        event.clientX - pendingContentFocus.x,
        event.clientY - pendingContentFocus.y,
      );

      emitDebugEvent("content-pointer-focus-resolve", {
        moved,
        pointerType: event.pointerType,
      });

      if (moved < 4 && !editor.isFocused) {
        editor.view.focus();
      }

      return;
    }

    if (!shouldFocusAfterPointerRef.current) {
      return;
    }

    event.preventDefault();
    shouldFocusAfterPointerRef.current = false;
    emitDebugEvent("hitbox-pointer-up", {
      defaultPrevented: event.defaultPrevented,
      pointerType: event.pointerType,
      target: describeEventTarget(event.target),
    });

    queueEditorFocusAtPosition(
      getEditorPositionAtClientPoint(
        event.clientX,
        event.clientY,
        event.target,
      ),
    );
  };

  return (
    <div className="hsk-editor-shell">
      <div
        ref={editorSurfaceRef}
        className="hsk-editor-surface"
        onPointerDownCapture={focusEditorBackgroundOnPointerDown}
        onPointerUpCapture={focusEditorBackgroundOnPointerUp}
      >
        <MarkdownBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
