import fs from "fs-extra";
import { paths } from "../constants";

export async function setupDirectories() {
  const directories = Object.values(paths());

  for (const directory of directories) {
    try {
      if (!fs.existsSync(directory)) {
        await fs.mkdir(directory, { recursive: true });
      }
    } catch (e) {
      console.error(e, " On path ", directory);
    }
  }
}
