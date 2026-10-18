import { ACTIVITIES, type Skill } from '../data/content'
import { Illustration, illustrationUrl, type IllustrationName } from './Illustration'
import { LEAF_TONES, type LeafTone } from './leafColors'
import './art.css'

const BY_SKILL: Record<Skill, IllustrationName> = { EQ: 'eq-0', SQ: 'sq-0', IQ: 'iq-0' }

/** Card-sized illustration for an activity: its own scene, its stand-in, or its skill's first scene. */
export function ActivityArt({ skill, id, className }: { skill: Skill; id?: string; className?: string }) {
  const own = id && illustrationUrl(id) ? id : undefined
  const standIn = ACTIVITIES.find((a) => a.id === id)?.art
  const name = own ?? standIn ?? BY_SKILL[skill]
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

/** A small leaf icon. Pass a LeafTone to show the colour of what grew it. */
export function Leaf({ size = 18, color = 'var(--leaf)', tone, className }: { size?: number; color?: string; tone?: LeafTone; className?: string }) {
  const fill = tone?.fill ?? color
  // pale leaves (showing up) get an outline so they read on cream
  const edge = tone && tone === LEAF_TONES.other ? tone.stroke : undefined
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path d="M4 20 C4 10 10 4 20 4 C20 14 14 20 4 20 Z" fill={fill} stroke={edge} strokeWidth={edge ? 1.6 : undefined} />
      <path d="M4 20 L14 10" stroke={edge ?? '#fff'} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
