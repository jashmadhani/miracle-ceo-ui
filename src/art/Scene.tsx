import type { ReactNode } from 'react'
import './art.css'

export type SceneMood = 'dawn' | 'day' | 'peach' | 'dusk' | 'night'

const SKIES: Record<SceneMood, [string, string, string]> = {
  dawn: ['#e6dcf8', '#fde9b8', '#fbd8d1'],
  day: ['#cfe3f8', '#eaf2fb', '#fff1cc'],
  peach: ['#fde3a8', '#fde9c4', '#fbd8d1'],
  dusk: ['#c8b8ef', '#f6c1c7', '#fde3a8'],
  night: ['#2f2c5a', '#4b4580', '#8e79c2'],
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
 * Full-bleed illustrated backdrop: gradient sky, sun, drifting clouds,
 * three layers of soft hills with flowers. Scales to cover any phone.
 */
export function Scene({ mood = 'dawn', hills = true, sun = true, stars, children, className }: Props) {
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
            <stop offset="0" stopColor={night ? '#fff6d6' : '#fff4c2'} stopOpacity="0.95" />
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

        {sun && (
          <g className="sun-float">
            <circle cx="300" cy="360" r="120" fill={`url(#${id}-glow)`} />
            {night ? (
              <>
                <mask id={`${id}-moon`}>
                  <rect width="390" height="844" fill="#fff" />
                  <circle cx="318" cy="348" r="40" fill="#000" />
                </mask>
                <circle cx="300" cy="360" r="44" fill="#fff3c9" mask={`url(#${id}-moon)`} />
              </>
            ) : (
              <circle cx="300" cy="360" r="44" fill="#ffd86b" />
            )}
          </g>
        )}

        <g className="cloud-drift" opacity={night ? 0.35 : 0.9}>
          <path d="M36 180 C36 164 52 156 64 162 C70 148 92 146 102 160 C116 156 128 166 124 180 Z" fill="#fffaf2" />
        </g>
        <g className="cloud-drift slow" opacity={night ? 0.3 : 0.8}>
          <path d="M210 120 C210 108 222 102 232 106 C238 96 256 96 262 106 C272 104 282 112 278 122 Z" fill="#fffaf2" />
        </g>

        {hills && (
          <>
            <path d="M-20 560 C60 500 140 520 210 540 C280 560 340 500 420 520 L420 844 L-20 844 Z" fill={night ? '#5a4f8f' : '#e9ddf6'} />
            <path d="M-20 620 C40 590 110 580 190 600 C270 620 330 580 420 590 L420 844 L-20 844 Z" fill={night ? '#6e5fa3' : '#f9d2cd'} />
            <path d="M-20 690 C80 660 170 670 230 680 C300 692 360 670 420 676 L420 844 L-20 844 Z" fill={night ? '#7f6db3' : '#fbe1a3'} />
            {!night &&
              [
                [40, 700, '#ef7f72'],
                [70, 712, '#7fa9de'],
                [330, 690, '#ef7f72'],
                [360, 704, '#a48bdc'],
                [300, 712, '#7fa9de'],
              ].map(([x, y, col], i) => (
                <g key={i} className="flower-sway" style={{ transformOrigin: `${x}px ${Number(y) + 22}px`, animationDelay: `${i * 0.3}s` }}>
                  <path d={`M${x} ${Number(y) + 22} L${x} ${y}`} stroke="#5f9b6f" strokeWidth="2.5" />
                  {[0, 72, 144, 216, 288].map((r) => (
                    <ellipse
                      key={r}
                      cx={x as number}
                      cy={(y as number) - 6}
                      rx="3.6"
                      ry="6"
                      fill={col as string}
                      transform={`rotate(${r} ${x} ${y})`}
                    />
                  ))}
                  <circle cx={x as number} cy={y as number} r="3" fill="#fff1b8" />
                </g>
              ))}
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
        <path d="M20 260 C10 190 40 120 110 90 C110 160 80 220 20 260 Z" fill="#2f8f86" />
        <path d="M20 260 C50 200 80 150 110 90" stroke="#1f6f69" strokeWidth="3" fill="none" />
      </g>
      <g className="leaf-sway slow" style={{ transformOrigin: '0px 260px' }}>
        <path d="M0 260 C-10 210 10 170 60 150 C60 200 40 240 0 260 Z" fill="#7cc4a6" />
      </g>
      <g className="leaf-sway" style={{ transformOrigin: '40px 260px', animationDelay: '0.8s' }}>
        <path d="M40 260 C70 220 120 200 180 210 C150 250 100 270 40 260 Z" fill="#f2a493" />
      </g>
    </svg>
  )
}
