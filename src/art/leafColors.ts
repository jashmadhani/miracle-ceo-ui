import type { Skill } from '../data/content'
import { LEAVES_PER_TREE, leafEvents, useStore, type LogEvent } from '../state/store'

/*
 * Every earned leaf takes the colour of what grew it, so the tree shows the
 * mix of skills at a glance:
 *   EQ (feelings)   coral, as on the Emotional tile
 *   SQ (social)     green, as on the Social tile
 *   IQ (curiosity)  gold, as on the Intelligence tile
 *   anything else   warm terracotta: showing up, checking in, planting
 */
export type LeafTone = { fill: string; stroke: string }

export const LEAF_TONES: Record<Skill | 'other', LeafTone> = {
  EQ: { fill: '#ec6f7d', stroke: '#fff6f7' },
  SQ: { fill: '#3e8a80', stroke: '#f1faf8' },
  IQ: { fill: '#ffb937', stroke: '#fffaf0' },
  // showing up: a warm terracotta, so every earned leaf stands out from the green
  other: { fill: '#d9765a', stroke: '#fff4e8' },
}

export const LEAF_KEY: [Skill | 'other', string][] = [
  ['EQ', 'Emotional'],
  ['SQ', 'Social'],
  ['IQ', 'Intelligence'],
  ['other', 'Showing up'],
]

export function leafTone(e?: Pick<LogEvent, 'skill'> | null): LeafTone {
  return e?.skill ? LEAF_TONES[e.skill] : LEAF_TONES.other
}

/** The tone of each earned leaf on the tree that's growing now, oldest first. */
export function useTreeLeafTones(): LeafTone[] {
  const { s } = useStore()
  const inTree = s.leaves % LEAVES_PER_TREE
  const events = leafEvents(s.log)
  // the log can hold fewer entries than the leaf count (e.g. the demo profile); pad with "showing up"
  const mine = events.slice(Math.max(0, events.length - inTree))
  const pad = Array.from({ length: Math.max(0, inTree - mine.length) }, () => LEAF_TONES.other)
  return [...pad, ...mine.map((e) => leafTone(e))]
}
