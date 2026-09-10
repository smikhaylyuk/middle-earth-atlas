import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import {
  affine,
  apply,
  area,
  distortion,
  similarity,
  study,
  triangulate,
} from '../lib/atlas/alignment/geometry.mjs';
import reference from '../lib/atlas/alignment/reference.json' with { type: 'json' };
import generated from '../lib/atlas/alignment/study.json' with { type: 'json' };
import tiles from '../lib/atlas/alignment/tiles.json' with { type: 'json' };

const close = (actual, expected) =>
  actual.forEach((v, i) =>
    assert.ok(Math.abs(v - expected[i]) < 1e-7, `${actual} != ${expected}`),
  );

await test('uniform registration recovers scale, rotation and translation without introducing stretch', () => {
  const transform = [2, 1, -1, 2, 37, -19];
  const pairs = [
    [0, 0],
    [7, 0],
    [0, 8],
    [9, 13],
  ].map((current) => ({ current, reference: apply(transform, current) }));
  close(similarity(pairs), transform);
  assert.equal(distortion(similarity(pairs)).ratio, 1);
  assert.throws(
    () => similarity([{ current: [0, 0], reference: [0, 0] }]),
    /two controls/,
  );
  assert.throws(() => similarity([pairs[0], pairs[0]]), /Coincident/);
});

await test('regional fitting maps all vertices and identifies mirrored or stretched terrain', () => {
  const source = [
      [0, 0],
      [10, 0],
      [0, 10],
    ],
    target = [
      [5, 7],
      [25, 7],
      [5, 37],
    ];
  const m = affine(source, target);
  source.forEach((p, i) => close(apply(m, p), target[i]));
  assert.equal(distortion(m).ratio, 1.5);
  assert.equal(
    distortion(
      affine(source, [
        [0, 0],
        [-10, 0],
        [0, 10],
      ]),
    ).folded,
    true,
  );
  assert.equal(
    affine(
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      target,
    ),
    null,
  );
});

await test('reference triangulation covers a square once without inverted or degenerate faces', () => {
  const points = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
    [4, 6],
  ];
  const triangles = triangulate(points);
  assert.equal(triangles.length, 4);
  const areas = triangles.map((t) => area(...t.map((i) => points[i])) / 2);
  assert.ok(areas.every((a) => a > 0));
  assert.equal(
    areas.reduce((a, b) => a + b, 0),
    100,
  );
  const edges = new Map();
  for (const t of triangles)
    for (let k = 0; k < 3; k++) {
      const edge = [t[k], t[(k + 1) % 3]].sort((a, b) => a - b).join(':');
      edges.set(edge, (edges.get(edge) ?? 0) + 1);
    }
  assert.ok([...edges.values()].every((n) => n <= 2));
});

await test('approximate supports cannot pull the baseline away from the mapped controls', () => {
  const anchors = [
    { id: 'a', role: 'control', current: [0, 0], reference: [10, 20] },
    { id: 'b', role: 'control', current: [10, 0], reference: [20, 20] },
    { id: 'c', role: 'control', current: [0, 10], reference: [10, 30] },
    { id: 'uncertain', role: 'support', current: [4, 5], reference: [90, 90] },
  ];
  close(study(anchors).baseline, [1, 0, 0, 1, 10, 20]);
  const flipped = study(anchors).triangles.filter((t) => t.folded);
  assert.ok(flipped.every((t) => t.action === 'repaint'));
});

await test('the saved study is reproducible and every digitized location has provenance and uncertainty', () => {
  assert.deepEqual(generated, study(reference.anchors));
  assert.equal(
    new Set(reference.anchors.map((a) => a.id)).size,
    reference.anchors.length,
  );
  for (const a of reference.anchors) {
    assert.ok(reference.sources[a.source]?.url.startsWith('https://'));
    assert.ok(a.uncertainty > 0 && a.note.length > 10);
    assert.ok(a.reference[0] >= 0 && a.reference[0] <= reference.width);
    assert.ok(a.reference[1] >= 0 && a.reference[1] <= reference.height);
    assert.equal(Boolean(a.current), a.role !== 'future');
  }
  assert.ok(
    generated.triangles.filter((t) => t.folded).length > 0,
    'Retain visible diagnostics for the current topological conflicts',
  );
  for (const t of generated.triangles)
    if (t.folded || t.ratio > 2) assert.equal(t.action, 'repaint');
});

await test('native detail tiles retain the source pixels and cover every nontransparent source pixel', async () => {
  const source = await sharp(tiles.source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.equal(source.info.width, tiles.width);
  assert.equal(source.info.height, tiles.height);
  const level = tiles.levels.find((l) => l.factor === 1),
    occupied = new Set();
  for (let y = 0; y < tiles.height; y++)
    for (let x = 0; x < tiles.width; x++)
      if (source.data[(y * tiles.width + x) * 4 + 3])
        occupied.add(`${Math.floor(x / 512)}-${Math.floor(y / 512)}`);
  const present = new Set(level.tiles.map((t) => `${t.x / 512}-${t.y / 512}`));
  assert.deepEqual(present, occupied);
  // Check full tiles across the north, centre and south, including their edges.
  for (const t of [
    level.tiles[0],
    level.tiles[Math.floor(level.tiles.length / 2)],
    level.tiles.at(-1),
  ]) {
    const image = await sharp(`public${t.path}`)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.equal(image.info.width, t.width);
    assert.equal(image.info.height, t.height);
    for (let y = 0; y < t.height; y++)
      for (let x = 0; x < t.width; x++) {
        const from = ((t.y + y) * tiles.width + t.x + x) * 4,
          to = (y * t.width + x) * 4;
        assert.equal(image.data[to + 3], source.data[from + 3]);
        if (source.data[from + 3])
          for (let c = 0; c < 3; c++)
            assert.equal(image.data[to + c], source.data[from + c]);
      }
  }
  const referenceImage = await sharp(
    `public${reference.sources.general.image}`,
  ).metadata();
  assert.equal(referenceImage.width, reference.width);
  assert.equal(referenceImage.height, reference.height);
  assert.ok((await readFile(tiles.source)).length > 0);
});
