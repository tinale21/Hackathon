import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { LOOKS, QUESTIONS } from '../data.js'
import { Display, IconButton, Progress, Screen, Tile } from '../components/ui.jsx'
import Shape from '../components/Shape.jsx'
import Icon from '../components/Icon.jsx'

/* ---------- Splash: postage stamps drifting up ---------- */
function Postmark({ kind }) {
  const waves = [6, 15, 24, 33].map((y) => `M0 ${y} q8 -6 16 0 t16 0 t16 0 t16 0 t16 0`)
  return (
    <svg width="96" height="42" viewBox="0 0 96 42" aria-hidden="true" style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none' }}>
      {kind === 'ring' && (
        <g>
          <circle cx="-6" cy="20" r="19" fill="none" stroke="#2b2733" strokeOpacity=".55" strokeWidth="1.4" />
          <circle cx="-6" cy="20" r="14" fill="none" stroke="#2b2733" strokeOpacity=".35" strokeWidth="1" />
          <text x="-6" y="23" textAnchor="middle" fontSize="7" fontFamily="Geist, sans-serif" fill="#2b2733" fillOpacity=".6" letterSpacing=".5">OCT 16</text>
        </g>
      )}
      {waves.map((d) => <path key={d} d={d} fill="none" stroke="#2b2733" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" />)}
    </svg>
  )
}

// Public-domain pastel paintings live in public/stamps (credited in public/stamps/CREDITS.md).
const photo = (name) => `${import.meta.env.BASE_URL}stamps/${name}.jpg`
const LANES = [
  { left: -30, dur: 17, delay: -3, stamps: [
    { img: 'art-vetheuil', w: 112, h: 146, r: -6, mark: 'wave' }, { img: 'art-grainstack', w: 124, h: 100, r: 5 },
    { img: 'art-willows', w: 100, h: 136, r: -3, mark: 'ring' }, { img: 'art-cloud-study', w: 126, h: 100, r: 7 } ] },
  { left: 126, dur: 21, delay: -11, stamps: [
    { img: 'art-water-lilies', w: 128, h: 160, r: 4, mark: 'wave' }, { img: 'art-poppy-field', w: 140, h: 108, r: -5 },
    { img: 'art-spring-landscape', w: 120, h: 152, r: 3, mark: 'ring' }, { img: 'art-high-clouds', w: 136, h: 100, r: -6, mark: 'wave' } ] },
  { left: 290, dur: 18, delay: -6, stamps: [
    { img: 'art-mustard-field', w: 130, h: 104, r: 6 }, { img: 'art-ile-de-france', w: 108, h: 136, r: -4, mark: 'wave' },
    { img: 'art-vetheuil', w: 120, h: 150, r: 3 }, { img: 'art-willows', w: 112, h: 140, r: -7, mark: 'ring' } ] },
]

function Stamp({ s }) {
  return (
    <div className="postage-wrap" style={{ transform: `rotate(${s.r}deg)`, margin: '30px 0', alignSelf: s.r > 0 ? 'flex-end' : 'flex-start' }}>
      <div className="postage" style={{ width: s.w, height: s.h }}>
        <img src={photo(s.img)} alt="" draggable="false" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {s.mark && <div style={{ position: 'absolute', left: s.mark === 'ring' ? 30 : -18, bottom: -6 }}><Postmark kind={s.mark} /></div>}
    </div>
  )
}

export function Splash() {
  const { go } = useApp()
  useEffect(() => {
    const t = setTimeout(() => go('reveal'), 4600)
    return () => clearTimeout(t)
  }, [go])
  return (
    <Screen>
      <button onClick={() => go('reveal')} aria-label="Skip intro" style={{ position: 'absolute', inset: 0, border: 'none', background: '#fff', padding: 0, overflow: 'hidden' }}>
        {LANES.map((lane, i) => (
          <div key={i} aria-hidden="true" style={{ position: 'absolute', left: lane.left, top: 0, width: 150 }}>
            <div style={{ display: 'flex', flexDirection: 'column', animation: `laneUp ${lane.dur}s linear ${lane.delay}s infinite` }}>
              {[...lane.stamps, ...lane.stamps].map((st, k) => <Stamp key={k} s={st} />)}
            </div>
          </div>
        ))}
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 110, background: 'linear-gradient(#fff 35%, rgba(255,255,255,0))' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140, background: 'linear-gradient(rgba(255,255,255,0), #fff 70%)' }} />
        <span className="small" style={{ position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center' }}>Tap to skip</span>
      </button>
    </Screen>
  )
}

export function Reveal() {
  const { go } = useApp()
  return (
    <Screen>
      <div className="screen-body" style={{ alignItems: 'center', paddingTop: 72 }}>
        <div className="rise"><Display sub="Share what your week really took.">[App name]</Display></div>
        <div className="rise" style={{ width: 300, height: 260, marginTop: 30, animationDelay: '.2s', WebkitMaskImage: 'radial-gradient(closest-side, #000 70%, transparent)', maskImage: 'radial-gradient(closest-side, #000 70%, transparent)' }}>
          <Shape look={LOOKS.ribbon} />
        </div>
        <div style={{ flex: 1 }} />
        <button className="pill block rise" style={{ animationDelay: '.35s' }} onClick={() => go('q1')}>Continue</button>
        <p className="small" style={{ textAlign: 'center', maxWidth: 290 }}>
          By tapping ‘Continue’ you agree to our <a href="#/reveal" style={{ color: 'var(--ink-2)' }}>Terms</a> and <a href="#/reveal" style={{ color: 'var(--ink-2)' }}>Privacy Policy</a>.
        </p>
      </div>
    </Screen>
  )
}

export function Question({ index }) {
  const q = QUESTIONS[index]
  const { go, answers, setAnswers } = useApp()
  const [splash, setSplash] = useState(null)
  const screenRef = useRef(null)
  const next = index === 0 ? 'q2' : 'home'

  useEffect(() => {
    if (!splash) return
    const t = setTimeout(() => go(next), 2300)
    return () => clearTimeout(t)
  }, [splash, go, next])

  const pick = (i, e) => {
    setAnswers({ ...answers, [q.id]: i })
    const box = screenRef.current.getBoundingClientRect()
    setSplash({ i, x: e.clientX - box.left || box.width / 2, y: e.clientY - box.top || box.height / 2 })
  }
  const chosen = splash ? q.options[splash.i] : null

  return (
    <div ref={screenRef} style={{ position: 'absolute', inset: 0 }}>
      <Screen>
        <div className="screen-body scroll">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <IconButton icon="back" label="Back" onClick={() => go(index === 0 ? 'reveal' : 'q1')} />
            <div style={{ flex: 1 }}><Progress step={q.step} /></div>
            <span className="small">{q.step} of 5</span>
          </div>
          <Display small sub={q.text}>{q.title}</Display>
          <div className="tiles">
            {q.options.map((o, i) => <Tile key={o.label} look={o.look} caption={o.label} onClick={(e) => pick(i, e)} />)}
          </div>
        </div>
      </Screen>

      {chosen && (
        <button onClick={() => go(next)} aria-label="Continue" style={{ position: 'absolute', inset: 0, border: 'none', padding: 0, background: 'transparent', overflow: 'hidden', zIndex: 10 }}>
          <span style={{ position: 'absolute', left: splash.x - 1000, top: splash.y - 1000, width: 2000, height: 2000, borderRadius: '50%', background: '#fff', animation: 'flood .8s cubic-bezier(.3,.7,.2,1) both' }} />
          <div className="rise" style={{ position: 'absolute', left: 28, right: 28, top: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center', animationDelay: '.35s' }}>
            <div style={{ width: 300, height: 220, WebkitMaskImage: 'radial-gradient(closest-side, #000 65%, transparent)', maskImage: 'radial-gradient(closest-side, #000 65%, transparent)' }}>
              <Shape look={LOOKS[chosen.look]} />
            </div>
            <span className="display sm">{chosen.label}</span>
            <span className="body" style={{ maxWidth: 280 }}>{chosen.note}</span>
          </div>
          <span className="small" style={{ position: 'absolute', left: 0, right: 0, bottom: 48, textAlign: 'center' }}>
            {index === 0 ? 'Next question…' : 'Setting up your desk…'}
          </span>
        </button>
      )}
    </div>
  )
}
