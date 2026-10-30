import { useEdge } from '../components/edge'
import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChildSwitcher, TabBar } from '../components/Shell'
import { TreeCard, useToday } from '../components/Cards'
import { ReadSegment, WatchSegment } from '../components/HomeMedia'
import { OpenTaskCard } from '../components/HomeExtras'
import { Icon } from '../components/Icon'
import { Leaf } from '../art/ActivityArt'
import { ACTIVITIES, SKILLS } from '../data/content'
import { Pot } from '../art/Pot'
import { LEAF_TONES } from '../art/leafColors'
import { today, useChild, useStore } from '../state/store'
import './home.css'
import './home-sky.css'

const PAGE = '#d6e8f9'
const CLOUD = 'M20 40 C6 40 0 30 6 22 C10 14 22 12 28 18 C32 6 50 2 60 12 C68 4 84 6 88 18 C100 16 108 26 102 34 C100 38 96 40 90 40 Z'

export function Home() {
  const nav = useNavigate()
  const { s, set, earn, toast } = useStore()
  const child = useChild()
  const { act, done } = useToday()
  useEdge(PAGE, false, '#f6b137')

  // A returning visit (not the first day) earns leaves.
  const counted = useRef(false) // StrictMode runs effects twice in dev
  useEffect(() => {
    if (counted.current || s.visitDay === today()) return
    counted.current = true
    const first = s.visitDay === null
    set({ visitDay: today() })
    if (!first) {
      earn(2, 'Came back today', 'visit')
      const t = setTimeout(() => toast({ title: 'Good to see you', body: 'Two leaves added to the tree.' }), 600)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skillActs = ACTIVITIES.filter((a) => a.skill === act.skill)
  const skillTotal = skillActs.length
  const skillDone = skillActs.filter((a) => s.done[a.id]).length
  const date = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <>
      <div className="screen with-tabbar home sky">
        {/* the whole screen is sky; a few pale clouds drift far behind everything */}
        <div className="hs-sky" aria-hidden>
          <svg className="hs-clouds" viewBox="0 0 375 900" preserveAspectRatio="xMidYMin slice">
            <path className="cloud c1" d={CLOUD} fill="#fff" opacity="0.55" transform="translate(-20 18) scale(1.4)" />
            <path className="cloud c2" d={CLOUD} fill="#fff" opacity="0.45" transform="translate(250 150) scale(1.1)" />
            <path className="cloud c3" d={CLOUD} fill="#fff" opacity="0.4" transform="translate(-30 520) scale(1.2)" />
            <path className="cloud c2" d={CLOUD} fill="#fff" opacity="0.35" transform="translate(240 760) scale(1.3)" />
          </svg>
        </div>

        {/* the greeting floats in the sky, just above today's activity */}
        <header className="hs-head">
          <span className="hs-avatar" aria-hidden>
            {(s.parentName || 'Y')[0].toUpperCase()}
          </span>
          <div className="hs-hello">
            <h1>Hello, {s.parentName || 'friend'}</h1>
            <p>{date}</p>
          </div>
          <ChildSwitcher />
        </header>

        {/* four segments in one stack: today, the tree, Mira's follow-up, read and watch */}
        <div className="hs-stack">
          {/* the whole segment opens today's activity; the Start button says so */}
          <section className="hs-block hs-today" aria-label={`Today’s activity: ${act.title}, ${act.minutes} minutes`}>
            <Head>
              Today’s activity
            </Head>
            {/* what it is */}
            <span className="hs-today-main">
              {/* the skill's growing pot from Grow: it fills in as this skill's activities get done */}
              <span className="hs-skill" aria-hidden>
                <Pot done={skillDone} total={skillTotal} tone={LEAF_TONES[act.skill]} />
              </span>
              <span className="hs-today-copy">
                <b>{act.title}</b>
                <small>Builds {SKILLS[act.skill].name.toLowerCase()} skills</small>
              </span>
            </span>
            {/* how long, what it earns, and the one action */}
            <span className="hs-today-foot">
              <span className="hs-meta">
                <span>
                  <Icon name="clock" size={14} /> {act.minutes} min
                </span>
                <span>
                  <Leaf size={14} color="#fff" /> +3 leaves
                </span>
              </span>
              {done ? (
                // done today: a tick alone, no extra words
                <button className="hs-tick" onClick={() => nav(`/activity/${act.id}`)} aria-label="Done today. Open the activity again">
                  <Icon name="check" size={22} stroke={2.8} />
                </button>
              ) : (
                <button className="hs-cta" onClick={() => nav(`/activity/${act.id}`)}>
                  <span className="hs-cta-text">Start</span> <Icon name="arrow" size={16} stroke={2.4} />
                </button>
              )}
            </span>
          </section>

          <section className="hs-block hs-tree">
            <TreeCard
              bare
              head={
                <Head>
                  {child.name}’s tree
                </Head>
              }
              action={
                <button className="hs-cta ghost" onClick={() => nav('/grow')}>
                  <Leaf size={15} color="currentColor" /> Grow leaves
                </button>
              }
            />
          </section>

          <OpenTaskCard />

          <WatchSegment
            childName={child.name}
            head={
              <Head>
                Watch
              </Head>
            }
          />
          <ReadSegment head={<Head>Read</Head>} />
        </div>
      </div>
      <TabBar />
    </>
  )
}


/** A segment heading, top-left, the same in every segment. */
function Head({ children }: { children: ReactNode }) {
  return (
    <span className="hs-headline">
      <span className="hs-label">{children}</span>
    </span>
  )
}

