import path from "node:path";
import fs from "fs-extra";

import { paths } from "../constants";
import { ReturnFunction } from "../types";

import { db } from "@lophura/server";

export async function setupWorkspace({
  workspace,
}: {
  workspace: string;
}): ReturnFunction {
  const { WORKSPACES_PATH } = paths();

  if (!fs.existsSync(WORKSPACES_PATH)) {
    await fs.mkdir(WORKSPACES_PATH, { recursive: true });
  }

  if (!fs.existsSync(path.join(WORKSPACES_PATH, workspace))) {
    await fs.mkdir(path.join(WORKSPACES_PATH, workspace), { recursive: true });
  } else {
    return {
      success: false,
      error: "Workspace already exists",
    };
  }

  return {
    success: true,
  };
}
