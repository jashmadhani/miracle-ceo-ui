import { useMemo, type CSSProperties } from 'react'
import { rng, scallop } from './shapes'
import type { LeafTone } from './leafColors'
import './art.css'

/*
 * The tree has real branches, and every leaf grows ON a branch.
 * - Green leaves fill in as the tree grows (growth 0 → 1).
 * - Earned leaves sit on their own branch spots, so a new one reads as "one
 *   more leaf on the tree", not a dot floating in a blob. Each takes the colour
 *   of what grew it (see leafColors.ts); gold when no colours are given.
 * - Only a nearly full-grown tree fills out into the bushy canopy (reference 08).
 */

// Quadratic branch segments: [x0, y0, cx, cy, x1, y1, width]
const BRANCHES: [number, number, number, number, number, number, number][] = [
  [200, 300, 160, 262, 112, 214, 13], // left main
  [200, 300, 244, 258, 292, 210, 13], // right main
  [200, 296, 196, 220, 204, 132, 12], // centre up
  [146, 248, 124, 204, 98, 166, 7],
  [258, 246, 288, 204, 318, 176, 7],
  [202, 214, 170, 170, 146, 122, 7],
  [204, 190, 236, 154, 262, 108, 7],
  [200, 336, 152, 326, 96, 302, 8], // low left
  [200, 328, 252, 320, 306, 294, 8], // low right
  [120, 222, 94, 222, 66, 238, 5],
  [286, 218, 312, 222, 338, 240, 5],
  [204, 146, 200, 112, 202, 86, 5],
  [96, 300, 78, 286, 64, 268, 4],
  [304, 294, 322, 282, 336, 262, 4],
]

const CLUMPS: [number, number, number][] = [
  [200, 92, 50],
  [148, 122, 52],
  [254, 122, 52],
  [98, 162, 46],
  [302, 162, 46],
  [200, 150, 62],
  [132, 196, 56],
  [268, 196, 56],
  [76, 228, 40],
  [324, 228, 40],
  [200, 214, 58],
  [140, 256, 44],
  [262, 256, 44],
]

const SHADE = '#3f7a1e'
const MID = '#62a32a'
const LIGHT = '#8fc93f'
const SHINE = '#bde06a'
const GREENS = [MID, LIGHT, '#4f8f23', '#a6d65a']
const GOLD = '#ffb937'
const BARK = '#5a3418'
const BARK_LIGHT = '#7a4a22'

const LEAF_PATH = 'M0 -11 C7 -6 7 5 0 11 C-7 5 -7 -6 0 -11Z'

type Anchor = { x: number; y: number; rot: number; k: number }

function bezier(b: (typeof BRANCHES)[number], t: number) {
  const [x0, y0, cx, cy, x1, y1] = b
  const u = 1 - t
  const x = u * u * x0 + 2 * u * t * cx + t * t * x1
  const y = u * u * y0 + 2 * u * t * cy + t * t * y1
  const dx = 2 * u * (cx - x0) + 2 * t * (x1 - cx)
  const dy = 2 * u * (cy - y0) + 2 * t * (y1 - cy)
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI }
}

/** Leaf spots along every branch, ordered tip-first and round-robin across branches. */
function buildAnchors(): Anchor[] {
  const perBranch: Anchor[][] = BRANCHES.map((b, bi) => {
    const out: Anchor[] = []
    const tip = bezier(b, 1)
    out.push({ x: tip.x, y: tip.y, rot: tip.a + 90, k: bi })
    let side = 1
    for (let t = 0.92; t > 0.3; t -= 0.1) {
      const p = bezier(b, t)
      const n = ((p.a + 90 * side) * Math.PI) / 180
      const off = 7 + b[6] * 0.4
      out.push({ x: p.x + Math.cos(n) * off, y: p.y + Math.sin(n) * off, rot: p.a + 90 + side * 50, k: bi })
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
  /** show the leaf places not yet earned as soft buds, so you can see how full the tree is */
  buds?: boolean
  /** new leaves fly up from below the tree instead of dropping in */
  fly?: boolean
  sway?: boolean
  ground?: boolean
  className?: string
  title?: string
}

export function Tree({ growth = 1, blossoms = 0, tones, newFrom, selected = null, onLeaf, buds = false, fly = false, sway = true, ground = true, className, title }: Props) {
  const g = Math.max(0, Math.min(1, growth))

  // the 50 leaf places are spread evenly through the anchor list; earned leaves take the first ones,
  // buds mark the rest, and green leaves fill what's left
  const { gold, budList, green } = useMemo(() => {
    const n = Math.min(50, blossoms)
    const step = ANCHORS.length / 50
    const slots = Array.from({ length: 50 }, (_, i) => Math.floor(i * step) % ANCHORS.length)
    const taken = new Set(buds ? slots : slots.slice(0, n))
    const greenCount = Math.round(10 + g * 70)
    const rand = rng(11)
    const greenList = ANCHORS.filter((_, i) => !taken.has(i))
      .slice(0, greenCount)
      .map((a) => ({ ...a, c: GREENS[Math.floor(rand() * GREENS.length)], s: 0.95 + rand() * 0.35, d: rand() * 3 }))
    return { gold: slots.slice(0, n).map((i) => ANCHORS[i]), budList: buds ? slots.slice(n).map((i) => ANCHORS[i]) : [], green: greenList }
  }, [blossoms, g, buds])

  if (g < 0.12) return <Sprout g={g} className={className} ground={ground} title={title} />

  const scale = 0.62 + 0.38 * g
  const bushy = Math.max(0, (g - 0.78) / 0.22)

  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label={title ?? 'A growing tree'}>
      {ground && <ellipse cx="200" cy="420" rx={140 * scale} ry="14" fill="#c3df8a" opacity="0.6" />}

      <g style={{ transformOrigin: '200px 424px', transform: `scale(${scale})`, transition: 'transform 0.9s cubic-bezier(.34,1.56,.64,1)' }}>
        {/* trunk */}
        <path d="M184 424 C190 380 191 340 190 300 L210 300 C209 340 210 380 216 424 Z" fill={BARK} />
        <path d="M198 420 C200 380 200 340 199 304" stroke={BARK_LIGHT} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M184 424 C170 428 160 426 150 430 M216 424 C230 428 240 426 252 430" stroke={BARK} strokeWidth="7" strokeLinecap="round" fill="none" />

        <g className={sway ? 'tree-sway' : undefined} style={{ transformOrigin: '200px 310px' }}>
          {/* full-grown trees fill out into the bushy canopy */}
          {bushy > 0 && (
            <g opacity={bushy} style={{ transition: 'opacity 0.8s' }}>
              {CLUMPS.map(([x, y, r], i) => (
                <path key={`s${i}`} d={scallop(x + 5, y + 8, r, 9, i + 1)} fill={SHADE} />
              ))}
              {CLUMPS.map(([x, y, r], i) => (
                <path key={`m${i}`} d={scallop(x, y, r * 0.92, 9, i + 11)} fill={MID} />
              ))}
              {CLUMPS.map(([x, y, r], i) => (
                <path key={`l${i}`} d={scallop(x - r * 0.14, y - r * 0.16, r * 0.6, 8, i + 21)} fill={LIGHT} />
              ))}
              {CLUMPS.map(([x, y, r], i) => (
                <path key={`h${i}`} d={scallop(x - r * 0.22, y - r * 0.26, r * 0.3, 7, i + 31)} fill={SHINE} />
              ))}
            </g>
          )}

          {/* branches */}
          {BRANCHES.map(([x0, y0, cx, cy, x1, y1, w], i) => (
            <path key={`b${i}`} d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`} stroke={BARK} strokeWidth={w} strokeLinecap="round" fill="none" />
          ))}

          {/* green leaves on the branches */}
          {green.map((a, i) => (
            <g key={`g${i}`} transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`}>
              <g className="leaf-flutter" style={{ animationDelay: `${a.d.toFixed(2)}s` }}>
                <path d={LEAF_PATH} fill={a.c} transform={`rotate(${a.rot.toFixed(0)}) scale(${a.s.toFixed(2)})`} />
              </g>
            </g>
          ))}

          {/* leaf places still waiting: a soft bud each */}
          {budList.map((a, i) => (
            <g key={`u${i}`} className="leaf-bud" transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.rot.toFixed(0)}) scale(1.15)`}>
              <path d={LEAF_PATH} />
            </g>
          ))}

          {/* earned leaves, each in the colour of what grew it */}
          {gold.map((a, i) => {
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
                          '--fy': `${(560 - a.y).toFixed(0)}px`,
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
    </svg>
  )
}

function Sprout({ g, className, ground, title }: { g: number; className?: string; ground: boolean; title?: string }) {
  // 0 → seed in soil, 0.12 → two-leaf sprout
  const t = g / 0.12
  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label={title ?? 'A seed'}>
      {ground && <ellipse cx="200" cy="420" rx="70" ry="10" fill="#c3df8a" opacity="0.6" />}
      {t < 0.25 ? (
        <g className="seed-bob">
          <ellipse cx="200" cy="404" rx="16" ry="20" fill="#8a5222" />
          <path d="M200 388 C196 398 196 410 200 422" stroke="#5e3514" strokeWidth="3" fill="none" />
          <ellipse cx="194" cy="398" rx="4" ry="6" fill="#c08446" />
        </g>
      ) : (
        <g className="tree-sway" style={{ transformOrigin: '200px 420px' }}>
          <path d={`M200 420 C200 ${410 - 60 * t} 202 ${400 - 80 * t} 200 ${420 - 110 * t}`} stroke="#5f9b16" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d={`M200 ${420 - 100 * t} C176 ${400 - 120 * t} 150 ${414 - 110 * t} 150 ${420 - 100 * t} C170 ${430 - 92 * t} 190 ${426 - 96 * t} 200 ${420 - 100 * t}Z`} fill={MID} />
          <path d={`M200 ${420 - 106 * t} C224 ${400 - 128 * t} 252 ${412 - 118 * t} 254 ${420 - 110 * t} C232 ${432 - 100 * t} 212 ${428 - 104 * t} 200 ${420 - 106 * t}Z`} fill={LIGHT} />
        </g>
      )}
    </svg>
  )
}
