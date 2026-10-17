// Mock content. Started from the live app (see baseline/), then rewritten to the
// voice audit (references/VOICE-AUDIT-NOTES.md): plain words, goals instead of
// problems, no labels for parents or children, "they" for the child.

export type Skill = 'EQ' | 'SQ' | 'IQ'

export const SKILLS: Record<Skill, { name: string; long: string; bg: string; fg: string; icon: 'heart' | 'users' | 'bulb' }> = {
  EQ: { name: 'Emotional', long: 'Feelings & calm', bg: 'var(--eq-bg)', fg: 'var(--eq)', icon: 'heart' },
  SQ: { name: 'Social', long: 'Friends & sharing', bg: 'var(--sq-bg)', fg: 'var(--sq)', icon: 'users' },
  IQ: { name: 'Intelligence', long: 'Curiosity & focus', bg: 'var(--iq-bg)', fg: 'var(--iq)', icon: 'bulb' },
}

export type Step = { say: string; line?: string }
export type Activity = {
  id: string
  skill: Skill
  title: string
  topic: string
  minutes: number
  summary: string
  steps: Step[]
  magic: string
  support: string
  challenge: string
  practice: string
  observe: { q: string; options: string[] }
  read: string
}

const SNAP_LINE = 'There can be more than one good answer. Tell me the clue that made you pick yours.'

export const ACTIVITIES: Activity[] = [
  {
    id: 'emotion-snap',
    skill: 'EQ',
    title: 'What Would You Feel?',
    topic: 'Naming feelings',
    minutes: 5,
    summary: 'Six tiny everyday scenes. Your child names one feeling that could fit, and gives one clue.',
    steps: [
      { say: '“I’ll give you a tiny scene. Call out one feeling that could fit.”', line: SNAP_LINE },
      { say: 'Scene 1: your ice cream slips off the cone.', line: SNAP_LINE },
      { say: 'Scene 2: a friend saves you a seat.', line: SNAP_LINE },
      { say: 'Scene 3: you hear a strange noise in the next room.', line: SNAP_LINE },
      { say: 'Scene 4: you finally finish a tricky puzzle.', line: SNAP_LINE },
      { say: 'Scene 5: someone uses your pencil without asking.', line: SNAP_LINE },
      { say: 'Scene 6: Grandma calls to say she’s coming tomorrow.', line: SNAP_LINE },
      { say: 'Swap roles. Let them give you a scene to name.', line: '“Your turn to be the boss of the game.”' },
      { say: 'Ask which scene was the trickiest, and why.', line: '“Which one made you think the longest?”' },
      { say: 'Accept more than one feeling when it fits the scene.', line: '“You can feel two things at once. That’s normal.”' },
    ],
    magic: 'Give each feeling a silly sound: proud gets a tiny trumpet, surprised gets a “boing”, annoyed gets a grumbly “hmm”.',
    support: 'Offer two feelings to choose between instead of asking for one from scratch.',
    challenge: 'Ask for a feeling and what their body might do. Tight fists? A big smile? A slow walk?',
    practice: 'Once this week, when a feeling comes up, name it together in a few words. Keep it light, like a chat.',
    observe: {
      q: 'How did they name the feeling?',
      options: ['On their own, with a clue', 'After a little think', 'With a few prompts', 'Still warming up'],
    },
    read: 'Lots of children this age warm up slowly to feelings games. Joining in is what counts, at any speed.',
  },
  {
    id: 'conversation-snap',
    skill: 'SQ',
    title: 'How Do I Say Hello?',
    topic: 'Making friends',
    minutes: 5,
    summary: 'Three playground moments. Your child picks a way to say hello, and what they’d do next.',
    steps: [
      { say: '“Let’s practise saying hello. I’ll set the scene.”', line: '“There’s no wrong way to start.”' },
      { say: 'Scene 1: a new kid is sitting alone at lunch.', line: '“What could you say first?”' },
      { say: 'Scene 2: two kids are building with blocks.', line: '“How could you join in?”' },
      { say: 'Scene 3: someone has the same backpack as you.', line: '“What’s a fun thing to ask?”' },
      { say: 'Act one out together. You play the other kid.', line: '“Show me how you’d walk up.”' },
    ],
    magic: 'Use two toys as the kids and do the voices.',
    support: 'Give a starter: “Hi, I’m ___. Can I play?”',
    challenge: 'Ask what they’d do if the other kid says no.',
    practice: 'At the park this week, watch for one moment they say hello to someone. Tell them you saw it.',
    observe: { q: 'How did they start the conversation?', options: ['In their own words', 'After a little think', 'With a starter from me', 'Still warming up'] },
    read: 'Practising at home makes the real moment feel familiar. Small, easy goes are just right.',
  },
  {
    id: 'focus-hunt',
    skill: 'IQ',
    title: 'What Moved?',
    topic: 'Looking closely',
    minutes: 5,
    summary: 'Arrange a few objects. They close their eyes, you change one detail, they spot it.',
    steps: [
      { say: 'Put five small things on the table together.', line: '“Look closely. Can you remember where everything is?”' },
      { say: 'They close their eyes. Move one thing.', line: '“Okay, open! What changed?”' },
      { say: 'Now swap one thing for something new.', line: '“Detective time.”' },
      { say: 'Let them change something for you to find.', line: '“Try to trick me.”' },
    ],
    magic: 'Use a magnifying glass, or make one from a toilet roll.',
    support: 'Use three objects instead of five.',
    challenge: 'Change two things at once.',
    practice: 'On a walk, play “what’s different from yesterday?”',
    observe: { q: 'How did they find the change?', options: ['Quickly, and told me how', 'With a careful look', 'With a little hint', 'Still warming up'] },
    read: 'Noticing small changes is the root of good questions. Their focus grows each time you play.',
  },
  {
    id: 'feeling-word',
    skill: 'EQ',
    title: 'Guess the Feeling',
    topic: 'Naming feelings',
    minutes: 5,
    summary: 'A three-clue lightning round about a made-up character. They guess the feeling.',
    steps: [{ say: 'Give three clues about a character’s day.', line: '“Guess how they feel!”' }],
    magic: 'Use a funny voice for the character.',
    support: 'Give the first letter of the feeling.',
    challenge: 'Ask why the character might feel that way.',
    practice: 'Name your own feelings out loud once a day.',
    observe: { q: 'How did they guess?', options: ['First try', 'After a few clues', 'With a little help', 'Still warming up'] },
    read: 'Guessing how someone else feels is where kindness starts.',
  },
  {
    id: 'speech-bubbles',
    skill: 'SQ',
    title: 'Make Speech Bubbles',
    topic: 'Making friends',
    minutes: 20,
    summary: 'Build a strip of speech bubbles for four moments and match words to situations.',
    steps: [{ say: 'Draw four empty speech bubbles together.', line: '“What could each person say?”' }],
    magic: 'Cut the bubbles out and stick them on the fridge.',
    support: 'Write two choices for each bubble.',
    challenge: 'Add what the other person says back.',
    practice: 'Keep the strip for the next playdate.',
    observe: { q: 'How did they fill the bubbles?', options: ['Their own ideas', 'After we talked', 'With my words', 'Still warming up'] },
    read: 'Seeing words on paper helps them pick them up in the moment.',
  },
  {
    id: 'focus-fortress',
    skill: 'IQ',
    title: 'Three Rounds, Three Bricks',
    topic: 'Sticking with it',
    minutes: 20,
    summary: 'They pick a task they enjoy and work in three short rounds with checkpoints.',
    steps: [{ say: 'Pick a task together and set three checkpoints.', line: '“Let’s build your fort, one brick at a time.”' }],
    magic: 'Each round earns a paper brick for the fort.',
    support: 'Make the rounds shorter.',
    challenge: 'Add a fourth round.',
    practice: 'Use checkpoints for homework this week.',
    observe: { q: 'How did they keep going?', options: ['All three rounds', 'Two rounds', 'One round', 'Still warming up'] },
    read: 'Short rounds with a clear finish help them keep going for longer.',
  },
]

export const READS = [
  { id: 'r1', kind: 'Read', title: 'Big feelings at six', minutes: 4, tint: 'var(--accent-soft)', art: 'book' as const },
  { id: 'r2', kind: 'Listen', title: 'Calm before you correct', minutes: 8, tint: 'var(--card)', art: 'headphones' as const },
  { id: 'r3', kind: 'Read', title: 'Helping them understand the why', minutes: 5, tint: 'var(--card)', art: 'book' as const },
  { id: 'r4', kind: 'Listen', title: 'Calmer bedtimes', minutes: 12, tint: 'var(--sand)', art: 'headphones' as const },
]

export const VIDEOS = [
  { id: 'v1', title: 'Staying calm together', topic: 'Staying calm', minutes: 2, tint: 'var(--sand)', body: 'When your child has a big feeling, yours can rise too, more so when others are watching. A short video on calming yourself first, so your child has somewhere steady to come back to.' },
  { id: 'v2', title: 'The words we use', topic: 'Kind words', minutes: 1, tint: 'var(--sand)', body: 'The quick words we use about our children often become the words they use about themselves.' },
  { id: 'v3', title: 'Helping siblings get along', topic: 'Siblings', minutes: 1, tint: 'var(--sand)', body: 'Most sibling squabbles are about fairness and attention. Here’s what to say instead of “share!”' },
  { id: 'v4', title: 'Making the truth feel safe', topic: 'Honesty', minutes: 1, tint: 'var(--sand)', body: 'When a child hides the truth, they are often worried about how we’ll react. A short video on making honesty feel safe.' },
]

export const CHALLENGES = [
  { id: 'screen', title: 'Easing off screens', icon: 'clock' as const, tint: 'var(--card)' },
  { id: 'dinner', title: 'Happy mealtimes', icon: 'heart' as const, tint: 'var(--card)' },
  { id: 'bedtime', title: 'Smoother bedtimes', icon: 'sparkle' as const, tint: 'var(--card)' },
  { id: 'tantrum', title: 'Calm when we’re out', icon: 'bulb' as const, tint: 'var(--card)' },
  { id: 'siblings', title: 'Siblings getting along', icon: 'shuffle' as const, tint: 'var(--card)' },
  { id: 'homework', title: 'Homework, made easier', icon: 'book' as const, tint: 'var(--card)' },
  { id: 'readers', title: 'Little readers', icon: 'bookmark' as const, tint: 'var(--card)' },
  { id: 'backtalk', title: 'Kind words at home', icon: 'chat' as const, tint: 'var(--card)' },
]

export const BEDTIME_PLAN = [
  { title: 'Start the wind-down', body: 'After dinner, dim the lights and say: “Wind-down time now.”' },
  { title: 'One quiet activity', body: 'At bedtime, hand them a book and say: “One quiet story, then bed.”' },
  { title: 'Say the next step', body: 'When they want more time, say: “Next is teeth, then bed.”' },
  { title: 'Offer a small choice', body: '“Teeth first or pyjamas first?”' },
  { title: 'Listen first, then guide', body: '“I see you want more time. Let’s talk about it once you’re in bed.”' },
  { title: 'Use a timer together', body: 'Set five minutes and say: “Five minutes to get ready for bed.”' },
  { title: 'End with a connection', body: 'Just before lights out: “Tell me one good thing from your day.”' },
]

export const SUGGESTIONS = (child: string) => [
  `${child} has been unsettled all evening and I don’t know why`,
  'How can bedtime feel calmer?',
  'How can I stay calm when I’m already tired?',
  `Is it too early to expect a routine from ${child}?`,
]

export const ANSWER = (child: string) => ({
  topic: 'Sleep & bedtime',
  why: [
    `Bedtime with ${child} takes a long time most nights, and it can feel endless.`,
    'For many children, bedtime is the biggest goodbye of the day. Asking for one more story is a way to stay close a little longer.',
    'You’ve already spotted the pattern. That’s the first step.',
  ],
  // the quick fix: what often happens, said without "you" and without judging
  bonsai: ['Agreeing to one more story, then another, until everyone is tired.', 'A firm “bed, now!” that works for tonight.'],
  bonsaiResult: 'The same moment usually comes back tomorrow.',
  say: '“I’ve got you. One story, then lights out.”',
  ceo: ['Decide before bedtime how many stories there will be.', 'Stay warm and steady at the same time.'],
  ceoResult: `${child} starts to trust the routine and settles more easily.`,
  practice: 'This week, pick three bedtime steps and do them in the same order every night.',
  checkin: 'Did we keep the same three steps tonight?',
  closing: 'A bedtime that ends the same way each night feels safe and easy.',
})

export const ONBOARDING = {
  grow: [
    ['🤝', 'Making friends'],
    ['🎁', 'Sharing'],
    ['💗', 'Naming feelings'],
    ['🌬️', 'Calming down'],
    ['💪', 'Confidence'],
    ['⏳', 'Patience'],
    ['🔎', 'Curiosity'],
    ['🌸', 'Kindness'],
  ],
  // "Where would you like a little help?" Each one names the goal, not the problem.
  hard: [
    ['🌙', 'Settling at bedtime'],
    ['🍽️', 'Happy mealtimes'],
    ['🌈', 'Big feelings'],
    ['🧸', 'Sharing & turns'],
    ['👂', 'Listening together'],
    ['👫', 'Siblings getting along'],
    ['⏰', 'Calmer mornings'],
    ['📱', 'Easing off screens'],
    ['🌼', 'Feeling brave'],
    ['🫶', 'Feeling safe'],
    ['💬', 'Kind words'],
    ['📚', 'Homework & focus'],
  ],
  tried: [
    ['🗣️', 'Talking it through'],
    ['📵', 'Less screen time'],
    ['⭐', 'Rewards & stickers'],
    ['🍬', 'Skipping a treat'],
    ['🔍', 'Googling at midnight'],
    ['👩‍🏫', 'Asking family or teachers'],
  ],
  extra: [
    ['🌱', 'Arrived a little early'],
    ['💬', 'Still finding their words'],
    ['🌊', 'Takes time to settle'],
    ['🏫', 'Just started school'],
    ['🧩', 'Needs a little extra support'],
  ],
  time: [
    ['⏱️', '1–5 min', 'A quick moment'],
    ['☕', '5–10 min', 'A cup of tea’s worth'],
    ['🌿', '10–20 min', 'A proper play'],
    ['🔀', 'It varies', 'We’ll keep it flexible'],
  ],
}

export const TREES = ['Pine', 'Banyan', 'Coconut palm', 'Oak', 'Sakura', 'Willow', 'Bamboo', 'Acacia', 'Mango', 'Maple', 'Birch', 'Cypress', 'Jacaranda', 'Cedar', 'Olive', 'Baobab', 'Apple', 'Sequoia', 'Elm', 'Eucalyptus', 'Flame tree']
