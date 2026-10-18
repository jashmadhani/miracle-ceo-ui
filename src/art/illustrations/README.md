# Illustrations

`activities/` holds one painted scene per activity, named by activity id:
`sq-0` … `sq-6`, `eq-0` … `eq-6`, `iq-0` … `iq-6` (the 21-activity catalogue,
see `src/data/catalogue.ts`), plus `emotion-snap`, `conversation-snap` and
`focus-hunt` from the sample activities.

They were generated from `references/illustration-kit/MASTER-PROMPT.md` as four
sheets of six, then cut out with transparent backgrounds, the generator's
watermark removed, and exported at 2x as WebP. The cleaned 1x masters are in
`references/illustration-kit/source/`.

Still to make (using stand-ins for now, set with `art:` in content.ts):
`feeling-word`, `speech-bubbles`, `focus-fortress`. Drop a WebP with that name
in `activities/` and the app picks it up; then remove the `art:` line.
