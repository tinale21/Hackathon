// Sample content for the demo family: Linh (student), Mẹ and Ba (parents).

/* Abstract shapes. A shape always means the same thing:
   needs (stamps), prompt types and onboarding answers each own one. */
export const LOOKS = {
  ripple: { shape: 'ripple', c: ['#a58cf0', '#e7defc', '#7d62e0'] },  // listen
  ember: { shape: 'grain', c: ['#ec5a52', '#ffb3a3', '#fff'] },        // cheer me on
  bubbles: { shape: 'spheres', c: ['#8fb8ff', '#b9d4ff', '#2f6cf0'] }, // advice
  silk: { shape: 'wave', c: ['#f7a1b4', '#ffe0d6', '#ff7d99'] },       // support
  dusk: { shape: 'grain', c: ['#7a6cf0', '#cfc3fb', '#fff'] },         // space
  ribbon: { shape: 'ribbon', c: ['#ff70cf', '#5f8dff', '#ffcf6b'] },   // distract me
  lime: { shape: 'wave', c: ['#c4e44c', '#f1fab8', '#e9f79a'] },       // a taste of home
  moss: { shape: 'grain', c: ['#6fb24a', '#e2f39a', '#fff'] },         // challenges
}

export const QUESTIONS = [
  {
    id: 'q1',
    step: 1,
    title: 'What should your family understand?',
    text: 'What do you wish your family understood more about your life away from home?',
    options: [
      { label: 'My everyday routine', look: 'silk', note: 'We’ll ask about small, ordinary moments.' },
      { label: 'The work behind my wins', look: 'ribbon', note: 'We’ll suggest small ways to show the middle of things, not just the end.' },
      { label: 'When I’m overwhelmed', look: 'moss', note: 'We’ll keep those prompts gentle, and always skippable.' },
      { label: 'Small things that make me happy', look: 'ember', note: 'Expect prompts about tiny good things.' },
      { label: 'New experiences and people', look: 'bubbles', note: 'We’ll ask about who and what is new.' },
      { label: 'How I’m growing on my own', look: 'lime', note: 'We’ll ask what you’re figuring out yourself.' },
    ],
  },
  {
    id: 'q2',
    step: 2,
    title: 'How do you like to share?',
    text: 'This picks what we suggest first. You can always use any of them.',
    options: [
      { label: 'A photo', look: 'silk', note: 'Photo comes first. Mess is welcome.' },
      { label: 'A voice memo', look: 'ripple', note: 'Voice comes first. Your family gets to hear you.' },
      { label: 'A few words', look: 'dusk', note: 'Writing comes first. Short is fine.' },
      { label: 'Just an icon', look: 'bubbles', note: 'Icons come first, for the busy weeks.' },
    ],
  },
]

// Swipe deck prompts. `lead` + `accent` form the two-tone title from the Figma frame.
// `card` = the card's lower gradient, `ink` = title color, `accent` gradient = second title line.
export const PROMPTS = [
  { id: 'slice', kind: 'photo', lead: 'What’s a little slice', accentText: 'of your day?', sub: 'your family never gets to see', desc: 'Show your parents what you don’t show every day. Help them understand and not worry about you. Show your personal journey, and your week.', card: ['#cfe1f7', '#9daef5'], grad: ['#4760f2', '#5bb9f5'], ink: '#0f2557', look: 'bubbles' },
  { id: 'workstation', kind: 'photo', lead: 'Picture your', accentText: 'workstation', sub: 'mess and all', desc: 'Where the work actually happened this week. Not the finished piece, the middle of it.', card: ['#f7d6cf', '#ec9f97'], grad: ['#d9604f', '#f28cb2'], ink: '#4a1e18', look: 'ribbon' },
  { id: 'effort', kind: 'text', lead: 'What took more', accentText: 'than it looks like?', sub: 'this week', desc: 'One thing that looked small from the outside but took real effort. No grades, no hours, just what it took.', card: ['#d4efd6', '#93d3a0'], grad: ['#2e9e5b', '#7dcf8e'], ink: '#123a22', look: 'moss' },
  { id: 'evening', kind: 'text', lead: 'Write about', accentText: 'your evening', sub: 'a few lines is enough', desc: 'What did tonight look like? Who was there, what you ate, what was on in the background.', card: ['#e4ddfb', '#b9a6f2'], grad: ['#6b4fd8', '#a88bf5'], ink: '#24184f', look: 'silk' },
  { id: 'energy', kind: 'voice', category: 'Challenges', lead: 'What’s taking', accentText: 'your energy lately?', sub: 'and what’s helping', desc: 'Say it out loud the way you would on the phone. It can be heavy or light. You choose what to share.', card: ['#fde3cf', '#f6b48a'], grad: ['#e07a3a', '#f4a869'], ink: '#4a2610', look: 'moss' },
  { id: 'smile', kind: 'photo', category: 'Small good things', lead: 'Something that', accentText: 'made you smile', sub: 'even for a second', desc: 'A sky, a snack, a friend’s face, a sticker on a lamp post. Tiny counts.', card: ['#fbf0c7', '#efd06a'], grad: ['#c99a10', '#e8bf3a'], ink: '#3d300a', look: 'ember' },
  { id: 'sound', kind: 'voice', lead: 'A sound from', accentText: 'where you are', sub: 'ten seconds is plenty', desc: 'The studio fan, the bus, the rain, your roommate laughing. Let them hear your day.', card: ['#d2f0ec', '#7fd0c6'], grad: ['#1f9488', '#5cc5b8'], ink: '#0d3a35', look: 'ripple' },
  { id: 'home', kind: 'text', category: 'Connection to home', lead: 'What do you', accentText: 'miss from home?', sub: 'a taste, a place, a habit', desc: 'Something small you didn’t notice until you left. They might be able to send a little piece of it.', card: ['#fadde8', '#f2a7c3'], grad: ['#d94f86', '#f08bb4'], ink: '#4a1430', look: 'lime' },
].map((p) => ({ ...p, title: `${p.lead} ${p.accentText}` }))

export const STAMPS = [
  { id: 'listen', art: 'stamp-listen', label: 'Listen', look: 'ripple', cue: 'They may just want you to hear them.' },
  { id: 'cheer', art: 'stamp-cheer', label: 'Cheer me on', look: 'ember', cue: 'A little encouragement may mean more than advice.' },
  { id: 'advice', art: 'stamp-advice', label: 'Advice', look: 'bubbles', cue: 'They’re open to hearing your perspective.' },
  { id: 'support', art: 'stamp-support', label: 'Support', look: 'silk', cue: 'They may appreciate help thinking through next steps.' },
  { id: 'space', art: 'stamp-space', label: 'Space', look: 'dusk', cue: 'A simple acknowledgment may be enough right now.' },
  { id: 'distract', art: 'stamp-distract', label: 'Distract me', look: 'ribbon', cue: 'Something light might be welcome.' },
  { id: 'home', label: 'Taste of home', look: 'lime', cue: 'A little piece of home would mean a lot.' },
  { id: 'none', label: 'No stamp', look: null, cue: null },
]
export const stampLook = (id) => LOOKS[(STAMPS.find((s) => s.id === id) || {}).look || 'dusk']

export const LETTERS = [
  { id: 'l1', photo: 'photo-soup-home', envelope: 'rose', from: 'Mẹ', mine: false, date: 'Oct 16', kind: 'photo', prompt: 'A little piece of home', title: 'The house is quiet without you', body: 'I tried the recipe you sent. Your dad ate two bowls. I don’t say it enough, but the house is quiet without you.', stamp: 'listen', unread: true, saved: true },
  { id: 'l2', envelope: 'mint', from: 'Ba', mine: false, date: 'Oct 15', kind: 'voice', prompt: 'Something you noticed today', title: 'Voice note, 1:12', seconds: 72, body: 'A voice note about the garden and the neighbor’s new dog.', stamp: 'distract', unread: true },
  { id: 'l3', photo: 'photo-studio-desk', envelope: 'lilac', from: 'Me', mine: true, date: 'Oct 14', kind: 'photo', prompt: 'Picture your workstation', title: 'My workstation, mess and all', body: 'Second pass on the series. The plant is doing better than me.', stamp: 'listen' },
  { id: 'l4', envelope: 'butter', from: 'Mẹ', mine: false, date: 'Oct 12', kind: 'text', prompt: 'Something you want them to know', title: '“Eat something warm before crit.”', body: 'Eat something warm before crit. You always forget.', stamp: 'cheer', saved: true },
  { id: 'l5', envelope: 'sky', from: 'Me', mine: true, date: 'Oct 10', kind: 'text', prompt: 'Write about your evening', title: 'Bún riêu night', body: 'Jun made bún riêu and it tasted almost like yours.', stamp: 'home' },
  { id: 'l6', photo: 'photo-persimmons', envelope: 'peach', from: 'Ba', mine: false, date: 'Oct 8', kind: 'photo', prompt: 'A view from your day', title: 'The garden in October', body: 'The persimmons are almost ready.', stamp: 'support' },
]

export const SPLASH_NOTES = [
  { text: 'crit went ok?', look: 'ripple', x: 46, y: 210, r: -6, d: 0 },
  { text: 'miss your phở', look: 'lime', x: 214, y: 186, r: 5, d: 0.25 },
  { text: 'proud of u', look: 'ember', x: 128, y: 330, r: -3, d: 0.5 },
  { text: 'studio, 1am', look: 'ribbon', x: 30, y: 450, r: 7, d: 0.7 },
  { text: 'call sunday?', look: 'bubbles', x: 232, y: 410, r: -8, d: 0.9 },
  { text: 'eat dinner!', look: 'silk', x: 146, y: 560, r: 4, d: 1.1 },
  { text: 'look what I made', look: 'dusk', x: 250, y: 600, r: -4, d: 1.3 },
]

// Earlier months for the recap book (sample content; October comes from the live letters).
export const RECAP_EARLIER = [
  { id: 'a1', month: 'Aug', from: 'Mẹ', mine: false, date: 'Aug 24', kind: 'text', title: 'First letter of the semester', body: 'Did you find the good bánh mì place yet? Send me a photo of your room when it’s not messy. So, never.', stamp: 'home' },
  { id: 'a2', month: 'Aug', from: 'Me', mine: true, date: 'Aug 26', kind: 'photo', photo: 'photo-city-orange', title: 'First night in the city', caption: 'It doesn’t get dark here, it just gets orange.', body: '', stamp: 'space' },
  { id: 'a3', month: 'Aug', from: 'Ba', mine: false, date: 'Aug 30', kind: 'voice', title: 'Voice note, 0:48', seconds: 48, body: 'Ba describing the tomatoes, very seriously.', stamp: 'distract' },
  { id: 's1', month: 'Sep', from: 'Me', mine: true, date: 'Sep 12', kind: 'photo', photo: 'photo-paint-swatches', title: 'Color theory week', caption: 'Mixed 40 greys. Liked two.', body: '', stamp: 'cheer' },
  { id: 's2', month: 'Sep', from: 'Mẹ', mine: false, date: 'Sep 18', kind: 'text', title: 'About breakfast', body: 'I know you skip it. I’m not saying anything. I’m just saying.', stamp: 'support' },
  { id: 's3', month: 'Sep', from: 'Mẹ', mine: false, date: 'Sep 25', kind: 'photo', photo: 'photo-pho-ga', title: 'Made your favorite', caption: 'Phở gà, the way you like it. One extra bowl, for no one.', body: '', stamp: 'home' },
  { id: 's4', month: 'Sep', from: 'Me', mine: true, date: 'Sep 30', kind: 'text', title: 'The middle of the series', body: 'Crit was rough. I redid the whole series twice. I’m not telling you so you worry, I’m telling you so you know.', stamp: 'listen' },
]

export const RECAP_MONTHS = [
  { id: 'Aug', name: 'August', theme: 'Settling in', look: 'lime', quote: { text: 'Send me a photo of your room when it’s not messy. So, never.', who: 'Mẹ, Aug 24' } },
  { id: 'Sep', name: 'September', theme: 'The middle of things', look: 'ribbon', quote: { text: 'I’m not telling you so you worry, I’m telling you so you know.', who: 'You, Sep 30' } },
  { id: 'Oct', name: 'October', theme: 'Quiet houses, full bowls', look: 'silk', quote: { text: 'The house is quiet without you.', who: 'Mẹ, Oct 16' } },
]
