import osUtils from "node-os-utils";
import { formatBytesToBytes } from "bytes-transform";
import { monitoring } from "../db/schema";
import { db } from "../db";

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
