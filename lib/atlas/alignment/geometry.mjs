// All targets use the locked reference scan's plane. These functions do not
// infer geography from artwork; the fit is a diagnostic of required changes.
export const area = (a, b, c) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
export function similarity(pairs) {
  const n = pairs.length;
  if (n < 2) throw new Error('At least two controls are required');
  const s = [0, 0],
    t = [0, 0];
  for (const p of pairs)
    for (let k = 0; k < 2; k++) {
      s[k] += p.current[k] / n;
      t[k] += p.reference[k] / n;
    }
  let d = 0,
    aa = 0,
    bb = 0;
  for (const p of pairs) {
    const x = p.current[0] - s[0],
      y = p.current[1] - s[1],
      u = p.reference[0] - t[0],
      v = p.reference[1] - t[1];
    d += x * x + y * y;
    aa += x * u + y * v;
    bb += x * v - y * u;
  }
  if (d < 1e-9) throw new Error('Coincident controls');
  const a = aa / d,
    b = bb / d;
  return [a, b, -b, a, t[0] - a * s[0] + b * s[1], t[1] - b * s[0] - a * s[1]];
}
export const apply = (m, p) => [
  m[0] * p[0] + m[2] * p[1] + m[4],
  m[1] * p[0] + m[3] * p[1] + m[5],
];
export function affine(s, t) {
  const d = area(...s);
  if (Math.abs(d) < 1e-8) return null;
  const coeff = (k) => {
    const a =
      ((t[1][k] - t[0][k]) * (s[2][1] - s[0][1]) -
        (t[2][k] - t[0][k]) * (s[1][1] - s[0][1])) /
      d;
    const b =
      ((s[1][0] - s[0][0]) * (t[2][k] - t[0][k]) -
        (s[2][0] - s[0][0]) * (t[1][k] - t[0][k])) /
      d;
    return [a, b, t[0][k] - a * s[0][0] - b * s[0][1]];
  };
  const x = coeff(0),
    y = coeff(1);
  return [x[0], y[0], x[1], y[1], x[2], y[2]];
}
export function distortion(m) {
  const [a, b, c, d] = m,
    det = a * d - b * c,
    trace = a * a + b * b + c * c + d * d;
  const root = Math.sqrt(Math.max(0, trace * trace - 4 * det * det));
  const high = Math.sqrt((trace + root) / 2),
    low = Math.sqrt(Math.max(0, (trace - root) / 2));
  return {
    folded: det <= 0,
    ratio: low > 1e-10 ? high / low : Infinity,
    low,
    high,
  };
}
function insideCircle(p, a, b, c) {
  const ax = a[0] - p[0],
    ay = a[1] - p[1],
    bx = b[0] - p[0],
    by = b[1] - p[1],
    cx = c[0] - p[0],
    cy = c[1] - p[1];
  const v =
    (ax * ax + ay * ay) * (bx * cy - cx * by) -
    (bx * bx + by * by) * (ax * cy - cx * ay) +
    (cx * cx + cy * cy) * (ax * by - bx * ay);
  return area(a, b, c) > 0 ? v > 1e-7 : v < -1e-7;
}
export function triangulate(input) {
  const points = input.map((p) => [...p]),
    n = points.length;
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2,
    cy = (Math.min(...ys) + Math.max(...ys)) / 2,
    r =
      Math.max(
        Math.max(...xs) - Math.min(...xs),
        Math.max(...ys) - Math.min(...ys),
      ) * 16;
  points.push([cx - r, cy - r], [cx + r, cy - r], [cx, cy + r]);
  let tris = [[n, n + 1, n + 2]];
  for (let i = 0; i < n; i++) {
    const bad = tris.filter((t) =>
        insideCircle(points[i], ...t.map((k) => points[k])),
      ),
      edges = new Map();
    for (const t of bad)
      for (let e = 0; e < 3; e++) {
        const a = t[e],
          b = t[(e + 1) % 3],
          key = [a, b].sort((u, v) => u - v).join(':');
        if (edges.has(key)) edges.delete(key);
        else edges.set(key, [a, b]);
      }
    const remove = new Set(bad);
    tris = tris.filter((t) => !remove.has(t));
    for (const [a, b] of edges.values())
      if (Math.abs(area(points[a], points[b], points[i])) > 1e-7)
        tris.push([a, b, i]);
  }
  return tris
    .filter((t) => t.every((i) => i < n))
    .map((t) =>
      area(...t.map((i) => points[i])) < 0 ? [t[1], t[0], t[2]] : t,
    );
}
export function study(anchors) {
  const controls = anchors.filter((a) => a.role === 'control' && a.current),
    supports = anchors.filter((a) => a.current);
  const baseline = similarity(controls);
  const measured = anchors.map((a) => ({
    ...a,
    baseline: a.current ? apply(baseline, a.current) : null,
    error: a.current
      ? Math.hypot(
          ...apply(baseline, a.current).map((v, i) => v - a.reference[i]),
        )
      : null,
  }));
  const triangles = triangulate(supports.map((a) => a.reference)).map(
    (indices, id) => {
      const vertices = indices.map((i) => supports[i]),
        source = vertices.map((a) => a.current),
        target = vertices.map((a) => a.reference),
        matrix = affine(source, target);
      const d = matrix
        ? distortion(matrix)
        : { folded: true, ratio: 1e6, low: 0, high: 0 };
      return {
        id,
        ids: vertices.map((v) => v.id),
        source,
        target,
        matrix,
        ...d,
        ratio: Number.isFinite(d.ratio) ? d.ratio : 1e6,
        action: d.folded
          ? 'repaint'
          : d.ratio > 2
            ? 'repaint'
            : d.ratio > 1.35
              ? 'review'
              : 'refit',
      };
    },
  );
  const errors = measured
    .filter((a) => a.role === 'control')
    .map((a) => a.error)
    .sort((a, b) => a - b);
  return {
    baseline,
    anchors: measured,
    triangles,
    metrics: {
      controls: controls.length,
      medianError:
        (errors[Math.floor((errors.length - 1) / 2)] +
          errors[Math.floor(errors.length / 2)]) /
        2,
      maxError: Math.max(...errors),
      folds: triangles.filter((t) => t.folded).length,
      repaintTriangles: triangles.filter((t) => t.action === 'repaint').length,
    },
  };
}
