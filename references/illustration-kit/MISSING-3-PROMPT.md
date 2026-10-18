# Prompt for the 3 missing illustrations

Paste this into the same ChatGPT chat that made the four sheets, so it keeps the cast and style.
If it's a new chat, attach `style-reference-family.png` and one of your four sheets first.

When they come back, save them to `src/art/illustrations/activities/` as
`feeling-word.png`, `speech-bubbles.png` and `focus-fortress.png` (or send them to Claude to cut
out and export), then delete the three `art:` stand-in lines in `src/data/content.ts`.

```text
Make 3 more scenes in exactly the same style, line weight, colours and characters as the 24 you already made. Same rules: 2D hand-drawn, plum outlines, flat colour with light grain, simple kind faces, one soft contact shadow, pure white or transparent background, no room or frame, clear space on every side, and no text, letters, numbers, speech-bubble words, logos or watermark anywhere. One image per scene, landscape 3:2, as large as you can.

1. feeling-word "Guess the Feeling" (Emotional, coral #EC6F7D on 1 or 2 elements):
   Mum (low bun, cream kurta, coral dupatta) sits cross-legged and holds up a simple sock puppet on one hand, acting out a feeling (two button eyes, a small droopy frown). Kabir sits facing her, finger on his chin, about to guess.

2. speech-bubbles "Make Speech Bubbles" (Social, green-teal #3E8A80 on 1 or 2 elements):
   Dad and Anaya lie on their tummies on the floor over a big sheet of paper, each holding a crayon, drawing four EMPTY speech-bubble shapes. The bubbles stay completely blank.

3. focus-fortress "Three Rounds, Three Bricks" (Intelligence, marigold #F4B23F on 1 or 2 elements):
   Anaya proudly places a small paper brick on top of a little paper fort she's building on a low table; two bricks are already on it. Mum sits beside her smiling, holding the third round's worksheet (blank).
```
