import {
  createMdKitDocumentRecord,
  restoreMdKitDocumentVersion,
  writeMdKitDocumentRecord,
  type MdKitDocumentRecord,
  type MdKitDocumentWriteInput,
} from "@mp-lb/mdkit/core";

export type MdKitTestbenchStore = ReturnType<typeof createMemoryStore>;
type TestbenchWriteDocumentInput = MdKitDocumentWriteInput & {
  force?: boolean;
};

export const createMemoryStore = () => {
  const records = new Map<string, MdKitDocumentRecord>();
  const collaborationStates = new Map<string, Uint8Array>();

  const readRecord = (documentId: string) => {
    const existing = records.get(documentId);

    if (existing) {
      return existing;
    }

    const created = createMdKitDocumentRecord();
    records.set(documentId, created);
    return created;
  };

  const readDocument = (documentId: string) => readRecord(documentId).current;

  const writeDocument = (input: TestbenchWriteDocumentInput) => {
    const written = writeMdKitDocumentRecord(readRecord(input.documentId), {
      baseVersion: input.baseVersion,
      content: input.content,
      force: input.force,
    });

    records.set(input.documentId, written.record);
    return written.result;
  };

  const restoreDocumentVersion = (documentId: string, versionId: string) => {
    const restored = restoreMdKitDocumentVersion(readRecord(documentId), {
      versionId,
    });

    records.set(documentId, restored.record);
    return restored.result;
  };

  const listDocumentVersions = (documentId: string) =>
    readRecord(documentId).versions.map(
      ({ authorLabel, createdAt, id, label, updatedAt, version }) => ({
        authorLabel: authorLabel ?? null,
        createdAt,
        id,
        label,
        updatedAt,
        version,
      }),
    );

  const readDocumentVersion = (documentId: string, versionId: string) =>
    readRecord(documentId).versions.find((version) => version.id === versionId) ??
    null;

  return {
    clear: () => {
      records.clear();
      collaborationStates.clear();
    },
    listDocumentVersions,
    readCollaborationState: (documentId: string) =>
      collaborationStates.get(documentId) ?? null,
    readDocument,
    readDocumentVersion,
    restoreDocumentVersion,
    writeCollaborationState: (documentId: string, state: Uint8Array) => {
      collaborationStates.set(documentId, state);
    },
    writeDocument,
  };
};
