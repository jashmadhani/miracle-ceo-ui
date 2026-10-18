import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scene, SKIES, type SceneMood } from '../art/Scene'
import { useEdge } from '../components/edge'
import { Illustration, type IllustrationName } from '../art/Illustration'
import { Brand } from '../components/Shell'
import { Icon } from '../components/Icon'
import { useStore } from '../state/store'
import './welcome.css'

const SLIDES: { title: string; sub: string; mood: SceneMood; art: IllustrationName }[] = [
  { title: 'Five calm minutes a day, together.', sub: 'Small moments that help your child grow.', mood: 'dawn', art: 'sq-6' },
  { title: 'Ask anything. Mira listens first.', sub: 'Bedtime, siblings, big feelings. Any hour, big or small.', mood: 'peach', art: 'eq-6' },
  { title: 'Feelings, friendships and a curious mind.', sub: 'One little moment at a time.', mood: 'day', art: 'sq-2' },
]

/** Full-bleed art with the controls floating over a cream semicircle (meditation-centre reference). */
export function SignIn() {
  const nav = useNavigate()
  const { set } = useStore()
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), 5200)
    return () => clearTimeout(t)
  }, [i])

  const slide = SLIDES[i]
  useEdge(SKIES[slide.mood][0], false, '#fbf7f1')
  return (
    <div
      className="screen welcome"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 40) setI((n) => (n + (dx < 0 ? 1 : SLIDES.length - 1)) % SLIDES.length)
        touch.current = null
      }}
    >
      {SLIDES.map((sl, n) => (
        <div key={sl.mood} className="welcome-bg" style={{ opacity: n === i ? 1 : 0 }}>
          <Scene mood={sl.mood} />
        </div>
      ))}

      <header className="welcome-top">
        <Brand />
        <h1 key={`t${i}`} className="display welcome-title rise">
          {slide.title}
        </h1>
        <p key={`s${i}`} className="welcome-sub rise rise-1">
          {slide.sub}
        </p>
      </header>

      <div className="welcome-stage">
        <div key={`f${i}`} className="welcome-family">
          <Illustration name={slide.art} />
        </div>
        <div className="welcome-arc">
          <div className="dots" role="tablist" aria-label="Slides">
            {SLIDES.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} className={n === i ? 'on' : ''} onClick={() => setI(n)} />
            ))}
          </div>
          <button className="btn block" onClick={() => nav('/auth/email?mode=signup')}>
            Get started <Icon name="arrow" size={20} className="arrow" />
          </button>
          <button
            className="btn light block"
            style={{ marginTop: 10 }}
            onClick={() => {
              set({ signedIn: true, email: 'you@gmail.com' })
              nav('/onboarding')
            }}
          >
            <Icon name="google" size={20} /> Continue with Google
          </button>
          <p className="welcome-foot">
            Already with us?{' '}
            <button className="link-btn" onClick={() => nav('/auth/email?mode=login')}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
