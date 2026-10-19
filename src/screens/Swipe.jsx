import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { PROMPTS } from '../data.js'
import { Screen } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

/*
  Pick your prompt: a swipe deck built from the team's Figma frame (iPhone 16 - 1).
  Swipe right (or Answer) to answer, left (or Skip) to pass. Undo brings back the last skip.
*/
const INTER = "'Inter', 'Geist', system-ui, sans-serif"
const THRESHOLD = 110
const MODES = [
  { id: 'photo', label: 'Photo', icon: 'photo' },
  { id: 'voice', label: 'Voice memo', icon: 'voice' },
  { id: 'text', label: 'Words', icon: 'text' },
]

// The end-of-deck card uses the same tide gradient in soft lilac.
const DONE = { card: ['#e7e2fb', '#aab6f3'], ink: '#1f2457' }
const cardBg = (p) => `linear-gradient(180deg, #f5f5f5 0%, #f5f5f5 36%, ${p.card[0]} 58%, ${p.card[1]} 92%)`
// Illustrated cards: the painting under a light white veil (and a soft fade at the bottom), over its own base color.
const cardPaint = (p) => p.img
  ? `${p.fade ? `linear-gradient(transparent 82%, rgba(255,255,255,${p.fade}) 93%), ` : ''}linear-gradient(rgba(255,255,255,${p.veil ?? 0.3}), rgba(255,255,255,${p.veil ?? 0.3})), url(${p.img}) ${p.imgPos || '50% 50%'}/${p.imgSize || 'cover'} no-repeat, ${p.imgBg || '#fff'}`
  : cardBg(p)

function PromptCard({ p, level, drag, leaving, ghost, hint, onPointerDown, onPointerMove, onPointerUp }) {
  const top = level === 0
  // Cards waiting behind sit a little smaller and muted, so the active one clearly leads.
  let transform = level ? `translateY(${level * 40}px) scale(${1 - level * 0.04})` : 'translateY(0px)'
  let transition = 'transform .35s cubic-bezier(.2,.8,.2,1)'
  let fx = null
  if (ghost) {
    // A skipped card keeps flying from wherever it was let go, while the next card is already live.
    fx = { '--x0': `${ghost.dx}px`, '--y0': `${ghost.dy * 0.3}px`, '--r0': `${ghost.dx / 16}deg`, '--x1': `${ghost.dir * 560}px`, '--y1': `${ghost.dy * 0.4}px`, '--r1': `${ghost.dir * 24}deg`, animation: 'flyOut .34s cubic-bezier(.4,0,.6,1) forwards', pointerEvents: 'none' }
    transform = undefined
    transition = 'none'
  } else if (top && leaving) {
    transform = `translate(${leaving * 560}px, ${drag.dy * 0.4}px) rotate(${leaving * 24}deg)`
    transition = 'transform .34s cubic-bezier(.4,0,.6,1)'
  } else if (top && drag.active) {
    transform = `translate(${drag.dx}px, ${drag.dy * 0.3}px) rotate(${drag.dx / 16}deg)`
    transition = 'none'
  }
  // Teaching nudge (like Hinge/Tinder): the card tips right, tips left, settles. Runs twice, then stops.
  const hinting = top && hint && !drag.active && !leaving && !ghost
  if (hinting) fx = { ...fx, animation: 'cardHint 2.8s .9s ease-in-out 2' }
  const yes = top ? Math.max(0, Math.min(1, drag.dx / THRESHOLD)) : 0
  const no = top ? Math.max(0, Math.min(1, -drag.dx / THRESHOLD)) : 0

  return (
    <div
      onPointerDown={top ? onPointerDown : undefined}
      onPointerMove={top ? onPointerMove : undefined}
      onPointerUp={top ? onPointerUp : undefined}
      onPointerCancel={top ? onPointerUp : undefined}
      onLostPointerCapture={top ? onPointerUp : undefined}
      onDragStart={(e) => e.preventDefault()}
      aria-hidden={!top || !!ghost}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 'calc(100% - 86px)', containerType: 'size', borderRadius: 22, background: cardPaint(p), zIndex: ghost ? 20 : 10 - level, transform, transformOrigin: '50% 100%', transition, ...fx, touchAction: 'none', cursor: top ? (drag.active ? 'grabbing' : 'grab') : 'default', boxShadow: top ? '0 18px 40px rgba(29,29,34,.10)' : 'none', overflow: 'hidden', userSelect: 'none' }}
    >
      {/* Slow ambient motion on the front card: the painting drifts (or the color tide rises and falls), and a soft light moves through it. */}
      {p.img
        ? <span aria-hidden="true" style={{ position: 'absolute', inset: '-3%', background: cardPaint(p), animation: top && !ghost ? 'paintDrift 11s ease-in-out infinite alternate' : 'none', pointerEvents: 'none' }} />
        : <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: cardBg(p), backgroundSize: '100% 118%', backgroundPosition: '50% 0%', animation: top && !ghost ? 'tide 9s ease-in-out infinite alternate' : 'none', pointerEvents: 'none' }} />}
      {top && !ghost ? <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '46cqh', width: 320, height: 320, marginLeft: -160, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${p.img ? 0.26 : 0.38}) 0%, ${p.card[0]}${p.img ? '33' : '55'} 35%, transparent 65%)`, animation: 'glowDrift 14s ease-in-out infinite', pointerEvents: 'none' }} /> : null}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#fff', opacity: top ? 0 : 0.6 + (level - 1) * 0.15, transition: 'opacity .35s ease', pointerEvents: 'none', zIndex: 3 }} />
      {top && (
        <>
          {/* Frosted bands keep the title and description readable over the painting. */}
          {p.img ? <div aria-hidden="true" className="pc-blur pc-blur-top" /> : null}
          {p.img ? <div aria-hidden="true" className={`pc-blur pc-blur-bottom${p.darkBottom ? ' dark' : ''}`} /> : null}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 'min(44px, 9cqh)', textAlign: 'center', padding: '0 20px' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'min(35px, 10cqw)', lineHeight: 1.1, letterSpacing: '-0.02em', color: p.ink }}>
              {p.lead}<br />
              <span style={{ background: `linear-gradient(90deg, ${p.grad[0]}, ${p.grad[1]})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{p.accentText}</span>
            </h2>
            <p style={{ margin: '14px 0 0', fontFamily: INTER, fontSize: 15, color: p.img ? `${p.ink}b3` : '#9a9a9f' }}>{p.sub}</p>
          </div>
          {p.img ? null : <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '42cqh', width: 'min(212px, 46cqh)', height: 'min(212px, 46cqh)', marginLeft: 'calc(min(212px, 46cqh) / -2)', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.08) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.7)', animation: 'breathe 7s ease-in-out infinite' }} />}
          {!p.img && p.category ? (
          <span style={{ position: 'absolute', left: '50%', top: '64cqh', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.7)', borderRadius: 14, padding: '5px 11px', fontFamily: INTER, fontSize: 12, color: p.ink, whiteSpace: 'nowrap' }}>
            <Icon name={MODES.find((m) => m.id === p.kind).icon} size={14} />{p.category}
          </span>
          ) : null}
          <p style={{ position: 'absolute', left: 24, right: 24, bottom: 26, margin: 0, textAlign: 'center', fontFamily: INTER, fontSize: 12.5, lineHeight: 1.45, color: p.img && !p.darkBottom ? p.ink : '#fff', textShadow: p.img ? (p.darkBottom ? '0 1px 8px rgba(0,0,0,.35)' : '0 0 10px rgba(255,255,255,.9)') : '0 1px 8px rgba(0,0,0,.08)' }}>{p.desc}</p>

          <span style={{ position: 'absolute', left: 20, top: 20, transform: 'rotate(-10deg)', border: '2px solid #2b8a5e', color: '#2b8a5e', borderRadius: 10, padding: '4px 10px', fontFamily: INTER, fontWeight: 600, fontSize: 15, letterSpacing: '.06em', opacity: yes, background: 'rgba(255,255,255,.8)' }}>ANSWER</span>
          <span style={{ position: 'absolute', right: 20, top: 20, transform: 'rotate(10deg)', border: '2px solid #6b6b72', color: '#6b6b72', borderRadius: 10, padding: '4px 10px', fontFamily: INTER, fontWeight: 600, fontSize: 15, letterSpacing: '.06em', opacity: no, background: 'rgba(255,255,255,.8)' }}>SKIP</span>
        </>
      )}
    </div>
  )
}

export default function Swipe() {
  const { go, promptIndex, setPromptIndex, setDraft } = useApp()
  const [index, setIndex] = useState(promptIndex % PROMPTS.length)
  const [skipped, setSkipped] = useState([])
  const [drag, setDrag] = useState({ dx: 0, dy: 0, active: false })
  const [leaving, setLeaving] = useState(0)
  const [ghosts, setGhosts] = useState([])
  const [hint, setHint] = useState(true)
  const [sheet, setSheet] = useState(false)
  // Bumped to replay the refresh spin and deal cards back onto the deck (all: a fresh shuffle, else just the returned card).
  const [deal, setDeal] = useState({ n: 0, all: false, on: false })
  useEffect(() => {
    if (!deal.on) return
    const t = setTimeout(() => setDeal((d) => ({ ...d, on: false })), 800)
    return () => clearTimeout(t)
  }, [deal.n, deal.on])
  const start = useRef(null)

  const p = PROMPTS[index]
  const done = index >= PROMPTS.length
  const glow = p ? p.card[0] : '#e6eefb'

  const fly = useCallback((dir, from = { dx: 0, dy: 0 }) => {
    if (!p || leaving || sheet) return
    setHint(false)
    if (dir < 0) {
      // Skip: hand the card to a ghost that animates away, and move the deck forward right now.
      const g = { key: `${p.id}-${Date.now()}`, p, dir, dx: from.dx, dy: from.dy }
      setGhosts((gs) => [...gs, g])
      setTimeout(() => setGhosts((gs) => gs.filter((x) => x !== g)), 380)
      setSkipped((s) => [...s, index])
      setIndex((i) => i + 1)
      setDrag({ dx: 0, dy: 0, active: false })
      return
    }
    setLeaving(dir)
    setTimeout(() => { setDrag({ dx: 0, dy: 0, active: false }); setSheet(true) }, 320)
  }, [p, leaving, sheet, index])

  useEffect(() => {
    const onKey = (e) => {
      if (sheet) return
      if (e.key === 'ArrowRight') fly(1)
      if (e.key === 'ArrowLeft') fly(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fly, sheet])

  const last = useRef({ dx: 0, dy: 0 })
  const vel = useRef({ x: 0, t: 0, v: 0 })
  const down = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    if (leaving || sheet) return
    setHint(false)
    start.current = [e.clientX, e.clientY]
    last.current = { dx: 0, dy: 0 }
    vel.current = { x: e.clientX, t: e.timeStamp, v: 0 }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    setDrag({ dx: 0, dy: 0, active: true })
  }
  const move = (e) => {
    if (!start.current) return
    last.current = { dx: e.clientX - start.current[0], dy: e.clientY - start.current[1] }
    const dt = e.timeStamp - vel.current.t
    if (dt > 0) vel.current = { x: e.clientX, t: e.timeStamp, v: 0.7 * ((e.clientX - vel.current.x) / dt) + 0.3 * vel.current.v }
    setDrag({ ...last.current, active: true })
  }
  const up = (e) => {
    if (!start.current) return
    if (e && e.type === 'pointerup' && e.clientX != null) last.current = { dx: e.clientX - start.current[0], dy: e.clientY - start.current[1] }
    start.current = null
    const { dx, dy } = last.current
    // A quick flick counts even if it's short (px per ms).
    const flick = Math.abs(dx) > 40 && Math.abs(vel.current.v) > 0.5 && Math.sign(vel.current.v) === Math.sign(dx)
    if (dx > THRESHOLD || (flick && dx > 0)) fly(1, { dx, dy })
    else if (dx < -THRESHOLD || (flick && dx < 0)) fly(-1, { dx, dy })
    else setDrag({ dx: 0, dy: 0, active: false })
  }

  const undo = () => {
    if (!skipped.length || leaving) return
    setIndex(skipped[skipped.length - 1])
    setSkipped((s) => s.slice(0, -1))
    setDeal((d) => ({ n: d.n + 1, all: false, on: true }))
  }
  const shuffle = () => { setIndex(0); setSkipped([]); setDeal((d) => ({ n: d.n + 1, all: true, on: true })) }
  const cancelSheet = () => { setSheet(false); setLeaving(0) }
  const choose = (mode) => {
    setPromptIndex(index)
    setDraft({ promptId: p.id, kind: mode, replyTo: null })
    go(mode === 'text' ? 'write' : 'capture')
  }

  return (
    <Screen className="has-nav prompt-screen" bg={`radial-gradient(120% 70% at 50% 45%, ${glow} 0%, rgba(255,255,255,0) 62%), #fff`}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 20px 104px', fontFamily: INTER, minHeight: 0, transition: 'background .5s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', height: 44 }}>
          <button className="icon-btn" aria-label="Home" onClick={() => go('home')} style={{ background: 'transparent' }}><Icon name="home" size={24} /></button>
          <span style={{ textAlign: 'center', fontSize: 17, fontWeight: 500, color: '#3a3a40' }}>Pick your prompt</span>
          <button className="icon-btn" aria-label="Undo last skip" onClick={undo} disabled={!skipped.length} style={{ background: 'transparent', opacity: skipped.length ? 1 : 0.25 }}><span key={deal.n} style={{ display: 'flex', animation: deal.n ? 'spinBack .55s cubic-bezier(.3,.7,.2,1)' : 'none' }}><Icon name="refresh" size={20} /></span></button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#9a9a9f', marginTop: 2 }}>
          {done ? 'All caught up' : `${index + 1} of ${PROMPTS.length} · swipe right to answer, left to skip`}
        </div>

        <div style={{ position: 'relative', flex: 1, minHeight: 300, maxHeight: 556, marginTop: 14 }}>
          {done ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 'calc(100% - 86px)', containerType: 'size', borderRadius: 22, overflow: 'hidden', background: cardBg(DONE), boxShadow: '0 18px 40px rgba(29,29,34,.10)', animation: 'dealIn .55s cubic-bezier(.2,.8,.2,1) both', '--deal-r': '-4deg' }}>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: cardBg(DONE), backgroundSize: '100% 118%', backgroundPosition: '50% 0%', animation: 'tide 9s ease-in-out infinite alternate', pointerEvents: 'none' }} />
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '46cqh', width: 320, height: 320, marginLeft: -160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.38) 0%, #e7e2fb55 35%, transparent 65%)', animation: 'glowDrift 14s ease-in-out infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 'min(44px, 9cqh)', textAlign: 'center', padding: '0 20px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'min(35px, 10cqw)', lineHeight: 1.1, letterSpacing: '-0.02em', color: DONE.ink }}>That’s all for<br /><span style={{ background: 'linear-gradient(90deg, #5d6fe8, #a184f2)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>this week</span></h2>
                <p style={{ margin: '14px 0 0', fontFamily: INTER, fontSize: 15, color: '#9a9a9f' }}>every prompt, seen</p>
              </div>
              <p style={{ position: 'absolute', left: 24, right: 24, bottom: 26, margin: 0, textAlign: 'center', fontFamily: INTER, fontSize: 12.5, lineHeight: 1.45, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.08)' }}>No prompt is required. Shuffle the deck again, or write whatever’s on your mind.</p>
            </div>
          ) : (
            [2, 1, 0].map((level) => {
              const q = PROMPTS[index + level]
              if (!q) return null
              const card = <PromptCard p={q} level={level} drag={drag} leaving={level === 0 ? leaving : 0} hint={hint} onPointerDown={down} onPointerMove={move} onPointerUp={up} />
              // Dealt cards drop in from above, back of the deck first.
              const dealt = deal.on && (deal.all || level === 0)
              return <div key={q.id} style={{ position: 'absolute', inset: 0, '--deal-r': `${level % 2 ? 5 : -5}deg`, animation: dealt ? `dealIn .55s cubic-bezier(.2,.8,.2,1) ${deal.all ? (2 - level) * 90 : 0}ms both` : 'none' }}>{card}</div>
            })
          )}
          {ghosts.map((g) => <PromptCard key={g.key} p={g.p} level={0} drag={{ dx: 0, dy: 0, active: false }} ghost={g} />)}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexShrink: 0, position: 'relative', zIndex: 7 }}>
          {done ? (
            <>
              <button onClick={shuffle} style={{ flex: 1, height: 50, borderRadius: 25, border: 'none', background: '#2b2b30', color: '#fff', fontFamily: INTER, fontSize: 18, fontWeight: 500 }}>Shuffle again</button>
              <button onClick={() => { setDraft({ promptId: null, kind: 'text', replyTo: null }); go('write') }} style={{ flex: 1, height: 50, borderRadius: 25, border: 'none', background: '#f0f0f2', color: '#1d1d22', fontFamily: INTER, fontSize: 18, fontWeight: 500 }}>Write freely</button>
            </>
          ) : (
          <>
          <button onClick={() => fly(1)} disabled={done} style={{ flex: 1, height: 50, borderRadius: 25, border: 'none', background: '#2b2b30', color: '#fff', fontFamily: INTER, fontSize: 18, fontWeight: 500, opacity: done ? 0.4 : 1 }}>Answer</button>
          <button onClick={() => fly(-1)} disabled={done} style={{ flex: 1, height: 50, borderRadius: 25, border: 'none', background: '#f0f0f2', color: '#1d1d22', fontFamily: INTER, fontSize: 18, fontWeight: 500, opacity: done ? 0.4 : 1 }}>Skip</button>
          </>
          )}
        </div>
      </div>

      {sheet && p && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'flex-end', fontFamily: INTER }}>
          <button aria-label="Cancel" onClick={cancelSheet} className="sheet-scrim" style={{ position: 'absolute', inset: 0, border: 'none', background: 'rgba(29,29,34,.28)' }} />
          <div role="dialog" aria-label="Answer with" className="sheet-panel" style={{ position: 'relative', width: '100%', background: '#fff', borderRadius: '28px 28px 0 0', padding: '22px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, background: '#e2e3e8' }} />
            <h3 style={{ margin: '6px 0 0', fontWeight: 500, fontSize: 20, letterSpacing: '-0.01em', color: p.ink }}>{p.title}</h3>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: '#8e919c' }}>Answer however you like. Every way works.</p>
            {MODES.map((m) => (
              <button key={m.id} onClick={() => choose(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, height: 58, borderRadius: 18, border: 'none', padding: '0 16px', background: m.id === p.kind ? p.card[0] : '#f5f5f7', color: '#1d1d22', fontSize: 16, textAlign: 'left' }}>
                <Icon name={m.icon} size={22} />
                <span style={{ flex: 1 }}>{m.label}</span>
                {m.id === p.kind && <span style={{ fontSize: 12, fontWeight: 500, color: p.ink, background: 'rgba(255,255,255,.75)', borderRadius: 10, padding: '3px 9px' }}>Suggested</span>}
              </button>
            ))}
            <button onClick={cancelSheet} style={{ height: 48, border: 'none', background: 'transparent', color: '#6b6b72', fontSize: 15 }}>Not this one</button>
          </div>
        </div>
      )}
    </Screen>
  )
}
