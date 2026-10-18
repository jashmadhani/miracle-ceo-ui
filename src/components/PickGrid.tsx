import { Icon } from './Icon'

/**
 * Word choices laid out as an even two-column grid of tiles (like the original
 * app's choice grid). The data still carries an emoji per item; it isn't shown,
 * to keep the onboarding calm and grown-up.
 */
export function PickGrid({
  items,
  selected,
  onToggle,
  max,
}: {
  items: string[][]
  selected: string[]
  onToggle: (label: string) => void
  max?: number
}) {
  const full = max != null && selected.length >= max
  return (
    <div className="pick-grid">
      {items.map(([, label]) => {
        const on = selected.includes(label)
        const locked = full && !on
        return (
          <button key={label} type="button" className={`pick ${on ? 'on' : ''}`} onClick={() => !locked && onToggle(label)} aria-pressed={on} disabled={locked}>
            <span className="pick-label">{label}</span>
            {on && (
              <span className="pick-check" aria-hidden>
                <Icon name="check" size={12} stroke={3.2} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
