# Miracle CEO — UI redesign

A front-end-only redesign of app.miracleceo.com: the same routes and flows, all mock data, built to review in Safari on the iOS simulator.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:5173/sign-in` in Safari on the simulator. The simulator reaches the Mac's localhost directly.

**Shortcut for reviews:** open `http://localhost:5173/home?demo` to skip sign-in and onboarding with a ready-made profile (Josh, Dad, Test Kid, born 2020-01-01).

**Start over:** use Settings › Delete my account, or clear Safari website data.

## What's where

| Route | Screen |
|---|---|
| `/sign-in` | Full-bleed illustrated welcome. Controls float over a cream semicircle with the family rising above it. |
| `/auth/email` | Branded email sign-up and log-in, replacing the Cognito hosted page. |
| `/onboarding` | 14 steps. Drag the seed to plant it, then the tree grows on top of each question card. |
| `/home` | Daily mood check-in (six soft faces), illustrated today card, tree card, "things worth knowing" bento, videos. |
| `/activity/:id` | Activity player: intro, steps, practice, feedback, Mira's read, leaves celebration. |
| `/solve` | Ask Mira (bar-to-wave voice input), Talk it out (night voice diary), 7-day plans. |
| `/grow` | Today's moment, SQ/EQ/IQ tiles and "let it choose", Mira insights, filtered activity list, topics. |
| `/journey` | Stats, forest card, skill progress, week strip and timeline. Sub-pages: forest map, child profile and edit, chats, saved answers, library, settings. |

- **Art** (`src/art/`) is hand-built SVG, so all of it can animate: tree, family, scenes, mood faces, waveform and activity art.
- **Design tokens** live in `src/styles/tokens.css`. The final colour palette will be a one-file change there.

## Decisions taken while Josh's inputs are pending

- **Palette:** provisional. Pastel butter, blush, sky and lilac with a single teal action colour, following "Being a parent" plus the existing yellow, pink and blue. Waiting on Josh's palette.
- **Display font:** Hagrid is a paid font. Until the licensed files are added, the font stack falls back to Bricolage Grotesque. Drop `Hagrid` @font-face files in and they take over automatically. UI text uses SF Pro through the system font stack.
- **Tree:** redrawn in the bushy, layered-clump style of reference 08. The stock image has watermarks, so it isn't used directly.
- **Characters:** flat 2D figures in the Kidory spirit, drawn in code. A professional illustrator's set could replace them one-for-one.
- **Figma file:** not received yet. The Home structure follows the designer's screenshot (reference 07).

## Fixed from the old app (see `baseline/INVENTORY.md`)

- **Name and pronouns:** the child's full name is always used, never split, and pronouns follow the gender chosen.
- **Edit birthday:** the edit screen pre-fills the saved birthday, with no clipped "Day" field.
- **Activity steps:** each new step opens at the top.
- **One primary colour:** a single action colour and a single selection style across the app.
- **Sign out:** appears once, and there's one danger zone.
- **Labels:** no truncated "Add anoth…" and no icon-font text leaking into labels.
- **Tab indicator:** the 7-day tab indicator moves with the content.
- **Silent swaps:** swapping today's activity always shows a toast.

## Not real yet

- There's no backend, so sign-in, Mira's answers, voice recording, videos and reads are all mocks.
- Every 7-day plan shows the bedtime plan.
- Adding a second child shows a "coming soon" toast.
