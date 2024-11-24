// @ts-check
import { config } from "dotenv";

config({ path: "../../.env" });
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // transpilePackages: ["@lophura/server"],
};

export default nextConfig;
