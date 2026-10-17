import { useEffect, useRef } from 'react'
import './art.css'

type Props = {
  /** idle = a flat line; listening = a live wave; thinking = a slow travelling ripple */
  state: 'idle' | 'listening' | 'thinking'
  bars?: number
  color?: string
  height?: number
}

/**
 * Wispr Flow-style voice visual: a flat line that swells into a live waveform
 * while "listening". Audio is simulated (no backend), from layered sines + noise
 * so it reads like speech: bursts, pauses, and a soft envelope at the edges.
 */
export function Waveform({ state, bars = 32, color = 'currentColor', height = 64 }: Props) {
  const refs = useRef<(SVGRectElement | null)[]>([])
  const amp = useRef(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    let raf = 0
    let t = 0
    let burst = 0.6
    let nextBurst = 0
    const tick = () => {
      t += 1 / 60
      const s = stateRef.current
      const target = s === 'listening' ? 1 : s === 'thinking' ? 0.35 : 0
      amp.current += (target - amp.current) * 0.08

      // speech-like loudness envelope: random bursts with gaps
      if (t > nextBurst) {
        burst = Math.random() < 0.25 ? 0.15 : 0.55 + Math.random() * 0.45
        nextBurst = t + 0.18 + Math.random() * 0.35
      }
      const loud = s === 'listening' ? burst : 1

      for (let i = 0; i < bars; i++) {
        const el = refs.current[i]
        if (!el) continue
        const x = i / (bars - 1)
        const edge = Math.sin(Math.PI * x) ** 0.8
        let v: number
        if (s === 'thinking') {
          v = 0.5 + 0.5 * Math.sin(t * 4 - x * 9)
        } else {
          v =
            0.55 * Math.abs(Math.sin(t * 7.3 + x * 11)) +
            0.3 * Math.abs(Math.sin(t * 13.1 - x * 23)) +
            0.15 * Math.random()
        }
        const h = 4 + (height - 4) * amp.current * edge * Math.min(1, v * 1.6) * loud
        el.setAttribute('height', h.toFixed(1))
        el.setAttribute('y', ((height - h) / 2).toFixed(1))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [bars, height])

  const gap = 3
  const w = 4
  const total = bars * w + (bars - 1) * gap
  return (
    <svg viewBox={`0 0 ${total} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet" aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <rect
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          x={i * (w + gap)}
          y={(height - 4) / 2}
          width={w}
          height={4}
          rx={w / 2}
          fill={color}
        />
      ))}
    </svg>
  )
}
