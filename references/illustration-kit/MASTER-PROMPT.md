# Miracle CEO illustration kit: master prompt for ChatGPT

## How to use this

1. Open a new ChatGPT chat with a model that can make images and run Python.
2. Attach these two files from this folder:
   - `style-reference-family.png`: the painted family from the sign-up screen. Every scene should look like it came from the same illustrator.
   - `v62-screens.png`: the app screens, so it can see where the art sits.
3. Paste everything inside the box below as your first message.
4. ChatGPT first sends a style frame (3 scenes and 3 icons) and waits. Reply "approved", or tell it what to change. Then it makes the rest in batches and finishes with one zip file.
5. If your ChatGPT can't reach its own images from Python, it will ask you to download that batch and upload it back. Do that, and it carries on packaging.

**Palette:** the colours below match our current build: coral, green-teal, marigold and cream. If the kit is for the v62 build instead, swap the three skill colours in the PALETTE block for v62's: Social `#5DBB55`, Emotional `#F2849A`, Intelligence `#F4B840`.

---

```text
You are the illustrator and packager for a parenting app called Miracle CEO Parent. I need a complete, consistent illustration kit for the app's activities, delivered as ONE downloadable .zip file. Do not paste SVG or code into the chat as the deliverable. The zip is the deliverable.

I've attached two images:
1. style-reference-family.png: the painted mum, dad and daughter from our sign-up screen. This is our house style. Match it.
2. v62-screens.png: the app screens, so you can see where the art goes (activity cards, the Grow list, the activity banner).

========================================================
1. WHAT THE APP IS
========================================================
Parents of children aged 3 to 8, mostly in India, do one small activity a day with their child (5 to 60 minutes). Every activity belongs to one of three skills:
- SQ, Social ("people skills"): sharing, turns, helping, kind words.
- EQ, Emotional ("big feelings"): spotting, naming and calming feelings.
- IQ, Intelligence ("curious mind"): asking why, sorting, predicting, counting, explaining.
Each skill has 7 activities, one per level, so there are 21 in all. Right now every activity in a skill shows the same badge, so the 7 Social activities look identical. Each activity needs its own picture that shows exactly what the parent and child do.

========================================================
2. STYLE BIBLE (repeat this in every image prompt you write)
========================================================
Look and feel
- Soft, painterly 2D illustration, like the attached family: gentle gouache/watercolour texture, soft edges, warm light from the top left, rounded friendly shapes, light grain. Hand-made, not vector-slick and not 3D.
- Calm and warm. Real moments between a parent and a child, never staged or advert-like.
- Faces: simple and kind like the reference (small eyes, soft smiles, rosy cheeks). Expressions must match the activity: thinking, listening, proud, calm.

Things that make art look AI-made, so avoid all of them
- Any text, letters, numbers or logos anywhere in the image (books, boards, screens and signs stay blank or show simple shapes).
- Extra or missing fingers, melted hands, odd limbs, mismatched eyes.
- Plastic shine, airbrushed glow, bokeh, lens flare, heavy gradients, over-detail.
- Faces or outfits that drift between images.

Composition
- Transparent background (PNG with alpha) for every scene and icon. No sky, no walls, no full rooms.
- At most 1 to 3 props that explain the activity (a book, a dice, a tiffin box). The people carry the story.
- Figures are full-body or three-quarter, standing or sitting on one shared ground line, with one soft contact shadow underneath. That lets the app place the art on any card and let it rise above the card's top edge.
- Keep 6% clear space on every side. Nothing touches the edges.
- Children's eye level and parent crouching or sitting are preferred, so it reads as together, not instructed.

PALETTE (exact hex)
- Base: cream #FDFBE9, warm paper #F6EFE3, sage #8BB08A, terracotta #D9765A, warm brown #7A4A2E.
- Darkest colour, for hair and deepest shadows (never pure black): plum ink #2A2340.
- Skill accents, used on 1 or 2 elements per image, such as the child's top or the main prop:
  - SQ Social: green-teal #3E8A80
  - EQ Emotional: coral #EC6F7D
  - IQ Intelligence: marigold #F4B23F
- Card background tints (for the card versions only): SQ #D4ECE7, EQ #FDE4E6, IQ #FCD893.

Recurring cast (keep them identical in every image)
- Mum, Dad and daughter Anaya (about 6): exactly as in the attached reference, same faces, hair and outfit colours. The daughter has the small flower hair clip.
- Kabir, son, about 4: short black curly hair, round cheeks, simple t-shirt and shorts.
- Dadi, grandmother: grey bun, cotton saree in sage, glasses on a cord. Use her sparingly.
- Meera, Anaya's friend, about 6: two braids, a little darker skin tone. Use her only in Social scenes that need a second child.
- An Indian family home feel: steel tumbler, tiffin box, floor mat, potted tulsi, cotton cushions. Natural, never stereotyped.
- Each scene: one parent plus one child (two children only where the brief says so). Swap between Mum and Dad, and between Anaya and Kabir, across the set.

========================================================
3. THE 21 ACTIVITIES (draw exactly the how-to)
========================================================
Format per line: id | skill | level | code title (keep for file names) | display title | how-to | minutes
Then SCENE (the hero picture) and ICON (a single simple object for small badges).

SOCIAL (SQ), accent #3E8A80
sq-0 | Sharing | One-Moment Notice | Thank You, Little Helper | Ask for one small thing and thank them for exactly that. | 5
  SCENE: In the kitchen, Anaya hands Mum a steel tumbler. Mum takes it with one hand on her heart, beaming. Anaya looks proud.
  ICON: a small hand passing a steel tumbler to a bigger hand, a tiny heart above.
sq-1 | Saying hello | Tiny Choice Pause | Whose Turn Is It? | Play one round where they announce whose turn it is. | 15
  SCENE: On a floor mat with a blank board game, Kabir holds the dice up and points at Dad with a big announcing gesture. Dad waits, smiling.
  ICON: one big dice with a small pointing hand.
sq-2 | Taking turns | Toy Signal | Your Toy, Your Choice | Hand over one toy and let them decide what happens to it. | 30
  SCENE: Dad hands a wooden toy elephant to Anaya. She holds it, thinking, while Meera sits close by, hopeful.
  ICON: a wooden toy elephant resting on an open palm.
sq-3 | Lending a hand | Routine Clue | My Very Own Job | Give them one job in the routine that is only theirs. | 60
  SCENE: Morning. Kabir proudly waters the potted tulsi with a small can while Mum watches from behind with folded hands, smiling.
  ICON: a small watering can with a tiny star.
sq-4 | Kind words | Shared Look | Look, Smile, Then Talk | Catch their eye once before you speak. | 5
  SCENE: Mum kneels to Anaya's height, holding her hands. They look into each other's eyes and both smile before speaking.
  ICON: two faces close together, a small sparkle between their eyes.
sq-5 | Breaking the ice | Two-Option Moment | This One or That One? | Offer two options, both of which you are happy with. | 15
  SCENE: Dad holds up a mango in one hand and a banana in the other. Kabir points happily at one.
  ICON: a mango and a banana side by side with a small tick.
sq-6 | Team play | Story Spot | You Pick What Happens Next | Read one story where they choose what happens next. | 30
  SCENE: On a sofa with cushions, Mum and Anaya share an open picture book with blank pages. Anaya points to one of two paths drawn on the page.
  ICON: an open book with two small arrows branching from it.

EMOTIONAL (EQ), accent #EC6F7D
eq-0 | Spotting feelings | Feeling Face Check | Name That Feeling | Name one feeling out loud when you spot it on their face. | 15
  SCENE: Kabir sits with a small pout, arms crossed. Dad sits beside him and gently touches his own cheek, naming what he sees. Kindly, no scolding.
  ICON: a round, soft, slightly sad face in a small hand mirror.
eq-1 | Naming it out loud | Name It First | I Share My Feeling First | Say your own feeling first, in four words. | 5
  SCENE: Mum, a little tired, sits on the floor with her hand on her chest, sharing. Anaya leans on her knee, listening closely.
  ICON: a hand on a heart.
eq-2 | The pause | One-Breath Wait | Breathe Together | Take one slow breath together before answering. | 30
  SCENE: Dad and Kabir sit cross-legged facing each other, eyes closed, chests full, soft breath swirls between them.
  ICON: a dandelion with a few seeds floating off.
eq-3 | Big feelings, small body | Body Signal Hunt | Where Does the Feeling Live? | Ask where in the body the big feeling lives. | 15
  SCENE: Anaya points to her tummy, where a soft warm glow shows. Mum crouches and asks gently, with an open hand.
  ICON: a simple child outline with a soft glowing spot on the tummy.
eq-4 | Repair | Small Repair | Make Up and Hug | Go back to a wobble from earlier and repair it. | 60
  SCENE: Dad and Kabir hug warmly on the floor. Beside them a block tower that fell over earlier is half rebuilt.
  ICON: a heart with a small plaster across it.
eq-5 | Other people's feelings | Whose Feeling Is It | How Did They Feel Today? | Ask how someone else felt today. | 30
  SCENE: Anaya and Dadi sit together. Anaya thinks with a finger on her chin, and a soft thought cloud above her shows a simple face of a friend.
  ICON: a thought cloud with a small smiling face inside.
eq-6 | Feelings have an end | It Passed Already | All Calm Again | Say out loud when a hard feeling has passed. | 5
  SCENE: Kabir, cheeks still pink from crying, now smiling, sits in Mum's lap. A small cloud with a rainbow floats above them.
  ICON: a little cloud with a rainbow and a peeking sun.

INTELLIGENCE (IQ), accent #F4B23F
iq-0 | The why chain | Story Switch | What Do You Think? | Ask what they think before you answer a why. | 30
  SCENE: Anaya points up, asking why. Dad crouches beside her with a curious look and turns the question back. She thinks, finger on chin, with a small lightbulb glow near her.
  ICON: a speech bubble with a lightbulb inside.
iq-1 | Sorting and grouping | Everyday Helper | Sort It Your Way | Sort a handful of anything by a rule they pick. | 60
  SCENE: On the floor, Kabir sorts colourful buttons into three steel bowls by colour. Mum watches, chin on her hand.
  ICON: three small bowls, each holding one colour of buttons.
iq-2 | What happens next | Picture Path | You Finish the Story | Stop a story halfway and let them finish it. | 5
  SCENE: Mum holds a half-closed picture book. Anaya tells the ending with wide arms, and a dreamy cloud above shows a friendly elephant flying.
  ICON: a half-open book with a small dotted path coming out of it.
iq-3 | Numbers in real life | Tabletop Try | Count Along the Way | Count something ordinary on the way somewhere. | 15
  SCENE: Dad and Kabir walk hand in hand, school bag on Kabir's back. Kabir holds up three fingers, counting flower pots along a low wall.
  ICON: a hand holding up three fingers.
iq-4 | Guess then check | Out-and-About Notice | Guess What's Inside | Guess what is inside before you open it. | 30
  SCENE: At the table, Anaya holds a closed steel tiffin box near her ear, guessing. Dad waits with a playful look, ready to open it.
  ICON: a closed steel tiffin box with a tiny sparkle.
iq-5 | Taking things apart | Build a Version | Little Explorer Look | Look closely at one thing and ask what is inside it. | 5
  SCENE: Kabir peers through a big magnifying glass at a seed pod. Mum leans in, equally curious.
  ICON: a magnifying glass over a leaf.
iq-6 | Teach it back | Teach Me Back | Teach Me Something New | Ask them to teach you one thing from today. | 60
  SCENE: Anaya plays teacher at a small blank chalkboard. Dad sits cross-legged on the floor as the student with his hand raised.
  ICON: a small blank chalkboard with a star.

========================================================
4. EXTRA SET (after the 21 activities)
========================================================
A. Skill emblems (icon style, transparent):
   pillar-sq: two small hands holding together. pillar-eq: a soft heart. pillar-iq: a lightbulb with a tiny sprout.
B. 7-day plan topics (icon style, transparent), named as goals:
   plan-easing-off-screens (a tablet set face-down beside a ball), plan-happy-mealtimes (a plate with a smiley arrangement of food), plan-smoother-bedtimes (a crescent moon on a pillow), plan-calm-when-out (a small shopping bag with a calm face), plan-siblings-getting-along (two children's hands sharing one toy), plan-homework-made-easier (a pencil and a small timer), plan-little-readers (a stack of picture books), plan-kind-words-at-home (two speech bubbles with a heart).
C. Grow topics (icon style, transparent):
   topic-making-friends, topic-sharing-and-turns, topic-naming-feelings, topic-calming-down, topic-asking-questions, topic-figuring-things-out.
D. Our current build's six sample activities (scene + icon, same rules as section 3):
   app-emotion-snap "What Would You Feel?": child names a feeling from a small picture card Mum holds up.
   app-conversation-snap "How Do I Say Hello?": child practising hello with a toy, Dad playing the other child.
   app-focus-hunt "What Moved?": five small objects on a table, child spotting what changed, parent hiding a smile.
   app-feeling-word "Guess the Feeling": parent using a sock puppet, child guessing its feeling.
   app-speech-bubbles "Make Speech Bubbles": parent and child drawing empty speech bubbles on paper.
   app-focus-fortress "Three Rounds, Three Bricks": child adding a paper brick to a small paper fort after a round of a task.

========================================================
5. FILES AND SIZES (exact)
========================================================
Use the id from section 3 or 4 in every file name, then a short slug of the display title.
Example: sq-0-thank-you-little-helper

Per activity (21 + 6):
- scenes/{id}-{slug}.png: 2400 x 1600, transparent, the hero scene.
- scenes/{id}-{slug}@1x.png: 1200 x 800, transparent.
- scenes/{id}-{slug}.webp: 1200 x 800, transparent, quality 90.
- cards/{id}-{slug}-card.png: 1200 x 690. Composite in Python: a rounded rectangle (radius 72 px) in the skill's card tint, with the scene centred and bottom-aligned at about 86% height. No other decoration.
- icons/{id}-{slug}-icon.png: 1024 x 1024, transparent. Also icons/{id}-{slug}-icon-256.png and -icon-128.png.

Extras: icons/pillar-*.png, icons/plan-*.png and icons/topic-*.png at 1024, 256 and 128.

Zip layout (name it miracle-ceo-illustration-kit-v1.zip):
  README.md            what is inside, the palette, the cast, the naming rule
  manifest.json        one entry per item (fields below)
  contact-sheet.png    every scene and icon on one sheet, labelled with its id, for review
  style/style-frame.png
  scenes/  cards/  icons/

manifest.json entry fields:
  id, skill ("SQ" | "EQ" | "IQ" | null), index (0-6 or null), level, codeTitle, title, howTo, minutes,
  alt (one plain sentence describing the picture, for screen readers),
  files: { scene, scene1x, sceneWebp, card, icon, icon256, icon128 }

========================================================
6. HOW TO WORK
========================================================
Step 1, style frame. Make sq-0, eq-2 and iq-0 (scene and icon each). Put them together in style/style-frame.png and show it to me. Then STOP and wait for "approved" or my changes. Do not make the rest before I approve.

Step 2, batches. After approval, work in this order and show a contact sheet after each:
  Batch 1: the 7 SQ scenes. Batch 2: the 7 EQ scenes. Batch 3: the 7 IQ scenes.
  Batch 4: icons. Make the 7 icons of one skill plus that skill's emblem as ONE image, a strict 4 x 2 grid of equal 1024 px cells on a transparent background, each icon centred in its cell with nothing crossing the cell lines. Then cut the grid into 8 files in Python. Repeat for each skill. Do the same for the plan and topic icons.
  Batch 5: section 4D, the six sample activities.
- Make one image per scene, so each one gets full attention. Paste the whole Style Bible (section 2) into every image prompt, together with that activity's SCENE line.
- Before saving each image, check it and remake it if any of these fail:
  it shows exactly the how-to; the cast matches the style frame; hands and faces look right; there is no text anywhere; the background is transparent; the skill accent appears on 1 or 2 elements; there is clear space on every side; there is one soft ground shadow.

Step 3, packaging. In Python, resize and rename to section 5, build the card composites, write the manifest and README, make the contact sheet, and zip everything. Give me the download link to the zip.
- If your generated images aren't available to Python here, tell me in one line. I'll download that batch and upload it back. Then you package from the uploaded files.
- Keep chat replies short: a contact sheet per batch and one line on anything you changed. No long explanations.
```
