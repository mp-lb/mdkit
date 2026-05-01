import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMdKitTrpcClient } from "@mp-lb/mdkit/trpc/client";
import { createTestbenchApp } from "./app.js";

type TestServer = Awaited<ReturnType<typeof createTestbenchApp>>;

const documentId = "docs/example.md";
const documentQuery = `documentId=${encodeURIComponent(documentId)}`;
const documentPath = `/documents?${documentQuery}`;

describe("mdkit testbench backend", () => {
  let server: TestServer;

  beforeEach(async () => {
    server = await createTestbenchApp();
  });

  afterEach(async () => {
    await server.app.close();
  });

  it("serves health checks", async () => {
    const response = await server.app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });
  });

  it("reads, writes, and versions markdown documents", async () => {
    const initial = await server.app.inject({
      method: "GET",
      url: documentPath,
    });

    expect(initial.statusCode).toBe(200);
    expect(initial.json()).toMatchObject({
      content: "",
      version: "0",
    });

    const write = await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "0",
        content: "# Stored\n\nMarkdown",
      },
      url: documentPath,
    });

    expect(write.statusCode).toBe(200);
    expect(write.json()).toMatchObject({
      version: "1",
    });

    const current = await server.app.inject({
      method: "GET",
      url: documentPath,
    });

    expect(current.json()).toMatchObject({
      content: "# Stored\n\nMarkdown",
      version: "1",
    });

    const versions = await server.app.inject({
      method: "GET",
      url: `/versions?${documentQuery}`,
    });

    expect(versions.statusCode).toBe(200);
    expect(versions.json().versions).toHaveLength(2);

    const version = await server.app.inject({
      method: "GET",
      url: `/versions/1?${documentQuery}`,
    });

    expect(version.statusCode).toBe(200);
    expect(version.json()).toMatchObject({
      content: "# Stored\n\nMarkdown",
      id: "1",
      version: "1",
    });
  });

  it("rejects writes against stale base versions", async () => {
    await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "0",
        content: "first",
      },
      url: documentPath,
    });

    const staleWrite = await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "0",
        content: "second",
      },
      url: documentPath,
    });

    expect(staleWrite.statusCode).toBe(409);
    expect(staleWrite.json()).toMatchObject({
      conflict: true,
      version: "1",
    });
  });

  it("accepts forced writes against stale base versions", async () => {
    await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "0",
        content: "remote",
      },
      url: documentPath,
    });

    const forcedWrite = await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: null,
        content: "local",
        force: true,
      },
      url: documentPath,
    });

    expect(forcedWrite.statusCode).toBe(200);
    expect(forcedWrite.json()).toMatchObject({
      version: "2",
    });

    const current = await server.app.inject({
      method: "GET",
      url: documentPath,
    });

    expect(current.json()).toMatchObject({
      content: "local",
      version: "2",
    });
  });

  it("exposes the same document workflow through tRPC", async () => {
    const address = await server.app.listen({
      host: "127.0.0.1",
      port: 0,
    });

    const client = createMdKitTrpcClient({
      url: `${address}/trpc`,
    });

    const initial = await client.readDocument.query({ documentId });

    expect(initial).toMatchObject({
      content: "",
      version: "0",
    });

    const write = await client.writeDocument.mutate({
      baseVersion: "0",
      content: "# Stored through tRPC",
      documentId,
    });

    expect(write).toMatchObject({
      version: "1",
    });

    const versions = await client.listDocumentVersions.query({ documentId });

    expect(versions.versions).toHaveLength(2);

    const restored = await client.restoreDocumentVersion.mutate({
      documentId,
      versionId: "0",
    });

    expect(restored).toMatchObject({
      version: "2",
    });

    await expect(
      client.readDocument.query({ documentId }),
    ).resolves.toMatchObject({
      content: "",
      version: "2",
    });
  });

  it("can create a remote test fixture change", async () => {
    const response = await server.app.inject({
      method: "POST",
      payload: {
        content: "remote fixture",
      },
      url: `/test/remote-change?${documentQuery}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      version: "1",
    });

    const current = await server.app.inject({
      method: "GET",
      url: documentPath,
    });

    expect(current.json()).toMatchObject({
      content: "remote fixture",
      version: "1",
    });
  });

  it("restores a version through the core document engine", async () => {
    await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "0",
        content: "first",
      },
      url: documentPath,
    });

    await server.app.inject({
      method: "PUT",
      payload: {
        baseVersion: "1",
        content: "second",
      },
      url: documentPath,
    });

    const restore = await server.app.inject({
      method: "POST",
      url: `/versions/1/restore?${documentQuery}`,
    });

    expect(restore.statusCode).toBe(200);
    expect(restore.json()).toMatchObject({
      version: "3",
    });

    const current = await server.app.inject({
      method: "GET",
      url: documentPath,
    });

    expect(current.json()).toMatchObject({
      content: "first",
      version: "3",
    });
  });

  it("stores Hocuspocus collaboration state in memory", () => {
    const state = new Uint8Array([1, 2, 3]);

    server.store.writeCollaborationState(documentId, state);

    expect(server.store.readCollaborationState(documentId)).toEqual(state);
  });
});
