import path from "node:path";

export const paths = () => {
  const BASE_PATH =
    process.env.NODE_ENV === "production"
      ? "/etc/lophura"
      : path.join(process.cwd(), ".storage");

  return {
    BASE_PATH,
    WORKSPACES_PATH: path.join(BASE_PATH, "workspaces"),
    MONITORING_PATH: path.join(BASE_PATH, "monitoring"),
  };
};
