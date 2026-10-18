import { useLayoutEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Shape from './Shape.jsx'
import { LOOKS } from '../data.js'
import { useApp } from '../store.jsx'

export function StatusBar() {
  return (
    <div className="status" aria-hidden="true">
      <span>9:41</span>
      <svg width="70" height="12" viewBox="0 0 70 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="6" width="3" height="6" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
        <path d="M30 3.5a9 9 0 0 1 12 0l-1.4 1.5a7 7 0 0 0-9.2 0zM32.8 6.5a5 5 0 0 1 6.4 0L36 10z" />
        <rect x="47" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" /><rect x="49" y="3" width="15" height="6" rx="1.5" /><rect x="68" y="4" width="1.5" height="4" rx=".7" opacity=".5" />
      </svg>
    </div>
  )
}

export function Screen({ children, bg, className = '' }) {
  return (
    <section className={`screen ${className}`} style={bg ? { background: bg } : undefined}>
      <StatusBar />
      {children}
    </section>
  )
}

export function IconButton({ icon, label, onClick, ghost, style }) {
  return (
    <button className={`icon-btn${ghost ? ' ghost' : ''}`} aria-label={label} onClick={onClick} style={style}>
      <Icon name={icon} />
    </button>
  )
}

export function TopBar({ left, center, right }) {
  return (
    <div className="topbar">
      {left || <span style={{ width: 44 }} />}
      {center ? <span className="center">{center}</span> : null}
      {right || <span style={{ width: 44 }} />}
    </div>
  )
}

export function Progress({ step }) {
  return (
    <div className="progress" aria-label={`Question ${step} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= step ? 'on' : ''} />)}
    </div>
  )
}

/** Big centered serif title, the reference's "Pick your plan". */
export function Display({ children, small, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <h1 className={`display${small ? ' sm' : ''}`}>{children}</h1>
      {sub ? <p className="small" style={{ textAlign: 'center', maxWidth: 290 }}>{sub}</p> : null}
    </div>
  )
}

export function Segmented({ options, value, onChange, label }) {
  // A single white pill sits behind the buttons and slides to whichever one is selected.
  const wrap = useRef(null)
  const [pill, setPill] = useState(null)
  const moved = useRef(false)
  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current && wrap.current.querySelector('[aria-selected="true"]')
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
  }, [value, options.length])
  const pick = (v) => { moved.current = true; onChange(v) }
  return (
    <div className="seg" role="tablist" aria-label={label} ref={wrap}>
      {pill ? <span className="seg-pill" aria-hidden="true" style={{ transform: `translateX(${pill.left}px)`, width: pill.width, transition: moved.current ? undefined : 'none' }} /> : null}
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value
        const t = typeof o === 'string' ? o : o.label
        return <button key={v} role="tab" aria-selected={value === v} onClick={() => pick(v)}>{t}</button>
      })}
    </div>
  )
}

/** Grey feature card: text on the left, an abstract shape bleeding off the right. */
export function Hero({ look, title, sub, checks = [], onClick, children, label }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className="hero" onClick={onClick} aria-label={label}>
      {look ? <div className="art"><Shape look={LOOKS[look]} /></div> : null}
      {title ? <h2>{title}</h2> : null}
      {sub ? <span style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6 }}>{sub}</span> : null}
      {children}
      {checks.length ? (
        <div className="checks">
          {checks.map((c) => <span key={c}><i><Icon name="check" size={10} stroke={3} /></i>{c}</span>)}
        </div>
      ) : null}
    </Tag>
  )
}

/** Grey grid tile: shape on top fading into the card, centered caption below. */
export function Tile({ look, caption, onClick, pressed, wide, children, label }) {
  return (
    <button className={`tile${wide ? ' wide' : ''}`} onClick={onClick} aria-pressed={pressed} aria-label={label}>
      <div className="art">{look ? <Shape look={LOOKS[look]} /> : null}</div>
      {children}
      {caption ? <span className="cap">{caption}</span> : null}
    </button>
  )
}

/** Neutral stand-in for a real photo or camera view. */
export function Placeholder({ icon = 'photo', label, style, ...rest }) {
  return (
    <div className="ph" style={style} role="img" aria-label={label || 'Photo'} {...rest}>
      <Icon name={icon} size={22} />
      {label ? <span>{label}</span> : null}
    </div>
  )
}

/** Fixed bottom area for the screen's one black action, fading over content. */
/** Bottom tab bar for the top-level pages: Home, write a letter (+), and your letters. */
const TAB = { width: 48, height: 48, borderRadius: 24, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2b2b30', transition: 'background .2s ease' }
export function TabBar({ active, solid, style }) {
  const { go } = useApp()
  const tint = (on) => (on ? '#ece4fb' : 'transparent')
  return (
    <nav aria-label="Main" className="safe-bottom" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 20px 22px', flexShrink: 0, background: solid ? '#fff' : 'transparent', ...style }}>
      <button aria-label="Home" aria-current={active === 'home' ? 'page' : undefined} onClick={() => go('home')} style={{ ...TAB, background: tint(active === 'home') }}><Icon name="home" size={22} /></button>
      <button aria-label="Write a letter" aria-current={active === 'create' ? 'page' : undefined} onClick={() => go('prompt')} style={{ ...TAB, background: '#2b2b30', color: '#fff', boxShadow: active === 'create' ? '0 0 0 4px #ece4fb' : 'none' }}><Icon name="plus" size={22} /></button>
      <button aria-label="Your letters" aria-current={active === 'letters' ? 'page' : undefined} onClick={() => go('history')} style={{ ...TAB, background: tint(active === 'letters') }}><Icon name="profile" size={22} /></button>
    </nav>
  )
}

export function Dock({ children }) {
  return <div className="dock safe-bottom">{children}</div>
}
