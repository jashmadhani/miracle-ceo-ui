import { useMemo } from 'react'
import { rng, scallop } from './shapes'
import './art.css'

// Canopy clumps for a full-grown tree (viewBox 400×440). Bushy, layered style from reference 08.
const CLUMPS: [number, number, number][] = [
  [200, 82, 52],
  [150, 112, 54],
  [252, 112, 54],
  [96, 150, 48],
  [304, 150, 48],
  [200, 140, 66],
  [130, 180, 58],
  [270, 180, 58],
  [70, 205, 42],
  [330, 205, 42],
  [200, 205, 64],
  [135, 240, 48],
  [265, 240, 48],
  [200, 255, 44],
]

const SHADE = '#4f7a2e'
const MID = '#719d3c'
const LIGHT = '#97bd57'
const SHINE = '#bcd77a'
const LEAF = '#e2a44a'

type Props = {
  /** 0 = seed, 1 = fully grown */
  growth?: number
  /** earned leaves shown on the canopy, one golden leaf each */
  blossoms?: number
  /** leaves from this index on are new — they pop in with a glow */
  newFrom?: number
  /** a highlighted leaf (tapped) */
  selected?: number | null
  onLeaf?: (i: number) => void
  sway?: boolean
  ground?: boolean
  className?: string
  title?: string
}

export function Tree({ growth = 1, blossoms = 0, newFrom, selected = null, onLeaf, sway = true, ground = true, className, title }: Props) {
  const g = Math.max(0, Math.min(1, growth))

  // Young trees keep the full round canopy, just smaller — dropping clumps made it look lumpy.
  const canopy = useMemo(() => CLUMPS.map((c, i) => ({ c, i })), [])

  // golden-angle spiral: leaves spread evenly and fill outward as more are earned
  const dots = useMemo(() => {
    const rand = rng(7)
    return Array.from({ length: Math.min(50, blossoms) }, (_, i) => {
      const a = i * 2.39996 + 0.6
      const r = 0.18 + 0.82 * Math.sqrt((i + 0.5) / 50)
      return { x: 200 + Math.cos(a) * r * 128, y: 168 + Math.sin(a) * r * 88, rot: rand() * 360 }
    })
  }, [blossoms])

  if (g < 0.12) return <Sprout g={g} className={className} ground={ground} title={title} />

  const canopyScale = 0.4 + 0.6 * g
  const trunkScale = 0.5 + 0.5 * g

  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label={title ?? 'A growing tree'}>
      {ground && <ellipse cx="200" cy="420" rx={150 * trunkScale} ry="14" fill="#cbd8a6" opacity="0.6" />}

      <g style={{ transformOrigin: '200px 424px', transform: `scale(${trunkScale})` }}>
        {/* trunk and branches */}
        <path
          d="M178 424 C186 380 188 330 186 290 C170 268 140 250 116 232 L124 222 C150 240 174 254 190 268 C190 240 182 214 170 190 L182 184 C194 206 200 228 202 252 C210 226 220 206 236 186 L246 194 C232 214 222 238 214 264 C232 248 258 236 284 226 L288 238 C258 250 232 266 216 290 C214 330 216 380 226 424 Z"
          fill="#4a2410"
        />
        <path d="M196 424 C200 380 200 330 199 292 L207 292 C208 330 210 380 214 424 Z" fill="#7a4518" />
        <path d="M202 410 C203 380 203 350 202 316" stroke="#b9861f" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8" />
      </g>

      <g
        className={sway ? 'tree-sway' : undefined}
        style={{ transformOrigin: '200px 300px' }}
      >
        <g style={{ transformOrigin: '200px 300px', transform: `scale(${canopyScale})`, transition: 'transform 0.9s cubic-bezier(.34,1.56,.64,1)' }}>
          {canopy.map(({ c: [x, y, r], i }) => (
            <path key={`s${i}`} d={scallop(x + 6, y + 10, r, 9, i + 1)} fill={SHADE} />
          ))}
          {canopy.map(({ c: [x, y, r], i }) => (
            <path key={`m${i}`} d={scallop(x, y, r * 0.92, 9, i + 11)} fill={MID} />
          ))}
          {canopy.map(({ c: [x, y, r], i }) => (
            <path key={`l${i}`} d={scallop(x - r * 0.14, y - r * 0.16, r * 0.62, 8, i + 21)} fill={LIGHT} />
          ))}
          {canopy.map(({ c: [x, y, r], i }) => (
            <path key={`h${i}`} d={scallop(x - r * 0.22, y - r * 0.26, r * 0.32, 7, i + 31)} fill={SHINE} />
          ))}
        </g>
        {/* earned leaves sit outside the canopy scale so they read clearly even on a young tree */}
          {dots.map((d, i) => {
          const isNew = newFrom != null && i >= newFrom
          const isSel = selected === i
          return (
            <g
              key={`b${i}`}
              className={`earned-leaf ${isNew ? 'new' : ''} ${isSel ? 'sel' : ''}`}
              transform={`translate(${(200 + (d.x - 200) * canopyScale).toFixed(1)} ${(300 + (d.y - 300) * canopyScale).toFixed(1)}) scale(1.6)`}
              onClick={onLeaf ? () => onLeaf(i) : undefined}
              role={onLeaf ? 'button' : undefined}
              aria-label={onLeaf ? `Leaf ${i + 1}` : undefined}
            >
              {onLeaf && <circle r="18" fill="transparent" />}
              {(isNew || isSel) && <circle className="leaf-halo" r="16" fill="#fff6dc" />}
              <g className="leaf-body" style={isNew ? { animationDelay: `${0.25 * (i - (newFrom ?? 0))}s` } : undefined}>
                <g transform={`rotate(${d.rot.toFixed(0)}) scale(${isSel ? 1.6 : 1})`}>
                  <path d="M0 -11 C7 -6 7 5 0 11 C-7 5 -7 -6 0 -11Z" fill={LEAF} stroke="#fffaf0" strokeWidth="2.2" />
                  <path d="M0 -8 L0 8" stroke="#fffaf0" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
                </g>
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

function Sprout({ g, className, ground, title }: { g: number; className?: string; ground: boolean; title?: string }) {
  // 0 → seed in soil, 0.12 → two-leaf sprout
  const t = g / 0.12
  return (
    <svg viewBox="0 0 400 440" className={className} role="img" aria-label={title ?? 'A seed'}>
      {ground && <ellipse cx="200" cy="420" rx="70" ry="10" fill="#cbd8a6" opacity="0.6" />}
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
