import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./data/**/*'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
