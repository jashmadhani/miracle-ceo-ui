import { useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scene, type SceneMood } from '../art/Scene'
import { Tree } from '../art/Tree'
import { ActivityArt } from '../art/ActivityArt'
import { Icon } from '../components/Icon'
import { ONBOARDING } from '../data/content'
import { useStore, type Gender, type Role } from '../state/store'
import './onboarding.css'

type StepId =
  | 'seed'
  | 'you'
  | 'promise'
  | 'access'
  | 'child'
  | 'first'
  | 'grow'
  | 'hard'
  | 'tried'
  | 'mira'
  | 'extra'
  | 'time'
  | 'transform'
  | 'planted'

const FLOW: StepId[] = ['seed', 'you', 'promise', 'access', 'child', 'first', 'grow', 'hard', 'tried', 'mira', 'extra', 'time', 'transform', 'planted']
const MOOD: Partial<Record<StepId, SceneMood>> = { seed: 'dawn', promise: 'peach', mira: 'day', transform: 'dusk', planted: 'peach' }

export function Onboarding() {
  const nav = useNavigate()
  const { s, set, earn } = useStore()
  // keep the step across reloads so a refresh doesn't restart onboarding
  const [i, setStep] = useState(() => Number(sessionStorage.getItem('ob-step') || 0))
  const setI = (v: number | ((n: number) => number)) =>
    setStep((n) => {
      const next = typeof v === 'function' ? v(n) : v
      try {
        sessionStorage.setItem('ob-step', String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  const [bubble, setBubble] = useState<string | null>(null)
  const [planted, setPlanted] = useState(false)
  const [schoolCode, setSchoolCode] = useState('')
  const [agree, setAgree] = useState(false)
  const [tips, setTips] = useState(false)

  const step = FLOW[i]
  const progress = i / (FLOW.length - 1)
  const growth = step === 'seed' ? 0.1 : Math.min(1, 0.12 + progress * 0.3)
  const childName = s.child.name || 'your child'

  const next = (say?: string) => {
    if (say) setBubble(say)
    setI((n) => Math.min(FLOW.length - 1, n + 1))
  }
  const back = () => (i === 0 ? nav('/sign-in') : setI((n) => n - 1))

  const toggle = (key: 'grow' | 'hard' | 'tried' | 'extra', v: string, max?: number) =>
    set((p) => {
      const cur = p[key]
      if (cur.includes(v)) return { [key]: cur.filter((x) => x !== v) }
      if (max && cur.length >= max) return {}
      return { [key]: [...cur, v] }
    })

  let card: ReactNode
  switch (step) {
    case 'seed':
      card = <SeedStep planted={planted} onPlant={() => { setPlanted(true); setTimeout(() => next('Planted. Let’s get to know you.'), 900) }} />
      break
    case 'you':
      card = (
        <Q kicker="About you" title="What should we call you?">
          <input className="field" placeholder="Your first name" value={s.parentName} onChange={(e) => set({ parentName: e.target.value })} autoComplete="given-name" />
          <p className="label" style={{ marginTop: 18 }}>I’m their</p>
          <div className="chips">
            {(['mom', 'dad', 'guardian'] as Role[]).map((r) => (
              <button key={r} className={`chip ${s.role === r ? 'on' : ''}`} onClick={() => set({ role: r })}>
                {r === 'mom' ? 'Mom' : r === 'dad' ? 'Dad' : 'Guardian'}
              </button>
            ))}
          </div>
          <Check on={agree} onClick={() => setAgree((v) => !v)}>
            I agree to the <b>Terms</b> and <b>Privacy Policy</b>. What I share about my child stays private.
          </Check>
          <Check on={tips} onClick={() => setTips((v) => !v)}>
            Send me the odd parenting tip (optional)
          </Check>
          <Cta disabled={!s.parentName.trim() || !agree} onClick={() => next(`Nice to meet you, ${s.parentName.trim()}.`)} />
        </Q>
      )
      break
    case 'promise':
      card = (
        <Q kicker="How it works" title="Five minutes. One small moment, every day.">
          <div className="promise-art">
            <ActivityArt skill="EQ" />
          </div>
          <Cta label="Sounds doable" onClick={() => next()} />
        </Q>
      )
      break
    case 'access':
      card = (
        <Q kicker="About you" title="How are you joining?">
          <Choice emoji="🏫" title="My child’s school invited me" sub="You’ll have a code" on={s.access === 'school'} onClick={() => set({ access: 'school' })} />
          <Choice emoji="🌱" title="I’m here on my own" sub="Starts with a free trial" on={s.access === 'trial'} onClick={() => set({ access: 'trial' })} />
          {s.access === 'school' && (
            <input className="field rise" style={{ marginTop: 12 }} placeholder="School code" value={schoolCode} onChange={(e) => setSchoolCode(e.target.value.toUpperCase())} />
          )}
          <Cta disabled={!s.access || (s.access === 'school' && schoolCode.length < 4)} onClick={() => next('Small moments. Deep roots.')} />
        </Q>
      )
      break
    case 'child':
      card = (
        <Q kicker="Your child" title="Who’s growing with you?">
          <input className="field" placeholder="Their name" value={s.child.name} onChange={(e) => set({ child: { ...s.child, name: e.target.value } })} />
          <label className="label" style={{ marginTop: 16 }} htmlFor="dob">
            Birthday
          </label>
          <input id="dob" className="field" type="date" value={s.child.dob} max={new Date().toISOString().slice(0, 10)} onChange={(e) => set({ child: { ...s.child, dob: e.target.value } })} />
          <div className="chips" style={{ marginTop: 16 }}>
            {(
              [
                ['girl', 'Girl'],
                ['boy', 'Boy'],
                ['unsaid', 'Prefer not to say'],
              ] as [Gender, string][]
            ).map(([g, l]) => (
              <button key={g} className={`chip ${s.child.gender === g ? 'on' : ''}`} onClick={() => set({ child: { ...s.child, gender: g } })}>
                {l}
              </button>
            ))}
          </div>
          <Cta disabled={!s.child.name.trim() || !s.child.dob} onClick={() => next(`${s.child.name.trim()} is still learning the world through you.`)} />
        </Q>
      )
      break
    case 'first':
      card = (
        <Q kicker="Your child" title={`Is ${childName} your first?`}>
          {[
            ['🌱', 'Yes, my first'],
            ['🌳', 'No, I have other children'],
            ['🤰', 'Yes, and another on the way'],
          ].map(([e, t]) => (
            <Choice key={t} emoji={e} title={t} on={s.firstChild === t} onClick={() => set({ firstChild: t })} />
          ))}
          <Cta disabled={!s.firstChild} onClick={() => next('First time? Everyone learns this by doing.')} />
        </Q>
      )
      break
    case 'grow':
      card = (
        <Q kicker="Your child" title={`Where would you like ${childName} to grow?`} hint="Pick as many as you like.">
          <div className="chips">
            {ONBOARDING.grow.map(([e, t]) => (
              <button key={t} className={`chip ${s.grow.includes(t) ? 'on' : ''}`} onClick={() => toggle('grow', t)}>
                {e} {t}
              </button>
            ))}
          </div>
          <Cta disabled={!s.grow.length} onClick={() => next('Those are beautiful things to grow.')} />
        </Q>
      )
      break
    case 'hard':
      card = (
        <Q kicker="Right now" title="What’s been hard lately?" hint="Up to three. Nobody else sees this.">
          <div className="chips">
            {ONBOARDING.hard.map(([e, t]) => (
              <button key={t} className={`chip ${s.hard.includes(t) ? 'on' : ''}`} onClick={() => toggle('hard', t, 3)} disabled={!s.hard.includes(t) && s.hard.length >= 3} style={!s.hard.includes(t) && s.hard.length >= 3 ? { opacity: 0.45 } : undefined}>
                {e} {t}
              </button>
            ))}
          </div>
          <Cta label={s.hard.length ? 'Continue' : 'Nothing right now'} onClick={() => next(s.hard.length ? 'That helps. We’ll start there.' : 'Lovely. We’ll keep it playful.')} />
        </Q>
      )
      break
    case 'tried':
      card = (
        <Q kicker="Right now" title="What have you already tried?" hint="No judgement — we’ve all Googled at midnight.">
          <div className="chips">
            {ONBOARDING.tried.map(([e, t]) => (
              <button key={t} className={`chip ${s.tried.includes(t) ? 'on' : ''}`} onClick={() => toggle('tried', t)}>
                {e} {t}
              </button>
            ))}
          </div>
          <Cta label={s.tried.length ? 'Continue' : 'Skip'} onClick={() => next('Every question you’ve asked about them is love.')} />
        </Q>
      )
      break
    case 'mira':
      card = (
        <Q kicker="Meet Mira" title="Ask the hard questions. Any hour.">
          <div className="mira-preview">
            <div className="bubble me">{s.hard[0] === 'Bedtime' || !s.hard.length ? 'Why does bedtime take so long?' : `Help — ${s.hard[0].toLowerCase()} is a daily fight.`}</div>
            <div className="bubble mira">
              <span className="mira-dot" /> Here’s what’s really going on for {childName}, and one thing to try tonight.
            </div>
          </div>
          <Cta label="I’d like that" onClick={() => next()} />
        </Q>
      )
      break
    case 'extra':
      card = (
        <Q kicker="Your child" title={`Anything else we should know about ${childName}?`} hint="Optional.">
          <div className="chips">
            {ONBOARDING.extra.map(([e, t]) => (
              <button key={t} className={`chip ${s.extra.includes(t) ? 'on' : ''}`} onClick={() => toggle('extra', t)}>
                {e} {t}
              </button>
            ))}
          </div>
          <Cta label={s.extra.length ? 'Continue' : 'Nothing in particular'} onClick={() => next('Thank you. Mira will go gently.')} />
        </Q>
      )
      break
    case 'time':
      card = (
        <Q kicker="About you" title="How much time can you give most days?" hint="We’ll only suggest what fits.">
          {ONBOARDING.time.map(([e, t, sub]) => (
            <Choice key={t} emoji={e} title={t} sub={sub} on={s.time === t} onClick={() => set({ time: t })} />
          ))}
          <Cta disabled={!s.time} onClick={() => next('Look — its first real branches.')} />
        </Q>
      )
      break
    case 'transform':
      card = (
        <Q kicker="Your journey" title="From bonsai parenting to a tree that grows free.">
          <div className="transform">
            <div>
              <BonsaiMini />
              <p className="eyebrow">Bonsai</p>
              <span>Reactive</span>
              <span>Overwhelmed</span>
              <span>Controlling</span>
            </div>
            <Icon name="arrow" size={26} style={{ color: 'var(--ink-3)', alignSelf: 'center' }} />
            <div className="ceo">
              <Tree growth={0.8} sway={false} ground={false} className="mini-tree" />
              <p className="eyebrow">Miracle CEO</p>
              <span>Conscious</span>
              <span>Emotionally intelligent</span>
              <span>Outstanding</span>
            </div>
          </div>
          <Cta label="Grow my tree" onClick={() => next()} />
        </Q>
      )
      break
    case 'planted':
      card = null
      break
  }

  if (step === 'planted') {
    return (
      <div className="screen ob">
        <Scene mood="peach" />
        <div className="planted">
          <p className="eyebrow rise" style={{ color: 'var(--teal)' }}>
            Your tree is planted
          </p>
          <h1 className="display rise rise-1">
            Welcome, {s.parentName.trim() || 'friend'}.
            <br />
            Let’s grow {childName}.
          </h1>
          <div className="planted-tree">
            <Tree growth={0.4} />
          </div>
          <button
            className="btn block rise rise-3"
            onClick={() => {
              set({ onboarded: true })
              sessionStorage.removeItem('ob-step')
              earn(2, 'Planted your tree', 'visit')
              nav('/home', { replace: true })
            }}
          >
            Show me today’s moment <Icon name="arrow" size={20} />
          </button>
          <p className="muted" style={{ textAlign: 'center', fontSize: 14, marginTop: 12 }}>
            You can change any of this later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen ob">
      <Scene mood={MOOD[step] ?? 'dawn'} />
      <div className="ob-top">
        <button className="icon-btn flat" onClick={back} aria-label="Back">
          <Icon name="back" />
        </button>
        <div className="progress" style={{ flex: 1 }}>
          <i style={{ width: `${Math.max(4, progress * 100)}%` }} />
        </div>
        <span className="ob-count">
          {i + 1}/{FLOW.length}
        </span>
      </div>

      {step === 'seed' ? (
        <>
          <div className={`ob-art seed ${!planted ? 'unplanted' : ''}`}>
            <Tree growth={growth} className="ob-tree" />
          </div>
          <div className="ob-card clear">{card}</div>
        </>
      ) : (
        // the tree always stands on the top edge of the question card
        <div className="ob-stack">
          <div className="ob-art">
            {bubble && (
              <div key={bubble} className="ob-bubble">
                <span className="mira-dot" /> {bubble}
              </div>
            )}
            <Tree growth={growth} className="ob-tree" />
          </div>
          <div key={step} className="ob-card">
            {card}
          </div>
        </div>
      )}
    </div>
  )
}

function SeedStep({ planted, onPlant }: { planted: boolean; onPlant: () => void }) {
  const [dy, setDy] = useState(0)
  const start = useRef<number | null>(null)
  return (
    <div className="seed-step">
      <h1 className="display">
        Every child starts as a <span style={{ color: 'var(--coral-2)' }}>seed</span>.
      </h1>
      <p className="muted" style={{ fontSize: 17, marginTop: 10 }}>
        Your job is the gardener’s. Drag it into the soil.
      </p>
      <div
        className={`seed-drag ${planted ? 'planted' : ''}`}
        style={{ transform: `translateY(${planted ? 140 : dy}px)` }}
        onPointerDown={(e) => {
          start.current = e.clientY
          ;(e.target as Element).setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => start.current != null && setDy(Math.max(0, Math.min(150, e.clientY - start.current)))}
        onPointerUp={() => {
          if (dy > 70) onPlant()
          else setDy(0)
          start.current = null
        }}
        role="button"
        aria-label="Plant the seed"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onPlant()}
      >
        <svg viewBox="0 0 60 70" width="64" height="74" aria-hidden>
          <ellipse cx="30" cy="38" rx="20" ry="26" fill="#8a5222" />
          <path d="M30 14 C25 28 25 46 30 62" stroke="#5e3514" strokeWidth="3" fill="none" />
          <ellipse cx="22" cy="28" rx="5" ry="8" fill="#c08446" />
        </svg>
        {!planted && (
          <span className="seed-hint">
            <Icon name="down" size={18} /> slide down
          </span>
        )}
      </div>
      {!planted && (
        <button className="link-btn" style={{ marginTop: 10 }} onClick={onPlant}>
          Or tap to plant
        </button>
      )}
    </div>
  )
}

function Q({ kicker, title, hint, children }: { kicker: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="q">
      <p className="eyebrow">{kicker}</p>
      <h2 className="display q-title">{title}</h2>
      {hint && <p className="muted" style={{ marginTop: -6, marginBottom: 16 }}>{hint}</p>}
      <div className="q-body">{children}</div>
    </div>
  )
}

function Cta({ label = 'Continue', disabled, onClick }: { label?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <div className="q-cta">
      <button className="btn block" disabled={disabled} onClick={onClick}>
        {label}
      </button>
    </div>
  )
}

function Choice({ emoji, title, sub, on, onClick }: { emoji: string; title: string; sub?: string; on: boolean; onClick: () => void }) {
  return (
    <button className={`choice ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on} style={{ marginBottom: 10 }}>
      <span className="emoji">{emoji}</span>
      <span>
        <span className="c-title" style={{ display: 'block' }}>
          {title}
        </span>
        {sub && <span className="c-sub" style={{ display: 'block' }}>{sub}</span>}
      </span>
      <span className="check">{on && <Icon name="check" size={16} stroke={3} style={{ color: 'var(--ink)' }} />}</span>
    </button>
  )
}

function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button className="check-row" onClick={onClick} aria-pressed={on}>
      <span className={`box ${on ? 'on' : ''}`}>{on && <Icon name="check" size={15} stroke={3} />}</span>
      <span>{children}</span>
    </button>
  )
}

function BonsaiMini() {
  return (
    <svg viewBox="0 0 100 90" className="mini-tree" aria-hidden>
      <path d="M22 70 h56 l-6 16 h-44 Z" fill="#b5674a" />
      <path d="M50 70 C48 58 40 54 34 48 M50 70 C52 56 60 50 66 44 M50 70 V40" stroke="#5a3418" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="44" rx="14" ry="8" fill="#6aab17" />
      <ellipse cx="68" cy="40" rx="14" ry="8" fill="#6aab17" />
      <ellipse cx="50" cy="32" rx="16" ry="9" fill="#98cd1b" />
    </svg>
  )
}
