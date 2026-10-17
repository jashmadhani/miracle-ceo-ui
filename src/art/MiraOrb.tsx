import './mira.css'

export type MiraState = 'idle' | 'attentive' | 'listening' | 'thinking'

/**
 * Mira's presence: a soft pearl, not a rainbow. It barely breathes when idle and
 * becomes clearly alive when the parent engages — rings open up while listening,
 * a slow light circles it while thinking.
 */
export function MiraOrb({ state = 'idle', size = 96 }: { state?: MiraState; size?: number }) {
  return (
    <span className={`mira mira-${state}`} style={{ width: size, height: size }} aria-hidden>
      <span className="mira-ring r1" />
      <span className="mira-ring r2" />
      <span className="mira-ring r3" />
      <span className="mira-core">
        <span className="mira-shine" />
      </span>
      <span className="mira-orbit">
        <i />
      </span>
    </span>
  )
}

const LABEL: Record<MiraState, string> = {
  idle: 'Mira',
  attentive: 'Mira is here',
  listening: 'Mira is listening…',
  thinking: 'Mira is thinking…',
}

/** Small presence chip shown while the parent is interacting with Mira. */
export function MiraPresence({ state }: { state: MiraState }) {
  return (
    <span className={`mira-presence ${state !== 'idle' ? 'on' : ''}`} role="status" aria-live="polite">
      <MiraOrb state={state} size={30} />
      <span>{LABEL[state]}</span>
    </span>
  )
}
