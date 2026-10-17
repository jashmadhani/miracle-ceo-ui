import './mira.css'

export type MiraState = 'idle' | 'attentive' | 'listening' | 'thinking'

/**
 * Mira is a friendly little microphone — soft lavender, a smiling face, a stand.
 * idle: bobs and blinks · attentive: looks up and brightens ·
 * listening: mouth opens, sound waves pulse out both sides · thinking: dots bounce above.
 */
export function MiraOrb({ state = 'idle', size = 96 }: { state?: MiraState; size?: number }) {
  const listening = state === 'listening'
  return (
    <span className={`mira mira-${state}`} style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <linearGradient id="mira-head" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#9d92f5" />
            <stop offset="1" stopColor="#6a5ae0" />
          </linearGradient>
        </defs>

        {/* sound waves (listening) */}
        <g className="mira-waves" fill="none" stroke="#9d92f5" strokeWidth="4" strokeLinecap="round">
          <path className="w1" d="M22 40 Q14 52 22 64" />
          <path className="w2" d="M12 32 Q0 52 12 72" />
          <path className="w1" d="M98 40 Q106 52 98 64" />
          <path className="w2" d="M108 32 Q120 52 108 72" />
        </g>

        {/* thinking dots */}
        <g className="mira-dots" fill="#6a5ae0">
          <circle cx="46" cy="8" r="4" />
          <circle cx="60" cy="8" r="4" />
          <circle cx="74" cy="8" r="4" />
        </g>

        <g className="mira-body">
          {/* stand */}
          <path d="M34 58 Q34 86 60 86 Q86 86 86 58" fill="none" stroke="#6a5ae0" strokeWidth="6" strokeLinecap="round" />
          <path d="M60 86 L60 100" stroke="#6a5ae0" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="60" cy="104" rx="18" ry="5" fill="#6a5ae0" />

          {/* head */}
          <rect x="38" y="16" width="44" height="62" rx="22" fill="url(#mira-head)" />
          <path d="M44 30 h32 M44 37 h32" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="49" cy="25" rx="5" ry="3.5" fill="#ffffff" opacity="0.6" />

          {/* face */}
          <g className="mira-eyes">
            <g className="blink" style={{ transformOrigin: '60px 52px' }}>
              <circle cx="51" cy="52" r="3.6" fill="#2a2340" />
              <circle cx="69" cy="52" r="3.6" fill="#2a2340" />
              <circle cx="52.2" cy="50.8" r="1.2" fill="#fff" />
              <circle cx="70.2" cy="50.8" r="1.2" fill="#fff" />
            </g>
          </g>
          <ellipse cx="45" cy="60" rx="4.5" ry="3" fill="#ffb3c4" opacity="0.85" />
          <ellipse cx="75" cy="60" rx="4.5" ry="3" fill="#ffb3c4" opacity="0.85" />
          {listening ? (
            <ellipse className="mira-mouth-o" cx="60" cy="63" rx="4.5" ry="5" fill="#2a2340" />
          ) : (
            <path d="M54 61 Q60 67 66 61" stroke="#2a2340" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}
        </g>
      </svg>
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
