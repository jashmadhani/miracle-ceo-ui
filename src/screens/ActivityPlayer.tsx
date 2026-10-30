import { useEdge } from '../components/edge'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActivityArt, Leaf } from '../art/ActivityArt'
import { Tree } from '../art/Tree'
import { LEAF_TONES, useTreeLeafTones, type LeafTone } from '../art/leafColors'
import { Scene, SKIES } from '../art/Scene'
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
  const tones = useTreeLeafTones()
  const [phase, setPhase] = useState<Phase>('intro')
  // status bar follows the screen: the skill's tint while doing it, the calm cream sky after
  useEdge(phase === 'celebrate' ? SKIES.peach[0] : { EQ: '#f9c9ce', SQ: '#c2e2db', IQ: '#fbdc9f' }[act.skill], false, '#fbf7f1')
  const [n, setN] = useState(0)
  const [tip, setTip] = useState<'magic' | 'support' | 'challenge' | null>(null)
  const [fb, setFb] = useState<{ how?: string; obs?: string; again?: string; note: string }>({ note: '' })
  const body = useRef<HTMLDivElement>(null)

  // every new step starts at the top (old app kept the scroll position)
  useEffect(() => {
    body.current?.scrollTo({ top: 0 })
    setTip(null)
  }, [n, phase])

  // each feedback answer reveals the next question below: bring it into view
  useEffect(() => {
    if (phase !== 'feedback' || !fb.how) return
    const t = setTimeout(() => body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' }), 80)
    return () => clearTimeout(t)
  }, [fb.how, fb.obs, phase])

  const total = act.steps.length
  const step = act.steps[n]

  const finish = () => {
    earn(3, act.title, 'activity', act.skill)
    set((p) => ({ done: { ...p.done, [act.id]: Date.now() } }))
    setPhase('celebrate')
  }

  if (phase === 'celebrate') return <Celebrate skill={sk.name} skillKey={act.skill} title={act.title} tones={tones} onDone={() => nav('/home')} leaves={s.leaves % LEAVES_PER_TREE} name={child.name} />

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
                  {step.line.startsWith('“') ? (
                    <>
                      <Icon name="chat" size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Say something like
                    </>
                  ) : (
                    'A small tip'
                  )}
                </p>
                <p className="say-line">{step.line}</p>
              </div>
            )}
            {/* only the tips this activity has */}
            {(act.magic || act.support || act.challenge) && (
              <div className="tips">
                {(
                  [
                    ['magic', 'Make it playful', act.magic],
                    ['support', 'Make it easier', act.support],
                    ['challenge', 'Make it harder', act.challenge],
                  ] as const
                )
                  .filter(([, , body]) => body)
                  .map(([k, t]) => (
                    <button key={k} className={`tip ${tip === k ? 'on' : ''}`} onClick={() => setTip(tip === k ? null : k)} aria-expanded={tip === k}>
                      {t}
                    </button>
                  ))}
              </div>
            )}
            {tip && <p className="tip-body rise">{act[tip]}</p>}
          </div>
        )}

        {phase === 'practice' && (
          <div className="rise">
            <p className="eyebrow">All steps done</p>
            <h2 className="display act-say">Carry it into the rest of the week.</h2>
            <div className="say-card practice">
              <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                Practise it this week
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
            <Opts value={fb.how} onPick={(v) => setFb({ ...fb, how: v })} options={['Loved it', 'Enjoyed it', 'It was okay', 'Wanted something else']} />
            {fb.how && (
              <div className="rise">
                <p className="fb-q">{act.observe.q}</p>
                <p className="muted" style={{ fontSize: 14, marginBottom: 10 }}>
                  Every note helps Mira choose the next activity for {child.name}.
                </p>
                <Opts value={fb.obs} onPick={(v) => setFb({ ...fb, obs: v })} options={act.observe.options} />
              </div>
            )}
            {fb.obs && (
              <div className="rise">
                <p className="fb-q">Would you do it again?</p>
                <Opts value={fb.again} onPick={(v) => setFb({ ...fb, again: v })} options={['Yes, definitely', 'Probably', 'Maybe another day']} />
                <label className="label" htmlFor="note" style={{ marginTop: 18 }}>
                  One thing {child.name} said or did (optional)
                </label>
                <input id="note" className="field" placeholder="A word, a face, a funny moment" value={fb.note} onChange={(e) => setFb({ ...fb, note: e.target.value })} />
              </div>
            )}
          </div>
        )}

        {phase === 'read' && (
          <div className="rise">
            <div className="mira-read">
              <p className="eyebrow" style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--mira)' }}>
                <MiraOrb size={22} /> What Mira noticed
              </p>
              <p className="say-line" style={{ fontWeight: 500 }}>
                {act.read}
              </p>
            </div>
            <div className="say-card practice" style={{ marginTop: 12 }}>
              <p className="eyebrow" style={{ color: 'var(--teal)' }}>
                You told Mira
              </p>
              <p style={{ fontWeight: 650, marginTop: 6 }}>{fb.obs}</p>
              <p className="muted" style={{ fontSize: 14, marginTop: 2 }}>
                Thank you. Mira will keep this in mind for next time.
              </p>
            </div>
            <p className="muted ai-note">
              Mira is our AI guide. She learns from the moments you share, and you know {child.name} best.
            </p>
          </div>
        )}
      </div>

      <div className="act-bar">
        {phase === 'intro' && (
          <button
            className="btn block"
            onClick={() => {
              set((p) => ({ started: p.started.includes(act.id) ? p.started : [...p.started, act.id] }))
              setPhase('steps')
            }}
          >
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
            Finish <Icon name="arrow" size={20} />
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

/** After an activity: a quiet "done together", with the new leaves settling on the tree. */
function Celebrate({ skill, skillKey, title, tones, leaves, name, onDone }: { skill: string; skillKey: keyof typeof LEAF_TONES; title: string; tones: LeafTone[]; leaves: number; name: string; onDone: () => void }) {
  const added = Math.min(3, leaves)
  const from = leaves - added
  // the count ticks up as each leaf lands on the tree
  const [shown, setShown] = useState(from)
  useEffect(() => {
    const ts = Array.from({ length: added }, (_, k) => setTimeout(() => setShown(from + k + 1), (0.6 + 0.9 * k + 1.1) * 1000))
    return () => ts.forEach(clearTimeout)
  }, [added, from])
  const col = LEAF_TONES[skillKey].fill
  return (
    <div className="screen celebrate" style={{ '--cel': col } as CSSProperties}>
      <Scene mood="peach" />
      <div className="cel-rays" aria-hidden />
      <div className="cel-confetti" aria-hidden>
        {Array.from({ length: 18 }, (_, k) => (
          <span key={k} style={{ left: `${(k * 37) % 100}%`, animationDelay: `${(k % 6) * 0.18}s`, animationDuration: `${2.6 + (k % 4) * 0.4}s`, '--r': `${(k % 2 ? 1 : -1) * (200 + k * 20)}deg` } as CSSProperties}>
            <Leaf size={12 + (k % 3) * 3} tone={k % 3 === 0 ? LEAF_TONES.other : LEAF_TONES[skillKey]} />
          </span>
        ))}
      </div>
      <div className="celebrate-inner">
        <p className="eyebrow rise">{skill} · together</p>
        <h1 className="display rise rise-1">Done, together.</h1>
        <p className="muted rise rise-2" style={{ fontSize: 17 }}>
          You did {title} with {name}, and told Mira how it went.
        </p>
        <div className="celebrate-tree">
          <Tree growth={0.35 + (leaves / LEAVES_PER_TREE) * 0.65} blossoms={leaves} tones={tones} newFrom={from} buds fly />
        </div>
        <p className="sr-only" role="status">
          {added === 1 ? '1 leaf' : `${added} leaves`} added. {name}’s tree has {leaves} of {LEAVES_PER_TREE}.
        </p>
        <div className="celebrate-count rise rise-3" aria-hidden>
          <span className="cel-plus" style={{ background: col }}>
            +{added}
          </span>
          <span>
            <b>{name}’s tree</b>
            <small>{added === 1 ? '1 leaf' : `${added} leaves`} for today’s activity</small>
          </span>
          <strong key={shown} className={shown > from ? 'tick' : undefined}>
            {shown}
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
