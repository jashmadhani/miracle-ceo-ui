/*
 * The activity illustrations: one painted scene per activity, keyed by activity
 * id (sq-0 … iq-6 from the catalogue, plus the sample activities). Cut from the
 * generated sheets with transparent backgrounds; the cleaned 1x masters live in
 * references/illustration-kit/source.
 */
const FILES = import.meta.glob<string>('./illustrations/activities/*.webp', { eager: true, query: '?url', import: 'default' })

/** an activity id, or any scene from the set reused elsewhere (sign-in, profile) */
export type IllustrationName = string

export function illustrationUrl(name: string): string | undefined {
  return FILES[`./illustrations/activities/${name}.webp`]
}

export function Illustration({ name, className, alt = '' }: { name: IllustrationName; className?: string; alt?: string }) {
  return <img className={`illus ${className ?? ''}`} src={illustrationUrl(name)} alt={alt} aria-hidden={alt ? undefined : true} draggable={false} decoding="async" />
}
