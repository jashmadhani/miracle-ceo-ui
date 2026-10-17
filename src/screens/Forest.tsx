import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useEdge } from '../components/edge'
import { Sheet } from '../components/Shell'
import { Tree } from '../art/Tree'
import { Leaf } from '../art/ActivityArt'
import { scallop } from '../art/shapes'
import { TREES } from '../data/content'
import { LEAVES_PER_TREE, useChild, useStore } from '../state/store'
import './journey.css'

const GAP = 190
const W = 390

const pathX = (i: number) => W / 2 + 70 * Math.sin(i * 1.05)

/** Walk-through forest: one tree per 50 leaves, a winding path, future trees waiting as soft silhouettes. */
export function Forest() {
  const nav = useNavigate()
  const { s } = useStore()
  const child = useChild()
  useEdge('#cfe8b6', false, '#cfe8b6')
  const [detail, setDetail] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const H = 360 + TREES.length * GAP
  const current = Math.floor(s.leaves / LEAVES_PER_TREE)
  const inTree = s.leaves % LEAVES_PER_TREE
  const yAt = (i: number) => H - 230 - i * GAP

  // fly in from the far end of the forest down to "you are here"
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTop = 0
    let raf = 0
    const t = setTimeout(() => {
      const from = 0
      const to = el.scrollHeight - el.clientHeight
      const start = performance.now()
      const dur = 2400
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / dur)
        const e = 1 - Math.pow(1 - k, 3)
        el.scrollTop = from + (to - from) * e
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, 300)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [])

  // path through all spots
  let d = `M${pathX(-1)} ${H}`
  for (let i = 0; i <= TREES.length; i++) {
    const x0 = pathX(i - 1)
    const y0 = yAt(i - 1)
    const x1 = pathX(i)
    const y1 = yAt(i)
    d += ` C${x0} ${y0 - GAP / 2} ${x1} ${y1 + GAP / 2} ${x1} ${y1}`
  }

  return (
    <div className="screen forest" ref={scroller}>
      <div className="forest-top">
        <button className="icon-btn" onClick={() => nav('/journey')} aria-label="Back">
          <Icon name="back" />
        </button>
        <div>
          <h1 className="display" style={{ fontSize: 22 }}>
            {child.name}’s forest
          </h1>
          <p className="muted" style={{ fontSize: 13 }}>
            {TREES[current]} · {inTree}/{LEAVES_PER_TREE} leaves
          </p>
        </div>
      </div>

      <div className="forest-map" style={{ height: H }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: H }} aria-hidden>
          <defs>
            <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff1d4" />
              <stop offset="0.12" stopColor="#cfe8b6" />
              <stop offset="1" stopColor="#b9dd98" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#meadow)" />
          {/* distant hills at the far end */}
          <path d={`M0 160 C80 110 160 130 220 150 C290 172 340 120 ${W} 130 L${W} 260 L0 260Z`} fill="#e6f3cf" opacity="0.8" />
          {/* scattered bushes */}
          {[...Array(Math.floor(H / 120))].map((_, i) => {
            const x = i % 2 ? 30 + ((i * 37) % 60) : W - 40 - ((i * 53) % 60)
            const y = 300 + i * 118
            return <path key={i} d={scallop(x, y, 18, 7, i + 3)} fill={i % 3 ? '#8fc93f' : '#62a32a'} />
          })}
          {/* pond */}
          <ellipse cx={W - 90} cy={H - 120} rx="62" ry="22" fill="#9cc9c0" />
          <ellipse cx={W - 98} cy={H - 124} rx="40" ry="10" fill="#d4ece7" />
          {/* path */}
          <path d={d} stroke="#ffe0a3" strokeWidth="34" fill="none" strokeLinecap="round" />
          <path d={d} stroke="#fff1d4" strokeWidth="22" fill="none" strokeLinecap="round" strokeDasharray="2 14" />
        </svg>

        <span className="day-flag" style={{ left: pathX(-1) + 40, top: H - 60 }}>
          DAY ONE
        </span>

        {TREES.map((name, i) => {
          const side = i % 2 ? -1 : 1
          const x = Math.max(78, Math.min(W - 78, pathX(i) + side * 92))
          const y = yAt(i)
          const isCur = i === current
          const done = i < current
          return (
            <button
              key={name}
              className={`spot ${isCur ? 'current' : ''} ${!isCur && !done ? 'locked' : ''}`}
              style={{ left: `${(x / W) * 100}%`, top: y }}
              onClick={() => isCur && setDetail(true)}
              aria-label={isCur ? `${name}, growing now` : done ? `${name}, fully grown` : `${name}, grows after ${(i + 1) * LEAVES_PER_TREE} leaves`}
            >
              <span style={{ width: isCur ? 150 : 104, height: isCur ? 160 : 112, filter: !isCur && !done ? 'grayscale(.8) brightness(1.15) opacity(.7)' : undefined }}>
                <Tree growth={isCur ? 0.35 + (inTree / LEAVES_PER_TREE) * 0.65 : 1} blossoms={isCur ? inTree : 0} sway={isCur} />
              </span>
              <span className="spot-label">{isCur ? `${name} · growing` : done ? name : <>
                <Icon name="lock" size={10} style={{ display: 'inline', verticalAlign: '-1px' }} /> {name}
              </>}</span>
            </button>
          )
        })}

        <div className="you-here" style={{ left: `${(pathX(current) / W) * 100}%`, top: yAt(current) + 10 }}>
          <span className="pill dark" style={{ marginBottom: 6 }}>
            You are here
          </span>
          <span className="pin">
            <span>{child.initial}</span>
          </span>
        </div>
      </div>

      {detail && (
        <Sheet onClose={() => setDetail(false)} label="The Pine">
          <div className="tree-detail-hero">
            <Tree growth={0.35 + (inTree / LEAVES_PER_TREE) * 0.65} blossoms={inTree} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <h2 className="display" style={{ fontSize: 30 }}>
              The {TREES[current]}
            </h2>
            <span className="pill" style={{ background: 'var(--blush)' }}>
              {inTree} of {LEAVES_PER_TREE}
            </span>
          </div>
          <p className="muted">{LEAVES_PER_TREE - inTree} more leaves and it’s fully grown.</p>
          <div className="bento" style={{ marginTop: 16 }}>
            <div className="tile" style={{ background: 'var(--butter)', minHeight: 0 }}>
              <span className="eyebrow">Did you know?</span>
              <span style={{ marginTop: 8, fontWeight: 560 }}>Pine needles stay green through snowy winters.</span>
            </div>
            <div className="tile" style={{ background: 'var(--primary-soft)', color: 'var(--teal-2)', minHeight: 0 }}>
              <span className="eyebrow" style={{ color: 'var(--teal)' }}>
                It teaches
              </span>
              <span className="tile-title" style={{ marginTop: 8 }}>
                Steadiness
              </span>
              <span style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>The same calm presence, every season.</span>
            </div>
          </div>
          <p className="fb-q" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, margin: '22px 0 10px' }}>
            The leaves so far
          </p>
          <div className="leaf-grid">
            {[...Array(LEAVES_PER_TREE)].map((_, i) => (
              <span key={i} className={i < inTree ? 'on' : ''}>
                <Leaf size={18} color={i < inTree ? 'var(--leaf)' : '#e6dfd4'} />
              </span>
            ))}
          </div>
          <p className="fb-q" style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 20, margin: '22px 0 10px' }}>
            What’s growing it
          </p>
          <div className="card">
            {[...s.log].reverse().map((e) => (
              <div key={e.at} className="row">
                <span className="r-icon" style={{ background: 'var(--reward-soft)' }}>
                  <Leaf size={18} />
                </span>
                <span style={{ flex: 1 }}>
                  <span className="r-title" style={{ display: 'block' }}>
                    {e.label}
                  </span>
                  <span className="r-sub">{new Date(e.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                </span>
                <b style={{ color: 'var(--teal)' }}>+{e.leaves}</b>
              </div>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  )
}
