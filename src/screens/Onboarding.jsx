import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { LOOKS, QUESTIONS, STAMPS, stampLook } from '../data.js'
import { Display, Dock, IconButton, Progress, Screen, Tile } from '../components/ui.jsx'
import Shape from '../components/Shape.jsx'
import Icon from '../components/Icon.jsx'
import Envelope from '../components/Envelope.jsx'

const asset = (f) => `${import.meta.env.BASE_URL}stamps/${f}`
const calm = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
const NAME = 'Audrey'

/* ---------- Brand mark ---------- */
// Eight rounded petals in a ring: the same shape the splash tiles form before they turn into the logo.
export function LumenMark({ size = 54 }) {
  return (
    <svg width={size} height={size} viewBox="-27 -27 54 54" aria-hidden="true" className="lumen-mark">
      <g fill="#111214">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="-3.86" y="-5.40" width="7.71" height="10.80" rx="1.80" transform={`rotate(${a}) translate(0 -21.60)`} />)}
      </g>
    </svg>
  )
}

// Sits the wordmark's x-height on the mark's center line, whatever font metrics the browser ends up with.
function fitLockup(el) {
  if (!el) return
  const mk = el.querySelector('.lumen-mark'), w = el.querySelector('.wi-word')
  if (!mk || !w) return
  w.style.transform = 'none'
  const cs = getComputedStyle(w), c = document.createElement('canvas').getContext('2d')
  c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  const asc = c.measureText('lumen').actualBoundingBoxAscent
  const probe = document.createElement('span')
  probe.style.cssText = 'display:inline-block;width:0;height:0'
  w.appendChild(probe)
  const base = probe.getBoundingClientRect().top
  probe.remove()
  const m = mk.getBoundingClientRect(), z = m.height / (+mk.getAttribute('height') || m.height) || 1
  w.style.transform = `translateY(${((m.top + m.height / 2 - base) / z + asc / 2).toFixed(2)}px)`
}
function useLockupFit(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    fitLockup(el)
    if (document.fonts) document.fonts.ready.then(() => fitLockup(el))
  }, [ref])
}

function Lockup() {
  const lock = useRef(null)
  useLockupFit(lock)
  return (
    <div ref={lock} className="wi-lockup" role="img" aria-label="Lumen">
      <LumenMark size={26} /><span className="wi-word">lumen</span>
    </div>
  )
}

/* ---------- Splash: photo tiles spin into the mark ---------- */
// Eight little photos pop out into a ring, spin, shrink, fill in black and become the logo; the wordmark slides in beside it.
const SPLASH = [['tile-1-cafe.jpg'], ['tile-2-lake-poster.jpg', 'tile-2-lake.mp4'], ['tile-3-sunglasses.jpg'], ['tile-4-statues.jpg'], ['tile-5-aquarium.jpg'], ['tile-6-night-friends-poster.jpg', 'tile-6-night-friends.mp4'], ['tile-7-six-flags.jpg'], ['tile-8-night-street.jpg']]

export function Splash() {
  const { go } = useApp()
  const host = useRef(null)
  const done = useRef(false)
  const leave = useCallback(() => { if (!done.current) { done.current = true; go('reveal') } }, [go])

  useEffect(() => {
    const el = host.current
    if (!el) return
    el.innerHTML = ''
    const N = 8, R = 84, TOTAL = 4500, FULL_W = 210, MARK_W = 54, GAP = 14, END_SCALE = MARK_W / FULL_W
    const word = document.createElement('div')
    word.className = 'lumen-word'
    word.textContent = 'lumen'
    const baseEl = document.createElement('span')
    baseEl.className = 'lumen-base'
    word.appendChild(baseEl)
    const ring = document.createElement('div')
    ring.className = 'lumen-ring'
    el.append(word, ring)
    const tiles = SPLASH.map(([img, vid]) => {
      const t = document.createElement('div')
      t.className = 'lumen-tile'
      t.style.backgroundImage = `url(${asset('splash-' + img)})`
      let v = null
      if (vid) {
        v = document.createElement('video')
        v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.autoplay = true
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '')
        v.preload = 'auto'; v.poster = asset('splash-' + img); v.src = asset('splash-' + vid)
        v.addEventListener('playing', () => v.classList.add('on'))
        t.appendChild(v)
        const pr = v.play()
        if (pr && pr.catch) pr.catch(() => {})
      }
      const f = document.createElement('div')
      f.className = 'fill'
      t.appendChild(f)
      ring.appendChild(t)
      return { el: t, f, v }
    })

    let ink = null
    const measure = () => {
      const cs = getComputedStyle(word), c = document.createElement('canvas').getContext('2d')
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const m = c.measureText('lumen')
      ink = { left: m.actualBoundingBoxLeft, w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, asc: m.actualBoundingBoxAscent, base: baseEl.offsetTop }
    }
    const clamp = (v) => Math.max(0, Math.min(1, v))
    const prog = (t, a, d) => clamp((t - a) / d)
    const outBack = (k) => { const s = 1.7; k -= 1; return k * k * ((s + 1) * k + s) + 1 }
    const outCubic = (k) => 1 - Math.pow(1 - k, 3)
    const outQuart = (k) => 1 - Math.pow(1 - k, 4)
    const inCubic = (k) => k * k * k
    // Spin speed: slow, then a burst, then easing to a stop. Integrated into a lookup table so the angle stays smooth.
    const vel = (k) => {
      const sm = (x) => x * x * (3 - 2 * x), L = 0.35, H = 1
      if (k < 0.12) return L * sm(k / 0.12)
      if (k < 0.4) return L
      if (k < 0.52) return L + (H - L) * sm((k - 0.4) / 0.12)
      if (k < 0.78) return H
      return H * (1 - sm((k - 0.78) / 0.22))
    }
    const LUT = (() => { const n = 400, a = [0]; for (let j = 1; j <= n; j++) a.push(a[j - 1] + vel((j - 0.5) / n)); const m = a[n]; return a.map((v) => v / m) })()
    const spinAt = (k) => { const x = k * 400, j = Math.floor(x); return j >= 400 ? 1 : LUT[j] + (LUT[j + 1] - LUT[j]) * (x - j) }

    const render = (t) => {
      const spin = spinAt(prog(t, 900, 2100)) * 360
      if (!ink) measure()
      const W = MARK_W + GAP + ink.w, markX = -W / 2 + MARK_W / 2
      ring.style.transform = `translateX(${(markX * outQuart(prog(t, 3700, 650))).toFixed(2)}px)`
      const wk = outQuart(prog(t, 3800, 650)), wop = outCubic(prog(t, 3800, 420)), inkLeft = markX + MARK_W / 2 + GAP - (1 - wk) * 22
      word.style.transform = `translate(${(inkLeft + ink.left).toFixed(2)}px,${(-ink.base + ink.asc / 2).toFixed(2)}px)`
      word.style.filter = wk < 1 ? `blur(${((1 - wop) * 4).toFixed(2)}px)` : 'none'
      word.style.opacity = wop.toFixed(3)
      tiles.forEach((o, i) => {
        const slot = (i / N) * 360, rad = ((slot - 90 + spin) * Math.PI) / 180, tx = Math.cos(rad) * R, ty = Math.sin(rad) * R
        let x, y, s, op
        if (i === 0) { const pop = prog(t, 0, 300), mv = outCubic(prog(t, 300, 320)); s = outBack(pop); op = clamp(pop * 3); x = tx * mv; y = ty * mv }
        else { const k = prog(t, 350 + (i - 1) * 50, 320), q = outBack(k); x = tx * q; y = ty * q; s = 0.3 + 0.7 * Math.min(q, 1.1); op = clamp(k * 4) }
        const f = 1 - (1 - END_SCALE) * inCubic(prog(t, 2700 + i * 35, 600))
        x *= f; y *= f; s *= f
        o.el.style.opacity = op
        o.el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${(slot + spin).toFixed(2)}deg) scale(${s.toFixed(3)})`
        const fk = outCubic(prog(t, 2000 + i * 70, 230))
        o.f.style.clipPath = `circle(${(fk * 140).toFixed(1)}% at 50% 100%)`
        o.el.style.boxShadow = fk >= 1 ? 'none' : ''
        if (o.v && fk >= 1 && !o.v.paused) o.v.pause()
      })
    }

    let raf = 0, start = 0, hold = 0
    const loop = (now) => {
      if (!start) start = now
      const t = now - start
      if (t >= TOTAL) {
        render(TOTAL); raf = 0
        hold = setTimeout(() => { el.classList.add('lumen-out'); hold = setTimeout(leave, 480) }, 250)
        return
      }
      render(t)
      raf = requestAnimationFrame(loop)
    }
    if (calm()) { render(TOTAL); hold = setTimeout(leave, 1200) }
    else { render(0); raf = requestAnimationFrame(loop) }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { ink = null })
    return () => { cancelAnimationFrame(raf); clearTimeout(hold); tiles.forEach((o) => o.v && o.v.pause()) }
  }, [leave])

  return (
    <Screen className="lumen-splash" bg="#f7f9fb">
      <button ref={host} className="lumen-stage" aria-label="Skip intro" onClick={leave} />
    </Screen>
  )
}

/* ---------- Welcome ---------- */
export function Reveal() {
  const { go } = useApp()
  return (
    <Screen className="wi" bg="#f7f9fb">
      <div className="lumen-bg" aria-hidden="true" />
      <div className="wi-oval" aria-hidden="true" />
      <div className="wi-body">
        <Lockup />
        <h1 className="wi-title">Welcome.<br />Share what your week really took.</h1>
        <button className="pill wi-start" onClick={() => go('q1')}>Let’s get started</button>
        <p className="wi-legal">By continuing you agree to our <a href="#/reveal">Terms</a> and <a href="#/reveal">Privacy Policy</a>.</p>
      </div>
    </Screen>
  )
}

/* ---------- Questions ---------- */
// The color of your last answer lingers behind the next question (and later Home) as a soft glow.
let lastPick = null
export const lastPickColor = () => (lastPick && LOOKS[lastPick] ? LOOKS[lastPick].wash || LOOKS[lastPick].c[0] : null)

export function Question({ index }) {
  const q = QUESTIONS[index]
  const { go, answers, setAnswers } = useApp()
  const [splash, setSplash] = useState(null)
  const screenRef = useRef(null)
  const next = index < QUESTIONS.length - 1 ? `q${index + 2}` : 'celebrate'
  const glow = lastPickColor()

  useEffect(() => {
    if (!splash) return
    const t = setTimeout(() => go(next), LOOKS[q.options[splash.i].look].video ? 4200 : 2300)
    return () => clearTimeout(t)
  }, [splash, go, next, q])

  const pick = (i, e) => {
    if (q.options[i].look !== 'blank') lastPick = q.options[i].look
    setAnswers({ ...answers, [q.id]: i })
    const box = screenRef.current.getBoundingClientRect()
    setSplash({ i, x: e.clientX - box.left || box.width / 2, y: e.clientY - box.top || box.height / 2 })
  }
  const chosen = splash ? q.options[splash.i] : null
  const look = chosen ? LOOKS[chosen.look] : null

  return (
    <div ref={screenRef} style={{ position: 'absolute', inset: 0 }}>
      {glow ? <div aria-hidden="true" className="pick-glow" style={{ '--glow': glow }} /> : null}
      <Screen>
        <div className="screen-body scroll">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconButton icon="back" label="Back" onClick={() => go(index === 0 ? 'reveal' : `q${index}`)} />
            <div style={{ flex: 1 }}><Progress step={q.step} total={QUESTIONS.length} /></div>
            <span className="small">{q.step} of {QUESTIONS.length}</span>
          </div>
          <Display small sub={q.text}>{q.title}</Display>
          <div className="tiles">
            {q.options.map((o, i) => <Tile key={o.label} look={o.look} caption={o.label} onClick={(e) => pick(i, e)} />)}
          </div>
        </div>
      </Screen>

      {/* After a pick: the answer's color floods out from your finger, then its video plays with what it means for you. */}
      {chosen && (
        <button onClick={() => go(next)} aria-label="Continue" style={{ position: 'absolute', inset: 0, border: 'none', padding: 0, background: 'transparent', overflow: 'hidden', zIndex: 10 }}>
          <span style={{ position: 'absolute', left: splash.x - 1000, top: splash.y - 1000, width: 2000, height: 2000, borderRadius: '50%', background: look.wash || '#fff', animation: 'flood .8s cubic-bezier(.3,.7,.2,1) both' }} />
          {look.video ? (
            <video src={look.video} autoPlay muted loop playsInline aria-hidden="true" ref={(v) => { if (v) { v.muted = true; v.play().catch(() => {}) } }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: look.vpos || '62% 50%', translate: look.vshift || 'none', ...(look.vshift ? { WebkitMaskImage: 'linear-gradient(#000 80%, transparent 97%)', maskImage: 'linear-gradient(#000 80%, transparent 97%)' } : {}), animation: 'videoIn 1.2s ease .45s both' }} />
          ) : null}
          <div className="rise" style={{ position: 'absolute', left: 28, right: 28, top: look.video ? 190 : 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', animationDelay: look.video ? '.9s' : '.35s',
            ...(look.video ? { padding: '48px 8px', margin: '0 -20px', background: `radial-gradient(closest-side, ${look.c[1]}e6 0%, ${look.c[1]}a6 50%, ${look.c[1]}00 100%)` } : {}) }}>
            {look.video ? null : (
              <div style={{ width: 300, height: 220, WebkitMaskImage: 'radial-gradient(closest-side, #000 65%, transparent)', maskImage: 'radial-gradient(closest-side, #000 65%, transparent)' }}>
                <Shape look={look} />
              </div>
            )}
            <span className="display sm">{chosen.label}</span>
            <span className="body" style={{ maxWidth: 280, ...(look.video ? { color: 'var(--ink)' } : {}) }}>{chosen.note}</span>
          </div>
          <span className="small" style={look.video
            ? { position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', whiteSpace: 'nowrap', color: 'var(--ink-2)' }
            : { position: 'absolute', left: 0, right: 0, bottom: 48, textAlign: 'center' }}>
            {index < QUESTIONS.length - 1 ? 'Next question…' : 'Setting up your desk…'}
          </span>
        </button>
      )}
    </div>
  )
}

/* ---------- You're all set ---------- */
export function Celebrate() {
  const { go } = useApp()
  return (
    <Screen>
      <div className="celebrate">
        <div className="wi-oval" aria-hidden="true" />
        <div className="celebrate-text">
          <Lockup />
          <h1 className="wi-title">Welcome,<br />{NAME}!</h1>
          <p className="body celebrate-sub">You’re all set. Your desk is ready.</p>
          <button className="pill wi-start" onClick={() => go('welcome')}>Let’s go</button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Opening: what's waiting ---------- */
export const greetWord = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }

export function Opening() {
  const { go, letters, setOpenId } = useApp()
  const waiting = letters.filter((l) => !l.mine && l.unread).slice(0, 2)
  const open = (l) => { setOpenId(l.id); go('mail') }
  const from = [...new Set(waiting.map((l) => l.from))].join(' and ')

  return (
    <Screen>
      <div className="screen-body scroll" style={{ paddingBottom: 120 }}>
        <div className="home-center">
          <Display sub={waiting.length
            ? `${waiting.length} letter${waiting.length > 1 ? 's' : ''} waiting, from ${from}.`
            : <>Nothing waiting. <button className="nudge-link" onClick={() => go('prompt')}>Write to Mom?</button></>}>
            {greetWord()},<br />{NAME}.
          </Display>
          {waiting.length ? (
            <div className="env-stack" style={{ height: waiting.length > 1 ? 240 : 184 }}>
              {waiting.map((l, i) => {
                const st = STAMPS.find((s) => s.id === l.stamp)
                return (
                  <button key={l.id} className="env-card" data-i={waiting.length > 1 ? i : 'solo'} onClick={() => open(l)}
                    aria-label={`Open the letter from ${l.from}, ${l.date}${st && st.id !== 'none' ? `, stamped ${st.label}` : ''}`}>
                    <Envelope color={l.envelope} stamp={st && st.id !== 'none' ? stampLook(st.id) : null} width={262} />
                  </button>
                )
              })}
            </div>
          ) : <div className="env-empty" aria-hidden="true"><Envelope color="rose" width={220} /></div>}
        </div>
      </div>
      <Dock><button className="pill block" onClick={() => go('home')}><Icon name="home" size={18} />Go to my desk</button></Dock>
    </Screen>
  )
}
