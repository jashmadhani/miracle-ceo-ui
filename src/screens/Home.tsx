import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChildSwitcher, TabBar } from '../components/Shell'
import { KnowingBento, TodayHero, TreeCard, VideoList, useToday } from '../components/Cards'
import { MoodCheckin } from './MoodCheckin'
import { MoodFace } from '../art/MoodFace'
import { today, useChild, useStore } from '../state/store'
import './home.css'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export function Home() {
  const nav = useNavigate()
  const { s, set, earn, toast } = useStore()
  const child = useChild()
  const { act, done } = useToday()
  const [checkin, setCheckin] = useState(s.moodDay !== today())
  const [returned, setReturned] = useState(false)

  // A returning visit (not the first day) earns leaves; the toast waits until the check-in is closed.
  const counted = useRef(false) // StrictMode runs effects twice in dev
  useEffect(() => {
    if (counted.current || s.visitDay === today()) return
    counted.current = true
    const first = s.visitDay === null
    set({ visitDay: today() })
    if (!first) {
      earn(2, 'Came back today', 'visit')
      setReturned(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (returned && !checkin) {
      setReturned(false)
      const t = setTimeout(() => toast({ title: '+2 leaves', body: 'You came back today.' }), 500)
      return () => clearTimeout(t)
    }
  }, [returned, checkin, toast])

  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })

  return (
    <>
      <div className="screen with-tabbar home">
        <header className="home-head">
          <div className="home-head-row">
            <button className="home-me" onClick={() => nav('/journey')} aria-label="Your journey">
              {(s.parentName || 'Y')[0].toUpperCase()}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="home-date">{date}</p>
              <h1 className="display home-hello">
                {greeting()}, {s.parentName || 'friend'}
              </h1>
            </div>
          </div>
          <div className="home-head-row" style={{ marginTop: 14, justifyContent: 'space-between' }}>
            <ChildSwitcher tone="glass" />
            {s.mood && s.moodDay === today() && (
              <button className="mood-mini" onClick={() => setCheckin(true)} aria-label="Change today’s mood">
                <MoodFace mood={s.mood} size={36} />
              </button>
            )}
          </div>
        </header>

        <div className="pad home-today">
          <p className="eyebrow" style={{ margin: '0 0 10px 4px', color: 'var(--ink-2)' }}>
            Today with {child.name}
          </p>
          <TodayHero act={act} done={done} />
        </div>

        <div className="pad" style={{ marginTop: 16 }}>
          <TreeCard />
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>Things worth knowing</h2>
          </div>
          <KnowingBento />
        </div>

        <div className="pad">
          <div className="section-head">
            <h2>Get to know {child.name}</h2>
          </div>
          <VideoList />
        </div>

        <p className="home-quote">
          “The days are long,
          <br />
          but the years are short.”
        </p>
      </div>
      <TabBar />
      {checkin && <MoodCheckin onDone={() => setCheckin(false)} />}
    </>
  )
}
