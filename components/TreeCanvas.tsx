"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NODE_H, NODE_W, type FlatLayout, type FlatNode } from "@/lib/tree";

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.2;

/** Curved edge: drops out of the parent, sweeps across, rises into the child. */
function edgePath(from: [number, number], to: [number, number]) {
  const [x1, y1] = [from[0], from[1] + NODE_H / 2];
  const [x2, y2] = [to[0], to[1] - NODE_H / 2];
  const mid = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
}

export default function TreeCanvas({
  layout,
  onFocus,
}: {
  layout: FlatLayout;
  onFocus: (node: FlatNode | null) => void;
}) {
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const moved = useRef(false);

  const byId = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);

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

  const fit = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const scale = Math.min(width / layout.width, height / layout.height, 1);
    setView({
      x: (width - layout.width * scale) / 2,
      y: (height - layout.height * scale) / 2,
      scale,
    });
  }, [layout.width, layout.height]);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

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

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { px: e.clientX, py: e.clientY, ox: view.x, oy: view.y };
    moved.current = false;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (Math.hypot(e.clientX - d.px, e.clientY - d.py) > 4) moved.current = true;
    setView((v) => ({ ...v, x: d.ox + (e.clientX - d.px), y: d.oy + (e.clientY - d.py) }));
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const enter = (n: FlatNode) => {
    setHover(n.id);
    onFocus(n);
  };

  const leave = () => {
    setHover(null);
    onFocus(null);
  };

  const open = (n: FlatNode) => {
    // A click that ended a pan should not navigate.
    if (moved.current) return;
    if (n.href) router.push(n.href);
  };

  return (
    <div
      className={`tree-wrap${dragging ? " dragging" : ""}`}
      ref={wrap}
      onPointerDown={onPointerDown}
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
              d={edgePath(e.from, e.to)}
            />
          ))}
          {layout.nodes.map((n) => (
            <g
              key={n.id}
              className={`node-g${n.href ? "" : " node-root"}`}
              role="treeitem"
              aria-level={n.depth + 1}
              tabIndex={0}
              onMouseEnter={() => enter(n)}
              onFocus={() => enter(n)}
              onBlur={leave}
              onClick={() => open(n)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(n);
                }
              }}
            >
              <rect
                className="node-shadow"
                x={n.x - NODE_W / 2 + 4}
                y={n.y - NODE_H / 2 + 4}
                width={NODE_W}
                height={NODE_H}
              />
              <rect
                className="node-box"
                x={n.x - NODE_W / 2}
                y={n.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
              />
              <text className="node-cat" x={n.x} y={n.y - 12} textAnchor="middle">
                {n.label}
              </text>
              <text className="node-title" x={n.x} y={n.y + 12} textAnchor="middle">
                {n.title.length > 26 ? `${n.title.slice(0, 25)}…` : n.title}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <p className="tree-hint">Drag to pan · scroll to zoom · click a node to read</p>
      <div className="tree-zoom">
        <button onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">−</button>
        <button onClick={() => zoomBy(1.25)} aria-label="Zoom in">+</button>
        <button onClick={fit} aria-label="Fit tree to view">⤢</button>
      </div>
    </div>
  );
}
