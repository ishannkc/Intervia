import type { NextConfig } from "next";

//ignore warnings when build is deployed during the development
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
