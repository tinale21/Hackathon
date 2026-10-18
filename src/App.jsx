import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './store.jsx'
import { LETTERS, PROMPTS } from './data.js'
import { Splash, Reveal, Question } from './screens/Onboarding.jsx'
import Home from './screens/Home.jsx'
import { Capture, Write, Paper, Caption, Sent, Reply } from './screens/Create.jsx'
import Swipe from './screens/Swipe.jsx'
import { Mail, Read, History, Recap } from './screens/Receive.jsx'

const ROUTES = [
  { group: 'Onboarding' },
  { id: 'splash', label: 'Splash', el: Splash },
  { id: 'reveal', label: 'Name reveal', el: Reveal },
  { id: 'q1', label: 'Question 1', el: () => <Question index={0} /> },
  { id: 'q2', label: 'Question 2', el: () => <Question index={1} /> },
  { id: 'home', label: 'Home', el: Home },
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

export default function App() {
  const [route, setRoute] = useState(readHash)
  const [answers, setAnswers] = useState({ q1: 1, q2: 0 })
  const [promptIndex, setPromptIndex] = useState(0)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [letters, setLetters] = useState(LETTERS)
  const [openId, setOpenId] = useState('l1')
  const [sentKind, setSentKind] = useState('letter')

  useEffect(() => {
    const onHash = () => setRoute(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((id) => {
    setRoute(id)
    // Keep the address bar in sync where allowed; some embeds (like the artifact viewer) block it.
    try { window.history.replaceState(null, '', `#/${id}`) } catch { /* ignore */ }
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
        <nav className="index" aria-label="Screens">
          <h2>[App name] · prototype</h2>
          <p>Letters between art students and their families. Tap through the phone, or jump to any screen.</p>
          {ROUTES.map((r) => r.group
            ? <div key={r.group} className="group">{r.group}</div>
            : <button key={r.id} aria-current={route === r.id ? 'page' : undefined} onClick={() => go(r.id)}>{r.label}</button>)}
          <a href={`${import.meta.env.BASE_URL}stamps/CREDITS.md`} target="_blank" rel="noreferrer" style={{ marginTop: 16, paddingLeft: 10, fontSize: 12, color: 'var(--ink-3)' }}>Image credits</a>
        </nav>
        <div className="phone">
          <Current key={route} />
        </div>
      </div>
    </AppContext.Provider>
  )
}
