/*
  Hand-drawn sticker set in the app's soft pastel style: flat organic shapes, no outlines,
  tiny line faces. Every drawing sits in a 64×64 box.
*/
const INK = '#3a3540'
const C = {
  pink: '#f4b8c5', rose: '#ee9fb5', yellow: '#f7df82', butter: '#f8e8a6', peach: '#f8c7a5', coral: '#f19a8c', red: '#e88389',
  mint: '#a9d8bb', sage: '#9fc8a6', green: '#93cf95', leaf: '#7fbf8a', sky: '#b7d3f0', blue: '#97aee8', lav: '#bcabee', lilac: '#e2c5ee',
  grey: '#dddcdc', white: '#fbf8f4', tan: '#ecc493', brown: '#c99a78', choco: '#9f7663', orange: '#f6b06f', cream: '#f8ecd2', tear: '#8db4ec', cheek: '#f59fb4',
}
const ln = { fill: 'none', stroke: INK, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

// A soft wobbly circle for the hand-made blob shapes: radius gently rises and falls n times around the edge.
const bumpy = (cx, cy, r, n = 5, amp = 1.6, phase = 0) => {
  const N = 96
  let d = ''
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2
    const rr = r + amp * Math.sin(n * a + phase)
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`
  }
  return d + 'Z'
}

const HEART = 'M32 53C18 45 9 36 9 25c0-7 5-12 11-12 5 0 9 3 12 7 3-4 7-7 12-7 6 0 11 5 11 12 0 11-9 20-23 28z'
const SQUIRCLE = 'M32 9c14 0 22 8 22 22 0 15-8 24-22 24S10 46 10 31 18 9 32 9z'
const GHOST = 'M12 31c0-13 9-21 20-21s20 8 20 21v21c-3 0-4-3-7-3s-4 3-6 3-4-3-7-3-4 3-7 3-4-3-6-3-4 3-7 3z'
const BEAN = 'M14 34c-2-12 7-22 19-22 12 0 19 8 18 19-1 12-10 22-22 21-9-1-14-8-15-18z'

/* ---------- faces ---------- */
function Face({ eyes = 'dot', mouth = 'smile', cx = 32, y = 30, gap = 7, cheeks, s = 1 }) {
  const ex = [cx - gap, cx + gap]
  const my = y + 6 * s
  const eye = (x, kind) => {
    switch (kind) {
      case 'dot': return <circle key={x} cx={x} cy={y} r={1.7 * s} fill={INK} />
      case 'happy': return <path key={x} d={`M${x - 2.6} ${y + 1} q2.6 -3.2 5.2 0`} {...ln} />
      case 'closed': return <path key={x} d={`M${x - 2.6} ${y - 0.6} q2.6 3 5.2 0`} {...ln} />
      case 'line': return <path key={x} d={`M${x - 2.4} ${y} h4.8`} {...ln} />
      case 'gt': return <path key={x} d={x < cx ? `M${x - 2} ${y - 2.4} l3.4 2.4 l-3.4 2.4` : `M${x + 2} ${y - 2.4} l-3.4 2.4 l3.4 2.4`} {...ln} />
      case 'star': return <path key={x} d={`M${x} ${y - 3.4} l1 2.3 2.5 .3 -1.9 1.7 .6 2.5 -2.2 -1.3 -2.2 1.3 .6 -2.5 -1.9 -1.7 2.5 -.3z`} fill={INK} />
      case 'up': return <circle key={x} cx={x - 1} cy={y - 1.2} r={1.6 * s} fill={INK} />
      default: return null
    }
  }
  const eyeKinds = Array.isArray(eyes) ? eyes : [eyes, eyes]
  const m = {
    smile: <path d={`M${cx - 3.2} ${my - 1} q3.2 3.4 6.4 0`} {...ln} />,
    grin: <path d={`M${cx - 3.6} ${my - 1.6} q3.6 5.6 7.2 0z`} fill={INK} />,
    flat: <path d={`M${cx - 2.6} ${my} h5.2`} {...ln} />,
    o: <circle cx={cx} cy={my} r={1.6} fill={INK} />,
    frown: <path d={`M${cx - 3} ${my + 1} q3 -3 6 0`} {...ln} />,
    wave: <path d={`M${cx - 4} ${my} q1 -1.5 2 0 t2 0 t2 0 t2 0`} {...ln} />,
    w: <path d={`M${cx - 3.4} ${my - 1} q1.7 2.6 3.4 0 q1.7 2.6 3.4 0`} {...ln} />,
    smirk: <path d={`M${cx - 2.6} ${my} q3.4 1.6 5.6 -1.6`} {...ln} />,
    none: null,
  }[mouth]
  return (
    <g>
      {cheeks ? <><ellipse cx={ex[0] - 2.5} cy={y + 4.5} rx={2.8} ry={1.7} fill={C.cheek} opacity=".75" /><ellipse cx={ex[1] + 2.5} cy={y + 4.5} rx={2.8} ry={1.7} fill={C.cheek} opacity=".75" /></> : null}
      {eye(ex[0], eyeKinds[0])}{eye(ex[1], eyeKinds[1])}
      {m}
    </g>
  )
}
const Spark = ({ x, y, r = 4, fill = C.yellow }) => <path d={`M${x} ${y - r} Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y} Q${x + r * 0.22} ${y + r * 0.22} ${x} ${y + r} Q${x - r * 0.22} ${y + r * 0.22} ${x - r} ${y} Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r}z`} fill={fill} />
const Steam = ({ x, y }) => <g opacity=".55"><path d={`M${x - 5} ${y} q-2 -3 0 -6 q2 -3 0 -6`} {...ln} stroke="#b9b4c4" /><path d={`M${x + 1} ${y} q-2 -3 0 -6 q2 -3 0 -6`} {...ln} stroke="#b9b4c4" /></g>
const Mitten = ({ x, y, w = 18, h = 20, r = 8, fill = C.peach, rot = 0 }) => <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined} />
const Finger = ({ x, y, h = 16, w = 6, fill = C.peach, rot = 0, cx, cy }) => <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={fill} transform={rot ? `rotate(${rot} ${cx ?? x + w / 2} ${cy ?? y + h})` : undefined} />
const Ears = ({ fill, inner = C.pink, l = [17, 20], r = [47, 20], s = 9 }) => (
  <g>
    <path d={`M${l[0] - s * 0.7} ${l[1] + s * 0.6} L${l[0] - s * 0.4} ${l[1] - s * 0.9} L${l[0] + s * 0.8} ${l[1] + s * 0.1}z`} fill={fill} strokeLinejoin="round" stroke={fill} strokeWidth="3" />
    <path d={`M${r[0] + s * 0.7} ${r[1] + s * 0.6} L${r[0] + s * 0.4} ${r[1] - s * 0.9} L${r[0] - s * 0.8} ${r[1] + s * 0.1}z`} fill={fill} strokeLinejoin="round" stroke={fill} strokeWidth="3" />
    <path d={`M${l[0] - s * 0.4} ${l[1] + s * 0.2} L${l[0] - s * 0.25} ${l[1] - s * 0.4} L${l[0] + s * 0.3} ${l[1] + s * 0.05}z`} fill={inner} />
    <path d={`M${r[0] + s * 0.4} ${r[1] + s * 0.2} L${r[0] + s * 0.25} ${r[1] - s * 0.4} L${r[0] - s * 0.3} ${r[1] + s * 0.05}z`} fill={inner} />
  </g>
)

/* ---------- the drawings ---------- */
const ART = {
  // Faces
  smile: <><path d={SQUIRCLE} fill={C.yellow} /><Face eyes="dot" mouth="smile" /></>,
  grin: <><path d={HEART} fill={C.pink} /><Face eyes="gt" mouth="grin" y={30} /></>,
  happycry: <><path d={bumpy(32, 33, 21, 3, 1.6, 0.5)} fill={C.sky} /><Face eyes="happy" mouth="smile" /><path d="M23 33q-1.4 3 0 4.6q1.4-1.6 0-4.6z" fill={C.tear} /><path d="M41 33q-1.4 3 0 4.6q1.4-1.6 0-4.6z" fill={C.tear} /></>,
  blush: <><path d={SQUIRCLE} fill={C.peach} /><Face eyes="closed" mouth="smile" cheeks /></>,
  wink: <><path d={bumpy(32, 33, 21, 4, 1.4, 0.3)} fill={C.mint} /><Face eyes={['dot', 'happy']} mouth="smile" /></>,
  sleepy: <><path d={BEAN} fill={C.lav} /><Face eyes="line" mouth="o" y={32} /><path d="M44 12h5l-5 6h5" {...ln} strokeWidth="1.5" /><path d="M51 6h3.4l-3.4 4h3.4" {...ln} strokeWidth="1.3" /></>,
  melting: <><path d="M12 30c0-12 9-20 20-20s20 8 20 20c0 6-2 9-1 13 1 5 0 9-3 9s-3-4-5-4-2 6-6 6-3-6-5-6-2 3-5 3-3-5-6-5-4 4-6 3c-3-1-2-6-2-10 0-3-1-5-1-9z" fill={C.butter} /><Face eyes="dot" mouth="wave" y={28} /></>,
  hugging: <><path d={SQUIRCLE} fill={C.rose} /><Face eyes="happy" mouth="smile" y={27} /><ellipse cx="19" cy="44" rx="7" ry="5" fill="#f7c9d4" transform="rotate(-25 19 44)" /><ellipse cx="45" cy="44" rx="7" ry="5" fill="#f7c9d4" transform="rotate(25 45 44)" /></>,
  starry: <><path d={bumpy(32, 33, 20, 9, 1.6)} fill={C.lilac} /><Face eyes="star" mouth="grin" /></>,
  cool: <><path d={SQUIRCLE} fill={C.blue} /><rect x="17" y="25" width="12" height="7" rx="3.5" fill={INK} /><rect x="35" y="25" width="12" height="7" rx="3.5" fill={INK} /><path d="M29 27.5h6" {...ln} /><Face eyes="none" mouth="smirk" y={31} /></>,
  thinking: <><path d={BEAN} fill={C.sage} /><Face eyes="up" mouth="flat" y={30} /><ellipse cx="40" cy="47" rx="6" ry="4.5" fill="#c3dfc8" transform="rotate(-20 40 47)" /></>,
  okayish: <><path d="M10 33c0-12 9-19 22-19s22 7 22 19-9 18-22 18-22-6-22-18z" fill={C.grey} /><Face eyes="line" mouth="flat" y={31} /></>,

  // Hearts
  h_lav: <><path d={HEART} fill={C.lav} /><path d="M18 23q2-5 7-5" {...ln} stroke="#fff" opacity=".7" /></>,
  h_coral: <><path d={HEART} fill={C.coral} /><path d="M18 23q2-5 7-5" {...ln} stroke="#fff" opacity=".7" /></>,
  h_sky: <><path d={HEART} fill={C.sky} /><path d="M18 23q2-5 7-5" {...ln} stroke="#fff" opacity=".7" /></>,
  h_lime: <><path d={HEART} fill="#cde58a" /><path d="M18 23q2-5 7-5" {...ln} stroke="#fff" opacity=".7" /></>,
  h_peach: <><path d={HEART} fill={C.peach} /><path d="M18 23q2-5 7-5" {...ln} stroke="#fff" opacity=".7" /></>,
  h_sparkle: <><path d={HEART} fill={C.pink} transform="translate(4 6) scale(.86)" /><Spark x={14} y={14} r={6} /><Spark x={52} y={20} r={4} fill={C.lilac} /><Spark x={50} y={50} r={3} /></>,
  h_mended: <><path d={HEART} fill={C.rose} /><path d="M32 20l-4 8 6 5-5 6 4 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="34" y="30" width="14" height="6" rx="3" fill={C.cream} transform="rotate(-30 41 33)" /></>,
  h_halo: <><ellipse cx="32" cy="9" rx="11" ry="3.4" fill="none" stroke="#f1cf63" strokeWidth="2.6" /><path d={HEART} fill={C.pink} transform="translate(3 6) scale(.9)" /><Face eyes="closed" mouth="smile" y={32} cheeks /></>,

  // Hands
  wave: <><Mitten x={20} y={28} w={22} h={22} r={9} /><Finger x={21} y={12} h={20} /><Finger x={28} y={9} h={22} /><Finger x={35} y={11} h={20} /><Finger x={14} y={27} h={14} rot={-45} cx={20} cy={40} /><path d="M48 14q4 4 2 9M52 10q6 6 3 14" {...ln} stroke="#c9a7d9" /></>,
  thumbs: <><Mitten x={18} y={30} w={28} h={20} r={9} /><Finger x={20} y={13} h={22} w={8} /><path d="M24 38h18M24 44h18" {...ln} stroke="#e4a888" strokeWidth="1.5" /></>,
  peace: <><Mitten x={20} y={32} w={24} h={20} r={9} /><Finger x={23} y={12} h={24} rot={-12} cx={26} cy={36} /><Finger x={33} y={12} h={24} rot={12} cx={36} cy={36} /></>,
  crossed: <><Mitten x={20} y={32} w={24} h={20} r={9} /><Finger x={26} y={12} h={24} rot={-14} cx={29} cy={36} /><Finger x={30} y={12} h={24} rot={16} cx={33} cy={36} fill="#f3b996" /></>,
  folded: <><path d="M32 10c-5 4-12 18-12 30 0 7 5 12 12 12z" fill={C.peach} /><path d="M32 10c5 4 12 18 12 30 0 7-5 12-12 12z" fill="#f3b996" /><Spark x={14} y={16} r={4} /><Spark x={51} y={14} r={3} fill={C.lilac} /></>,
  hearthands: <><path d="M32 50C20 42 13 34 13 26c0-6 4-10 9-10 4 0 8 3 10 7 2-4 6-7 10-7 5 0 9 4 9 10 0 8-7 16-19 24z" fill="none" stroke={C.peach} strokeWidth="8" strokeLinejoin="round" /><path d="M24 30q4-3 8 2q4-5 8-2" {...ln} stroke={C.rose} /></>,
  palms: <><path d="M8 34h22c0 9-5 16-11 16S8 43 8 34z" fill={C.peach} /><path d="M34 34h22c0 9-5 16-11 16s-11-7-11-16z" fill="#f3b996" /><Spark x={32} y={20} r={7} fill={C.pink} /></>,
  clap: <><Mitten x={14} y={20} w={18} h={28} r={9} rot={-14} /><Mitten x={30} y={20} w={18} h={28} r={9} rot={14} fill="#f3b996" /><path d="M32 8v6M22 11l3 5M42 11l-3 5" {...ln} stroke="#d9b45a" /></>,

  // Symbols
  sparkles: <><Spark x={26} y={34} r={16} /><Spark x={46} y={16} r={8} fill={C.lilac} /><Spark x={48} y={46} r={5} fill={C.pink} /></>,
  flame: <><path d="M32 8c3 10 16 15 16 30 0 9-7 16-16 16s-16-7-16-16c0-8 5-12 7-17 2 5 4 7 6 8 0-8 1-14 3-21z" fill={C.coral} /><path d="M32 30c2 6 8 8 8 15 0 5-4 8-8 8s-8-3-8-8c0-5 5-8 8-15z" fill={C.butter} /></>,
  rainbow: <><path d="M10 44a22 22 0 0 1 44 0" fill="none" stroke={C.pink} strokeWidth="6" strokeLinecap="round" /><path d="M17 44a15 15 0 0 1 30 0" fill="none" stroke={C.butter} strokeWidth="6" strokeLinecap="round" /><path d="M24 44a8 8 0 0 1 16 0" fill="none" stroke={C.sky} strokeWidth="6" strokeLinecap="round" /><ellipse cx="11" cy="47" rx="8" ry="5" fill={C.white} /><ellipse cx="53" cy="47" rx="8" ry="5" fill={C.white} /></>,
  sun: <><g fill={C.orange}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x="30" y="4" width="4" height="9" rx="2" transform={`rotate(${i * 45} 32 32)`} />)}</g><circle cx="32" cy="32" r="15" fill={C.yellow} /><Face eyes="closed" mouth="smile" y={31} gap={5} cheeks /></>,
  moon: <><path d="M40 10a22 22 0 1 0 14 34A18 18 0 0 1 40 10z" fill={C.butter} /><Face eyes="closed" mouth="smile" cx={24} y={33} gap={4} /></>,
  cloud: <><path d="M16 46c-6 0-9-4-9-9s4-8 9-8c1-7 7-12 14-12 6 0 11 4 13 9 6 0 11 4 11 10s-5 10-11 10z" fill={C.white} stroke="#e4e1ea" strokeWidth="1.5" /><Face eyes="closed" mouth="smile" y={35} gap={5} cheeks /></>,
  star: <><path d="M32 8l6.5 13.5 14.5 2-10.5 10 2.6 14.5L32 41l-13.1 7 2.6-14.5L11 23.5l14.5-2z" fill={C.yellow} stroke={C.yellow} strokeWidth="4" strokeLinejoin="round" /><Face eyes="dot" mouth="smile" y={29} gap={5} /></>,
  flower: <><g fill={C.pink}>{Array.from({ length: 5 }, (_, i) => <circle key={i} cx="32" cy="17" r="9" transform={`rotate(${i * 72} 32 32)`} />)}</g><circle cx="32" cy="32" r="8" fill={C.butter} /></>,
  note: <><path d="M26 44V16l20-5v28" fill="none" stroke={C.lav} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><ellipse cx="21" cy="45" rx="7" ry="5.5" fill={C.lav} /><ellipse cx="41" cy="40" rx="7" ry="5.5" fill={C.lav} /></>,
  clover: <><g fill={C.sage}>{Array.from({ length: 4 }, (_, i) => <path key={i} d="M32 31c-6-4-11-8-11-13 0-3 2-6 5-6 3 0 5 2 6 4 1-2 3-4 6-4 3 0 5 3 5 6 0 5-5 9-11 13z" transform={`rotate(${i * 90} 32 32)`} />)}</g><path d="M34 34q4 10 2 18" {...ln} stroke={C.leaf} strokeWidth="2.6" /></>,

  // Food
  rice: <><path d="M12 32h40c0 12-9 20-20 20s-20-8-20-20z" fill={C.blue} /><path d="M14 32c1-9 8-13 18-13s17 4 18 13z" fill={C.white} /><path d="M24 25h2M31 22h2M38 26h2M29 28h2" {...ln} stroke="#d8d2c8" /><path d="M16 38h32" {...ln} stroke="#b9c8ef" /></>,
  noodles: <><path d="M44 8L36 30M50 10L40 31" {...ln} stroke={C.choco} strokeWidth="2.4" /><path d="M10 32h44c0 12-10 20-22 20S10 44 10 32z" fill={C.pink} /><path d="M14 32q4-6 8 0t8 0t8 0t8 0t4 0" fill="none" stroke={C.butter} strokeWidth="3" strokeLinecap="round" /></>,
  dumpling: <><path d="M10 40c0-12 10-22 22-22s22 10 22 22c-6 4-14 6-22 6s-16-2-22-6z" fill={C.cream} /><path d="M24 22q-2 4 0 8M32 19v8M40 22q2 4 0 8" {...ln} stroke="#e1cfa8" /><Face eyes="closed" mouth="smile" y={37} gap={5} cheeks /></>,
  soup: <><Steam x={32} y={20} /><path d="M10 30h44c0 13-10 21-22 21s-22-8-22-21z" fill={C.coral} /><ellipse cx="32" cy="30" rx="22" ry="4" fill={C.peach} /><circle cx="25" cy="30" r="2" fill={C.leaf} /><circle cx="37" cy="29" r="2" fill={C.leaf} /></>,
  egg: <><path d={bumpy(32, 32, 21, 5, 2.4, 0.4)} fill={C.white} stroke="#ece6dc" strokeWidth="1.2" /><circle cx="33" cy="31" r="10" fill={C.yellow} /><Face eyes="closed" mouth="smile" cx={33} y={30} gap={4} /></>,
  toast: <><path d="M14 30c-4 0-6-4-6-8 0-7 10-12 24-12s24 5 24 12c0 4-2 8-6 8v20c0 2-2 4-4 4H18c-2 0-4-2-4-4z" fill={C.tan} /><path d="M18 30c-2 0-4-3-4-6 0-5 8-9 18-9s18 4 18 9c0 3-2 6-4 6v18H18z" fill={C.cream} /><Face eyes="dot" mouth="smile" y={34} gap={5} cheeks /></>,
  sandwich: <><path d="M10 46L32 12l22 34z" fill={C.cream} stroke={C.tan} strokeWidth="3" strokeLinejoin="round" /><path d="M16 40h32" stroke={C.green} strokeWidth="3.4" strokeLinecap="round" /><path d="M19 35h26" stroke={C.coral} strokeWidth="3" strokeLinecap="round" /></>,
  pizza: <><path d="M12 14c13-4 27-4 40 0L32 54z" fill={C.butter} /><path d="M12 14c13-4 27-4 40 0" fill="none" stroke={C.tan} strokeWidth="5" strokeLinecap="round" /><circle cx="27" cy="25" r="4" fill={C.red} /><circle cx="38" cy="27" r="3.4" fill={C.red} /><circle cx="32" cy="38" r="3" fill={C.red} /></>,
  burger: <><path d="M12 30c0-10 9-16 20-16s20 6 20 16z" fill={C.tan} /><rect x="10" y="31" width="44" height="5" rx="2.5" fill={C.green} /><rect x="12" y="36" width="40" height="6" rx="3" fill={C.choco} /><path d="M12 43h40v3c0 4-3 6-6 6H18c-3 0-6-2-6-6z" fill={C.tan} /><path d="M24 21h1M32 19h1M39 22h1" {...ln} stroke={C.cream} /></>,
  fries: <><g fill={C.yellow}>{[18, 24, 30, 36, 42].map((x, i) => <rect key={x} x={x} y={10 + (i % 2) * 4} width="5" height="24" rx="2.5" transform={`rotate(${(i - 2) * 5} ${x} 34)`} />)}</g><path d="M14 28h36l-4 24H18z" fill={C.red} /><Face eyes="dot" mouth="smile" y={38} gap={5} /></>,

  // Sweets
  boba: <><path d="M38 6l-4 14" stroke={C.pink} strokeWidth="4" strokeLinecap="round" /><path d="M16 20h32l-4 32c0 2-2 3-4 3H24c-2 0-4-1-4-3z" fill={C.tan} /><rect x="14" y="17" width="36" height="5" rx="2.5" fill={C.cream} /><g fill={C.choco}>{[[24, 47], [31, 49], [38, 47], [27, 42], [35, 43]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="2.6" />)}</g></>,
  icedcoffee: <><path d="M17 16h30l-3 36c0 2-2 3-4 3H24c-2 0-4-1-4-3z" fill={C.sky} opacity=".55" /><path d="M18.5 28h27l-1.8 24c0 2-2 3-4 3H24c-2 0-4-1-4-3z" fill={C.brown} /><rect x="23" y="22" width="8" height="8" rx="2" fill={C.white} opacity=".85" transform="rotate(-10 27 26)" /><rect x="33" y="24" width="8" height="8" rx="2" fill={C.white} opacity=".85" transform="rotate(12 37 28)" /><path d="M36 6l-2 12" stroke={C.green} strokeWidth="3" strokeLinecap="round" /></>,
  matcha: <><path d="M12 26h40c0 14-9 24-20 24s-20-10-20-24z" fill={C.cream} /><ellipse cx="32" cy="26" rx="20" ry="5" fill={C.green} /><path d="M29 25q3-3 6 0q-3 3-6 0" fill={C.white} /><Steam x={32} y={18} /></>,
  croissant: <><path d="M8 40c0-10 8-22 24-22s24 12 24 22c-3 3-7 2-9-1-2 3-6 4-9 3-2 3-5 4-6 4s-4-1-6-4c-3 1-7 0-9-3-2 3-6 4-9 1z" fill={C.tan} /><path d="M20 28q2 7 3 14M32 22v20M44 28q-2 7-3 14" {...ln} stroke="#d9a777" /></>,
  donut: <><circle cx="32" cy="32" r="22" fill={C.tan} /><path d={bumpy(32, 30, 19, 9, 1.4)} fill={C.pink} /><circle cx="32" cy="32" r="7" fill="#fff" /><g strokeWidth="2.2" strokeLinecap="round">{[[20, 22, C.yellow], [42, 20, C.sky], [44, 38, C.mint], [22, 40, C.lav], [32, 15, C.white]].map(([x, y, c]) => <path key={x} d={`M${x} ${y} l3 1.6`} stroke={c} />)}</g></>,
  cupcake: <><path d="M16 34h32l-4 18H20z" fill={C.sky} /><path d="M22 36l1 14M32 36v14M42 36l-1 14" {...ln} stroke="#9fbde3" /><path d="M14 34c0-7 5-10 9-10 0-6 4-10 9-10s9 4 9 10c4 0 9 3 9 10z" fill={C.pink} /><circle cx="32" cy="10" r="4" fill={C.red} /></>,
  icecream: <><path d="M22 34h20L32 58z" fill={C.tan} /><path d="M26 38l9 8M24 42l6 5M38 38l-9 9" {...ln} stroke="#d9a777" strokeWidth="1.3" /><path d="M18 34c-3 0-4-3-3-6 1-9 8-16 17-16s16 7 17 16c1 3 0 6-3 6z" fill={C.pink} /><Face eyes="closed" mouth="smile" y={25} gap={5} cheeks /></>,
  cookie: <><path d={bumpy(32, 32, 21, 6, 1)} fill={C.tan} /><g fill={C.choco}>{[[24, 24], [38, 22], [42, 36], [26, 40], [33, 32]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="2.6" ry="2.2" />)}</g></>,
  strawberry: <><path d="M32 54C20 46 13 36 13 27c0-6 6-9 19-9s19 3 19 9c0 9-7 19-19 27z" fill={C.red} /><path d="M20 18q6-6 12-1q6-5 12 1q-6 4-12 2q-6 2-12-2z" fill={C.leaf} /><g fill={C.butter}>{[[25, 28], [37, 28], [31, 34], [26, 40], [37, 40], [31, 46]].map(([x, y]) => <ellipse key={x + '' + y} cx={x} cy={y} rx="1.2" ry="1.7" />)}</g></>,
  peach: <><circle cx="32" cy="35" r="19" fill={C.peach} /><path d="M32 18q-4 10 0 34" {...ln} stroke="#eaa98a" /><path d="M33 17q4-9 13-7q-4 8-13 7z" fill={C.leaf} /><ellipse cx="40" cy="30" rx="4" ry="2.4" fill="#fff" opacity=".45" /></>,

  // Fruit
  orange: <><circle cx="32" cy="32" r="21" fill={C.orange} /><circle cx="32" cy="32" r="17" fill="#fbd2a2" /><g stroke={C.orange} strokeWidth="1.8">{Array.from({ length: 8 }, (_, i) => <path key={i} d="M32 32V16" transform={`rotate(${i * 45} 32 32)`} />)}</g><circle cx="32" cy="32" r="2.4" fill="#fbe6cc" /></>,
  watermelon: <><path d="M8 24h48c0 16-11 28-24 28S8 40 8 24z" fill={C.green} /><path d="M12 24h40c0 13-9 23-20 23s-20-10-20-23z" fill={C.coral} /><g fill={INK}>{[[24, 31], [32, 35], [40, 31], [28, 40], [36, 40]].map(([x, y]) => <ellipse key={x + '' + y} cx={x} cy={y} rx="1.2" ry="1.9" />)}</g></>,
  mango: <><path d="M18 40c-6-12 2-26 16-28 12-2 20 8 18 20-2 13-14 22-24 20-5-1-8-6-10-12z" fill={C.orange} /><path d="M36 13q3-7 11-6q-3 7-11 6z" fill={C.leaf} /><ellipse cx="40" cy="24" rx="5" ry="3" fill={C.yellow} opacity=".6" /></>,
  avocado: <><path d="M32 8c8 0 12 9 14 17 3 6 6 10 6 16 0 9-9 15-20 15s-20-6-20-15c0-6 3-10 6-16 2-8 6-17 14-17z" fill={C.leaf} /><path d="M32 13c6 0 9 7 11 13 2 5 5 8 5 13 0 7-7 12-16 12s-16-5-16-12c0-5 3-8 5-13 2-6 5-13 11-13z" fill="#dbedb0" /><circle cx="32" cy="38" r="8" fill={C.brown} /></>,
  banana: <><path d="M12 18c4 18 18 30 38 26 3-1 4 2 1 4-22 10-44-6-44-28 0-4 4-5 5-2z" fill={C.yellow} /><path d="M10 16l-1-5" stroke={C.choco} strokeWidth="3" strokeLinecap="round" /></>,
  cherries: <><path d="M22 42Q26 22 40 10M42 40Q40 24 40 10" {...ln} stroke={C.leaf} strokeWidth="2.4" /><path d="M40 10q8-4 14 2q-8 4-14-2z" fill={C.leaf} /><circle cx="21" cy="44" r="9" fill={C.red} /><circle cx="42" cy="42" r="9" fill="#e9737d" /><ellipse cx="18" cy="41" rx="2.4" ry="1.5" fill="#fff" opacity=".5" /></>,
  lemon: <><path d="M10 32c0-3 2-5 4-6 3-8 10-13 18-13s15 5 18 13c2 1 4 3 4 6s-2 5-4 6c-3 8-10 13-18 13s-15-5-18-13c-2-1-4-3-4-6z" fill={C.yellow} /><ellipse cx="38" cy="25" rx="5" ry="2.6" fill="#fff" opacity=".5" /></>,
  grapes: <><path d="M32 16q2-6 8-8" {...ln} stroke={C.leaf} strokeWidth="2.4" /><path d="M36 14q8-6 14 0q-8 5-14 0z" fill={C.leaf} /><g fill={C.lav}>{[[24, 22], [34, 22], [44, 22], [29, 31], [39, 31], [24, 40], [34, 40], [29, 49]].map(([x, y]) => <circle key={x + '' + y} cx={x - 2} cy={y} r="6" />)}</g></>,

  // Snacks
  popcorn: <><g fill={C.cream}>{[[22, 18], [32, 14], [42, 18], [27, 24], [37, 24]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="7" />)}</g><path d="M16 24h32l-4 30H20z" fill="#fff" /><path d="M24 24l2 30M32 24v30M40 24l-2 30" stroke={C.red} strokeWidth="3.4" /></>,
  pretzel: <><path d="M20 46c-10-8-8-26 6-28 6-1 10 4 10 10 0 8-8 12-8 18M44 46c10-8 8-26-6-28-6-1-10 4-10 10 0 8 8 12 8 18M16 38c10 4 22 4 32 0" fill="none" stroke={C.tan} strokeWidth="6" strokeLinecap="round" /><g fill="#fff">{[[22, 26], [42, 26], [32, 40]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1" />)}</g></>,
  onigiri: <><path d="M32 9c4 0 7 3 10 8l10 18c4 8 0 18-10 18H22c-10 0-14-10-10-18l10-18c3-5 6-8 10-8z" fill={C.white} stroke="#e8e3dc" strokeWidth="1.2" /><rect x="22" y="38" width="20" height="15" rx="2" fill="#4f6b5c" /><Face eyes="closed" mouth="smile" y={28} gap={5} cheeks /></>,
  springroll: <><rect x="8" y="22" width="40" height="13" rx="6.5" fill={C.tan} transform="rotate(-12 28 28)" /><rect x="16" y="34" width="40" height="13" rx="6.5" fill={C.orange} transform="rotate(-12 36 40)" /><path d="M20 26l2 9M30 24l2 9M28 38l2 9M38 36l2 9" {...ln} stroke="#d9a777" strokeWidth="1.3" /></>,
  bao: <><path d="M10 40c0-14 10-24 22-24s22 10 22 24c0 6-8 10-22 10S10 46 10 40z" fill={C.white} stroke="#ece6dc" strokeWidth="1.2" /><path d="M28 18q4 4 8 0" {...ln} stroke="#e4ddd2" /><Face eyes="dot" mouth="smile" y={36} gap={5} cheeks /></>,
  eggtart: <><path d={bumpy(32, 34, 21, 12, 1.3)} fill={C.tan} /><circle cx="32" cy="33" r="14" fill={C.yellow} /><ellipse cx="27" cy="29" rx="4" ry="2" fill="#fff" opacity=".45" /><circle cx="36" cy="37" r="2" fill={C.orange} opacity=".6" /></>,
  banhmi: <><path d="M6 36c0-8 8-12 26-14s26 2 26 8-8 12-26 14S6 42 6 36z" fill={C.tan} /><path d="M14 33c8-3 22-5 36-4" stroke={C.green} strokeWidth="3.4" strokeLinecap="round" /><path d="M16 36c8-2 20-4 32-3" stroke={C.coral} strokeWidth="2.4" strokeLinecap="round" /><path d="M18 27l4 3M28 25l4 3M38 25l4 3" {...ln} stroke="#d9a777" strokeWidth="1.4" /></>,

  // Kitchen
  chopsticks: <><path d="M14 54L46 10M22 56L54 14" stroke={C.tan} strokeWidth="4" strokeLinecap="round" /><path d="M40 18L46 10M48 22L54 14" stroke={C.coral} strokeWidth="4.4" strokeLinecap="round" /></>,
  teacup: <><Steam x={30} y={18} /><path d="M12 24h36c0 12-8 20-18 20S12 36 12 24z" fill={C.mint} /><path d="M47 28c6 0 6 9 0 9" fill="none" stroke={C.mint} strokeWidth="3.4" strokeLinecap="round" /><ellipse cx="30" cy="48" rx="20" ry="4" fill={C.lilac} /><path d="M24 32q3-3 6 0q-3 3-6 0" fill="#fff" /></>,
  pot: <><Steam x={32} y={14} /><rect x="12" y="24" width="40" height="5" rx="2.5" fill={C.coral} /><path d="M14 30h36v12c0 6-4 10-10 10H24c-6 0-10-4-10-10z" fill={C.red} /><rect x="29" y="19" width="6" height="5" rx="2" fill={C.coral} /><path d="M8 34h6M50 34h6" stroke={C.red} strokeWidth="3.4" strokeLinecap="round" /></>,
  ricecooker: <><path d="M12 28c0-8 9-14 20-14s20 6 20 14z" fill={C.white} stroke="#e8e3dc" strokeWidth="1.2" /><rect x="12" y="27" width="40" height="25" rx="8" fill={C.mint} /><circle cx="32" cy="38" r="5" fill={C.white} /><circle cx="32" cy="38" r="2" fill={C.coral} /><rect x="27" y="12" width="10" height="4" rx="2" fill={C.sage} /></>,
  lunchbox: <><rect x="8" y="16" width="48" height="34" rx="8" fill={C.coral} /><rect x="12" y="20" width="22" height="26" rx="4" fill={C.white} /><rect x="36" y="20" width="16" height="12" rx="3" fill={C.butter} /><rect x="36" y="34" width="16" height="12" rx="3" fill={C.mint} /><Face eyes="closed" mouth="smile" cx={23} y={32} gap={4} /></>,

  // Pets
  cat: <><path d="M46 46q12 0 8-14" fill="none" stroke={C.grey} strokeWidth="5" strokeLinecap="round" /><path d="M16 54c0-12 7-20 16-20s16 8 16 20z" fill={C.grey} /><circle cx="32" cy="27" r="14" fill={C.grey} /><Ears fill={C.grey} l={[22, 16]} r={[42, 16]} s={8} /><Face eyes="dot" mouth="w" y={27} gap={5} cheeks /></>,
  catloaf: <><path d="M8 46c0-14 10-24 24-24s24 10 24 24c0 4-3 6-6 6H14c-3 0-6-2-6-6z" fill={C.orange} /><Ears fill={C.orange} l={[18, 26]} r={[46, 26]} s={8} /><Face eyes="closed" mouth="w" y={38} gap={6} cheeks /><path d="M18 30l4 4M46 30l-4 4" {...ln} stroke="#e39b5b" /></>,
  catsleep: <><circle cx="32" cy="36" r="18" fill={C.lav} /><path d="M14 38q-2 14 16 14" fill="none" stroke={C.lav} strokeWidth="6" strokeLinecap="round" /><Ears fill={C.lav} l={[24, 22]} r={[40, 22]} s={6} /><Face eyes="closed" mouth="w" y={34} gap={5} /><path d="M46 10h5l-5 6h5" {...ln} strokeWidth="1.5" /></>,
  catpeek: <><rect x="4" y="38" width="56" height="18" rx="4" fill={C.sky} /><path d="M14 40c0-12 8-20 18-20s18 8 18 20z" fill={C.grey} /><Ears fill={C.grey} l={[20, 22]} r={[44, 22]} s={8} /><circle cx="26" cy="33" r="2" fill={INK} /><circle cx="38" cy="33" r="2" fill={INK} /><ellipse cx="22" cy="44" rx="4" ry="3.2" fill={C.grey} /><ellipse cx="42" cy="44" rx="4" ry="3.2" fill={C.grey} /></>,
  paw: <><ellipse cx="32" cy="40" rx="12" ry="10" fill={C.pink} /><g fill={C.pink}><ellipse cx="18" cy="26" rx="5" ry="6" /><ellipse cx="27" cy="18" rx="5" ry="6" /><ellipse cx="37" cy="18" rx="5" ry="6" /><ellipse cx="46" cy="26" rx="5" ry="6" /></g></>,
  dog: <><circle cx="32" cy="32" r="18" fill={C.cream} /><ellipse cx="15" cy="32" rx="6" ry="12" fill={C.brown} transform="rotate(15 15 32)" /><ellipse cx="49" cy="32" rx="6" ry="12" fill={C.brown} transform="rotate(-15 49 32)" /><ellipse cx="32" cy="38" rx="7" ry="5" fill="#fff" /><ellipse cx="32" cy="35" rx="2.6" ry="1.8" fill={INK} /><Face eyes="dot" mouth="none" y={28} gap={6} cheeks /><path d="M32 37q-2 3-4 2M32 37q2 3 4 2" {...ln} strokeWidth="1.4" /></>,
  dogwag: <><path d="M46 34q10-10 8-18" fill="none" stroke={C.tan} strokeWidth="5" strokeLinecap="round" /><path d="M50 12q6 2 6 8M54 26q6-2 6-8" {...ln} stroke="#d9b45a" strokeWidth="1.3" /><ellipse cx="34" cy="42" rx="16" ry="11" fill={C.tan} /><circle cx="20" cy="30" r="11" fill={C.tan} /><ellipse cx="13" cy="31" rx="4" ry="8" fill={C.brown} /><Face eyes="happy" mouth="smile" cx={22} y={29} gap={4} /><rect x="24" y="50" width="5" height="6" rx="2.5" fill={C.tan} /><rect x="40" y="50" width="5" height="6" rx="2.5" fill={C.tan} /></>,
  dogsleep: <><ellipse cx="34" cy="40" rx="22" ry="12" fill={C.tan} /><circle cx="18" cy="38" r="10" fill={C.tan} /><ellipse cx="12" cy="36" rx="4" ry="7" fill={C.brown} /><Face eyes="closed" mouth="none" cx={20} y={38} gap={4} /><path d="M44 18h5l-5 6h5" {...ln} strokeWidth="1.5" /></>,
  bone: <><rect x="16" y="27" width="32" height="10" rx="5" fill={C.cream} /><g fill={C.cream}><circle cx="15" cy="26" r="6" /><circle cx="15" cy="38" r="6" /><circle cx="49" cy="26" r="6" /><circle cx="49" cy="38" r="6" /></g></>,
  bunny: <><ellipse cx="25" cy="18" rx="5" ry="13" fill={C.white} stroke="#ece6dc" /><ellipse cx="39" cy="18" rx="5" ry="13" fill={C.white} stroke="#ece6dc" /><ellipse cx="25" cy="18" rx="2.2" ry="8" fill={C.pink} /><ellipse cx="39" cy="18" rx="2.2" ry="8" fill={C.pink} /><ellipse cx="32" cy="40" rx="17" ry="14" fill={C.white} stroke="#ece6dc" /><Face eyes="dot" mouth="w" y={39} gap={6} cheeks /></>,
  hamster: <><path d={bumpy(32, 36, 19, 3, 1, 0.6)} fill={C.peach} /><circle cx="18" cy="20" r="5" fill={C.peach} /><circle cx="46" cy="20" r="5" fill={C.peach} /><circle cx="18" cy="20" r="2.4" fill={C.pink} /><circle cx="46" cy="20" r="2.4" fill={C.pink} /><ellipse cx="32" cy="42" rx="10" ry="8" fill={C.cream} /><Face eyes="dot" mouth="w" y={35} gap={7} cheeks /></>,
  goldfish: <><path d="M44 32l14-10v20z" fill={C.coral} /><ellipse cx="30" cy="32" rx="18" ry="13" fill={C.orange} /><path d="M26 20q4-8 10-6l-2 8z" fill={C.coral} /><circle cx="20" cy="29" r="2" fill={INK} /><path d="M30 26q4 6 0 12" {...ln} stroke="#e39b5b" /></>,
  bird: <><path d="M44 30l12-6-4 12z" fill={C.blue} /><circle cx="30" cy="34" r="18" fill={C.sky} /><path d="M24 36q8 10 18 0q-8-2-18 0z" fill={C.blue} /><path d="M14 30l-7 2 7 3z" fill={C.orange} /><circle cx="22" cy="28" r="2" fill={INK} /><ellipse cx="21" cy="34" rx="2.4" ry="1.5" fill={C.cheek} opacity=".7" /></>,
  turtle: <><ellipse cx="14" cy="38" rx="7" ry="6" fill={C.mint} /><circle cx="12" cy="36" r="1.6" fill={INK} /><path d="M18 42c0-12 7-20 18-20s18 8 18 20z" fill={C.sage} /><path d="M24 34h24M30 24v18M42 24v18" {...ln} stroke="#86b38f" /><rect x="20" y="42" width="6" height="7" rx="3" fill={C.mint} /><rect x="44" y="42" width="6" height="7" rx="3" fill={C.mint} /></>,
  guineapig: <><path d="M8 40c0-12 11-20 26-20s22 8 22 18-8 14-24 14S8 50 8 40z" fill={C.cream} /><path d="M34 20c10 0 22 6 22 18 0 4-1 7-3 9-6-8-12-14-19-27z" fill={C.tan} /><ellipse cx="18" cy="24" rx="5" ry="4" fill={C.pink} /><Face eyes="dot" mouth="w" cx={20} y={34} gap={5} cheeks /></>,
  frog: <><circle cx="21" cy="21" r="8" fill={C.green} /><circle cx="43" cy="21" r="8" fill={C.green} /><path d="M10 38c0-12 10-18 22-18s22 6 22 18-10 16-22 16-22-4-22-16z" fill={C.green} /><circle cx="21" cy="21" r="3" fill={INK} /><circle cx="43" cy="21" r="3" fill={INK} /><path d="M22 38q10 8 20 0" {...ln} /><ellipse cx="16" cy="40" rx="3" ry="1.8" fill={C.cheek} opacity=".7" /><ellipse cx="48" cy="40" rx="3" ry="1.8" fill={C.cheek} opacity=".7" /></>,
  duck: <><path d="M10 40c0-8 6-12 14-12 0-8 5-14 12-14s12 6 12 13c0 5-3 8-6 10 6 1 12 4 12 10 0 7-8 9-22 9S10 54 10 40z" fill={C.white} stroke="#ece6dc" /><path d="M46 24l9 2-9 4z" fill={C.orange} /><circle cx="40" cy="22" r="2" fill={INK} /></>,
  chick: <><circle cx="32" cy="36" r="18" fill={C.yellow} /><path d="M30 18q-2-6 2-8q0 4 3 5" fill={C.yellow} /><path d="M29 36l3 4 3-4z" fill={C.orange} /><Face eyes="dot" mouth="none" y={32} gap={7} cheeks /><path d="M14 40q-6 0-6 6" {...ln} stroke="#e3c85a" /></>,
  panda: <><circle cx="17" cy="18" r="7" fill={INK} /><circle cx="47" cy="18" r="7" fill={INK} /><circle cx="32" cy="34" r="20" fill={C.white} stroke="#ece6dc" /><ellipse cx="24" cy="32" rx="5" ry="6.5" fill={INK} transform="rotate(20 24 32)" /><ellipse cx="40" cy="32" rx="5" ry="6.5" fill={INK} transform="rotate(-20 40 32)" /><circle cx="25" cy="31" r="1.6" fill="#fff" /><circle cx="39" cy="31" r="1.6" fill="#fff" /><ellipse cx="32" cy="40" rx="2.6" ry="1.8" fill={INK} /><path d="M29 44q3 2 6 0" {...ln} /></>,
  bear: <><circle cx="17" cy="18" r="7" fill={C.brown} /><circle cx="47" cy="18" r="7" fill={C.brown} /><circle cx="17" cy="18" r="3.4" fill={C.peach} /><circle cx="47" cy="18" r="3.4" fill={C.peach} /><circle cx="32" cy="34" r="20" fill={C.brown} /><ellipse cx="32" cy="41" rx="8" ry="6" fill={C.cream} /><ellipse cx="32" cy="38.5" rx="2.6" ry="1.8" fill={INK} /><Face eyes="dot" mouth="none" y={31} gap={7} cheeks /></>,
  fox: <><path d="M10 14l14 10M54 14L40 24" stroke={C.orange} strokeWidth="8" strokeLinecap="round" /><path d="M12 24c4-2 12-2 20-2s16 0 20 2c2 14-8 28-20 30-12-2-22-16-20-30z" fill={C.orange} /><path d="M14 30c6 0 12 4 18 12 6-8 12-12 18-12-2 12-10 22-18 24-8-2-16-12-18-24z" fill={C.white} /><circle cx="32" cy="44" r="2.2" fill={INK} /><Face eyes="closed" mouth="none" y={32} gap={8} /></>,
  penguin: <><ellipse cx="32" cy="36" rx="18" ry="20" fill="#7d86b8" /><ellipse cx="32" cy="40" rx="12" ry="14" fill={C.white} /><path d="M28 30l4 3 4-3z" fill={C.orange} /><Face eyes="dot" mouth="none" y={26} gap={6} cheeks /><path d="M24 55h6M34 55h6" stroke={C.orange} strokeWidth="3" strokeLinecap="round" /></>,
  capybara: <><path d="M8 34c0-12 12-18 26-18 12 0 22 6 22 18v6c0 8-6 12-14 12H20c-8 0-12-6-12-12z" fill={C.brown} /><ellipse cx="20" cy="18" rx="4" ry="3" fill={C.choco} /><ellipse cx="44" cy="18" rx="4" ry="3" fill={C.choco} /><rect x="22" y="34" width="20" height="10" rx="5" fill={C.choco} /><Face eyes="line" mouth="none" y={28} gap={8} /><path d="M29 38h1M34 38h1" {...ln} stroke={INK} strokeWidth="2" /><circle cx="44" cy="10" r="5" fill={C.orange} /></>,
  fishbowl: <><circle cx="32" cy="36" r="20" fill={C.sky} opacity=".7" /><rect x="20" y="13" width="24" height="5" rx="2.5" fill={C.sky} /><path d="M14 40h36" stroke="#fff" strokeWidth="1.6" opacity=".7" /><ellipse cx="30" cy="34" rx="8" ry="5.4" fill={C.orange} /><path d="M37 34l6-4v8z" fill={C.coral} /><circle cx="26" cy="33" r="1.3" fill={INK} /><path d="M40 22q2-2 0-4M44 26q2-2 0-4" {...ln} stroke="#fff" strokeWidth="1.3" /></>,
  yarn: <><circle cx="30" cy="32" r="18" fill={C.pink} /><path d="M16 24q14 4 26 20M14 34q14-2 26 14M20 18q14 6 22 22M36 16q-12 10-20 28" {...ln} stroke="#e48aa4" strokeWidth="1.5" /><path d="M46 42q8 2 10 10" {...ln} stroke={C.pink} strokeWidth="2.6" /></>,
  catears: <><path d="M10 44q22-22 44 0" fill="none" stroke={C.lav} strokeWidth="5" strokeLinecap="round" /><path d="M14 36L16 18l12 12z" fill={C.lav} stroke={C.lav} strokeWidth="3" strokeLinejoin="round" /><path d="M50 36L48 18 36 30z" fill={C.lav} stroke={C.lav} strokeWidth="3" strokeLinejoin="round" /><path d="M17 30l1-7 5 5zM47 30l-1-7-5 5z" fill={C.pink} /></>,
  bandana: <><path d="M8 20h48L32 50z" fill={C.coral} /><path d="M8 20h48" stroke={C.red} strokeWidth="5" strokeLinecap="round" /><g fill={C.white}>{[[22, 28], [32, 26], [42, 28], [27, 36], [37, 36], [32, 44]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="1.8" />)}</g></>,

  // Plants
  cactus: <><path d="M22 44h20l-2 12H24z" fill={C.coral} /><rect x="26" y="12" width="12" height="34" rx="6" fill={C.sage} /><path d="M26 30h-6c-2 0-4-2-4-4v-6" fill="none" stroke={C.sage} strokeWidth="6" strokeLinecap="round" /><path d="M38 26h6c2 0 4-2 4-4v-4" fill="none" stroke={C.sage} strokeWidth="6" strokeLinecap="round" /><Face eyes="closed" mouth="smile" y={24} gap={3} /><circle cx="32" cy="10" r="3" fill={C.pink} /></>,
  monstera: <><path d="M32 56V34" stroke={C.leaf} strokeWidth="3" strokeLinecap="round" /><path d="M32 36C14 38 6 24 12 14c6-8 16-8 20-2 4-6 14-6 20 2 6 10-2 24-20 22z" fill={C.green} /><path d="M32 36V14M32 24l-10-6M32 24l10-6M32 30l-12 0M32 30l12 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".85" /></>,
  tulip: <><path d="M32 56V30" stroke={C.leaf} strokeWidth="3" strokeLinecap="round" /><path d="M32 46q-12-2-14-14q10 2 14 10" fill={C.green} /><path d="M18 14q6 4 8 0q6 6 6 0q2 6 6 0q2 4 8 0c2 12-4 20-14 20s-16-8-14-20z" fill={C.rose} /></>,
  daisy: <><g fill={C.white} stroke="#ece6dc">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="32" cy="17" rx="5" ry="10" transform={`rotate(${i * 45} 32 32)`} />)}</g><circle cx="32" cy="32" r="8" fill={C.yellow} /><Face eyes="closed" mouth="smile" y={31} gap={3} /></>,
  sprout: <><path d="M20 44h24l-3 12H23z" fill={C.tan} /><path d="M32 44V28" stroke={C.leaf} strokeWidth="3" strokeLinecap="round" /><path d="M32 30C22 30 16 24 16 16c10 0 16 6 16 14z" fill={C.green} /><path d="M32 30c8 0 14-5 14-12-8 0-14 5-14 12z" fill={C.mint} /></>,
  bonsai: <><rect x="14" y="46" width="36" height="8" rx="3" fill={C.lav} /><path d="M32 46c0-8-4-10-8-14M30 40c4-4 8-6 12-6" fill="none" stroke={C.choco} strokeWidth="3.4" strokeLinecap="round" /><ellipse cx="22" cy="28" rx="11" ry="7" fill={C.sage} /><ellipse cx="42" cy="30" rx="10" ry="6" fill={C.green} /><ellipse cx="32" cy="18" rx="12" ry="7" fill={C.green} /></>,

  // Things
  headphones: <><path d="M12 38v-6c0-12 9-20 20-20s20 8 20 20v6" fill="none" stroke={C.lav} strokeWidth="5" strokeLinecap="round" /><rect x="8" y="34" width="12" height="18" rx="6" fill={C.pink} /><rect x="44" y="34" width="12" height="18" rx="6" fill={C.pink} /></>,
  laptop: <><rect x="12" y="14" width="40" height="28" rx="4" fill={C.blue} /><rect x="16" y="18" width="32" height="20" rx="2" fill={C.sky} /><path d="M6 44h52l-4 6H10z" fill={C.lav} /><Face eyes="closed" mouth="smile" y={27} gap={5} /></>,
  backpack: <><path d="M24 14c0-4 4-6 8-6s8 2 8 6" fill="none" stroke={C.coral} strokeWidth="3.4" strokeLinecap="round" /><rect x="14" y="14" width="36" height="42" rx="12" fill={C.coral} /><rect x="20" y="34" width="24" height="16" rx="5" fill={C.peach} /><path d="M20 38h24" stroke={C.coral} strokeWidth="1.6" /><Face eyes="dot" mouth="smile" y={24} gap={5} /></>,
  umbrella: <><path d="M32 30v20c0 4-6 4-6 0" fill="none" stroke={C.choco} strokeWidth="3" strokeLinecap="round" /><path d="M8 32C8 18 19 10 32 10s24 8 24 22c-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0-4-3-8-3-12 0z" fill={C.sky} /><path d="M20 30q2-12 12-20q10 8 12 20" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".7" /></>,
  sneaker: <><path d="M6 42c0-6 4-10 8-10 6 0 10-12 18-12 4 0 6 4 8 8l12 6c4 2 6 5 6 8v4H6z" fill={C.white} stroke="#ece6dc" /><path d="M6 46h52v4c0 2-2 4-4 4H10c-2 0-4-2-4-4z" fill={C.mint} /><path d="M24 30l4 4M28 26l4 4M32 23l4 4" {...ln} stroke={C.coral} /><path d="M40 34c4 0 8 2 10 5" {...ln} stroke={C.lav} strokeWidth="2.4" /></>,
  plane: <><path d="M8 34l48-18-12 30-10-10-8 12-2-14z" fill={C.white} stroke="#e4e1ea" strokeLinejoin="round" /><path d="M24 34l20-12" {...ln} stroke={C.sky} /><path d="M6 46q8-2 12 4M12 54q6-2 10 2" {...ln} stroke="#d6d2de" strokeWidth="1.4" /></>,
  suitcase: <><path d="M24 16v-4c0-2 2-4 4-4h8c2 0 4 2 4 4v4" fill="none" stroke={C.choco} strokeWidth="3" /><rect x="10" y="16" width="44" height="36" rx="8" fill={C.butter} /><path d="M22 16v36M42 16v36" stroke={C.tan} strokeWidth="4" /><circle cx="18" cy="55" r="3" fill={C.choco} /><circle cx="46" cy="55" r="3" fill={C.choco} /><rect x="28" y="24" width="10" height="8" rx="2" fill={C.pink} transform="rotate(-10 33 28)" /></>,
  camera: <><rect x="8" y="20" width="48" height="32" rx="8" fill={C.lilac} /><rect x="20" y="14" width="14" height="8" rx="3" fill={C.lav} /><circle cx="32" cy="36" r="11" fill={C.white} /><circle cx="32" cy="36" r="7" fill={C.lav} /><circle cx="30" cy="34" r="2" fill="#fff" /><circle cx="48" cy="27" r="2.4" fill={C.pink} /></>,
}
export const ART_IDS = Object.keys(ART)

export function Illustration({ id, size = 56 }) {
  return <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">{ART[id] || ART.smile}</svg>
}
