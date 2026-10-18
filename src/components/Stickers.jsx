import Shape from './Shape.jsx'
import { Illustration } from './StickerArt.jsx'
import { LOOKS } from '../data.js'

/*
  Sticker set for postcards and letters. Purely decorative: no counts, no rankings.
  Each sticker is { kind, v }:
    art    – one of the app's own pastel illustrations (see StickerArt.jsx)
    emoji  – an emoji glyph (older drafts)
    heart  – a heart drawn in one of the app's palette colors ('halo' adds a little halo)
    bubble – a tiny speech bubble with a word in it
    pet    – the person's own pet photo, cut into a round sticker
    shape  – one of the older abstract shapes (kept so older drafts still show)
*/
const A = (list) => list.map(([v, name]) => ({ kind: 'art', v, name }))

export const STICKER_CATS = [
  { id: 'faces', label: 'Faces', items: A([['smile', 'smile'], ['grin', 'soft grin'], ['happycry', 'happy cry'], ['blush', 'blush'], ['wink', 'wink'], ['sleepy', 'sleepy'], ['melting', 'melting smile'], ['hugging', 'hug'], ['starry', 'starry eyes'], ['cool', 'cool shades'], ['thinking', 'thinking'], ['okayish', 'okay-ish']]) },
  { id: 'hearts', label: 'Hearts', items: A([['h_lav', 'lavender heart'], ['h_coral', 'coral heart'], ['h_sky', 'sky heart'], ['h_lime', 'lime heart'], ['h_peach', 'peach heart'], ['h_sparkle', 'sparkle heart'], ['h_mended', 'mended heart'], ['h_halo', 'heart with a halo']]) },
  { id: 'hands', label: 'Hands', items: A([['wave', 'wave'], ['thumbs', 'thumbs up'], ['peace', 'peace'], ['crossed', 'crossed fingers'], ['folded', 'folded hands'], ['hearthands', 'heart hands'], ['palms', 'two hands holding'], ['clap', 'clapping']]) },
  { id: 'symbols', label: 'Symbols', items: A([['sparkles', 'sparkles'], ['flame', 'flame'], ['rainbow', 'rainbow'], ['sun', 'sun face'], ['moon', 'moon face'], ['cloud', 'cloud face'], ['star', 'star'], ['flower', 'flower'], ['note', 'music note'], ['clover', 'four-leaf clover']]) },
  { id: 'say', label: 'Say', items: ['hi', 'yay', 'ugh', 'hmm', 'ok'].map((v) => ({ kind: 'bubble', v })) },
  { id: 'food', label: 'Food', items: A([['rice', 'rice bowl'], ['noodles', 'noodle bowl'], ['dumpling', 'dumpling'], ['soup', 'soup'], ['egg', 'fried egg'], ['toast', 'toast'], ['sandwich', 'sandwich'], ['pizza', 'pizza slice'], ['burger', 'burger'], ['fries', 'fries']]) },
  { id: 'sweets', label: 'Sweets', items: A([['boba', 'boba'], ['icedcoffee', 'iced coffee'], ['matcha', 'matcha'], ['croissant', 'croissant'], ['donut', 'donut'], ['cupcake', 'cupcake'], ['icecream', 'ice cream'], ['cookie', 'cookie'], ['strawberry', 'strawberry'], ['peach', 'peach']]) },
  { id: 'fruit', label: 'Fruit', items: A([['orange', 'orange slice'], ['watermelon', 'watermelon'], ['mango', 'mango'], ['avocado', 'avocado'], ['banana', 'banana'], ['cherries', 'cherries'], ['lemon', 'lemon'], ['grapes', 'grapes']]) },
  { id: 'snacks', label: 'Snacks', items: A([['popcorn', 'popcorn'], ['pretzel', 'pretzel'], ['onigiri', 'onigiri'], ['springroll', 'spring rolls'], ['bao', 'bao'], ['eggtart', 'egg tart'], ['banhmi', 'banh mi']]) },
  { id: 'kitchen', label: 'Kitchen', items: A([['chopsticks', 'chopsticks'], ['teacup', 'tea cup'], ['pot', 'steaming pot'], ['ricecooker', 'rice cooker'], ['lunchbox', 'lunchbox']]) },
  { id: 'pets', label: 'Pets', items: A([['cat', 'cat'], ['catloaf', 'cat loaf'], ['catsleep', 'sleeping cat'], ['catpeek', 'peeking cat'], ['paw', 'paw print'], ['dog', 'floppy-eared dog'], ['dogwag', 'wagging dog'], ['dogsleep', 'sleeping dog'], ['bone', 'bone'], ['bunny', 'bunny'], ['hamster', 'hamster'], ['goldfish', 'goldfish'], ['bird', 'bird'], ['turtle', 'turtle'], ['guineapig', 'guinea pig'], ['frog', 'frog'], ['duck', 'duck'], ['chick', 'chick'], ['panda', 'panda'], ['bear', 'bear cub'], ['fox', 'fox'], ['penguin', 'penguin'], ['capybara', 'capybara'], ['fishbowl', 'fish bowl'], ['yarn', 'ball of yarn'], ['catears', 'cat ears'], ['bandana', 'dog bandana']]) },
  { id: 'plants', label: 'Plants', items: A([['cactus', 'cactus'], ['monstera', 'monstera leaf'], ['tulip', 'tulip'], ['daisy', 'daisy'], ['sprout', 'sprout'], ['bonsai', 'bonsai']]) },
  { id: 'things', label: 'Things', items: A([['headphones', 'headphones'], ['laptop', 'laptop'], ['backpack', 'backpack'], ['umbrella', 'umbrella'], ['sneaker', 'sneakers'], ['plane', 'plane'], ['suitcase', 'suitcase'], ['camera', 'camera']]) },
  { id: 'mypet', label: 'Your pet', items: [] },
]

const BUBBLE_TINT = { hi: '#e6defc', yay: '#ffe2cc', ugh: '#dceefe', hmm: '#e3f4d2', ok: '#ffe0ea' }

// A white sticker edge around whatever is drawn, plus a soft shadow so it sits on the paper.
export const DIECUT = 'drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(0 2px 3px rgba(29,29,34,.12))'

export function StickerArt({ st, size = 56, flat }) {
  const box = { width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: flat ? 'none' : DIECUT, pointerEvents: 'none' }
  if (st.kind === 'art') return <span style={box}><Illustration id={st.v} size={size * 0.92} /></span>
  if (st.kind === 'emoji') return <span style={{ ...box, fontSize: size * 0.72, lineHeight: 1 }}>{st.v}</span>
  if (st.kind === 'heart') {
    const halo = st.v === 'halo'
    return (
      <span style={box}>
        <svg width={size * 0.86} height={size * 0.86} viewBox="0 0 24 24" aria-hidden="true">
          {halo ? <ellipse cx="12" cy="3.4" rx="5" ry="1.6" fill="none" stroke="#f3c84b" strokeWidth="1.4" /> : null}
          <path d={halo ? 'M12 22s-7.5-4.6-7.5-10.4A4.2 4.2 0 0 1 12 9a4.2 4.2 0 0 1 7.5 2.6C19.5 17.4 12 22 12 22z' : 'M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z'} fill={halo ? '#ffd3e2' : st.v} />
          <path d={halo ? 'M8.6 12.2a2 2 0 0 1 2-1.9' : 'M7.6 9.4a2.2 2.2 0 0 1 2.2-2.1'} stroke="rgba(255,255,255,.75)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </svg>
      </span>
    )
  }
  if (st.kind === 'bubble') {
    return (
      <span style={box}>
        <span style={{ position: 'relative', background: BUBBLE_TINT[st.v] || '#eee', color: '#1d1d22', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: size * 0.32, lineHeight: 1, padding: `${size * 0.11}px ${size * 0.16}px`, borderRadius: size * 0.22 }}>
          {st.v}
          <span style={{ position: 'absolute', left: size * 0.14, bottom: -size * 0.07, width: size * 0.16, height: size * 0.16, background: BUBBLE_TINT[st.v] || '#eee', transform: 'rotate(45deg)', borderRadius: 2 }} />
        </span>
      </span>
    )
  }
  if (st.kind === 'pet') return <span style={box}><img src={st.v} alt="" style={{ width: size * 0.9, height: size * 0.9, objectFit: 'cover' }} /></span>
  return <span style={box}><span className="mask-round" style={{ width: size, height: size * 0.84 }}><Shape look={LOOKS[st.v] || LOOKS.ripple} /></span></span>
}

/** Turn a chosen photo into a round sticker image (a transparent PNG data URL). */
export function petSticker(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const S = 240
        const c = document.createElement('canvas')
        c.width = S; c.height = S
        const ctx = c.getContext('2d')
        const k = Math.max(S / img.width, S / img.height)
        ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); ctx.clip()
        ctx.drawImage(img, (S - img.width * k) / 2, (S - img.height * k) / 2, img.width * k, img.height * k)
        resolve(c.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
