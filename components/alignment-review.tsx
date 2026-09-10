'use client';
/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- The composite map implements keyboard pan and zoom. */
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Compass, Minus, Plus, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import reference from '@/lib/atlas/alignment/reference.json';
import study from '@/lib/atlas/alignment/study.json';
import {
  AlignmentRenderer,
  fitAlignment,
  zoomAlignment,
  type AlignmentMode,
  type AlignmentView,
} from '@/lib/atlas/alignment/renderer';
import './alignment-review.css';
const modeLabels: Record<AlignmentMode, string> = {
  reference: 'Reference',
  current: 'Current placement',
  proposed: 'Fitted study',
};
export default function AlignmentReview() {
  const canvas = useRef<HTMLCanvasElement>(null),
    stage = useRef<HTMLDivElement>(null),
    renderer = useRef<AlignmentRenderer | null>(null),
    view = useRef<AlignmentView>({ x: 0, y: 0, scale: 1 }),
    size = useRef({ width: 1, height: 1 }),
    pointers = useRef(new Map<number, { x: number; y: number }>());
  const [mode, setMode] = useState<AlignmentMode>('current'),
    [opacity, setOpacity] = useState(90),
    [mesh, setMesh] = useState(false),
    [selected, setSelected] = useState<string | null>('minas-tirith');
  const [loading, setLoading] = useState({ cached: 0, pending: 0, failed: 0 }),
    [zoom, setZoom] = useState(1),
    [error, setError] = useState(false);
  const state = useRef({ mode, opacity: opacity / 100, mesh, selected });
  const paint = () => {
    renderer.current?.update(view.current, state.current);
    setZoom(view.current.scale);
  };
  useEffect(() => {
    if (!canvas.current || !stage.current) return;
    let r: AlignmentRenderer;
    try {
      r = new AlignmentRenderer(canvas.current, setLoading);
    } catch {
      queueMicrotask(() => setError(true));
      return;
    }
    renderer.current = r;
    let initialized = false;
    const resize = () => {
      const el = stage.current!;
      size.current = { width: el.clientWidth, height: el.clientHeight };
      r.resize(el.clientWidth, el.clientHeight);
      if (!initialized) {
        view.current = fitAlignment(el.clientWidth, el.clientHeight);
        initialized = true;
      }
      r.update(view.current, state.current);
      setZoom(view.current.scale);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage.current);
    resize();
    const element = stage.current;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const b = element.getBoundingClientRect(),
        delta =
          event.deltaY *
          (event.deltaMode === 1
            ? 16
            : event.deltaMode === 2
              ? size.current.height
              : 1);
      view.current = zoomAlignment(
        view.current,
        Math.exp(-delta * 0.0015),
        event.clientX - b.left,
        event.clientY - b.top,
        fitAlignment(size.current.width, size.current.height).scale * 0.7,
      );
      r.update(view.current, state.current);
      setZoom(view.current.scale);
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', wheel);
      r.destroy();
      renderer.current = null;
    };
  }, []);
  useEffect(() => {
    state.current = { mode, opacity: opacity / 100, mesh, selected };
    renderer.current?.update(view.current, state.current);
  }, [mode, opacity, mesh, selected]);
  const anchor = study.anchors.find((a) => a.id === selected),
    triangles = study.triangles.filter(
      (t) => selected && t.ids.includes(selected),
    );
  const focus = (id: string) => {
    setSelected(id);
    const a = study.anchors.find((p) => p.id === id);
    if (!a) return;
    view.current = {
      scale: 2,
      x: size.current.width * 0.5 - a.reference[0] * 2,
      y: size.current.height * 0.5 - a.reference[1] * 2,
    };
    paint();
  };
  const originalDetail = () => {
    if (!anchor?.baseline) return;
    const scale = 0.9 / Math.hypot(study.baseline[0], study.baseline[1]);
    setMode('current');
    view.current = {
      scale,
      x: size.current.width * 0.5 - anchor.baseline[0] * scale,
      y: size.current.height * 0.5 - anchor.baseline[1] * scale,
    };
    paint();
  };
  const reset = () => {
    view.current = fitAlignment(size.current.width, size.current.height);
    paint();
  };
  const adjust = (factor: number) => {
    view.current = zoomAlignment(
      view.current,
      factor,
      size.current.width / 2,
      size.current.height / 2,
      fitAlignment(size.current.width, size.current.height).scale * 0.7,
    );
    paint();
  };
  return (
    <main className="alignment-review">
      <header className="alignment-header">
        <div className="alignment-brand">
          <Compass size={30} />
          <div>
            <p>MIDDLE-EARTH ATLAS</p>
            <h1>A common geography</h1>
          </div>
        </div>
        <a href="https://smikhaylyuk.github.io/middle-earth-atlas/">
          <ArrowLeft size={16} /> Open the living atlas
        </a>
      </header>
      <div className="alignment-layout">
        <section
          className="alignment-workspace"
          aria-label="Whole-map alignment comparison"
        >
          <div className="alignment-toolbar">
            <div className="alignment-modes" aria-label="Comparison layer">
              {(['reference', 'current', 'proposed'] as const).map((value) => (
                <Button
                  key={value}
                  variant="ghost"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                >
                  {modeLabels[value]}
                </Button>
              ))}
            </div>
            <span className="alignment-study-label">
              Alignment study · Original detail retained
            </span>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- This composite map implements pointer and keyboard navigation. */}
          <div
            ref={stage}
            className="alignment-stage"
            role="application"
            tabIndex={0}
            aria-label="Alignment map. Drag to pan. Scroll or pinch to zoom. Arrow keys pan, plus and minus zoom."
            onKeyDown={(e) => {
              if (
                ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                  e.key,
                )
              ) {
                e.preventDefault();
                view.current = {
                  ...view.current,
                  x:
                    view.current.x +
                    (e.key === 'ArrowLeft'
                      ? 60
                      : e.key === 'ArrowRight'
                        ? -60
                        : 0),
                  y:
                    view.current.y +
                    (e.key === 'ArrowUp'
                      ? 60
                      : e.key === 'ArrowDown'
                        ? -60
                        : 0),
                };
                paint();
              } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                adjust(1.4);
              } else if (e.key === '-') {
                e.preventDefault();
                adjust(1 / 1.4);
              }
            }}
            onPointerDown={(e) => {
              if (e.button > 0) return;
              e.preventDefault();
              e.currentTarget.focus({ preventScroll: true });
              e.currentTarget.setPointerCapture(e.pointerId);
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            }}
            onPointerMove={(e) => {
              const previous = pointers.current.get(e.pointerId);
              if (!previous) return;
              const before = [...pointers.current.values()];
              pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              const after = [...pointers.current.values()];
              if (after.length === 2) {
                const a = Math.hypot(
                    before[0].x - before[1].x,
                    before[0].y - before[1].y,
                  ),
                  b = Math.hypot(
                    after[0].x - after[1].x,
                    after[0].y - after[1].y,
                  ),
                  rect = e.currentTarget.getBoundingClientRect();
                if (a > 1)
                  view.current = zoomAlignment(
                    view.current,
                    b / a,
                    (after[0].x + after[1].x) / 2 - rect.left,
                    (after[0].y + after[1].y) / 2 - rect.top,
                    fitAlignment(size.current.width, size.current.height)
                      .scale * 0.7,
                  );
              } else
                view.current = {
                  ...view.current,
                  x: view.current.x + e.clientX - previous.x,
                  y: view.current.y + e.clientY - previous.y,
                };
              paint();
            }}
            onPointerUp={(e) => pointers.current.delete(e.pointerId)}
            onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
            onLostPointerCapture={(e) => pointers.current.delete(e.pointerId)}
          >
            <canvas
              ref={canvas}
              aria-label="The locked Tolkien reference, with current or fitted painted coverage. Areas requiring severe distortion are left visible for repainting."
            />
            {(error || loading.failed > 0) && (
              <div role="alert" className="alignment-error">
                Some map imagery could not load. Reload this preview to try
                again.
              </div>
            )}
          </div>
          <div className="alignment-map-footer">
            <p>
              {mode === 'reference'
                ? 'Locked reference · north is up'
                : mode === 'current'
                  ? 'One uniform fit · dashed line shows the selected landmark’s displacement'
                  : 'Conservative fit · severe distortion is marked for repainting'}
            </p>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjust(1 / 1.5)}
                aria-label="Zoom out"
              >
                <Minus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={reset}
                aria-label="Fit whole reference"
              >
                <Scan size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjust(1.5)}
                aria-label="Zoom in"
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </section>
        <aside className="alignment-sidebar">
          <p className="alignment-eyebrow">GEOGRAPHY BEFORE EXPANSION</p>
          <h2>
            Keep the detail.
            <br />
            Correct the positions.
          </h2>
          <p>
            The original painting stays intact. This study shows where it can be
            refitted and where its shapes need repainting.
          </p>
          <label className="alignment-field">
            Inspect a place
            <select
              value={selected ?? ''}
              onChange={(e) => focus(e.target.value)}
            >
              {study.anchors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.role === 'future' ? ' · future area' : ''}
                </option>
              ))}
            </select>
          </label>
          {anchor && (
            <div className="alignment-place" aria-live="polite">
              <h3>{anchor.name}</h3>
              <p>
                {anchor.role === 'control'
                  ? 'Mapped landmark'
                  : anchor.role === 'support'
                    ? 'Approximate regional support'
                    : 'Future coverage reservation'}
              </p>
              <p>{anchor.note}</p>
              <dl>
                <div>
                  <dt>Reference tolerance</dt>
                  <dd>±{anchor.uncertainty} map pixels</dd>
                </div>
                {anchor.error !== null && (
                  <div>
                    <dt>Uniform-fit displacement</dt>
                    <dd>{Math.round(anchor.error)} map pixels</dd>
                  </div>
                )}
              </dl>
              {triangles.some((t) => t.action === 'repaint') && (
                <p className="alignment-caution">
                  Nearby artwork needs rebuilding or close review. Moving this
                  marker alone will not correct the terrain.
                </p>
              )}
              <div className="alignment-place-actions">
                <Button variant="outline" onClick={() => focus(anchor.id)}>
                  Inspect location
                </Button>
                {anchor.current && (
                  <Button variant="outline" onClick={originalDetail}>
                    Original detail
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="alignment-controls">
            <label className="alignment-field">
              Artwork visibility <span>{opacity}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                disabled={mode === 'reference'}
              />
            </label>
            <label className="alignment-check">
              <input
                type="checkbox"
                checked={mesh}
                onChange={(e) => setMesh(e.target.checked)}
                disabled={mode !== 'proposed'}
              />{' '}
              Show distortion areas
            </label>
            {mesh && (
              <p className="alignment-legend">
                <span>Green: modest refit</span>
                <span>Ochre: inspect</span>
                <span>Rust: repaint</span>
              </p>
            )}
          </div>
          <details>
            <summary>What has been checked</summary>
            <p>
              {study.metrics.controls} mapped control points establish the
              uniform comparison. Additional regional supports are approximate
              and are identified separately.
            </p>
            <p>
              {study.metrics.folds} fitted triangles reverse orientation. They
              are deliberately left unpainted. A perfect fit at control points
              does not establish river or coastline accuracy between them.
            </p>
            <p>
              Town plans, river bends and all secondary landmarks still require
              the detailed geographic pass.
            </p>
          </details>
          <details>
            <summary>Zoom and detail</summary>
            <p>
              Close zoom requests lossless tiles from the existing painting. The
              preview retains the current 6030 × 7500 source pixels; it does not
              flatten the atlas into a small overview image.
            </p>
            <p>
              Replacement artwork will need consistent detail at the corrected
              geographic scale. This fit cannot create missing detail or
              preserve architecture through severe stretching.
            </p>
            <p className="alignment-runtime">
              View scale {zoom.toFixed(2)} · {loading.cached} of 48 cached tiles
              {loading.pending ? ' · loading detail' : ''}
            </p>
          </details>
          <a
            className="alignment-source"
            href={reference.sources.general.url}
            target="_blank"
            rel="noreferrer"
          >
            Christopher Tolkien’s reference map ↗
          </a>
          <p className="alignment-credit">
            Reference map © The Tolkien Estate. Used here for the alignment
            comparison.
          </p>
        </aside>
      </div>
    </main>
  );
}
