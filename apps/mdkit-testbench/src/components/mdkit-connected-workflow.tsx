import { useState, type ReactNode } from "react";
import { GitBranch, Zap } from "lucide-react";
import type {
  MdKitCollaborationSession,
  MdKitDocumentController,
  MdKitDocumentVersionDetail,
  MdKitDocumentVersionsController,
} from "@mp-lb/mdkit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export type MdKitConnectedWorkflowProps = {
  children: ReactNode;
  collaboration?: MdKitCollaborationSession | null;
  document: MdKitDocumentController;
  onRestoreVersion: (
    version: MdKitDocumentVersionDetail,
  ) => Promise<void> | void;
  versions: MdKitDocumentVersionsController;
};

const statusBadgeClass = {
  danger: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

const toolbarBadgeClass = "h-8 px-3 text-sm";

const getVersionLabel = (
  version: Pick<MdKitDocumentVersionDetail, "id" | "label" | "version">,
) => {
  if (version.label) {
    return version.label;
  }

  if (version.version != null) {
    return `Version ${String(version.version)}`;
  }

  return version.id.slice(0, 8);
};

export const MdKitConnectedWorkflow = ({
  children,
  collaboration,
  document,
  onRestoreVersion,
  versions,
}: MdKitConnectedWorkflowProps) => {
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const [pendingConflictAction, setPendingConflictAction] = useState<
    "local" | "remote" | null
  >(null);

  const statusTone = document.conflict
    ? statusBadgeClass.danger
    : document.saveStatus === "saved"
      ? statusBadgeClass.success
      : document.saveStatus === "pending" || document.isDirty
        ? statusBadgeClass.warning
        : "";

  const statusLabel = document.conflict
    ? "Conflict"
    : document.saveStatus === "saving"
      ? "Saving"
      : document.saveStatus === "pending"
        ? "Autosave pending"
        : document.isDirty
          ? "Unsaved changes"
          : document.saveStatus === "saved"
            ? "Saved"
            : "Idle";

  const openVersionHistory = async () => {
    await versions.refresh();
    setVersionHistoryOpen(true);
  };

  const restoreSelectedVersion = async () => {
    if (!versions.selectedVersion) {
      return;
    }

    setIsRestoring(true);

    try {
      await onRestoreVersion(versions.selectedVersion);
      setVersionHistoryOpen(false);
    } finally {
      setIsRestoring(false);
    }
  };

  const keepRemote = async () => {
    setPendingConflictAction("remote");

    try {
      await document.resync();
      setConflictOpen(false);
    } finally {
      setPendingConflictAction(null);
    }
  };

  const keepLocal = async () => {
    setPendingConflictAction("local");

    try {
      const saved = await document.forceSave();

      if (saved) {
        setConflictOpen(false);
      }
    } finally {
      setPendingConflictAction(null);
    }
  };

  const remoteContent =
    document.conflictDetails?.remoteContent ??
    "Remote content preview is not available. Keep remote will still reload the latest canonical document.";

  const localContent = document.conflictDetails?.localContent ?? document.value;

  return (
    <div className="testbench-shadcn-workflow">
      <header className="testbench-shadcn-toolbar">
        <div className="testbench-status">
          <Badge
            variant="outline"
            className={`${toolbarBadgeClass} ${statusTone}`}
          >
            {statusLabel}
          </Badge>
          <Badge variant="outline" className={toolbarBadgeClass}>
            {document.updatedAt
              ? `Saved ${new Date(document.updatedAt).toLocaleTimeString()}`
              : "Never saved"}
          </Badge>
          {collaboration?.isCollaborating ? (
            <Badge variant="outline" className={toolbarBadgeClass}>
              {collaboration.otherParticipants.length + 1} collaborators
            </Badge>
          ) : null}
        </div>
        <div className="testbench-shadcn-toolbar-actions">
          {versions.hasVersioning ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={document.conflict}
              onClick={() => void openVersionHistory()}
            >
              <GitBranch />
              Version {String(document.version ?? "none")}
            </Button>
          ) : null}
          {document.conflict ? (
            <Button
              type="button"
              className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
              variant="outline"
              size="sm"
              onClick={() => setConflictOpen(true)}
            >
              <Zap />
              Resolve conflict
            </Button>
          ) : null}
        </div>
      </header>
      {children}
      <Dialog open={versionHistoryOpen} onOpenChange={setVersionHistoryOpen}>
        <DialogContent className="max-h-[min(42rem,calc(100vh-2rem))] overflow-hidden sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Version history</DialogTitle>
            <DialogDescription>
              Browse saved revisions and restore one when you need it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid min-h-0 gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
            <div className="flex max-h-[28rem] flex-col gap-2 overflow-auto rounded-2xl border bg-muted/30 p-2">
              {versions.versions.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">
                  No revisions have been recorded for this document yet.
                </p>
              ) : (
                versions.versions.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    className={
                      versions.selectedVersionId === version.id
                        ? "rounded-xl border bg-background p-3 text-left text-sm shadow-sm"
                        : "rounded-xl border border-transparent p-3 text-left text-sm hover:bg-background/70"
                    }
                    onClick={() => void versions.openVersion(version.id)}
                  >
                    <span className="block font-medium">
                      {getVersionLabel(version)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()}
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
              {versions.error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {versions.error}
                </p>
              ) : null}
              {versions.selectedVersion ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">
                        {getVersionLabel(versions.selectedVersion)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          versions.selectedVersion.createdAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      type="button"
                      disabled={isRestoring}
                      onClick={() => void restoreSelectedVersion()}
                    >
                      {isRestoring ? "Restoring..." : "Restore"}
                    </Button>
                  </div>
                  <pre className="min-h-0 flex-1 overflow-auto rounded-2xl border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                    {versions.selectedVersion.content}
                  </pre>
                </>
              ) : (
                <div className="flex min-h-[16rem] items-center justify-center rounded-2xl border bg-muted/20 p-6 text-sm text-muted-foreground">
                  {versions.isLoading
                    ? "Loading version data..."
                    : "Select a saved revision to preview it here."}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={document.conflict && conflictOpen}
        onOpenChange={setConflictOpen}
      >
        <DialogContent className="max-h-[min(38rem,calc(100vh-2rem))] overflow-hidden sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resolve conflict</DialogTitle>
            <DialogDescription>
              Remote changes conflict with local edits. Inspect both versions,
              then choose which one to keep.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="remote" className="min-h-0">
            <TabsList>
              <TabsTrigger value="remote">Keep remote</TabsTrigger>
              <TabsTrigger value="local">Keep local</TabsTrigger>
            </TabsList>
            <TabsContent value="remote">
              <Textarea
                className="min-h-56 resize-y font-mono text-sm"
                readOnly
                value={remoteContent}
              />
            </TabsContent>
            <TabsContent value="local">
              <Textarea
                className="min-h-56 resize-y font-mono text-sm"
                readOnly
                value={localContent}
              />
            </TabsContent>
          </Tabs>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={pendingConflictAction !== null}
              onClick={() => void keepRemote()}
            >
              {pendingConflictAction === "remote"
                ? "Keeping remote..."
                : "Keep remote"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pendingConflictAction !== null}
              onClick={() => void keepLocal()}
            >
              {pendingConflictAction === "local"
                ? "Keeping local..."
                : "Keep local"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
