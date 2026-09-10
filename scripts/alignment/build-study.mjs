import sharp from 'sharp';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { study } from '../../lib/atlas/alignment/geometry.mjs';
const reference = JSON.parse(
  await readFile('lib/atlas/alignment/reference.json', 'utf8'),
);
const s = study(reference.anchors);
await writeFile(
  'lib/atlas/alignment/study.json',
  JSON.stringify(s, null, 2) + '\n',
);
const file = 'public/images/atlas-linhir.webp',
  size = 512;
const buildKey = createHash('sha256')
  .update(await readFile(file))
  .update(await readFile(new URL(import.meta.url)))
  .digest('hex');
let cached = false;
try {
  const old = JSON.parse(
    await readFile('lib/atlas/alignment/tiles.json', 'utf8'),
  );
  if (old.buildKey === buildKey) {
    await Promise.all(
      old.levels.flatMap((l) => l.tiles).map((t) => access(`public${t.path}`)),
    );
    cached = true;
  }
} catch {
  /* Missing generated assets are rebuilt below. */
}
if (cached) {
  console.log('Alignment tiles are current.');
  process.exit(0);
}
const manifest = {
  buildKey,
  source: file,
  width: 6030,
  height: 7500,
  tileSize: size,
  levels: [],
  pixelPolicy:
    'Lossless tiles from the existing decoded painting; original source retained.',
};
for (const factor of [4, 2, 1]) {
  const width = Math.ceil(manifest.width / factor),
    height = Math.ceil(manifest.height / factor);
  const { data, info } = await sharp(file)
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const level = { factor, width, height, tiles: [] };
  await mkdir(`public/images/alignment/painting/${factor}`, {
    recursive: true,
  });
  for (let y = 0; y < height; y += size)
    for (let x = 0; x < width; x += size) {
      const w = Math.min(size, width - x),
        h = Math.min(size, height - y);
      let visible = false;
      for (let py = y; py < y + h && !visible; py++)
        for (let px = x; px < x + w; px++)
          if (data[(py * width + px) * 4 + 3]) {
            visible = true;
            break;
          }
      if (!visible) continue;
      const path = `/images/alignment/painting/${factor}/${x / size}-${y / size}.webp`;
      await sharp(data, { raw: info })
        .extract({ left: x, top: y, width: w, height: h })
        .webp({ lossless: true, effort: 3 })
        .toFile(`public${path}`);
      level.tiles.push({
        x: x * factor,
        y: y * factor,
        w: w * factor,
        h: h * factor,
        width: w,
        height: h,
        path,
      });
    }
  manifest.levels.push(level);
  console.log(`Saved ${level.tiles.length} tiles at factor ${factor}`);
}
await writeFile(
  'lib/atlas/alignment/tiles.json',
  JSON.stringify(manifest, null, 2) + '\n',
);
console.log(JSON.stringify(s.metrics));
