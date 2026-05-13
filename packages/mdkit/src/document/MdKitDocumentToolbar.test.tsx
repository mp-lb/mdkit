import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MdKitDocumentController } from "./useMdKitDocument";
import { MdKitDocumentToolbar } from "./MdKitDocumentToolbar";

const createDocumentController = (
  overrides: Partial<MdKitDocumentController> = {},
): MdKitDocumentController => ({
  conflict: false,
  conflictDetails: null,
  error: null,
  forceSave: vi.fn(async () => true),
  isDirty: false,
  isFocused: false,
  isLoading: false,
  resync: vi.fn(async () => undefined),
  revision: 0,
  saveNow: vi.fn(async () => true),
  saveStatus: "saved",
  setContent: vi.fn(),
  setFocused: vi.fn(),
  updatedAt: "2026-01-01T00:00:00.000Z",
  value: "Current markdown",
  version: 1,
  ...overrides,
});

describe("MdKitDocumentToolbar", () => {
  it("renders without versioning or collaboration", () => {
    render(<MdKitDocumentToolbar document={createDocumentController()} />);

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByText("Collaboration off")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Version 1" })).toBeDisabled();
  });

  it("does not call the version opener when versioning is absent", () => {
    const openVersionHistory = vi.fn();

    render(
      <MdKitDocumentToolbar
        document={createDocumentController()}
        onOpenVersionHistory={openVersionHistory}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Version 1" }));

    expect(openVersionHistory).not.toHaveBeenCalled();
  });
});
