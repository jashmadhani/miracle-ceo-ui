import { blob } from './shapes'
import './art.css'

export type Mood = 'great' | 'good' | 'okay' | 'tired' | 'low' | 'anxious'

export const MOODS: { id: Mood; label: string; color: string; deep: string; seed: number; reply: string; sub: string }[] = [
  { id: 'great', label: 'Great', color: '#fcd893', deep: '#f4b23f', seed: 3, reply: 'Love that.', sub: 'Let’s put that energy somewhere good today.' },
  { id: 'good', label: 'Good', color: '#d4ece7', deep: '#3e8a80', seed: 8, reply: 'Good is plenty.', sub: 'A small moment together will keep it going.' },
  { id: 'okay', label: 'Okay', color: '#f4efdb', deep: '#b9a78c', seed: 14, reply: 'Okay is a fine place to start.', sub: 'Most days are okay days. They quietly add up.' },
  { id: 'tired', label: 'Tired', color: '#dfe9e1', deep: '#6e8f86', seed: 21, reply: 'Then we keep it tiny.', sub: 'Five minutes, nothing to prepare.' },
  { id: 'low', label: 'Low', color: '#e5e1ea', deep: '#5e5872', seed: 27, reply: 'Thanks for being honest.', sub: 'Go gently. Mira is here if you want to talk.' },
  { id: 'anxious', label: 'Worried', color: '#f9c9ce', deep: '#ec6f7d', seed: 33, reply: 'That’s a lot to carry.', sub: 'One breath, then one small thing. That’s all.' },
]

export function MoodFace({ mood, size = 96, active }: { mood: Mood; size?: number; active?: boolean }) {
  const m = MOODS.find((x) => x.id === mood)!
  const shape = blob(50, 52, 40, m.seed, 0.13, 6)
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`mood-face ${active ? 'active' : ''}`} aria-hidden>
      <defs>
        <linearGradient id={`mf-${mood}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="mood-body" style={{ transformOrigin: '50px 60px' }}>
        <path d={shape} fill={m.color} />
        <path d={shape} fill={`url(#mf-${mood})`} />
        <Expression mood={mood} />
      </g>
    </svg>
  )
}

function Expression({ mood }: { mood: Mood }) {
  const ink = '#3a2f45'
  const s = { stroke: ink, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' }
  const cheeks = (
    <>
      <ellipse cx="31" cy="60" rx="5" ry="3" fill="#f08d86" opacity="0.45" />
      <ellipse cx="69" cy="60" rx="5" ry="3" fill="#f08d86" opacity="0.45" />
    </>
  )
  switch (mood) {
    case 'great':
      return (
        <g>
          <path d="M33 48 Q38 42 43 48" {...s} />
          <path d="M57 48 Q62 42 67 48" {...s} />
          <path d="M38 60 Q50 74 62 60 Z" fill={ink} />
          {cheeks}
        </g>
      )
    case 'good':
      return (
        <g>
          <g className="blink" style={{ transformOrigin: '50px 48px' }}>
            <circle cx="38" cy="48" r="3.4" fill={ink} />
            <circle cx="62" cy="48" r="3.4" fill={ink} />
          </g>
          <path d="M40 61 Q50 69 60 61" {...s} />
          {cheeks}
        </g>
      )
    case 'okay':
      return (
        <g>
          <g className="blink" style={{ transformOrigin: '50px 48px' }}>
            <circle cx="38" cy="48" r="3.4" fill={ink} />
            <circle cx="62" cy="48" r="3.4" fill={ink} />
          </g>
          <path d="M41 63 L59 63" {...s} />
        </g>
      )
    case 'tired':
      return (
        <g>
          <path d="M32 50 Q38 54 44 50" {...s} />
          <path d="M56 50 Q62 54 68 50" {...s} />
          <ellipse cx="50" cy="65" rx="4" ry="3.5" fill={ink} />
          <text x="70" y="34" fontSize="11" fontWeight="700" fill={ink} opacity="0.5" className="zz">
            z
          </text>
        </g>
      )
    case 'low':
      return (
        <g>
          <circle cx="38" cy="51" r="3.2" fill={ink} />
          <circle cx="62" cy="51" r="3.2" fill={ink} />
          <path d="M40 67 Q50 60 60 67" {...s} />
        </g>
      )
    case 'anxious':
      return (
        <g>
          <path d="M32 40 L42 43" {...s} />
          <path d="M68 40 L58 43" {...s} />
          <circle cx="38" cy="50" r="3.4" fill={ink} />
          <circle cx="62" cy="50" r="3.4" fill={ink} />
          <path d="M38 65 Q42 61 46 65 Q50 69 54 65 Q58 61 62 65" {...s} />
        </g>
      )
  }
}
