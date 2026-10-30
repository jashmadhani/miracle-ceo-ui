import { useEdge } from '../components/edge'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Overlay, Sheet, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { Waveform } from '../art/Waveform'
import { MiraOrb, MiraPresence, type MiraState } from '../art/MiraOrb'
import { Scene } from '../art/Scene'
import { Tree } from '../art/Tree'
import { Leaf } from '../art/ActivityArt'
import { ANSWER, BEDTIME_PLAN, CHALLENGES, SUGGESTIONS } from '../data/content'
import { today, useChild, useStore } from '../state/store'
import { ChatDrawer, Escalation, Refusal, NoMatch, QuotaNote, classify, type Kind, DAILY_CAP } from '../components/AskExtras'
import './solve.css'

const TABS = [
  ['ask', 'Ask'],
  ['share', 'Talk it out'],
  ['challenge', '7-day plans'],
] as const
type Tab = (typeof TABS)[number][0]

export function Solve() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'ask'
  const idx = TABS.findIndex(([k]) => k === tab)
  useEdge('#d6e8f9', false, '#d6e8f9')
  return (
    <>
      <div className="screen with-tabbar solve">
        <header className="hsec hsec-top hsec-sky solve-head">
          <p className="eyebrow">
            <Icon name="lock" size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> Just between us
          </p>
          <h1 className="display solve-title">
            What’s on your mind?
          </h1>
          <div className="segmented" role="tablist">
            <span className="thumb" style={{ width: `calc((100% - 10px) / 3)`, transform: `translateX(${idx * 100}%)` }} />
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setParams({ tab: k }, { replace: true })}>
                {l}
              </button>
            ))}
          </div>
        </header>
        <div className="solve-body">
          {tab === 'ask' && <Ask />}
          {tab === 'share' && <Share />}
          {tab === 'challenge' && <Challenges />}
        </div>
      </div>
      <TabBar />
    </>
  )
}

// Home's three accent tints, rotated so the plan grid reads like Home's blocks
const CH_TINTS = [
  ['var(--accent-soft)', 'var(--accent-deep)'],
  ['var(--sec-amber-tile)', 'var(--reward-deep)'],
  ['var(--primary-soft)', 'var(--teal)'],
] as const

/* ------------------------------------------------------------------ Ask */

type Msg = { id: number; q: string; state: 'thinking' | 'done'; kind: Kind }

function Ask() {
  const child = useChild()
  const { s, set } = useStore()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [drawer, setDrawer] = useState(false)
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const used = s.askedDay === today() ? s.asked : 0
  const left = DAILY_CAP - used
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(false)
  const [focused, setFocused] = useState(false)
  const mira: MiraState = voice ? 'listening' : msgs.some((m) => m.state === 'thinking') ? 'thinking' : focused || text ? 'attentive' : 'idle'
  const last = useRef<HTMLDivElement>(null)

  const send = (q: string) => {
    if (!q.trim() || left <= 0 || msgs.some((m) => m.state === 'thinking')) return
    const id = Date.now()
    setMsgs((m) => [...m, { id, q: q.trim(), state: 'thinking', kind: classify(q) }])
    set((p) => ({ chats: [{ at: id, q: q.trim() }, ...p.chats], asked: (p.askedDay === today() ? p.asked : 0) + 1, askedDay: today() }))
    setText('')
    timers.current[id] = setTimeout(() => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, state: 'done' } : x))), 2600)
  }

  /** Cancel the answer that is still being written. */
  const stop = () => {
    Object.values(timers.current).forEach(clearTimeout)
    setMsgs((m) => m.filter((x) => x.state !== 'thinking'))
  }
  const fresh = () => {
    stop()
    setMsgs([])
    setText('')
  }

  // bring the newest question to the top so the answer reads from its start
  useEffect(() => {
    last.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [msgs])

  return (
    <div className="pad ask">
      <div className="ask-bar">
        <button className="icon-btn" onClick={() => setDrawer(true)} aria-label="Past conversations">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        {msgs.length > 0 && (
          <button className="chip" onClick={fresh} style={{ minHeight: 40 }}>
            <Icon name="plus" size={16} /> New
          </button>
        )}
      </div>
      {left === 1 && <QuotaNote>One more question today.</QuotaNote>}
      {left <= 0 && <QuotaNote full>That is all the questions for today. They come back at midnight.</QuotaNote>}
      {drawer && (
        <ChatDrawer
          onClose={() => setDrawer(false)}
          onOpen={(q) => {
            setMsgs([{ id: Date.now(), q, state: 'done', kind: classify(q) }])
            setDrawer(false)
          }}
        />
      )}
      {msgs.length === 0 ? (
        <div className="ask-empty">
          <div style={{ marginBottom: 14 }}>
            <MiraOrb state={mira} size={104} />
          </div>
          <h2 className="display" style={{ fontSize: 24, textAlign: 'center' }}>
            Ask Mira anything, big or small
          </h2>
          <p className="muted" style={{ textAlign: 'center', marginTop: 6 }}>
            Or start with one of these.
          </p>
          <div className="suggest">
            {SUGGESTIONS(child.name).map((q, i) => (
              <button key={q} className={`suggest-tile t${i}`} onClick={() => send(q)}>
                <span>{q}</span>
                <Icon name="arrow" size={18} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="thread">
          {msgs.map((m, k) => (
            <div key={m.id} className="turn" ref={k === msgs.length - 1 ? last : undefined} style={{ scrollMarginTop: 16 }}>
              <div className="bubble me">{m.q}</div>
              {m.state === 'thinking' ? (
                <div className="thinking">
                  <MiraOrb state="thinking" size={30} />
                  <div style={{ width: 110, color: 'var(--mira)' }}>
                    <Waveform state="thinking" bars={14} height={24} />
                  </div>
                  <span className="muted" style={{ fontSize: 14 }}>
                    Thinking about this for you…
                  </span>
                </div>
              ) : m.kind === 'escalate' ? (
                <Escalation />
              ) : m.kind === 'refuse' ? (
                <Refusal />
              ) : m.kind === 'nomatch' ? (
                <NoMatch onNew={fresh} />
              ) : (
                <Answer />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`composer ${voice ? 'voice' : ''}`}>
        <div className="composer-presence">
          <MiraPresence state={mira} />
        </div>
        {voice ? (
          <VoiceBar
            onCancel={() => setVoice(false)}
            onDone={(t) => {
              setVoice(false)
              send(t)
            }}
          />
        ) : (
          <>
            <input
              className="composer-input"
              placeholder="Type it, or just say it"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(text)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Your question"
              disabled={left <= 0}
            />
            {msgs.some((m) => m.state === 'thinking') ? (
              <button className="composer-btn send" onClick={stop} aria-label="Stop">
                <Icon name="stop" size={18} />
              </button>
            ) : text ? (
              <button className="composer-btn send" onClick={() => send(text)} aria-label="Send">
                <Icon name="send" size={20} stroke={2.4} />
              </button>
            ) : (
              <button className="composer-btn" onClick={() => setVoice(true)} aria-label="Speak your question">
                <Icon name="mic" size={22} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/** The flat line swells into a live wave while "listening" (Wispr Flow reference). Mock: no recording. */
function VoiceBar({ onCancel, onDone }: { onCancel: () => void; onDone: (t: string) => void }) {
  const [secs, setSecs] = useState(0)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setLive(true), 120)
    const t = setInterval(() => setSecs((x) => x + 1), 1000)
    return () => {
      clearTimeout(a)
      clearInterval(t)
    }
  }, [])
  return (
    <div className="voicebar">
      <button className="composer-btn ghost" onClick={onCancel} aria-label="Cancel">
        <Icon name="close" size={20} />
      </button>
      <div className="voicebar-wave">
        <Waveform state={live ? 'listening' : 'idle'} bars={30} height={40} color="#ffffff" />
      </div>
      <span className="voicebar-time">0:{String(secs).padStart(2, '0')}</span>
      <button className="composer-btn send light" onClick={() => onDone('How can bedtime feel calmer?')} aria-label="Stop and send">
        <Icon name="send" size={20} stroke={2.4} />
      </button>
    </div>
  )
}

function Answer() {
  const child = useChild()
  const { s, set, toast } = useStore()
  const a = ANSWER(child.name)
  const [view, setView] = useState<'why' | 'bonsai' | 'ceo'>('why')
  const [helped, setHelped] = useState<null | boolean>(null)
  const [check, setCheck] = useState<string | null>(null)
  const saved = s.saved.includes(a.topic)
  const idx = ['why', 'bonsai', 'ceo'].indexOf(view)
  return (
    <div className="answer rise">
      <div className="segmented small" role="tablist">
        <span className="thumb" style={{ width: 'calc((100% - 10px) / 3)', transform: `translateX(${idx * 100}%)` }} />
        {(
          [
            ['why', 'Why'],
            ['bonsai', 'Quick fix'],
            ['ceo', 'Try this'],
          ] as const
        ).map(([k, l]) => (
          <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)} role="tab" aria-selected={view === k}>
            {l}
          </button>
        ))}
      </div>

      {view === 'why' && (
        <div className="ans-card why rise">
          <p className="eyebrow">Why this happens</p>
          {a.why.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}
      {view === 'bonsai' && (
        <div className="ans-card bonsai rise">
          <p className="eyebrow">The quick fix</p>
          <ul>
            {a.bonsai.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="ans-result">{a.bonsaiResult}</p>
        </div>
      )}
      {view === 'ceo' && (
        <div className="ans-card ceo rise">
          <p className="eyebrow">Say it like this</p>
          <p className="ans-say">{a.say}</p>
          <ul>
            {a.ceo.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="ans-result">{a.ceoResult}</p>
        </div>
      )}

      <div className="ans-practice">
        <p className="eyebrow" style={{ color: 'var(--teal)' }}>
          One small thing to try
        </p>
        <p style={{ fontWeight: 600, fontSize: 17, margin: '6px 0 14px' }}>{a.practice}</p>
        <button
          className="btn small"
          onClick={() => {
            set({ openTask: { title: a.practice, from: 'Ask Mira' } })
            toast({ title: 'On the tree', body: 'We’ll ask how this went.' })
          }}
        >
          <Leaf size={16} color="#fce3a0" /> Put it on the tree
        </button>
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          We’ll ask how this went.
        </p>
        <p className="eyebrow" style={{ marginTop: 14 }}>
          Or, if that does not fit this week
        </p>
        <div className="chips" style={{ marginTop: 8 }}>
          {['Name one feeling out loud', 'Offer two small choices'].map((t) => (
            <button
              key={t}
              className="chip"
              style={{ minHeight: 40, fontSize: 14 }}
              onClick={() => {
                set({ openTask: { title: t, from: 'Ask Mira' } })
                toast({ title: 'On the tree', body: 'We’ll ask how this went.' })
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="ans-check">
        <p style={{ fontWeight: 650 }}>{a.checkin}</p>
        <div className="chips" style={{ marginTop: 10 }}>
          {['I noticed it', 'Not yet', 'I will tonight'].map((c) => (
            <button key={c} className={`chip ${check === c ? 'on' : ''}`} onClick={() => setCheck(c)} style={{ minHeight: 40, fontSize: 14 }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="ans-closing">{a.closing}</p>
      <p className="muted ai-note">Mira is our AI guide. She put this together from what you shared, and you know {child.name} best.</p>

      <div className="ans-actions">
        <button className={`chip ${helped === true ? 'on' : ''}`} onClick={() => setHelped(true)}>
          <Icon name="thumb" size={16} /> Helped
        </button>
        <button className={`chip ${helped === false ? 'on' : ''}`} onClick={() => setHelped(false)}>
          <Icon name="thumb" size={16} style={{ transform: 'scaleY(-1)' }} /> Not really
        </button>
        <button
          className={`chip ${saved ? 'on' : ''}`}
          onClick={() => {
            set((p) => ({ saved: saved ? p.saved.filter((x) => x !== a.topic) : [...p.saved, a.topic] }))
            if (!saved) toast({ title: 'Saved', body: 'Find it in Journey › Saved answers.' })
          }}
        >
          <Icon name="bookmark" size={16} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Share (voice diary) */

function Share() {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<{ at: number; secs: number }[]>([])
  return (
    <div className="pad" style={{ marginTop: 18 }}>
      <button className="night-card" onClick={() => setOpen(true)}>
        <Scene mood="night" hills={false} />
        <div className="night-copy">
          <div className="night-line" aria-hidden>
            <Waveform state="idle" bars={22} height={20} color="rgba(255,250,242,.8)" />
          </div>
          <p className="eyebrow" style={{ color: '#e9dcc4' }}>
            Before you sleep
          </p>
          <h2 className="display" style={{ fontSize: 32, color: 'var(--on-dark)' }}>
            How was today, really?
          </h2>
          <p style={{ color: 'rgba(255,250,242,.75)', margin: '6px 0 18px' }}>Say it however it comes. Mira will help you find the good bits.</p>
          <span className="btn light" style={{ alignSelf: 'flex-start' }}>
            <Icon name="mic" size={20} /> Start talking
          </span>
        </div>
      </button>

      <div className="section-head">
        <h2>Your voice diary</h2>
      </div>
      {entries.length === 0 ? (
        <div className="empty">
          <p className="muted">Your bedtime voice notes will live here.</p>
        </div>
      ) : (
        <div className="card">
          {entries.map((e) => (
            <div key={e.at} className="row">
              <span className="r-icon" style={{ background: 'var(--lilac)' }}>
                <Icon name="mic" size={18} />
              </span>
              <span>
                <span className="r-title" style={{ display: 'block' }}>
                  Tonight
                </span>
                <span className="r-sub">0:{String(e.secs).padStart(2, '0')} · Mira found 2 good moments</span>
              </span>
            </div>
          ))}
        </div>
      )}
      {open && (
        <VoiceDiary
          onClose={(secs) => {
            setOpen(false)
            if (secs) setEntries((x) => [{ at: Date.now(), secs }, ...x])
          }}
        />
      )}
    </div>
  )
}

function VoiceDiary({ onClose }: { onClose: (secs?: number) => void }) {
  useEdge('#1f5f9e', true, '#3e8a80')
  const [phase, setPhase] = useState<'ready' | 'listening' | 'thinking' | 'done'>('ready')
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    if (phase !== 'listening') return
    const t = setInterval(() => setSecs((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [phase])
  useEffect(() => {
    if (phase !== 'thinking') return
    const t = setTimeout(() => setPhase('done'), 2200)
    return () => clearTimeout(t)
  }, [phase])
  return (
    <Overlay>
    <div className="voice-full" role="dialog" aria-modal="true" aria-label="Voice diary">
      <Scene mood="night" />
      <button className="icon-btn flat" style={{ position: 'absolute', top: 'calc(14px + var(--safe-top))', right: 16, zIndex: 3 }} onClick={() => onClose()} aria-label="Close">
        <Icon name="close" />
      </button>
      <div className="voice-inner">
        {phase !== 'done' ? (
          <>
            <p className="eyebrow" style={{ color: '#e9dcc4' }}>
              {phase === 'ready' ? 'Tap and talk' : phase === 'listening' ? 'Mira is listening' : 'Finding the good…'}
            </p>
            <h1 className="display" style={{ fontSize: 34, color: 'var(--on-dark)', marginTop: 8 }}>
              {phase === 'thinking' ? 'One moment.' : 'How was today, really?'}
            </h1>
            <div className="voice-wave">
              <Waveform state={phase === 'listening' ? 'listening' : phase === 'thinking' ? 'thinking' : 'idle'} bars={36} height={110} color="#d4ece7" />
            </div>
            <p className="voice-time">0:{String(secs).padStart(2, '0')}</p>
            {phase === 'ready' && (
              <button className="mic-big" onClick={() => setPhase('listening')} aria-label="Start talking">
                <Icon name="mic" size={34} />
              </button>
            )}
            {phase === 'listening' && (
              <button className="mic-big stop" onClick={() => setPhase('thinking')} aria-label="Stop">
                <Icon name="stop" size={28} />
              </button>
            )}
            <p style={{ color: 'rgba(255,250,242,.6)', textAlign: 'center', fontSize: 13, marginTop: 14 }}>Demo only. Nothing is recorded yet.</p>
          </>
        ) : (
          <div className="rise" style={{ marginTop: 'auto' }}>
            <div className="voice-result">
              <p className="eyebrow" style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mira)' }}>
                <MiraOrb size={22} /> The good Mira heard
              </p>
              <ul>
                <li>You stayed calm when bedtime ran late. That took patience.</li>
                <li>You spotted they were tired early, and slowed things down.</li>
              </ul>
              <p className="muted" style={{ fontSize: 14 }}>Rest well. Tomorrow is a new small moment.</p>
            </div>
            <button className="btn block light" style={{ marginTop: 14 }} onClick={() => onClose(secs || 12)}>
              Save to my diary
            </button>
          </div>
        )}
      </div>
    </div>
    </Overlay>
  )
}

/* ------------------------------------------------------------------ 7-day plans */

function Challenges() {
  const { s, set, toast } = useStore()
  const child = useChild()
  const [open, setOpen] = useState<(typeof CHALLENGES)[number] | null>(null)
  const [building, setBuilding] = useState(false)
  return (
    <div className="pad" style={{ marginTop: 18 }}>
      <p className="muted" style={{ marginBottom: 14 }}>
        Moments every parent knows. Pick one and take one small step a day, for seven days.
      </p>
      <div className="bento">
        {CHALLENGES.map((c, i) => {
          const active = s.challenge?.id === c.id
          const ic = CH_TINTS[i % CH_TINTS.length]
          return (
            <button key={c.id} className={`tile ch-tile ${active ? 'active' : ''}`} style={{ background: c.tint }} onClick={() => { setOpen(c); setBuilding(!active) ; if (!active) setTimeout(() => setBuilding(false), 1600) }}>
              <span className="ch-ic" style={{ background: ic[0], color: ic[1] }}>
                <Icon name={c.icon} size={22} />
              </span>
              {active && <span className="pill dark ch-day">Day {Math.min(7, (s.challenge?.moves ?? 0) + 1)} of 7</span>}
              <span className="tile-title" style={{ marginTop: 'auto' }}>
                {c.title}
              </span>
              {active && (
                <span className="ch-dots">
                  {[...Array(7)].map((_, i) => (
                    <i key={i} className={i < (s.challenge?.moves ?? 0) ? 'on' : ''} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {open && (
        <Sheet onClose={() => setOpen(null)} label={open.title}>
          {building ? (
            <div className="building">
              <div style={{ width: 120, height: 120 }}>
                <Tree growth={0.1} ground={false} />
              </div>
              <p className="display" style={{ fontSize: 22 }}>
                Building {child.name}’s seven days…
              </p>
              <div style={{ width: 160, color: 'var(--mira)' }}>
                <Waveform state="thinking" bars={16} height={22} />
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow">7-day plan</p>
              <h2 className="display" style={{ fontSize: 30, margin: '4px 0 6px' }}>
                {open.title}
              </h2>
              <p className="muted">
                {s.challenge?.id === open.id ? `${s.challenge.moves} of 7 steps done` : 'One small step a day, for seven days. Each step grows a leaf.'}
              </p>
              <div className="plan">
                {BEDTIME_PLAN.map((m, i) => {
                  const done = s.challenge?.id === open.id && i < s.challenge.moves
                  const next = s.challenge?.id === open.id && i === s.challenge.moves
                  return (
                    <div key={m.title} className={`plan-step ${done ? 'done' : ''} ${next ? 'next' : ''}`}>
                      <span className="plan-n">{done ? <Icon name="check" size={18} stroke={3} /> : i + 1}</span>
                      <span style={{ flex: 1 }}>
                        <b>{m.title}</b>
                        <span className="muted" style={{ display: 'block', fontSize: 14, marginTop: 2 }}>
                          {m.body.replace('them', child.name)}
                        </span>
                        {next && (
                          <button
                            className="btn small"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              set((p) => ({ challenge: { id: open.id, moves: (p.challenge?.moves ?? 0) + 1 } }))
                              toast({ title: `Day ${i + 1} done`, body: 'A leaf added to the tree.' })
                            }}
                          >
                            <Icon name="check" size={16} /> Done today
                          </button>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
              {s.challenge?.id !== open.id && (
                <button
                  className="btn block"
                  style={{ position: 'sticky', bottom: 0, marginTop: 16 }}
                  onClick={() => {
                    set({ challenge: { id: open.id, moves: 0 } })
                    toast({ title: `${open.title} started`, body: 'Day 1 is waiting for you.' })
                  }}
                >
                  Start the 7 days
                </button>
              )}
            </>
          )}
        </Sheet>
      )}
    </div>
  )
}
