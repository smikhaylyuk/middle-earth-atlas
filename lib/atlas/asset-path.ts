/** Public files need the repository prefix when served on GitHub Pages. */
export function assetPath(path: `/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
