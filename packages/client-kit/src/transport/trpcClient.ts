import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { MdKitDocumentAdapter } from "../document/documentTypes";
import type { MdKitTrpcRouter } from "./trpcServer";

export type CreateMdKitTrpcClientAdapterOptions = {
  url: string;
};

export type CreateMdKitTrpcAdapterOptions = {
  client: ReturnType<typeof createTRPCProxyClient<MdKitTrpcRouter>>;
};

export const createMdKitTrpcAdapter = ({
  client,
}: CreateMdKitTrpcAdapterOptions): MdKitDocumentAdapter => ({
  listDocumentVersions: async (documentId) => {
    const body = await client.listDocumentVersions.query({ documentId });
    return body.versions;
  },
  readDocument: (documentId) => client.readDocument.query({ documentId }),
  readDocumentVersion: (input) => client.readDocumentVersion.query(input),
  resyncDocument: (documentId) => client.resyncDocument.mutate({ documentId }),
  writeDocument: (input) => client.writeDocument.mutate(input),
});

export const createMdKitTrpcClient = ({
  url,
}: CreateMdKitTrpcClientAdapterOptions) =>
  createTRPCProxyClient<MdKitTrpcRouter>({
    links: [
      httpBatchLink({
        url,
      }),
    ],
  });

export const createMdKitTrpcClientAdapter = ({
  url,
}: CreateMdKitTrpcClientAdapterOptions) =>
  createMdKitTrpcAdapter({
    client: createMdKitTrpcClient({ url }),
  });
