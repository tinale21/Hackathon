import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { LOOKS, RECAP_EARLIER, RECAP_MONTHS, STAMPS } from '../data.js'
import { ENVELOPES, holo } from '../components/Envelope.jsx'
import { Display, Dock, Hero, IconButton, Placeholder, Screen, Segmented, StatusBar, TabBar, Tile, TopBar } from '../components/ui.jsx'
import Shape from '../components/Shape.jsx'
import Icon from '../components/Icon.jsx'
import { useDiscardGuard } from '../components/Discard.jsx'
import { VoiceOrb } from './Create.jsx'

function Wave({ n = 30, w = 150 }) {
  return (
    <svg width={w} height="30" viewBox={`0 0 ${n * 5} 30`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => { const h = 5 + ((i * 7) % 11); return <rect key={i} x={i * 5} y={15 - h} width="2.6" height={h * 2} rx="1.3" fill="rgba(29,29,34,.5)" /> })}
    </svg>
  )
}

/* ---------- New mail ---------- */
// The sealed envelope opens in four beats: the wax seal cracks, the flap swings up,
// the letter slides out, then the letter grows toward you and the Read screen opens.
const EW = 300, EH = 202
const MAIL_DOTS = [[30, 60, '#f7b8d2', 0], [52, 128, '#c9b8f5', 0.4], [24, 214, '#e6e0fa', 0.9], [60, 300, '#f7b8d2', 0.2],
  [334, 70, '#c9b8f5', 0.6], [310, 150, '#fbd3e2', 1.1], [340, 236, '#c9b8f5', 0.3], [316, 310, '#e6e0fa', 0.8]]

function OpeningEnvelope({ color, stampLook, phase, from, centerDy = -150 }) {
  const env = ENVELOPES.find((e) => e.id === color) || ENVELOPES[0]
  const bg = holo(env.c)
  const bgFront = holo([env.c[1], env.c[0], env.c[3], env.c[2], env.c[4]])
  const gone = phase >= 4
  const fade = { transition: 'opacity .45s ease, transform .5s cubic-bezier(.4,0,.2,1)', opacity: gone ? 0 : 1, transform: gone ? 'translateY(40px)' : 'none' }

  return (
    <div style={{ position: 'relative', width: EW, height: EH, perspective: 900, animation: phase === 0 ? 'wiggle 2.6s ease-in-out infinite' : 'none' }}>
      {/* back of the envelope */}
      <div className="holo still" style={{ '--holo': bg, position: 'absolute', inset: 0, borderRadius: 24, boxShadow: '0 24px 60px rgba(120,110,200,.22)', zIndex: 1, ...fade }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.28)' }} />
      </div>

      {/* the letter inside */}
      <div style={{ position: 'absolute', left: 16, right: 16, top: 10, height: EH - 26, borderRadius: 12, background: '#fff', zIndex: phase >= 4 ? 6 : 2, boxShadow: '0 6px 18px rgba(29,29,34,.08)', padding: '16px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 9,
        transform: phase >= 4 ? `translateY(${centerDy}px) scale(1.2)` : phase >= 3 ? 'translateY(-128px)' : 'none',
        transition: phase >= 4 ? 'transform .9s cubic-bezier(.45,0,.2,1)' : 'transform .6s cubic-bezier(.2,.8,.2,1)' }}>
        <span className="serif" style={{ fontSize: 18 }}>Dear Linh,</span>
        {[92, 100, 78, 88].map((w, i) => <span key={i} style={{ height: 6, width: `${w}%`, borderRadius: 3, background: '#eceef3' }} />)}
        <span className="small" style={{ marginTop: 'auto', textAlign: 'right' }}>love, {from}</span>
      </div>

      {/* front pocket */}
      <div className="holo still" style={{ '--holo': bgFront, position: 'absolute', inset: 0, borderRadius: 24, clipPath: 'polygon(0 0, 50% 66%, 100% 0, 100% 100%, 0 100%)', zIndex: 3, ...fade }}>
        <svg width={EW} height={EH} viewBox={`0 0 ${EW} ${EH}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <path d={`M0 0 L${EW / 2} ${EH * 0.66} L${EW} 0`} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2.5" />
        </svg>
        {/* stamp + postmark on the front */}
        <span style={{ position: 'absolute', right: 16, bottom: 14, width: 40, height: 48, background: '#fff', padding: 3, boxSizing: 'border-box', borderRadius: 4, transform: 'rotate(-5deg)', boxShadow: '0 2px 6px rgba(29,29,34,.12)' }}>
          {stampLook ? <span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 2 }}><Shape look={stampLook} /></span> : null}
        </span>
        <svg width="70" height="30" viewBox="0 0 70 30" aria-hidden="true" style={{ position: 'absolute', right: 40, bottom: 22 }}>
          {[5, 13, 21].map((y) => <path key={y} d={`M0 ${y} q6 -5 12 0 t12 0 t12 0 t12 0 t12 0`} fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.6" strokeLinecap="round" />)}
        </svg>
      </div>

      {/* top flap: swings open in 3D */}
      <div className="holo still" style={{ '--holo': bg, position: 'absolute', left: 0, right: 0, top: 0, height: EH * 0.66, borderRadius: '24px 24px 0 0', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformOrigin: 'top center',
        transform: phase >= 2 ? 'rotateX(180deg)' : 'rotateX(0deg)', transition: 'transform .6s cubic-bezier(.4,0,.2,1), opacity .45s ease', zIndex: phase >= 3 ? 0 : 4, opacity: gone ? 0 : 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: phase >= 2 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.12)', transition: 'background .6s' }} />
        <svg width={EW} height={EH * 0.66} viewBox={`0 0 ${EW} ${EH * 0.66}`} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <path d={`M2 2 L${EW / 2} ${EH * 0.66 - 2} L${EW - 2} 2`} fill="none" stroke="#fff" strokeOpacity=".95" strokeWidth="2.5" />
        </svg>
      </div>

      {/* wax seal, cracks in two */}
      <div aria-hidden="true" style={{ position: 'absolute', left: EW / 2 - 24, top: EH * 0.66 - 24, width: 48, height: 48, zIndex: 5, opacity: gone ? 0 : 1 }}>
        {['left', 'right'].map((side) => (
          <span key={side} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 0 0 5px rgba(201,184,245,.35), 0 3px 10px rgba(29,29,34,.12)',
            clipPath: side === 'left' ? 'polygon(0 0, 52% 0, 44% 30%, 56% 55%, 46% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 56% 55%, 44% 30%)',
            animation: phase >= 1 ? `${side === 'left' ? 'sealLeft' : 'sealRight'} .6s .12s cubic-bezier(.4,0,.6,1) both` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b9a6ee' }}>
            <Icon name="heart" size={18} stroke={2} />
          </span>
        ))}
        {phase >= 1 && (
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'absolute', inset: 0, animation: 'crackFlash .35s ease both' }}>
            <path d="M25 0 L21 14 L27 26 L22 48" fill="none" stroke="#7d62e0" strokeWidth="1.6" />
          </svg>
        )}
      </div>
    </div>
  )
}

export function Mail() {
  const { go, openLetter: l, setLetters } = useApp()
  const [phase, setPhase] = useState(0)
  const [centerDy, setCenterDy] = useState(-150)
  const envRef = useRef(null)
  const stamp = STAMPS.find((s) => s.id === l.stamp)
  const stampLookV = stamp && stamp.look ? LOOKS[stamp.look] : null

  const open = () => {
    if (phase) return
    const finish = () => {
      setLetters((ls) => ls.map((x) => (x.id === l.id ? { ...x, unread: false } : x)))
      go('read')
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish()
    // How far the letter must travel (from its resting spot inside the envelope) to sit at the screen's center.
    const env = envRef.current, screen = env && env.closest('.screen')
    if (env && screen) {
      const e = env.getBoundingClientRect(), sc = screen.getBoundingClientRect()
      const letterCenter = e.top + 10 + (EH - 26) / 2
      setCenterDy(Math.round(sc.top + sc.height / 2 - letterCenter))
    }
    setPhase(1)
    setTimeout(() => setPhase(2), 380)
    setTimeout(() => setPhase(3), 950)
    setTimeout(() => setPhase(4), 1550)
    setTimeout(finish, 3100)
  }

  return (
    <Screen>
      {MAIL_DOTS.map(([x, y, c, d], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: x, top: y + 130, width: 5, height: 5, borderRadius: 3, background: c, animation: `twinkle 1.8s ease-in-out ${d}s infinite` }} />
      ))}
      <div className="screen-body">
        <TopBar right={<IconButton icon="close" label="Close" onClick={() => go('home')} />} />
        <div style={{ opacity: phase >= 4 ? 0 : 1, transition: 'opacity .5s ease' }}>
          <Display sub={`for Linh, from ${l.from} · ${l.date}`}>New mail</Display>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, paddingBottom: 150 }}>
          <div style={{ position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 380, height: 300, margin: '-150px 0 0 -190px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(201,184,245,.25), rgba(255,255,255,0))' }} />
            <div ref={envRef} role="img" aria-label={`A sealed ${l.envelope || 'lilac'} envelope from ${l.from}`} style={{ position: 'relative' }}>
              <OpeningEnvelope color={l.envelope} stampLook={stampLookV} phase={phase} from={l.from} centerDy={centerDy} />
            </div>
          </div>
          <p className="small" style={{ textAlign: 'center', opacity: phase ? 0 : 1, transition: 'opacity .3s' }}>
            {stamp && stamp.id !== 'none' ? `Stamped “${stamp.label.toLowerCase()}” · ` : ''}sealed until you open it
          </p>
        </div>
      </div>
      <Dock><button className="pill block" onClick={open} disabled={phase > 0}>{phase ? 'Opening…' : 'Break the seal'}</button></Dock>
    </Screen>
  )
}

/* ---------- Read + respond ---------- */
// The letter is shown as the paper itself: stamp and postmark in the corner, the photo
// pasted in with its caption underneath, the message, and a sign-off. The reply is a
// second sheet of paper the reader writes on.
const NEED_PHRASE = { listen: 'someone to listen', cheer: 'a little encouragement', advice: 'advice', support: 'support', space: 'some space', distract: 'a distraction', home: 'a taste of home' }
const PAPER = { background: '#fffdf9', borderRadius: 8, boxShadow: '0 1px 0 rgba(29,29,34,.04), 0 18px 40px rgba(29,29,34,.10)', flexShrink: 0 }

function PaperStamp({ look }) {
  return (
    <div style={{ position: 'relative', width: 54, height: 62, flexShrink: 0 }}>
      <svg width="78" height="34" viewBox="0 0 78 34" aria-hidden="true" style={{ position: 'absolute', right: 26, top: 22 }}>
        {[6, 14, 22, 30].map((y) => <path key={y} d={`M0 ${y} q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0`} fill="none" stroke="#2b2733" strokeOpacity=".35" strokeWidth="1.3" strokeLinecap="round" />)}
      </svg>
      <div className="postage-wrap" style={{ position: 'absolute', right: 0, top: 0, transform: 'rotate(4deg)' }}>
        <div className="postage" style={{ width: 44, height: 52, padding: 4, '--r': '2.5px' }}>
          {look ? <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}><Shape look={look} /></div> : <div style={{ width: '100%', height: '100%', background: 'var(--fill)' }} />}
        </div>
      </div>
    </div>
  )
}

export function Read() {
  const { go, openLetter: l, setLetters } = useApp()
  const stamp = STAMPS.find((s) => s.id === l.stamp)
  const look = stamp && stamp.look ? LOOKS[stamp.look] : null
  const toggleSave = () => setLetters((ls) => ls.map((x) => (x.id === l.id ? { ...x, saved: !x.saved } : x)))
  const to = l.mine ? 'Mẹ' : 'Linh'
  const signer = l.mine ? 'Linh' : l.from
  const caption = l.caption || l.title
  const serif = { fontFamily: 'var(--serif)', letterSpacing: '-0.01em' }

  return (
    <Screen>
      <div className="screen-body scroll" style={{ paddingBottom: 110, gap: 22 }}>
        <TopBar
          left={<IconButton icon="back" label="Back" onClick={() => go('home')} />}
          center={<span className="small">{l.mine ? 'Sent by you' : <>from <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{l.from}</b></>} · {l.date}</span>}
          right={<IconButton icon="bookmark" label={l.saved ? 'Saved privately. Tap to remove' : 'Save privately (only you see this)'} onClick={toggleSave} style={l.saved ? { background: 'var(--ink)', color: '#fff' } : undefined} />}
        />

        {/* the letter */}
        <article aria-label={`Letter from ${l.mine ? 'you' : l.from}`} style={{ ...PAPER, padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
              <span className="label">{l.date}</span>
              <span className="small">{l.prompt}</span>
            </div>
            <PaperStamp look={look} />
          </div>

          <span style={{ ...serif, fontSize: 22 }}>Dear {to},</span>

          {l.kind === 'photo' && (
            <figure style={{ margin: 0, background: '#fff', padding: '10px 10px 14px', borderRadius: 4, boxShadow: '0 2px 10px rgba(29,29,34,.08)', transform: 'rotate(-1.2deg)' }}>
              {l.photo
                ? <img src={`${import.meta.env.BASE_URL}stamps/${l.photo}.jpg`} alt={`Photo from ${l.mine ? 'you' : l.from}`} style={{ display: 'block', width: '100%', height: 220, objectFit: 'cover', borderRadius: 2 }} />
                : <Placeholder label={`Photo from ${l.mine ? 'you' : l.from}`} style={{ height: 200, borderRadius: 2 }} />}
              <figcaption style={{ ...serif, fontStyle: 'italic', fontSize: 17, lineHeight: 1.35, color: 'var(--ink-2)', marginTop: 10, textAlign: 'center' }}>{caption}</figcaption>
            </figure>
          )}
          {l.kind === 'voice' && (
            <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px rgba(29,29,34,.06)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="icon-btn" style={{ background: 'var(--ink)', color: '#fff' }}><Icon name="play" /></span><Wave /><span className="small">1:12</span>
              </div>
              <span style={{ ...serif, fontStyle: 'italic', fontSize: 16, color: 'var(--ink-2)' }}>{caption}</span>
            </div>
          )}
          {l.handwriting ? (
            <img src={l.handwriting} alt={`Handwritten note from ${l.mine ? 'you' : l.from}`} style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain', alignSelf: 'flex-start' }} />
          ) : null}
          {l.body && l.body !== caption ? <p style={{ ...serif, margin: 0, fontSize: 19, lineHeight: 1.5 }}>{l.body}</p> : null}

          <span style={{ ...serif, fontStyle: 'italic', fontSize: 19, alignSelf: 'flex-end' }}>love, {signer}</span>
        </article>

        {stamp && stamp.id !== 'none' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            {look ? <span style={{ width: 22, height: 26, borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}><Shape look={look} /></span> : null}
            <span className="small" style={{ color: 'var(--ink-2)' }}>{l.mine ? <>You asked for <b style={{ fontWeight: 500, color: 'var(--ink)' }}>{NEED_PHRASE[stamp.id]}</b></> : <>{l.from} needs <b style={{ fontWeight: 500, color: 'var(--ink)' }}>{NEED_PHRASE[stamp.id]}</b></>}</span>
          </div>
        )}

      </div>
      <Dock>
        {l.mine
          ? <button className="pill block" onClick={() => go('history')}>Back to every letter</button>
          : <button className="pill block" onClick={() => go('reply')}><Icon name="pen" size={18} />Write back</button>}
      </Dock>
    </Screen>
  )
}

/* ---------- History: a gallery of every letter ---------- */
// A photo is either one of the bundled sample images (by name) or a picture the person chose (a data URL).
const photoUrl = (name) => (name && name.startsWith('data:') ? name : `${import.meta.env.BASE_URL}stamps/${name}.jpg`)
const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9]

function MiniStamp({ look }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', right: 8, top: 8, width: 24, height: 28, background: '#fff', padding: 2, boxSizing: 'border-box', borderRadius: 2, transform: 'rotate(5deg)', boxShadow: '0 1px 4px rgba(29,29,34,.15)', zIndex: 2 }}>
      {look ? <span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}><Shape look={look} /></span> : <span style={{ display: 'block', width: '100%', height: '100%', background: 'var(--fill)' }} />}
    </span>
  )
}

function GalleryItem({ l, i, onOpen, onSave }) {
  const s = STAMPS.find((x) => x.id === l.stamp)
  const look = s && s.look ? LOOKS[s.look] : null
  const who = l.mine ? `to Mẹ` : `from ${l.from}`
  const paper = { background: '#fffdf9', position: 'relative', overflow: 'hidden' }
  const serif = { fontFamily: 'var(--serif)', letterSpacing: '-0.01em' }

  let object
  if (l.kind === 'photo') {
    object = (
      <div style={{ ...paper, background: '#fff', padding: '7px 7px 10px' }}>
        <MiniStamp look={look} />
        {l.photo
          ? <img src={photoUrl(l.photo)} alt="" style={{ display: 'block', width: '100%', height: 130 + (i % 3) * 22, objectFit: 'cover', borderRadius: 2 }} />
          : <Placeholder style={{ height: 130 + (i % 3) * 22, borderRadius: 2 }} />}
        <span style={{ ...serif, display: 'block', fontStyle: 'italic', fontSize: 13, lineHeight: 1.3, color: 'var(--ink-2)', marginTop: 7, textAlign: 'center' }}>{l.caption || l.title}</span>
      </div>
    )
  } else if (l.kind === 'voice') {
    object = (
      <div style={{ ...paper, padding: '14px 12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MiniStamp look={look} />
        <span style={{ ...serif, fontSize: 14 }}>Dear {l.mine ? 'Mẹ' : 'Linh'},</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--fill)', borderRadius: 14, height: 30, padding: '0 8px' }}><Icon name="play" size={13} /><Wave n={14} w={80} /></span>
        <span style={{ ...serif, fontStyle: 'italic', fontSize: 13, alignSelf: 'flex-end' }}>— {l.mine ? 'Linh' : l.from}</span>
      </div>
    )
  } else {
    object = (
      <div style={{ ...paper, padding: '14px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 19px, #f0ece4 19px 20px)', backgroundPosition: '0 34px' }}>
        <MiniStamp look={look} />
        <span style={{ ...serif, fontSize: 14 }}>Dear {l.mine ? 'Mẹ' : 'Linh'},</span>
        {l.handwriting
          ? <img src={l.handwriting} alt="" style={{ width: '100%', maxHeight: 90, objectFit: 'contain', objectPosition: 'left' }} />
          : <span style={{ ...serif, fontSize: 13, lineHeight: '20px', color: 'var(--ink-2)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.body || l.title}</span>}
        <span style={{ ...serif, fontStyle: 'italic', fontSize: 13, alignSelf: 'flex-end' }}>— {l.mine ? 'Linh' : l.from}</span>
      </div>
    )
  }

  // One card: the photo or letter on top, then its title and a Save button underneath.
  return (
    <div style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)`, background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 0 rgba(29,29,34,.04), 0 10px 24px rgba(29,29,34,.09)' }}>
      <button onClick={onOpen} aria-label={`Open ${l.title}, ${who}, ${l.date}`} style={{ display: 'block', width: '100%', border: 'none', background: 'none', padding: 0, textAlign: 'left' }}>{object}</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 8px 10px 12px', borderTop: '1px dashed #ece8e0' }}>
        <button onClick={onOpen} tabIndex={-1} aria-hidden="true" style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.title}</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{who} · {l.date}</span>
        </button>
        <button className="squish" onClick={onSave} aria-pressed={!!l.saved} aria-label={l.saved ? `Unsave ${l.title}` : `Save ${l.title}`}
          style={{ width: 32, height: 32, borderRadius: 16, border: 'none', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: l.saved ? '#fffae6' : 'var(--fill)', color: l.saved ? '#f2b705' : 'var(--ink)', transition: 'background .2s, color .2s, transform .25s cubic-bezier(.16,1,.3,1)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={l.saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z" /></svg>
        </button>
      </div>
    </div>
  )
}

// Soft haze that settles in from the top and fades to white, like morning mist over the page.
const HAZE = 'radial-gradient(130% 42% at 50% 0%, rgba(214,234,219,.9) 0%, rgba(228,241,231,.55) 45%, rgba(255,255,255,0) 100%), linear-gradient(180deg, #eef6f0 0%, #f7faf7 28%, #ffffff 55%)'

export function History() {
  const { go, letters, setLetters, setOpenId } = useApp()
  const [f, setF] = useState('All')
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const shown = letters
    .filter((l) => f === 'All' || (f === 'Saved' ? l.saved : f === 'Sent' ? l.mine : !l.mine))
    .filter((l) => !needle || [l.title, l.caption, l.body, l.prompt, l.from, l.mine ? 'me linh sent' : 'received', l.date].filter(Boolean).join(' ').toLowerCase().includes(needle))
  const open = (l) => { setOpenId(l.id); go('read') }
  const cols = [shown.filter((_, i) => i % 2 === 0), shown.filter((_, i) => i % 2 === 1)]

  return (
    <Screen bg={HAZE}>
      <div className="screen-body scroll" style={{ paddingBottom: 40 }}>
        <TopBar right={<button className="pill ghost small" onClick={() => go('recap')}><Icon name="book" size={17} />Recap book</button>} />
        <Display sub={`${letters.length} letters and postcards`}>Every letter</Display>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--fill)', borderRadius: 22, height: 44, padding: '0 8px 0 16px', flexShrink: 0 }}>
          <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search letters and postcards" aria-label="Search letters and postcards"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, minWidth: 0 }} />
          {q ? <button aria-label="Clear search" onClick={() => setQ('')} style={{ width: 30, height: 30, borderRadius: 15, border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}><Icon name="close" size={14} /></button> : null}
        </label>
        <Segmented label="Show" options={['All', 'Sent', 'Received', 'Saved']} value={f} onChange={setF} />

        {shown.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start', paddingTop: 6 }}>
            {cols.map((col, c) => (
              <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: c ? 26 : 0 }}>
                {col.map((l) => <GalleryItem key={l.id} l={l} i={letters.indexOf(l)} onOpen={() => open(l)} onSave={() => setLetters((ls) => ls.map((x) => (x.id === l.id ? { ...x, saved: !x.saved } : x)))} />)}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <Icon name="envelope" size={28} style={{ color: 'var(--ink-3)' }} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>{needle ? `Nothing matches “${q.trim()}”` : f === 'Saved' ? 'No saved letters yet' : 'Nothing here yet'}</span>
            <span className="small">{needle ? 'Try a word from the letter, a name, or a date like “Oct”.' : f === 'Saved' ? 'Tap the bookmark on a letter to keep it here. Only you can see what you save.' : 'Letters will show up here.'}</span>
          </div>
        )}
      </div>
      <TabBar active="letters" />
    </Screen>
  )
}

/* ---------- Recap book: a full-screen, swipe-up feed (like Reels / TikTok) ---------- */
const MONTH_ORDER = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const lookOf = (l) => { const st = STAMPS.find((x) => x.id === l.stamp); return st && st.look ? LOOKS[st.look] : LOOKS.silk }
// Recap backgrounds move: two big soft glows in the card's colors float slowly behind the content.
// (They keep moving even with reduce motion on — see .glow-a / .glow-b in styles.css.)
const DRIFT = { isolation: 'isolate', overflow: 'hidden' }
function Glow({ a, b, faint }) {
  const k = faint ? ['33', '2b'] : ['b3', 'a6']
  const blob = { position: 'absolute', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }
  return (
    <>
      <span aria-hidden="true" className="glow-a" style={{ ...blob, left: -110, top: -120, width: 360, height: 360, background: `radial-gradient(circle, ${a}${k[0]} 0%, ${a}00 66%)` }} />
      <span aria-hidden="true" className="glow-b" style={{ ...blob, right: -130, top: 40, width: 320, height: 320, background: `radial-gradient(circle, ${b}${k[1]} 0%, ${b}00 66%)` }} />
    </>
  )
}
// Same top-down haze as Every letter, tinted with each card's own color.
const soft = (look, faint) => faint
  ? `radial-gradient(130% 42% at 50% 0%, ${look.c[0]}2b 0%, ${look.c[0]}10 45%, transparent 100%), #ffffff`
  : `radial-gradient(130% 42% at 50% 0%, ${look.c[0]}73 0%, ${look.c[0]}2e 45%, transparent 100%), linear-gradient(180deg, ${look.c[0]}2e 0%, transparent 32%), #ffffff`
const serif = { fontFamily: 'var(--serif)', letterSpacing: '-0.01em' }
// Wrapped-style motion: one confident move per element, fast start and a long soft settle, no overshoot.
const EASE = 'cubic-bezier(.16,1,.3,1)'
const B = (on, name, delay = 0, dur = 0.9) => (on ? `${name} ${dur}s ${delay}s ${EASE} both` : 'none')
// Text slides up from behind its own edge, like a line being revealed.
function Mask({ on, delay = 0, children, style }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style }}>
      <span style={{ display: 'block', animation: B(on, 'maskUp', delay, 1) }}>{children}</span>
    </span>
  )
}

function Avatar({ name, look, dark }) {
  return (
    <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...serif, fontSize: 16,
      background: `linear-gradient(135deg, ${look.c[0]}, ${look.c[1]})`, color: '#1d1d22', boxShadow: dark ? '0 0 0 2px rgba(255,255,255,.9)' : '0 0 0 2px #fff' }}>{name.slice(0, 1)}</span>
  )
}

function RailButton({ icon, label, active, onClick, dark, fill, show, delay = 0 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick && onClick() }} aria-label={label} aria-pressed={active}
      style={{ background: 'none', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: dark ? '#fff' : 'var(--ink)', font: 'inherit', animation: B(show, 'popIn', delay, 0.7) }}>
      <span className="squish" style={{ width: 46, height: 46, borderRadius: 23, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: dark ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.75)', backdropFilter: 'blur(10px)', color: active ? fill : 'inherit', animation: active ? 'jelly .55s ease-out' : 'none' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon === 'bookmark' ? <path d="M6 4h12v17l-6-4-6 4z" />
            : <><path d="M3 6h18v12H3z" fill="none" /><path d="M3 6l9 7 9-7" fill="none" /></>}
        </svg>
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, textShadow: dark ? '0 1px 4px rgba(0,0,0,.4)' : 'none' }}>{label}</span>
    </button>
  )
}

// One letter, full screen.
function LetterSlide({ l, active, saved, onSave, onReply, h = 764 }) {
  const look = lookOf(l)
  const dark = l.kind === 'photo'
  // Voice notes autoplay while their card is in view; a tap anywhere pauses or resumes.
  const [paused, setPaused] = useState(false)
  useEffect(() => { if (!active) setPaused(false) }, [active])
  const playing = l.kind === 'voice' && active && !paused
  const fg = dark ? '#fff' : 'var(--ink)'
  const who = l.mine ? 'You' : l.from
  const to = l.mine ? (l.to || 'Mẹ') : 'you'

  let stage
  if (l.kind === 'photo') {
    const src = l.photo ? photoUrl(l.photo) : null
    stage = (
      <>
        {src ? <img src={src} alt="" aria-hidden="true" style={{ position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(28px) brightness(.62) saturate(1.1)' }} />
          : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${look.c[0]}, ${look.c[1]})`, filter: 'brightness(.6)' }} />}
        <div style={{ position: 'absolute', left: 30, right: 30, top: 'min(128px, 15cqh)' }}>
        <div style={{ '--tilt': '-1.5deg', transform: 'rotate(var(--tilt))', background: '#fff', padding: '10px 10px 16px', borderRadius: 3, boxShadow: '0 30px 60px rgba(0,0,0,.35)', animation: B(active, 'dropIn', 0, 0.95) }}>
          {src ? <img src={src} alt={l.caption || l.title} style={{ display: 'block', width: '100%', height: 'max(140px, min(300px, calc(100cqh - 380px)))', objectFit: 'cover', borderRadius: 2 }} /> : <Placeholder style={{ height: 'max(140px, min(300px, calc(100cqh - 380px)))', borderRadius: 2 }} />}
          <span style={{ ...serif, display: 'block', fontStyle: 'italic', fontSize: 17, lineHeight: 1.35, color: 'var(--ink-2)', marginTop: 12, textAlign: 'center' }}><Mask on={active} delay={0.35}>{l.caption || l.title}</Mask></span>
        </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(transparent, rgba(0,0,0,.55))' }} />
      </>
    )
  } else if (l.kind === 'voice') {
    const N = 28
    stage = (
      <div style={{ position: 'absolute', inset: 0, background: soft(look, true), ...DRIFT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'min(26px, 3cqh)', padding: '90px clamp(0px, calc(560px - 70cqh), 76px) 160px 0' }}><Glow a={look.c[0]} b={look.c[1]} faint />
        <div style={{ animation: B(active, 'popIn', 0, 0.9), margin: '-20px 0 -24px' }}>
          <div style={{ position: 'relative' }}>
            <VoiceOrb rec={playing} mic={false} size={Math.round(Math.max(150, Math.min(260, h - 340)))} colors={[look.c[0], '#ffd3e2', look.c[1], '#d9ccfa', '#f6f2ff']} />
            {paused ? (
              <span aria-hidden="true" className="rise" style={{ position: 'absolute', left: '50%', top: '50%', width: 64, height: 64, margin: '-32px 0 0 -32px', borderRadius: 32, background: 'rgba(255,255,255,.7)', backdropFilter: 'blur(8px)', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDuration: '.25s' }}><Icon name="play" size={24} /></span>
            ) : null}
          </div>
        </div>
        <svg width="250" height="60" viewBox={`0 0 ${N * 9} 60`} aria-hidden="true">
          {Array.from({ length: N }, (_, i) => { const h = 8 + ((i * 7) % 13) * 1.6; return <rect key={i} x={i * 9} y={30 - h} width="4" height={h * 2} rx="2" fill="#1d1d22" opacity=".55" style={{ transformOrigin: `${i * 9 + 2}px 30px`, animation: playing ? `eq ${0.6 + (i % 5) * 0.12}s ${(i % 7) * 0.05}s ease-in-out infinite alternate` : B(active, 'barIn', 0.2 + i * 0.012, 0.9) }} /> })}
        </svg>
        <span style={{ ...serif, fontStyle: 'italic', fontSize: 17, color: 'var(--ink-2)', maxWidth: 260, textAlign: 'center' }}><Mask on={active} delay={0.45}>{l.body}</Mask></span>
      </div>
    )
  } else {
    stage = (
      <div style={{ position: 'absolute', inset: 0, background: soft(look), ...DRIFT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px clamp(28px, calc(440px - 55cqh), 80px) 120px 28px' }}><Glow a={look.c[0]} b={look.c[1]} />
        <div style={{ width: '100%' }}>
        <div style={{ '--tilt': '1deg', width: '100%', background: '#fffdf9', borderRadius: 6, padding: '24px 24px 20px', transform: 'rotate(var(--tilt))', boxShadow: '0 30px 60px rgba(29,29,34,.12)', display: 'flex', flexDirection: 'column', gap: 12,
          backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 31px, #f0ece4 31px 32px)', backgroundPosition: '0 58px', animation: B(active, 'dropIn', 0, 0.95) }}>
          <span style={{ ...serif, fontSize: 21, animation: B(active, 'bounceUp', 0.35) }}>Dear {l.mine ? to : 'Linh'},</span>
          {l.handwriting ? <img src={l.handwriting} alt="Handwritten note" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', objectPosition: 'left' }} />
            : <span style={{ ...serif, fontSize: 21, lineHeight: '32px' }}><Mask on={active} delay={0.3}>{l.body || l.title}</Mask></span>}
          <span style={{ ...serif, fontStyle: 'italic', fontSize: 19, alignSelf: 'flex-end', animation: B(active, 'bounceUp', 0.5) }}>— {l.mine ? 'Linh' : l.from}</span>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, cursor: l.kind === 'voice' ? 'pointer' : 'auto' }}
      onClick={l.kind === 'voice' ? () => setPaused((v) => !v) : undefined}
      role={l.kind === 'voice' ? 'button' : undefined} aria-label={l.kind === 'voice' ? (paused ? 'Play voice note' : 'Pause voice note') : undefined}>
      {stage}

      {/* right rail */}
      <div style={{ position: 'absolute', right: 14, bottom: 120, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        {!l.mine ? <RailButton icon="envelope" label="Write back" onClick={onReply} dark={dark} show={active} delay={0.45} /> : null}
        <RailButton icon="bookmark" label={saved ? 'Saved' : 'Save'} active={saved} onClick={onSave} dark={dark} fill={dark ? '#fff' : 'var(--ink)'} show={active} delay={0.55} />
      </div>

      {/* caption block */}
      <div style={{ position: 'absolute', left: 20, right: 84, bottom: 40, color: fg, display: 'flex', flexDirection: 'column', gap: 8, textShadow: dark ? '0 1px 6px rgba(0,0,0,.35)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: B(active, 'bounceUp', 0.2) }}>
          <Avatar name={who} look={look} dark={dark} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>{who}</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>{l.mine ? `to ${to}` : ''} · {l.date}</span>
        </div>
        <span style={{ ...serif, fontSize: 22, lineHeight: 1.2, animation: B(active, 'bounceUp', 0.28) }}>{l.title}</span>
        {l.kind === 'photo' && l.body ? <span style={{ fontSize: 14, lineHeight: 1.4, opacity: 0.9, animation: B(active, 'bounceUp', 0.34), display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.body}</span> : null}
        {NEED_PHRASE[l.stamp] ? (
          <span style={{ animation: B(active, 'popIn', 0.42, 0.7), transformOrigin: 'left center', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 500, padding: '5px 10px 5px 5px', borderRadius: 14, background: dark ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.8)', backdropFilter: 'blur(10px)', textShadow: 'none' }}>
            <span style={{ width: 18, height: 22, background: '#fff', padding: 2, boxSizing: 'border-box', borderRadius: 2, display: 'inline-block', animation: active ? 'spin 6s linear infinite' : 'none' }}><span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}><Shape look={look} /></span></span>
            {l.mine ? 'You needed' : `${l.from} needs`} {NEED_PHRASE[l.stamp]}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const fadeEdge = (stop) => ({ WebkitMaskImage: `radial-gradient(circle, #000 ${stop}%, transparent 71%)`, maskImage: `radial-gradient(circle, #000 ${stop}%, transparent 71%)` })

function ChapterSlide({ m, items, active }) {
  const look = LOOKS[m.look]
  // The faded pastel circle used across the app (voice memo, envelopes), tinted with this month's colors.
  const pastel = [look.c[0], '#ffd3e2', look.c[1], '#d9ccfa', '#f6f2ff']
  const voice = items.filter((x) => x.kind === 'voice').length, photos = items.filter((x) => x.kind === 'photo').length
  return (
    <div style={{ position: 'absolute', inset: 0, background: soft(look), ...DRIFT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', padding: '0 32px' }}><Glow a={look.c[0]} b={look.c[1]} />
      <div aria-hidden="true" style={{ position: 'absolute', right: -80, top: 100, width: 300, height: 300, borderRadius: '50%', opacity: 0.5, ...fadeEdge(22), animation: active ? `${B(true, 'growIn', 0, 1.4)}, drift 14s 1.4s ease-in-out infinite alternate` : 'none' }}><span style={{ position: 'absolute', inset: '-15%', background: holo(pastel), filter: 'blur(26px)' }} /></div>
      <div aria-hidden="true" style={{ position: 'absolute', left: -90, bottom: 90, width: 250, height: 250, borderRadius: '50%', opacity: 0.4, ...fadeEdge(18), animation: B(active, 'growIn', 0.1, 1.4) }}><span style={{ position: 'absolute', inset: '-15%', background: holo(pastel), filter: 'blur(28px)' }} /></div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span className="label" style={{ animation: B(active, 'popIn', 0, 0.6) }}>Chapter {MONTH_ORDER.indexOf(m.id) + 1}</span>
        <h2 className="display" style={{ fontSize: 64, margin: 0 }} aria-label={m.name}><Mask on={active} delay={0.1}>{m.name}</Mask></h2>
        <span style={{ ...serif, fontStyle: 'italic', fontSize: 22, color: 'var(--ink-2)', animation: B(active, 'bounceUp', 0.3) }}>{m.theme}</span>
        <span className="small" style={{ marginTop: 6, animation: B(active, 'bounceUp', 0.4) }}>{items.length} letters · {photos} photo{photos === 1 ? '' : 's'} · {voice} voice note{voice === 1 ? '' : 's'}</span>
      </div>
    </div>
  )
}

function QuoteSlide({ m, active }) {
  const look = LOOKS[m.look]
  return (
    <div style={{ position: 'absolute', inset: 0, background: soft(look), ...DRIFT, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px 60px', gap: 18 }}><Glow a={look.c[0]} b={look.c[1]} />
      <span style={{ ...serif, fontSize: 120, lineHeight: 0.6, color: 'rgba(29,29,34,.18)', alignSelf: 'flex-start', animation: B(active, 'popIn', 0, 0.8) }}>“</span>
      <p style={{ ...serif, fontSize: 36, lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}><Mask on={active} delay={0.15}>{m.quote.text}</Mask></p>
      <span style={{ fontSize: 14, color: 'var(--ink-2)', animation: B(active, 'bounceUp', 0.5) }}>— {m.quote.who}</span>
    </div>
  )
}

export function Recap() {
  const { go, letters, setLetters, setOpenId } = useApp()
  const [shown, setShown] = useState(1)
  const [idx, setIdx] = useState(0)
  const [saved, setSaved] = useState(() => new Set(letters.filter((l) => l.saved).map((l) => l.id)))
  const feed = useRef(null)
  const [slideH, setSlideH] = useState(764)
  useEffect(() => {
    const el = feed.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => setSlideH(el.clientHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const monthOf = (l) => l.month || (l.date || '').slice(0, 3)
  const day = (l) => parseInt((l.date || '').slice(4), 10) || 99
  const all = [...RECAP_EARLIER, ...letters.map((l) => ({ ...l, month: l.date === 'Today' ? 'Oct' : monthOf(l) }))]
  const chapters = RECAP_MONTHS.map((m) => ({ m, items: all.filter((l) => l.month === m.id).sort((a, b) => day(a) - day(b)) })).filter((c) => c.items.length)
  const done = shown >= chapters.length

  // Build the feed: cover, then for each month a title card, its letters, and a quote after the second letter.
  const slides = [{ key: 'cover', type: 'cover' }]
  chapters.slice(0, shown).forEach(({ m, items }) => {
    slides.push({ key: `ch-${m.id}`, type: 'chapter', m, items })
    items.forEach((l, i) => {
      slides.push({ key: l.id, type: 'letter', l, m })
      if (i === 1) slides.push({ key: `q-${m.id}`, type: 'quote', m })
    })
  })
  slides.push({ key: done ? 'end' : 'loading', type: done ? 'end' : 'loading' })

  // Endless: load the next month a few cards before the end.
  useEffect(() => { if (!done && idx >= slides.length - 3) setShown((n) => n + 1) }, [idx, done, slides.length])

  const onScroll = (e) => { const el = e.currentTarget; const i = Math.round(el.scrollTop / el.clientHeight); if (i !== idx) setIdx(i) }
  // Re-check once scrolling settles, so the current card is right even if the last scroll event came early.
  useEffect(() => {
    const el = feed.current
    if (!el) return
    const settle = () => setIdx(Math.round(el.scrollTop / el.clientHeight))
    el.addEventListener('scrollend', settle)
    return () => el.removeEventListener('scrollend', settle)
  }, [])
  const toggle = (setter, id) => setter((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const reply = (l) => {
    if (!letters.some((x) => x.id === l.id)) setLetters((prev) => [...prev, { ...l, unread: false }])
    setOpenId(l.id); go('reply')
  }

  const cur = slides[idx] || slides[0]
  const dark = cur.type === 'letter' && cur.l.kind === 'photo'
  const month = cur.m ? cur.m.name : null
  const total = all.length

  return (
    <section className="screen" style={{ background: '#111', color: dark ? '#fff' : 'var(--ink)', transition: 'color .25s' }}>
      <div ref={feed} className="scroll" onScroll={onScroll} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 80, zIndex: 0, isolation: 'isolate', scrollSnapType: 'y mandatory', overscrollBehavior: 'contain' }}>
        {slides.map((s, i) => (
          <div key={s.key} style={{ position: 'relative', height: '100%', containerType: 'size', scrollSnapAlign: 'start', scrollSnapStop: 'always', overflow: 'hidden' }}>
            {Math.abs(i - idx) > 2 ? null
              : s.type === 'cover' ? (
                <div style={{ position: 'absolute', inset: 0, background: HAZE, ...DRIFT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}><Glow a="#bfe3c9" b="#e4efc8" />
                  <span className="label" style={{ animation: B(i === idx, 'popIn', 0, 0.6) }}>Fall 2026</span>
                  <h1 className="display" style={{ fontSize: 54, margin: 0 }} aria-label="Your fall, in letters"><Mask on={i === idx} delay={0.1}>Your fall,</Mask><Mask on={i === idx} delay={0.22}>in letters</Mask></h1>
                  <div style={{ position: 'relative', width: 250, height: 160, margin: '14px 0' }}>
                    {['art-poppy-field', 'art-vetheuil', 'art-water-lilies'].map((p, k) => (
                      <div key={p} className="postage-wrap" style={{ position: 'absolute', left: 30 + k * 52, top: k === 1 ? 0 : 18, '--tilt': `${[-9, 3, 11][k]}deg`, transform: 'rotate(var(--tilt))', zIndex: k === 1 ? 2 : 1, animation: B(i === idx, 'dropIn', 0.35 + [0.08, 0, 0.16][k], 1.1) }}>
                        <div className="postage" style={{ width: 96, height: 118 }}><img src={photoUrl(p)} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                      </div>
                    ))}
                  </div>
                  <span className="small" style={{ animation: B(i === idx, 'bounceUp', 0.6) }}>{total} letters · {all.filter((x) => x.kind === 'photo').length} photos · {all.filter((x) => x.kind === 'voice').length} voice notes</span>
                </div>
              ) : s.type === 'chapter' ? <ChapterSlide m={s.m} items={s.items} active={i === idx} />
              : s.type === 'quote' ? <QuoteSlide m={s.m} active={i === idx} />
              : s.type === 'letter' ? (
                <LetterSlide l={s.l} h={slideH} active={i === idx} saved={saved.has(s.l.id)}
                  onSave={() => toggle(setSaved, s.l.id)} onReply={() => reply(s.l)} />
              ) : s.type === 'loading' ? (
                <div style={{ position: 'absolute', inset: 0, background: '#fbfaf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="small">Turning the page…</span></div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: HAZE, ...DRIFT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, textAlign: 'center', padding: '0 36px' }}><Glow a="#bfe3c9" b="#e4efc8" />
                  <span className="label">You’re all caught up</span>
                  <h2 className="display" style={{ fontSize: 44, margin: 0 }}>To be continued…</h2>
                  <p className="body" style={{ maxWidth: 270, margin: 0 }}>November and December will fill in as letters arrive. The finished book comes at the end of the semester.</p>
                  <button className="pill" style={{ marginTop: 12 }} onClick={() => feed.current && feed.current.scrollTo({ top: 0, behavior: 'smooth' })}>Back to the beginning</button>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* overlay chrome: status bar, back, title, and a progress rail */}
      <div style={{ position: 'relative', zIndex: 6, pointerEvents: 'none', willChange: 'transform' }}>
        <StatusBar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 0' }}>
          <button className="icon-btn ghost" aria-label="Back" onClick={() => go('history')} style={{ pointerEvents: 'auto', background: dark ? 'rgba(255,255,255,.18)' : undefined, color: dark ? '#fff' : undefined }}><Icon name="back" /></button>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textShadow: dark ? '0 1px 6px rgba(0,0,0,.35)' : 'none' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Recap book</span>
            {month ? <span style={{ fontSize: 12, opacity: 0.75 }}>{month} 2026</span> : null}
          </span>
          <span style={{ width: 44 }} />
        </div>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', right: 5, top: 130, bottom: 210, width: 3, borderRadius: 2, background: dark ? 'rgba(255,255,255,.2)' : 'rgba(29,29,34,.08)', zIndex: 6 }}>
        <span style={{ position: 'absolute', left: 0, right: 0, top: 0, height: `${((idx + 1) / slides.length) * 100}%`, borderRadius: 2, background: dark ? '#fff' : 'var(--ink)', transition: 'height .3s' }} />
      </div>
      <TabBar active="letters" solid style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, boxSizing: 'border-box', zIndex: 7, borderTop: '1px solid rgba(29,29,34,.06)' }} />
    </section>
  )
}
