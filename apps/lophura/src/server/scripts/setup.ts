import { setupDirectories } from "@lophura/file-system";

(async () => {
  try {
    setupDirectories();
  } catch (e) {
    console.error("Error running Lophura setup", e);
  }
})();
