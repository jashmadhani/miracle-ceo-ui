import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivityArt, Leaf, SpotBook, SpotHeadphones } from '../art/ActivityArt'
import { Tree } from '../art/Tree'
import { Scene } from '../art/Scene'
import { Icon } from './Icon'
import { Overlay, Sheet } from './Shell'
import { ACTIVITIES, READS, SKILLS, VIDEOS, type Activity } from '../data/content'
import { LEAVES_PER_TREE, leafEvents, today, useChild, useStore } from '../state/store'
import './cards.css'

export function useToday(): { act: Activity; done: boolean } {
  const { s } = useStore()
  const act = ACTIVITIES.find((a) => a.id === s.todayId) ?? ACTIVITIES[0]
  const doneAt = s.done[act.id]
  return { act, done: !!doneAt && new Date(doneAt).toISOString().slice(0, 10) === today() }
}

/** The big illustrated "today's activity" card — most of it is art, one obvious action. */
export function TodayHero({ act, done, compact }: { act: Activity; done: boolean; compact?: boolean }) {
  const nav = useNavigate()
  const sk = SKILLS[act.skill]
  return (
    <button className={`today-hero sk-${act.skill} ${compact ? 'compact' : ''}`} onClick={() => nav(`/activity/${act.id}`)} aria-label={`${act.title}, ${act.minutes} minutes. ${done ? 'Done today' : 'Start together'}`}>
      <div className="today-art">
        <ActivityArt skill={act.skill} id={act.id} />
      </div>
      <div className="today-copy">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="pill">
            <Icon name={sk.icon} size={14} /> {sk.name}
          </span>
          <span className="pill">
            <Icon name="clock" size={14} /> {act.minutes} min
          </span>
          <span className="pill" style={{ background: 'var(--reward-soft)', color: 'var(--reward-deep)' }}>
            <Leaf size={14} /> +3
          </span>
        </div>
        <div className="today-row">
          <h3 className="display today-title">{act.title}</h3>
          <span className={`today-go ${done ? 'done' : ''}`}>{done ? <Icon name="check" size={26} stroke={2.6} /> : <Icon name="arrow" size={26} stroke={2.4} />}</span>
        </div>
        {done && <p className="today-done">Done today. Lovely work.</p>}
      </div>
    </button>
  )
}

/** Today's activity inside Home's coral block: big art, big title, one round action. */
export function TodayBlock({ act, done }: { act: Activity; done: boolean }) {
  const nav = useNavigate()
  const sk = SKILLS[act.skill]
  return (
    <button className="today-block" onClick={() => nav(`/activity/${act.id}`)} aria-label={`${act.title}, ${act.minutes} minutes. ${done ? 'Done today' : 'Start together'}`}>
      <p className="today-block-eyebrow">Today’s activity</p>
      <div className="today-block-art">
        <ActivityArt skill={act.skill} id={act.id} />
      </div>
      <div className="today-block-row">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="display today-block-title">{act.title}</h3>
          <div className="today-block-pills">
            <span className="pill">
              <Icon name="clock" size={14} /> {act.minutes} min
            </span>
            <span className="pill">
              <Leaf size={14} /> +3
            </span>
            <span className="pill">
              <Icon name={sk.icon} size={14} /> {act.skill} {sk.name.toLowerCase()}
            </span>
          </div>
        </div>
        <span className={`today-block-go ${done ? 'done' : ''}`}>{done ? <Icon name="check" size={28} stroke={2.6} /> : <Icon name="arrow" size={28} stroke={2.4} />}</span>
      </div>
      {done && <p className="today-block-done">Done today. Lovely work.</p>}
    </button>
  )
}

export function TreeCard({ bare }: { bare?: boolean }) {
  const { s, set } = useStore()
  const child = useChild()
  const [full, setFull] = useState(false)
  const inTree = s.leaves % LEAVES_PER_TREE
  const offset = s.leaves - inTree
  // leaves earned since the tree was last shown drop in with a glow, then count as seen
  const [newFrom] = useState(() => Math.max(0, s.seenLeaves - offset))
  const fresh = Math.max(0, inTree - newFrom)
  useEffect(() => {
    if (s.seenLeaves === s.leaves) return
    const t = setTimeout(() => set({ seenLeaves: s.leaves }), 2500)
    return () => clearTimeout(t)
  }, [s.leaves, s.seenLeaves, set])
  return (
    <>
      <div className={`tree-card ${bare ? 'bare' : ''}`}>
        <div className="tree-card-head">
          <div>
            <h2 className="display" style={{ fontSize: 24 }}>
              {child.name}’s tree
            </h2>
            <p className="muted" style={{ fontSize: 14 }}>
              growing with you
            </p>
          </div>
          <button className={`icon-btn ${bare ? 'flat' : ''}`} onClick={() => setFull(true)} aria-label="Open tree full screen">
            <Icon name="expand" size={20} />
          </button>
        </div>
        <button className="tree-card-art" onClick={() => setFull(true)} aria-label="Open tree">
          <Tree growth={0.35 + (inTree / LEAVES_PER_TREE) * 0.65} blossoms={inTree} newFrom={newFrom < inTree ? newFrom : undefined} />
          {fresh > 0 && (
            <span className="new-leaves">
              <Leaf size={14} color="var(--leaf)" /> +{fresh} new
            </span>
          )}
        </button>
        <div className="tree-card-foot">
          <Leaf size={18} color="var(--leaf)" />
          <b>{inTree}</b>
          <span className="muted">of {LEAVES_PER_TREE} leaves</span>
          <div className="progress" style={{ flex: 1, marginLeft: 8 }}>
            <i style={{ width: `${(inTree / LEAVES_PER_TREE) * 100}%`, background: 'var(--leaf)' }} />
          </div>
        </div>
      </div>
      {full && <TreeFull onClose={() => setFull(false)} />}
    </>
  )
}

export function TreeFull({ onClose }: { onClose: () => void }) {
  const { s } = useStore()
  const child = useChild()
  const inTree = s.leaves % LEAVES_PER_TREE
  const events = leafEvents(s.log).slice(s.leaves - inTree)
  const [sel, setSel] = useState<number | null>(null)
  const picked = sel != null ? events[sel] : null
  const recent = [...s.log].reverse().slice(0, 4)
  return (
    <Overlay>
    <div className="tree-full" role="dialog" aria-modal="true" aria-label={`${child.name}'s tree`}>
      <Scene mood="peach" hills={false} />
      <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 'calc(14px + var(--safe-top))', right: 16, zIndex: 3 }}>
        <Icon name="close" />
      </button>
      <div className="tree-full-art">
        <Tree growth={0.35 + (inTree / LEAVES_PER_TREE) * 0.65} blossoms={inTree} selected={sel} onLeaf={(i) => setSel(i === sel ? null : i)} />
      </div>
      <div className="tree-full-panel">
        {picked ? (
          <div className="leaf-pick" key={sel}>
            <span className="leaf-pick-ic">
              <Leaf size={22} color="var(--leaf)" />
            </span>
            <span style={{ flex: 1 }}>
              <span className="eyebrow">Leaf {sel! + 1} · {new Date(picked.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
              <b style={{ display: 'block', fontSize: 18, marginTop: 2 }}>{picked.label}</b>
              <span className="muted" style={{ fontSize: 14 }}>
                {picked.kind === 'activity' ? 'Something real you did together.' : picked.kind === 'mood' ? 'You checked in with yourself.' : 'You showed up.'}
              </span>
            </span>
            <button className="icon-btn flat" onClick={() => setSel(null)} aria-label="Close leaf">
              <Icon name="close" size={18} />
            </button>
          </div>
        ) : (
          <p className="muted" style={{ fontSize: 14, marginBottom: 10 }}>
            Tap a golden leaf to see the moment that grew it.
          </p>
        )}
        <p className="eyebrow">The Pine · growing now</p>
        <h2 className="display" style={{ fontSize: 30, margin: '4px 0 2px' }}>
          {inTree} of {LEAVES_PER_TREE} leaves
        </h2>
        <p className="muted">Every leaf is time you spent together.</p>
        <div className="leaf-log">
          {recent.map((e) => (
            <div key={e.at} className="leaf-log-row">
              <span className="leaf-log-ic">
                <Leaf size={16} color="var(--leaf)" />
              </span>
              <span style={{ flex: 1 }}>{e.label}</span>
              <b style={{ color: 'var(--teal)' }}>+{e.leaves}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Overlay>
  )
}

function ReadSheet({ r, onClose }: { r: (typeof READS)[number]; onClose: () => void }) {
  return (
    <Sheet onClose={onClose} label={r.title}>
      <div className="read-hero" style={{ background: 'var(--sec-amber-tile)' }}>
        {r.art === 'book' ? <SpotBook className="read-spot" /> : <SpotHeadphones className="read-spot" />}
      </div>
      <p className="eyebrow" style={{ marginTop: 18 }}>
        {r.kind} · {r.minutes} min
      </p>
      <h2 className="display" style={{ fontSize: 30, margin: '6px 0 12px' }}>
        {r.title}
      </h2>
      <p style={{ fontSize: 17, lineHeight: 1.55 }} className="muted">
        A short, practical {r.kind === 'Read' ? 'read' : 'listen'} written for this age. Full content will load from the library once the backend is connected.
      </p>
      <button className="btn block" style={{ marginTop: 22 }} onClick={onClose}>
        {r.kind === 'Read' ? 'Start reading' : 'Play'}
      </button>
    </Sheet>
  )
}

/** Home's amber block: a row of read / listen tiles, then where you left off. */
export function KnowingRow() {
  const [open, setOpen] = useState<(typeof READS)[number] | null>(null)
  const last = READS[1]
  return (
    <>
      <div className="know-row">
        {READS.map((r) => (
          <button key={r.id} className="know-tile" onClick={() => setOpen(r)}>
            <span className="pill">
              <Icon name={r.kind === 'Read' ? 'book' : 'play'} size={14} /> {r.kind}
            </span>
            <span className="know-title">{r.title}</span>
            <span className="know-meta">{r.minutes} min</span>
            <Icon name="arrow" size={20} className="know-arrow" />
          </button>
        ))}
      </div>
      <div className="know-continue">
        <span>{last.title}</span>
        <button className="btn ghost small" onClick={() => setOpen(last)}>
          Continue
        </button>
      </div>
      {open && <ReadSheet r={open} onClose={() => setOpen(null)} />}
    </>
  )
}

/** Bento grid of reads & listens — very little text in a lot of space. */
export function KnowingBento() {
  const [open, setOpen] = useState<(typeof READS)[number] | null>(null)
  const [a, b, c, d] = READS
  return (
    <>
      <div className="bento">
        <button className="tile wide" style={{ background: a.tint, minHeight: 172 }} onClick={() => setOpen(a)}>
          <span className="pill" style={{ alignSelf: 'flex-start' }}>
            <Icon name="book" size={14} /> {a.kind} · {a.minutes} min
          </span>
          <span className="tile-title" style={{ fontSize: 26, marginTop: 'auto', maxWidth: '60%' }}>
            {a.title}
          </span>
          <SpotBook className="tile-spot big" />
        </button>
        {[b, c].map((r) => (
          <button key={r.id} className="tile" style={{ background: r.tint, minHeight: 190 }} onClick={() => setOpen(r)}>
            {r.art === 'book' ? <SpotBook className="tile-spot" /> : <SpotHeadphones className="tile-spot" />}
            <span className="tile-title" style={{ marginTop: 'auto' }}>
              {r.title}
            </span>
            <span className="tile-meta">
              {r.kind} · {r.minutes} min
            </span>
          </button>
        ))}
        <button className="tile wide row-tile" style={{ background: d.tint }} onClick={() => setOpen(d)}>
          <span className="play-dot">
            <Icon name="play" size={18} />
          </span>
          <span>
            <span className="tile-title" style={{ display: 'block' }}>
              {d.title}
            </span>
            <span className="tile-meta">
              {d.kind} · {d.minutes} min
            </span>
          </span>
        </button>
      </div>
      {open && (
        <Sheet onClose={() => setOpen(null)} label={open.title}>
          <div className="read-hero" style={{ background: open.tint }}>
            {open.art === 'book' ? <SpotBook className="read-spot" /> : <SpotHeadphones className="read-spot" />}
          </div>
          <p className="eyebrow" style={{ marginTop: 18 }}>
            {open.kind} · {open.minutes} min
          </p>
          <h2 className="display" style={{ fontSize: 30, margin: '6px 0 12px' }}>
            {open.title}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55 }} className="muted">
            A short, practical {open.kind === 'Read' ? 'read' : 'listen'} written for this age. Full content will load from the library once the backend is connected.
          </p>
          <button className="btn block" style={{ marginTop: 22 }} onClick={() => setOpen(null)}>
            {open.kind === 'Read' ? 'Start reading' : 'Play'}
          </button>
        </Sheet>
      )}
    </>
  )
}

export function VideoList() {
  const { earn, toast } = useStore()
  const [open, setOpen] = useState<(typeof VIDEOS)[number] | null>(null)
  const [rated, setRated] = useState<string | null>(null)
  return (
    <>
      <div className="video-list">
        {VIDEOS.map((v) => (
          <button key={v.id} className="video-row" onClick={() => { setOpen(v); setRated(null) }}>
            <span className="video-thumb" style={{ background: v.tint }}>
              <span className="play-dot">
                <Icon name="play" size={16} />
              </span>
              <span className="video-time">{v.minutes} min</span>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="r-title" style={{ display: 'block', fontWeight: 650, lineHeight: 1.25 }}>
                {v.title}
              </span>
              <span className="muted" style={{ fontSize: 13 }}>
                {v.topic}
              </span>
            </span>
            <Icon name="chev" size={18} style={{ color: 'var(--ink-3)' }} />
          </button>
        ))}
      </div>
      {open && (
        <Sheet onClose={() => setOpen(null)} label={open.title}>
          <div className="video-player" style={{ background: open.tint }}>
            <span className="play-dot big">
              <Icon name="play" size={28} />
            </span>
          </div>
          <p className="eyebrow" style={{ marginTop: 18 }}>
            {open.topic} · {open.minutes} min
          </p>
          <h2 className="display" style={{ fontSize: 28, margin: '6px 0 10px' }}>
            {open.title}
          </h2>
          <p className="muted" style={{ lineHeight: 1.5 }}>
            {open.body}
          </p>
          <p style={{ fontWeight: 650, margin: '22px 0 10px' }}>Was it useful?</p>
          <div className="chips">
            {['Really useful', 'A little', 'Not for us right now'].map((r) => (
              <button
                key={r}
                className={`chip ${rated === r ? 'on' : ''}`}
                onClick={() => {
                  if (!rated) {
                    earn(1, `Watched “${open.title}”`, 'activity')
                    toast({ title: '+1 leaf', body: 'Thanks for telling us.' })
                  }
                  setRated(r)
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
