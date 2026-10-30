import type { Activity, Skill } from './content'

/*
 * The 21-activity catalogue from the v62 build: seven per skill, one per level.
 * ids match v62's code (sq-0 … iq-6 = ACTS[k][i]) and the illustration files in
 * src/art/illustrations/activities. Titles are the voice audit's; topics are
 * named for what each activity does; how-tos, lengths and question families
 * come from v62, with the answer options
 * reworded so none of them describes the child in negatives.
 */

type Family = { q: string; options: string[]; read: string }

const FAMILIES: Record<string, Family> = {
  notice: {
    q: 'Did they notice you?',
    options: ['Caught my eye first', 'Noticed when I waited', 'Needed to hear their name', 'Busy in their own world'],
    read: 'Noticing someone else is where every friendship starts. It grows quickly once it’s noticed back.',
  },
  sharing: {
    q: 'What did they do with the toy?',
    options: ['Handed it over straight away', 'Gave it after a pause', 'Took it back soon', 'Kept it close for now'],
    read: 'Sharing is a skill, not a manner. A pause before giving is your child weighing it up, and that counts.',
  },
  turns: {
    q: 'How did the turn-taking go?',
    options: ['Waited for their turn', 'Waited with reminders', 'Jumped in early', 'Wanted to move on'],
    read: 'Waiting is hard at this age. Every round where they hold on a little longer is real progress.',
  },
  choose: {
    q: 'How did they choose?',
    options: ['Picked straight away', 'Thought about it first', 'Asked for something else', 'Wanted me to choose'],
    read: 'Small, safe choices build the confidence for bigger ones. Two options you’re happy with keeps it easy for you both.',
  },
  feelings: {
    q: 'What did they do with the feeling?',
    options: ['Named it themselves', 'Agreed when I named it', 'Wasn’t ready for words yet', 'Still finding the word'],
    read: 'Putting a word to a feeling makes it smaller. Hearing you name yours helps them find theirs.',
  },
  calm: {
    q: 'How did the big feeling pass?',
    options: ['Settled with me nearby', 'Took a while, then settled', 'Needed to move it out first', 'Needed a long cuddle'],
    read: 'Children borrow our calm before they have their own. Staying close is the whole lesson.',
  },
  repair: {
    q: 'How did coming back together go?',
    options: ['They came to me', 'Came when I opened my arms', 'Came back after a little while', 'Needed more time'],
    read: 'Making up shows them that a wobble doesn’t break anything between you. That feeling of safety lasts.',
  },
  curious: {
    q: 'What did they do with the question?',
    options: ['Asked another one back', 'Thought before answering', 'Gave a quick answer', 'Wanted something else today'],
    read: 'Curious children learn by wondering out loud. Your interest in their answer keeps the questions coming.',
  },
  persist: {
    q: 'What happened when it got tricky?',
    options: ['Kept trying on their own', 'Kept going with me beside them', 'Wanted me to help', 'Moved on quickly'],
    read: 'Sticking with something a little longer is a muscle. It grows each time you stay beside them.',
  },
}

type Entry = {
  id: string
  title: string
  topic: string
  minutes: number
  summary: string
  steps: [string, string][]
  practice: string
  family: keyof typeof FAMILIES
}

const SQ: Entry[] = [
  {
    id: 'sq-0', title: 'Thank You, Little Helper', topic: 'Helping out', minutes: 5, family: 'notice',
    summary: 'Ask for one small thing and thank them for exactly that.',
    steps: [
      ['Pick one small, easy thing you need right now.', '“Could you pass me the cup, please?”'],
      ['When they do it, thank them for that exact thing.', '“Thank you for bringing me the cup. That helped.”'],
      ['Notice how helping felt for them.', '“You look pleased. Helping feels good, doesn’t it?”'],
    ],
    practice: 'Once a day this week, ask for one small thing and thank them for exactly that.',
  },
  {
    id: 'sq-1', title: 'Whose Turn Is It?', topic: 'Taking turns', minutes: 15, family: 'turns',
    summary: 'Play one round where they announce whose turn it is.',
    steps: [
      ['Set up any simple game with turns, like dice or cards.', '“You’re in charge of turns today.”'],
      ['Before each go, let them call out whose turn it is.', '“Whose turn is it now?”'],
      ['Follow their call, even when it’s their own turn.', '“You said it’s your turn. Off you go.”'],
    ],
    practice: 'This week, let them be the one who calls turns at one game or meal.',
  },
  {
    id: 'sq-2', title: 'Your Toy, Your Choice', topic: 'Sharing', minutes: 30, family: 'sharing',
    summary: 'Hand over one toy and let them decide what happens to it.',
    steps: [
      ['Hand them one toy they like.', '“This one is yours to decide about.”'],
      ['Let them choose: keep it, share it or swap it.', '“What would you like to do with it?”'],
      ['Go with their choice without nudging.', '“You decided. That’s fine with me.”'],
    ],
    practice: 'Once this week, give them one real choice about a toy and stick with what they decide.',
  },
  {
    id: 'sq-3', title: 'My Very Own Job', topic: 'Lending a hand', minutes: 60, family: 'persist',
    summary: 'Give them one job in the routine that is only theirs.',
    steps: [
      ['Choose one small job in the day that can be theirs, like watering a plant.', '“This job is yours now.”'],
      ['Show it once, slowly, then hand it over.', '“Your turn. I’ll watch.”'],
      ['Thank them for the job, not for being good.', '“The plant got its water because of you.”'],
    ],
    practice: 'Keep the same job theirs every day this week.',
  },
  {
    id: 'sq-4', title: 'Look, Smile, Then Talk', topic: 'Kind words', minutes: 5, family: 'notice',
    summary: 'Catch their eye once before you speak.',
    steps: [
      ['Go to their height before you say anything.', 'Kneel or sit so your eyes meet.'],
      ['Wait for their eyes, then smile.', 'No words yet. Just the look.'],
      ['Now say what you came to say, softly.', '“Dinner’s in five minutes, love.”'],
    ],
    practice: 'Once a day this week, catch their eye and smile before you speak.',
  },
  {
    id: 'sq-5', title: 'This One or That One?', topic: 'Making choices', minutes: 15, family: 'choose',
    summary: 'Offer two options, both of which you are happy with.',
    steps: [
      ['Pick two options you’re happy with either way.', '“Mango or banana?”'],
      ['Hold both up and let them point.', '“Which one would you like?”'],
      ['Go with their pick, no second guessing.', '“Mango it is.”'],
    ],
    practice: 'Offer two good options at one moment each day this week.',
  },
  {
    id: 'sq-6', title: 'You Pick What Happens Next', topic: 'Playing together', minutes: 30, family: 'curious',
    summary: 'Read one story where they choose what happens next.',
    steps: [
      ['Read a story together and stop at an exciting moment.', '“Oh no, what should she do now?”'],
      ['Offer two ways the story could go.', '“Does she climb the tree or call a friend?”'],
      ['Carry on the story their way.', '“Up the tree she goes!”'],
    ],
    practice: 'At one bedtime story this week, let them choose what happens next.',
  },
]

const EQ: Entry[] = [
  {
    id: 'eq-0', title: 'Name That Feeling', topic: 'Spotting feelings', minutes: 15, family: 'feelings',
    summary: 'Name one feeling out loud when you spot it on their face.',
    steps: [
      ['Watch for a feeling showing on their face.', 'A pout, a frown, a big grin.'],
      ['Name it gently, as a guess.', '“You look a bit cross. Is that right?”'],
      ['Let them agree or change the word.', '“Not cross, more sad? Thank you for telling me.”'],
    ],
    practice: 'Name one feeling you notice on their face each day this week.',
  },
  {
    id: 'eq-1', title: 'I Share My Feeling First', topic: 'Naming it out loud', minutes: 5, family: 'feelings',
    summary: 'Say your own feeling first, in four words.',
    steps: [
      ['Notice how you feel right now.', 'Tired, happy, a bit worried?'],
      ['Say it in four simple words.', '“I feel a bit tired.”'],
      ['Then ask about theirs.', '“How are you feeling?”'],
    ],
    practice: 'Share your own feeling first once a day this week.',
  },
  {
    id: 'eq-2', title: 'Breathe Together', topic: 'The pause', minutes: 30, family: 'calm',
    summary: 'Take one slow breath together before answering.',
    steps: [
      ['Sit facing each other.', '“Let’s take one big breath together.”'],
      ['Breathe in slowly through your nose.', '“In, like smelling a flower.”'],
      ['Breathe out slowly, then answer.', '“Out, like blowing a candle. Now, tell me.”'],
    ],
    practice: 'Take one breath together before answering, once a day this week.',
  },
  {
    id: 'eq-3', title: 'Where Does the Feeling Live?', topic: 'Big feelings, small body', minutes: 15, family: 'feelings',
    summary: 'Ask where in the body the big feeling lives.',
    steps: [
      ['When a big feeling shows up, stay close and calm.', '“That’s a big feeling.”'],
      ['Ask where they feel it.', '“Where does it live in your body?”'],
      ['Put a gentle hand there if they’d like.', '“In your tummy? Let’s breathe there together.”'],
    ],
    practice: 'Ask where a feeling lives in the body once this week.',
  },
  {
    id: 'eq-4', title: 'Make Up and Hug', topic: 'Making up', minutes: 60, family: 'repair',
    summary: 'Go back to a wobble from earlier and repair it.',
    steps: [
      ['Think of a wobble from earlier today.', 'A raised voice, a rushed moment.'],
      ['Go back to it, simply.', '“Earlier I got cross. I’m sorry.”'],
      ['Offer a hug and fix one small thing together.', '“Shall we build the tower again?”'],
    ],
    practice: 'Make up after one wobble this week, the same day.',
  },
  {
    id: 'eq-5', title: 'How Did They Feel Today?', topic: 'Other people’s feelings', minutes: 30, family: 'feelings',
    summary: 'Ask how someone else felt today.',
    steps: [
      ['Pick someone from their day, a friend or a grandparent.', '“Think about Meera at school.”'],
      ['Ask how that person might have felt.', '“How do you think she felt today?”'],
      ['Ask what made them think so.', '“What made you think that?”'],
    ],
    practice: 'Once this week, ask how someone else felt that day.',
  },
  {
    id: 'eq-6', title: 'All Calm Again', topic: 'Feelings have an end', minutes: 5, family: 'calm',
    summary: 'Say out loud when a hard feeling has passed.',
    steps: [
      ['Wait for a hard feeling to pass on its own.', 'Stay close. No rush.'],
      ['When it’s over, name that it passed.', '“The big feeling has gone. You’re calm again.”'],
      ['Notice how their body feels now.', '“Your shoulders feel soft now.”'],
    ],
    practice: 'Say out loud when a hard feeling has passed, once this week.',
  },
]

const IQ: Entry[] = [
  {
    id: 'iq-0', title: 'What Do You Think?', topic: 'Asking why', minutes: 30, family: 'curious',
    summary: 'Ask what they think before you answer a why.',
    steps: [
      ['When they ask a why, pause before answering.', '“Why is the moon out in the day?”'],
      ['Turn it back gently.', '“Hmm. What do you think?”'],
      ['Listen to their idea, then wonder together.', '“Interesting. Let’s find out.”'],
    ],
    practice: 'Ask “What do you think?” before answering one why each day this week.',
  },
  {
    id: 'iq-1', title: 'Sort It Your Way', topic: 'Sorting and grouping', minutes: 60, family: 'persist',
    summary: 'Sort a handful of anything by a rule they pick.',
    steps: [
      ['Pour out a handful of anything: buttons, spoons, blocks.', '“Let’s sort these.”'],
      ['Let them choose the rule.', '“How should we sort them? Color? Size?”'],
      ['Sort together, then ask about their rule.', '“Tell me how you decided.”'],
    ],
    practice: 'Sort one everyday thing together this week, their rule.',
  },
  {
    id: 'iq-2', title: 'You Finish the Story', topic: 'What happens next', minutes: 5, family: 'curious',
    summary: 'Stop a story halfway and let them finish it.',
    steps: [
      ['Start a story or a book you both know.', '“Once upon a time…”'],
      ['Stop halfway through.', '“And then… what do you think happened?”'],
      ['Let them tell the ending, any ending.', '“What a great ending.”'],
    ],
    practice: 'Let them finish one story this week.',
  },
  {
    id: 'iq-3', title: 'Count Along the Way', topic: 'Numbers in real life', minutes: 15, family: 'persist',
    summary: 'Count something ordinary on the way somewhere.',
    steps: [
      ['On a walk, pick one thing to count.', '“Let’s count flower pots.”'],
      ['Count out loud together.', '“One, two, three…”'],
      ['At the end, ask for the total.', '“How many did we find?”'],
    ],
    practice: 'Count one thing together on the way somewhere this week.',
  },
  {
    id: 'iq-4', title: 'Guess What’s Inside', topic: 'Guess then check', minutes: 30, family: 'curious',
    summary: 'Guess what is inside before you open it.',
    steps: [
      ['Pick something closed, like a tiffin box.', '“What’s in here, do you think?”'],
      ['Let them shake it, smell it, guess.', '“What makes you think that?”'],
      ['Open it together and check.', '“Let’s see if you were right.”'],
    ],
    practice: 'Guess before you open something together, once this week.',
  },
  {
    id: 'iq-5', title: 'Little Explorer Look', topic: 'Looking closely', minutes: 5, family: 'curious',
    summary: 'Look closely at one thing and ask what is inside it.',
    steps: [
      ['Pick one small thing: a seed pod, a leaf, a pen.', '“Let’s look really closely.”'],
      ['Look at it slowly together.', '“What do you notice?”'],
      ['Wonder what’s inside it.', '“What do you think is inside?”'],
    ],
    practice: 'Look closely at one ordinary thing together this week.',
  },
  {
    id: 'iq-6', title: 'Teach Me Something New', topic: 'Teach it back', minutes: 60, family: 'curious',
    summary: 'Ask them to teach you one thing from today.',
    steps: [
      ['Ask them to be the teacher.', '“Can you teach me something from today?”'],
      ['Be a curious student.', '“How does that work?”'],
      ['Thank your teacher.', '“I learnt something new from you.”'],
    ],
    practice: 'Let them teach you one thing each day this week.',
  },
]

function build(skill: Skill, entries: Entry[]): Activity[] {
  return entries.map((e) => {
    const f = FAMILIES[e.family]
    return {
      id: e.id,
      skill,
      title: e.title,
      topic: e.topic,
      minutes: e.minutes,
      summary: e.summary,
      steps: e.steps.map(([say, line]) => ({ say, line })),
      practice: e.practice,
      observe: { q: f.q, options: f.options },
      read: f.read,
    }
  })
}

export const CATALOGUE: Activity[] = [...build('SQ', SQ), ...build('EQ', EQ), ...build('IQ', IQ)]
