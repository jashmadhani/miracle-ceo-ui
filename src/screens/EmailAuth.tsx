import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Scene, SKIES } from '../art/Scene'
import { useEdge } from '../components/edge'
import { Tree } from '../art/Tree'
import { Brand } from '../components/Shell'
import { Icon } from '../components/Icon'
import { useStore } from '../state/store'

/** Branded replacement for the Cognito hosted page. Mock: any email/password signs in. */
export function EmailAuth() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const { s, set } = useStore()
  const mode = params.get('mode') === 'login' ? 'login' : 'signup'
  useEdge(SKIES.dawn[0])
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const valid = /.+@.+\..+/.test(email) && pw.length >= 6

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    set({ signedIn: true, email })
    nav(mode === 'login' && s.onboarded ? '/home' : '/onboarding')
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '34%', minHeight: 220, flex: 'none' }}>
        <Scene mood="dawn" />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center' }}>
          <Tree growth={0.55} className="auth-tree" />
        </div>
        <div className="topbar" style={{ position: 'relative' }}>
          <button className="icon-btn flat" onClick={() => nav('/sign-in')} aria-label="Back">
            <Icon name="back" />
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <Brand />
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="pad auth-card rise">
        <h1 className="display" style={{ fontSize: 34 }}>
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="muted" style={{ margin: '8px 0 24px' }}>
          {mode === 'signup' ? 'Takes a minute. Your child’s details stay private.' : 'Your tree is right where you left it.'}
        </p>

        <label className="label" htmlFor="email">
          Email
        </label>
        <input id="email" className="field" type="email" autoComplete="email" inputMode="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="label" htmlFor="pw" style={{ marginTop: 16 }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="pw"
            className="field"
            type={show ? 'text' : 'password'}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{ paddingRight: 70 }}
          />
          <button type="button" className="link-btn" style={{ position: 'absolute', right: 12, top: 9 }} onClick={() => setShow((v) => !v)}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {mode === 'login' && (
          <button type="button" className="link-btn" style={{ marginTop: 4 }}>
            Forgot password?
          </button>
        )}

        <button className="btn block" style={{ marginTop: 24 }} disabled={!valid}>
          {mode === 'signup' ? 'Create account' : 'Log in'}
        </button>

        <div className="or">or</div>
        <button
          type="button"
          className="btn light block"
          onClick={() => {
            set({ signedIn: true, email: 'you@gmail.com' })
            nav(s.onboarded ? '/home' : '/onboarding')
          }}
        >
          <Icon name="google" size={20} /> Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--ink-2)' }}>
          {mode === 'signup' ? 'Already with us? ' : 'New here? '}
          <button type="button" className="link-btn" onClick={() => setParams({ mode: mode === 'signup' ? 'login' : 'signup' })}>
            {mode === 'signup' ? 'Log in' : 'Create an account'}
          </button>
        </p>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)', margin: '8px 0 32px' }}>
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </div>
  )
}
