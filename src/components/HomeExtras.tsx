import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { Sheet } from './Shell'
import { ACTIVITIES } from '../data/content'
import { useChild, useStore } from '../state/store'
import './extras.css'

/** Closes the loop on the last thing Mira suggested: "Did you get to try it?" */
export function OpenTaskCard() {
  const { s, set, earn, toast } = useStore()
  if (!s.openTask) return null
  const answer = (kind: 'worked' | 'no' | 'skip') => {
    if (kind === 'worked') {
      earn(2, 'Tried what Mira suggested', 'challenge')
      toast({ title: 'That is a win', body: 'Two leaves added to the tree.' })
    } else if (kind === 'no') {
      toast({ title: 'Thank you for telling us', body: 'Mira will suggest a gentler way next time.' })
    }
    set({ openTask: null })
  }
  return (
    <div className="x-task card" role="group" aria-label="Did you get to try it?">
      <p className="eyebrow">From {s.openTask.from}</p>
      <h3 className="display">Did you get to try it?</h3>
      <p className="x-task-title">{s.openTask.title}</p>
      <div className="x-task-btns">
        <button className="x-task-btn good" onClick={() => answer('worked')}>
          It worked
        </button>
        <button className="x-task-btn" onClick={() => answer('no')}>
          Tried it, no
        </button>
        <button className="x-task-btn" onClick={() => answer('skip')}>
          Not this week
        </button>
      </div>
    </div>
  )
}

/** One tap from Home into Ask Mira. */
export function AskMiraCard() {
  const nav = useNavigate()
  return (
    <button className="x-ask" onClick={() => nav('/solve')}>
      <span className="x-ask-mic">
        <Icon name="mic" size={26} />
      </span>
      <span className="x-ask-copy">
        <b className="display">What happened today?</b>
        <small>Type it, or just say it</small>
      </span>
      <Icon name="chev" size={20} />
    </button>
  )
}

export function SectionLink({ to, children }: { to: string; children: string }) {
  const nav = useNavigate()
  return (
    <button className="x-link" onClick={() => nav(to)}>
      {children} <Icon name="chev" size={14} />
    </button>
  )
}

/** The next few things to do, each one a tap away. */
export function ReadyList() {
  const nav = useNavigate()
  const { s } = useStore()
  const list = ACTIVITIES.filter((a) => !s.done[a.id]).slice(0, 3)
  return (
    <div className="card">
      {list.map((a) => (
        <button key={a.id} className="row x-row" onClick={() => nav(`/activity/${a.id}`)}>
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span className="r-title" style={{ display: 'block' }}>
              {a.title}
            </span>
            <small className="muted">{a.minutes} min</small>
          </span>
          <Icon name="chev" size={18} />
        </button>
      ))}
    </div>
  )
}

const BANDS = [
  { id: '3', label: 'Ages 3–4', blurb: 'Big feelings, first friends', tint: 'var(--accent-soft)', edge: '#4f8fd1', topics: ['Naming feelings', 'Taking turns', 'Settling at bedtime'] },
  { id: '5', label: 'Ages 5–6', blurb: 'School, rules, and why', tint: 'var(--reward-soft)', edge: '#f6b137', topics: ['Making friends', 'Listening and rules', 'Honest mistakes'] },
  { id: '7', label: 'Ages 7–8', blurb: 'Fairness, focus, confidence', tint: 'var(--primary-soft)', edge: '#3e8a80', topics: ['Handling losing', 'Homework without tears', 'Kind words'] },
]

/** "Explore by interest": browse another stage without changing the child profile. */
export function AgeRail({ compact }: { compact?: boolean }) {
  const nav = useNavigate()
  const child = useChild()
  const [open, setOpen] = useState<(typeof BANDS)[number] | null>(null)
  return (
    <>
      {compact ? (
        <div className="x-chips" role="list">
          {BANDS.map((b) => (
            <button key={b.id} role="listitem" className="x-age-chip" style={{ '--chip': b.edge } as CSSProperties} onClick={() => setOpen(b)} aria-label={b.label}>
              {b.label.replace('Ages ', '')}
            </button>
          ))}
        </div>
      ) : (
        <div className="x-rail" role="list">
          {BANDS.map((b) => (
            <button key={b.id} role="listitem" className="x-age" style={{ background: b.tint }} onClick={() => setOpen(b)}>
              <b className="display">{b.label}</b>
              <small>{b.blurb}</small>
            </button>
          ))}
        </div>
      )}
      {open && (
        <Sheet onClose={() => setOpen(null)} label={open.label}>
          <h3 className="display" style={{ fontSize: 24 }}>
            {open.label}
          </h3>
          <p className="muted" style={{ margin: '6px 0 14px' }}>
            A look at what comes up at this stage. {child.name}’s own plan does not change.
          </p>
          <div className="card">
            {open.topics.map((t) => (
              <button key={t} className="row x-row" onClick={() => nav('/grow')}>
                <span className="r-title" style={{ flex: 1, textAlign: 'left' }}>
                  {t}
                </span>
                <Icon name="chev" size={18} />
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
