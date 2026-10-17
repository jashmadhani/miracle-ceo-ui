import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Overlay, Sheet, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { Waveform } from '../art/Waveform'
import { Scene } from '../art/Scene'
import { Tree } from '../art/Tree'
import { Leaf } from '../art/ActivityArt'
import { ANSWER, BEDTIME_PLAN, CHALLENGES, SUGGESTIONS } from '../data/content'
import { useChild, useStore } from '../state/store'
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
  return (
    <>
      <div className="screen with-tabbar solve">
        <header className="solve-head pad">
          <p className="eyebrow">
            <Icon name="lock" size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> Just between us
          </p>
          <h1 className="display" style={{ fontSize: 38, margin: '6px 0 18px' }}>
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
        {tab === 'ask' && <Ask />}
        {tab === 'share' && <Share />}
        {tab === 'challenge' && <Challenges />}
      </div>
      <TabBar />
    </>
  )
}

/* ------------------------------------------------------------------ Ask */

type Msg = { id: number; q: string; state: 'thinking' | 'done' }

function Ask() {
  const child = useChild()
  const { set } = useStore()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(false)
  const last = useRef<HTMLDivElement>(null)

  const send = (q: string) => {
    if (!q.trim()) return
    const id = Date.now()
    setMsgs((m) => [...m, { id, q: q.trim(), state: 'thinking' }])
    set((p) => ({ chats: [{ at: id, q: q.trim() }, ...p.chats] }))
    setText('')
    setTimeout(() => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, state: 'done' } : x))), 2600)
  }

  // bring the newest question to the top so the answer reads from its start
  useEffect(() => {
    last.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [msgs])

  return (
    <div className="pad ask">
      {msgs.length === 0 ? (
        <div className="ask-empty">
          <div className="mira-orb" aria-hidden>
            <span />
          </div>
          <h2 className="display" style={{ fontSize: 24, textAlign: 'center' }}>
            Tell Mira what’s weighing on you
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
                  <span className="mira-dot" />
                  <div style={{ width: 110, color: 'var(--lilac-2)' }}>
                    <Waveform state="thinking" bars={14} height={24} />
                  </div>
                  <span className="muted" style={{ fontSize: 14 }}>
                    Reading what’s written for this age…
                  </span>
                </div>
              ) : (
                <Answer />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`composer ${voice ? 'voice' : ''}`}>
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
              aria-label="Your question"
            />
            {text ? (
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
        <Waveform state={live ? 'listening' : 'idle'} bars={30} height={40} color="var(--on-dark)" />
      </div>
      <span className="voicebar-time">0:{String(secs).padStart(2, '0')}</span>
      <button className="composer-btn send light" onClick={() => onDone('Why does bedtime take so long?')} aria-label="Stop and send">
        <Icon name="send" size={20} stroke={2.4} />
      </button>
    </div>
  )
}

function Answer() {
  const child = useChild()
  const { s, set, toast } = useStore()
  const a = ANSWER(child.name, child.He)
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
            ['bonsai', 'Bonsai'],
            ['ceo', 'Miracle CEO'],
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
          <p className="eyebrow">What most of us do</p>
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
          One small thing tonight
        </p>
        <p style={{ fontWeight: 600, fontSize: 17, margin: '6px 0 14px' }}>{a.practice}</p>
        <button className="btn small" onClick={() => toast({ title: 'On the tree', body: 'We’ll check in on it tomorrow.' })}>
          <Leaf size={16} color="#fce3a0" /> Put it on the tree
        </button>
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
          <p className="eyebrow" style={{ color: '#fde3a8' }}>
            Before you sleep
          </p>
          <h2 className="display" style={{ fontSize: 32, color: 'var(--on-dark)' }}>
            How was today, really?
          </h2>
          <p style={{ color: 'rgba(255,250,242,.75)', margin: '6px 0 18px' }}>Just talk. Mira finds the good you were too tired to notice.</p>
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
            <p className="eyebrow" style={{ color: '#fde3a8' }}>
              {phase === 'ready' ? 'Tap and talk' : phase === 'listening' ? 'Mira is listening' : 'Finding the good…'}
            </p>
            <h1 className="display" style={{ fontSize: 34, color: 'var(--on-dark)', marginTop: 8 }}>
              {phase === 'thinking' ? 'One moment.' : 'How was today, really?'}
            </h1>
            <div className="voice-wave">
              <Waveform state={phase === 'listening' ? 'listening' : phase === 'thinking' ? 'thinking' : 'idle'} bars={36} height={110} color="#fde3a8" />
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
            <p style={{ color: 'rgba(255,250,242,.6)', textAlign: 'center', fontSize: 13, marginTop: 14 }}>Demo only — nothing is recorded yet.</p>
          </>
        ) : (
          <div className="rise" style={{ marginTop: 'auto' }}>
            <div className="voice-result">
              <p className="eyebrow" style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--lilac-2)' }}>
                <span className="mira-dot" /> The good Mira heard
              </p>
              <ul>
                <li>You stayed calm when bedtime ran late — that was patience under pressure.</li>
                <li>You noticed they were tired before it became a meltdown.</li>
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
        Every parent faces these. Pick one — seven days, one small move a day.
      </p>
      <div className="bento">
        {CHALLENGES.map((c) => {
          const active = s.challenge?.id === c.id
          return (
            <button key={c.id} className={`tile ch-tile ${active ? 'active' : ''}`} style={{ background: c.tint }} onClick={() => { setOpen(c); setBuilding(!active) ; if (!active) setTimeout(() => setBuilding(false), 1600) }}>
              <span className="ch-ic">
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
              <div style={{ width: 160, color: 'var(--lilac-2)' }}>
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
                {s.challenge?.id === open.id ? `${s.challenge.moves} of 7 moves done` : 'Seven days, one small move a day. Leaves come with each move.'}
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
                              toast({ title: '+1 leaf', body: `Day ${i + 1} done.` })
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
