import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { ActivityArt, Leaf } from '../art/ActivityArt'
import { useToday } from './Cards'
import { SKILLS } from '../data/content'

/**
 * Today's activity, drawn the same way wherever it appears (Home, Grow, Journey):
 * the colour block with the activity's own painted scene, the title, time and leaves,
 * and the one filled Start (a tick alone once it's done today).
 */
export function TodayCard({ className = '' }: { className?: string }) {
  const nav = useNavigate()
  const { act, done } = useToday()
  const open = () => nav(`/activity/${act.id}`)
  return (
    <section className={`hs-block hs-today ${className}`} aria-label={`Today’s activity: ${act.title}, ${act.minutes} minutes`}>
      <span className="hs-headline">
        <h2 className="hs-label">Today’s activity</h2>
      </span>
      {/* what it is */}
      <span className="hs-today-main">
        {/* the activity's own painted scene, the same one its card shows in Grow */}
        <span className="hs-skill" aria-hidden>
          <ActivityArt skill={act.skill} id={act.id} />
        </span>
        <span className="hs-today-copy">
          <b>{act.title}</b>
          <small>Builds {SKILLS[act.skill].name.toLowerCase()} skills</small>
        </span>
      </span>
      {/* how long, what it earns, and the one action */}
      <span className="hs-today-foot">
        <span className="hs-meta">
          <span>
            <Icon name="clock" size={14} /> {act.minutes} min
          </span>
          <span>
            <Leaf size={14} color="#fff" /> +3 leaves
          </span>
        </span>
        {done ? (
          // done today: a tick alone, no extra words
          <button className="hs-tick" onClick={open} aria-label={`Done today: ${act.title}. Open it again`}>
            <Icon name="check" size={22} stroke={2.8} />
          </button>
        ) : (
          <button className="hs-cta" onClick={open} aria-label={`Start today’s activity: ${act.title}`}>
            <span className="hs-cta-text">Start</span> <Icon name="arrow" size={16} stroke={2.4} />
          </button>
        )}
      </span>
    </section>
  )
}
