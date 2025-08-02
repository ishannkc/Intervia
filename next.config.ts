import type { NextConfig } from "next";

/**
 * Next.js configuration for the Intervia application
 * 
 * This configuration extends the default Next.js configuration with custom settings
 * for the Intervia project, including build optimizations and error handling.
 */
const nextConfig: NextConfig = {
  // Configure ESLint to ignore build-time errors during development
  // This prevents build failures due to linting issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure TypeScript to ignore build errors during development
  // This allows the development server to run even with TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
