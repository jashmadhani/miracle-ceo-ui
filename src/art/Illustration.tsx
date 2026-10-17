/*
 * Professional 2D illustrations from Storyset (storyset.com, Freepik licence:
 * free for commercial use with attribution — credited in Settings → About).
 * Each file was cleaned, recoloured to the app palette and given gentle
 * in-file CSS motion; see src/art/illustrations/README.md.
 */
const FILES = import.meta.glob<string>('./illustrations/*.svg', { eager: true, query: '?url', import: 'default' })

export type IllustrationName =
  | 'family'
  | 'dad-hug'
  | 'mum-hug'
  | 'parents-walk'
  | 'emotion-snap'
  | 'feeling-word'
  | 'conversation-snap'
  | 'speech-bubbles'
  | 'focus-hunt'
  | 'focus-fortress'

export function illustrationUrl(name: string): string | undefined {
  return FILES[`./illustrations/${name}.svg`]
}

export function Illustration({ name, className, alt = '' }: { name: IllustrationName; className?: string; alt?: string }) {
  return <img className={`illus ${className ?? ''}`} src={illustrationUrl(name)} alt={alt} aria-hidden={alt ? undefined : true} draggable={false} decoding="async" />
}
