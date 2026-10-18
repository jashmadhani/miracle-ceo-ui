import { useEdge } from '../components/edge'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChildSwitcher, TabBar } from '../components/Shell'
import { KnowingRow, TodayBlock, TreeCard, VideoList, useToday } from '../components/Cards'
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
  useEdge('#ec6f7d', false, '#fdfbe9')
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
      const t = setTimeout(() => toast({ title: 'Good to see you', body: 'Two leaves added to the tree.' }), 500)
      return () => clearTimeout(t)
    }
  }, [returned, checkin, toast])

  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })

  return (
    <>
      <div className="screen with-tabbar home">
        {/* colour-block sections, following the designer's Home (reference 07b) */}
        <section className="hsec hsec-top hsec-coral">
          {/* same header pattern as the other tabs: eyebrow, big title, actions on the right */}
          <p className="eyebrow">
            {greeting()} · {date}
          </p>
          <div className="home-head-row">
            <h1 className="display home-hello">Hello, {s.parentName || 'friend'}</h1>
            {s.mood && s.moodDay === today() && (
              <button className="mood-mini" onClick={() => setCheckin(true)} aria-label="Change today’s mood">
                <MoodFace mood={s.mood} size={34} />
              </button>
            )}
            <button className="home-me" onClick={() => nav('/journey')} aria-label="Your journey">
              {(s.parentName || 'Y')[0].toUpperCase()}
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <ChildSwitcher tone="glass" />
          </div>
          <TodayBlock act={act} done={done} />
        </section>

        <section className="hsec hsec-cream">
          <TreeCard bare />
        </section>

        <section className="hsec hsec-amber">
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2>Things worth knowing</h2>
          </div>
          <KnowingRow />
        </section>

        <section className="hsec hsec-last hsec-teal">
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2 style={{ color: '#fff' }}>Get to know {child.name}</h2>
          </div>
          <VideoList />
          <p className="home-quote">
            “The days are long,
            <br />
            but the years are short.”
          </p>
        </section>
      </div>
      <TabBar />
      {checkin && <MoodCheckin onDone={() => setCheckin(false)} />}
    </>
  )
}
