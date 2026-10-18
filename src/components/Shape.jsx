import { useId } from 'react'

/**
 * Abstract illustration. Each kind stands for a need or prompt type, so the
 * same shape always means the same thing (see LOOKS in data.js).
 *   grain   – dissolving, grainy orb
 *   ribbon  – glossy folded ribbons
 *   wave    – soft silk wave
 *   ripple  – droplet with rings
 *   spheres – glassy spheres
 */
export default function Shape({ look, width = '100%', height = '100%', style }) {
  const raw = useId().replace(/:/g, '')
  const id = (s) => `${raw}-${s}`
  const [a, b, c] = look.c
  const common = { width, height, viewBox: '0 0 200 160', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true, style: { display: 'block', ...style } }

  if (look.shape === 'grain') {
    return (
      <svg {...common}>
        <defs>
          <radialGradient id={id('g')} cx="45%" cy="40%" r="60%"><stop offset="0" stopColor={b} /><stop offset=".55" stopColor={a} /><stop offset="1" stopColor={a} stopOpacity="0" /></radialGradient>
          <filter id={id('f')} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="4" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <circle cx="100" cy="76" r="52" fill={`url(#${id('g')})`} filter={`url(#${id('f')})`} />
      </svg>
    )
  }

  if (look.shape === 'ribbon') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('r1')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
          <linearGradient id={id('r2')} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor={b} /><stop offset=".6" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
          <linearGradient id={id('sh')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".4" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <path d="M40 150C30 90 70 40 120 30s80 20 70 60-60 40-80 70" fill="none" stroke={`url(#${id('r1')})`} strokeWidth="34" strokeLinecap="round" opacity=".95" />
        <path d="M70 160C80 110 130 90 160 100s40 50 30 60" fill="none" stroke={`url(#${id('r2')})`} strokeWidth="28" strokeLinecap="round" opacity=".9" />
        <path d="M60 140C55 95 85 55 125 45" fill="none" stroke={`url(#${id('sh')})`} strokeWidth="8" strokeLinecap="round" />
        <path d="M150 20c20 10 30 30 20 50" fill="none" stroke={`url(#${id('r2')})`} strokeWidth="22" strokeLinecap="round" opacity=".8" />
      </svg>
    )
  }

  if (look.shape === 'wave') {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id={id('w1')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
          <linearGradient id={id('w2')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".9" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient>
          <filter id={id('soft')}><feGaussianBlur stdDeviation="1.2" /></filter>
        </defs>
        <rect width="200" height="160" fill={`url(#${id('w1')})`} />
        <path d="M-10 70C40 20 90 40 120 60s70 30 90 0V0H-10z" fill={`url(#${id('w2')})`} filter={`url(#${id('soft')})`} />
        <path d="M-10 110C40 70 90 90 130 100s60 10 80-20" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="6" filter={`url(#${id('soft')})`} />
        <path d="M-10 130C50 100 100 120 140 125s50 0 70-20" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="10" filter={`url(#${id('soft')})`} />
      </svg>
    )
  }

  if (look.shape === 'ripple') {
    return (
      <svg {...common}>
        <defs>
          <radialGradient id={id('bg')} cx="50%" cy="60%" r="70%"><stop offset="0" stopColor={b} /><stop offset="1" stopColor={b} stopOpacity=".2" /></radialGradient>
          <radialGradient id={id('drop')} cx="38%" cy="32%" r="70%"><stop offset="0" stopColor="#fff" /><stop offset=".35" stopColor={b} /><stop offset="1" stopColor={c} /></radialGradient>
        </defs>
        <rect width="200" height="160" fill={`url(#${id('bg')})`} />
        {[70, 54, 38, 24].map((r, i) => <ellipse key={r} cx="100" cy="98" rx={r * 1.35} ry={r * 0.42} fill="none" stroke={i % 2 ? '#fff' : a} strokeOpacity={i % 2 ? 0.7 : 0.35} strokeWidth="4" />)}
        <ellipse cx="100" cy="100" rx="26" ry="7" fill={c} opacity=".25" />
        <circle cx="100" cy="74" r="24" fill={`url(#${id('drop')})`} />
        <ellipse cx="92" cy="64" rx="7" ry="4" fill="#fff" opacity=".8" />
      </svg>
    )
  }

  // spheres
  return (
    <svg {...common}>
      <defs>
        <radialGradient id={id('s')} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".3" stopColor={b} /><stop offset="1" stopColor={c} /></radialGradient>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} stopOpacity=".55" /><stop offset="1" stopColor={b} stopOpacity=".2" /></linearGradient>
      </defs>
      <rect width="200" height="160" fill={`url(#${id('bg')})`} />
      <path d="M40 20L120 120" stroke={`url(#${id('s')})`} strokeWidth="18" strokeLinecap="round" opacity=".7" />
      <circle cx="70" cy="60" r="30" fill={`url(#${id('s')})`} />
      <circle cx="140" cy="90" r="36" fill={`url(#${id('s')})`} />
      <circle cx="110" cy="40" r="16" fill={`url(#${id('s')})`} opacity=".85" />
    </svg>
  )
}
