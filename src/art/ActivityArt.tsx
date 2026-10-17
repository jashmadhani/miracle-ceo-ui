import type { Skill } from '../data/content'
import './art.css'

const SKIN = '#f0c39c'
const INK = '#2a2233'

function Kid({ x, y, top, hair, flip, mouth = 'smile' }: { x: number; y: number; top: string; hair: string; flip?: boolean; mouth?: 'smile' | 'o' }) {
  return (
    <g transform={`translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}`}>
      <path d="M-30 80 C-32 44 -16 24 0 24 C16 24 32 44 30 80 Z" fill={top} />
      <g className="head-tilt-child" style={{ transformOrigin: '0px 20px' }}>
        <circle cx="0" cy="0" r="26" fill={SKIN} />
        <path d="M-26 -4 C-26 -26 -8 -32 4 -30 C20 -28 28 -16 26 -2 C16 -12 6 -14 -2 -10 C-10 -18 -20 -14 -26 -4 Z" fill={hair} />
        <g className="blink" style={{ transformOrigin: '0px 4px' }}>
          <circle cx="-9" cy="4" r="3" fill={INK} />
          <circle cx="9" cy="4" r="3" fill={INK} />
        </g>
        <ellipse cx="-15" cy="13" rx="5" ry="3" fill="#f08d86" opacity="0.6" />
        <ellipse cx="15" cy="13" rx="5" ry="3" fill="#f08d86" opacity="0.6" />
        {mouth === 'smile' ? (
          <path d="M-5 14 C-2 18 3 18 6 14" stroke="#7a3b2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          <ellipse cx="1" cy="16" rx="3.5" ry="4" fill="#7a3b2e" />
        )}
      </g>
    </g>
  )
}

/** Card-sized illustrations for activities, one family per skill so the app reads at a glance. */
export function ActivityArt({ skill, className }: { skill: Skill; className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden preserveAspectRatio="xMidYMax meet">
      {skill === 'EQ' && (
        <>
          <ellipse cx="160" cy="210" rx="130" ry="12" fill={INK} opacity="0.07" />
          <Kid x={110} y={130} top="#4fa69f" hair="#6b3e26" />
          <Kid x={210} y={130} top="#ffc94f" hair="#3a2430" flip mouth="o" />
          {/* feeling cards floating between them */}
          <g className="float-a">
            <rect x="136" y="34" width="48" height="58" rx="10" fill="#fffdf8" transform="rotate(-8 160 63)" />
            <circle cx="160" cy="58" r="11" fill="#ffc94f" />
            <path d="M154 62 Q160 68 166 62" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </g>
          <g className="float-b">
            <path d="M246 46 C246 38 256 34 262 42 C268 34 278 38 278 46 C278 58 262 66 262 66 C262 66 246 58 246 46 Z" fill="#ff7a59" />
          </g>
          <g className="float-c">
            <path d="M52 64 C52 58 59 55 63 61 C67 55 74 58 74 64 C74 72 63 78 63 78 C63 78 52 72 52 64 Z" fill="#ffb29d" />
          </g>
        </>
      )}
      {skill === 'SQ' && (
        <>
          <ellipse cx="160" cy="210" rx="130" ry="12" fill={INK} opacity="0.07" />
          <Kid x={100} y={130} top="#ff8a6b" hair="#3a2430" />
          <Kid x={220} y={130} top="#9c90ee" hair="#8a5a2e" flip />
          <g className="float-a">
            <path d="M52 40 h76 a14 14 0 0 1 14 14 v20 a14 14 0 0 1 -14 14 h-50 l-14 12 v-12 h-12 a14 14 0 0 1 -14 -14 v-20 a14 14 0 0 1 14 -14 Z" fill="#fffdf8" />
            <circle cx="72" cy="64" r="4" fill={INK} />
            <circle cx="90" cy="64" r="4" fill={INK} />
            <circle cx="108" cy="64" r="4" fill={INK} />
          </g>
          <g className="float-b">
            <path d="M196 30 h70 a14 14 0 0 1 14 14 v16 a14 14 0 0 1 -14 14 h-12 v12 l-14 -12 h-44 a14 14 0 0 1 -14 -14 v-16 a14 14 0 0 1 14 -14 Z" fill="#ffc94f" />
            <path d="M208 52 h44" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          </g>
        </>
      )}
      {skill === 'IQ' && (
        <>
          <ellipse cx="160" cy="210" rx="130" ry="12" fill={INK} opacity="0.07" />
          <Kid x={140} y={130} top="#4fa69f" hair="#6b3e26" mouth="o" />
          {/* magnifier */}
          <g className="float-a" style={{ transformOrigin: '210px 120px' }}>
            <circle cx="214" cy="104" r="26" fill="#fffdf8" fillOpacity="0.6" stroke={INK} strokeWidth="7" />
            <path d="M232 124 L256 150" stroke={INK} strokeWidth="10" strokeLinecap="round" />
            <circle cx="206" cy="96" r="7" fill="#fff" opacity="0.9" />
          </g>
          {/* shapes */}
          <g className="float-b">
            <rect x="40" y="56" width="30" height="30" rx="7" fill="#ff7a59" transform="rotate(12 55 71)" />
          </g>
          <g className="float-c">
            <path d="M262 40 L284 76 L240 76 Z" fill="#ffc94f" />
          </g>
          <g className="float-a">
            <circle cx="72" cy="150" r="14" fill="#9c90ee" />
          </g>
        </>
      )}
    </svg>
  )
}

/** Small spot art for the bento "things worth knowing" tiles. */
export function SpotBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <g className="float-a">
        <path d="M14 30 L60 40 L106 30 L106 84 L60 94 L14 84 Z" fill="#fffdf8" />
        <path d="M60 40 L60 94" stroke="#e5d8c4" strokeWidth="3" />
        <path d="M10 26 L14 30 L14 84 L10 80 Z M110 26 L106 30 L106 84 L110 80 Z" fill="#2a2233" opacity="0.85" />
        <path d="M24 52 L50 57 M24 64 L50 69 M70 57 L96 52 M70 69 L96 64" stroke="#e5d8c4" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function SpotHeadphones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <g className="float-b">
        <path d="M24 64 C24 34 40 18 60 18 C80 18 96 34 96 64" stroke="#2a2233" strokeWidth="9" fill="none" strokeLinecap="round" />
        <rect x="14" y="56" width="24" height="34" rx="12" fill="#fffdf8" />
        <rect x="82" y="56" width="24" height="34" rx="12" fill="#fffdf8" />
      </g>
    </svg>
  )
}

export function Leaf({ size = 18, color = 'var(--leaf)', className }: { size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M4 20 C4 10 10 4 20 4 C20 14 14 20 4 20 Z" fill={color} />
      <path d="M4 20 L14 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
