import { spawnSync } from 'node:child_process';
import { access, rename, writeFile } from 'node:fs/promises';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'eriador-living-atlas';
const basePath = repository.endsWith('.github.io') ? '' : `/${repository}`;
const build = spawnSync(process.execPath, ['node_modules/vinext/dist/cli.js', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, ATLAS_GITHUB_PAGES: 'true', NEXT_PUBLIC_BASE_PATH: basePath },
});
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);
await access('dist/client/index.html');
// Vinext includes assetPrefix in its output directories. Pages mounts the
// artifact at that prefix already, so its _next directory belongs at the root.
if (basePath) await rename(`dist/client${basePath}/_next`, 'dist/client/_next');
await writeFile('dist/client/.nojekyll', '');
console.log(`GitHub Pages export ready in dist/client (base path: ${basePath || '/'}).`);
