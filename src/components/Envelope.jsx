import Shape from './Shape.jsx'

// Holographic envelope colors. Each is a soft holo blend; `swatch` is the picker dot.
export const ENVELOPES = [
  { id: 'lilac', label: 'Lilac', swatch: '#cdbff6', c: ['#d9ccfa', '#b9d6fa', '#ffd3e2', '#c7b6f2', '#efe9fd'] },
  { id: 'peach', label: 'Peach', swatch: '#ffc9b4', c: ['#ffd1b8', '#f7b8d2', '#fff1c2', '#ffc0cf', '#fde6e6'] },
  { id: 'mint', label: 'Mint', swatch: '#a9e0c5', c: ['#bfe8d4', '#d8f3e5', '#b8d8fa', '#9fdcbf', '#eaf7f0'] },
  { id: 'sky', label: 'Sky', swatch: '#a9cdf6', c: ['#b8d8fa', '#d4e9ff', '#c9b8f5', '#a9e3f2', '#e6f1fd'] },
  { id: 'rose', label: 'Rose', swatch: '#f4aecb', c: ['#f7b8d2', '#ffd6e5', '#d9ccfa', '#f2a8c5', '#fdeef4'] },
  { id: 'butter', label: 'Butter', swatch: '#f6dc8f', c: ['#fff1c2', '#ffd9b5', '#ffe9f0', '#fbe7a6', '#fff8e4'] },
]

export const holo = ([a, b, c, d, e]) =>
  `radial-gradient(circle at 25% 25%, ${a} 0%, transparent 45%), radial-gradient(circle at 75% 30%, ${b} 0%, transparent 45%), radial-gradient(circle at 40% 75%, ${c} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${d} 0%, transparent 45%), ${e}`

/**
 * The letter's envelope. Drawn at 202×136 and scaled to `width`.
 *   color   – an ENVELOPES id
 *   stamp   – a LOOKS entry shown in the corner slot (null = empty dashed slot)
 *   stampArt – optional illustration URL drawn in the stamp slot instead of the shape
 *   sealing – plays the stamp-drop + wax-seal press
 */
export default function Envelope({ color = 'lilac', stamp, stampArt, sealing, width = 202, style }) {
  const env = ENVELOPES.find((e) => e.id === color) || ENVELOPES[0]
  const k = width / 202
  return (
    <div className="holo" role="img" aria-label={`${env.label} envelope${stamp ? ' with a stamp' : ''}`}
      style={{ '--holo': holo(env.c), width, height: 136 * k, borderRadius: 22 * k, boxShadow: '0 24px 60px rgba(120,110,200,.22)', transition: 'box-shadow .3s', ...style }}>
      <svg width={width} height={136 * k} viewBox="0 0 202 136" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <path d="M4 8l97 70L198 8" fill="none" stroke="rgba(255,255,255,.95)" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      {/* wax seal */}
      <span aria-hidden="true" style={{ position: 'absolute', left: 84 * k, top: 60 * k, width: 34 * k, height: 34 * k, borderRadius: '50%', background: '#fff', opacity: 0.88, boxShadow: sealing ? `0 0 0 ${6 * k}px rgba(255,255,255,.35)` : 'none', animation: sealing ? 'sealPress .5s .55s cubic-bezier(.3,1.6,.5,1) both' : 'none' }} />
      {/* stamp slot */}
      <span aria-hidden="true" style={{ position: 'absolute', right: 12 * k, top: 12 * k, width: 32 * k, height: 38 * k, borderRadius: 4 * k, border: stamp ? 'none' : `${1.5 * Math.max(k, 0.8)}px dashed rgba(255,255,255,.95)`, overflow: 'hidden', background: stamp ? '#fff' : 'transparent', padding: stamp ? 2.5 * k : 0, boxSizing: 'border-box', boxShadow: stamp ? '0 2px 6px rgba(29,29,34,.12)' : 'none', transform: stamp ? 'rotate(-4deg)' : 'none', animation: sealing && stamp ? 'stampIn .55s cubic-bezier(.2,.9,.3,1.2) both' : 'none' }}>
        {stamp ? <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: 2 * k, overflow: 'hidden' }}>{stampArt ? <img src={stampArt} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} /> : <Shape look={stamp} />}</span> : null}
      </span>
    </div>
  )
}
