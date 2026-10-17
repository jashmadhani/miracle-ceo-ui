import type { Skill } from '../data/content'
import { Illustration, illustrationUrl, type IllustrationName } from './Illustration'
import './art.css'

const BY_SKILL: Record<Skill, IllustrationName> = { EQ: 'emotion-snap', SQ: 'conversation-snap', IQ: 'focus-hunt' }

/** Card-sized illustration for an activity: its own scene when it has one, else its skill's. */
export function ActivityArt({ skill, id, className }: { skill: Skill; id?: string; className?: string }) {
  const name = (id && illustrationUrl(id) ? id : BY_SKILL[skill]) as IllustrationName
  return <Illustration name={name} className={`activity-art ${className ?? ''}`} />
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
