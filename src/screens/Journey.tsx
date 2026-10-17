import { useNavigate } from 'react-router-dom'
import { TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { Tree } from '../art/Tree'
import { useTreeLeafTones } from '../art/leafColors'
import { Leaf } from '../art/ActivityArt'
import { ACTIVITIES, SKILLS, type Skill } from '../data/content'
import { LEAVES_PER_TREE, useChild, useStore } from '../state/store'
import './journey.css'

export function Journey() {
  const nav = useNavigate()
  const { s } = useStore()
  const child = useChild()
  const first = s.log[0]?.at ?? Date.now()
  const days = new Set(s.log.map((e) => new Date(e.at).toDateString())).size || 1
  const done = Object.keys(s.done).length
  const inTree = s.leaves % LEAVES_PER_TREE
  const tones = useTreeLeafTones()

  // week strip
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const week = [...Array(7)].map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const leaves = s.log.filter((e) => new Date(e.at).toDateString() === d.toDateString()).reduce((a, e) => a + e.leaves, 0)
    return { d, leaves, today: d.toDateString() === now.toDateString(), future: d > now }
  })
  const todays = s.log.filter((e) => new Date(e.at).toDateString() === now.toDateString())

  return (
    <>
      <div className="screen with-tabbar journey">
        <header className="pad journey-head">
          <p className="eyebrow" style={{ color: 'var(--coral-2)' }}>
            Since {new Date(first).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <h1 className="display" style={{ fontSize: 40 }}>
              My journey
            </h1>
            <button className="icon-btn" onClick={() => nav('/journey/settings')} aria-label="Settings">
              <Icon name="settings" />
            </button>
          </div>
        </header>

        <div className="pad">
          <button className="forest-card" onClick={() => nav('/journey/forest')}>
            <div className="forest-card-tree">
              <Tree growth={0.35 + (inTree / LEAVES_PER_TREE) * 0.65} blossoms={inTree} tones={tones} />
            </div>
            <div className="forest-card-copy">
              <p className="eyebrow">{child.name}’s forest</p>
              <h2 className="display" style={{ fontSize: 26 }}>
                The Pine is growing
              </h2>
              <div className="progress" style={{ margin: '12px 0 6px', background: 'rgba(255,255,255,.22)' }}>
                <i style={{ width: `${(inTree / LEAVES_PER_TREE) * 100}%`, background: 'var(--leaf)' }} />
              </div>
              <span className="forest-card-count">
                {inTree} / {LEAVES_PER_TREE} leaves
              </span>
              <span className="btn small light" style={{ marginTop: 16, alignSelf: 'flex-start' }}>
                <Icon name="map" size={18} /> Walk your forest
              </span>
            </div>
          </button>

          {/* the numbers as one slim strip under the forest */}
          <div className="stat-strip">
            <div>
              <b>{days}</b>
              <span>day{days === 1 ? '' : 's'} together</span>
            </div>
            <div className="leaves">
              <b>
                <Leaf size={18} /> {s.leaves}
              </b>
              <span>leaves grown</span>
            </div>
            <div>
              <b>{done}</b>
              <span>activities done</span>
            </div>
          </div>

          <div className="section-head">
            <h2>How {child.name} is growing</h2>
          </div>
          <div className="card">
            {(['SQ', 'EQ', 'IQ'] as Skill[]).map((k) => {
              const n = ACTIVITIES.filter((a) => a.skill === k && s.done[a.id]).length
              const sk = SKILLS[k]
              return (
                <div key={k} className="row">
                  <span className="r-icon" style={{ background: sk.bg, color: sk.fg }}>
                    <Icon name={sk.icon} size={20} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <span className="r-title" style={{ display: 'block' }}>
                      {sk.name}
                    </span>
                    <div className="progress" style={{ marginTop: 8 }}>
                      <i style={{ width: `${Math.max(3, n * 20)}%`, background: 'var(--teal)' }} />
                    </div>
                  </span>
                  <span className="pill" style={{ background: sk.bg, color: sk.fg }}>
                    {n === 0 ? 'Ready to start' : n === 1 ? 'Just begun' : 'Growing'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="section-head">
            <h2>Your week together</h2>
          </div>
          <div className="week card">
            <div className="week-strip">
              {week.map(({ d, leaves, today: t, future }) => (
                <div key={d.toISOString()} className={`week-day ${t ? 'today' : ''} ${future ? 'future' : ''}`}>
                  <span>{d.toLocaleDateString(undefined, { weekday: 'narrow' })}</span>
                  <b>{d.getDate()}</b>
                  <i className={leaves ? 'on' : ''}>{leaves ? <Leaf size={12} color="var(--leaf)" /> : null}</i>
                </div>
              ))}
            </div>
            <div className="timeline">
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                Today
              </p>
              {todays.length === 0 && <p className="muted">Nothing yet today.</p>}
              {todays.map((e) => (
                <div key={e.at} className="tl-row">
                  <span className="tl-dot" style={{ background: e.skill ? SKILLS[e.skill].bg : 'var(--mint)' }}>
                    <Icon name={e.kind === 'activity' ? 'play' : e.kind === 'mood' ? 'heart' : 'sparkle'} size={14} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <small className="muted">{new Date(e.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</small>
                    <b style={{ display: 'block', fontWeight: 620 }}>{e.label}</b>
                  </span>
                  <span className="pill" style={{ background: 'var(--reward-soft)', color: 'var(--reward-deep)' }}>
                    +{e.leaves}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-head">
            <h2>More</h2>
          </div>
          <div className="card">
            {(
              [
                ['/journey/library', 'book', 'Activity library', `${done} done · ${ACTIVITIES.length - done} to try`, 'var(--sec-amber-tile)'],
                ['/journey/child', 'user', `${child.name}’s profile`, child.age.label, 'var(--accent-soft)'],
                ['/journey/chats', 'chat', 'Your chats with Mira', `${s.chats.length} question${s.chats.length === 1 ? '' : 's'}`, 'var(--primary-soft)'],
                ['/journey/solutions', 'bookmark', 'Saved answers', `${s.saved.length} saved`, 'var(--sec-amber-tile)'],
                ['/journey/settings', 'settings', 'Settings', s.email || 'Account', 'var(--sand)'],
              ] as const
            ).map(([to, ic, t, sub, bg]) => (
              <button key={to} className="row" onClick={() => nav(to)}>
                <span className="r-icon" style={{ background: bg }}>
                  <Icon name={ic} size={20} />
                </span>
                <span>
                  <span className="r-title" style={{ display: 'block' }}>
                    {t}
                  </span>
                  <span className="r-sub">{sub}</span>
                </span>
                <Icon name="chev" size={18} className="chev" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <TabBar />
    </>
  )
}
