import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ACTIVITIES, type Skill } from '../data/content'
import type { Mood } from '../art/MoodFace'

export type Role = 'mom' | 'dad' | 'guardian' | ''
export type Gender = 'girl' | 'boy' | 'unsaid' | ''

export type LogEvent = { at: number; label: string; kind: 'visit' | 'activity' | 'mood' | 'challenge'; skill?: Skill; leaves: number }

export type State = {
  signedIn: boolean
  email: string
  onboarded: boolean
  parentName: string
  role: Role
  access: 'school' | 'trial' | null
  child: { name: string; dob: string; gender: Gender }
  firstChild: string | null
  grow: string[]
  hard: string[]
  tried: string[]
  extra: string[]
  time: string | null
  leaves: number
  /** leaves already shown on the tree; anything above this animates in as new */
  seenLeaves: number
  log: LogEvent[]
  done: Record<string, number>
  todayId: string
  moodDay: string | null
  mood: Mood | null
  visitDay: string | null
  challenge: { id: string; moves: number } | null
  chats: { at: number; q: string }[]
  saved: string[]
}

const INITIAL: State = {
  signedIn: false,
  email: '',
  onboarded: false,
  parentName: '',
  role: '',
  access: null,
  child: { name: '', dob: '', gender: '' },
  firstChild: null,
  grow: [],
  hard: [],
  tried: [],
  extra: [],
  time: null,
  leaves: 0,
  seenLeaves: 0,
  log: [],
  done: {},
  todayId: ACTIVITIES[0].id,
  moodDay: null,
  mood: null,
  visitDay: null,
  challenge: null,
  chats: [],
  saved: [],
}

const KEY = 'mceo-redesign-v1'

// `?demo` skips sign-in and onboarding with a ready-made profile, for design reviews.
const DEMO: Partial<State> = {
  signedIn: true,
  onboarded: true,
  email: 'josh@test.local',
  parentName: 'Josh',
  role: 'dad',
  access: 'trial',
  child: { name: 'Test Kid', dob: '2020-01-01', gender: 'boy' },
  firstChild: 'Yes, my first',
  grow: ['Making friends', 'Naming feelings'],
  hard: ['Settling at bedtime'],
  time: '5–10 min',
  leaves: 2,
  log: [{ at: Date.now() - 60000, label: 'Planted your tree', kind: 'visit', leaves: 2 }],
}

function load(): State {
  try {
    if (new URLSearchParams(location.search).has('demo')) return { ...INITIAL, ...DEMO }
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...INITIAL, ...JSON.parse(raw) }
  } catch {
    /* private mode — start fresh */
  }
  return INITIAL
}

export const today = () => new Date().toISOString().slice(0, 10)

type Ctx = {
  s: State
  set: (patch: Partial<State> | ((s: State) => Partial<State>)) => void
  earn: (leaves: number, label: string, kind: LogEvent['kind'], skill?: Skill) => void
  reset: () => void
  toast: (t: { title: string; body: string } | null) => void
  toastMsg: { title: string; body: string; key: number } | null
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(load)
  const [toastMsg, setToast] = useState<Ctx['toastMsg']>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {
      /* ignore */
    }
  }, [s])

  const set = useCallback<Ctx['set']>((patch) => setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })), [])

  const earn = useCallback<Ctx['earn']>((leaves, label, kind, skill) => {
    setS((prev) => ({ ...prev, leaves: prev.leaves + leaves, log: [...prev.log, { at: Date.now(), label, kind, skill, leaves }] }))
  }, [])

  const toast = useCallback<Ctx['toast']>((t) => setToast(t ? { ...t, key: Date.now() } : null), [])
  const reset = useCallback(() => setS(INITIAL), [])

  const value = useMemo(() => ({ s, set, earn, reset, toast, toastMsg }), [s, set, earn, reset, toast, toastMsg])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}

/** Child-facing helpers. Always use the full name — never split it (bug in the old app). */
export function useChild() {
  const { s } = useStore()
  const name = s.child.name || 'your child'
  const g = s.child.gender
  const pro = g === 'boy' ? { he: 'he', him: 'him', his: 'his', He: 'He' } : g === 'girl' ? { he: 'she', him: 'her', his: 'her', He: 'She' } : { he: 'they', him: 'them', his: 'their', He: 'They' }
  return { name, initial: (s.child.name || '?')[0].toUpperCase(), age: ageOf(s.child.dob), ...pro }
}

export function ageOf(dob: string) {
  if (!dob) return { years: 0, months: 0, label: '' }
  const d = new Date(dob)
  const now = new Date()
  let months = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth()
  if (now.getDate() < d.getDate()) months--
  const years = Math.floor(months / 12)
  return { years, months: months % 12, label: years > 0 ? `${years} year${years === 1 ? '' : 's'}` : `${months} months` }
}

export const LEAVES_PER_TREE = 50

/** One entry per earned leaf, in order — so a tapped leaf can say which moment grew it. */
export function leafEvents(log: LogEvent[]) {
  return log.flatMap((e) => Array.from({ length: e.leaves }, () => e))
}
