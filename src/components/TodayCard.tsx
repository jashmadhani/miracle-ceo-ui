import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { Leaf } from '../art/ActivityArt'
import { Pot } from '../art/Pot'
import { LEAF_TONES } from '../art/leafColors'
import { useToday } from './Cards'
import { ACTIVITIES, SKILLS } from '../data/content'
import { useStore } from '../state/store'

/**
 * Today's activity, drawn the same way wherever it appears (Home, Grow, Journey):
 * the ocean-blue block with the skill's growing pot, the title, time and leaves,
 * and the one filled Start (a tick alone once it's done today).
 */
export function TodayCard({ className = '' }: { className?: string }) {
  const nav = useNavigate()
  const { s } = useStore()
  const { act, done } = useToday()
  const skillActs = ACTIVITIES.filter((a) => a.skill === act.skill)
  const skillDone = skillActs.filter((a) => s.done[a.id]).length
  const open = () => nav(`/activity/${act.id}`)
  return (
    <section className={`hs-block hs-today ${className}`} aria-label={`Today’s activity: ${act.title}, ${act.minutes} minutes`}>
      <span className="hs-headline">
        <h2 className="hs-label">Today’s activity</h2>
      </span>
      {/* what it is */}
      <span className="hs-today-main">
        {/* the skill's growing pot from Grow: it fills in as this skill's activities get done */}
        <span className="hs-skill" aria-hidden>
          <Pot done={skillDone} total={skillActs.length} tone={LEAF_TONES[act.skill]} />
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
