import reference from './reference.json';
import study from './study.json';
import tiles from './tiles.json';
import { assetPath } from '../asset-path';
export type AlignmentMode = 'reference' | 'current' | 'proposed';
export type AlignmentView = { x: number; y: number; scale: number };
export type AlignmentSettings = {
  mode: AlignmentMode;
  opacity: number;
  mesh: boolean;
  selected: string | null;
};
type Tile = (typeof tiles.levels)[number]['tiles'][number];
type Triangle = (typeof study.triangles)[number];
type Bounds = { left: number; top: number; right: number; bottom: number };
const bbox = (points: number[][]): Bounds => ({
  left: Math.min(...points.map((p) => p[0])),
  right: Math.max(...points.map((p) => p[0])),
  top: Math.min(...points.map((p) => p[1])),
  bottom: Math.max(...points.map((p) => p[1])),
});
const overlaps = (a: Bounds, b: Bounds) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const point = (m: number[], p: number[]) => [
  m[0] * p[0] + m[2] * p[1] + m[4],
  m[1] * p[0] + m[3] * p[1] + m[5],
];
const levelBounds = (t: Tile) => ({
  left: t.x,
  top: t.y,
  right: t.x + t.w,
  bottom: t.y + t.h,
});
export function fitAlignment(width: number, height: number): AlignmentView {
  const scale = Math.min(
    (width - 44) / reference.width,
    (height - 44) / reference.height,
  );
  return {
    scale,
    x: (width - reference.width * scale) / 2,
    y: (height - reference.height * scale) / 2,
  };
}
export function zoomAlignment(
  view: AlignmentView,
  factor: number,
  x: number,
  y: number,
  min: number,
) {
  const scale = Math.max(
      min,
      Math.min(reference.detailPolicy.maximumViewScale, view.scale * factor),
    ),
    r = scale / view.scale;
  return { scale, x: x - (x - view.x) * r, y: y - (y - view.y) * r };
}
export class AlignmentRenderer {
  private ctx: CanvasRenderingContext2D;
  private images = new Map<string, { image: HTMLImageElement; used: number }>();
  private pending = new Set<string>();
  private failed = new Set<string>();
  private queue: string[] = [];
  private wanted = new Set<string>();
  private referenceImage: HTMLImageElement | null = null;
  private stopped = false;
  private requests = 0;
  private ticks = 0;
  private frame = 0;
  private width = 1;
  private height = 1;
  private ratio = 1;
  private view: AlignmentView = { x: 0, y: 0, scale: 1 };
  private settings: AlignmentSettings = {
    mode: 'proposed',
    opacity: 1,
    mesh: false,
    selected: null,
  };
  constructor(
    private canvas: HTMLCanvasElement,
    private changed: (s: {
      cached: number;
      pending: number;
      failed: number;
    }) => void,
  ) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas is unavailable');
    this.ctx = ctx;
    const image = new Image();
    image.onload = () => {
      if (this.stopped) return;
      this.referenceImage = image;
      this.schedule();
    };
    image.onerror = () => {
      this.failed.add(reference.sources.general.image);
      this.report();
    };
    image.src = assetPath(reference.sources.general.image as `/${string}`);
  }
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.ratio = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(width * this.ratio);
    this.canvas.height = Math.round(height * this.ratio);
    this.schedule();
  }
  update(view: AlignmentView, settings: AlignmentSettings) {
    this.view = view;
    this.settings = settings;
    this.schedule();
  }
  destroy() {
    this.stopped = true;
    cancelAnimationFrame(this.frame);
    this.images.clear();
    this.queue = [];
    this.referenceImage = null;
  }
  private report() {
    this.changed({
      cached: this.images.size,
      pending: this.pending.size + this.queue.length,
      failed: this.failed.size,
    });
  }
  private schedule() {
    if (this.frame || this.stopped) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.draw();
    });
  }
  private want(path: string) {
    if (
      !this.wanted.has(path) &&
      this.wanted.size >= reference.detailPolicy.maxDecodedTiles
    )
      return;
    this.wanted.add(path);
    if (
      this.images.has(path) ||
      this.pending.has(path) ||
      this.queue.includes(path) ||
      this.failed.has(path)
    )
      return;
    this.queue.push(path);
  }
  private pump() {
    while (this.requests < 6 && this.queue.length) {
      const path = this.queue.shift()!;
      if (!this.wanted.has(path)) continue;
      this.requests++;
      this.pending.add(path);
      const image = new Image();
      image.decoding = 'async';
      const finish = () => {
        this.requests--;
        this.pending.delete(path);
        this.report();
        this.pump();
      };
      image.onload = () => {
        if (this.stopped) return;
        this.images.set(path, { image, used: ++this.ticks });
        while (this.images.size > reference.detailPolicy.maxDecodedTiles) {
          const entries = [...this.images.entries()].sort(
            (a, b) => a[1].used - b[1].used,
          );
          const stale =
            entries.find(([key]) => !this.wanted.has(key)) ?? entries[0];
          this.images.delete(stale[0]);
        }
        finish();
        this.schedule();
      };
      image.onerror = () => {
        if (this.stopped) return;
        this.failed.add(path);
        finish();
      };
      image.src = assetPath(path as `/${string}`);
    }
  }
  private paintSource(
    matrix: number[],
    viewport: Bounds,
    sourceBounds: Bounds | null,
    target: number[][] | null,
    high: number,
  ) {
    const ctx = this.ctx,
      { scale } = this.view;
    const factor =
      scale * high * this.ratio > 0.7
        ? 1
        : scale * high * this.ratio > 0.32
          ? 2
          : 4;
    ctx.save();
    if (target) {
      ctx.beginPath();
      target.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.clip();
    }
    ctx.transform(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5],
    );
    for (const level of tiles.levels) {
      if (level.factor < factor) continue;
      for (const tile of level.tiles) {
        const b = levelBounds(tile);
        if (sourceBounds && !overlaps(b, sourceBounds)) continue;
        const mapped = bbox(
          [
            [b.left, b.top],
            [b.right, b.top],
            [b.right, b.bottom],
            [b.left, b.bottom],
          ].map((p) => point(matrix, p)),
        );
        if (!overlaps(mapped, viewport)) continue;
        this.want(tile.path);
        const entry = this.images.get(tile.path);
        if (!entry) continue;
        entry.used = ++this.ticks;
        ctx.drawImage(
          entry.image,
          0,
          0,
          tile.width,
          tile.height,
          tile.x,
          tile.y,
          tile.w,
          tile.h,
        );
      }
    }
    ctx.restore();
  }
  private triangle(t: Triangle) {
    const ctx = this.ctx;
    ctx.beginPath();
    t.target.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  }
  private draw() {
    const ctx = this.ctx,
      { x, y, scale } = this.view,
      { mode, opacity, mesh, selected } = this.settings;
    this.wanted.clear();
    if (mode !== 'reference')
      for (const tile of tiles.levels[0].tiles) this.want(tile.path);
    ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    ctx.fillStyle = '#e9e3cf';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (this.referenceImage) {
      ctx.globalAlpha = mode === 'reference' ? 1 : 0.34;
      ctx.drawImage(
        this.referenceImage,
        0,
        0,
        reference.width,
        reference.height,
      );
      ctx.globalAlpha = 1;
    }
    const viewport = {
      left: -x / scale,
      top: -y / scale,
      right: (this.width - x) / scale,
      bottom: (this.height - y) / scale,
    };
    ctx.globalAlpha = opacity;
    if (mode === 'current')
      this.paintSource(
        study.baseline,
        viewport,
        null,
        null,
        Math.hypot(study.baseline[0], study.baseline[1]),
      );
    if (mode === 'proposed')
      for (const t of [...study.triangles].sort((a, b) => {
        const distance = (t: Triangle) =>
          Math.hypot(
            t.target.reduce((sum, p) => sum + p[0] / 3, 0) -
              (viewport.left + viewport.right) / 2,
            t.target.reduce((sum, p) => sum + p[1] / 3, 0) -
              (viewport.top + viewport.bottom) / 2,
          );
        return distance(a) - distance(b);
      })) {
        if (!overlaps(bbox(t.target), viewport)) continue;
        if (t.action === 'repaint' || !t.matrix) continue;
        this.paintSource(t.matrix, viewport, bbox(t.source), t.target, t.high);
      }
    ctx.globalAlpha = 1;
    if (mode === 'proposed')
      for (const t of study.triangles) {
        if (
          !overlaps(bbox(t.target), viewport) ||
          (!mesh && t.action !== 'repaint')
        )
          continue;
        this.triangle(t);
        ctx.fillStyle =
          t.action === 'repaint'
            ? '#b6604333'
            : t.action === 'review'
              ? '#b08b4420'
              : '#3a766c22';
        ctx.fill();
        ctx.strokeStyle = t.folded ? '#a3452d' : '#314c4555';
        ctx.lineWidth = 1 / scale;
        ctx.stroke();
        if (t.action === 'repaint') {
          const p = t.target.reduce(
            (a, v) => [a[0] + v[0] / 3, a[1] + v[1] / 3],
            [0, 0],
          );
          ctx.fillStyle = '#773621';
          ctx.font = `500 ${11 / scale}px system-ui`;
          ctx.textAlign = 'center';
          if (scale > 0.65 || t.folded) ctx.fillText('Repaint', p[0], p[1]);
        }
      }
    ctx.restore();
    const active = study.anchors.find((a) => a.id === selected);
    for (const a of study.anchors) {
      if (a.role === 'future' && scale < 0.3 && a.id !== selected) continue;
      const [rx, ry] = a.reference,
        px = x + rx * scale,
        py = y + ry * scale;
      if (px < 0 || py < 0 || px > this.width || py > this.height) continue;
      const isActive = a.id === selected;
      ctx.strokeStyle = isActive
        ? '#ae5d38'
        : a.role === 'future'
          ? '#476c77'
          : '#f4e4b7';
      ctx.fillStyle = a.role === 'future' ? '#476c77' : '#244a42';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.beginPath();
      ctx.arc(px, py, isActive ? 6 : 3, 0, Math.PI * 2);
      if (a.role !== 'future') ctx.fill();
      ctx.stroke();
      if (isActive || scale > 0.55) {
        ctx.font = '500 12px system-ui';
        ctx.textAlign = 'left';
        const tw = ctx.measureText(a.name).width;
        const lx = Math.min(this.width - tw - 10, Math.max(8, px + 10)),
          ly = Math.max(16, py - 9);
        ctx.fillStyle = '#f2ecdadf';
        ctx.fillRect(lx - 3, ly - 12, tw + 6, 17);
        ctx.fillStyle = '#203e36';
        ctx.fillText(a.name, lx, ly);
      }
    }
    if (active?.baseline && mode === 'current') {
      const a = active.baseline,
        b = active.reference;
      ctx.strokeStyle = '#a3452d';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(x + a[0] * scale, y + a[1] * scale);
      ctx.lineTo(x + b[0] * scale, y + b[1] * scale);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(x + a[0] * scale, y + a[1] * scale, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    this.pump();
  }
}
