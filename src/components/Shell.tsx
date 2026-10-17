import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import { useChild, useStore } from '../state/store'

export function TabBar() {
  const tabs = [
    ['/home', 'home', 'Home'],
    ['/solve', 'solve', 'Ask Mira'],
    ['/grow', 'grow', 'Grow'],
    ['/journey', 'journey', 'Journey'],
  ] as const
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(([to, icon, label]) => (
        <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon name={icon} size={24} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Overlays render at the app frame, not inside a scrolled screen (where absolute bottom:0 is off-view). */
export function Overlay({ children }: { children: ReactNode }) {
  const host = document.querySelector('.app')
  return host ? createPortal(children, host) : <>{children}</>
}

export function Sheet({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <Overlay>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label}>
        <div className="grabber" />
        {children}
      </div>
    </Overlay>
  )
}

export function BackBar({ to, label, right }: { to?: string; label: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="topbar">
      <button className="back" onClick={() => (to ? nav(to) : nav(-1))}>
        <Icon name="back" size={20} />
        {label}
      </button>
      <div style={{ marginLeft: 'auto' }}>{right}</div>
    </div>
  )
}

export function Brand({ light }: { light?: boolean }) {
  return (
    <div className="brand" style={{ color: light ? 'var(--on-dark)' : 'var(--ink)' }}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
        <circle cx="16" cy="16" r="16" fill="#fffdf8" />
        <path d="M16 26v-9" stroke="#7a4518" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="11.5" cy="14" r="5" fill="#6aab17" />
        <circle cx="20.5" cy="14" r="5" fill="#98cd1b" />
        <circle cx="16" cy="9.5" r="5.5" fill="#6aab17" />
        <circle cx="14" cy="8.5" r="2" fill="#c4e620" />
      </svg>
      <span>Miracle CEO</span>
    </div>
  )
}

/** Child pill + dropdown. "Add another child" is never truncated (old bug). */
export function ChildSwitcher({ tone = 'light' }: { tone?: 'light' | 'glass' }) {
  const child = useChild()
  const [open, setOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button className={`child-pill ${tone}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`${child.name}, ${child.age.label}. Change or add a child`}>
        <span className="avatar">{child.initial}</span>
        <span style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <b>{child.name}</b>
          <small>{child.age.label}</small>
        </span>
        <Icon name="down" size={16} style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setOpen(false)} />
          <div className="menu" role="menu">
            <button className="menu-item on" role="menuitem" onClick={() => setOpen(false)}>
              <span className="avatar">{child.initial}</span>
              <span>
                <b>{child.name}</b>
                <small>{child.age.label}</small>
              </span>
              <Icon name="check" size={18} style={{ marginLeft: 'auto' }} />
            </button>
            <button
              className="menu-item"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                setAdding(true)
              }}
            >
              <span className="avatar add">
                <Icon name="plus" size={16} />
              </span>
              <b>Add a child</b>
            </button>
          </div>
        </>
      )}
      {adding && <AddChildSheet onClose={() => setAdding(false)} />}
    </div>
  )
}

export function AddChildSheet({ onClose }: { onClose: () => void }) {
  const { toast } = useStore()
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  return (
    <Sheet onClose={onClose} label="Add a child">
      <p className="eyebrow">Your family</p>
      <h2 className="display" style={{ fontSize: 30, margin: '6px 0 6px' }}>
        Add a child
      </h2>
      <p className="muted" style={{ marginBottom: 22 }}>
        They get their own tree, activities and answers written for their age.
      </p>
      <label className="label" htmlFor="ac-name">
        Name
      </label>
      <input id="ac-name" className="field" placeholder="Their name" value={name} onChange={(e) => setName(e.target.value)} />
      <label className="label" htmlFor="ac-dob" style={{ marginTop: 16 }}>
        Birthday
      </label>
      <input id="ac-dob" className="field" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      <button
        className="btn block"
        style={{ marginTop: 24 }}
        disabled={!name || !dob}
        onClick={() => {
          onClose()
          toast({ title: `${name} is on the way`, body: 'Profiles for more children are coming soon.' })
        }}
      >
        Add {name || 'child'}
      </button>
    </Sheet>
  )
}
