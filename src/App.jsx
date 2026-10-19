import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './store.jsx'
import { LETTERS, PROMPTS } from './data.js'
import { Splash, Reveal, Question, Celebrate, Opening } from './screens/Onboarding.jsx'
import Home, { Pulse } from './screens/Home.jsx'
import { Capture, Write, Paper, Caption, Sent, Reply } from './screens/Create.jsx'
import Swipe from './screens/Swipe.jsx'
import { Mail, Read, History, Recap } from './screens/Receive.jsx'

const ROUTES = [
  { group: 'Onboarding' },
  { id: 'splash', label: 'Splash', el: Splash },
  { id: 'reveal', label: 'Name reveal', el: Reveal },
  { id: 'q1', label: 'Question 1', el: () => <Question index={0} /> },
  { id: 'q2', label: 'Question 2', el: () => <Question index={1} /> },
  { id: 'q3', label: 'Question 3', el: () => <Question index={2} /> },
  { id: 'q4', label: 'Question 4', el: () => <Question index={3} /> },
  { id: 'celebrate', label: 'You’re all set', el: Celebrate },
  { id: 'welcome', label: 'Opening', el: Opening },
  { id: 'home', label: 'Home', el: Home },
  { id: 'pulse', label: 'Send a pulse', el: Pulse },
  { group: 'Create a letter' },
  { id: 'prompt', label: 'Pick your prompt (swipe)', el: Swipe },
  { id: 'capture', label: 'Capture', el: Capture },
  { id: 'write', label: 'Write', el: Write },
  { id: 'paper', label: 'Pick your paper', el: Paper },
  { id: 'caption', label: 'Caption + stamp', el: Caption },
  { id: 'sent', label: 'Sent', el: Sent },
  { group: 'Receive and look back' },
  { id: 'mail', label: 'New mail', el: Mail },
  { id: 'read', label: 'Read', el: Read },
  { id: 'reply', label: 'Write back', el: Reply },
  { id: 'history', label: 'History', el: History },
  { id: 'recap', label: 'Recap book', el: Recap },
]
const SCREENS = ROUTES.filter((r) => r.id)
const EMPTY_DRAFT = { caption: '', text: '', paper: 'postcard', stickers: [], stamp: 'listen', envelope: 'lilac', strokes: [], handwriting: null, replyTo: null }
const readHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '')
  return SCREENS.some((s) => s.id === id) ? id : 'splash'
}

// Which way the screen change goes, so it can slide forward, back, or cross-fade between tabs.
const TABS = new Set(['home', 'prompt', 'history', 'recap'])
let stack = null
function navDir(from, to) {
  if (!stack) stack = [from]
  let d
  if (TABS.has(from) && TABS.has(to)) { d = 'tab'; stack = [to] }
  else if (stack.length > 1 && stack[stack.length - 2] === to) { d = 'back'; stack.pop() }
  else { d = 'fwd'; stack.push(to) }
  document.documentElement.dataset.nav = d
}
let current = null

export default function App() {
  // The prototype always opens on the splash.
  const [route, setRoute] = useState(() => {
    try { window.history.replaceState(null, '', '#/splash') } catch { /* ignore */ }
    return 'splash'
  })
  const [answers, setAnswers] = useState({ q1: 1, q2: 0 })
  const [promptIndex, setPromptIndex] = useState(0)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [letters, setLetters] = useState(LETTERS)
  const [openId, setOpenId] = useState('l1')
  const [sentKind, setSentKind] = useState('letter')

  // The browser's back and forward buttons move between screens.
  useEffect(() => {
    if (!current) current = readHash()
    const onHash = () => { const to = readHash(); navDir(current, to); current = to; setRoute(to) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((id) => {
    const from = current || 'splash'
    if (from === id) return
    navDir(from, id)
    // Reading a letter or the recap remembers where you came from, so Back returns there.
    if ((id === 'read' || id === 'mail') && !['mail', 'read', 'reply'].includes(from)) window.__readFrom = from
    if (id === 'recap') window.__recapFrom = from
    current = id
    setRoute(id)
    // Some embeds (like the artifact viewer) block history changes.
    try { window.history.pushState(null, '', `#/${id}`) } catch { /* ignore */ }
  }, [])

  const value = useMemo(() => ({
    route, go,
    answers, setAnswers,
    prompt: PROMPTS[promptIndex % PROMPTS.length], promptIndex, setPromptIndex,
    draft, setDraft: (patch) => setDraft((d) => ({ ...d, ...patch })),
    resetDraft: () => setDraft(EMPTY_DRAFT),
    letters, setLetters,
    openLetter: letters.find((l) => l.id === openId) || letters[0], setOpenId,
    sentKind, setSentKind,
  }), [route, go, answers, promptIndex, draft, letters, openId, sentKind])

  const Current = SCREENS.find((s) => s.id === route).el

  return (
    <AppContext.Provider value={value}>
      <div className="stage">
        <div className="phone">
          <Current key={route} />
        </div>
      </div>
    </AppContext.Provider>
  )
}
