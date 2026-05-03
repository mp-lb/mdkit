import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  Database,
  Download,
  Eye,
  GitBranch,
  RotateCcw,
  TerminalSquare,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import {
  createMdKitEditorThemeStyle,
  createMdKitRestAdapter,
  defaultMdKitEditorTheme,
  MdKitConflictPanel,
  MdKitDocumentToolbar,
  MdKitEditor,
  MdKitThemeEditor,
  MdKitView,
  VersionHistoryPanel,
  useMdKitCollaboration,
  useMdKitDocument,
  useMdKitDocumentVersions,
  type MdKitDocumentVersionDetail,
  type MdKitEditorTheme,
  type MdKitEditorThemeStyle,
} from "@mp-lb/mdkit";
import {
  createMdKitTrpcAdapter,
  createMdKitTrpcClient,
} from "@mp-lb/mdkit/trpc/client";
import { Badge } from "./components/ui/badge";
import { MdKitConnectedWorkflow } from "./components/mdkit-connected-workflow";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";

const storageKey = "mdkit-testbench:basic-markdown";
const docsUrl = import.meta.env.VITE_DOCS_URL;
const apiUrl = import.meta.env.VITE_TESTBENCH_API_URL;
const connectedDocumentId = "docs/example.md";

const sampleMarkdown = `# mdkit testbench

This editor is wired like a textarea:

- \`value\` comes from React state
- \`onChange\` writes the next markdown string
- persistence is a single mock storage slot
- no versions, autosave, or collaboration

Whitespace probe:


There should be two blank lines above this paragraph in the raw textarea.

Edit either pane and the other one should stay in sync.`;

const readOnlySampleMarkdown = `# Read-only view

This pane renders markdown without mounting Tiptap or ProseMirror.

- Uses the same mdkit shell and markdown styling
- Supports the same \`fillHeight\` sizing mode
- Keeps links opening in a new tab: [mdkit docs](https://example.com)

| Feature | Expected |
| --- | --- |
| Tables | Render with borders |
| GFM | Enabled |

> Use the State tab to type arbitrary markdown and inspect rendering.`;

type ConnectedVariant = "base" | "shadcn";
type ActiveTab =
  | "connected-base"
  | "connected-shadcn"
  | "read-only"
  | "unconnected";

type TestbenchRoute = {
  connectedVariant: ConnectedVariant;
  initialTab: ActiveTab;
  qaMode: boolean;
};

type InspectorTab = {
  content: ReactNode;
  id: string;
  label: string;
};

type StoredMarkdown = {
  markdown: string;
  storedAt: string;
};

const statusBadgeClass = {
  danger: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

const countWords = (value: string) =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

const readTestbenchRoute = (): TestbenchRoute => {
  const route = window.location.pathname.replace(/\/+$/, "");

  if (route === "/qa-unconnected") {
    return {
      connectedVariant: "base",
      initialTab: "unconnected",
      qaMode: true,
    };
  }

  if (route === "/qa-read-only") {
    return {
      connectedVariant: "base",
      initialTab: "read-only",
      qaMode: true,
    };
  }

  if (route === "/qa-connected-base" || route === "/qa-connected") {
    return {
      connectedVariant: "base",
      initialTab: "connected-base",
      qaMode: true,
    };
  }

  if (route === "/qa-connected-shadcn") {
    return {
      connectedVariant: "shadcn",
      initialTab: "connected-shadcn",
      qaMode: true,
    };
  }

  return {
    connectedVariant: "base",
    initialTab: "unconnected",
    qaMode: false,
  };
};

const readStoredMarkdown = (): StoredMarkdown | null => {
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredMarkdown>;

    if (typeof parsed.markdown !== "string") {
      return null;
    }

    return {
      markdown: parsed.markdown,
      storedAt:
        typeof parsed.storedAt === "string"
          ? parsed.storedAt
          : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
};

const formatStoredAt = (storedAt: string) =>
  new Date(storedAt).toLocaleString();

const restoreVersionPath = (documentId: string, versionId: string) =>
  `${apiUrl}/versions/${encodeURIComponent(
    versionId,
  )}/restore?documentId=${encodeURIComponent(documentId)}`;

const trpcUrl = () => `${apiUrl}/trpc`;

const collaborationEndpoint = () => {
  if (!apiUrl) {
    return null;
  }

  return `${apiUrl.replace(/^http/, "ws")}/collaboration`;
};

const MarkdownStatePanel = ({
  focusedPane,
  markdown,
  onBlur,
  onChange,
  onFocus,
  storageMatchesMemory,
}: {
  focusedPane?: string | null;
  markdown: string;
  onBlur?: () => void;
  onChange: (markdown: string) => void;
  onFocus?: () => void;
  storageMatchesMemory?: boolean | null;
}) => {
  const stats = useMemo(
    () => ({
      characters: markdown.length,
      lines: markdown.split("\n").length,
      words: countWords(markdown),
    }),
    [markdown],
  );

  return (
    <section className="testbench-config-section testbench-state-panel">
      <h2>Markdown State</h2>
      <div className="testbench-status" aria-label="Markdown stats">
        <Badge>{stats.characters} chars</Badge>
        <Badge>{stats.words} words</Badge>
        <Badge>{stats.lines} lines</Badge>
        {storageMatchesMemory == null ? null : (
          <Badge
            variant="outline"
            className={
              storageMatchesMemory
                ? statusBadgeClass.success
                : statusBadgeClass.warning
            }
          >
            {storageMatchesMemory ? "matches stored" : "differs from stored"}
          </Badge>
        )}
        {focusedPane ? <Badge>{focusedPane} focused</Badge> : null}
      </div>
      <Textarea
        spellCheck={false}
        value={markdown}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
      />
    </section>
  );
};

const Inspector = ({
  activeTab,
  onActiveTabChange,
  tabs,
}: {
  activeTab?: string;
  onActiveTabChange?: (tab: string) => void;
  tabs: InspectorTab[];
}) => {
  if (!tabs[0]) {
    return null;
  }

  return (
    <aside className="testbench-inspector">
      <div className="testbench-inspector-header">
        <h2>Inspector</h2>
      </div>
      <Tabs
        defaultValue={tabs[0].id}
        value={activeTab}
        onValueChange={onActiveTabChange}
        className="testbench-inspector-tabs"
      >
        <TabsList className="testbench-inspector-tabs-list">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="testbench-inspector-panel"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </aside>
  );
};

const BehaviorPanel = ({
  fillHeight,
  onFillHeightChange,
}: {
  fillHeight: boolean;
  onFillHeightChange: (fillHeight: boolean) => void;
}) => (
  <section className="testbench-config-section">
    <h2>Behavior</h2>
    <label className="testbench-checkbox-row">
      <Checkbox
        checked={fillHeight}
        onCheckedChange={(checked) => onFillHeightChange(checked === true)}
      />
      <span>
        <strong>Fill available height</strong>
        <small>
          Expands the editor surface and enables the empty-area hitbox.
        </small>
      </span>
    </label>
  </section>
);

const StylingPanel = ({
  editorTheme,
  onEditorThemeChange,
}: {
  editorTheme: MdKitEditorTheme;
  onEditorThemeChange: (theme: MdKitEditorTheme) => void;
}) => (
  <section className="testbench-config-section">
    <h2>Styling</h2>
    <MdKitThemeEditor
      className="testbench-theme-editor"
      theme={editorTheme}
      onChange={onEditorThemeChange}
      onReset={() => onEditorThemeChange(defaultMdKitEditorTheme)}
    />
  </section>
);

const UnconnectedStoragePanel = ({
  clearMemory,
  clearStorage,
  resetSample,
  restoreMarkdown,
  storeMarkdown,
  storedMarkdown,
  storedStats,
}: {
  clearMemory: () => void;
  clearStorage: () => void;
  resetSample: () => void;
  restoreMarkdown: () => void;
  storeMarkdown: () => void;
  storedMarkdown: StoredMarkdown | null;
  storedStats: {
    characters: number;
    lines: number;
    words: number;
  } | null;
}) => (
  <section className="testbench-config-section">
    <div className="testbench-control-summary">
      <span className="testbench-control-label">
        <Database />
        Mock storage
      </span>
      {storedMarkdown && storedStats ? (
        <span>
          Stored {storedStats.characters} chars, {storedStats.words} words,{" "}
          {storedStats.lines} lines at {formatStoredAt(storedMarkdown.storedAt)}
        </span>
      ) : (
        <span>Empty</span>
      )}
    </div>
    <div className="testbench-actions testbench-inspector-actions">
      <Button type="button" variant="outline" onClick={clearMemory}>
        <Trash2 />
        Clear memory
      </Button>
      <Button type="button" variant="outline" onClick={resetSample}>
        <RotateCcw />
        Reset sample
      </Button>
      <Button type="button" variant="outline" onClick={storeMarkdown}>
        <Upload />
        Store
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!storedMarkdown}
        onClick={restoreMarkdown}
      >
        <Download />
        Restore
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={!storedMarkdown}
        onClick={clearStorage}
      >
        <Trash2 />
        Clear storage
      </Button>
    </div>
  </section>
);

const ConnectedActionsPanel = ({
  debugStatus,
  document,
  simulateRemoteChange,
}: {
  debugStatus: string;
  document: ReturnType<typeof useMdKitDocument>;
  simulateRemoteChange: () => Promise<void>;
}) => (
  <section className="testbench-config-section">
    <div className="testbench-control-summary">
      <span className="testbench-control-label">
        <GitBranch />
        Connected document
      </span>
      <span>{connectedDocumentId}</span>
      <span>{apiUrl}</span>
      <span>{debugStatus}</span>
    </div>
    <div className="testbench-actions testbench-inspector-actions">
      <Button
        type="button"
        variant="outline"
        disabled={!document.conflict}
        onClick={() => void document.forceSave()}
      >
        <Zap />
        Force save
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => void simulateRemoteChange()}
      >
        <GitBranch />
        Simulate remote change
      </Button>
    </div>
  </section>
);

const EditorWorkbench = ({
  children,
  components,
}: {
  children: ReactNode;
  components: string;
}) => (
  <section className="testbench-workbench">
    <div className="testbench-pane">
      <div className="testbench-pane-header">
        <h2>{components}</h2>
      </div>
      {children}
    </div>
  </section>
);

const EditorSurface = ({
  children,
  fillHeight,
}: {
  children: ReactNode;
  fillHeight: boolean;
}) => (
  <div
    className={
      fillHeight
        ? "testbench-library-surface testbench-library-surface-fill"
        : "testbench-library-surface"
    }
  >
    {children}
  </div>
);

const editorClassName = (fillHeight: boolean) =>
  fillHeight ? "testbench-editor testbench-editor-fill" : "testbench-editor";

const UnconnectedTab = ({
  editorFillHeight,
  editorStyle,
  editorTheme,
  onEditorThemeChange,
  onFillHeightChange,
  showInspector = true,
}: {
  editorFillHeight: boolean;
  editorStyle: MdKitEditorThemeStyle;
  editorTheme: MdKitEditorTheme;
  onEditorThemeChange: (theme: MdKitEditorTheme) => void;
  onFillHeightChange: (fillHeight: boolean) => void;
  showInspector?: boolean;
}) => {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const [editorRevision, setEditorRevision] = useState(0);

  const [storedMarkdown, setStoredMarkdown] = useState<StoredMarkdown | null>(
    () => readStoredMarkdown(),
  );

  const [focusedPane, setFocusedPane] = useState<"editor" | "textarea" | null>(
    null,
  );

  const storedStats = useMemo(
    () =>
      storedMarkdown
        ? {
            characters: storedMarkdown.markdown.length,
            lines: storedMarkdown.markdown.split("\n").length,
            words: countWords(storedMarkdown.markdown),
          }
        : null,
    [storedMarkdown],
  );

  const storageMatchesMemory =
    storedMarkdown !== null && storedMarkdown.markdown === markdown;

  const remountEditor = () => {
    setEditorRevision((current) => current + 1);
  };

  const resetSample = () => {
    setMarkdown(sampleMarkdown);
    remountEditor();
  };

  const clearMemory = () => {
    setMarkdown("");
    remountEditor();
  };

  const storeMarkdown = () => {
    const nextStored = {
      markdown,
      storedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(nextStored));
    setStoredMarkdown(nextStored);
  };

  const restoreMarkdown = () => {
    const currentStored = readStoredMarkdown();

    setStoredMarkdown(currentStored);

    if (!currentStored) {
      return;
    }

    setMarkdown(currentStored.markdown);
    remountEditor();
  };

  const clearStorage = () => {
    window.localStorage.removeItem(storageKey);
    setStoredMarkdown(null);
  };

  const inspectorTabs: InspectorTab[] = [
    {
      id: "storage",
      label: "Actions",
      content: (
        <UnconnectedStoragePanel
          clearMemory={clearMemory}
          clearStorage={clearStorage}
          resetSample={resetSample}
          restoreMarkdown={restoreMarkdown}
          storeMarkdown={storeMarkdown}
          storedMarkdown={storedMarkdown}
          storedStats={storedStats}
        />
      ),
    },
    {
      id: "state",
      label: "State",
      content: (
        <MarkdownStatePanel
          focusedPane={focusedPane}
          markdown={markdown}
          storageMatchesMemory={storedMarkdown ? storageMatchesMemory : null}
          onBlur={() => setFocusedPane(null)}
          onChange={setMarkdown}
          onFocus={() => setFocusedPane("textarea")}
        />
      ),
    },
    {
      id: "controls",
      label: "Controls",
      content: (
        <>
          <BehaviorPanel
            fillHeight={editorFillHeight}
            onFillHeightChange={onFillHeightChange}
          />
          <StylingPanel
            editorTheme={editorTheme}
            onEditorThemeChange={onEditorThemeChange}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <section className="testbench-preview-section">
        <div
          className={
            showInspector ? "testbench-split-layout" : "testbench-qa-layout"
          }
        >
          <EditorWorkbench components="MdKitEditor">
            <EditorSurface fillHeight={editorFillHeight}>
              <MdKitEditor
                className={editorClassName(editorFillHeight)}
                fillHeight={editorFillHeight}
                instanceKey={editorRevision}
                style={editorStyle}
                value={markdown}
                onChange={setMarkdown}
                onFocusChange={(focused) =>
                  setFocusedPane(focused ? "editor" : null)
                }
              />
            </EditorSurface>
          </EditorWorkbench>
          {showInspector ? <Inspector tabs={inspectorTabs} /> : null}
        </div>
      </section>
    </>
  );
};

const ReadOnlyTab = ({
  editorFillHeight,
  editorStyle,
  editorTheme,
  onEditorThemeChange,
  onFillHeightChange,
  showInspector = true,
}: {
  editorFillHeight: boolean;
  editorStyle: MdKitEditorThemeStyle;
  editorTheme: MdKitEditorTheme;
  onEditorThemeChange: (theme: MdKitEditorTheme) => void;
  onFillHeightChange: (fillHeight: boolean) => void;
  showInspector?: boolean;
}) => {
  const [markdown, setMarkdown] = useState(readOnlySampleMarkdown);
  const [focusedPane, setFocusedPane] = useState<"textarea" | null>(null);

  const inspectorTabs: InspectorTab[] = [
    {
      id: "controls",
      label: "Controls",
      content: (
        <>
          <BehaviorPanel
            fillHeight={editorFillHeight}
            onFillHeightChange={onFillHeightChange}
          />
          <StylingPanel
            editorTheme={editorTheme}
            onEditorThemeChange={onEditorThemeChange}
          />
        </>
      ),
    },
    {
      id: "state",
      label: "State",
      content: (
        <MarkdownStatePanel
          focusedPane={focusedPane}
          markdown={markdown}
          onBlur={() => setFocusedPane(null)}
          onChange={setMarkdown}
          onFocus={() => setFocusedPane("textarea")}
        />
      ),
    },
  ];

  return (
    <section className="testbench-preview-section">
      <div
        className={
          showInspector ? "testbench-split-layout" : "testbench-qa-layout"
        }
      >
        <EditorWorkbench components="MdKitView">
          <EditorSurface fillHeight={editorFillHeight}>
            <MdKitView
              className={editorClassName(editorFillHeight)}
              fillHeight={editorFillHeight}
              style={editorStyle}
              value={markdown}
            />
          </EditorSurface>
        </EditorWorkbench>
        {showInspector ? <Inspector tabs={inspectorTabs} /> : null}
      </div>
    </section>
  );
};

const ConnectedTab = ({
  connectedVariant,
  documentDebounceMs = 450,
  editorFillHeight,
  editorStyle,
  editorTheme,
  onEditorThemeChange,
  onFillHeightChange,
  showInspector = true,
}: {
  connectedVariant: ConnectedVariant;
  documentDebounceMs?: number;
  editorFillHeight: boolean;
  editorStyle: MdKitEditorThemeStyle;
  editorTheme: MdKitEditorTheme;
  onEditorThemeChange: (theme: MdKitEditorTheme) => void;
  onFillHeightChange: (fillHeight: boolean) => void;
  showInspector?: boolean;
}) => {
  const trpcClient = useMemo(
    () =>
      connectedVariant === "shadcn"
        ? createMdKitTrpcClient({ url: trpcUrl() })
        : null,
    [connectedVariant],
  );

  const adapter = useMemo(
    () =>
      trpcClient
        ? createMdKitTrpcAdapter({ client: trpcClient })
        : createMdKitRestAdapter({ baseUrl: apiUrl }),
    [trpcClient],
  );

  const [debugStatus, setDebugStatus] = useState("Backend idle");
  const [activeInspectorTab, setActiveInspectorTab] = useState("state");
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);

  const document = useMdKitDocument({
    adapter,
    debounceMs: documentDebounceMs,
    documentId: connectedDocumentId,
    pollMs: 1200,
  });

  const versions = useMdKitDocumentVersions({
    adapter,
    documentId: connectedDocumentId,
  });

  const collaboration = useMdKitCollaboration({
    collaborator: {
      id: "testbench-user",
      name: "Testbench",
    },
    documentId: connectedDocumentId,
    endpoint: collaborationEndpoint(),
  });

  const useCollaborativeEditor = collaboration;

  const renderEditor = () =>
    useCollaborativeEditor ? (
      <MdKitEditor
        className={editorClassName(editorFillHeight)}
        collaboration={useCollaborativeEditor}
        fillHeight={editorFillHeight}
        readOnly={document.conflict}
        style={editorStyle}
        value={document.value}
        onChange={document.setContent}
        onFocusChange={document.setFocused}
      />
    ) : (
      <MdKitEditor
        className={editorClassName(editorFillHeight)}
        fillHeight={editorFillHeight}
        instanceKey={document.revision}
        readOnly={document.conflict}
        style={editorStyle}
        value={document.value}
        onChange={document.setContent}
        onFocusChange={document.setFocused}
      />
    );

  const restoreVersion = async (version: MdKitDocumentVersionDetail) => {
    if (trpcClient) {
      await trpcClient.restoreDocumentVersion.mutate({
        documentId: connectedDocumentId,
        versionId: version.id,
      });
    } else {
      const response = await fetch(
        restoreVersionPath(connectedDocumentId, version.id),
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error(`Restore failed: ${response.status}`);
      }
    }

    await document.resync();
    await versions.refresh();
  };

  const simulateRemoteChange = async () => {
    setDebugStatus("Writing remote change...");

    try {
      const remote = await adapter.readDocument(connectedDocumentId);

      const result = await adapter.writeDocument({
        baseVersion: remote.version,
        content: `${remote.content}\n\nRemote change ${new Date().toLocaleTimeString()}`,
        documentId: connectedDocumentId,
      });

      if ("conflict" in result) {
        setDebugStatus(`Remote write conflicted at ${String(result.version)}`);
        return;
      }

      await versions.refresh();
      setDebugStatus(`Remote wrote version ${String(result.version)}`);
    } catch (error) {
      setDebugStatus(`Remote write failed: ${String(error)}`);
    }
  };

  const inspectorTabs: InspectorTab[] = [
    {
      id: "actions",
      label: "Actions",
      content: (
        <ConnectedActionsPanel
          debugStatus={debugStatus}
          document={document}
          simulateRemoteChange={simulateRemoteChange}
        />
      ),
    },
    {
      id: "state",
      label: "State",
      content: (
        <MarkdownStatePanel
          focusedPane={document.isFocused ? "editor" : null}
          markdown={document.value}
          onBlur={() => document.setFocused(false)}
          onChange={document.setContent}
          onFocus={() => document.setFocused(true)}
        />
      ),
    },
    {
      id: "controls",
      label: "Controls",
      content: (
        <>
          <BehaviorPanel
            fillHeight={editorFillHeight}
            onFillHeightChange={onFillHeightChange}
          />
          <StylingPanel
            editorTheme={editorTheme}
            onEditorThemeChange={onEditorThemeChange}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <section className="testbench-preview-section">
        <div
          className={
            showInspector ? "testbench-split-layout" : "testbench-qa-layout"
          }
        >
          <EditorWorkbench
            components={
              connectedVariant === "base"
                ? "MdKitEditor, MdKitDocumentToolbar, MdKitConflictPanel, VersionHistoryPanel"
                : "MdKitEditor, shadcn plugin reference"
            }
          >
            {connectedVariant === "base" ? (
              <>
                <MdKitDocumentToolbar
                  collaboration={collaboration}
                  document={document}
                  onOpenConflict={() => setConflictOpen(true)}
                  showConflictActions={false}
                  versions={versions}
                  onOpenVersionHistory={() => {
                    setVersionHistoryOpen((current) => !current);
                  }}
                />
                <EditorSurface fillHeight={editorFillHeight}>
                  {renderEditor()}
                </EditorSurface>
              </>
            ) : (
              <MdKitConnectedWorkflow
                collaboration={collaboration}
                document={document}
                versions={versions}
                onRestoreVersion={restoreVersion}
              >
                <EditorSurface fillHeight={editorFillHeight}>
                  {renderEditor()}
                </EditorSurface>
              </MdKitConnectedWorkflow>
            )}
          </EditorWorkbench>
          {connectedVariant === "base" ? (
            <>
              <Dialog
                open={versionHistoryOpen}
                onOpenChange={setVersionHistoryOpen}
              >
                <DialogContent className="testbench-panel-dialog">
                  <DialogHeader>
                    <DialogTitle>Version history</DialogTitle>
                    <DialogDescription>
                      This modal shell belongs to the app. The content below is
                      the mdkit base panel.
                    </DialogDescription>
                  </DialogHeader>
                  <VersionHistoryPanel
                    className="testbench-history"
                    controller={versions}
                    onRestoreVersion={(version) => void restoreVersion(version)}
                  />
                </DialogContent>
              </Dialog>
              <Dialog
                open={document.conflict && conflictOpen}
                onOpenChange={setConflictOpen}
              >
                <DialogContent className="testbench-panel-dialog testbench-panel-dialog-narrow">
                  <DialogHeader>
                    <DialogTitle>Resolve conflict</DialogTitle>
                    <DialogDescription>
                      This modal shell belongs to the app. The content below is
                      the mdkit base panel.
                    </DialogDescription>
                  </DialogHeader>
                  <MdKitConflictPanel document={document} />
                </DialogContent>
              </Dialog>
            </>
          ) : null}
          {showInspector ? (
            <Inspector
              activeTab={activeInspectorTab}
              tabs={inspectorTabs}
              onActiveTabChange={setActiveInspectorTab}
            />
          ) : null}
        </div>
      </section>
    </>
  );
};

export const App = () => {
  const route = useMemo(() => readTestbenchRoute(), []);
  const [activeTab, setActiveTab] = useState<ActiveTab>(route.initialTab);

  const [editorTheme, setEditorTheme] = useState<MdKitEditorTheme>(
    defaultMdKitEditorTheme,
  );

  const [editorFillHeight, setEditorFillHeight] = useState(true);

  const editorStyle = useMemo(
    () => createMdKitEditorThemeStyle(editorTheme),
    [editorTheme],
  );

  return (
    <main
      className={
        route.qaMode ? "testbench-shell testbench-shell-qa" : "testbench-shell"
      }
    >
      {route.qaMode ? null : (
        <header className="testbench-header">
          <div>
            <p className="testbench-eyebrow">mdkit-testbench</p>
            <h1>
              <TerminalSquare />
              Markdown editor testbench
            </h1>
          </div>
          <div className="testbench-actions">
            <nav className="testbench-tabs" aria-label="Testbench views">
              <Button
                type="button"
                variant="ghost"
                className={
                  activeTab === "unconnected"
                    ? "testbench-tab testbench-tab-active"
                    : "testbench-tab"
                }
                onClick={() => setActiveTab("unconnected")}
              >
                <TerminalSquare />
                Unconnected
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={
                  activeTab === "connected-base"
                    ? "testbench-tab testbench-tab-active"
                    : "testbench-tab"
                }
                onClick={() => setActiveTab("connected-base")}
              >
                <GitBranch />
                Connected (panels)
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={
                  activeTab === "connected-shadcn"
                    ? "testbench-tab testbench-tab-active"
                    : "testbench-tab"
                }
                onClick={() => setActiveTab("connected-shadcn")}
              >
                <GitBranch />
                Connected (shadcn)
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={
                  activeTab === "read-only"
                    ? "testbench-tab testbench-tab-active"
                    : "testbench-tab"
                }
                onClick={() => setActiveTab("read-only")}
              >
                <Eye />
                Read-only
              </Button>
            </nav>
            {docsUrl ? (
              <Button asChild variant="outline">
                <a href={docsUrl}>
                  <BookOpen />
                  Docs
                </a>
              </Button>
            ) : null}
          </div>
        </header>
      )}
      {activeTab === "unconnected" ? (
        <UnconnectedTab
          editorFillHeight={editorFillHeight}
          editorStyle={editorStyle}
          editorTheme={editorTheme}
          onEditorThemeChange={setEditorTheme}
          onFillHeightChange={setEditorFillHeight}
          showInspector={!route.qaMode}
        />
      ) : activeTab === "read-only" ? (
        <ReadOnlyTab
          editorFillHeight={editorFillHeight}
          editorStyle={editorStyle}
          editorTheme={editorTheme}
          onEditorThemeChange={setEditorTheme}
          onFillHeightChange={setEditorFillHeight}
          showInspector={!route.qaMode}
        />
      ) : (
        <ConnectedTab
          connectedVariant={
            activeTab === "connected-shadcn" ? "shadcn" : "base"
          }
          documentDebounceMs={route.qaMode ? 3000 : 450}
          editorFillHeight={editorFillHeight}
          editorStyle={editorStyle}
          editorTheme={editorTheme}
          onEditorThemeChange={setEditorTheme}
          onFillHeightChange={setEditorFillHeight}
          showInspector={!route.qaMode}
        />
      )}
    </main>
  );
};
