import path from "node:path";
import fs from "fs-extra";

import { and, eq } from "drizzle-orm";
import {
  db,
  workspaces as dbWorkspaces,
  workspaceItems as dbWorkspaceItems,
} from "@lophura/server";

import { FunctionReturn } from "../../types";
import { workspacePath } from "../../utils";

export async function getFileInfo(
  workspaceId: string,
  fileId: string
): FunctionReturn<{
  file: typeof dbWorkspaceItems.$inferSelect;
  pathfile: string;
}> {
  const file = await db
    .select()
    .from(dbWorkspaceItems)
    .where(
      and(eq(dbWorkspaces.id, workspaceId), eq(dbWorkspaceItems.id, fileId))
    );

  if (file.length === 0)
    return {
      success: false,
      error: "File not found",
    };

  const pathFile = path.join(workspacePath(workspaceId), file[0]!.path);

  if (!fs.existsSync(pathFile)) {
    await fs.rm(pathFile, { recursive: true });

    return {
      success: false,
      error: "File not found",
    };
  }

  return {
    success: true,
    data: {
      file: file[0]!,
      pathfile: pathFile,
    },
  };
}

export async function getFolderInfo(
  workspaceId: string,
  folderId: string
): FunctionReturn<{
  folder: typeof dbWorkspaceItems.$inferSelect;
  pathfolder: string;
}> {
  const folder = await db
    .select()
    .from(dbWorkspaceItems)
    .where(
      and(eq(dbWorkspaces.id, workspaceId), eq(dbWorkspaceItems.id, folderId))
    );

  if (folder.length === 0)
    return {
      success: false,
      error: "Folder not found",
    };

  const pathFolder = path.join(workspacePath(workspaceId), folder[0]!.path);

  if (!fs.existsSync(pathFolder)) {
    await fs.rmdir(pathFolder, { recursive: true });

    return {
      success: false,
      error: "Folder not found",
    };
  }

  return {
    success: true,
    data: {
      folder: folder[0]!,
      pathfolder: pathFolder,
    },
  };
}

export async function getWorkspaceInfo(workspaceId: string) {
  const workspace = await db
    .select()
    .from(dbWorkspaces)
    .where(eq(dbWorkspaces.id, workspaceId));

  if (workspace.length === 0)
    return {
      success: false,
      error: "Workspace not found",
    };

  return {
    success: true,
    data: workspace[0]!,
  };
}
