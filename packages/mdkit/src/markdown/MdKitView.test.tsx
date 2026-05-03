import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MdKitView } from "./MdKitView";

describe("MdKitView", () => {
  it("renders markdown without a ProseMirror editor", () => {
    const { container } = render(
      <MdKitView
        value={"# Read-only document\n\n- first\n- second\n\n[Link](https://example.com)"}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Read-only document" }),
    ).toBeTruthy();
    expect(screen.getByText("first")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(container.querySelector(".ProseMirror")).toBeNull();
  });

  it("uses the editor shell classes and fill-height contract", () => {
    const { container } = render(
      <MdKitView
        className="custom-view"
        fillHeight
        style={{ minHeight: "12rem" }}
        value="Readonly"
      />,
    );

    const root = container.querySelector(".mp-lb-mdkit-markdown-editor");

    expect(root).toBeTruthy();
    expect(root).toHaveClass("mp-lb-mdkit-markdown-view");
    expect(root).toHaveClass("mp-lb-mdkit-markdown-editor-fill-height");
    expect(root).toHaveClass("custom-view");
    expect(root).toHaveAttribute("data-read-only", "true");
    expect(container.querySelector(".mp-lb-mdkit-editor-shell")).toBeTruthy();
    expect(container.querySelector(".mp-lb-mdkit-editor-surface")).toBeTruthy();
    expect(container.querySelector(".mp-lb-mdkit-tiptap")).toBeTruthy();
  });

  it("renders an empty surface when no value or placeholder is provided", () => {
    const { container } = render(<MdKitView value="" />);

    expect(container.querySelector(".mp-lb-mdkit-editor-empty")).toBeTruthy();
    expect(container.querySelector(".mp-lb-mdkit-tiptap")).toBeNull();
  });

  it("can render placeholder markdown for empty values", () => {
    render(<MdKitView placeholder="**No content yet.**" value="" />);

    expect(screen.getByText("No content yet.")).toBeTruthy();
  });
});
