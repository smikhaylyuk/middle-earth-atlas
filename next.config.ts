import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.ATLAS_GITHUB_PAGES === 'true'
  ? {
      output: 'export',
      assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '/middle-earth-atlas',
      // Vinext beta.5 prerenders /alignment without following the redirect
      // produced by trailingSlash: true. Pages directory entries are emitted
      // explicitly after export in scripts/build-pages.mjs.
      trailingSlash: false,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
