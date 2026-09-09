/** Deterministic pseudo-random in [0, 1) so blobs look organic but never reflow. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function seedFrom(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) % 100000;
  return h;
}

/**
 * A closed organic path on a unit circle, drawn as a Catmull-Rom spline through
 * points whose radii wobble. Rendered in a "-1.3 -1.3 2.6 2.6" viewBox.
 */
export function blobPath(seed: number, points = 8, wobble = 0.17): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    const r = 1 + (rand(seed + i) - 0.5) * 2 * wobble;
    pts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }

  const at = (i: number) => pts[(i + points * 2) % points];
  let d = `M ${at(0)[0].toFixed(3)} ${at(0)[1].toFixed(3)}`;
  for (let i = 0; i < points; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(3)} ${c1[1].toFixed(3)}, ${c2[0].toFixed(3)} ${c2[1].toFixed(3)}, ${p2[0].toFixed(3)} ${p2[1].toFixed(3)}`;
  }
  return `${d} Z`;
}

export type BlobPlacement = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  tilt: number;
};

/** Scatters blobs around a loose ellipse so any number of categories still reads. */
export function placeBlob(index: number, total: number, weight: number, seed: number): BlobPlacement {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const jitterX = (rand(seed) - 0.5) * 9;
  const jitterY = (rand(seed + 91) - 0.5) * 9;
  return {
    left: 50 + Math.cos(angle) * 27 + jitterX,
    top: 50 + Math.sin(angle) * 25 + jitterY,
    size: Math.round(Math.min(300, 186 + weight * 13)),
    duration: 17 + rand(seed + 7) * 12,
    delay: -rand(seed + 13) * 14,
    drift: 8 + rand(seed + 21) * 10,
    tilt: 2 + rand(seed + 33) * 4,
  };
}
