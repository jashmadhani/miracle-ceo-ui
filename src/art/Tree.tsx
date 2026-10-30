import { useMemo, type CSSProperties } from 'react'
import { rng } from './shapes'
import type { LeafTone } from './leafColors'
import './art.css'

/*
 * A hand-drawn, slightly crooked tree with visible roots.
 * - Branches grow in one by one as `growth` rises (each has an `at` threshold),
 *   so a young tree is a trunk with a few boughs and an older one is full.
 * - Every leaf sits on a branch and turns with it. Leaves near the top of the
 *   crown are light, those low down are deep, so the canopy has depth.
 * - Earned leaves keep the colour of what grew it (see leafColors.ts); nothing
 *   is drawn for leaves not yet earned.
 */

// Quadratic segments: [x0, y0, cx, cy, x1, y1, width, at]. Deliberately lopsided.
type Branch = [number, number, number, number, number, number, number, number]
const BRANCHES: Branch[] = [
  [198, 304, 160, 284, 126, 246, 12, 0.14], // left bough
  [126, 246, 104, 226, 96, 190, 8, 0.3],
  [140, 270, 112, 278, 78, 262, 6, 0.42],
  [210, 300, 252, 272, 276, 226, 11, 0.18], // right bough
  [276, 226, 298, 204, 322, 198, 7, 0.36],
  [262, 246, 300, 254, 332, 240, 5, 0.5],
  [204, 292, 196, 240, 214, 184, 11, 0.22], // leaning leader
  [214, 184, 222, 150, 196, 112, 7, 0.4],
  [206, 214, 176, 188, 168, 148, 6, 0.52],
  [212, 170, 246, 150, 262, 114, 6, 0.6],
  [196, 112, 188, 92, 200, 74, 4, 0.72],
  [96, 190, 88, 170, 98, 148, 4, 0.66],
  [322, 198, 336, 184, 334, 160, 4, 0.7],
  [194, 320, 150, 322, 112, 306, 7, 0.3], // low boughs
  [212, 324, 256, 326, 292, 308, 7, 0.34],
  [200, 392, 170, 372, 138, 348, 6, 0.26], // side shoots on the tall trunk
  [208, 372, 238, 352, 258, 322, 5, 0.45],
]

// crown masses, [cx, cy, rx, ry, upper?]
const CROWN: [number, number, number, number, boolean][] = [
  [205, 118, 70, 52, true],
  [128, 164, 60, 46, true],
  [286, 166, 62, 46, true],
  [98, 218, 44, 36, false],
  [320, 214, 44, 34, false],
  [205, 186, 82, 60, false],
  [158, 252, 52, 34, false],
  [256, 252, 52, 34, false],
  [204, 68, 40, 28, true],
]

const BARK = '#4a2f22'
const BARK_MID = '#6b4632'
const BARK_LIGHT = '#8a5f45'
const DEEP = '#1f5a3e'
const SHADE = '#3f7a3a'
const MID = '#6db33f'
const LIGHT = '#8fd14f'
const SHINE = '#c8f56b'
const GOLD = '#ffc519'

const LIFT = 60

const LEAF_PATH = 'M0 -12 C8 -7 8 4 1 12 C-6 6 -8 -5 0 -12Z'

type Anchor = { x: number; y: number; rot: number; k: number }

function bezier(b: Branch, t: number) {
  const [x0, y0, cx, cy, x1, y1] = b
  const u = 1 - t
  const x = u * u * x0 + 2 * u * t * cx + t * t * x1
  const y = u * u * y0 + 2 * u * t * cy + t * t * y1
  const dx = 2 * u * (cx - x0) + 2 * t * (x1 - cx)
  const dy = 2 * u * (cy - y0) + 2 * t * (y1 - cy)
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}

/** Leaf spots along every branch, tip first, round-robin across branches in the order they grow. */
function buildAnchors(): Anchor[] {
  const order = BRANCHES.map((b, k) => ({ b, k })).sort((p, q) => p.b[7] - q.b[7])
  const perBranch = order.map(({ b, k }) => {
    const out: Anchor[] = []
    const tip = bezier(b, 1)
    out.push({ x: tip.x, y: tip.y, rot: tip.a + 90, k })
    let side = 1
    for (let t = 0.92; t > 0.3; t -= 0.1) {
      const p = bezier(b, t)
      const n = ((p.a + 90 * side) * Math.PI) / 180
      const off = 7 + b[6] * 0.4
      out.push({ x: p.x + Math.cos(n) * off, y: p.y + Math.sin(n) * off, rot: p.a + 90 + side * 48, k })
      side = -side
    }
    return out
  })
  const ordered: Anchor[] = []
  const longest = Math.max(...perBranch.map((a) => a.length))
  for (let i = 0; i < longest; i++) for (const list of perBranch) if (list[i]) ordered.push(list[i])
  return ordered
}

const ANCHORS = buildAnchors()

/** Leaves along the upper rim of each crown mass, so the canopy reads as leaves, not a blob. */
const RIM: Anchor[] = (() => {
  const out: Anchor[] = []
  CROWN.forEach(([cx, cy, rx, ry], k) => {
    const n = rx > 60 ? 9 : 6
    for (let i = 0; i < n; i++) {
      const a = Math.PI * (1.05 + (0.9 * i) / (n - 1))
      out.push({ x: cx + Math.cos(a) * rx * 0.96, y: cy + Math.sin(a) * ry * 0.96, rot: (a * 180) / Math.PI + 90, k: -1 - k })
    }
  })
  return out
})()

/** A smooth, uneven mass (closed Catmull-Rom through jittered points on an ellipse). */
function mass(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const rand = rng(seed)
  const n = 9
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand() * 0.25
    const k = 0.82 + rand() * 0.3
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

function leafGreen(y: number, rand: () => number) {
  // light at the top of the crown, deep near the trunk
  const t = Math.min(1, Math.max(0, (y - 70) / 240)) + (rand() - 0.5) * 0.35
  if (t < 0.22) return SHINE
  if (t < 0.5) return LIGHT
  if (t < 0.78) return MID
  return SHADE
}

type Props = {
  /** 0 = seed, 1 = fully grown */
  growth?: number
  /** earned leaves, one leaf each, on their own branch spots */
  blossoms?: number
  /** colour of each earned leaf, oldest first */
  tones?: LeafTone[]
  /** leaves from this index on are new — they drop in with a glow */
  newFrom?: number
  /** a highlighted leaf (tapped) */
  selected?: number | null
  onLeaf?: (i: number) => void
  /** kept so older call sites compile; empty leaf places are no longer drawn */
  buds?: boolean
  /** crop the empty sky above a young tree so it fills its frame */
  fit?: boolean
  /** new leaves fly up from below the tree instead of dropping in */
  fly?: boolean
  sway?: boolean
  ground?: boolean
  className?: string
  title?: string
}

export function Tree({ growth = 1, blossoms = 0, tones, newFrom, selected = null, onLeaf, fly = false, sway = true, ground = true, fit = false, className, title }: Props) {
  const g = Math.max(0, Math.min(1, growth))
  const n = Math.min(50, blossoms)

  const { earned, green, shown } = useMemo(() => {
    const earnedList = ANCHORS.slice(0, n)
    const used = new Set(earnedList.map((a) => a.k))
    // boughs come in early (half their threshold) so even a young tree looks full
    const visible = (k: number) => BRANCHES[k][7] * 0.5 <= g || used.has(k)
    const rand = rng(11)
    const pool = ANCHORS.slice(n).filter((a) => visible(a.k))
    const count = Math.min(pool.length, Math.round(50 + g * 60))
    const greens = pool.slice(0, count).map((a) => ({ ...a, c: leafGreen(a.y, rand), s: 0.95 + rand() * 0.4, d: rand() * 3 }))
    const rim = RIM.map((r) => ({ ...r, c: leafGreen(r.y - 30, rand), s: 1.15 + rand() * 0.45, d: rand() * 3 }))
    return { earned: earnedList, green: [...rim, ...greens], shown: BRANCHES.map((_, k) => visible(k)) }
  }, [n, g])

  if (g < 0.12) return <Sprout g={g} className={className} ground={ground} title={title} />

  const scale = 0.64 + 0.36 * g
  // a full, leafy crown from the start; the tree grows in size and leaves, never looks bare
  const crown = 1
  // the highest point actually drawn (visible boughs, or the crown once it fills in), scaled, less some headroom
  // the crown sits LIFT higher than the boughs were drawn, on a longer trunk
  const peak = 16 - LIFT
  const top = fit ? Math.max(-LIFT - 10, Math.round(512 - (512 - peak) * scale - 30)) : -LIFT - 10

  return (
    <svg viewBox={`0 ${top} 400 ${520 - top}`} className={className} role="img" aria-label={title ?? 'A growing tree'}>
      {ground && <ellipse cx="200" cy="512" rx={150 * scale} ry="9" fill="#272657" opacity="0.08" />}

      <g style={{ transformOrigin: '200px 512px', transform: `scale(${scale})`, transition: 'transform 0.9s cubic-bezier(.34,1.56,.64,1)' }}>
        {/* roots, left open to the air */}
        <g fill="none" stroke={BARK} strokeLinecap="round">
          <path d="M188 490 C174 504 156 508 132 514" strokeWidth="10" />
          <path d="M214 492 C230 504 252 508 274 514" strokeWidth="10" />
          <path d="M196 500 C190 510 180 516 164 518" strokeWidth="5" />
          <path d="M208 500 C214 510 226 516 242 518" strokeWidth="5" />
          <path d="M132 514 C122 516 114 516 106 514" strokeWidth="3" />
          <path d="M274 514 C284 516 294 516 302 514" strokeWidth="3" />
        </g>

        {/* trunk, leaning a little */}
        {/* a tall trunk that tapers up into the leader, no flat top */}
        <path d="M178 508 C188 468 177 430 187 396 C194 362 189 326 195 290 C199 256 202 214 206 180 C211 214 214 256 217 290 C222 326 213 362 217 396 C224 430 214 468 226 508 Z" fill={BARK} />
        <path d="M200 500 C205 466 195 432 203 400 C208 366 201 330 205 294 C207 262 207 230 207 200" stroke={BARK_MID} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M205 486 C208 460 201 436 206 414" stroke={BARK_LIGHT} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M191 470 C189 456 192 446 190 432 M213 452 C215 440 211 430 213 418 M196 372 C195 362 197 354 196 344" stroke="#2f1c14" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />

        <g transform={`translate(0 ${-LIFT})`}>
        <g className={sway ? 'tree-sway' : undefined} style={{ transformOrigin: '200px 310px' }}>
          {/* the crown: layered masses from deep to bright, light from the upper left */}
          {crown > 0 && (
            <g opacity={crown} style={{ transition: 'opacity 0.9s' }}>
              {CROWN.map(([x, y, rx, ry], i) => (
                <path key={`d${i}`} d={mass(x + 7, y + 12, rx, ry, i + 3)} fill={DEEP} />
              ))}
              {CROWN.map(([x, y, rx, ry], i) => (
                <path key={`s${i}`} d={mass(x + 1, y + 2, rx * 0.93, ry * 0.93, i + 13)} fill={SHADE} />
              ))}
              {CROWN.map(([x, y, rx, ry], i) => (
                <path key={`m${i}`} d={mass(x - rx * 0.1, y - ry * 0.16, rx * 0.68, ry * 0.66, i + 23)} fill={MID} />
              ))}
              {CROWN.filter((c) => c[4]).map(([x, y, rx, ry], i) => (
                <path key={`l${i}`} d={mass(x - rx * 0.22, y - ry * 0.3, rx * 0.4, ry * 0.36, i + 33)} fill={LIGHT} />
              ))}
              {CROWN.filter((c) => c[4]).map(([x, y, rx, ry], i) => (
                <path key={`h${i}`} d={mass(x - rx * 0.3, y - ry * 0.42, rx * 0.18, ry * 0.16, i + 43)} fill={SHINE} />
              ))}
            </g>
          )}

          {/* boughs: each draws itself in when the tree is old enough */}
          {BRANCHES.map(([x0, y0, cx, cy, x1, y1, w], i) => (
            <path
              key={`b${i}`}
              d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`}
              pathLength={1}
              stroke={BARK}
              strokeWidth={w}
              strokeLinecap="round"
              fill="none"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: shown[i] ? 0 : 1,
                opacity: shown[i] ? 1 : 0,
                transition: 'stroke-dashoffset 0.9s ease-out, opacity 0.3s',
              }}
            />
          ))}

          {/* green leaves, turned along their branch */}
          {green.map((a, i) => (
            <g key={`g${i}`} transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`}>
              <g className="leaf-flutter" style={{ animationDelay: `${a.d.toFixed(2)}s` }}>
                <g transform={`rotate(${a.rot.toFixed(0)}) scale(${a.s.toFixed(2)})`}>
                  <path d={LEAF_PATH} fill={a.c} />
                  <path d="M0 -8 L0 8" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
                </g>
              </g>
            </g>
          ))}

          {/* earned leaves, each in the colour of what grew it */}
          {earned.map((a, i) => {
            const isNew = newFrom != null && i >= newFrom
            const isSel = selected === i
            const tone = tones?.[i] ?? { fill: GOLD, stroke: '#fffaf0' }
            return (
              <g
                key={`e${i}`}
                className={`earned-leaf ${isNew ? (fly ? 'new fly' : 'new') : ''} ${isSel ? 'sel' : ''}`}
                transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`}
                onClick={onLeaf ? () => onLeaf(i) : undefined}
                role={onLeaf ? 'button' : undefined}
                aria-label={onLeaf ? `Leaf ${i + 1}` : undefined}
              >
                {onLeaf && <circle r="16" fill="transparent" />}
                {(isNew || isSel) && <circle className="leaf-halo" r="15" fill="#fff6dc" />}
                <g
                  className="leaf-body"
                  style={
                    isNew
                      ? ({
                          animationDelay: `${(fly ? 0.9 : 0.25) * (i - (newFrom ?? 0)) + (fly ? 0.6 : 0)}s`,
                          // flying leaves start below the tree's base
                          '--fx': `${(200 - a.x).toFixed(0)}px`,
                          '--fy': `${(640 - a.y).toFixed(0)}px`,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <g transform={`rotate(${a.rot.toFixed(0)}) scale(${isSel ? 2.3 : 1.8})`}>
                    <path d={LEAF_PATH} fill={tone.fill} stroke={tone.stroke} strokeWidth="1.8" />
                    <path d="M0 -8 L0 8" stroke={tone.stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  </g>
                </g>
              </g>
            )
          })}
        </g>
        </g>
      </g>
    </svg>
  )
}

function Sprout({ g, className, ground, title }: { g: number; className?: string; ground: boolean; title?: string }) {
  // 0 → seed in soil, 0.12 → two-leaf sprout
  const t = g / 0.12
  return (
    <svg viewBox="0 0 400 520" className={className} role="img" aria-label={title ?? 'A seed'}>
      <g transform="translate(0 80)">
      {ground && <ellipse cx="200" cy="432" rx="70" ry="7" fill="#272657" opacity="0.08" />}
      {t < 0.25 ? (
        <g className="seed-bob">
          <ellipse cx="200" cy="410" rx="16" ry="20" fill="#8a5f45" />
          <path d="M200 394 C196 404 196 416 200 428" stroke="#4a2f22" strokeWidth="3" fill="none" />
          <ellipse cx="194" cy="404" rx="4" ry="6" fill="#b88a6a" />
        </g>
      ) : (
        <g className="tree-sway" style={{ transformOrigin: '200px 426px' }}>
          <path d={`M200 426 C200 ${416 - 60 * t} 202 ${406 - 80 * t} 200 ${426 - 110 * t}`} stroke={SHADE} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d={`M200 ${426 - 100 * t} C176 ${406 - 120 * t} 150 ${420 - 110 * t} 150 ${426 - 100 * t} C170 ${436 - 92 * t} 190 ${432 - 96 * t} 200 ${426 - 100 * t}Z`} fill={MID} />
          <path d={`M200 ${426 - 106 * t} C224 ${406 - 128 * t} 252 ${418 - 118 * t} 254 ${426 - 110 * t} C232 ${438 - 100 * t} 212 ${434 - 104 * t} 200 ${426 - 106 * t}Z`} fill={LIGHT} />
        </g>
      )}
      </g>
    </svg>
  )
}
