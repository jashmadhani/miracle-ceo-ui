import './art.css'

type Props = {
  parent?: 'mom' | 'dad' | 'guardian' | ''
  pose?: 'lap' | 'hug' | 'wave'
  className?: string
}

const SKIN = '#eab68f'
const SKIN_SHADE = '#d79a72'
const CHILD_SKIN = '#f0c39c'
const HAIR = '#3a2430'
const CHILD_HAIR = '#6b3e26'
const TOP = '#ef7f72'
const TOP_SHADE = '#dd6458'
const LEGS = '#4a5a92'
const CHILD_TOP = '#f7cb62'

/**
 * Parent and child, flat 2D in the Kidory "boy and the bear" spirit:
 * chunky shapes, dot eyes, rosy cheeks, thick rounded limbs.
 * viewBox 360×360, sitting on y≈340.
 */
export function Family({ parent: who = 'mom', pose = 'lap', className }: Props) {
  const parent = who || 'mom'
  return (
    <svg viewBox="0 0 360 360" className={className} role="img" aria-label="A parent and child together">
      {/* soft shadow */}
      <ellipse cx="180" cy="344" rx="128" ry="12" fill="#2a2233" opacity="0.08" />

      {/* parent — legs crossed */}
      <path d="M66 338 C64 300 104 286 150 292 L210 292 C256 286 296 300 294 338 Z" fill={LEGS} />
      <path d="M92 330 C110 314 150 312 180 318 C210 312 250 314 268 330" stroke="#3b4a7c" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />

      <g className="breathe" style={{ transformOrigin: '180px 300px' }}>
        {/* torso */}
        <path d="M120 300 C116 250 126 206 152 190 L208 190 C234 206 244 250 240 300 Z" fill={TOP} />
        <path d="M208 190 C234 206 244 250 240 300 L222 300 C226 254 218 214 200 196 Z" fill={TOP_SHADE} opacity="0.7" />
        {/* neck */}
        <rect x="168" y="168" width="24" height="28" rx="10" fill={SKIN_SHADE} />

        <g className="head-tilt" style={{ transformOrigin: '180px 176px' }}>
          {parent === 'mom' && (
            <path d="M136 132 C132 92 160 70 186 72 C218 74 234 100 230 134 C238 168 236 206 222 222 C214 196 212 176 214 160 L148 160 C150 182 146 204 136 220 C124 196 128 160 136 132 Z" fill={HAIR} />
          )}
          {parent === 'guardian' && (
            <path d="M138 124 C138 88 164 72 184 72 C210 72 228 90 226 122 C216 106 196 100 180 102 C162 104 148 112 138 124 Z" fill={HAIR} />
          )}
          {/* face */}
          <ellipse cx="182" cy="134" rx="40" ry="42" fill={SKIN} />
          {parent === 'mom' && (
            <path d="M142 128 C146 98 170 84 194 88 C212 92 224 106 224 124 C206 120 186 108 176 96 C168 112 156 122 142 128 Z" fill={HAIR} />
          )}
          {parent === 'dad' && (
            <>
              <path d="M140 126 C136 94 158 76 184 76 C212 76 228 96 224 128 C220 112 206 102 186 102 C166 102 150 110 140 126 Z" fill={HAIR} />
              <path d="M148 146 C150 176 164 186 182 186 C200 186 214 176 216 146 C208 160 196 166 182 166 C168 166 156 160 148 146 Z" fill={HAIR} opacity="0.92" />
            </>
          )}
          {parent === 'guardian' && (
            <circle cx="180" cy="76" r="16" fill={HAIR} />
          )}
          {/* eyes look down at the child */}
          <g className="blink" style={{ transformOrigin: '182px 140px' }}>
            <ellipse cx="166" cy="140" rx="3.6" ry="4.4" fill="#2a2233" />
            <ellipse cx="198" cy="140" rx="3.6" ry="4.4" fill="#2a2233" />
          </g>
          <ellipse cx="158" cy="154" rx="7" ry="4.5" fill="#f08d86" opacity="0.55" />
          <ellipse cx="206" cy="154" rx="7" ry="4.5" fill="#f08d86" opacity="0.55" />
          <path d="M174 158 C178 163 186 163 190 158" stroke="#7a3b2e" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* child on the lap */}
      <g className="child-bob" style={{ transformOrigin: '186px 300px' }}>
        <path d="M150 300 C148 268 164 248 186 248 C208 248 224 268 222 300 Z" fill={CHILD_TOP} />
        <path d="M160 300 C158 312 166 322 176 320 M212 300 C214 312 206 322 196 320" stroke={LEGS} strokeWidth="0" />
        <g className="head-tilt-child" style={{ transformOrigin: '186px 246px' }}>
          <circle cx="186" cy="222" r="30" fill={CHILD_SKIN} />
          <path d="M156 216 C156 192 174 184 188 186 C206 188 218 200 216 218 C206 206 196 202 186 206 C178 198 166 204 156 216 Z" fill={CHILD_HAIR} />
          <path d="M184 188 C180 178 188 172 194 178" stroke={CHILD_HAIR} strokeWidth="5" strokeLinecap="round" fill="none" />
          <g className="blink" style={{ transformOrigin: '186px 226px', animationDelay: '1.3s' }}>
            <circle cx="175" cy="226" r="3.2" fill="#2a2233" />
            <circle cx="197" cy="226" r="3.2" fill="#2a2233" />
          </g>
          <ellipse cx="168" cy="236" rx="5.5" ry="3.5" fill="#f08d86" opacity="0.6" />
          <ellipse cx="204" cy="236" rx="5.5" ry="3.5" fill="#f08d86" opacity="0.6" />
          <path d="M180 238 C184 243 190 243 193 238" stroke="#7a3b2e" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* parent's arms around the child, holding the book */}
      {pose === 'lap' && (
        <>
          <path d="M132 218 C112 250 126 286 160 288" stroke={TOP} strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M228 218 C248 250 234 286 204 288" stroke={TOP_SHADE} strokeWidth="22" strokeLinecap="round" fill="none" />
          <g className="book" style={{ transformOrigin: '182px 284px' }}>
            <path d="M150 270 L182 278 L214 270 L214 302 L182 310 L150 302 Z" fill="#fffdf8" />
            <path d="M182 278 L182 310" stroke="#d3c7b6" strokeWidth="2" />
            <path d="M146 268 L150 270 L150 302 L146 300 Z M218 268 L214 270 L214 302 L218 300 Z" fill="#7fa9de" />
            <path d="M158 284 L174 288 M158 292 L174 296 M190 288 L206 284 M190 296 L206 292" stroke="#e1d6c6" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <circle cx="156" cy="290" r="11" fill={SKIN} />
          <circle cx="208" cy="290" r="11" fill={SKIN} />
        </>
      )}
      {pose === 'hug' && (
        <>
          <path d="M132 218 C108 250 140 282 186 276 C222 272 238 252 230 222" stroke={TOP} strokeWidth="22" strokeLinecap="round" fill="none" />
          <circle cx="212" cy="262" r="11" fill={SKIN} />
          <path d="M156 268 C150 254 160 244 172 252" stroke={CHILD_TOP} strokeWidth="14" strokeLinecap="round" fill="none" />
        </>
      )}
      {pose === 'wave' && (
        <>
          <path d="M132 218 C112 250 126 286 160 288" stroke={TOP} strokeWidth="22" strokeLinecap="round" fill="none" />
          <circle cx="160" cy="288" r="11" fill={SKIN} />
          <g className="wave-arm" style={{ transformOrigin: '232px 220px' }}>
            <path d="M228 218 C252 200 262 176 258 150" stroke={TOP_SHADE} strokeWidth="22" strokeLinecap="round" fill="none" />
            <circle cx="258" cy="140" r="12" fill={SKIN} />
          </g>
        </>
      )}
    </svg>
  )
}
