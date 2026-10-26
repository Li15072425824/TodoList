import type { NextConfig } from "next";

const DATA_API_BASE_URL =
  process.env.DATA_API_BASE_URL ||
  process.env.NEXT_PUBLIC_DATA_API_BASE_URL ||
  "https://data-server-api-test.voyah.cn";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    const upstream = DATA_API_BASE_URL.replace(/\/$/, "");

    return [
      {
        source: "/out/:path*",
        destination: `${upstream}/out/:path*`
      }
    ];
  }
};

export default nextConfig;
