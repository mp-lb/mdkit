import { describe, expect, it, vi } from "vitest";
import * as Y from "yjs";
import { markdownToMdKitYjs, mdKitYjsToMarkdown } from "./MdKitMarkdownYjs";
import { getMdKitYjsFrontMatter } from "./getMdKitYjsFrontMatter";
import { setMdKitYjsFrontMatter } from "./setMdKitYjsFrontMatter";
import { observeMdKitYjsFrontMatter } from "./observeMdKitYjsFrontMatter";
import { readMdKitYjsMarkdown } from "./readMdKitYjsMarkdown";

describe("collaborative frontmatter editing", () => {
  it("merges a header edit with a concurrent body edit and preserves YAML comments", () => {
    const first = new Y.Doc();
    Y.applyUpdate(
      first,
      markdownToMdKitYjs("---\nname: original\n---\n\nBody", {
        ignoreYamlFrontMatter: true,
      }),
    );

    const second = new Y.Doc();
    Y.applyUpdate(second, Y.encodeStateAsUpdate(first));

    const prefix =
      "---\n# Keep this comment\nname: changed\nextra: [one, two]\n---\n\n";

    setMdKitYjsFrontMatter(first, prefix);
    const paragraph = second.getXmlFragment("default").get(0) as Y.XmlElement;
    (paragraph.get(0) as Y.XmlText).insert(0, "Updated ");
    Y.applyUpdate(first, Y.encodeStateAsUpdate(second));
    Y.applyUpdate(second, Y.encodeStateAsUpdate(first));
    expect(mdKitYjsToMarkdown(Y.encodeStateAsUpdate(first))).toBe(
      `${prefix}Updated Body`,
    );

    expect(mdKitYjsToMarkdown(Y.encodeStateAsUpdate(second))).toBe(
      `${prefix}Updated Body`,
    );

    expect(readMdKitYjsMarkdown(second)).toBe(`${prefix}Updated Body`);
  });

  it("observes remote updates and removals independently of the body", () => {
    const first = new Y.Doc();
    const second = new Y.Doc();
    const listener = vi.fn();
    const stop = observeMdKitYjsFrontMatter(second, listener, "body");
    setMdKitYjsFrontMatter(first, "---\nname: one\n---\n", "body");
    Y.applyUpdate(second, Y.encodeStateAsUpdate(first));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getMdKitYjsFrontMatter(second, "body")).toContain("name: one");
    setMdKitYjsFrontMatter(first, "", "body");
    Y.applyUpdate(second, Y.encodeStateAsUpdate(first));
    expect(getMdKitYjsFrontMatter(second, "body")).toBe("");
    expect(listener).toHaveBeenCalledTimes(2);
    stop();
    setMdKitYjsFrontMatter(second, "---\nname: two\n---\n", "body");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("rejects malformed headers and document content without changing metadata", () => {
    const document = new Y.Doc();
    const prefix = "---\nname: original\n---\n";
    setMdKitYjsFrontMatter(document, prefix);

    for (const invalid of [
      "name: missing-delimiters",
      "---\nname: [\n---\n",
      `${prefix}Body`,
    ]) {
      expect(() => setMdKitYjsFrontMatter(document, invalid)).toThrow(
        "valid YAML",
      );

      expect(getMdKitYjsFrontMatter(document)).toBe(prefix);
    }
  });
});
