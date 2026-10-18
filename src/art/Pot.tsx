import type { LeafTone } from './leafColors'

/*
 * A small clay pot for a skill on Grow. Its plant grows with every activity of
 * that kind done: a sprout at first, a taller stem with more leaves in the
 * skill's colour after each one, and a flower once they're all done.
 */
const LEAF = 'M0 0 C-6 -3 -7 -10 -2 -14 C3 -10 4 -3 0 0Z'

export function Pot({ done, total, tone, className }: { done: number; total: number; tone: LeafTone; className?: string }) {
  const p = Math.max(0, Math.min(1, total ? done / total : 0))
  const h = 12 + 34 * p // stem height above the soil
  const pairs = 1 + Math.min(5, done)
  const top = 60 - h
  const leaves = Array.from({ length: pairs }, (_, k) => {
    const t = (k + 1) / (pairs + 0.6)
    const y = 60 - h * t
    const side = k % 2 ? 1 : -1
    // the newest leaves, nearest the tip, wear the skill's colour
    const fill = k >= pairs - Math.min(done, 3) ? tone.fill : k % 2 ? '#8fc93f' : '#62a32a'
    return { y, side, fill, s: 0.95 + 0.4 * (1 - t) }
  })
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden>
      <ellipse cx="40" cy="93" rx="24" ry="3" fill="#2a2233" opacity="0.1" />
      <g className="pot-plant">
        <path d={`M40 60 C39 ${60 - h * 0.5} 41 ${60 - h * 0.8} 40 ${top}`} stroke="#5f8f2a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {leaves.map((l, k) => (
          <path key={k} d={LEAF} fill={l.fill} transform={`translate(40 ${l.y.toFixed(1)}) rotate(${l.side * 58}) scale(${l.s.toFixed(2)})`} />
        ))}
        <path d={LEAF} fill={done ? tone.fill : '#8fc93f'} transform={`translate(40 ${top}) scale(0.85)`} />
        {done >= total && total > 0 && (
          <g transform={`translate(40 ${top - 6})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-4" rx="2.6" ry="4" fill="#fff6f7" transform={`rotate(${a})`} />
            ))}
            <circle r="2.4" fill="#ffb937" />
          </g>
        )}
      </g>
      <path d="M19 66 L61 66 L56 90 Q55 92 52 92 L28 92 Q25 92 24 90Z" fill="#d98a5f" />
      <path d="M40 66 L61 66 L56 90 Q55 92 52 92 L40 92Z" fill="#c4734a" opacity="0.6" />
      <rect x="16" y="58" width="48" height="10" rx="4" fill="#e39a70" />
      <rect x="16" y="58" width="48" height="3.5" rx="1.75" fill="#f2c0a0" opacity="0.8" />
      <path d="M27 72 Q28 80 30 87" stroke="#fff" strokeWidth="2" opacity="0.3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
