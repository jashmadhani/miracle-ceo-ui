import { useState } from 'react'
import { Overlay } from './Shell'
import { Icon } from './Icon'
import { useStore } from '../state/store'
import './extras.css'

export const DAILY_CAP = 5
export type Kind = 'answer' | 'escalate' | 'refuse' | 'nomatch'

/** Design-demo routing: real triage lives on the server. These phrases let each state be reviewed. */
export function classify(q: string): Kind {
  if (/(hurt (myself|him|her|them)|kill|suicid|abus|hit (him|her|them)|unsafe|self.?harm)/i.test(q)) return 'escalate'
  if (/(stock|invest|politic|lawyer|custody|diagnos|medicine|dosage)/i.test(q)) return 'refuse'
  if (/(xyz|asdf|quantum|bitcoin|recipe)/i.test(q)) return 'nomatch'
  return 'answer'
}

export function QuotaNote({ children, full }: { children: string; full?: boolean }) {
  return (
    <p className={`x-quota ${full ? 'full' : ''}`} role="status">
      {children}
    </p>
  )
}

/** A calm, advice-free screen. The only job is to point to a person. */
export function Escalation() {
  const { toast } = useStore()
  return (
    <div className="x-esc rise" role="alert">
      <h3 className="display">I’m glad you told me.</h3>
      <p>This is bigger than a tip from me. Please talk to a person who can help right now.</p>
      <button className="btn" onClick={() => toast({ title: 'Reaching a person', body: 'In the live app this connects you to the Miracle CEO team.' })}>
        Talk to a person
      </button>
      <p className="x-esc-lines">
        If you or a child may be in danger, call your local emergency number. In the US you can call or text <b>988</b>, or call Childhelp at <b>1-800-422-4453</b>.
      </p>
    </div>
  )
}

export function Refusal() {
  return (
    <div className="x-note rise">
      <p>That one is outside what I can help with. I stay with parenting and your child’s growth, so a professional is the right person to ask.</p>
    </div>
  )
}

export function NoMatch({ onNew }: { onNew: () => void }) {
  return (
    <div className="x-note rise">
      <p>I don’t have anything written for this one yet.</p>
      <p className="muted" style={{ marginTop: 6 }}>
        Rather than guess, I’d like to leave it. Try asking it another way.
      </p>
      <button className="chip" style={{ marginTop: 10 }} onClick={onNew}>
        Ask something else
      </button>
    </div>
  )
}

/** Side drawer: past conversations and saved answers. */
export function ChatDrawer({ onClose, onOpen }: { onClose: () => void; onOpen: (q: string) => void }) {
  const { s } = useStore()
  const [tab, setTab] = useState<'chats' | 'saved'>('chats')
  return (
    <Overlay>
      <div className="scrim" onClick={onClose} />
      <aside className="x-drawer" role="dialog" aria-modal="true" aria-label="Past conversations">
        <div className="x-drawer-top">
          <h3 className="display">Conversations</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="segmented small" role="tablist">
          <span className="thumb" style={{ width: 'calc((100% - 10px) / 2)', transform: `translateX(${tab === 'chats' ? 0 : 100}%)` }} />
          <button role="tab" aria-selected={tab === 'chats'} className={tab === 'chats' ? 'on' : ''} onClick={() => setTab('chats')}>
            Conversations
          </button>
          <button role="tab" aria-selected={tab === 'saved'} className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}>
            Saved
          </button>
        </div>
        <div className="x-drawer-list">
          {tab === 'chats' &&
            (s.chats.length === 0 ? (
              <p className="muted">Nothing here yet. Ask Mira something and it will wait for you here.</p>
            ) : (
              s.chats.map((c) => (
                <button key={c.at} className="x-drawer-row" onClick={() => onOpen(c.q)}>
                  <span>{c.q}</span>
                  <small className="muted">{new Date(c.at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</small>
                </button>
              ))
            ))}
          {tab === 'saved' &&
            (s.saved.length === 0 ? (
              <p className="muted">Nothing saved yet. Tap “Save this” under an answer.</p>
            ) : (
              s.saved.map((t) => (
                <button key={t} className="x-drawer-row" onClick={() => onOpen(t)}>
                  <span>{t}</span>
                  <small className="muted">Saved answer</small>
                </button>
              ))
            ))}
        </div>
      </aside>
    </Overlay>
  )
}
