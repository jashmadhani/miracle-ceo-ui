import { useEdge } from '../components/edge'
import { useState } from 'react'
import { MoodFace, MOODS, type Mood } from '../art/MoodFace'
import { useStore, today } from '../state/store'
import './mood.css'

/** Daily check-in: six soft faces instead of a slider (MindfulMe reference). */
export function MoodCheckin({ onDone }: { onDone: () => void }) {
  const { s, set, earn } = useStore()
  const [pick, setPick] = useState<Mood | null>(null)
  const [answered, setAnswered] = useState(false)
  const m = MOODS.find((x) => x.id === pick)
  useEdge('#fbf7f1', true, '#fbf7f1')

  return (
    <div className="mood" role="dialog" aria-modal="true" aria-label="How are you feeling?">
      <div className="mood-glow a" />
      <div className="mood-glow b" />
      <div className="mood-glow c" />
      {!answered ? (
        <div className="mood-inner">
          <p className="eyebrow">Hi {s.parentName || 'there'}</p>
          <h1 className="display mood-title">How are you feeling right now?</h1>
          <p className="muted">It’s okay to feel what you feel.</p>
          <div className="mood-grid">
            {MOODS.map((x, i) => (
              <button key={x.id} className={`mood-btn ${pick === x.id ? 'on' : ''}`} style={{ animationDelay: `${0.05 * i}s` }} onClick={() => setPick(x.id)} aria-pressed={pick === x.id}>
                <MoodFace mood={x.id} size={88} active={pick === x.id} />
                <span>{x.label}</span>
              </button>
            ))}
          </div>
          <button
            className="btn block"
            disabled={!pick}
            onClick={() => {
              set({ mood: pick, moodDay: today() })
              earn(1, 'Checked in with yourself', 'mood')
              setAnswered(true)
            }}
          >
            That’s how I feel
          </button>
          <button className="link-btn" style={{ alignSelf: 'center', color: 'var(--ink-2)' }} onClick={() => { set({ moodDay: today() }); onDone() }}>
            Skip for now
          </button>
        </div>
      ) : (
        <div className="mood-inner reply">
          <div className="reply-face">
            <MoodFace mood={pick!} size={150} active />
          </div>
          <h1 className="display mood-title rise">{m!.reply}</h1>
          <p className="muted rise rise-1" style={{ fontSize: 18 }}>
            {m!.sub}
          </p>
          <button className="btn block rise rise-2" style={{ marginTop: 'auto' }} onClick={onDone}>
            Let’s go
          </button>
        </div>
      )}
    </div>
  )
}
