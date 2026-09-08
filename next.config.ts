import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.ATLAS_GITHUB_PAGES === 'true'
  ? {
      output: 'export',
      assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '/eriador-living-atlas',
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
