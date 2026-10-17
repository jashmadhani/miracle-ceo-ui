import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChildSwitcher, Sheet, TabBar } from '../components/Shell'
import { TodayHero, useToday } from '../components/Cards'
import { Icon } from '../components/Icon'
import { ActivityArt, Leaf } from '../art/ActivityArt'
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
  const [time, setTime] = useState<'any' | 5 | 20>('any')
  const [spinning, setSpinning] = useState<Skill | null>(null)
  const [insights, setInsights] = useState(false)

  const doneCount = Object.keys(s.done).length
  const list = ACTIVITIES.filter((a) => (kind === 'all' || a.skill === kind) && (time === 'any' || a.minutes <= time))

  const choose = (sk: Skill) => {
    const pick = ACTIVITIES.find((a) => a.skill === sk && a.id !== s.todayId && !s.done[a.id]) ?? ACTIVITIES.find((a) => a.skill === sk)!
    set({ todayId: pick.id })
    toast({ title: `Today: ${pick.title}`, body: `Swapped in a ${SKILLS[sk].name.toLowerCase()} moment.` })
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
    }, 140)
  }

  return (
    <>
      <div className="screen with-tabbar grow">
        <header className="pad grow-head">
          <h1 className="display" style={{ fontSize: 40 }}>
            Let’s grow
            <br />
            together.
          </h1>
          <ChildSwitcher />
        </header>

        <div className="pad">
          <p className="eyebrow" style={{ margin: '22px 0 10px 4px' }}>
            Today’s moment
          </p>
          <TodayHero act={act} done={done} compact />
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>What shall we work on?</h2>
          </div>
          <div className="skills">
            {(['SQ', 'EQ', 'IQ'] as Skill[]).map((k) => {
              const sk = SKILLS[k]
              const n = ACTIVITIES.filter((a) => a.skill === k && s.done[a.id]).length
              return (
                <button key={k} className={`skill-tile ${spinning === k ? 'lit' : ''} ${act.skill === k && !spinning ? 'current' : ''}`} style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }} onClick={() => choose(k)}>
                  <span className="skill-ic" style={{ color: sk.fg, background: sk.bg }}>
                    <Icon name={sk.icon} size={24} />
                  </span>
                  <span className="skill-code">{k}</span>
                  <span className="skill-name">{sk.name}</span>
                  <span className="skill-meta">{n ? `${n} done` : 'Not started'}</span>
                </button>
              )
            })}
          </div>
          <button className="btn ghost block" style={{ marginTop: 12 }} onClick={surprise} disabled={!!spinning}>
            <Icon name="shuffle" size={20} /> Not sure? Let it choose
          </button>
          <p className="muted" style={{ fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            Picking one swaps today’s moment.
          </p>
        </div>

        <div className="pad" style={{ marginTop: 20 }}>
          <button className="insight-tile" onClick={() => setInsights(true)}>
            <Ring value={Math.min(doneCount, INSIGHT_AFTER)} max={INSIGHT_AFTER} />
            <span style={{ flex: 1 }}>
              <span className="tile-title" style={{ display: 'block' }}>
                Insights by Mira
              </span>
              <span className="muted" style={{ fontSize: 14 }}>
                {doneCount >= INSIGHT_AFTER ? 'Ready to read' : `${INSIGHT_AFTER - doneCount} more moments to unlock`}
              </span>
            </span>
            <Icon name="chev" />
          </button>
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>Something to try</h2>
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
                [20, '≤ 20 min'],
              ] as const
            ).map(([k, l]) => (
              <button key={String(k)} className={`chip ${time === k ? 'on' : ''}`} onClick={() => setTime(k)}>
                {l}
              </button>
            ))}
          </div>
          <div className="act-list">
            {list.map((a) => (
              <button key={a.id} className={`act-item sk-${a.skill}`} onClick={() => nav(`/activity/${a.id}`)}>
                <span className="act-thumb">
                  <ActivityArt skill={a.skill} />
                </span>
                <span className="act-item-copy">
                  <span className="eyebrow" style={{ color: SKILLS[a.skill].fg }}>
                    {a.topic}
                  </span>
                  <span className="tile-title">{a.title}</span>
                  <span className="act-item-meta">
                    <Icon name="clock" size={14} /> {a.minutes} min
                    <Leaf size={14} /> +3
                    {s.done[a.id] && (
                      <b style={{ color: 'var(--teal)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <Icon name="check" size={14} stroke={3} /> Done
                      </b>
                    )}
                  </span>
                </span>
              </button>
            ))}
            {list.length === 0 && <div className="empty">Nothing fits those filters yet.</div>}
          </div>
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>Pick what’s on your mind</h2>
          </div>
          <div className="bento">
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
                className="tile topic"
                style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', minHeight: 116 }}
                onClick={() => {
                  setKind(k as Skill)
                  document.querySelector('.filters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <span className="pill" style={{ alignSelf: 'flex-start', background: SKILLS[k as Skill].bg, color: SKILLS[k as Skill].fg }}>
                  {SKILLS[k as Skill].name}
                </span>
                <span className="tile-title" style={{ marginTop: 'auto' }}>
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TabBar />
      {insights && (
        <Sheet onClose={() => setInsights(false)} label="Insights by Mira">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '8px 0 4px' }}>
            <Ring value={Math.min(doneCount, INSIGHT_AFTER)} max={INSIGHT_AFTER} big />
            <h2 className="display" style={{ fontSize: 28, margin: '16px 0 6px' }}>
              {doneCount} of {INSIGHT_AFTER} moments
            </h2>
            <p className="muted" style={{ maxWidth: 300 }}>
              After {Math.max(0, INSIGHT_AFTER - doneCount)} more, Mira can start telling you what she sees in {child.name}.
            </p>
            <button
              className="btn block"
              style={{ marginTop: 22 }}
              onClick={() => {
                setInsights(false)
                nav(`/activity/${act.id}`)
              }}
            >
              Do today’s moment
            </button>
          </div>
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
