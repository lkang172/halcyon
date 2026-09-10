"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { blobPath, rand } from "@/lib/blob";
import type { FlatLayout, FlatNode } from "@/lib/tree";

const MIN_SCALE = 0.3;
const MAX_SCALE = 2.2;

type Offset = { dx: number; dy: number };
type Offsets = Record<string, Offset>;

function loadOffsets(key: string): Offsets {
  try {
    const raw = window.localStorage.getItem(`halcyon:tree:${key}`);
    return raw ? (JSON.parse(raw) as Offsets) : {};
  } catch {
    return {};
  }
}

function saveOffsets(key: string, offsets: Offsets) {
  try {
    if (Object.keys(offsets).length === 0) window.localStorage.removeItem(`halcyon:tree:${key}`);
    else window.localStorage.setItem(`halcyon:tree:${key}`, JSON.stringify(offsets));
  } catch {
    /* private browsing, blocked storage: the arrangement just will not persist */
  }
}

/** Deterministic wobble in [-1, 1], used to bend each edge its own way. */
function wobble(seed: number, salt: number) {
  return rand(seed * 7919 + salt * 104729) * 2 - 1;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export default function TreeCanvas({
  layout,
  storageKey,
}: {
  layout: FlatLayout;
  storageKey: string;
}) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [offsets, setOffsets] = useState<Offsets>({});
  const [panning, setPanning] = useState(false);
  const [held, setHeld] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [restored, setRestored] = useState(0);

  const pan = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const nodeDrag = useRef<{ id: string; px: number; py: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  // Mirrored in a ref so the pointer-up handler always persists the latest
  // arrangement rather than whatever the closure captured.
  const offsetsRef = useRef<Offsets>({});
  useEffect(() => {
    offsetsRef.current = offsets;
  }, [offsets]);

  useEffect(() => {
    const saved = loadOffsets(storageKey);
    offsetsRef.current = saved;
    setOffsets(saved);
    setRestored((n) => n + 1);
  }, [storageKey]);

  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);

  const posOf = useCallback(
    (id: string): [number, number] => {
      const n = byId.get(id);
      if (!n) return [0, 0];
      const o = offsets[id];
      return [n.x + (o?.dx ?? 0), n.y + (o?.dy ?? 0)];
    },
    [byId, offsets],
  );

  // Every edge from the hovered node up to the root, so the lineage reads at a glance.
  const litEdges = useMemo(() => {
    const lit = new Set<string>();
    let cursor = hover;
    while (cursor) {
      const node = byId.get(cursor);
      if (!node?.parentId) break;
      lit.add(`${node.parentId}->${node.id}`);
      cursor = node.parentId;
    }
    return lit;
  }, [hover, byId]);

  /**
   * Frames the tree as it actually stands, blob extents and any dragged
   * positions included, so nothing is ever clipped on arrival.
   */
  const fit = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of layout.nodes) {
      const o = offsetsRef.current[n.id];
      const x = n.x + (o?.dx ?? 0);
      const y = n.y + (o?.dy ?? 0);
      minX = Math.min(minX, x - n.rx);
      maxX = Math.max(maxX, x + n.rx);
      minY = Math.min(minY, y - n.ry);
      maxY = Math.max(maxY, y + n.ry);
    }
    if (!Number.isFinite(minX)) return;

    const margin = 48;
    const spanX = maxX - minX + margin * 2;
    const spanY = maxY - minY + margin * 2;
    const scale = Math.min(width / spanX, height / spanY, 1.4);
    setView({
      x: (width - spanX * scale) / 2 - (minX - margin) * scale,
      y: (height - spanY * scale) / 2 - (minY - margin) * scale,
      scale,
    });
  }, [layout.nodes]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    fit();
    // The canvas is a flex child, so its box settles after layout rather than
    // at mount; a resize observer catches that as well as window resizes.
    const observer = new ResizeObserver(() => fit());
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, restored]);

  // Registered manually because React attaches wheel listeners passively.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      setView((v) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * Math.exp(-e.deltaY * 0.0015)));
        const k = next / v.scale;
        return { scale: next, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoomBy = (factor: number) =>
    setView((v) => {
      const el = wrap.current;
      if (!el) return v;
      const { width, height } = el.getBoundingClientRect();
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
      const k = next / v.scale;
      return {
        scale: next,
        x: width / 2 - (width / 2 - v.x) * k,
        y: height / 2 - (height / 2 - v.y) * k,
      };
    });

  const scatter = () => {
    setOffsets({});
    saveOffsets(storageKey, {});
    fit();
  };

  const startPan = (e: React.PointerEvent) => {
    pan.current = { px: e.clientX, py: e.clientY, ox: view.x, oy: view.y };
    setPanning(true);
    wrap.current?.setPointerCapture(e.pointerId);
  };

  const startNodeDrag = (e: React.PointerEvent, n: FlatNode) => {
    e.stopPropagation();
    const o = offsets[n.id] ?? { dx: 0, dy: 0 };
    nodeDrag.current = { id: n.id, px: e.clientX, py: e.clientY, ox: o.dx, oy: o.dy };
    moved.current = false;
    setHeld(n.id);
    wrap.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const nd = nodeDrag.current;
    if (nd) {
      if (Math.hypot(e.clientX - nd.px, e.clientY - nd.py) > 4) moved.current = true;
      const dx = nd.ox + (e.clientX - nd.px) / view.scale;
      const dy = nd.oy + (e.clientY - nd.py) / view.scale;
      setOffsets((prev) => ({ ...prev, [nd.id]: { dx, dy } }));
      return;
    }
    const p = pan.current;
    if (!p) return;
    setView((v) => ({ ...v, x: p.ox + (e.clientX - p.px), y: p.oy + (e.clientY - p.py) }));
  };

  const endDrag = () => {
    if (nodeDrag.current && moved.current) saveOffsets(storageKey, offsetsRef.current);
    nodeDrag.current = null;
    pan.current = null;
    setHeld(null);
    setPanning(false);
  };

  const enter = (n: FlatNode) => setHover(n.id);

  const leave = () => setHover(null);

  // Screen-space anchor for the hover card, flipped to the left of the blob
  // when there is no room to its right.
  const card = (() => {
    if (!hover) return null;
    const n = byId.get(hover);
    const el = wrap.current;
    if (!n || !el) return null;
    const [x, y] = posOf(n.id);
    const width = el.clientWidth;
    const sx = view.x + x * view.scale;
    const sy = view.y + y * view.scale;
    const reach = n.rx * view.scale + 16;
    const flip = sx + reach + 272 > width;
    return {
      node: n,
      left: flip ? sx - reach : sx + reach,
      top: sy,
      flip,
    };
  })();

  const open = (n: FlatNode) => {
    // A click that ended a drag should not navigate.
    if (moved.current) return;
    if (n.href) router.push(n.href);
  };

  /**
   * A hand-drawn looking link: it leaves the parent, wanders sideways by an
   * amount unique to the pair, and settles into the child.
   */
  const edgePath = (fromId: string, toId: string, seed: number) => {
    const from = byId.get(fromId);
    const to = byId.get(toId);
    if (!from || !to) return "";
    const [fx, fy] = posOf(fromId);
    const [tx, ty] = posOf(toId);
    const y1 = fy + from.ry * 0.72;
    const y2 = ty - to.ry * 0.72;
    const span = y2 - y1;
    const sway = wobble(seed, 3) * 52;
    const c1x = fx + sway;
    const c1y = y1 + span * (0.42 + wobble(seed, 4) * 0.12);
    const c2x = tx - sway * 0.7;
    const c2y = y2 - span * (0.42 + wobble(seed, 5) * 0.12);
    return `M ${r2(fx)} ${r2(y1)} C ${r2(c1x)} ${r2(c1y)}, ${r2(c2x)} ${r2(c2y)}, ${r2(tx)} ${r2(y2)}`;
  };

  return (
    <div
      className={`tree-wrap${panning ? " dragging" : ""}`}
      ref={wrap}
      onPointerDown={startPan}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseLeave={leave}
    >
      <svg width="100%" height="100%" role="tree" aria-label="Article tree">
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {layout.edges.map((e) => (
            <path
              key={`${e.fromId}->${e.toId}`}
              className={`edge${litEdges.has(`${e.fromId}->${e.toId}`) ? " lit" : ""}`}
              d={edgePath(e.fromId, e.toId, e.seed)}
            />
          ))}
          {layout.nodes.map((n) => {
            const [x, y] = posOf(n.id);
            return (
              <g
                key={n.id}
                className={`node-g${n.href ? "" : " node-root"}${held === n.id ? " held" : ""}`}
                role="treeitem"
                aria-level={n.depth + 1}
                tabIndex={0}
                transform={`translate(${x} ${y})`}
                onPointerDown={(e) => startNodeDrag(e, n)}
                onMouseEnter={() => enter(n)}
                onFocus={() => enter(n)}
                onBlur={leave}
                onClick={() => open(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    moved.current = false;
                    open(n);
                  }
                }}
              >
                <path
                  className="node-shadow"
                  transform={`translate(6 7) scale(${n.rx} ${n.ry})`}
                  d={blobPath(n.seed + 9, 9, 0.13)}
                />
                <path
                  className="node-blob"
                  transform={`scale(${n.rx} ${n.ry})`}
                  d={blobPath(n.seed, 9, 0.13)}
                  vectorEffect="non-scaling-stroke"
                />
                <text className="node-cat" y={-16} textAnchor="middle">
                  {n.label}
                </text>
                <text className="node-title" y={13} textAnchor="middle">
                  {n.title.length > 32 ? `${n.title.slice(0, 31)}…` : n.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {card ? (
        <aside
          className={`node-card${card.flip ? " flip" : ""}`}
          style={{ left: card.left, top: card.top }}
        >
          <span className="eyebrow">{card.node.label}</span>
          <h3>{card.node.title}</h3>
          <p>{card.node.excerpt || "Everything below grows out of this cluster."}</p>
          {card.node.href ? <span className="node-card-cue">Click to read →</span> : null}
        </aside>
      ) : null}

      <p className="tree-hint">Drag a blob to move it · drag the field to pan · scroll to zoom</p>
      <div className="tree-zoom" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">−</button>
        <button onClick={() => zoomBy(1.25)} aria-label="Zoom in">+</button>
        <button onClick={fit} aria-label="Fit tree to view">⤢</button>
        <button onClick={scatter} aria-label="Reset arrangement">↺</button>
      </div>
    </div>
  );
}
