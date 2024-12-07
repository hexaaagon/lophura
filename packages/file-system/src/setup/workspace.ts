import path from "node:path";
import fs from "fs-extra";

import { paths } from "../constants";
import { ReturnFunction } from "../types";
import { workspacePath } from "../utils";

import { eq } from "drizzle-orm";
import {
  nanoid,
  db,
  workspaces as dbWorkspaces,
  workspaceItems as dbWorkspaceItems,
} from "@lophura/server";

export async function setupWorkspace({
  name,
  createdBy,
}: {
  name: string;
  createdBy: string;
}): ReturnFunction {
  const { WORKSPACES_PATH } = paths();

  if (!fs.existsSync(WORKSPACES_PATH)) {
    await fs.mkdir(WORKSPACES_PATH, { recursive: true });
  }

  const workspaceData = await db
    .select()
    .from(dbWorkspaces)
    .where(eq(dbWorkspaces.name, name));

  if (workspaceData.length > 0)
    return {
      success: false,
      error: "Workspace already exists",
    };

  const id = nanoid(15);
  const pathWorkspace = workspacePath(id);

  try {
    await fs.mkdir(path.join(pathWorkspace, id));

    await db.insert(dbWorkspaces).values({
      id,
      name,
      path: pathWorkspace,
      createdBy,
    });
  } catch (e: any) {
    console.error(e);
    return {
      success: false,
      error: `Failed to create workspace${
        e instanceof Error ? " - " + e.message : ""
      }`,
    };
  }

  return {
    success: true,
  };
}
