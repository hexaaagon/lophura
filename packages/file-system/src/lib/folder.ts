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
import { getFileInfo, getFolderInfo } from "../utils/file-system";
import { paths } from "../constants";

export async function createFolder(folder: {
  name: string;
  path: string;
  workspace: string;
  uploadedBy: string;
}): FunctionReturn {
  const workspaces = (await db
    .select()
    .from(dbWorkspaces)
    .where(eq(dbWorkspaces.name, folder.workspace)))!;

  if (workspaces.length === 0)
    return {
      success: false,
      error: "Workspace not found",
    };

  const workspace = workspaces[0]!;
  const pathWorkspace = workspacePath(workspace.id);
  const pathFolder = path.join(pathWorkspace, folder.path);

  if (fs.existsSync(pathFolder))
    return {
      success: false,
      error: "Folder already exists",
    };

  let data;

  try {
    data = await db
      .insert(dbWorkspaceItems)
      .values({
        name: folder.name,
        workspaceId: workspace.id,
        path: folder.path,
        createdBy: folder.uploadedBy,
        createdAt: new Date(),
        modifiedAt: new Date(),
        state: "open",
        starred: [],
        info: {
          type: "folder",
        },
      })
      .returning();

    await fs.mkdir(pathFolder);
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
    },
  };
}

export async function getFolder(
  workspaceId: string,
  folderId: string
): FunctionReturn {
  const info = await getFolderInfo(workspaceId, folderId);
  if (info.success === false) return info;

  return {
    success: true,
    data: info.data,
  };
}

export async function listFolder(
  workspaceId: string,
  folderId: string
): FunctionReturn<
  Array<
    | {
        folder: typeof dbWorkspaceItems.$inferSelect;
        pathfolder: string;
      }
    | {
        file: typeof dbWorkspaceItems.$inferSelect;
        pathfile: string;
      }
  >
> {
  const info = await getFolderInfo(workspaceId, folderId);
  if (info.success === false) return info;

  const dbItems = await db
    .select()
    .from(dbWorkspaceItems)
    .where(eq(dbWorkspaceItems.workspaceId, workspaceId));

  const { WORKSPACES_PATH } = paths();

  const items = (await fs.readdir(info.data?.pathfolder!)).map((path) =>
    path.replace(WORKSPACES_PATH, "")
  );
  const itemsInfo = (
    await Promise.all(
      items.map(async (item) => {
        const itemInfo = dbItems.find(
          (dbItem) => dbItem.path === item && dbItem.workspaceId === workspaceId
        );
        if (!itemInfo) return null;

        const info =
          itemInfo.info.type === "folder"
            ? await getFolderInfo(workspaceId, itemInfo.id)
            : await getFileInfo(workspaceId, itemInfo.id);
        if (info.success === false) return null;

        return info.data!;
      })
    )
  ).filter((file) => file !== null);

  return {
    success: true,
    data: itemsInfo,
  };
}

export async function trashFolder(
  workspaceId: string,
  folderId: string
): FunctionReturn<{}> {
  const info = await getFolderInfo(workspaceId, folderId);
  if (info.success === false) return info;

  if (info.data?.folder.state === "trash")
    return {
      success: false,
      error: "Folder is in trash",
    };

  throw new Error("Not implemented");
}

export async function restoreFolder(
  workspaceId: string,
  folderId: string
): FunctionReturn<{}> {
  const info = await getFolderInfo(workspaceId, folderId);
  if (info.success === false) return info;

  if (info.data?.folder.state !== "trash")
    return {
      success: false,
      error: "Folder is not in trash",
    };

  throw new Error("Not implemented");
}

export async function deleteFolder(
  workspaceId: string,
  folderId: string
): FunctionReturn<{}> {
  const info = await getFolderInfo(workspaceId, folderId);
  if (info.success === false) return info;

  if (info.data?.folder.state !== "trash")
    return {
      success: false,
      error: "Folder is not in trash",
    };

  throw new Error("Not implemented");
}
