// Sample content for the demo family: Audrey (student), Mom and Ba (parents).

/* Abstract shapes. A shape always means the same thing:
   needs (stamps), prompt types and onboarding answers each own one. */
const S = (f) => `${import.meta.env.BASE_URL}stamps/${f}`

export const LOOKS = {
  // Home tiles: painted scenes (see sceneArt.js).
  quill: { shape: 'quill', c: ['#e9a8e0', '#f3e1f6', '#a58cf0'] },
  pulse: { shape: 'pulse', c: ['#f7a1b4', '#ffe2da', '#ff8aa3'] },
  recap: { shape: 'recap', c: ['#a79bf3', '#e6e1fc', '#fff'] },
  letters: { shape: 'letters', c: ['#a58cf0', '#ede5fd', '#b8a4f4'] },
  // Onboarding answer tiles: a still image or video frame, with a video that plays once picked.
  // pos/tf frame the tile, video/vpos fill the screen after the pick, wash is the color that floods in.
  // A tf shift must stay within the zoom so the picture still covers the tile: |shift| ≤ 50% × (scale − 1).
  dusk2: { shape: 'image', still: true, src: S('language-bg.mp4'), pos: '50% 55%', darkLabel: true, video: S('language-bg.mp4'), vpos: '50% 50%', wash: '#f9c6bc', c: ['#f9c6bc', '#fde8e4', '#fff'] },
  sunset: { shape: 'image', still: true, src: S('notsure-bg.mp4'), pos: '50% 80%', darkLabel: true, video: S('notsure-bg.mp4'), vpos: '50% 50%', wash: '#f7c3b4', c: ['#f7c3b4', '#fde6df', '#fff'] },
  horizon: { shape: 'image', still: true, src: S('worry-bg.mp4'), pos: '50% 70%', darkLabel: true, video: S('worry-bg.mp4'), vpos: '50% 50%', wash: '#e3cdfd', c: ['#e3cdfd', '#f3e9fe', '#fff'] },
  street: { shape: 'image', still: true, src: S('timezone-bg.mp4'), pos: '50% 50%', tf: 'translate(-8%,-28%) scale(1.6)', tileBg: '#4f73ad', video: S('timezone-bg.mp4'), vpos: '60% 50%', wash: '#c3cdee', c: ['#c3cdee', '#e6eaf8', '#fff'] },
  book: { shape: 'image', still: true, src: S('report-bg.mp4'), pos: '50% 50%', tf: 'translate(-38%,-38%) scale(1.8)', tileBg: '#a9b6b9', video: S('report-bg.mp4'), vpos: '85% 50%', wash: '#c9d3d6', c: ['#c9d3d6', '#e8edee', '#fff'] },
  night: { shape: 'image', still: true, src: S('funny-bg.mp4'), pos: '50% 85%', tf: 'translateY(-35%) scale(1.7)', video: S('funny-bg.mp4'), vpos: '50% 50%', wash: '#bfe0e1', c: ['#bfe0e1', '#e3f2f2', '#fff'] },
  shore: { shape: 'image', still: true, src: S('tired-bg.mp4'), pos: '38% 45%', video: S('tired-bg.mp4'), vpos: '40% 50%', wash: '#e6d9cc', c: ['#e6d9cc', '#f5eee7', '#fff'] },
  studio: { shape: 'image', still: true, src: S('working-bg.mp4'), pos: '40% 35%', video: S('working-bg.mp4'), vpos: '0% 50%', wash: '#fae8bf', c: ['#fae8bf', '#fef6d9', '#fff'] },
  prism: { shape: 'image', still: true, src: S('places-bg.mp4'), pos: '50% 50%', tf: 'translateY(-12%) scale(1.25)', video: S('places-bg.mp4'), vpos: '50% 50%', wash: '#eeeaf4', c: ['#eeeaf4', '#f7f5fa', '#fff'] },
  path: { shape: 'image', src: S('friends-path.webp'), pos: '50% 50%', tf: 'translateY(-58%) scale(2.2)', tileBg: '#c58fd4', video: S('friends-bg.mp4'), vpos: '50% 50%', wash: '#ebd6ef', c: ['#ebd6ef', '#f6ecf8', '#fff'] },
  star: { shape: 'image', src: S('wins-star.webp'), pos: '50% 40%', tf: 'translateY(-10%) scale(1.2)', video: S('wins-star-bg.mp4'), vpos: '50% 50%', wash: '#e6d3f9', c: ['#e6d3f9', '#f4ebfd', '#fff'] },
  soup: { shape: 'image', still: true, src: S('food-bg.mp4'), pos: '50% 50%', tf: 'translateY(-35%) scale(1.7)', video: S('food-bg.mp4'), vpos: '50% 50%', vshift: '0 -12%', wash: '#f7efd3', c: ['#f4ebb4', '#fbf6dc', '#fff'] },
  orbs: { shape: 'image', src: S('icon-bubbles.webp'), pos: '50% 50%', zoom: 1.45, zo: '50% 100%', video: S('icon-bg.mp4'), vpos: '50% 50%', wash: '#c1dfc0', c: ['#c1dfc0', '#e8f4e6', '#fff'] },
  streak: { shape: 'image', src: S('words-sky.webp'), pos: '50% 50%', video: S('words-bg.mp4'), vpos: '50% 50%', wash: '#abcdf5', c: ['#abcdf5', '#e3f0fd', '#fff'] },
  wave: { shape: 'image', src: S('voice-wave.webp'), pos: '50% 55%', zoom: 1.5, zo: '50% 100%', video: S('voice-bg.mp4'), vpos: '50% 50%', wash: '#cdbff0', c: ['#cdbff0', '#ece6fb', '#fff'] },
  cube: { shape: 'image', src: S('photo-frame.webp'), pos: '50% 45%', video: S('photo-frame-bg.mp4'), vpos: '50% 50%', wash: '#fdb9bc', c: ['#fdb9bc', '#fee3e4', '#fff'] },
  blank: { shape: 'blank', c: ['#ececf0', '#f6f6f8', '#fff'] },
  meadow: { shape: 'image', src: S('growing-hill.webp'), pos: '45% 60%', video: S('growing-bg.mp4'), vpos: '35% 50%', wash: '#f7dca9', c: ['#f7dca9', '#fdf1dc', '#fff'] },
  clouds: { shape: 'image', src: S('people-clouds.webp'), pos: '55% 55%', video: S('people-bg.mp4'), vpos: '75% 50%', wash: '#bcd7f3', c: ['#bcd7f3', '#e4effb', '#fff'] },
  petals: { shape: 'image', src: S('happy-petals.webp'), pos: '45% 50%', video: S('happy-bg.mp4'), vpos: '45% 50%', wash: '#f7b8a8', c: ['#f7b8a8', '#fde2da', '#fff'] },
  forest: { shape: 'image', still: true, src: S('overwhelmed-bg.mp4'), pos: '45% 50%', video: S('overwhelmed-bg.mp4'), vpos: '45% 50%', wash: '#d3e9d8', c: ['#d3e9d8', '#eef6ef', '#fff'] },
  violet: { shape: 'image', src: S('wins-sky.webp'), pos: '50% 50%', video: S('wins-bg.mp4'), vpos: '50% 50%', wash: '#cbb9f2', c: ['#cbb9f2', '#e9e2fb', '#fff'] },
  painting: { shape: 'image', src: S('routine-beach.webp'), pos: '50% 55%', video: S('routine-bg.mp4'), wash: '#f1c7cb', c: ['#f4c6d0', '#e3efe6', '#fff'] },

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
    id: 'q1', step: 1, title: 'What should your family understand?', text: 'What do you wish your family understood more about your life away from home?',
    options: [
      { label: 'My Everyday Routine', look: 'painting', note: 'We’ll ask about small, ordinary moments.' },
      { label: 'The Work Behind My Wins', look: 'violet', note: 'We’ll suggest small ways to show the middle of things, not just the end.' },
      { label: 'When I’m Overwhelmed', look: 'forest', note: 'We’ll keep those prompts gentle, and always skippable.' },
      { label: 'Small Things That Make Me Happy', look: 'petals', note: 'Expect prompts about tiny good things.' },
      { label: 'New Experiences and People', look: 'clouds', note: 'We’ll ask about who and what is new.' },
      { label: 'How I’m Growing on My Own', look: 'meadow', note: 'We’ll ask what you’re figuring out yourself.' },
    ],
  },
  {
    id: 'q2', step: 2, title: 'How do you like to share?', text: 'This picks what we suggest first. You can always use any of them.',
    options: [
      { label: 'A Photo', look: 'cube', note: 'Photo comes first. Mess is welcome.' },
      { label: 'A Voice Memo', look: 'wave', note: 'Voice comes first. Your family gets to hear you.' },
      { label: 'A Few Words', look: 'streak', note: 'Writing comes first. Short is fine.' },
      { label: 'Just an Icon', look: 'orbs', note: 'Icons come first, for the busy weeks.' },
    ],
  },
  {
    id: 'q3', step: 3, title: 'What do you naturally share?', text: 'The things you already send home, or would if it were easier.',
    options: [
      { label: 'Food and Meals', look: 'soup', note: 'We’ll start with what’s on your plate.' },
      { label: 'Funny Little Moments', look: 'night', note: 'Expect prompts for the small, silly stuff.' },
      { label: 'Wins and Good News', look: 'star', note: 'We’ll help you share the middle, not just the win.' },
      { label: 'Places I Go', look: 'prism', note: 'We’ll ask where today took you.' },
      { label: 'Friends and New People', look: 'path', note: 'We’ll ask who’s around you lately.' },
      { label: 'What I’m Working On', look: 'studio', note: 'We’ll ask for works in progress, mess and all.' },
    ],
  },
  {
    id: 'q4', step: 4, title: 'What stops you from sharing?', text: 'Pick anything that gets in the way. We’ll work around it.',
    options: [
      { label: 'I Don’t Want Them to Worry', look: 'horizon', note: 'We’ll keep prompts gentle, and you choose what goes out.' },
      { label: 'Not Sure What to Say', look: 'sunset', note: 'We’ll always give you a small place to start.' },
      { label: 'Time Zones and Timing', look: 'street', note: 'Letters wait until they’re opened. No need to be online together.' },
      { label: 'It Feels Like a Report', look: 'book', note: 'No updates required. One photo is enough.' },
      { label: 'Language Gaps', look: 'dusk2', note: 'Photos, voice and icons say a lot without many words.' },
      { label: 'I’m Just Tired', look: 'shore', note: 'There’s always a ten-second option.' },
    ],
  },
]

// Swipe deck prompts. `lead` + `accent` form the two-tone title from the Figma frame.
// `card` = the card's lower gradient, `ink` = title color, `accent` gradient = second title line.
// Swipe deck prompts. `lead` + `accentText` form the two-tone title.
// `img` paints the card, softened by a white `veil`; `card` tints the backdrop, `ink` and `grad` color the title.
export const PROMPTS = [
  { id: 'slice', img: S('prompt-slice-light.webp'), imgPos: '50% -112px', imgSize: 'cover', imgBg: '#5ab956', veil: .1, kind: 'photo', category: 'Everyday life', lead: 'What’s a little slice', accentText: 'of your day?', sub: 'your family never gets to see', desc: 'Show your parents what you don’t show every day. Help them understand and not worry about you. Show your personal journey, and your week.', card: ['#dff5df', '#a8e6a6'], grad: ['#2e8b46', '#6cc788'], ink: '#14401f', look: 'bubbles' },
  { id: 'workstation', img: S('prompt-workstation-blue.webp'), imgPos: '50% -80px', imgSize: 'cover', imgBg: '#93bbe4', veil: .08, kind: 'photo', category: 'Behind the outcome', lead: 'Picture your', accentText: 'workstation', sub: 'mess and all', desc: 'Where the work actually happened this week. Not the finished piece, the middle of it.', card: ['#e3edfb', '#a9c6ee'], grad: ['#3a5bd9', '#7aa7ee'], ink: '#16285a', look: 'ribbon' },
  { id: 'effort', img: S('prompt-effort.webp'), imgPos: '50% -58px', imgSize: 'auto 100%', imgBg: '#f46e72', veil: .18, kind: 'text', category: 'Behind the outcome', lead: 'What took more', accentText: 'than it looks like?', sub: 'this week', desc: 'One thing that looked small from the outside but took real effort. No grades, no hours, just what it took.', card: ['#fbe3ea', '#f2a7c3'], grad: ['#d94f86', '#f08bb4'], ink: '#4a1430', look: 'moss' },
  { id: 'evening', img: S('prompt-workstation-lilac.webp'), imgPos: '50% -80px', imgSize: 'cover', imgBg: '#e7afe4', veil: .08, kind: 'text', category: 'Everyday life', lead: 'Write about', accentText: 'your evening', sub: 'a few lines is enough', desc: 'What did tonight look like? Who was there, what you ate, what was on in the background.', card: ['#f6e8f6', '#e6b4e4'], grad: ['#a2409f', '#df8fdc'], ink: '#4a1a4c', look: 'silk' },
  { id: 'energy', img: S('prompt-energy.webp'), imgPos: '50% 100%', imgSize: 'cover', imgBg: '#fbe6e6', veil: .06, fade: .6, kind: 'voice', category: 'Challenges', lead: 'What’s taking', accentText: 'your energy lately?', sub: 'and what’s helping', desc: 'Say it out loud the way you would on the phone. It can be heavy or light. You choose what to share.', card: ['#fde3cf', '#f6b48a'], grad: ['#e07a3a', '#f4a869'], ink: '#4a2610', look: 'moss' },
  { id: 'smile', img: S('prompt-smile.webp'), imgPos: '50% 100%', imgSize: 'cover', imgBg: '#fac57f', veil: .06, fade: .6, kind: 'photo', category: 'Small good things', lead: 'Something that', accentText: 'made you smile', sub: 'even for a second', desc: 'A sky, a snack, a friend’s face, a sticker on a lamp post. Tiny counts.', card: ['#fbf0c7', '#efd06a'], grad: ['#a86a08', '#c98a1c'], ink: '#3d300a', look: 'ember' },
  { id: 'sound', img: S('prompt-sound.webp'), imgPos: '50% 100%', imgSize: 'cover', imgBg: '#d8f7ec', veil: .06, fade: .6, kind: 'voice', category: 'Everyday life', lead: 'A sound from', accentText: 'where you are', sub: 'ten seconds is plenty', desc: 'The studio fan, the bus, the rain, your roommate laughing. Let them hear your day.', card: ['#d2f0ec', '#7fd0c6'], grad: ['#1f9488', '#5cc5b8'], ink: '#0d3a35', look: 'ripple' },
  { id: 'home', img: S('prompt-home.webp'), imgPos: '50% 100%', imgSize: 'cover', imgBg: '#dedff6', veil: .06, fade: .6, kind: 'text', category: 'Connection to home', lead: 'What do you', accentText: 'miss from home?', sub: 'a taste, a place, a habit', desc: 'Something small you didn’t notice until you left. They might be able to send a little piece of it.', card: ['#fadde8', '#f2a7c3'], grad: ['#d94f86', '#f08bb4'], ink: '#4a1430', look: 'lime' },
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
// A stamp's face: its painting when it has one, otherwise its shape. Takes a stamp or a stamp id.
export const stampLook = (st) => {
  const s = typeof st === 'string' ? STAMPS.find((x) => x.id === st) : st
  if (!s || !s.look) return null
  return s.art ? { ...LOOKS[s.look], art: S(`${s.art}.jpg`) } : LOOKS[s.look]
}

export const LETTERS = [
  { id: 'l3', envelope: 'lilac', from: 'Me', mine: true, date: 'Sep 27', kind: 'photo', photo: 'me-artbox.webp', prompt: 'A little slice of your day', title: 'They have artbox at Hmart :0 I remember our trip to Korea!', caption: 'They have artbox at Hmart :0 I remember our trip to Korea!', body: '', stamp: 'home' },
  { id: 'l4', envelope: 'sky', from: 'Me', mine: true, date: 'Sep 21', kind: 'photo', photo: 'me-beach.webp', prompt: 'A little slice of your day', title: 'Got home from the beach!', caption: 'Got home from the beach!', body: '', stamp: 'space' },
  { id: 'l1', envelope: 'rose', from: 'Mom', mine: false, date: 'Sep 17', kind: 'photo', video: 'mom-albania.mp4', prompt: 'A view from your day', title: 'Albania!', caption: 'Albania!', body: '', stamp: 'home', unread: true, saved: true },
  { id: 'l2', envelope: 'mint', from: 'Mom', mine: false, date: 'Sep 15', kind: 'voice', prompt: 'Something you noticed today', title: 'Voice note, 1:12', body: 'A voice note about the garden and the neighbor’s new dog.', stamp: 'distract', unread: true },
  { id: 'l5', envelope: 'butter', from: 'Mom', mine: false, date: 'Sep 10', kind: 'photo', photo: 'mom-monster.webp', prompt: 'A view from your day', title: 'Noah bought some Monster again', caption: 'Noah bought some Monster again', body: '', stamp: 'distract' },
  { id: 'l6', envelope: 'peach', from: 'Me', mine: true, date: 'Sep 6', kind: 'photo', photo: 'me-boba.webp', prompt: 'Write about your evening', title: 'Good day today went to a Boba place with Tina :D', caption: 'Good day today went to a Boba place with Tina :D', body: '', stamp: 'cheer' },
  { id: 'l7', envelope: 'lilac', from: 'Me', mine: true, date: 'Aug 31', kind: 'photo', photo: 'me-six-flags.webp', prompt: 'A little slice of your day', title: 'Just wanted to lyk i’m alive and at Six Flags!', caption: 'Just wanted to lyk i’m alive and at Six Flags!', body: '', stamp: 'cheer', saved: true },
  { id: 'l8', envelope: 'mint', from: 'Mom', mine: false, date: 'Aug 27', kind: 'photo', video: 'mom-balkan-beer.mp4', prompt: 'A view from your day', title: 'Manju’s Balkan beer journey', caption: 'Manju’s Balkan beer journey', body: '', stamp: 'distract' },
  { id: 'l9', envelope: 'rose', from: 'Mom', mine: false, date: 'Aug 22', kind: 'photo', photo: 'mom-changi.webp', prompt: 'A view from your day', title: 'At Changi now, just going around Jewel while waiting for Tita Pau', caption: 'At Changi now, just going around Jewel while waiting for Tita Pau', body: '', stamp: 'home' },
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
export const RECAP_EARLIER = []

export const RECAP_MONTHS = [
  { id: 'Aug', name: 'August', theme: 'Settling in', look: 'lime', quote: { text: 'Just wanted to lyk i’m alive and at Six Flags!', who: 'You, Aug 31' } },
  { id: 'Sep', name: 'September', theme: 'The middle of things', look: 'ribbon', quote: { text: 'Noah bought some Monster again', who: 'Mom, Sep 10' } },
  { id: 'Oct', name: 'October', theme: 'Quiet houses, full bowls', look: 'silk', quote: { text: 'The house is quiet without you.', who: 'Mom, Oct 16' } },
]
