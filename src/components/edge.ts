import { useEffect } from 'react'

/*
 * Safari (26+) colours the status-bar strip above the page with the page's
 * background colour. Screens whose top isn't the default cream call useEdge
 * with their own top colour so the app runs edge to edge instead of sitting in
 * a box. Safari takes the bottom tint from a fixed element at the bottom edge
 * (body::after in base.css). Overlays (mood check-in, voice diary) pass `overlay` so they win over
 * the screen underneath while they are open.
 */
type Entry = { color: string; bottom?: string; prio: number; seq: number }
const entries = new Set<Entry>()
let seq = 0

function apply() {
  let top: Entry | undefined
  for (const e of entries) if (!top || e.prio > top.prio || (e.prio === top.prio && e.seq > top.seq)) top = e
  const el = document.documentElement
  if (top) el.style.setProperty('--edge-top', top.color)
  else el.style.removeProperty('--edge-top')
  if (top?.bottom) el.style.setProperty('--edge-bottom', top.bottom)
  else el.style.removeProperty('--edge-bottom')
}

/** `top` tints the status bar; `bottom` (optional) tints the area under Safari's toolbar. */
export function useEdge(color: string | undefined, overlay = false, bottom?: string) {
  useEffect(() => {
    if (!color) return
    const e: Entry = { color, bottom, prio: overlay ? 1 : 0, seq: ++seq }
    entries.add(e)
    apply()
    return () => {
      entries.delete(e)
      apply()
    }
  }, [color, overlay, bottom])
}
