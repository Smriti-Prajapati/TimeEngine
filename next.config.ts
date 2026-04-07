import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/TimeEngine",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
