import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type {
  MdKitDocumentAdapter,
  MdKitDocumentSnapshot,
  MdKitDocumentVersionDetail,
  MdKitDocumentVersionSummary,
  MdKitDocumentWriteInput,
  MdKitDocumentWriteResult,
} from "../document/documentTypes";
import type { MdKitTrpcRouter } from "./trpcServer";

export type CreateMdKitTrpcClientAdapterOptions = {
  url: string;
};

type MdKitTrpcQuery<Input, Output> = {
  query(input: Input): Promise<Output>;
};

type MdKitTrpcMutation<Input, Output> = {
  mutate(input: Input): Promise<Output>;
};

type MdKitDocumentInput = {
  documentId: string;
};

type MdKitVersionInput = {
  documentId: string;
  versionId: string;
};

export type MdKitTrpcClient = {
  listDocumentVersions: MdKitTrpcQuery<
    MdKitDocumentInput,
    { versions: MdKitDocumentVersionSummary[] }
  >;
  readDocument: MdKitTrpcQuery<MdKitDocumentInput, MdKitDocumentSnapshot>;
  readDocumentVersion: MdKitTrpcQuery<
    MdKitVersionInput,
    MdKitDocumentVersionDetail | null
  >;
  resyncDocument: MdKitTrpcMutation<MdKitDocumentInput, MdKitDocumentSnapshot>;
  writeDocument: MdKitTrpcMutation<
    MdKitDocumentWriteInput,
    MdKitDocumentWriteResult
  >;
};

export type CreateMdKitTrpcAdapterOptions = {
  client: MdKitTrpcClient;
};

/**
 * Turns an mdkit tRPC client (standalone or a nested sub-client of your app
 * router) into an {@link MdKitDocumentAdapter} for the document hooks.
 */
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

/**
 * Creates a typed tRPC proxy client for the mdkit router at `url`.
 */
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
