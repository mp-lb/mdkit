import { describe, expect, it } from "vitest";
import {
  filterMdKitReferenceTargets,
  formatMarkdownReferenceLink,
} from "./markdownReferences";

describe("markdownReferences", () => {
  it("formats reference targets as markdown links", () => {
    expect(
      formatMarkdownReferenceLink({
        label: "notes] draft.md",
        url: "https://dx.ink/file\\abc)",
      }),
    ).toBe("[notes\\] draft.md](https://dx.ink/file\\\\abc\\))");
  });

  it("filters targets by label, description, or type", () => {
    const targets = [
      {
        description: "/docs/plan.md",
        id: "plan",
        label: "Plan",
        type: "file",
        url: "https://dx.ink/plan",
      },
      {
        description: "/ops/runbook.md",
        id: "runbook",
        label: "Runbook",
        type: "file",
        url: "https://dx.ink/runbook",
      },
    ];

    expect(filterMdKitReferenceTargets(targets, "ops")).toEqual([targets[1]]);
    expect(filterMdKitReferenceTargets(targets, "file")).toEqual(targets);
  });
});
