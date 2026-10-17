# Redesign brief — collected references

Living document. Each section maps a part of the app to the references Josh chose for it.
Screens referred to by number are in `../baseline/` (see `../baseline/INVENTORY.md`).

## Global

**Type** (`01-fonts-hagrid-sfpro.webp`)
- Accent / display: **Hagrid**. This is a commercial font, so a licensed font file is needed.
- Main / UI: **SF Pro**, which Safari on iOS exposes as `system-ui` / `-apple-system`.

**Colour.** *Pending, Josh will supply the palette.* Constraints so far:
- Pastel, light and vibrant.
- Inspired by `03-being-a-parent.webp` (first screen only) plus the existing yellow, pink and blue.
- Don't copy Kidory's palette: no green, brown or white as the leading colours.
- Soft gradient fades (purple, yellow, green), as in `04-mindfulme.png`, where they suit the 2D art.

**Illustration and motion**
- 2D illustrated art and animation in the style of Kidory's "The Boy and The Mountain Bear" (`02-kidory.png`, middle screen).
- Replace the current AI-looking images.
- One shared set of characters and elements across the whole app.
- Big art, little text, with obvious calls to action (`06-hi-jose-maria.webp`).

**Layout**
- Top-left branding, as on Kidory's first screen.
- Rounded "bento" cards, as in Kidory's "Chapter 1" reader panel.
- Generous space with very little text per card, as in the middle screen of `05-meditation-centre.webp`.

**Figma.** *Pending, a UI designer's file is on its way.*
- `07-designer-home-harry.webp` is the designer's Home. The structure is liked; the tree is not.

## Sign-in and onboarding
- Full-screen background art, like the first screen of `03-being-a-parent.webp`.
- Login controls float over the art instead of taking up a block of the screen.
- Composition from the first screen of `05-meditation-centre.webp`:
  - Title at top-left ("Welcome to…").
  - A white semicircle with the character's head rising above it.
- Onboarding must have full-screen graphics with the 2D animations.

## Mood check-in (daily)
- Replace the slider with **six soft, non-circular, loosely drawn faces**, as in the middle screen of `04-mindfulme.png`.

## Home
- Structure follows `07-designer-home-harry.webp`:
  - A coloured "Today's activity" header with the child switcher.
  - The tree card.
  - "Things worth knowing" read cards.
  - "Get to know [child]" video list.
  - A floating tab bar.
- Today's activity gets a real 2D illustration, not a vague gradient.
- The articles / podcasts / videos section uses the bento treatment from `05-meditation-centre.webp`.

## Tree (Home, full screen, Journey)
- The tree must look properly illustrated. **Which tree image is the target is still to be confirmed**: `08-tree-a-bushy.webp` or `09-tree-b-blobs.png`.
- Don't use the designer's tree from `07`.
- `08` has stock watermarks, so we recreate the style rather than use the file.

## Mira voice (Solve › Share, and the mic in Ask)
- Drop the pulsing mic.
- Use a live audio-waveform animation, like the player on the third screen of `05-meditation-centre.webp`.
- Or use the Wispr Flow behaviour, where a flat horizontal bar morphs into a moving waveform while listening.
- No backend, so recording is a UI mock.

## Not yet referenced
- Activity flow (steps, feedback, "Mira's read", leaves celebration)
- Solve: Ask chat and the 7-day challenge
- Grow
- Journey: forest map, tree detail, profile, settings
