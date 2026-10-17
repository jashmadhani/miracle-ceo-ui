// Geometry helpers shared by the illustrations.

export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 10000) / 10000
  }
}

/**
 * A "cloud clump" — a circle whose rim is made of round bumps.
 * This is the building block of the bushy tree canopy (reference 08).
 */
export function scallop(cx: number, cy: number, r: number, bumps: number, seed = 1, depth = 0.22) {
  const rand = rng(seed)
  const pts: [number, number][] = []
  const offset = rand() * Math.PI * 2
  for (let i = 0; i < bumps; i++) {
    const a = offset + (i / bumps) * Math.PI * 2
    const rr = r * (1 - depth * 0.35 + rand() * depth * 0.35)
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.92])
  }
  const bumpR = ((2 * Math.PI * r) / bumps) * 0.62
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 1; i <= bumps; i++) {
    const p = pts[i % bumps]
    const br = bumpR * (0.85 + rand() * 0.3)
    d += ` A${br.toFixed(1)},${br.toFixed(1)} 0 0 1 ${p[0].toFixed(1)},${p[1].toFixed(1)}`
  }
  return d + 'Z'
}

/** A soft, slightly lopsided blob (mood faces, backdrop shapes). */
export function blob(cx: number, cy: number, r: number, seed: number, wobble = 0.14, points = 7) {
  const rand = rng(seed)
  const pts: [number, number][] = []
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 - Math.PI / 2
    const rr = r * (1 - wobble + rand() * wobble * 2)
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  // Catmull-Rom → cubic Bézier for a smooth closed outline
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % points]
    const p3 = pts[(i + 2) % points]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}
