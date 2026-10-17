import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddChildSheet, BackBar, Sheet, TabBar } from '../components/Shell'
import { Icon } from '../components/Icon'
import { useChild, useStore } from '../state/store'
import './profile.css'

export function Settings() {
  const nav = useNavigate()
  const { s, set, reset } = useStore()
  const child = useChild()
  const [adding, setAdding] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [notif, setNotif] = useState(true)

  return (
    <>
      <div className="screen with-tabbar profile">
        <BackBar to="/journey" label="Journey" />
        <div className="pad">
          <h1 className="display" style={{ fontSize: 38, marginBottom: 18 }}>
            Settings
          </h1>

          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className="avatar" style={{ width: 52, height: 52, fontSize: 22 }}>
              {(s.parentName || 'Y')[0].toUpperCase()}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block', fontSize: 18 }}>{s.parentName || 'You'}</b>
              <span className="muted" style={{ fontSize: 14 }}>
                {s.email || 'Personal account'} · {s.access === 'school' ? 'School access' : 'Free trial'}
              </span>
            </span>
          </div>

          <p className="eyebrow" style={{ margin: '26px 0 10px 4px' }}>
            Children
          </p>
          <div className="card">
            <button className="row" onClick={() => nav('/journey/child')}>
              <span className="avatar">{child.initial}</span>
              <span>
                <span className="r-title" style={{ display: 'block' }}>
                  {child.name}
                </span>
                <span className="r-sub">{child.age.label}</span>
              </span>
              <Icon name="chev" size={18} className="chev" />
            </button>
            <button className="row" onClick={() => setAdding(true)}>
              <span className="avatar add">
                <Icon name="plus" size={18} />
              </span>
              <span>
                <span className="r-title" style={{ display: 'block' }}>
                  Add a child
                </span>
                <span className="r-sub">Their own tree, activities and answers</span>
              </span>
              <Icon name="chev" size={18} className="chev" />
            </button>
          </div>

          <p className="eyebrow" style={{ margin: '26px 0 10px 4px' }}>
            Preferences
          </p>
          <div className="card">
            <button className="row" onClick={() => setNotif((v) => !v)} role="switch" aria-checked={notif}>
              <span className="r-icon" style={{ background: 'var(--sand)' }}>
                <Icon name="clock" size={20} />
              </span>
              <span>
                <span className="r-title" style={{ display: 'block' }}>
                  Daily reminder
                </span>
                <span className="r-sub">A gentle nudge at 6 pm</span>
              </span>
              <span className={`switch ${notif ? 'on' : ''}`} />
            </button>
            <div className="row">
              <span className="r-icon" style={{ background: 'var(--sand)' }}>
                <Icon name="lock" size={20} />
              </span>
              <span>
                <span className="r-title" style={{ display: 'block' }}>
                  Privacy
                </span>
                <span className="r-sub">Your chats with Mira are never shared.</span>
              </span>
            </div>
          </div>

          <button
            className="btn ghost block"
            style={{ marginTop: 26 }}
            onClick={() => {
              set({ signedIn: false })
              nav('/sign-in')
            }}
          >
            Sign out
          </button>
          <p className="muted" style={{ fontSize: 13, textAlign: 'center', margin: '8px 0 26px' }}>
            Signing out keeps everything. {child.name}’s tree will be right where you left it.
          </p>

          <div className="danger">
            <b>Delete account</b>
            <p className="muted" style={{ fontSize: 14, margin: '4px 0 12px' }}>
              Removes your account and everything in it — {child.name}’s profile, the forest, every answer and note. This can’t be undone.
            </p>
            <button className="link-btn" style={{ color: 'var(--coral-2)', padding: 0 }} onClick={() => setConfirm(true)}>
              Delete my account…
            </button>
          </div>

          <p className="muted" style={{ fontSize: 12, textAlign: 'center', margin: '22px 0 8px' }}>
            Illustrations by{' '}
            <a href="https://storyset.com/people" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
              Storyset
            </a>
          </p>
        </div>
      </div>
      <TabBar />
      {adding && <AddChildSheet onClose={() => setAdding(false)} />}
      {confirm && (
        <Sheet onClose={() => setConfirm(false)} label="Delete account">
          <h2 className="display" style={{ fontSize: 28 }}>
            Delete everything?
          </h2>
          <p className="muted" style={{ margin: '8px 0 20px' }}>
            {child.name}’s forest and all {s.leaves} leaves will be gone for good.
          </p>
          <button
            className="btn block"
            style={{ background: 'var(--coral-2)', boxShadow: 'none' }}
            onClick={() => {
              reset()
              nav('/sign-in')
            }}
          >
            Yes, delete my account
          </button>
          <button className="btn ghost block" style={{ marginTop: 10 }} onClick={() => setConfirm(false)}>
            Keep it
          </button>
        </Sheet>
      )}
    </>
  )
}
