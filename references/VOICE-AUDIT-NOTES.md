# Voice audit, applied to the redesign

Source: "MiracleCEO Voice Audit" (17 Oct 2026). These notes say what changed in
this repo and what was left out, so the next pass starts from here.

## Applied

| Audit item | What changed here |
| --- | --- |
| VA-01, VA-02 sign-in carousel | New slides: "Five calm minutes a day, together." · "Ask anything. Mira listens first." · "Feelings, friendships and a curious mind." |
| VA-04 bonsai slide | "Grow together with {child}." Bonsai moments vs Miracle CEO moments: In a rush → Pause and connect, Busy mind → Calm heart, Doing it for them → Doing it together. |
| VA-05 problem list | 7-day plans renamed to goals: Easing off screens, Happy mealtimes, Smoother bedtimes, Calm when we're out, Siblings getting along, Homework made easier, Kind words at home. Intro: "Moments every parent knows." |
| VA-06 Mira's answer | Tabs are Why / Quick fix / Try this. The quick fix is written without "you" and without judging. No "defiance", "stalling", "negotiation". |
| VA-08 feedback chips | "Not interested" → "Wanted something else". "Not this one" → "Maybe another day". "Not this time" → "Still warming up". |
| VA-09 activity titles | Emotion Snap → What Would You Feel? · Conversation Quick Snap → How Do I Say Hello? · Five Minute Focus Hunt → What Moved? · Feeling Word → Guess the Feeling · Conversation Speech Bubbles → Make Speech Bubbles · Focus Fortress → Three Rounds, Three Bricks. Topics now match the how-to. |
| VA-12 Mira's notes | "Mira's read" → "What Mira noticed". "This is the part Mira learns from" → "Every note helps Mira choose the next activity for {child}." |
| VA-14, VA-15, VA-16 onboarding chips | "What's been hard lately?" → "Where would you like a little help?" with goal-named chips. Tried and anything-else chips reworded (no "taking away", no "special need"). |
| VA-21 headings | "Miracle CEO practice" → "Practise it this week". |
| VA-22 AI patterns | Em-dashes, "quietly", "actually", "not X but Y" removed from all copy. |
| VA-24 seed and info slides | "You are the gardener." · "Ask Mira anything, big or small." |
| VA-25 names | "Today's activity" everywhere (was also "Today's moment"). "activities done". "they" for the child in all copy, "Mum" not "Mom". |
| VA-27 AI disclosure | Kept, said kindly under Mira's answer and her activity note: "Mira is our AI guide … you know {child} best." |
| VA-31 Ask Mira, diary | "Tell Mira what's weighing on you" → "Ask Mira anything, big or small". Diary: "Say it however it comes. Mira will help you find the good bits." |
| Rule 1, ALL-CAPS | Small labels are sentence case now ("Just between us", "Day one"). |
| Rule 3, labels | Child temperament sliders describe moments: Takes it slow ↔ Jumps right in, Keeps at it ↔ Moves on quickly, and so on. "Hard right now" → "A little help with". |

## Left out, and why

- VA-03 name checks, VA-07 trial countdowns and question limits, VA-10 developer errors, VA-13 diary delete, VA-23 load errors, VA-26 empty Terms links, VA-29, VA-30, VA-33: these exist only in the old build or its server config. The redesign has none of these strings. Carry the audit's wording over when those features are built.
- VA-11 miracleceo.com: the public site is not in this repo.
- VA-17, VA-18, VA-19, VA-20, VA-28, VA-32, VA-34: the redesign's strings for these moments were already different and pass the rules.
- The 21 v61 activity titles: this mock has six live activities. The audit's 21 titles should go in with the real catalogue.
- Mira's live replies: add the eight voice rules to her system prompt (audit, coverage gaps).
