import path from "node:path";
import fs from "fs-extra";

import { and, eq } from "drizzle-orm";
import {
  db,
  workspaces as dbWorkspaces,
  workspaceItems as dbWorkspaceItems,
} from "@lophura/server";

import { FunctionReturn } from "../types";
import { workspacePath } from "../utils";
import { getFileInfo } from "../utils/file-system";

export async function uploadFile(
  file: {
    name: string;
    path: string;
    workspace: string;
    uploadedBy: string;
  },
  buffer: Buffer
): FunctionReturn<{
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
}> {
  const workspaces = (await db
    .select()
    .from(dbWorkspaces)
    .where(eq(dbWorkspaces.name, file.workspace)))!;

  if (workspaces.length === 0)
    return {
      success: false,
      error: "Workspace not found",
    };

  const workspace = workspaces[0]!;
  const pathWorkspace = workspacePath(workspace.id);
  const pathFile = path.join(pathWorkspace, file.path);

  if (fs.existsSync(pathFile)) {
    return {
      success: false,
      error: "File already exists",
    };
  }

  let data;

  try {
    data = await db
      .insert(dbWorkspaceItems)
      .values({
        name: file.name,
        workspaceId: workspace.id,
        path: file.path,
        createdBy: file.uploadedBy,
        createdAt: new Date(),
        modifiedAt: new Date(),
        state: "open",
        starred: [],
        info: {
          type: "file",
          size: buffer.byteLength,
        },
      })
      .returning();

    await fs.ensureDir(pathFile.replace(`/${file.name}`, ""));
    await fs.writeFile(pathFile, buffer, "utf-8");
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: `Error uploading file${e instanceof Error ? " - " + e.message : ""}`,
    };
  }

  data = data[0]!;

  return {
    success: true,
    data: {
      name: data.name,
      uploadedBy: data.createdBy,
      uploadedAt: data.createdAt,
      size: buffer.byteLength,
    },
  };
}

export async function readFile(
  workspaceId: string,
  fileId: string
): FunctionReturn<Buffer> {
  const info = await getFileInfo(workspaceId, fileId);
  if (info.success === false) return info;

  return {
    success: true,
    data: await fs.readFile(info.data?.pathfile!),
  };
}

export async function trashFile(
  workspaceId: string,
  fileId: string
): FunctionReturn<{}> {
  const info = await getFileInfo(workspaceId, fileId);
  if (info.success === false) return info;

  if (info.data?.file.state !== "open")
    return {
      success: false,
      error: "File is in trash",
    };

  throw new Error("Not implemented");
}

export async function restoreFile(
  workspaceId: string,
  fileId: string
): FunctionReturn<{}> {
  const info = await getFileInfo(workspaceId, fileId);
  if (info.success === false) return info;

  if (info.data?.file.state !== "trash")
    return {
      success: false,
      error: "File is not in trash",
    };

  throw new Error("Not implemented");
}

export async function deleteFile(
  workspaceId: string,
  fileId: string
): FunctionReturn<{}> {
  const info = await getFileInfo(workspaceId, fileId);
  if (info.success === false) return info;

  if (info.data?.file.state !== "trash")
    return {
      success: false,
      error: "File is not in trash",
    };

  throw new Error("Not implemented");
}
