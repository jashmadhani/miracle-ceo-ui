import { useNavigate } from 'react-router-dom'
import { BackBar, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { ActivityArt, Leaf } from '../art/ActivityArt'
import { ACTIVITIES, SKILLS } from '../data/content'
import { useStore } from '../state/store'
import './profile.css'
import './grow.css'

function Page({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <>
      <div className="screen with-tabbar profile">
        <BackBar to="/journey" label="Journey" />
        <div className="pad">
          <h1 className="display" style={{ fontSize: 36 }}>
            {title}
          </h1>
          <p className="muted" style={{ margin: '6px 0 20px' }}>
            {sub}
          </p>
          {children}
        </div>
      </div>
      <TabBar />
    </>
  )
}

export function Chats() {
  const nav = useNavigate()
  const { s } = useStore()
  return (
    <Page title="Your chats" sub="Everything you’ve asked Mira, still here.">
      {s.chats.length === 0 ? (
        <Empty icon="chat" text="No chats yet." cta="Ask Mira something" onClick={() => nav('/solve')} />
      ) : (
        <div className="card">
          {s.chats.map((c) => (
            <button key={c.at} className="row" onClick={() => nav('/solve')}>
              <span className="r-icon" style={{ background: 'var(--sand)' }}>
                <Icon name="chat" size={18} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="r-title" style={{ display: 'block' }}>
                  {c.q}
                </span>
                <span className="r-sub">{new Date(c.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
              </span>
              <Icon name="chev" size={18} className="chev" />
            </button>
          ))}
        </div>
      )}
    </Page>
  )
}

export function Solutions() {
  const nav = useNavigate()
  const { s } = useStore()
  return (
    <Page title="Saved answers" sub="Answers from Mira you wanted to keep.">
      {s.saved.length === 0 ? (
        <Empty icon="bookmark" text="Nothing saved yet. Tap Save under any answer and it’ll wait here." cta="Ask Mira" onClick={() => nav('/solve')} />
      ) : (
        <div className="bento">
          {s.saved.map((t) => (
            <button key={t} className="tile wide" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', minHeight: 120 }} onClick={() => nav('/solve')}>
              <span className="pill" style={{ alignSelf: 'flex-start' }}>
                <Icon name="bookmark" size={14} /> Saved
              </span>
              <span className="tile-title" style={{ marginTop: 'auto' }}>
                {t}
              </span>
            </button>
          ))}
        </div>
      )}
    </Page>
  )
}

export function Library() {
  const nav = useNavigate()
  const { s } = useStore()
  const done = ACTIVITIES.filter((a) => s.done[a.id]).length
  return (
    <Page title="Activity library" sub={`${done} done · ${ACTIVITIES.length - done} to try`}>
      <div className="act-list">
        {ACTIVITIES.map((a) => (
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
                <Icon name="clock" size={14} /> {a.minutes} min <Leaf size={14} /> +3
                {s.done[a.id] && (
                  <b style={{ color: 'var(--teal)' }}>
                    <Icon name="check" size={14} stroke={3} style={{ display: 'inline', verticalAlign: '-2px' }} /> Done
                  </b>
                )}
              </span>
            </span>
          </button>
        ))}
      </div>
    </Page>
  )
}

function Empty({ icon, text, cta, onClick }: { icon: 'chat' | 'bookmark'; text: string; cta: string; onClick: () => void }) {
  return (
    <div className="list-empty card">
      <span className="r-icon" style={{ width: 64, height: 64, borderRadius: 22, background: 'var(--sand)', display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={28} />
      </span>
      <p className="muted" style={{ maxWidth: 260 }}>
        {text}
      </p>
      <button className="btn small" onClick={onClick}>
        {cta}
      </button>
    </div>
  )
}
