import { useRef, useState, type ReactNode } from 'react'
import { SpotBook, SpotHeadphones } from '../art/ActivityArt'
import POSTER from '../art/illustrations/videos/poster-1.webp'
import { Icon } from './Icon'
import { ReadSheet, VideoSheet } from './Cards'
import { READS, VIDEOS } from '../data/content'

/*
 * Home's Watch and Read segments. Each is a rail you scroll with your thumb:
 * cards snap into place and the next one peeks in from the right. The arrows
 * in the heading row are a fallback for anyone who would rather tap.
 */

function Rail({ head, label, count, className, children }: { head: ReactNode; label: string; count: number; className: string; children: ReactNode }) {
  const rail = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const step = () => {
    const el = rail.current
    const card = el?.firstElementChild as HTMLElement | null
    return card ? card.offsetWidth + 16 : 0
  }
  const go = (d: number) => rail.current?.scrollBy({ left: d * step(), behavior: 'smooth' })
  return (
    <section className={`hs-block hm ${className}`} aria-label={label}>
      <div className="hm-headrow">
        {head}
        <div className="hm-nav">
          <button className="hm-arrow" onClick={() => go(-1)} aria-label="Previous" disabled={i === 0}>
            <Icon name="back" size={18} />
          </button>
          <span className="hm-dots" aria-hidden>
            {Array.from({ length: count }, (_, k) => (
              <i key={k} className={k === i ? 'on' : ''} />
            ))}
          </span>
          <button className="hm-arrow" onClick={() => go(1)} aria-label="Next" disabled={i === count - 1}>
            <Icon name="chev" size={18} />
          </button>
        </div>
      </div>
      <div
        ref={rail}
        className="hm-rail"
        onScroll={(e) => {
          const s = step()
          if (s) setI(Math.min(count - 1, Math.round(e.currentTarget.scrollLeft / s)))
        }}
      >
        {children}
      </div>
    </section>
  )
}

export function WatchSegment({ childName, head }: { childName: string; head: ReactNode }) {
  const [open, setOpen] = useState<(typeof VIDEOS)[number] | null>(null)
  return (
    <>
      {/* one video per slide: swipe for the next, arrows as a fallback */}
      <Rail head={head} label={`Watch: get to know ${childName}`} count={VIDEOS.length} className="hm-watch">
        {VIDEOS.map((v) => (
          <div key={v.id} className="hm-watchslide">
            {/* a still from the video; it carries its own play button, so we don't add a second one */}
            <button className="hm-preview tall" onClick={() => setOpen(v)} aria-label={`Play ${v.title}, ${v.minutes} minutes`}>
              <img src={POSTER} alt="" draggable={false} decoding="async" />
              <span className="hm-time">{v.minutes} min</span>
            </button>
            <div className="hm-side">
              <b className="hm-title">{v.title}</b>
              <small className="hm-meta">{v.topic}</small>
              <button className="hs-cta ghost" onClick={() => setOpen(v)}>
                <Icon name="play" size={15} /> Play
              </button>
            </div>
          </div>
        ))}
      </Rail>
      {open && <VideoSheet v={open} onClose={() => setOpen(null)} />}
    </>
  )
}

export function ReadSegment({ head }: { head: ReactNode }) {
  const [open, setOpen] = useState<(typeof READS)[number] | null>(null)
  return (
    <>
      <Rail head={head} label="Read: things worth knowing" count={READS.length} className="hm-read">
        {READS.map((r) => {
          const listen = r.kind !== 'Read'
          return (
            <div key={r.id} className="hm-card-r">
              <span className="hm-thumb">{listen ? <SpotHeadphones className="hm-spot" /> : <SpotBook className="hm-spot" />}</span>
              <span className="hm-readcopy">
                <b className="hm-title">{r.title}</b>
                <small className="hm-meta">
                  {r.minutes} min {listen ? 'listen' : 'read'}
                </small>
                <button className="hs-cta ghost" onClick={() => setOpen(r)}>
                  <Icon name={listen ? 'play' : 'book'} size={15} /> {listen ? 'Listen' : 'Read'}
                </button>
              </span>
            </div>
          )
        })}
      </Rail>
      {open && <ReadSheet r={open} onClose={() => setOpen(null)} />}
    </>
  )
}
