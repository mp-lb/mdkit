import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import {
  registerMdKitFastify,
  type MdKitRestoreDocumentVersionInput,
  type MdKitTransportStore,
} from "@mp-lb/mdkit/fastify";
import { createMdKitTrpcRouter } from "@mp-lb/mdkit/trpc/server";
import { z } from "zod";
import { createMemoryStore, type MdKitTestbenchStore } from "./memoryStore.js";

export type MdKitTestbenchAppOptions = {
  logger?: boolean;
  store?: MdKitTestbenchStore;
};

const documentQuerySchema = z.object({
  documentId: z.string(),
});

const remoteChangeSchema = z.object({
  content: z.string().optional(),
});

export const createTestbenchApp = async (
  options: MdKitTestbenchAppOptions = {},
) => {
  const store = options.store ?? createMemoryStore();

  const transportStore: MdKitTransportStore = {
    listDocumentVersions: store.listDocumentVersions,
    readCollaborationState: store.readCollaborationState,
    readDocument: store.readDocument,
    readDocumentVersion: ({
      documentId,
      versionId,
    }: MdKitRestoreDocumentVersionInput) =>
      store.readDocumentVersion(documentId, versionId),
    restoreDocumentVersion: ({
      documentId,
      versionId,
    }: MdKitRestoreDocumentVersionInput) =>
      store.restoreDocumentVersion(documentId, versionId),
    resyncDocument: store.readDocument,
    writeCollaborationState: store.writeCollaborationState,
    writeDocument: store.writeDocument,
  };

  const collaboration = Server.configure({
    extensions: [
      new Database({
        fetch: async ({ documentName }) =>
          store.readCollaborationState(documentName),
        store: async ({ documentName, state }) => {
          store.writeCollaborationState(documentName, state);
        },
      }),
    ],
  });

  const app = Fastify({
    logger: options.logger ?? false,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(websocket);

  app.get("/health", async () => ({
    ok: true,
  }));

  await registerMdKitFastify(app, {
    store: transportStore,
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: createMdKitTrpcRouter(transportStore),
    },
  });

  app.post("/test/reset", async () => {
    store.clear();
    return { ok: true };
  });

  app.post("/test/remote-change", async (request) => {
    const { documentId } = documentQuerySchema.parse(request.query);
    const body = remoteChangeSchema.parse(request.body ?? {});
    const current = store.readDocument(documentId);

    return store.writeDocument({
      baseVersion: current.version,
      content:
        body.content ??
        `${current.content}\n\nRemote change ${new Date().toLocaleTimeString()}`,
      documentId,
    });
  });

  app.get("/collaboration", { websocket: true }, (socket, request) => {
    collaboration.handleConnection(socket, request.raw, {});
  });

  app.addHook("onClose", async () => {
    await collaboration.destroy();
  });

  return {
    app,
    store,
  };
};
