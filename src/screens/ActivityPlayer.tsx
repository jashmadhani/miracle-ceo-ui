import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActivityArt, Leaf } from '../art/ActivityArt'
import { Tree } from '../art/Tree'
import { Scene } from '../art/Scene'
import { MiraOrb } from '../art/MiraOrb'
import { Icon } from '../components/Icon'
import { ACTIVITIES, SKILLS } from '../data/content'
import { LEAVES_PER_TREE, useChild, useStore } from '../state/store'
import './activity.css'

type Phase = 'intro' | 'steps' | 'practice' | 'feedback' | 'read' | 'celebrate'

export function ActivityPlayer() {
  const { id } = useParams()
  const nav = useNavigate()
  const { s, set, earn } = useStore()
  const child = useChild()
  const act = ACTIVITIES.find((a) => a.id === id) ?? ACTIVITIES[0]
  const sk = SKILLS[act.skill]
  const [phase, setPhase] = useState<Phase>('intro')
  const [n, setN] = useState(0)
  const [tip, setTip] = useState<'magic' | 'support' | 'challenge' | null>(null)
  const [fb, setFb] = useState<{ how?: string; obs?: string; again?: string; note: string }>({ note: '' })
  const body = useRef<HTMLDivElement>(null)

  // every new step starts at the top (old app kept the scroll position)
  useEffect(() => {
    body.current?.scrollTo({ top: 0 })
    setTip(null)
  }, [n, phase])

  const total = act.steps.length
  const step = act.steps[n]

  const finish = () => {
    earn(3, act.title, 'activity', act.skill)
    set((p) => ({ done: { ...p.done, [act.id]: Date.now() } }))
    setPhase('celebrate')
  }

  if (phase === 'celebrate') return <Celebrate skill={sk.name} onDone={() => nav('/home')} leaves={s.leaves % LEAVES_PER_TREE} name={child.name} />

  return (
    <div className={`screen act sk-${act.skill}`}>
      <div className="act-top">
        <button className="icon-btn flat" onClick={() => (phase === 'intro' ? nav(-1) : setPhase('intro'))} aria-label="Close">
          <Icon name="close" />
        </button>
        {phase === 'steps' ? (
          <div className="segments" aria-label={`Step ${n + 1} of ${total}`}>
            {act.steps.map((_, k) => (
              <i key={k} className={k < n ? 'past' : k === n ? 'now' : ''} />
            ))}
          </div>
        ) : (
          <span className="pill" style={{ marginLeft: 'auto' }}>
            <Icon name={sk.icon} size={14} /> {sk.name} · {act.topic}
          </span>
        )}
      </div>

      <div className={`act-art ${phase === 'intro' ? 'big' : ''}`}>
        <ActivityArt skill={act.skill} id={act.id} />
      </div>

      <div className="act-card" ref={body} key={`${phase}-${n}`}>
        {phase === 'intro' && (
          <div className="rise">
            <h1 className="display act-title">{act.title}</h1>
            <p className="act-lede">{act.summary}</p>
            <div className="act-facts">
              <span>
                <Icon name="clock" size={18} /> {act.minutes} min
              </span>
              <span>
                <Icon name="book" size={18} /> {total} steps
              </span>
              <span>
                <Leaf size={18} /> +3 leaves
              </span>
            </div>
          </div>
        )}

        {phase === 'steps' && (
          <div className="rise">
            <p className="eyebrow">
              Step {n + 1} of {total}
            </p>
            <h2 className="display act-say">{step.say}</h2>
            {step.line && (
              <div className="say-card">
                <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                  <Icon name="chat" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Say something like
                </p>
                <p className="say-line">{step.line}</p>
              </div>
            )}
            <div className="tips">
              {(
                [
                  ['magic', '✨', 'Make it playful', act.magic],
                  ['support', '🤲', 'Make it easier', act.support],
                  ['challenge', '🧗', 'Make it harder', act.challenge],
                ] as const
              ).map(([k, e, t]) => (
                <button key={k} className={`tip ${tip === k ? 'on' : ''}`} onClick={() => setTip(tip === k ? null : k)} aria-expanded={tip === k}>
                  <span className="tip-e">{e}</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>
            {tip && <p className="tip-body rise">{act[tip]}</p>}
          </div>
        )}

        {phase === 'practice' && (
          <div className="rise">
            <p className="eyebrow">All steps done</p>
            <h2 className="display act-say">Carry it into the rest of the week.</h2>
            <div className="say-card practice">
              <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                Miracle CEO practice
              </p>
              <p className="say-line">{act.practice}</p>
            </div>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="rise">
            <h2 className="display act-say" style={{ marginTop: 0 }}>
              How did it go?
            </h2>
            <Opts value={fb.how} onPick={(v) => setFb({ ...fb, how: v })} options={['Loved it', 'Enjoyed it', 'It was okay', 'Not interested']} />
            {fb.how && (
              <div className="rise">
                <p className="fb-q">{act.observe.q}</p>
                <p className="muted" style={{ fontSize: 14, marginBottom: 10 }}>
                  This is the part Mira learns from.
                </p>
                <Opts value={fb.obs} onPick={(v) => setFb({ ...fb, obs: v })} options={act.observe.options} />
              </div>
            )}
            {fb.obs && (
              <div className="rise">
                <p className="fb-q">Would you do it again?</p>
                <Opts value={fb.again} onPick={(v) => setFb({ ...fb, again: v })} options={['Definitely', 'Probably', 'Maybe', 'Not this one']} />
                <label className="label" htmlFor="note" style={{ marginTop: 18 }}>
                  One thing {child.name} said or did (optional)
                </label>
                <input id="note" className="field" placeholder="It helps Mira most" value={fb.note} onChange={(e) => setFb({ ...fb, note: e.target.value })} />
              </div>
            )}
          </div>
        )}

        {phase === 'read' && (
          <div className="rise">
            <div className="mira-read">
              <p className="eyebrow" style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mira)' }}>
                <MiraOrb size={22} /> Mira’s read
              </p>
              <p className="say-line" style={{ fontWeight: 500 }}>
                {act.read}
              </p>
            </div>
            <div className="say-card practice" style={{ marginTop: 12 }}>
              <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                What Mira noticed
              </p>
              <p style={{ fontWeight: 650, marginTop: 6 }}>{fb.obs}</p>
              <p className="muted" style={{ fontSize: 14, marginTop: 2 }}>
                Noted as something on its way.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="act-bar">
        {phase === 'intro' && (
          <button className="btn block" onClick={() => setPhase('steps')}>
            <Icon name="play" size={18} /> Start together
          </button>
        )}
        {phase === 'steps' && (
          <>
            <button className="btn ghost" onClick={() => (n === 0 ? setPhase('intro') : setN(n - 1))} aria-label="Previous step">
              <Icon name="back" />
            </button>
            <button className="btn" style={{ flex: 1 }} onClick={() => (n === total - 1 ? setPhase('practice') : setN(n + 1))}>
              {n === total - 1 ? 'Finish' : 'Next'} <Icon name="arrow" size={20} />
            </button>
          </>
        )}
        {phase === 'practice' && (
          <button className="btn block" onClick={() => setPhase('feedback')}>
            <Icon name="check" /> We did it
          </button>
        )}
        {phase === 'feedback' && (
          <button className="btn block" disabled={!fb.again} onClick={() => setPhase('read')}>
            Tell Mira
          </button>
        )}
        {phase === 'read' && (
          <button className="btn block" onClick={finish}>
            <Leaf size={20} color="#ffb937" /> Grow 3 leaves
          </button>
        )}
      </div>
    </div>
  )
}

function Opts({ value, onPick, options }: { value?: string; onPick: (v: string) => void; options: string[] }) {
  return (
    <div className="opts">
      {options.map((o) => (
        <button key={o} className={`chip ${value === o ? 'on' : ''}`} onClick={() => onPick(o)} aria-pressed={value === o}>
          {o}
        </button>
      ))}
    </div>
  )
}

function Celebrate({ skill, leaves, name, onDone }: { skill: string; leaves: number; name: string; onDone: () => void }) {
  return (
    <div className="screen celebrate">
      <Scene mood="peach" />
      <div className="fall" aria-hidden>
        {[...Array(9)].map((_, i) => (
          <span key={i} style={{ left: `${10 + i * 10}%`, animationDelay: `${(i % 3) * 0.35 + i * 0.08}s` }}>
            <Leaf size={22 + (i % 3) * 6} color={['#ffb937', '#ffc94f', '#ff9475'][i % 3]} />
          </span>
        ))}
      </div>
      <div className="celebrate-inner">
        <p className="eyebrow rise" style={{ color: 'var(--accent-deep)' }}>
          {skill} · together
        </p>
        <h1 className="display rise rise-1">3 leaves grown</h1>
        <p className="muted rise rise-2" style={{ fontSize: 17 }}>
          Because you did it together — and told Mira how it went.
        </p>
        <div className="celebrate-tree">
          <Tree growth={0.35 + (leaves / LEAVES_PER_TREE) * 0.65} blossoms={leaves} newFrom={Math.max(0, leaves - 3)} />
        </div>
        <div className="celebrate-count rise rise-3">
          <span>
            <b>{name}’s tree</b>
            <small>Every leaf is time you actually spent together</small>
          </span>
          <strong>
            {leaves}
            <small>/{LEAVES_PER_TREE}</small>
          </strong>
        </div>
        <button className="btn block" onClick={onDone}>
          Back home
        </button>
      </div>
    </div>
  )
}
