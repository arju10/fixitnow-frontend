import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Disable Turbopack to avoid crashes
  turbopack: false,
};

export default nextConfig;
