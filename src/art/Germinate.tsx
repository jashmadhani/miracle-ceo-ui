import { rng } from './shapes'
import './germinate.css'

/*
 * The first scene of onboarding: a slice through the soil. The seed drops in,
 * swells, cracks, sends roots down and a shoot up, and opens its first two
 * leaves above the ground. Everything is CSS-timed off the `planted` class.
 */
const ROOTS: [string, number, number][] = [
  // path, width, delay (s)
  ['M200 104 C201 130 198 156 200 190 C201 210 199 226 200 246', 4.5, 0.9],
  ['M200 118 C182 126 160 132 130 146 C110 156 92 160 70 170', 2.6, 1.3],
  ['M200 120 C220 128 244 134 272 148 C292 158 310 162 334 172', 2.6, 1.4],
  ['M200 150 C186 162 172 176 152 192', 1.8, 1.7],
  ['M200 158 C214 170 230 182 250 196', 1.8, 1.8],
  ['M130 146 C122 160 116 172 106 186', 1.2, 2],
  ['M272 148 C282 162 288 174 298 188', 1.2, 2.1],
]

export function Germinate({ planted }: { planted: boolean }) {
  const r = rng(7)
  const crumbs = Array.from({ length: 90 }, () => ({ x: r() * 400, y: 48 + r() * 210, s: 0.6 + r() * 1.6, c: r() }))
  const pebbles: [number, number, number][] = [[64, 96, 7], [330, 88, 6], [118, 214, 9], [292, 230, 8], [24, 180, 6], [376, 150, 7]]
  return (
    <svg className={`germ ${planted ? 'planted' : ''}`} viewBox="0 0 400 260" preserveAspectRatio="xMidYMin slice" aria-hidden>
      <defs>
        <linearGradient id="germSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5232" />
          <stop offset="1" stopColor="#a0784f" />
        </linearGradient>
        <radialGradient id="germGlow">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-200" y="40" width="800" height="400" fill="url(#germSoil)" />
      {[96, 150, 206].map((y) => (
        <path key={y} d={`M-200 ${y} q50 -6 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0`} stroke="#5c3b20" strokeWidth="1.4" fill="none" opacity="0.25" />
      ))}
      {crumbs.map((c, i) => (
        <circle key={i} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r={c.s.toFixed(2)} fill={c.c < 0.5 ? '#4e321c' : '#c9a57c'} opacity="0.45" />
      ))}
      {pebbles.map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <ellipse rx={s} ry={s * 0.66} fill="#a69e92" />
          <ellipse cx={-s * 0.3} cy={-s * 0.22} rx={s * 0.45} ry={s * 0.24} fill="#dcd5ca" />
        </g>
      ))}
      {/* turf along the top */}
      <path d="M-200 44 L600 44 L600 36 L-200 36Z" fill="#86b764" />
      <path d="M-200 44 L600 44" stroke="#4e7a36" strokeWidth="2" opacity="0.5" />
      {Array.from({ length: 60 }, (_, i) => {
        const x = -10 + i * 7.2
        return <path key={i} d={`M${x} 37 q1 -6 2 -9 M${x + 3} 37 q2 -4 4 -6`} stroke={i % 2 ? '#6fa84c' : '#8cc467'} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      })}
      {/* the hole waiting for the seed, then the little mound over it */}
      <ellipse className="germ-hole" cx="200" cy="42" rx="16" ry="4" fill="#3b2412" />
      <path className="germ-mound" d="M186 41 q6 -6 14 -6 q8 0 14 6Z" fill="#6a472a" />

      {/* roots */}
      {ROOTS.map(([d, w, delay], i) => (
        <g key={i}>
          <path className="germ-root" d={d} pathLength={1} stroke="#e9d4a9" strokeWidth={w + 1.4} style={{ animationDelay: `${delay}s` }} />
          <path className="germ-root" d={d} pathLength={1} stroke="#f6e8c8" strokeWidth={w * 0.55} style={{ animationDelay: `${delay}s` }} />
        </g>
      ))}

      {/* the shoot pushing up, and the seed itself */}
      <path className="germ-shoot" d="M200 96 C199 80 201 60 200 30" pathLength={1} stroke="#7ab84e" strokeWidth="4" />
      <circle className="germ-glow" cx="200" cy="100" r="26" fill="url(#germGlow)" />
      <g className="germ-seed" transform="translate(200 100)">
        <g className="germ-swell">
          <ellipse rx="10" ry="13" fill="#8a5222" />
          <ellipse cx="-3.4" cy="-4" rx="2.6" ry="4.4" fill="#c08446" />
          <path className="germ-crack" d="M-1 -12 L1 -5 L-1 1 L1 8" stroke="#3a2412" strokeWidth="1.2" fill="none" />
        </g>
      </g>
      {/* first two leaves, opening above the ground */}
      <g className="germ-leaves" transform="translate(200 30) scale(1.5)">
        <path className="germ-l" d="M0 0 C-4 -8 -14 -14 -24 -12 C-22 -4 -12 1 0 0Z" fill="#7cc84e" />
        <path className="germ-r" d="M0 0 C4 -8 14 -14 24 -12 C22 -4 12 1 0 0Z" fill="#5fae45" />
      </g>
    </svg>
  )
}
