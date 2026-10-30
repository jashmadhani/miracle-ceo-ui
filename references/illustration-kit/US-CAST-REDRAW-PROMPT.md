# Redraw prompt: American cast for all 27 activity illustrations

The current 27 activity pictures were drawn for an Indian family (kurta, saree, steel tumbler,
tiffin box, tulsi). The app is now aimed at US parents, so every scene needs the same action
redrawn with an American family and an American home.

## How to use this

1. Open a new ChatGPT chat with a model that can make images.
2. Attach `style-reference-family.png` (the house style) and, if you have it, one of the old sheets
   so it can match line weight and colours.
3. Paste everything in the box below as your first message.
4. Approve the style frame (3 scenes), then let it finish the rest.
5. Save each result into `src/art/illustrations/activities/` with the same file name as the
   one it replaces (for example `sq-0.webp`). The app picks them up with no code change.
   Or send the PNGs to Claude to cut out, crop and export to `.webp`.

The cast below is a guess at a typical US family. Change names, looks or the family set-up
before you paste if you want something different.

```text
Redraw 27 illustrations for a US parenting app. Keep the exact house style of the attached
reference: soft painterly 2D, plum outlines, flat colour with light grain, simple kind faces,
warm light from the top left, one soft contact shadow, transparent or pure white background,
no room or frame, clear space on every side, and no text, letters, numbers, logos or watermark
anywhere. One image per scene, landscape 3:2, as large as you can.

AUDIENCE AND SETTING
Parents of children aged 3 to 8 in the United States. Every scene should feel like an ordinary
American home or neighborhood: jeans, t-shirts, hoodies, sweaters, sneakers; a sofa with throw
pillows, a kitchen counter, a rug, a houseplant, a backyard, a sidewalk. Nothing that reads as a
specific other country: no kurta, saree, dupatta, steel tumbler, tiffin box, floor mats for
sitting, or tulsi plant.

RECURRING CAST (identical in every image)
- Mom, Sarah, mid 30s: light skin, wavy chestnut hair in a loose ponytail, denim shirt or a soft
  cream sweater, jeans.
- Dad, Marcus, mid 30s: Black, short hair, neat short beard, crewneck sweater or flannel shirt,
  chinos.
- Lily, daughter, about 6: light-brown skin, curly light-brown hair in two puffs with a small
  flower clip, striped t-shirt and leggings.
- Noah, son, about 4: light-brown skin, short curly dark hair, round cheeks, dinosaur t-shirt
  and shorts.
- Grandma, Ellen: white hair in a short bob, cardigan, glasses on a chain. Use sparingly.
- Sofia, Lily's friend, about 6: Latina, long dark hair in a braid, yellow hoodie. Only in
  Social scenes that need a second child.
One parent plus one child per scene unless the brief says otherwise. Alternate Mom and Dad,
and Lily and Noah, across the set.

SKILL ACCENT (use on 1 or 2 elements per image, such as the child's top or the main prop)
- Social (sq-*, conversation-snap, speech-bubbles): green-teal #3E8A80
- Emotional (eq-*, emotion-snap, feeling-word): coral #EC6F7D
- Intelligence (iq-*, focus-hunt, focus-fortress): marigold #F4B23F

THE 27 SCENES (file name, then what happens)
sq-0  In the kitchen, Lily hands Mom a glass of water. Mom takes it with one hand on her heart, beaming. Lily looks proud.
sq-1  On the living-room rug with a blank board game, Noah holds the die up and points at Dad with a big announcing gesture. Dad waits, smiling.
sq-2  Dad hands a wooden toy elephant to Lily. She holds it, thinking, while Sofia sits close by, hopeful.
sq-3  Morning. Noah proudly waters a potted houseplant on the windowsill with a small can while Mom watches from behind, smiling.
sq-4  Mom kneels to Lily's height, holding her hands. They look into each other's eyes and both smile before speaking.
sq-5  Dad holds up an apple in one hand and a banana in the other. Noah points happily at one.
sq-6  On a sofa with throw pillows, Mom and Lily share an open picture book with blank pages. Lily points to one of two paths drawn on the page.
eq-0  Noah sits on the sofa with a small pout, arms crossed. Dad sits beside him and gently touches his own cheek, naming what he sees. Kind, no scolding.
eq-1  Mom, a little tired, sits on the rug with her hand on her chest, sharing. Lily leans on her knee, listening closely.
eq-2  Dad and Noah sit cross-legged on the rug facing each other, eyes closed, chests full, soft breath swirls between them.
eq-3  Lily points to her tummy, where a soft warm glow shows. Mom crouches and asks gently, with an open hand.
eq-4  Dad and Noah hug warmly on the rug. Beside them a block tower that fell over earlier is half rebuilt.
eq-5  Lily and Grandma sit together on a porch swing. Lily thinks with a finger on her chin, and a soft thought cloud above her shows a simple friend's face.
eq-6  Noah, cheeks still pink from crying, now smiling, sits in Mom's lap in an armchair. A small cloud with a rainbow floats above them.
iq-0  Lily points up, asking why. Dad crouches beside her with a curious look and turns the question back. She thinks, finger on chin, a small lightbulb glow near her.
iq-1  At the kitchen table, Noah sorts colorful buttons into three small bowls by color. Mom watches, chin on her hand.
iq-2  Mom holds a half-closed picture book. Lily tells the ending with wide arms, and a dreamy cloud above shows a friendly elephant flying.
iq-3  Dad and Noah walk hand in hand down a sidewalk, backpack on Noah's back. Noah holds up three fingers, counting mailboxes along the street.
iq-4  At the kitchen table, Lily holds a closed lunchbox near her ear, guessing. Dad waits with a playful look, ready to open it.
iq-5  In the backyard, Noah peers through a big magnifying glass at a pinecone. Mom leans in, equally curious.
iq-6  Lily plays teacher at a small blank easel chalkboard. Dad sits cross-legged on the rug as the student with his hand raised.
emotion-snap       "What Would You Feel?": Mom sits with Noah on the sofa holding up a simple blank picture card of an everyday moment; Noah thinks, then makes a small surprised face to show the feeling.
conversation-snap  "How Do I Say Hello?": at a playground, Lily waves hello to Sofia by the slide while Dad stands just behind her, encouraging.
focus-hunt         "What Moved?": at the coffee table, Noah covers his eyes with both hands while Dad quietly moves one of four small toys (a car, a cup, a block, a duck).
feeling-word       Mom sits on the rug holding up a simple sock puppet acting out a feeling (two button eyes, a small droopy frown). Noah sits facing her, finger on his chin, about to guess.
speech-bubbles     Dad and Lily lie on their tummies on the rug over a big sheet of paper, each holding a crayon, drawing four EMPTY speech-bubble shapes. The bubbles stay completely blank.
focus-fortress     Lily proudly places a small paper brick on top of a little paper fort she's building on a coffee table; two bricks are already on it. Mom sits beside her smiling, holding a blank worksheet.

Start with sq-0, eq-0 and iq-0 as a style frame and wait for my approval before the rest.
```
