import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, TabBar } from '../components/Shell'
import { useToday } from '../components/Cards'
import { Icon } from '../components/Icon'
import { TodayCard } from '../components/TodayCard'
import { ActivityArt } from '../art/ActivityArt'
import { Pot } from '../art/Pot'
import { LEAF_TONES } from '../art/leafColors'
import { ACTIVITIES, SKILLS, type Skill } from '../data/content'
import { useChild, useStore } from '../state/store'
import './grow.css'

const INSIGHT_AFTER = 8

export function Grow() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const child = useChild()
  const { act, done } = useToday()
  const [kind, setKind] = useState<Skill | 'all'>('all')
  const [time, setTime] = useState<'any' | 5 | 15 | 30>('any')
  const [spinning, setSpinning] = useState<Skill | null>(null)
  const [insights, setInsights] = useState(false)
  const [bucket, setBucket] = useState<'todo' | 'going' | 'done'>('todo')

  const doneCount = Object.keys(s.done).length
  const inBucket = (a: (typeof ACTIVITIES)[number]) => (bucket === 'done' ? !!s.done[a.id] : bucket === 'going' ? !s.done[a.id] && s.started.includes(a.id) : !s.done[a.id] && !s.started.includes(a.id))
  const counts = { todo: ACTIVITIES.filter((a) => !s.done[a.id] && !s.started.includes(a.id)).length, going: ACTIVITIES.filter((a) => !s.done[a.id] && s.started.includes(a.id)).length, done: doneCount }
  const list = ACTIVITIES.filter((a) => inBucket(a) && (kind === 'all' || a.skill === kind) && (time === 'any' || a.minutes <= time))
  const bySkill = (['SQ', 'EQ', 'IQ'] as Skill[]).map((k) => [k, ACTIVITIES.filter((a) => a.skill === k && s.done[a.id]).length] as const)

  const choose = (sk: Skill) => {
    const pick = ACTIVITIES.find((a) => a.skill === sk && a.id !== s.todayId && !s.done[a.id]) ?? ACTIVITIES.find((a) => a.skill === sk)!
    set({ todayId: pick.id })
    const kind = SKILLS[sk].name.toLowerCase()
    toast({ title: `Today: ${pick.title}`, body: `Swapped in ${/^[aeiou]/.test(kind) ? 'an' : 'a'} ${kind} activity.` })
  }

  const surprise = () => {
    const order: Skill[] = ['SQ', 'EQ', 'IQ']
    let k = 0
    const final = order[Math.floor(Math.random() * 3)]
    const iv = setInterval(() => {
      setSpinning(order[k++ % 3])
      if (k > 7 && order[(k - 1) % 3] === final) {
        clearInterval(iv)
        setTimeout(() => {
          setSpinning(null)
          choose(final)
        }, 350)
      }
    }, 230)
  }

  return (
    <>
      <div className="screen with-tabbar grow">
        <header className="pad grow-head">
          <p className="eyebrow">
            For {child.name} · {child.age.label}
          </p>
          <h1 className="display grow-title">Let’s grow together.</h1>
        </header>

        {/* today's activity: the same card as on Home */}
        <div className="pad">
          <TodayCard className="today-solo" />
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>What should we work on?</h2>
          </div>
          <div className="skills">
            {(['SQ', 'EQ', 'IQ'] as Skill[]).map((k) => {
              const sk = SKILLS[k]
              const mine = ACTIVITIES.filter((a) => a.skill === k)
              const n = mine.filter((a) => s.done[a.id]).length
              const of = mine.length
              return (
                <button key={k} className={`skill-tile sk-${k} ${spinning === k ? 'lit' : ''} ${act.skill === k && !spinning ? 'current' : ''}`} onClick={() => choose(k)}>
                  <Pot done={n} total={of} tone={LEAF_TONES[k]} className="skill-pot" />
                  <span className="skill-name">{sk.name}</span>
                  <span className="skill-long">{sk.long}</span>
                  <span className="skill-meta">{n ? `${n} of ${of} done` : 'Ready to start'}</span>
                </button>
              )
            })}
          </div>
          <button className="btn ghost block" style={{ marginTop: 12 }} onClick={surprise} disabled={!!spinning}>
            <Icon name="shuffle" size={20} /> Not sure? Let Mira choose
          </button>
          <p className="muted" style={{ fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            Picking one changes today’s activity.
          </p>

          <button className="insight-tile" style={{ marginTop: 20 }} onClick={() => setInsights(true)}>
            <Ring value={Math.min(doneCount, INSIGHT_AFTER)} max={INSIGHT_AFTER} />
            <span style={{ flex: 1 }}>
              <span className="tile-title" style={{ display: 'block' }}>
                Insights by Mira
              </span>
              <span className="muted" style={{ fontSize: 14 }}>
                {doneCount >= INSIGHT_AFTER ? 'Ready to read' : `Ready after ${INSIGHT_AFTER - doneCount} more activities`}
              </span>
            </span>
            <Icon name="chev" />
          </button>

          <div className="section-head">
            <h2>What {child.name} is showing you</h2>
          </div>
          <div className="card x-portrait">
            {doneCount === 0 ? (
              <p className="muted">Do a first activity together and Mira will start to notice what {child.name} is showing you.</p>
            ) : (
              <>
                {bySkill.map(([k, n]) => (
                  <div key={k} className="x-portrait-row">
                    <span className="r-icon" style={{ background: SKILLS[k].bg, color: SKILLS[k].fg }}>
                      <Icon name={SKILLS[k].icon} size={18} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <b>{SKILLS[k].name}</b>
                      <small className="muted" style={{ display: 'block' }}>
                        {n === 0 ? 'Not seen yet' : `${n} moment${n === 1 ? '' : 's'} together`}
                      </small>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="section-head">
            <h2>Something to try</h2>
          </div>
          <div className="x-buckets" role="tablist" aria-label="Activities">
            {(
              [
                ['todo', 'To do'],
                ['going', 'In progress'],
                ['done', 'Done'],
              ] as const
            ).map(([k, l]) => (
              <button key={k} role="tab" aria-selected={bucket === k} className={`x-bucket ${bucket === k ? 'on' : ''}`} onClick={() => setBucket(k)}>
                {l} <b>{counts[k]}</b>
              </button>
            ))}
          </div>
          <div className="filters">
            {(
              [
                ['all', 'All'],
                ['SQ', 'Social'],
                ['EQ', 'Emotional'],
                ['IQ', 'Intelligence'],
              ] as const
            ).map(([k, l]) => (
              <button key={k} className={`chip ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>
                {l}
              </button>
            ))}
            <span className="filter-sep" />
            {(
              [
                ['any', 'Any time'],
                [5, '5 min'],
                [15, '≤ 15 min'],
                [30, '≤ 30 min'],
              ] as const
            ).map(([k, l]) => (
              <button key={String(k)} className={`chip ${time === k ? 'on' : ''}`} onClick={() => setTime(k)}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* activities swipe sideways, big art first */}
        <div className="act-rail">
          {list.map((a) => (
            <button key={a.id} className={`act-card-v sk-${a.skill}`} onClick={() => nav(`/activity/${a.id}`)}>
              <span className="act-card-v-art">
                <ActivityArt skill={a.skill} id={a.id} />
                {s.done[a.id] && (
                  <span className="act-card-v-done">
                    <Icon name="check" size={14} stroke={3} /> Done
                  </span>
                )}
              </span>
              <span className="eyebrow" style={{ color: SKILLS[a.skill].fg }}>
                {a.topic}
              </span>
              <span className="act-card-v-title">{a.title}</span>
              <span className="act-item-meta">
                <Icon name="clock" size={14} /> {a.minutes} min
              </span>
            </button>
          ))}
          {list.length === 0 && <div className="empty">{bucket === 'done' ? 'Nothing finished yet. The first one is a good one.' : bucket === 'going' ? 'Nothing in progress right now.' : 'Nothing fits those filters yet.'}</div>}
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>Pick what’s on your mind</h2>
          </div>
          <div className="topics">
            {[
              ['SQ', 'Making friends'],
              ['SQ', 'Sharing & turns'],
              ['EQ', 'Naming feelings'],
              ['EQ', 'Calming down'],
              ['IQ', 'Asking questions'],
              ['IQ', 'Figuring things out'],
            ].map(([k, t]) => (
              <button
                key={t}
                className={`topic sk-${k}`}
                onClick={() => {
                  setKind(k as Skill)
                  document.querySelector('.filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <span className="topic-dot">
                  <Icon name={SKILLS[k as Skill].icon} size={16} />
                </span>
                <span className="topic-title">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TabBar />
      {insights && (
        <Sheet onClose={() => setInsights(false)} label="Insights by Mira">
          {doneCount >= INSIGHT_AFTER ? (
            <div className="x-read">
              <p className="eyebrow">Mira’s read on the week</p>
              <h2 className="display" style={{ fontSize: 26, margin: '4px 0 12px' }}>
                What Mira noticed
              </h2>
              <ul>
                <li>{child.name} warms up fastest when you name the feeling first.</li>
                <li>Short rounds keep {child.he === 'they' ? 'them' : child.him} going for longer.</li>
                <li>The best moments came when you did the activity together, not nearby.</li>
              </ul>
              <div className="x-challenge">
                <p className="eyebrow">A challenge, if you want one</p>
                <b className="display">Seven days of smoother bedtimes</b>
                <button
                  className="btn small"
                  onClick={() => {
                    setInsights(false)
                    nav('/solve?tab=challenge')
                  }}
                >
                  See the plan
                </button>
              </div>
            </div>
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
            <Ring value={Math.min(doneCount, INSIGHT_AFTER)} max={INSIGHT_AFTER} big />
            <h2 className="display" style={{ fontSize: 28, margin: '16px 0 6px' }}>
              {doneCount} of {INSIGHT_AFTER} activities
            </h2>
            <p className="muted" style={{ maxWidth: 300 }}>
              Mira is still getting to know {child.name}. After {Math.max(0, INSIGHT_AFTER - doneCount)} more activities together, she’ll share what she sees.
            </p>
            <button
              className="btn block"
              style={{ marginTop: 22 }}
              onClick={() => {
                setInsights(false)
                nav(`/activity/${act.id}`)
              }}
            >
              Do today’s activity
            </button>
          </div>
          )}
        </Sheet>
      )}
    </>
  )
}

function Ring({ value, max, big }: { value: number; max: number; big?: boolean }) {
  const r = big ? 52 : 24
  const c = 2 * Math.PI * r
  const size = (r + 8) * 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: 'none' }} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(42,34,51,.08)" strokeWidth={big ? 12 : 7} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--mira)"
        strokeWidth={big ? 12 : 7}
        strokeLinecap="round"
        strokeDasharray={`${(value / max) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 1s var(--ease-out)' }}
      />
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontFamily="var(--display)" fontWeight="700" fontSize={big ? 30 : 16} fill="var(--ink)">
        {value}
      </text>
    </svg>
  )
}
