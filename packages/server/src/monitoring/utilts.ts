import osUtils from "node-os-utils";
import { formatBytesToBytes } from "bytes-transform";
import { monitoring } from "../db/schema";
import { db } from "../db";
import { gt, lt, sql } from "drizzle-orm";

export async function recordStats() {
  const diskUsage = await calculateDisk();
  const memoryUsage = await calculateMemory();
  const cpuUsage = await calculateCpu();

  const data: typeof monitoring.$inferInsert = {
    diskUsage,
    memoryUsage,
    cpuUsage,
  };

  await db.insert(monitoring).values(data);
  await clean();
}

async function clean() {
  const list = await db.select().from(monitoring);

  // Delete data older than 1 hour
  await db
    .delete(monitoring)
    .where(lt(monitoring.createdAt, new Date(Date.now() - 60 * 60 * 1000)));
}

async function calculateDisk() {
  return formatBytesToBytes(+(await osUtils.drive.info("/")).usedGb, "GB");
}

async function calculateMemory() {
  return formatBytesToBytes(+(await osUtils.mem.info()).usedMemMb, "MB");
}

async function calculateCpu() {
  return await osUtils.cpu.usage();
}
