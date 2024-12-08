import path from "node:path";
import { paths } from "../constants";

const { WORKSPACES_PATH } = paths();
export const workspacePath = (workspaceName: string) =>
  path.join(WORKSPACES_PATH, workspaceName);
