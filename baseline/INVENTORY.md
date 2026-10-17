# Miracle CEO — current UI baseline

Captured 2026-10-17 from https://app.miracleceo.com in a ~334×708 pt mobile viewport.
Test account: parent "Josh" (Dad). Placeholder child: "Test Kid", born 2020-01-01, Boy, on a free trial.

`.jpg` files are static screens. `.gif` files are animations and transitions, stitched from rapid frame bursts (about 3–5 fps).

## Screen map

| # | Area | Screen / state | Files |
|---|------|----------------|-------|
| 1 | Auth | Sign-up carousel, slides 1/3/4/5 (slide 2 is text-only, below) | 01–04 |
| 2 | Auth | Log-in choice | 05 |
| 3 | Auth | AWS Cognito hosted sign-in (unstyled, off-brand) | 06 |
| 4 | Onboarding | "Every child starts as a seed" — drag the seed down | 07 |
| 5 | Onboarding | About you (name, Mom/Dad/Guardian, terms) | 08, 09 |
| 6 | Onboarding | Activity preview "Help your child grow" | 10 (gif), 11 |
| 7 | Onboarding | How are you joining (school code vs free trial) | 12 (gif), 13, 14 |
| 8 | Onboarding | Child details (name, DOB, Girl/Boy) | 15 (gif), 16, 17 |
| 9 | Onboarding | First child? | 18 (gif), 19 |
| 10 | Onboarding | Where to grow (8 chips) | 20 (gif), 21, 22 |
| 11 | Onboarding | Mira chat preview | 23 (gif), 24 |
| 12 | Onboarding | What's getting in the way (16 chips, max 3) | 25 (gif), 26, 27 |
| 13 | Onboarding | What have you tried | 28 (gif), 29, 30 |
| 14 | Onboarding | Bonsai → Miracle CEO transformation | 31 (gif), 32 |
| 15 | Onboarding | Anything else about the child | 33 (gif), 34, 35 |
| 16 | Onboarding | Time per day | 36 (gif), 37, 38 |
| 17 | Onboarding | Outcomes wheel (EQ/SQ/IQ…) | 39 (gif), 40 |
| 18 | Onboarding | Tree planted / welcome | 41 (gif), 42 |
| 19 | First run | Splash → "Two ways to grow" intro | 43 (gif), 44, 45 |
| 20 | Daily | Mood check-in, slider states, "Okay" response | 46–50 |
| 21 | Home | Reveal transition; top, tree, reads, videos | 51 (gif), 52–54 |
| 22 | Home | Child switcher dropdown | 55 (gif), 56 |
| 23 | Home | Add another child sheet | 57 (gif), 58, 59 |
| 24 | Home | Leaf detail sheet | 60 (gif), 61 |
| 25 | Home | Tree full screen | 62 (gif), 63 |
| 26 | Activity | Intro sheet → steps 1–10 → done | 64–73 |
| 27 | Activity | Feedback ("How did it go", 3 questions) → Mira's read | 74–79 |
| 28 | Activity | "3 leaves grown" celebration → done state + toast | 80 (gif), 81, 82 |
| 29 | Global | Route loading splash | 83 |
| 30 | Solve › Ask | Empty state, suggestions, history drawer | 84–87 |
| 31 | Solve › Ask | Chat: thinking → answer; tabs Why / Bonsai / Miracle CEO; practice; check-in | 88–95 |
| 32 | Solve › Share | Voice diary (mic pulse animation), empty diary | 96 (gif), 97, 98 |
| 33 | Solve › 7-Day | Skeleton → grid → "Building your seven days…" → plan sheet → Day 1 of 7 | 99–106 |
| 34 | Grow | Full page sections (activity, wheel, list, topics) | 107–113 |
| 35 | Grow | Wheel spin ("Let it choose") | 114 (gif), 115 |
| 36 | Grow | Insights by Mira (locked, 1 of 8) | 116 (gif), 117 |
| 37 | Grow | Time and category filters; activity sheet; topic-filtered list | 118–121 |
| 38 | Journey | Main page sections | 122–125 |
| 39 | Journey | Forest map fly-in, scroll, tree detail | 126–135 |
| 40 | Journey | Activity library (inline accordion) | 136 (gif), 137 |
| 41 | Journey | Profile, Edit child (4 sections) | 138–143 |
| 42 | Journey | Settings, Past chats, Saved answers (empty) | 144–147 |
| 43 | Home | Video sheet + "Was it useful?" | 148 (gif), 149, 150 |

Carousel slide 2 text (not captured): "Unlock your child's full potential. Develop their complete spectrum—IQ, EQ, SQ, VQ, PQ, and LQ—so they thrive in all areas of life."

Not captured on purpose: "Start talking" (needs microphone permission), Sign out and Delete account (destructive), payment and subscription screens (none were reached on the free trial).

## Problems spotted in the current UI (inputs for the redesign)

### Bugs
- **Icon font leaks as text.** "chevron_left" shows up in the page text on Profile, Edit, Settings, Chats and Solutions, so the Material Symbols ligature isn't loading reliably.
- **Child's name gets split.** "Test Kid" is shortened to "Test" in Mira copy and the 7-day plan ("hand Test a book", "what she sees in Test"). Mira also calls the child "she" here although the child was entered as a boy.
- **Edit child loses the birthday.** The Day/Month/Year fields are empty even though a date of birth was saved, and the "Day" select is clipped to "Da".
- **Activity steps don't scroll to the top on Next.** You land at the bottom of the sheet, and the new step's content is off-screen.
- **Overlap on the celebration card.** The leaf icon sits on top of the "3 leaves grown" title (81 / 80 gif).
- **Child switcher is truncated.** It reads "Add anoth…" (56).
- **7-Day tab indicator lags.** The selected pill stays on "Share" while the challenge content is already showing (99 gif).
- **Picking things silently changes the plan.** Spinning the wheel or tapping a topic tile replaces "Today's activity" without saying so.

### Inconsistency
- Primary buttons are pink in some places (onboarding, Mira) and green in others (activity Start, Add child, Insights). There's no single primary colour.
- Date of birth uses a native date input in onboarding but three selects in Add child and Edit.
- Selected states vary: dark-filled chips (Boy/Dad), green-outlined tiles, pink-outlined chips (Edit). Two of these are very low contrast, e.g. "On my own" barely looks selected (14).
- Gender options differ: Add child offers "Prefer not to say", onboarding doesn't.
- The "what's hard" chips in Edit don't match the onboarding chips.
- Settings has **two** Sign out buttons and repeats the danger zone that's already on Profile.
- Journey › Activity library expands 901 items inline instead of opening its own page.

### Visual / UX
- The sign-in step is the unstyled Cognito hosted UI, a hard brand break.
- Heavy reliance on low-contrast pastel tints (pink-on-pink and green-on-green text).
- Long copy blocks with yellow highlighter marks on Grow cards make them hard to scan.
- The pastel pie in the SQ/EQ/IQ wheel isn't clearly tappable.
- The Grow page is long (~3,600 px) and mixes today's activity, wheel, insights, list and topics.
- Bottom nav labels are small and grey, and the active state is a faint pill.
