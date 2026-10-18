# Illustrations

`activities/` holds one painted scene per activity, named by activity id:
`sq-0` … `sq-6`, `eq-0` … `eq-6`, `iq-0` … `iq-6` (the 21-activity catalogue,
see `src/data/catalogue.ts`), plus `emotion-snap`, `conversation-snap` and
`focus-hunt`, `feeling-word`, `speech-bubbles` and `focus-fortress` from the
sample activities.

They were generated from `references/illustration-kit/MASTER-PROMPT.md` as four
sheets of six, then cut out with transparent backgrounds, the generator's
watermark removed, and exported at 2x as WebP. The cleaned 1x masters are in
`references/illustration-kit/source/`.

The last three (`feeling-word`, `speech-bubbles`, `focus-fortress`) were made
one at a time from `references/illustration-kit/MISSING-3-PROMPT.md` and came
back already transparent; they are exported 960px wide.

A new activity picks up its scene by dropping `<id>.webp` in `activities/`.
Until then it can borrow another scene with `art:` in content.ts.
