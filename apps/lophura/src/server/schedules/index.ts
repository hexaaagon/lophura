import { recordStats } from "@lophura/server";
import { CronJob as cron } from "cron";

export async function initializeSchedules() {
  // Monitoring
  const monitoringJob = new cron(
    "*/10 * * * * *",
    async () => {
      await recordStats();
    },
    null,
    true,
    process.env.TZ
  );
}
