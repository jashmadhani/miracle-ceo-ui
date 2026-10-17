import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackBar, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { Family } from '../art/Family'
import { ONBOARDING } from '../data/content'
import { useChild, useStore, type Gender } from '../state/store'
import './profile.css'

export function ChildProfile() {
  const nav = useNavigate()
  const { s } = useStore()
  const child = useChild()
  return (
    <>
      <div className="screen with-tabbar profile">
        <BackBar to="/journey" label="Journey" />
        <div className="pad">
          <div className="profile-hero">
            <Family parent={s.role} pose="hug" className="profile-art" />
            <div>
              <h1 className="display" style={{ fontSize: 34 }}>
                {child.name}
              </h1>
              <p className="muted">
                {child.age.years} years {child.age.months ? `and ${child.age.months} months` : ''} old
              </p>
            </div>
          </div>

          <div className="bento" style={{ marginTop: 14 }}>
            <div className="tile" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', minHeight: 110 }}>
              <span className="eyebrow">Guidance for</span>
              <span className="tile-title" style={{ marginTop: 'auto', fontSize: 24 }}>
                Ages 5–8
              </span>
            </div>
            <div className="tile" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', minHeight: 110 }}>
              <span className="eyebrow">Daily time</span>
              <span className="tile-title" style={{ marginTop: 'auto', fontSize: 24 }}>
                {s.time ?? '5–10 min'}
              </span>
            </div>
            <div className="tile wide" style={{ background: 'var(--sand)', minHeight: 0 }}>
              <span className="eyebrow">Growing</span>
              <div className="chips" style={{ marginTop: 10 }}>
                {(s.grow.length ? s.grow : ['Not set']).map((g) => (
                  <span key={g} className="pill">
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="tile wide" style={{ background: 'var(--sand)', minHeight: 0 }}>
              <span className="eyebrow">Hard right now</span>
              <div className="chips" style={{ marginTop: 10 }}>
                {(s.hard.length ? s.hard : ['Nothing right now']).map((g) => (
                  <span key={g} className="pill">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="btn block" style={{ marginTop: 18 }} onClick={() => nav('/journey/child/edit')}>
            <Icon name="settings" size={18} /> Edit {child.name}’s details
          </button>
          <p className="muted" style={{ fontSize: 13, textAlign: 'center', marginTop: 14 }}>
            <Icon name="lock" size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> Stored encrypted. Schools never see it.
          </p>
        </div>
      </div>
      <TabBar />
    </>
  )
}

const TRAITS: [string, string][] = [
  ['Cautious', 'Impulsive'],
  ['Sensitive', 'Thick-skinned'],
  ['Inward', 'Outward'],
  ['Routine-led', 'Spontaneous'],
  ['Persistent', 'Gives up quickly'],
]

export function ChildEdit() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const [name, setName] = useState(s.child.name)
  // birthday is prefilled from what was saved (old app showed blank fields)
  const [dob, setDob] = useState(s.child.dob)
  const [gender, setGender] = useState<Gender>(s.child.gender)
  const [traits, setTraits] = useState<number[]>(TRAITS.map(() => 50))
  const [grow, setGrow] = useState<string[]>(s.grow)
  const [hard, setHard] = useState<string[]>(s.hard)
  const [tried, setTried] = useState<string[]>(s.tried)
  const flip = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  return (
    <div className="screen profile">
      <BackBar to="/journey/child" label="Profile" />
      <div className="pad" style={{ paddingBottom: 120 }}>
        <h1 className="display" style={{ fontSize: 36 }}>
          Edit details
        </h1>
        <p className="muted" style={{ margin: '6px 0 22px' }}>
          This decides what we suggest first.
        </p>

        <section className="edit-sec">
          <label className="label" htmlFor="e-name">
            Name
          </label>
          <input id="e-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label" htmlFor="e-dob" style={{ marginTop: 14 }}>
            Birthday
          </label>
          <input id="e-dob" className="field" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <div className="chips" style={{ marginTop: 14 }}>
            {(
              [
                ['girl', 'Girl'],
                ['boy', 'Boy'],
                ['unsaid', 'Prefer not to say'],
              ] as [Gender, string][]
            ).map(([g, l]) => (
              <button key={g} className={`chip ${gender === g ? 'on' : ''}`} onClick={() => setGender(g)}>
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="edit-sec">
          <h2 className="edit-h">What they’re like</h2>
          <p className="muted" style={{ fontSize: 14, marginBottom: 14 }}>
            Only used to choose what to suggest first.
          </p>
          {TRAITS.map(([l, r], i) => (
            <div key={l} className="trait">
              <div className="trait-labels">
                <span>{l}</span>
                <span>{r}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={traits[i]}
                onChange={(e) => setTraits(traits.map((t, k) => (k === i ? Number(e.target.value) : t)))}
                style={{ ['--v' as string]: `${traits[i]}%` }}
                aria-label={`${l} to ${r}`}
              />
            </div>
          ))}
        </section>

        <section className="edit-sec">
          <h2 className="edit-h">Hard right now</h2>
          <div className="chips">
            {ONBOARDING.hard.map(([e, t]) => (
              <button key={t} className={`chip ${hard.includes(t) ? 'on' : ''}`} onClick={() => setHard(flip(hard, t))}>
                {e} {t}
              </button>
            ))}
          </div>
        </section>

        <section className="edit-sec">
          <h2 className="edit-h">Where you’d like them to grow</h2>
          <div className="chips">
            {ONBOARDING.grow.map(([e, t]) => (
              <button key={t} className={`chip ${grow.includes(t) ? 'on' : ''}`} onClick={() => setGrow(flip(grow, t))}>
                {e} {t}
              </button>
            ))}
          </div>
        </section>

        <section className="edit-sec">
          <h2 className="edit-h">What you’ve already tried</h2>
          <div className="chips">
            {ONBOARDING.tried.map(([e, t]) => (
              <button key={t} className={`chip ${tried.includes(t) ? 'on' : ''}`} onClick={() => setTried(flip(tried, t))}>
                {e} {t}
              </button>
            ))}
          </div>
        </section>
      </div>
      <div className="save-bar">
        <button
          className="btn block"
          disabled={!name.trim() || !dob}
          onClick={() => {
            set({ child: { name: name.trim(), dob, gender }, grow, hard, tried })
            toast({ title: 'Saved', body: `${name.trim()}’s suggestions will update.` })
            nav('/journey/child')
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
