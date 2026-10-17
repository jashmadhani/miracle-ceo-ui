// Stroke icon set (24×24, 2px). Inline SVG so nothing leaks as text if a font fails to load.

const PATHS: Record<string, string> = {
  home: 'M4 11.5 12 5l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5h-6v5H5.5A1.5 1.5 0 0 1 4 19Z',
  solve: 'M12 3.5c.6 3.4 2.1 4.9 5.5 5.5-3.4.6-4.9 2.1-5.5 5.5-.6-3.4-2.1-4.9-5.5-5.5 3.4-.6 4.9-2.1 5.5-5.5ZM18.5 14.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z',
  grow: 'M12 21v-8m0 0c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5Zm0 0C12 9.5 9.8 7.5 5 7.5c0 3.5 2.2 5.5 7 5.5Z',
  journey: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  back: 'M15 18l-6-6 6-6',
  chev: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  mic: 'M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5A3.5 3.5 0 0 0 12 15Zm-6.5-4a6.5 6.5 0 0 0 13 0M12 17.5V21',
  send: 'M12 19V5m0 0-6 6m6-6 6 6',
  play: 'M8 5.5v13l10.5-6.5Z',
  pause: 'M8 5v14M16 5v14',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
  leaf: 'M5 19C5 10 10 5 19 5c0 9-5 14-14 14Zm0 0 8-8',
  heart: 'M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1.5-9a3 3 0 1 0 0-6m1.5 15h3a5 5 0 0 0-4-4.9',
  bulb: 'M9 18h6m-5 3h4m-5.5-6.5A6 6 0 1 1 15.5 14.5c-.9.8-1.5 1.7-1.5 3.5h-4c0-1.8-.6-2.7-1.5-3.5Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  chat: 'M4 18.5V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8Z',
  bookmark: 'M7 4h10v16l-5-3.5L7 20Z',
  book: 'M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5ZM12 6v13.5',
  shuffle: 'M4 7h3.5c4.5 0 4.5 10 9 10H20m0 0-3-3m3 3-3 3M4 17h3.5c1.5 0 2.4-1.1 3.1-2.6M20 7h-3.5c-1.5 0-2.4 1.1-3.1 2.6M20 7l-3-3m3 3-3 3',
  map: 'M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6Zm0 0v14m6-12v14',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  sparkle: 'M12 3c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7Z',
  thumb: 'M7 21V10m0 0 4-7c1.5 0 2.5 1.2 2.2 2.7L12.6 9H18a2 2 0 0 1 2 2.3l-1.2 7.5A2.5 2.5 0 0 1 16.3 21H4V10Z',
  plus: 'M12 5v14M5 12h14',
  lock: 'M6.5 11h11v9.5h-11ZM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  stop: 'M7 7h10v10H7Z',
  google: '',
}

export function Icon({ name, size = 22, stroke = 2, className, style }: { name: keyof typeof PATHS; size?: number; stroke?: number; className?: string; style?: React.CSSProperties }) {
  if (name === 'google') return <GoogleG size={size} />
  const filled = name === 'play'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

function GoogleG({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
    </svg>
  )
}
