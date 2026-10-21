import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { PROMPTS } from '../data.js'
import { Display, IconButton, Screen, Tile, TopBar } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { greetWord, lastPickColor } from './Onboarding.jsx'
import { SENT_DOTS, SENT_PATH, SENT_SPARKS } from './Create.jsx'

const asset = (f) => `${import.meta.env.BASE_URL}stamps/${f}`
const LANGS = [['English', 'English'], ['Tiếng Việt', 'Vietnamese'], ['Tagalog', 'Tagalog'], ['한국어', 'Korean'], ['中文', 'Chinese'], ['日本語', 'Japanese'], ['Español', 'Spanish']]
let pulseSent = false

// Phones swipe the prompt row natively; with a mouse, click and drag it sideways.
// Snapping pauses while dragging, and a drag doesn't count as a tap on the tile underneath.
function useDragScroll() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x0 = 0, left0 = 0, down = false, moved = false
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      down = true; moved = false; x0 = e.clientX; left0 = el.scrollLeft
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - x0
      if (!moved && Math.abs(dx) > 5) { moved = true; el.style.scrollSnapType = 'none'; el.style.cursor = 'grabbing' }
      if (moved) el.scrollLeft = left0 - dx
    }
    const onUp = () => {
      if (!down) return
      down = false
      if (!moved) return
      el.style.cursor = ''
      // Let it settle onto the nearest card, the same as a swipe.
      const left = el.scrollLeft
      el.style.scrollSnapType = ''
      el.scrollLeft = left
    }
    const onClick = (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false } }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])
  return ref
}

/* ---------- Account sheets: profile, language, notifications ---------- */
function HomeSheet({ kind, out, close, show, lang, setLang, letters, open, go }) {
  if (!kind) return null
  const title = { lang: 'Language', notif: 'Notifications', user: 'Profile' }[kind]
  const row = (key, icon, label, sub, onClick, right) => (
    <button key={key} className="hs-row" onClick={onClick}>
      <span className="hs-ic"><Icon name={icon} size={20} /></span>
      <span className="hs-txt"><b>{label}</b>{sub ? <span>{sub}</span> : null}</span>
      {right || null}
    </button>
  )
  const unread = (id) => (letters.find((x) => x.id === id) || {}).unread
  let body
  if (kind === 'lang') {
    body = [
      <p key="p" className="hs-sub">The language the app uses. Letters stay in the language they were written in.</p>,
      // The page-wide translator (public/i18n.js) swaps the UI text; letters are never translated.
      ...LANGS.map(([l, en]) => row(l, 'globe', l, en, () => { if (window.__setLang) window.__setLang(l); else window.__lang = l; setLang(l); close() },
        lang === l ? <span className="hs-check"><Icon name="check" size={18} /></span> : null)),
    ]
  } else if (kind === 'notif') {
    body = [
      row('n1', 'envelope', 'Mom sent you a letter', '“Albania!” · Sep 17', () => { close(); open('l1') }, unread('l1') ? <span className="hs-dot" /> : null),
      row('n2', 'voice', 'Mom sent a voice note', '1:12 · Sep 15', () => { close(); open('l2') }, unread('l2') ? <span className="hs-dot" /> : null),
      row('n3', 'heart', 'Mom is thinking of you', '2 hours ago', close),
      row('n4', 'book', 'Your October recap is ready', 'Oct 1', () => { close(); go('recap') }),
    ]
  } else {
    body = [
      <div key="me" className="hs-me">
        <span className="hs-avatar"><img src={asset('avatar-me.webp')} alt="" draggable="false" /></span>
        <div><b>Audrey</b><span>Writing to Mom in Singapore</span></div>
      </div>,
      row('u1', 'globe', 'Language', lang, () => show('lang'), <Icon name="arrow" size={18} />),
      row('u2', 'bell', 'Notifications', 'New letters and pulses', () => show('notif'), <Icon name="arrow" size={18} />),
      row('u3', 'refresh', 'Replay intro', 'See the opening animation again', () => { close(); go('splash') }, <Icon name="arrow" size={18} />),
    ]
  }
  return (
    <div className={`hs-wrap${out ? ' out' : ''}`}>
      <button className="hs-back sheet-scrim" aria-label="Close" onClick={close} />
      <div className="hs-sheet sheet-panel" role="dialog" aria-label={title}>
        <span className="hs-grab" />
        <h3 className="hs-title">{title}</h3>
        {body}
        <button className="hs-done" onClick={close}>Done</button>
      </div>
    </div>
  )
}

/* ---------- Home ---------- */
export default function Home() {
  const { go, letters, setOpenId, setPromptIndex } = useApp()
  const promptRow = useDragScroll()
  const unread = letters.filter((x) => x.unread && !x.mine)
  const [sheet, setSheet] = useState(null)
  const [out, setOut] = useState(false)
  const close = () => { if (out) return; setOut(true); setTimeout(() => { setSheet(null); setOut(false) }, 200) }
  const [lang, setLang] = useState(window.__lang || 'English')
  const open = (id) => { const l = letters.find((x) => x.id === id); setOpenId(id); go(l && l.unread && !l.mine ? 'mail' : 'read') }
  // Prompt of the day: a different card each day of the year.
  const d0 = new Date()
  const day = Math.floor((Date.UTC(d0.getFullYear(), d0.getMonth(), d0.getDate()) - Date.UTC(d0.getFullYear(), 0, 0)) / 864e5) % PROMPTS.length
  const potd = PROMPTS[day]
  const glow = lastPickColor() || '#cbb9f2'
  const section = (title, more) => (
    <div className="home-sec"><h2>{title}</h2>{more ? <button className="home-sec-more" onClick={more}>See all</button> : null}</div>
  )

  return (
    <Screen className="has-nav home-screen" bg={`radial-gradient(ellipse 60% 32% at 50% 50%, ${glow}80 0%, rgba(255,255,255,0) 100%), #fff`}>
      <div className="screen-body scroll">
        <nav className="home-top" aria-label="Account">
          <button className="home-ic" aria-label={`Notifications${unread.length ? `, ${unread.length} new` : ''}`} onClick={() => setSheet('notif')}>
            <Icon name="bell" size={20} />{unread.length ? <span className="home-ic-dot" /> : null}
          </button>
          <button className="home-ic home-avatar" aria-label="Profile" onClick={() => setSheet('user')}>
            <img src={asset('avatar-me.webp')} alt="" draggable="false" />
          </button>
          <HomeSheet kind={sheet} out={out} close={close} show={setSheet} lang={lang} setLang={setLang} letters={letters} open={open} go={go} />
        </nav>
        <Display sub="What would you like to share today?">{greetWord()},<br />Audrey</Display>

        {unread.length ? (
          <button className="mail-pill" onClick={() => { setOpenId(unread[0].id); go('mail') }}>
            <span className="mail-pill-icon"><Icon name="envelope" size={18} /></span>
            <span className="mail-pill-text"><b>{unread.length === 1 ? '1 new letter' : `${unread.length} new letters`}</b>{`from ${[...new Set(unread.map((x) => x.from))].join(' and ')}`}</span>
            <Icon name="arrow" size={18} />
          </button>
        ) : null}

        {section('Send some love')}
        <div className="tiles">
          <Tile look="quill" onClick={() => { setPromptIndex(day); go('prompt') }}
            caption={<><small className="potd-kicker">Prompt of the Day</small>{potd.lead} {potd.accentText}</>} />
          <Tile look="pulse" caption={pulseSent ? 'Sent to Mom: “Thinking of you”' : 'Send a pulse: “Thinking of you”'} pressed={pulseSent} onClick={() => go('pulse')} />
        </div>

        {section('View History')}
        <div className="tiles">
          <Tile look="recap" caption="View Recap" onClick={() => go('recap')} />
          <Tile look="letters" caption="View letters" onClick={() => go('history')} />
        </div>

        {section('Prompts', () => go('prompt'))}
        <div className="qp-row" ref={promptRow}>
          {PROMPTS.map((p, k) => (
            <button key={p.id} className="tile qp-tile" style={{ background: `linear-gradient(180deg,#fff 0%,${p.card[1]} 100%)` }} onClick={() => { setPromptIndex(k); go('prompt') }}>
              <div className="qp-art" style={{ backgroundImage: `url(${p.img})`, backgroundColor: p.imgBg }} />
              <span className="cap">{p.lead} {p.accentText}</span>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Send a pulse: press and hold the heart ---------- */
// Holding fills the ring (with a small buzz at each quarter). Letting go early drains it; a full ring sends the pulse.
export function Pulse() {
  const { go } = useApp()
  const HOLD = 1600
  const [p, setP] = useState(0)
  const [hold, setHold] = useState(false)
  const [sent, setSent] = useState(false)
  const raf = useRef(0), t0 = useRef(0), p0 = useRef(0), buzz = useRef(0)
  const stop = () => cancelAnimationFrame(raf.current)
  const drain = () => {
    stop()
    const from = p0.current, s0 = performance.now()
    const k = (n) => { const q = Math.max(0, from - (n - s0) / 450); p0.current = q; setP(q); if (q > 0) raf.current = requestAnimationFrame(k) }
    raf.current = requestAnimationFrame(k)
  }
  const down = (ev) => {
    if (sent) return
    if (ev.pointerId != null && ev.currentTarget.setPointerCapture) ev.currentTarget.setPointerCapture(ev.pointerId)
    stop(); setHold(true)
    t0.current = performance.now() - p0.current * HOLD
    buzz.current = 0
    const k = (n) => {
      const q = Math.min(1, (n - t0.current) / HOLD)
      p0.current = q; setP(q)
      const b = Math.floor(q * 4)
      if (b > buzz.current) { buzz.current = b; if (navigator.vibrate) navigator.vibrate(10) }
      if (q >= 1) { setHold(false); setSent(true); pulseSent = true; if (navigator.vibrate) navigator.vibrate([30, 60, 40]); return }
      raf.current = requestAnimationFrame(k)
    }
    raf.current = requestAnimationFrame(k)
  }
  const up = () => { if (!sent) { setHold(false); drain() } }
  useEffect(() => stop, [])
  const C = 2 * Math.PI * 86
  const beat = 1 + p * 0.16

  return (
    <Screen className={`pulse-screen${hold ? ' holding' : ''}${sent ? ' sent' : ''}`}>
      {sent ? SENT_DOTS.map(([x, y, c, d], i) => <span key={i} aria-hidden="true" style={{ position: 'absolute', left: x, top: y, width: 5, height: 5, borderRadius: 3, background: c, animation: `twinkle 1.8s ease-in-out ${d}s infinite` }} />) : null}
      <div className="screen-body" style={{ alignItems: 'center', zIndex: 1 }}>
        <TopBar left={<IconButton icon="back" label="Back home" onClick={() => go('home')} />} />
        <div className="pulse-head" style={{ opacity: sent ? 0 : 1 }}>
          <Display small sub={hold ? 'Keep holding…' : 'Mom will feel a gentle buzz on her phone.'}>Hold to send a pulse</Display>
        </div>
        <div className="pulse-stage">
          {[0, 1, 2, 3, 4].map((k) => <span key={k} className="pulse-ring" aria-hidden="true" style={{ '--i': k, animationDelay: `${k * 0.48}s` }} />)}
          {sent ? (
            <>
              <svg aria-hidden="true" width="260" height="240" viewBox="0 0 260 240" style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -100, marginTop: -120, overflow: 'visible', pointerEvents: 'none' }}>
                <defs>
                  <mask id="pulse-trail" maskUnits="userSpaceOnUse" x="-50" y="-300" width="420" height="500">
                    <path d={SENT_PATH} pathLength="1" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="1 1" style={{ strokeDashoffset: 0, animation: 'trailDraw 1s cubic-bezier(.5,0,.3,1) .95s backwards' }} />
                  </mask>
                </defs>
                <path d={SENT_PATH} mask="url(#pulse-trail)" fill="none" stroke="#c9b8f5" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.5 9" opacity=".9" />
              </svg>
              <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, marginTop: -120 }}>
                {SENT_SPARKS.map(([x, y, c, d], i) => <span key={i} style={{ position: 'absolute', left: x, top: y, width: 6, height: 6, borderRadius: 3, background: c, opacity: 0, animation: `sparkTrail .9s ease-out ${d}s both` }} />)}
              </div>
            </>
          ) : null}
          <button className="pulse-heart" aria-label={sent ? 'Pulse sent to Mom' : 'Hold to send a pulse to Mom'} disabled={sent}
            onPointerDown={down} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(e) } }}
            onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') up() }}
            style={sent ? undefined : { transform: `scale(${beat})` }}>
            <svg className="pulse-prog" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="86" fill="none" stroke="#f7b8d2" strokeOpacity=".45" strokeWidth="4" />
              <circle cx="100" cy="100" r="86" fill="none" stroke="#f27da6" strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 100 100)" />
            </svg>
            <span className="pulse-core">
              <svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#f48fb1" />
                <ellipse className="pulse-glint" cx="8.4" cy="9.2" rx="1.5" ry=".9" transform="rotate(-40 8.4 9.2)" fill="#fff" />
              </svg>
            </span>
          </button>
        </div>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 54, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, animation: 'settleIn .6s cubic-bezier(.2,.8,.2,1) 1.6s both' }}>Sent!</h1>
            <p className="body" style={{ textAlign: 'center', maxWidth: 270, marginTop: 10, fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.35, animation: 'settleIn .6s cubic-bezier(.2,.8,.2,1) 1.75s both' }}>Sent to Mom: “Thinking of you”</p>
            <button className="pill block" style={{ marginTop: 28, width: 'min(342px, 100%)', animation: 'settleIn .6s cubic-bezier(.2,.8,.2,1) 1.9s both' }} onClick={() => go('home')}>Back home</button>
          </div>
        ) : null}
      </div>
    </Screen>
  )
}
