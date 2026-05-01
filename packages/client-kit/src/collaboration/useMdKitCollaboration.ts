import { useEffect, useMemo, useState } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import type {
  MdKitCollaborationParticipant,
  MdKitCollaborationSession,
  MdKitCollaborationStatus,
} from "../document/documentTypes";

export type UseMdKitCollaborationOptions = {
  collaborator: MdKitCollaborationParticipant;
  documentId: string | null;
  enabled?: boolean;
  endpoint: string | null;
  getToken?: () => Promise<string | null>;
  resolveRoomName?: (documentId: string) => string;
};

const createColorFromId = (id: string): string => {
  let hash = 0;

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(index);
    hash |= 0;
  }

  return `hsl(${Math.abs(hash) % 360}, 85%, 55%)`;
};

export const useMdKitCollaboration = (
  options: UseMdKitCollaborationOptions,
): MdKitCollaborationSession | null => {
  const {
    collaborator,
    documentId,
    enabled = true,
    endpoint,
    getToken,
    resolveRoomName,
  } = options;

  const [status, setStatus] =
    useState<MdKitCollaborationStatus>("disconnected");

  const normalizedCollaborator = useMemo(
    () => ({
      ...collaborator,
      color: collaborator.color || createColorFromId(collaborator.id),
    }),
    [collaborator],
  );

  const roomName = useMemo(() => {
    if (!documentId) {
      return "";
    }

    return resolveRoomName ? resolveRoomName(documentId) : documentId;
  }, [documentId, resolveRoomName]);

  const ydoc = useMemo(() => {
    void roomName;
    return new Y.Doc();
  }, [roomName]);

  const provider = useMemo(() => {
    if (!enabled || !documentId || !endpoint) {
      return null;
    }

    return new HocuspocusProvider({
      document: ydoc,
      name: roomName,
      onConnect: () => setStatus("connected"),
      onDisconnect: () => setStatus("disconnected"),
      onStatus: ({ status: nextStatus }) => {
        if (nextStatus === "connecting") {
          setStatus("connecting");
        }
      },
      token: async () => {
        const token = getToken ? await getToken() : null;
        return token || "";
      },
      url: endpoint,
    });
  }, [documentId, enabled, endpoint, getToken, roomName, ydoc]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    return () => {
      provider.destroy();
    };
  }, [provider]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.setAwarenessField("user", {
      color: normalizedCollaborator.color,
      id: normalizedCollaborator.id,
      imageUrl: normalizedCollaborator.imageUrl || undefined,
      name: normalizedCollaborator.name,
    });
  }, [normalizedCollaborator, provider]);

  return useMemo(() => {
    if (!enabled || !documentId || !endpoint) {
      return null;
    }

    return {
      collaborator: normalizedCollaborator,
      document: ydoc,
      provider,
      roomName,
      status: provider ? status : "disconnected",
    };
  }, [
    documentId,
    enabled,
    endpoint,
    normalizedCollaborator,
    provider,
    roomName,
    status,
    ydoc,
  ]);
};
