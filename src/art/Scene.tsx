import type { ReactNode } from 'react'
import './art.css'

export type SceneMood = 'dawn' | 'day' | 'peach' | 'dusk' | 'night'

export const SKIES: Record<SceneMood, [string, string, string]> = {
  // one sky everywhere, the same as Home: sky blue at the top, lemon at the ground
  dawn: ['#cfe4f8', '#e3effa', '#fcffe9'],
  day: ['#cfe4f8', '#e3effa', '#fcffe9'],
  peach: ['#cfe4f8', '#e3effa', '#fcffe9'],
  dusk: ['#cfe4f8', '#e3effa', '#fcffe9'],
  // evening: deep ocean into teal, both from the palette
  night: ['#1f5f9e', '#1f72c4', '#3e8a80'],
}

type Props = {
  mood?: SceneMood
  /** hide the hills — for scenes where the foreground supplies its own ground */
  hills?: boolean
  sun?: boolean
  stars?: boolean
  children?: ReactNode
  className?: string
}

/**
 * Full-bleed backdrop: a soft sky and a quiet ground line,
 * three layers of soft hills with flowers. Scales to cover any phone.
 */
export function Scene({ mood = 'dawn', hills = true, stars, children, className }: Props) {
  const [a, b, c] = SKIES[mood]
  const night = mood === 'night'
  const id = `sky-${mood}`
  return (
    <div className={`scene ${className ?? ''}`}>
      <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMax slice" className="scene-svg" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="0.55" stopColor={b} />
            <stop offset="1" stopColor={c} />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop offset="0" stopColor={night ? '#fff6d6' : '#fff1c4'} stopOpacity="0.95" />
            <stop offset="1" stopColor={night ? '#fff6d6' : '#fff4c2'} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="390" height="844" fill={`url(#${id})`} />

        {(stars || night) &&
          [...Array(26)].map((_, i) => (
            <circle
              key={i}
              className="twinkle"
              style={{ animationDelay: `${(i % 7) * 0.4}s` }}
              cx={(i * 97) % 390}
              cy={30 + ((i * 53) % 360)}
              r={i % 3 === 0 ? 1.8 : 1.1}
              fill="#fffaf0"
            />
          ))}

        {/* one quiet ground line: no sun, clouds or flowers, so the scenes read as calm rather than storybook */}
        {hills && (
          <>
            <path d="M-20 620 C80 596 190 600 260 612 C320 622 370 606 420 604 L420 844 L-20 844 Z" fill={night ? '#2f7368' : '#ecf8d6'} />
            <path d="M-20 690 C90 672 200 676 270 686 C330 694 380 680 420 680 L420 844 L-20 844 Z" fill={night ? '#3e8a80' : '#dff5c3'} />
          </>
        )}
      </svg>
      {children}
    </div>
  )
}

/** Big painted leaves framing a corner, like the "Being a parent" welcome screen. */
export function Foliage({ side = 'left', className }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={`foliage ${side} ${className ?? ''}`}
      aria-hidden
      style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g className="leaf-sway" style={{ transformOrigin: '20px 260px' }}>
        <path d="M20 260 C10 190 40 120 110 90 C110 160 80 220 20 260 Z" fill="#3e8a80" />
        <path d="M20 260 C50 200 80 150 110 90" stroke="#33796f" strokeWidth="3" fill="none" />
      </g>
      <g className="leaf-sway slow" style={{ transformOrigin: '0px 260px' }}>
        <path d="M0 260 C-10 210 10 170 60 150 C60 200 40 240 0 260 Z" fill="#9cc9c0" />
      </g>
      <g className="leaf-sway" style={{ transformOrigin: '40px 260px', animationDelay: '0.8s' }}>
        <path d="M40 260 C70 220 120 200 180 210 C150 250 100 270 40 260 Z" fill="#ffb29d" />
      </g>
    </svg>
  )
}
