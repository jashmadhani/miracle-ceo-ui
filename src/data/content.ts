// Mock content. Copy is taken from the live app (see baseline/) so the redesign
// is judged on design, not on different words.

export type Skill = 'EQ' | 'SQ' | 'IQ'

export const SKILLS: Record<Skill, { name: string; long: string; bg: string; fg: string; icon: 'heart' | 'users' | 'bulb' }> = {
  EQ: { name: 'Emotional', long: 'Feelings & calm', bg: 'var(--sand)', fg: 'var(--eq)', icon: 'heart' },
  SQ: { name: 'Social', long: 'Friends & sharing', bg: 'var(--sand)', fg: 'var(--sq)', icon: 'users' },
  IQ: { name: 'Intelligence', long: 'Curiosity & focus', bg: 'var(--sand)', fg: 'var(--iq)', icon: 'bulb' },
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
    title: 'Emotion Snap',
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
    challenge: 'Ask for a feeling and what their body might do — tight fists, a big smile, a slow walk.',
    practice: 'Once this week, when a feeling comes up naturally, name it briefly together — without turning it into a quiz.',
    observe: {
      q: 'How did they name the feeling?',
      options: ['On their own, with a clue', 'After thinking it over', 'With a few prompts', 'Not this time'],
    },
    read: 'Warming up slowly is very typical at this age — big-feeling work asks a lot. That they joined in at all matters more than how fast.',
  },
  {
    id: 'conversation-snap',
    skill: 'SQ',
    title: 'Conversation Quick Snap',
    topic: 'Making friends',
    minutes: 5,
    summary: 'Three playground moments. Your child picks a way to say hello and what they’d do next.',
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
    practice: 'At the park this week, notice one moment they start a conversation — and tell them you saw it.',
    observe: { q: 'How did they start the conversation?', options: ['Confidently, own words', 'After a little think', 'Used a starter I gave', 'Not this time'] },
    read: 'Rehearsing at home makes the real moment feel familiar. Small, low-stakes practice is exactly right.',
  },
  {
    id: 'focus-hunt',
    skill: 'IQ',
    title: 'Five Minute Focus Hunt',
    topic: 'Asking better questions',
    minutes: 5,
    summary: 'Arrange a few objects. They close their eyes, you change one detail, they spot it.',
    steps: [
      { say: 'Put five small things on the table together.', line: '“Look closely — remember where everything is.”' },
      { say: 'They close their eyes. Move one thing.', line: '“Okay, open! What changed?”' },
      { say: 'Now swap one thing for something new.', line: '“Detective time.”' },
      { say: 'Let them change something for you to find.', line: '“Try to trick me.”' },
    ],
    magic: 'Use a magnifying glass, or make one from a toilet roll.',
    support: 'Use three objects instead of five.',
    challenge: 'Change two things at once.',
    practice: 'On a walk, play “what’s different from yesterday?”',
    observe: { q: 'How did they find the change?', options: ['Quickly, explained how', 'With a careful look', 'Needed a hint', 'Not this time'] },
    read: 'Noticing small changes is the root of good questions. Their focus grows each time you play.',
  },
  {
    id: 'feeling-word',
    skill: 'EQ',
    title: 'Feeling Word',
    topic: 'Naming feelings',
    minutes: 5,
    summary: 'A three-clue lightning round about a made-up character. They guess the feeling.',
    steps: [{ say: 'Give three clues about a character’s day.', line: '“Guess how they feel!”' }],
    magic: 'Use a funny voice for the character.',
    support: 'Give the first letter of the feeling.',
    challenge: 'Ask why the character might feel that way.',
    practice: 'Name your own feelings out loud once a day.',
    observe: { q: 'How did they guess?', options: ['First try', 'After a few clues', 'With help', 'Not this time'] },
    read: 'Guessing others’ feelings is how empathy starts.',
  },
  {
    id: 'speech-bubbles',
    skill: 'SQ',
    title: 'Conversation Speech Bubbles',
    topic: 'Making friends',
    minutes: 20,
    summary: 'Build a strip of speech bubbles for four moments and match words to situations.',
    steps: [{ say: 'Draw four empty speech bubbles together.', line: '“What could each person say?”' }],
    magic: 'Cut the bubbles out and stick them on the fridge.',
    support: 'Write two choices for each bubble.',
    challenge: 'Add what the other person says back.',
    practice: 'Keep the strip for the next playdate.',
    observe: { q: 'How did they fill the bubbles?', options: ['Own ideas', 'With some talk', 'With my words', 'Not this time'] },
    read: 'Seeing words on paper helps them pick them up in the moment.',
  },
  {
    id: 'focus-fortress',
    skill: 'IQ',
    title: 'Focus Fortress',
    topic: 'Figuring things out',
    minutes: 20,
    summary: 'They pick a task they enjoy and work in three short rounds with checkpoints.',
    steps: [{ say: 'Pick a task together and set three checkpoints.', line: '“Let’s build your focus fortress.”' }],
    magic: 'Each checkpoint earns a brick for a paper fortress.',
    support: 'Make the rounds shorter.',
    challenge: 'Add a fourth round.',
    practice: 'Use checkpoints for homework this week.',
    observe: { q: 'How did they keep going?', options: ['All three rounds', 'Two rounds', 'One round', 'Not this time'] },
    read: 'Short rounds with clear ends build stamina without a fight.',
  },
]

export const READS = [
  { id: 'r1', kind: 'Read', title: 'Big feelings at six', minutes: 4, tint: 'var(--accent-soft)', art: 'book' as const },
  { id: 'r2', kind: 'Listen', title: 'Calm before you correct', minutes: 8, tint: 'var(--card)', art: 'headphones' as const },
  { id: 'r3', kind: 'Read', title: 'Why “because I said so” stops working', minutes: 5, tint: 'var(--card)', art: 'book' as const },
  { id: 'r4', kind: 'Listen', title: 'Bedtime without the battle', minutes: 12, tint: 'var(--sand)', art: 'headphones' as const },
]

export const VIDEOS = [
  { id: 'v1', title: 'Two nervous systems in the room', topic: 'Staying calm', minutes: 2, tint: 'var(--sand)', body: 'When your child melts down, your own frustration often rises too — especially with others watching. A short watch on calming yourself first, so your child has somewhere steady to return to.' },
  { id: 'v2', title: 'The labels we don’t notice', topic: 'Words we use', minutes: 1, tint: 'var(--sand)', body: 'The quick words we use about our children quietly become the words they use about themselves.' },
  { id: 'v3', title: 'Sibling fights are rarely about the toy', topic: 'Siblings', minutes: 1, tint: 'var(--sand)', body: 'Most sibling fights are about fairness and attention. What to say instead of “share!”.' },
  { id: 'v4', title: 'Why children hide the truth', topic: 'Honesty', minutes: 1, tint: 'var(--sand)', body: 'Lying usually means a child is afraid of the reaction, not that they don’t know right from wrong.' },
]

export const CHALLENGES = [
  { id: 'screen', title: 'Screen time battles', icon: 'clock' as const, tint: 'var(--card)' },
  { id: 'dinner', title: 'Dinner table wars', icon: 'heart' as const, tint: 'var(--card)' },
  { id: 'bedtime', title: 'Bedtime stalling', icon: 'sparkle' as const, tint: 'var(--card)' },
  { id: 'tantrum', title: 'Tantrums in public', icon: 'bulb' as const, tint: 'var(--card)' },
  { id: 'siblings', title: 'Sibling fights', icon: 'shuffle' as const, tint: 'var(--card)' },
  { id: 'homework', title: 'Homework resistance', icon: 'book' as const, tint: 'var(--card)' },
  { id: 'readers', title: 'Budding readers', icon: 'bookmark' as const, tint: 'var(--card)' },
  { id: 'backtalk', title: 'Back-talk', icon: 'chat' as const, tint: 'var(--card)' },
]

export const BEDTIME_PLAN = [
  { title: 'Start the wind-down', body: 'After dinner, dim the lights and say: “Wind-down time now.”' },
  { title: 'One quiet activity', body: 'At bedtime, hand them a book and say: “One quiet story, then bed.”' },
  { title: 'Set a clear next step', body: 'When they stall, say: “Next is teeth, then bed.”' },
  { title: 'Offer a small choice', body: '“Teeth first or pyjamas first?”' },
  { title: 'Connect before redirect', body: '“I see you want more time. Let’s talk about it once you’re in bed.”' },
  { title: 'Use a timer together', body: 'Set five minutes and say: “Five minutes to get ready for bed.”' },
  { title: 'End with a connection', body: 'Just before lights out: “Tell me one good thing from your day.”' },
]

export const SUGGESTIONS = (child: string) => [
  `${child} has been unsettled all evening and I don’t know why`,
  'Why does bedtime take so long?',
  'How do I stop shouting when I’m already tired?',
  `Is it too early to expect a routine from ${child}?`,
]

export const ANSWER = (child: string, he: string) => ({
  topic: 'Sleep & bedtime',
  why: [
    `${child} stalls at bedtime every night, and it feels endless.`,
    'This isn’t defiance. For many children bedtime is the day’s biggest separation, and stalling is a way to stretch the connection.',
    'You’ve noticed the pattern — and that’s the whole skill.',
  ],
  bonsai: ['Negotiates under pressure, holding the line only while patience lasts.', 'Takes stalling as rejection, and reads “one more story” as testing.'],
  bonsaiResult: 'Bedtime happens through negotiation and exhaustion.',
  say: '“I’ve got you. One story, then lights out.”',
  ceo: ['Decides in advance exactly how many stories bedtime includes.', 'Holds warmth and certainty in the same breath.'],
  ceoResult: `${he} begins to trust the sequence and settles instead of testing.`,
  practice: 'This week, run the Three-Step Bedtime Closing: choose three fixed steps and repeat them in the same order.',
  checkin: 'Am I running the same closing sequence, even on hard nights?',
  closing: 'Bedtime doesn’t need to be won each night. It needs to be closed the same way every night.',
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
  hard: [
    ['🌙', 'Bedtime'],
    ['🍽️', 'Eating'],
    ['🌋', 'Big emotions'],
    ['🧸', 'Sharing & turns'],
    ['🙉', 'Listening'],
    ['👫', 'Sibling fights'],
    ['⏰', 'Chaotic mornings'],
    ['📱', 'Screen time'],
    ['🙈', 'Shyness'],
    ['😟', 'Worries & fears'],
    ['🗣️', 'Answering back'],
    ['📚', 'Homework & focus'],
  ],
  tried: [
    ['🗣️', 'Reasoning with them'],
    ['📵', 'Taking away screens'],
    ['⭐', 'Rewards & points'],
    ['🚫', 'No outings or treats'],
    ['🔍', 'Googling at midnight'],
    ['👩‍🏫', 'Asking family or teachers'],
  ],
  extra: [
    ['🌱', 'Born a little early'],
    ['💬', 'Still finding their words'],
    ['🌊', 'Big feelings, slow to settle'],
    ['🏫', 'Just started school'],
    ['🧩', 'Has a special need'],
  ],
  time: [
    ['⏱️', '1–5 min', 'A quick moment'],
    ['☕', '5–10 min', 'A cup of tea’s worth'],
    ['🌿', '10–20 min', 'A proper play'],
    ['🔀', 'It varies', 'We’ll keep it flexible'],
  ],
}

export const TREES = ['Pine', 'Banyan', 'Coconut palm', 'Oak', 'Sakura', 'Willow', 'Bamboo', 'Acacia', 'Mango', 'Maple', 'Birch', 'Cypress', 'Jacaranda', 'Cedar', 'Olive', 'Baobab', 'Apple', 'Sequoia', 'Elm', 'Eucalyptus', 'Flame tree']
