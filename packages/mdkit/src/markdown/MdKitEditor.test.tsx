import { useState } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as Y from "yjs";
import type { MdKitCollaborationSession } from "../document/documentTypes";
import { replaceMdKitYjsMarkdown } from "../yjs/MdKitMarkdownYjs";
import { MdKitEditor } from "./MdKitEditor";

const firstMarkdown = "# Stored document\n\nOriginal paragraph.";
const restoredMarkdown = "# Restored document\n\n- first\n- second";

const TestHarness = () => {
  const [value, setValue] = useState(firstMarkdown);
  const [revision, setRevision] = useState(0);

  const coldRestore = () => {
    setValue(restoredMarkdown);
    setRevision((current) => current + 1);
  };

  return (
    <div>
      <button type="button" onClick={() => setValue(restoredMarkdown)}>
        Replace from storage
      </button>
      <button type="button" onClick={coldRestore}>
        Cold restore
      </button>
      <MdKitEditor instanceKey={revision} value={value} onChange={setValue} />
    </div>
  );
};

const editorText = (container: HTMLElement) => {
  const editor = container.querySelector(".ProseMirror");

  if (!(editor instanceof HTMLElement)) {
    throw new Error("Expected TipTap to render a ProseMirror editor.");
  }

  return editor.textContent ?? "";
};

const createCollaborationSession = (
  markdown: string,
): MdKitCollaborationSession => {
  const document = new Y.Doc();

  replaceMdKitYjsMarkdown(document, markdown);

  return {
    collaborator: {
      color: "hsl(220, 85%, 55%)",
      id: "user-1",
      name: "User 1",
    },
    document,
    isCollaborating: false,
    otherParticipants: [],
    participants: [],
    provider: null,
    roomName: "test-room",
    status: "connected",
  };
};

describe("MdKitEditor", () => {
  it("marks the editor as full-height when requested", async () => {
    const { container } = render(
      <MdKitEditor fillHeight value={firstMarkdown} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(
        container.querySelector(".mp-lb-mdkit-markdown-editor-fill-height"),
      ).toBeTruthy();

      expect(editorText(container)).toContain("Stored document");
    });
  });

  it("keeps the editor root full-width without fill-height", async () => {
    const css = readFileSync(resolve(__dirname, "../styles.css"), "utf8");

    expect(css).toMatch(/\.mp-lb-mdkit-markdown-editor\s*{[^}]*width:\s*100%;/);
  });

  it("can render the editor as read-only", async () => {
    const { container } = render(
      <MdKitEditor readOnly value="Read-only document" onChange={() => {}} />,
    );

    const editor = await waitFor(() => {
      const element = container.querySelector(".ProseMirror");

      if (!(element instanceof HTMLElement)) {
        throw new Error("Expected TipTap to render a ProseMirror editor.");
      }

      return element;
    });

    expect(editor.getAttribute("contenteditable")).toBe("false");
    expect(
      container
        .querySelector(".mp-lb-mdkit-markdown-editor")
        ?.getAttribute("data-read-only"),
    ).toBe("true");
  });

  it("hydrates and restores from serialized markdown values", async () => {
    const { container } = render(<TestHarness />);

    await waitFor(() => {
      expect(editorText(container)).toContain("Stored document");
      expect(editorText(container)).toContain("Original paragraph.");
    });

    await act(async () => {
      screen.getByRole("button", { name: "Replace from storage" }).click();
    });

    await waitFor(() => {
      expect(editorText(container)).toContain("Restored document");
      expect(editorText(container)).toContain("first");
      expect(editorText(container)).toContain("second");
    });

    await act(async () => {
      screen.getByRole("button", { name: "Cold restore" }).click();
    });

    await waitFor(() => {
      expect(editorText(container)).toContain("Restored document");
      expect(editorText(container)).toContain("first");
      expect(editorText(container)).toContain("second");
    });
  });

  it("hydrates middle blank-line runs as visible empty editor paragraphs", async () => {
    const markdown =
      "Before paragraph.\n\nWhitespace probe:\n\n\n\n\nAfter paragraph.";

    const { container } = render(
      <MdKitEditor value={markdown} onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(editorText(container)).toContain("Whitespace probe:");
      expect(editorText(container)).toContain("After paragraph.");
    });

    const paragraphs = Array.from(container.querySelectorAll(".ProseMirror p"));

    const whitespaceParagraphIndex = paragraphs.findIndex(
      (paragraph) => paragraph.textContent === "Whitespace probe:",
    );

    const afterParagraphIndex = paragraphs.findIndex(
      (paragraph) => paragraph.textContent === "After paragraph.",
    );

    expect(whitespaceParagraphIndex).toBeGreaterThanOrEqual(0);
    expect(afterParagraphIndex).toBeGreaterThan(whitespaceParagraphIndex);
    expect(afterParagraphIndex - whitespaceParagraphIndex).toBeGreaterThan(1);
  });

  it("renders YAML front matter into the editor body by default", async () => {
    const { container } = render(
      <MdKitEditor value={'---\nkey: ["value"]\n---\n\n# Title'} />,
    );

    await waitFor(() => {
      expect(editorText(container)).toContain('key: ["value"]');
      expect(editorText(container)).toContain("Title");
    });
  });

  it("can ignore YAML front matter in the editor body", async () => {
    const { container } = render(
      <MdKitEditor
        ignoreYamlFrontMatter
        value={'---\nkey: ["value"]\n---\n\n# Title'}
      />,
    );

    await waitFor(() => {
      expect(editorText(container)).not.toContain('key: ["value"]');
      expect(editorText(container)).toContain("Title");
    });
  });

  it("keeps the same editor instance when controlled value changes", async () => {
    const { container, rerender } = render(
      <MdKitEditor value="one" onChange={() => {}} />,
    );

    const editor = await waitFor(() => {
      const element = container.querySelector(".ProseMirror");

      if (!(element instanceof HTMLElement)) {
        throw new Error("Expected TipTap to render a ProseMirror editor.");
      }

      return element;
    });

    rerender(<MdKitEditor value="one two" onChange={() => {}} />);

    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).toBe(editor);
      expect(editorText(container)).toContain("one two");
    });
  });

  it("does not apply controlled value changes into a collaborative document", async () => {
    const collaboration = createCollaborationSession(
      "# Shared document\n\nYjs owns this content.",
    );
    const onChange = vi.fn();

    const { container, rerender } = render(
      <MdKitEditor
        collaboration={collaboration}
        value="# Shared document\n\nYjs owns this content."
        onChange={onChange}
      />,
    );

    await waitFor(() => {
      expect(editorText(container)).toContain("Shared document");
      expect(editorText(container)).toContain("Yjs owns this content.");
    });

    rerender(
      <MdKitEditor
        collaboration={collaboration}
        value="# Late storage snapshot\n\nThis must not be inserted."
        onChange={onChange}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).toBeTruthy();
    });

    expect(editorText(container)).toContain("Shared document");
    expect(editorText(container)).toContain("Yjs owns this content.");
    expect(editorText(container)).not.toContain("Late storage snapshot");
    expect(editorText(container)).not.toContain("This must not be inserted.");
  });

  it("focuses the editor when the fill-height background is clicked", async () => {
    const onFocusChange = vi.fn();

    const { container } = render(
      <MdKitEditor
        fillHeight
        value=""
        onChange={() => {}}
        onFocusChange={onFocusChange}
      />,
    );

    const surface = await waitFor(() => {
      const element = container.querySelector(".mp-lb-mdkit-editor-surface");

      if (!(element instanceof HTMLElement)) {
        throw new Error("Expected editor surface to render.");
      }

      return element;
    });

    const editor = container.querySelector(".ProseMirror");

    if (!(editor instanceof HTMLElement)) {
      throw new Error("Expected TipTap to render a ProseMirror editor.");
    }

    fireEvent.pointerDown(surface);
    fireEvent.pointerUp(surface);
    fireEvent.click(surface);

    await waitFor(() => {
      expect(document.activeElement).toBe(editor);
      expect(onFocusChange).toHaveBeenCalledWith(true);
    });
  });

  it("blurs the editor when non-focusable page chrome is clicked", async () => {
    const onFocusChange = vi.fn();

    const { container } = render(
      <div>
        <div data-testid="page-chrome" />
        <MdKitEditor
          value="Text that can be selected"
          onChange={() => {}}
          onFocusChange={onFocusChange}
        />
      </div>,
    );

    const editor = await waitFor(() => {
      const element = container.querySelector(".ProseMirror");

      if (!(element instanceof HTMLElement)) {
        throw new Error("Expected TipTap to render a ProseMirror editor.");
      }

      return element;
    });

    await act(async () => {
      editor.focus();
    });

    await waitFor(() => {
      expect(onFocusChange).toHaveBeenCalledWith(true);
    });

    fireEvent.pointerDown(screen.getByTestId("page-chrome"));

    await waitFor(() => {
      expect(onFocusChange).toHaveBeenCalledWith(false);
    });
  });

  it("does not install document search by default", async () => {
    const { container } = render(
      <MdKitEditor value="Findable text" onChange={() => {}} />,
    );

    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).toBeTruthy();
    });

    await act(async () => {
      const editor = container.querySelector(".ProseMirror");

      if (!(editor instanceof HTMLElement)) {
        throw new Error("Expected TipTap to render a ProseMirror editor.");
      }

      editor.focus();
    });

    fireEvent.keyDown(document, { ctrlKey: true, key: "f" });

    expect(screen.queryByRole("searchbox", { name: "Search document" })).toBe(
      null,
    );
  });

  it("opens optional document search from the find shortcut", async () => {
    const { container } = render(
      <MdKitEditor
        search
        value="First paragraph. Second paragraph."
        onChange={() => {}}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector(".ProseMirror")).toBeTruthy();
    });

    await act(async () => {
      const editor = container.querySelector(".ProseMirror");

      if (!(editor instanceof HTMLElement)) {
        throw new Error("Expected TipTap to render a ProseMirror editor.");
      }

      editor.focus();
    });

    fireEvent.keyDown(document, { metaKey: true, key: "f" });

    const searchInput = await screen.findByRole("searchbox", {
      name: "Search document",
    });

    fireEvent.change(searchInput, { target: { value: "paragraph" } });

    await waitFor(() => {
      expect(screen.getByText("1 of 2")).toBeTruthy();
      expect(document.activeElement).toBe(searchInput);
      expect(
        container.querySelector(".mp-lb-mdkit-search-match-active")
          ?.textContent,
      ).toBe("paragraph");
    });

    fireEvent.click(screen.getByRole("button", { name: "Next match" }));

    await waitFor(() => {
      expect(screen.getByText("2 of 2")).toBeTruthy();
    });
  });
});
