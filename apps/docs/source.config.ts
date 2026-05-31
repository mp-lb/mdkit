import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  // The published library docs live with the package, under docs/public — the
  // generated TypeDoc reference plus the hand-written guide. This site only
  // renders that folder (see fssstack/standards/libs.md).
  dir: '../../packages/mdkit/docs/public',
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig();
