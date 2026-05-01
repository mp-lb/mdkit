import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  MdKitDocumentAdapter,
  MdKitDocumentVersionDetail,
  MdKitDocumentVersionSummary,
} from "../document/documentTypes";

export type UseMdKitDocumentVersionsOptions = {
  adapter: Pick<
    MdKitDocumentAdapter,
    "listDocumentVersions" | "readDocumentVersion"
  >;
  documentId: string | null;
};

export type MdKitDocumentVersionsController = {
  error: string | null;
  hasVersioning: boolean;
  isLoading: boolean;
  openVersion: (versionId: string) => Promise<void>;
  refresh: () => Promise<void>;
  selectedVersion: MdKitDocumentVersionDetail | null;
  selectedVersionId: string | null;
  versions: MdKitDocumentVersionSummary[];
};

export const useMdKitDocumentVersions = (
  options: UseMdKitDocumentVersionsOptions,
): MdKitDocumentVersionsController => {
  const { adapter, documentId } = options;
  const [versions, setVersions] = useState<MdKitDocumentVersionSummary[]>([]);

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );

  const [selectedVersion, setSelectedVersion] =
    useState<MdKitDocumentVersionDetail | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVersioning =
    !!adapter.listDocumentVersions && !!adapter.readDocumentVersion;

  const refresh = useCallback(async () => {
    if (!documentId || !adapter.listDocumentVersions) {
      setVersions([]);
      setSelectedVersionId(null);
      setSelectedVersion(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextVersions = await adapter.listDocumentVersions(documentId);
      setVersions(nextVersions);

      setSelectedVersionId((currentSelectedVersionId) => {
        if (
          !nextVersions.some(
            (version) => version.id === currentSelectedVersionId,
          )
        ) {
          setSelectedVersion(null);
          return null;
        }

        return currentSelectedVersionId;
      });
    } catch (err) {
      setError(`Failed to load versions: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [adapter, documentId]);

  const openVersion = useCallback(
    async (versionId: string) => {
      if (!documentId || !adapter.readDocumentVersion) {
        return;
      }

      setSelectedVersionId(versionId);
      setIsLoading(true);
      setError(null);

      try {
        const nextVersion = await adapter.readDocumentVersion({
          documentId,
          versionId,
        });

        if (!nextVersion) {
          setSelectedVersion(null);
          setError("That version is no longer available.");
          return;
        }

        setSelectedVersion(nextVersion);
      } catch (err) {
        setError(`Failed to load version: ${String(err)}`);
      } finally {
        setIsLoading(false);
      }
    },
    [adapter, documentId],
  );

  useEffect(() => {
    setSelectedVersionId(null);
    setSelectedVersion(null);
    void refresh();
  }, [documentId, refresh]);

  return useMemo(
    () => ({
      error,
      hasVersioning,
      isLoading,
      openVersion,
      refresh,
      selectedVersion,
      selectedVersionId,
      versions,
    }),
    [
      error,
      hasVersioning,
      isLoading,
      openVersion,
      refresh,
      selectedVersion,
      selectedVersionId,
      versions,
    ],
  );
};
