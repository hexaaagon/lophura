import os from "os";
import { execSync } from "child_process";
import prettyBytes from "pretty-bytes";

export function getAllSystemInfo() {
  const secondsToHms = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const nodeInfo = {
    nodeVersion: process.version,
    nodeUptime: secondsToHms(process.uptime()),
    memoryUsage: {
      rss: prettyBytes(process.memoryUsage().rss),
      heapTotal: prettyBytes(process.memoryUsage().heapTotal),
      heapUsed: prettyBytes(process.memoryUsage().heapUsed),
      external: prettyBytes(process.memoryUsage().external),
    },
  };

  const platform = os.platform();
  let machineType = "Unknown";

  switch (platform) {
    case "linux":
      machineType = "Linux";
      break;
    case "darwin":
      machineType = "macOS";
      break;
    case "win32":
      machineType = "Windows";
      break;
    default:
      machineType = platform;
  }

  const getDiskUsageRaw = ():
    | { total: number; used: number; available: number }
    | string => {
    try {
      const result = execSync("df --block-size=1 /").toString();
      const lines = result.split("\n")[1].split(/\s+/);
      const total = parseInt(lines[1], 10);
      const used = parseInt(lines[2], 10);
      const available = parseInt(lines[3], 10);
      return { total, used, available };
    } catch (error) {
      return "Disk usage information is not available";
    }
  };

  const diskUsageRaw = getDiskUsageRaw();
  let diskInfo;

  if (typeof diskUsageRaw === "string") {
    diskInfo = { error: diskUsageRaw };
  } else {
    const formattedDiskUsage = {
      total: prettyBytes(diskUsageRaw.total),
      used: prettyBytes(diskUsageRaw.used),
      available: prettyBytes(diskUsageRaw.available),
    };
    diskInfo = {
      raw: diskUsageRaw,
      formatted: formattedDiskUsage,
    };
  }

  const calculateCpuUsage = (): number => {
    const cpus = os.cpus();

    const getTotalCpuTime = (cpu: os.CpuInfo) => {
      const times = cpu.times;
      return times.user + times.nice + times.sys + times.irq + times.idle;
    };

    const startCpuTimes = cpus.map(getTotalCpuTime);
    const startIdleTimes = cpus.map((cpu) => cpu.times.idle);

    // Calculate over a 100ms interval
    const delay = 100; // 100 milliseconds
    const start = Date.now();
    while (Date.now() - start < delay) {}

    const endCpuTimes = os.cpus().map(getTotalCpuTime);
    const endIdleTimes = os.cpus().map((cpu) => cpu.times.idle);

    let totalCpuDiff = 0;
    let totalIdleDiff = 0;

    for (let i = 0; i < cpus.length; i++) {
      totalCpuDiff += endCpuTimes[i] - startCpuTimes[i];
      totalIdleDiff += endIdleTimes[i] - startIdleTimes[i];
    }

    const cpuUsage = (1 - totalIdleDiff / totalCpuDiff) * 100;
    return parseFloat(cpuUsage.toFixed(2)); // Return CPU usage percentage with two decimal places
  };

  const systemInfo = {
    osType: os.type(),
    osRelease: os.release(),
    osPlatform: machineType,
    osArch: os.arch(),
    cpuUsage: calculateCpuUsage(),
    cpuCores: os.cpus().length,
    cpuModel: os.cpus()[0].model,
    totalMemory: prettyBytes(os.totalmem()),
    freeMemory: prettyBytes(os.freemem()),
    systemUptime: secondsToHms(os.uptime()),
    loadAverage: os.loadavg(),
    diskInfo,
  };

  return {
    nodeInfo,
    systemInfo,
  };
}
