import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackBar, Sheet, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { TodayCard } from '../components/TodayCard'
import { useChild, useStore } from '../state/store'
import '../components/extras.css'

const LEVELS = 12
const LEAVES_PER_LEVEL = 5

export function useLevels() {
  const { s } = useStore()
  const done = Math.min(LEVELS, Math.floor(s.leaves / LEAVES_PER_LEVEL))
  const words = done === 0 ? 'Bare rock, for now' : done < 4 ? 'The first green' : done < 8 ? 'Growing in' : 'In full leaf'
  return { done, total: LEVELS, words, toNext: LEAVES_PER_LEVEL - (s.leaves % LEAVES_PER_LEVEL) }
}

/** "{child}'s island": opens the climb. */
export function RankCard() {
  const nav = useNavigate()
  const child = useChild()
  const { done, total, words, toNext } = useLevels()
  return (
    <button className="x-rank" onClick={() => nav('/journey/climb')}>
      <span className="x-rank-art" aria-hidden>
        <Icon name="map" size={30} />
      </span>
      <span style={{ flex: 1, textAlign: 'left' }}>
        <small className="eyebrow">Your journey</small>
        <b className="display" style={{ display: 'block', fontSize: 20 }}>
          {child.name}’s island
        </b>
        <span className="muted" style={{ fontSize: 14 }}>
          {words} · {done} of {total} levels
        </span>
        <span style={{ display: 'block', fontSize: 13, color: 'var(--teal)', fontWeight: 700, marginTop: 2 }}>Next up: {toNext} more {toNext === 1 ? 'leaf' : 'leaves'}</span>
      </span>
      <span className="x-link" aria-label="See all of it">
        <Icon name="chev" size={18} />
      </span>
    </button>
  )
}

/** The loop back to Home. */
/** Journey's link to today: the same Today card as on Home and Grow. */
export function NextStrand() {
  return <TodayCard className="today-solo" />
}

/** Scrolling level map: done, now, locked. */
export function Climb() {
  const child = useChild()
  const { done, total, words } = useLevels()
  const [pick, setPick] = useState<number | null>(null)
  const levels = Array.from({ length: total }, (_, i) => total - i) // top of the climb first
  return (
    <div className="screen">
      <BackBar to="/journey" label="Journey" />
      <div className="pad">
        <p className="eyebrow">{child.name}’s island</p>
        <h1 className="display" style={{ fontSize: 34 }}>
          {words}
        </h1>
        <p className="muted" style={{ margin: '6px 0 18px' }}>
          {done} of {total} levels. Tap a level to see where you are.
        </p>
        <div className="x-climb">
          {levels.map((n) => {
            const state = n <= done ? 'done' : n === done + 1 ? 'now' : 'locked'
            return (
              <button key={n} className={`x-isle ${state}`} style={{ marginLeft: `${(n % 3) * 18}%` }} onClick={() => setPick(pick === n ? null : n)} aria-label={`Level ${n}, ${state === 'now' ? 'you are here' : state}`}>
                <span className="x-isle-n">{state === 'done' ? <Icon name="check" size={18} stroke={3} /> : state === 'locked' ? <Icon name="lock" size={16} /> : n}</span>
                <span>Level {n}</span>
                {pick === n && <small>{state === 'done' ? 'Reached' : state === 'now' ? 'You are here' : `Keep going: ${(n - done) * LEAVES_PER_LEVEL} more leaves`}</small>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const SLIDES = [
  ['The first leaf', 'It started with a small moment at bedtime.'],
  ['The best day', 'A hard evening turned into a hug.'],
  ['Look how far', 'You came back, again and again.'],
]

/** A monthly "wrapped". */
export function BloomReport() {
  const { s } = useStore()
  const child = useChild()
  const [reel, setReel] = useState(false)
  const [i, setI] = useState(0)
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = new Set(s.log.map((e) => new Date(e.at).toDateString())).size
  return (
    <>
      <div className="screen">
        <BackBar to="/journey" label="Journey" />
        <div className="pad">
          <p className="eyebrow">{month} · wrapped</p>
          <h1 className="display" style={{ fontSize: 40 }}>
            Your bloom
          </h1>
          <div className="x-bloom-figs">
            <div>
              <b className="display">{s.leaves}</b>
              <span>leaves grown</span>
            </div>
            <div>
              <b className="display">{days}</b>
              <span>days together</span>
            </div>
          </div>
          <div className="card x-bloom-note">
            <p className="eyebrow">Mira’s note to you</p>
            <p>
              You keep showing up for {child.name}, even on the tired days. That is what a tree feels most: not the big moments, but the steady ones.
            </p>
          </div>
          <button className="btn block" style={{ marginTop: 18 }} onClick={() => { setI(0); setReel(true) }}>
            <Icon name="play" size={18} /> Watch the memory reel
          </button>
        </div>
      </div>
      <TabBar />
      {reel && (
        <Sheet onClose={() => setReel(false)} label="Memory reel">
          <div className="x-reel" aria-live="polite">
            <p className="eyebrow">
              {i + 1} of {SLIDES.length}
            </p>
            <h2 className="display">{SLIDES[i][0]}</h2>
            <p>{SLIDES[i][1]}</p>
          </div>
          <button className="btn block" onClick={() => (i + 1 < SLIDES.length ? setI(i + 1) : setReel(false))}>
            {i + 1 < SLIDES.length ? 'Next' : 'Done'}
          </button>
        </Sheet>
      )}
    </>
  )
}
