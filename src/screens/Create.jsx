import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import { LOOKS, PROMPTS, STAMPS, stampLook as stampFace } from '../data.js'
import { Display, Dock, IconButton, Placeholder, Screen, Segmented, Tile, TopBar } from '../components/ui.jsx'
import Shape from '../components/Shape.jsx'
import Icon from '../components/Icon.jsx'
import { useDiscardGuard } from '../components/Discard.jsx'
import Envelope, { ENVELOPES, holo } from '../components/Envelope.jsx'
import { STICKER_CATS, StickerArt, petSticker } from '../components/Stickers.jsx'
import { VoicePlayer, clock, startVoice } from '../components/Voice.jsx'

const MODE_LABEL = { photo: 'Photo', voice: 'Voice memo', text: 'Words' }
// Prototype stand-in for the camera: each prompt "sees" a fitting sample photo.
const PHOTO_FOR = { slice: 'me-six-flags.webp', workstation: 'me-artbox.webp', smile: 'mom-changi.webp', home: 'mom-albania-still.webp' }
// A photo is either one of the bundled sample images (by name) or a picture the person chose (a data URL).
// Names with an extension are used as-is; older bundled images are .jpg.
const photoUrl = (name) => (name && name.startsWith('data:') ? name : `${import.meta.env.BASE_URL}stamps/${name && name.includes('.') ? name : `${name}.jpg`}`)

/** When the draft is a reply, the letter being answered and who it goes to. */
function useReply() {
  const { draft, letters } = useApp()
  const replyTo = draft.replyTo ? letters.find((l) => l.id === draft.replyTo) : null
  const to = replyTo ? replyTo.from : 'Mom'
  const replyPrompt = replyTo ? { title: `Write back to ${to}`, category: `Replying to “${replyTo.title}”` } : null
  return { replyTo, to, replyPrompt }
}

function LetterTo() {
  const { replyTo, to } = useReply()
  return <span className="small">{replyTo ? 'Reply to' : 'Letter to'} <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{to}</b></span>
}

/* ---------- Capture ---------- */
// Voice memo orb: the faded pastel circle used across the app. It breathes while idle and swells with your voice while recording.
// It follows the recorder's microphone level (analyser) when there is one; otherwise it falls back to a speech-like rhythm.
export function VoiceOrb({ rec, colors, analyser = null, size = 280 }) {
  const orb = useRef(null)
  const halo = useRef(null)
  const halo2 = useRef(null)
  const source = useRef(analyser)
  source.current = analyser
  useEffect(() => {
    if (!rec) return
    let raf = 0, data = null, level = 0
    const t0 = performance.now()
    const tick = () => {
      let target
      const analyser = source.current
      if (analyser) {
        if (!data || data.length !== analyser.fftSize) data = new Uint8Array(analyser.fftSize)
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v }
        target = Math.min(1, Math.sqrt(sum / data.length) * 5)
      } else {
        const t = (performance.now() - t0) / 1000
        const syllables = Math.max(0, Math.sin(t * 8.5)) * Math.max(0, Math.sin(t * 1.6) + 0.35)
        target = Math.min(1, syllables * 0.75 + Math.random() * 0.06)
      }
      level += (target - level) * (target > level ? 0.35 : 0.1)
      if (orb.current) orb.current.style.transform = `scale(${1 + level * 0.22})`
      if (halo.current) { halo.current.style.transform = `scale(${1.06 + level * 0.45})`; halo.current.style.opacity = String(0.35 + level * 0.5) }
      if (halo2.current) { halo2.current.style.transform = `scale(${1.12 + level * 0.8})`; halo2.current.style.opacity = String(0.15 + level * 0.35) }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ;[orb, halo, halo2].forEach((r) => { if (r.current) { r.current.style.transform = ''; r.current.style.opacity = '' } })
    }
  }, [rec])

  // Soft edges everywhere: each layer fades out instead of ending in a hard circle.
  const fade = (stop) => ({ WebkitMaskImage: `radial-gradient(circle, #000 ${stop}%, transparent 71%)`, maskImage: `radial-gradient(circle, #000 ${stop}%, transparent 71%)` })
  const layer = (ref, inset, blur, stop, still) => (
    <span ref={ref} aria-hidden="true" style={{ position: 'absolute', inset, borderRadius: '50%', ...fade(stop), opacity: rec || ref === orb ? undefined : 0.45, transition: rec ? 'none' : 'transform .6s ease, opacity .6s ease' }}>
      <span style={{ position: 'absolute', inset: '-20%', background: holo(colors), filter: `blur(${blur}px)`, animation: still ? 'none' : `drift ${rec ? 4 : 12}s ease-in-out infinite alternate` }} />
    </span>
  )
  return (
    <div style={{ position: 'relative', width: size, height: size, animation: rec ? 'none' : 'breathe 6s ease-in-out infinite' }}>
      {layer(halo2, 0, 30, 20, true)}
      {layer(halo, size * 0.093, 24, 30, true)}
      {layer(orb, size * 0.18, 16, 45, false)}
    </div>
  )
}

export function Capture() {
  const { go, prompt, draft, setDraft } = useApp()
  const [mode, setMode] = useState(draft.kind === 'voice' ? 'voice' : 'photo')
  const [rec, setRec] = useState(false)
  const [secs, setSecs] = useState(0)
  // Real recording: the mic starts on the tap, the clip goes into the letter.
  // If the mic isn't available or allowed, it carries on as a pretend recording and says so.
  const voice = useRef(null) // the pending startVoice() promise
  const began = useRef(0)
  const [micLive, setMicLive] = useState(false)
  const [analyser, setAnalyser] = useState(null)
  const [micOff, setMicOff] = useState(false)
  useEffect(() => {
    if (!rec || !micLive) return
    const t = setInterval(() => setSecs(Math.floor((Date.now() - began.current) / 1000)), 250)
    return () => clearInterval(t)
  }, [rec, micLive])
  const startRec = () => {
    setSecs(0); setRec(true); setMicLive(false)
    const pending = startVoice()
    voice.current = pending
    pending.then((h) => {
      if (voice.current !== pending) { h.cancel(); return }
      setAnalyser(h.analyser); setMicOff(false)
    }, () => { if (voice.current === pending) setMicOff(true) })
      .finally(() => { if (voice.current === pending) { began.current = Date.now(); setMicLive(true) } })
  }
  const stopRec = async () => {
    const pending = voice.current
    const seconds = Math.max(1, Math.round((Date.now() - (began.current || Date.now())) / 1000))
    voice.current = null
    setRec(false); setAnalyser(null)
    const h = pending ? await pending.catch(() => null) : null
    const clip = h ? await h.stop() : null
    setDraft({ kind: 'voice', seconds, audio: clip ? clip.url : null })
    go('caption')
  }
  // Leaving the screen throws the recording away and frees the mic.
  useEffect(() => () => { const p = voice.current; voice.current = null; if (p) p.then((h) => h.cancel(), () => {}) }, [])
  // Three minutes is the cap; locking the phone also ends it, since the mic stops anyway.
  useEffect(() => { if (rec && secs >= 180) stopRec() }, [rec, secs]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!rec) return
    const hide = () => { if (document.hidden) stopRec() }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [rec]) // eslint-disable-line react-hooks/exhaustive-deps
  const pickMode = (m) => (m === 'text' ? (setDraft({ kind: 'text' }), go('write')) : setMode(m))
  // The camera view stays empty until the shutter (or library) is used; then the photo is shown to keep or retake.
  const [picked, setPicked] = useState(null)
  const shot = picked || PHOTO_FOR[draft.promptId] || 'me-six-flags.webp'
  const library = useRef(null)
  const [taken, setTaken] = useState(false)
  // Camera roll: read the chosen picture and shrink it so the letter stays light.
  const fromLibrary = (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const k = Math.min(1, 1200 / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        setPicked(c.toDataURL('image/jpeg', 0.85))
        setTaken(true)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }
  const [flash, setFlash] = useState(0)
  const snap = (withFlash) => { setTaken(true); if (withFlash) setFlash((f) => f + 1) }

  // Real camera on phones: a live view in the frame, the shutter grabs a still from it.
  // If the browser won't share the camera (some in-app browsers, embedded previews), the shutter opens the phone's own camera instead.
  // Computers keep the sample photo so a demo doesn't trigger a webcam prompt.
  const isPhone = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches
  const video = useRef(null)
  const stream = useRef(null)
  const nativeCam = useRef(null)
  const [live, setLive] = useState(false)
  const [facing, setFacing] = useState('environment')
  useEffect(() => {
    const stop = () => { if (stream.current) { stream.current.getTracks().forEach((t) => t.stop()); stream.current = null } setLive(false) }
    if (mode !== 'photo' || taken || !isPhone || !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { stop(); return }
    let cancelled = false
    navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 1600 }, height: { ideal: 1600 } }, audio: false })
      .then((st) => {
        if (cancelled) { st.getTracks().forEach((t) => t.stop()); return }
        stream.current = st
        if (video.current) { video.current.srcObject = st; video.current.play().catch(() => {}) }
        setLive(true)
      })
      .catch(() => setLive(false))
    return () => { cancelled = true; stop() }
  }, [mode, taken, facing, isPhone])
  const shoot = () => {
    const v = video.current
    if (live && v && v.videoWidth) {
      const k = Math.min(1, 1200 / Math.max(v.videoWidth, v.videoHeight))
      const c = document.createElement('canvas')
      c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k)
      const ctx = c.getContext('2d')
      if (facing === 'user') { ctx.translate(c.width, 0); ctx.scale(-1, 1) }
      ctx.drawImage(v, 0, 0, c.width, c.height)
      setPicked(c.toDataURL('image/jpeg', 0.85))
      snap(true)
    } else if (isPhone && nativeCam.current) {
      nativeCam.current.click()
    } else {
      snap(true)
    }
  }
  const done = () => { setDraft({ kind: 'photo', photo: shot }); go('caption') }
  const { replyPrompt } = useReply()
  const p = replyPrompt || PROMPTS.find((x) => x.id === draft.promptId) || prompt
  const { leave, sheet } = useDiscardGuard(rec || secs > 0 || taken, { onDiscard: () => { const p = voice.current; voice.current = null; if (p) p.then((h) => h.cancel(), () => {}); setRec(false) }, body: 'If you leave now, your recording won’t be saved.', keep: 'Keep recording' })

  return (
    <Screen>
      {sheet}
      <div className="screen-body">
        <TopBar left={<IconButton icon="close" label="Close" onClick={() => leave('home')} />} />
        <Display small>{p.title}</Display>
        <Segmented label="Answer with" options={[{ value: 'photo', label: 'Photo' }, { value: 'voice', label: 'Voice memo' }, { value: 'text', label: 'Words' }]} value={mode} onChange={pickMode} />
        {mode === 'photo' ? (
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            {taken
              ? <img src={photoUrl(shot)} alt="Your photo" className="rise" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 28, animationDuration: '.35s' }} />
              : <>
                  <video ref={video} playsInline muted autoPlay aria-label="Camera view" style={{ display: live ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 28, background: '#111', transform: facing === 'user' ? 'scaleX(-1)' : 'none' }} />
                  {live ? null : <Placeholder label="Camera view" style={{ height: '100%', borderRadius: 28 }} />}
                  <div className={live ? 'brackets' : 'brackets dark'}><i /><i /><i /><i /></div>
                  {live ? <button aria-label="Switch camera" onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))} style={{ position: 'absolute', right: 14, top: 14, width: 40, height: 40, borderRadius: 20, border: 'none', background: 'rgba(29,29,34,.45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}><Icon name="refresh" size={18} /></button> : null}
                </>}
            {flash ? <span key={flash} aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 28, background: '#fff', animation: 'crackFlash .45s ease-out both', pointerEvents: 'none' }} /> : null}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'var(--fill)', borderRadius: 28, overflow: 'hidden' }}>
            <VoiceOrb rec={rec} analyser={analyser} colors={p.card ? [p.card[0], '#ffd3e2', p.card[1], '#d9ccfa', '#f6f2ff'] : ENVELOPES[0].c} />
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, fontVariantNumeric: 'tabular-nums', fontWeight: 300, color: rec ? '#e5484d' : 'var(--ink)', transition: 'color .3s ease' }}>
              <span aria-hidden="true" style={{ width: rec ? 10 : 0, height: 10, borderRadius: 5, background: '#e5484d', marginLeft: rec ? 0 : -10, transition: 'width .25s ease, margin .25s ease', animation: rec ? 'recDot 1.2s ease-in-out infinite' : 'none' }} />
              {clock(secs)}
            </span>
          </div>
        )}
        <p className="small" style={{ textAlign: 'center' }}>{mode === 'photo' ? 'Mess is welcome. This isn’t proof, just a peek.' : micOff ? 'The microphone is off, so this is a pretend recording. Allow the microphone for this site to record your voice.' : rec && !micLive ? 'Starting the microphone…' : 'Talk like you would on the phone. A minute is plenty.'}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
          {mode === 'photo' && taken ? null : <span />}
          {mode === 'photo' && taken ? (
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, height: 74, alignItems: 'center' }}>
              <button className="pill outline" style={{ flex: 1 }} onClick={() => { setTaken(false); setPicked(null) }}><Icon name="refresh" size={18} />Retake</button>
              <button className="pill" style={{ flex: 1 }} onClick={done}><Icon name="check" size={18} />Use photo</button>
            </div>
          ) : mode === 'photo' ? (
            <button aria-label="Take photo" onClick={shoot} style={{ width: 74, height: 74, borderRadius: 37, border: '4px solid var(--ink)', background: '#fff', padding: 5 }}>
              <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--ink)' }} />
            </button>
          ) : (
            <button aria-label={rec ? 'Stop and review' : 'Start recording'} onClick={() => (rec ? stopRec() : startRec())} style={{ position: 'relative', width: 74, height: 74, borderRadius: 37, border: 'none', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: rec ? 'recRing 1.4s ease-out infinite' : 'none' }}>
              {/* The mic shrinks away and a rounded stop square grows in its place while recording. */}
              <span style={{ display: 'flex', transform: rec ? 'scale(.3)' : 'scale(1)', opacity: rec ? 0 : 1, transition: 'transform .3s cubic-bezier(.2,.8,.2,1), opacity .2s ease' }}><Icon name="voice" size={26} /></span>
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: rec ? 24 : 10, height: rec ? 24 : 10, borderRadius: rec ? 7 : 5, background: '#ff6b6b', transform: 'translate(-50%, -50%)', opacity: rec ? 1 : 0, transition: 'width .35s cubic-bezier(.3,1.4,.4,1), height .35s cubic-bezier(.3,1.4,.4,1), border-radius .35s ease, opacity .2s ease' }} />
            </button>
          )}
          {mode === 'photo' && taken ? null : mode === 'photo' ? <span style={{ justifySelf: 'end' }}><IconButton icon="gallery" label="Choose from library" onClick={() => library.current && library.current.click()} /><input ref={library} type="file" accept="image/*" onChange={fromLibrary} style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} /><input ref={nativeCam} type="file" accept="image/*" capture="environment" onChange={fromLibrary} style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} /></span> : <span />}
        </div>
      </div>
    </Screen>
  )
}

/* ---------- Write ---------- */
// Pen colors come from the shape palette so handwriting matches the rest of the app.
const INKS = [
  { id: 'ink', label: 'Ink', color: '#1d1d22' },
  { id: 'blue', label: 'Blue', color: '#2f6cf0' },
  { id: 'violet', label: 'Violet', color: '#7d62e0' },
  { id: 'coral', label: 'Coral', color: '#ec5a52' },
  { id: 'green', label: 'Green', color: '#3f9a5c' },
]
const RAINBOW = 'conic-gradient(from 0deg, hsl(0,90%,60%), hsl(60,90%,55%), hsl(120,70%,50%), hsl(180,80%,50%), hsl(240,85%,62%), hsl(300,80%,60%), hsl(360,90%,60%))'

/** Pick any pen color: angle around the wheel is the hue, distance from the center goes from soft pastel to full color. */
function ColorWheel({ value, onPick, onClose }) {
  const ref = useRef(null)
  const [mark, setMark] = useState(null)
  const pickAt = (e) => {
    const r = ref.current.getBoundingClientRect()
    const R = r.width / 2
    let dx = e.clientX - (r.left + R), dy = e.clientY - (r.top + R)
    const dist = Math.min(1, Math.hypot(dx, dy) / R)
    const ang = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360
    const color = `hsl(${Math.round(ang)}, 88%, ${Math.round(94 - 44 * dist)}%)`
    const k = dist / (Math.hypot(dx, dy) / R || 1)
    setMark({ x: R + dx * k, y: R + dy * k })
    onPick(color)
  }
  const drag = useRef(false)
  return (
    <div role="dialog" aria-label="Pick a pen color" className="rise" onPointerDown={(e) => e.stopPropagation()}
      style={{ position: 'absolute', left: 0, bottom: 44, zIndex: 20, background: '#fff', borderRadius: 22, padding: 14, boxShadow: '0 16px 40px rgba(29,29,34,.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animationDuration: '.25s' }}>
      <div ref={ref} aria-label="Color wheel"
        onPointerDown={(e) => { drag.current = true; try { e.currentTarget.setPointerCapture(e.pointerId) } catch {} pickAt(e) }}
        onPointerMove={(e) => { if (drag.current) pickAt(e) }}
        onPointerUp={() => { drag.current = false }}
        style={{ position: 'relative', width: 176, height: 176, borderRadius: '50%', background: RAINBOW, touchAction: 'none', cursor: 'crosshair' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,.75) 22%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        {mark ? <span aria-hidden="true" style={{ position: 'absolute', left: mark.x - 11, top: mark.y - 11, width: 22, height: 22, borderRadius: 11, background: value, boxShadow: '0 0 0 3px #fff, 0 2px 8px rgba(29,29,34,.3)', pointerEvents: 'none' }} /> : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, alignSelf: 'stretch' }}>
        <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 13, background: value, boxShadow: 'inset 0 0 0 1.5px rgba(29,29,34,.08)' }} />
        <span className="small" style={{ flex: 1 }}>Your color</span>
        <button className="pill small" onClick={onClose} style={{ height: 32, padding: '0 14px' }}>Done</button>
      </div>
    </div>
  )
}
const SIZES = [
  { id: 'fine', label: 'Fine', width: 2 },
  { id: 'medium', label: 'Medium', width: 4 },
  { id: 'bold', label: 'Bold', width: 8 },
]

function paintStroke(ctx, s) {
  if (!s.points.length) return
  ctx.save()
  ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'
  ctx.strokeStyle = s.color
  ctx.fillStyle = s.color
  ctx.lineWidth = s.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (s.points.length === 1) {
    const [x, y] = s.points[0]
    ctx.beginPath(); ctx.arc(x, y, s.width / 2, 0, Math.PI * 2); ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(...s.points[0])
    for (let i = 1; i < s.points.length - 1; i++) {
      const [x1, y1] = s.points[i], [x2, y2] = s.points[i + 1]
      ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + y2) / 2)
    }
    ctx.lineTo(...s.points[s.points.length - 1])
    ctx.stroke()
  }
  ctx.restore()
}

/** Render strokes cropped to the ink, as a transparent PNG data URL (or null if empty). */
function exportInk(list) {
  const pts = list.filter((s) => !s.erase).flatMap((s) => s.points.map(([x, y]) => [x, y, s.width]))
  if (!pts.length) return null
  const pad = 12
  const minX = Math.min(...pts.map((p) => p[0] - p[2])) - pad, minY = Math.min(...pts.map((p) => p[1] - p[2])) - pad
  const maxX = Math.max(...pts.map((p) => p[0] + p[2])) + pad, maxY = Math.max(...pts.map((p) => p[1] + p[2])) + pad
  const c = document.createElement('canvas')
  c.width = Math.ceil((maxX - minX) * 2); c.height = Math.ceil((maxY - minY) * 2)
  const ctx = c.getContext('2d')
  ctx.setTransform(2, 0, 0, 2, -minX * 2, -minY * 2)
  list.forEach((st) => paintStroke(ctx, st))
  return c.toDataURL('image/png')
}

export function Write() {
  const { go, draft, setDraft, resetDraft } = useApp()
  const [pen, setPen] = useState(false)
  const [ink, setInk] = useState(INKS[0])
  const [custom, setCustom] = useState('#e0679a')
  const [wheel, setWheel] = useState(false)
  const [size, setSize] = useState(SIZES[1])
  const [eraser, setEraser] = useState(false)
  const [count, setCount] = useState((draft.strokes || []).length) // number of strokes, to enable undo/clear
  const canvas = useRef(null)
  const strokes = useRef(draft.strokes ? [...draft.strokes] : [])
  const save = () => { setCount(strokes.current.length); setDraft({ strokes: [...strokes.current], handwriting: exportInk(strokes.current) }) }
  const current = useRef(null)
  const { replyTo, replyPrompt } = useReply()
  const p = replyPrompt || PROMPTS.find((x) => x.id === draft.promptId) || { title: 'Write freely', category: 'No prompt, just you' }

  const redraw = () => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    strokes.current.forEach((s) => paintStroke(ctx, s))
  }

  useEffect(() => {
    if (!pen || !canvas.current) return
    const c = canvas.current, r = c.getBoundingClientRect(), ctx = c.getContext('2d')
    c.width = r.width * 2; c.height = r.height * 2; ctx.setTransform(2, 0, 0, 2, 0, 0)
    redraw()
  }, [pen])

  const pos = (e) => { const r = canvas.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setWheel(false)
    current.current = { color: ink.color, width: eraser ? size.width * 3 : size.width, erase: eraser, points: [pos(e)] }
    strokes.current.push(current.current)
    redraw()
  }
  const move = (e) => {
    if (!current.current) return
    current.current.points.push(pos(e))
    redraw()
  }
  const up = () => {
    if (!current.current) return
    current.current = null
    save()
  }
  const pad = useRef(null)
  const nudge = () => { if (pad.current && pad.current.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) pad.current.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], { duration: 220, easing: 'ease-in-out' }) }
  const undo = () => { strokes.current.pop(); save(); redraw(); nudge() }
  const clear = () => { strokes.current = []; save(); redraw(); nudge() }

  const dirty = Boolean((draft.text || '').trim()) || count > 0
  const { leave, sheet } = useDiscardGuard(dirty, { onDiscard: resetDraft })

  const tool = (on) => ({ width: 36, height: 36, borderRadius: 18, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--ink)' : 'transparent', color: on ? '#fff' : 'var(--ink)' })

  return (
    <Screen>
      {sheet}
      <div className="screen-body" style={{ paddingBottom: 110 }}>
        <TopBar left={<IconButton icon="back" label="Back" onClick={() => leave(replyTo ? 'reply' : 'prompt')} />} center={<LetterTo />} />
        <Display small sub={p.category}>{p.title}</Display>
        <Segmented label="Write with" options={[{ value: 'type', label: 'Keyboard' }, { value: 'pen', label: 'Handwriting' }]} value={pen ? 'pen' : 'type'} onChange={(v) => setPen(v === 'pen')} />
        <div ref={pad} style={{ flex: 1, position: 'relative', borderRadius: 26, background: 'var(--fill)', overflow: 'hidden' }}>
          {pen ? (
            <>
              <canvas ref={canvas} aria-label="Handwriting area" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }} />
              {!count && <span className="small" style={{ position: 'absolute', left: 18, bottom: 14, pointerEvents: 'none' }}>Write with your finger</span>}
              <div style={{ position: 'absolute', right: 10, top: 10, display: 'flex', gap: 2, background: '#fff', borderRadius: 20, padding: 2, boxShadow: '0 2px 10px rgba(29,29,34,.08)' }}>
                <button aria-label="Eraser" aria-pressed={eraser} onClick={() => setEraser(!eraser)} style={tool(eraser)}><span style={{ display: 'flex', transform: eraser ? 'rotate(-22deg) translateY(-1px)' : 'none', transition: 'transform .35s cubic-bezier(.3,1.6,.4,1)' }}><Icon name="eraser" size={18} /></span></button>
                <button aria-label="Undo last stroke" disabled={!count} onClick={undo} style={{ ...tool(false), opacity: count ? 1 : 0.3 }}><Icon name="undo" size={18} /></button>
                <button aria-label="Clear page" disabled={!count} onClick={clear} style={{ ...tool(false), opacity: count ? 1 : 0.3 }}><Icon name="trash" size={18} /></button>
              </div>
            </>
          ) : (
            <textarea className="field" aria-label="Your answer" value={draft.text ?? ''} onChange={(e) => setDraft({ text: e.target.value })} placeholder="Start anywhere. A sentence is enough." style={{ height: '100%', background: 'transparent', padding: 20, fontFamily: 'var(--serif)', fontSize: 21, lineHeight: 1.45 }} />
          )}
        </div>
        {pen && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexShrink: 0 }}>
            <div role="radiogroup" aria-label="Pen color" style={{ display: 'flex', gap: 6, position: 'relative' }}>
              {INKS.map((c) => {
                const on = !eraser && ink.id === c.id
                return (
                  <button key={c.id} role="radio" aria-checked={on} aria-label={c.label} onClick={() => { setInk(c); setEraser(false); setWheel(false) }}
                    style={{ width: 30, height: 30, borderRadius: 15, border: 'none', padding: 0, background: '#fff', boxShadow: on ? `0 0 0 2px #fff, 0 0 0 4px ${c.color}` : 'inset 0 0 0 1.5px var(--line)', animation: on ? 'selBounce .4s cubic-bezier(.3,.7,.3,1)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow .15s' }}>
                    <span style={{ width: 20, height: 20, borderRadius: 10, background: c.color }} />
                  </button>
                )
              })}
              {(() => {
                const on = !eraser && ink.id === 'custom'
                return (
                  <button role="radio" aria-checked={on} aria-label="Custom color" onClick={() => { setInk({ id: 'custom', label: 'Custom', color: custom }); setEraser(false); setWheel((w) => !w) }}
                    style={{ width: 30, height: 30, borderRadius: 15, border: 'none', padding: 0, background: on ? '#fff' : RAINBOW, boxShadow: on ? `0 0 0 2px #fff, 0 0 0 4px ${custom}` : 'none', animation: on ? 'selBounce .4s cubic-bezier(.3,.7,.3,1)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'box-shadow .15s' }}>
                    {on ? <span style={{ width: 24, height: 24, borderRadius: 12, background: RAINBOW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 16, height: 16, borderRadius: 8, background: custom }} /></span>
                      : <span style={{ width: 12, height: 12, borderRadius: 6, background: '#fff' }} />}
                  </button>
                )
              })()}
              {wheel ? <ColorWheel value={custom} onPick={(c) => { setCustom(c); setInk({ id: 'custom', label: 'Custom', color: c }) }} onClose={() => setWheel(false)} /> : null}
            </div>
            <div role="radiogroup" aria-label="Pen size" style={{ position: 'relative', display: 'flex', gap: 2, background: 'var(--fill)', borderRadius: 18, padding: 2 }}>
              {/* white pill that slides to the chosen size */}
              <span aria-hidden="true" style={{ position: 'absolute', left: 2, top: 2, width: 32, height: 32, borderRadius: 16, background: '#fff', boxShadow: '0 1px 3px rgba(29,29,34,.12)', transform: `translateX(${Math.max(0, SIZES.findIndex((x) => x.id === size.id)) * 34}px)`, transition: 'transform .35s cubic-bezier(.3,1.3,.5,1)' }} />
              {SIZES.map((s) => {
                const on = size.id === s.id
                return (
                  <button key={s.id} role="radio" aria-checked={on} aria-label={s.label} onClick={() => setSize(s)}
                    style={{ position: 'relative', width: 32, height: 32, borderRadius: 16, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ animation: on ? 'selBounce .4s cubic-bezier(.3,.7,.3,1)' : 'none', width: s.width + 3, height: s.width + 3, borderRadius: '50%', background: eraser ? 'var(--ink-3)' : ink.color }} />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Dock>
        {!replyTo && <button className="pill outline" onClick={() => leave('prompt')}>Skip</button>}
        <button className="pill" style={{ flex: 1 }} onClick={() => { setDraft({ kind: 'text', promptId: PROMPTS.some((x) => x.id === draft.promptId) ? draft.promptId : null }); go('paper') }}>Next</button>
      </Dock>
    </Screen>
  )
}

/** The written part of a letter: typed text and/or the handwritten page (cropped to the ink). */
function WrittenPage({ draft, max = 90, fontSize = 17 }) {
  const text = (draft.text || '').trim()
  const ink = draft.handwriting
  if (!text && !ink) return <span style={{ color: 'var(--ink-3)' }}>{'Jun made bún riêu and it tasted almost like yours…'.slice(0, max)}</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%', minHeight: 0 }}>
      {text ? <span style={{ fontSize }}>{text.slice(0, ink ? Math.round(max / 2) : max)}{text.length > max ? '…' : ''}</span> : null}
      {ink ? <img src={ink} alt="Your handwriting" style={{ flex: 1, minHeight: 0, width: '100%', objectFit: 'contain', objectPosition: 'left top' }} /> : null}
    </div>
  )
}

/* ---------- Pick your paper ---------- */
const SPOTS = [[152, 119], [68, 127], [182, 41], [116, 83]]
const BASE = 56, MAX_STICKERS = 12
// Older drafts stored abstract shapes by name (or as {look, x, y}); turn them into the current sticker shape.
const toSticker = (st, i) => {
  if (typeof st === 'string') return { id: `s${i}-${st}`, kind: 'shape', v: st, x: SPOTS[i % 4][0], y: SPOTS[i % 4][1], r: i % 2 ? 10 : -8, s: 1 }
  if (!st.kind) return { id: st.id, kind: 'shape', v: st.look, x: st.x + 32, y: st.y + 27, r: st.r || 0, s: 1 }
  return st
}
const stickerName = (st) => (st.name ? st.name : st.kind === 'bubble' ? `“${st.v}”` : st.kind === 'heart' ? 'heart' : st.kind === 'pet' ? 'pet photo' : st.kind === 'emoji' ? st.v : 'shape')

export function Paper() {
  const { go, draft, setDraft } = useApp()
  const paper = draft.paper || 'postcard'
  const [flips, setFlips] = useState(0)
  const area = useRef(null)
  const [items, setItems] = useState(() => (draft.stickers || []).map(toSticker))
  const [selected, setSelected] = useState(null)
  const [menu, setMenu] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [cat, setCat] = useState('faces')
  const [pets, setPets] = useState(() => draft.pets || [])
  const grab = useRef(null)
  const latest = useRef(items)
  latest.current = items
  const commit = (next) => { setItems(next); setDraft({ stickers: next }) }
  const bounds = () => { const r = area.current.getBoundingClientRect(); return { w: r.width, h: r.height, left: r.left, top: r.top } }
  const fresh = useRef(new Set()) // stickers added this visit get the drop-in; ones from a saved draft just sit there
  const add = (art) => {
    if (items.length >= MAX_STICKERS) return
    const { w, h } = bounds()
    // Drop it in the most open spot: try a few random places and keep the one farthest from other stickers.
    let best = null
    for (let k = 0; k < 14; k++) {
      const c = { x: 40 + Math.random() * (w - 80), y: 40 + Math.random() * (h - 80) }
      const gap = items.length ? Math.min(...items.map((o) => Math.hypot(o.x - c.x, o.y - c.y))) : 999
      if (!best || gap > best.gap) best = { ...c, gap }
    }
    const st = { id: `s${Date.now()}`, ...art, x: best.x, y: best.y, r: Math.round(Math.random() * 24 - 12), s: 1 }
    fresh.current.add(st.id)
    commit([...items, st])
    setSelected(st.id); setMenu(null)
  }
  const remove = (id) => { commit(items.filter((s) => s.id !== id)); setSelected(null); setMenu(null) }
  const update = (id, patch) => setItems((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  // Gestures on a sticker:
  //   one finger / mouse – drag to move; a tap without moving opens the Delete / Cancel menu
  //   corner handle      – drag around the center to resize and turn
  //   two fingers        – pinch to resize, twist to turn, move both to reposition (the 2nd finger may land beside the sticker)
  const pts = useRef(new Map())
  const track = (e) => pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  const startPinch = (id) => {
    const st = latest.current.find((x) => x.id === id)
    const [p, q] = [...pts.current.values()]
    if (!st || !p || !q) return
    grab.current = { mode: 'pinch', id, moved: true, d0: Math.hypot(q.x - p.x, q.y - p.y) || 1, a0: Math.atan2(q.y - p.y, q.x - p.x), m0: { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }, s0: st.s || 1, r0: st.r, x0: st.x, y0: st.y }
    setMenu(null); setDragId(id)
  }
  const down = (e, st) => {
    e.stopPropagation()
    track(e)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    if (pts.current.size >= 2 && grab.current) { startPinch(grab.current.id); return }
    const { left, top } = bounds()
    grab.current = { mode: 'move', id: st.id, dx: e.clientX - left - st.x, dy: e.clientY - top - st.y, sx: e.clientX, sy: e.clientY, moved: false }
    setMenu(null)
    setSelected(st.id); setDragId(st.id)
  }
  // A second finger that lands on the card next to the held sticker turns the gesture into a pinch.
  const downArea = (e) => {
    if (grab.current && pts.current.size === 1) {
      track(e)
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
      startPinch(grab.current.id)
      return
    }
    setSelected(null); setMenu(null)
  }
  const downHandle = (e, st) => {
    e.stopPropagation()
    track(e)
    const { left, top } = bounds()
    const cx = left + st.x, cy = top + st.y
    grab.current = { mode: 'turn', id: st.id, cx, cy, a0: Math.atan2(e.clientY - cy, e.clientX - cx), d0: Math.hypot(e.clientX - cx, e.clientY - cy) || 1, r0: st.r, s0: st.s || 1, moved: true }
    setMenu(null)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    setDragId(st.id)
  }
  const clampScale = (v) => Math.max(0.5, Math.min(3, v))
  const move = (e) => {
    const g = grab.current
    if (!g || g.mode === 'done' || !pts.current.has(e.pointerId)) return
    track(e)
    if (g.mode === 'pinch') {
      if (pts.current.size < 2) return
      const [p, q] = [...pts.current.values()]
      const { w, h } = bounds()
      const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }
      update(g.id, {
        s: clampScale(g.s0 * Math.hypot(q.x - p.x, q.y - p.y) / g.d0),
        r: Math.round(g.r0 + (Math.atan2(q.y - p.y, q.x - p.x) - g.a0) * 180 / Math.PI),
        x: Math.max(4, Math.min(w - 4, g.x0 + m.x - g.m0.x)),
        y: Math.max(4, Math.min(h - 4, g.y0 + m.y - g.m0.y)),
      })
      return
    }
    if (g.mode === 'turn') {
      const a = Math.atan2(e.clientY - g.cy, e.clientX - g.cx)
      update(g.id, { r: Math.round(g.r0 + (a - g.a0) * 180 / Math.PI), s: clampScale(g.s0 * Math.hypot(e.clientX - g.cx, e.clientY - g.cy) / g.d0) })
      return
    }
    if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 4) g.moved = true
    if (!g.moved) return
    const { w, h, left, top } = bounds()
    update(g.id, { x: Math.max(4, Math.min(w - 4, e.clientX - left - g.dx)), y: Math.max(4, Math.min(h - 4, e.clientY - top - g.dy)) })
  }
  const up = (e) => {
    if (e && e.pointerId !== undefined) pts.current.delete(e.pointerId)
    const g = grab.current
    if (!g) return
    // During a pinch, lifting one finger ends the gesture; the other finger can then be lifted freely.
    if (g.mode === 'pinch' && pts.current.size > 0) { grab.current = { ...g, mode: 'done' }; return }
    if (pts.current.size > 0 && g.mode !== 'done') return
    grab.current = null; setDragId(null)
    if (g.mode === 'done' || g.moved) { setDraft({ stickers: latest.current }); return }
    setMenu(g.id)
  }
  const addPet = async (e) => {
    const file = e.target.files && e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const v = await petSticker(file)
      const next = [...pets, v].slice(-6)
      setPets(next); setDraft({ pets: next })
      add({ kind: 'pet', v })
    } catch {}
  }
  const current = STICKER_CATS.find((c) => c.id === cat)

  return (
    <Screen>
      <div className="screen-body scroll" style={{ paddingBottom: 110 }}>
        <TopBar left={<IconButton icon="back" label="Back" onClick={() => go('write')} />} center={<LetterTo />} />
        <Display small>Pick your paper</Display>
        <Segmented label="Paper" options={[{ value: 'postcard', label: 'Postcard' }, { value: 'letter', label: 'Letter' }]} value={paper} onChange={(v) => { if (v !== paper) setFlips((n) => n + 1); setDraft({ paper: v }) }} />

        <div ref={area} onPointerDown={downArea} onPointerMove={move} onPointerUp={up} onPointerCancel={up} style={{ position: 'relative', height: 200, borderRadius: 24, background: 'radial-gradient(90% 80% at 18% 12%, rgba(217,205,251,.9) 0%, rgba(217,205,251,0) 60%), radial-gradient(80% 80% at 88% 92%, rgba(207,227,251,.9) 0%, rgba(207,227,251,0) 60%), linear-gradient(135deg, #efe8fd 0%, #fbe8f1 55%, #e5eefc 100%)', boxShadow: '0 24px 60px rgba(120,110,200,.18)', padding: 16, flexShrink: 0, touchAction: 'none' }}>
          <div key={paper} style={{ height: '100%', transformOrigin: '50% 50%', animation: flips ? 'flipIn .5s cubic-bezier(.2,.8,.2,1) both' : 'none' }}>
          {paper === 'postcard' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', height: '100%', background: '#fff', borderRadius: 14 }}>
              <div style={{ padding: '14px 16px', fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.35, borderRight: '1.5px solid var(--line)', overflow: 'hidden', minHeight: 0 }}><WrittenPage draft={draft} /></div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ width: 40, height: 46, borderRadius: 4, border: '2px dashed var(--line)' }} />
                <div style={{ alignSelf: 'stretch', height: 1.5, background: 'var(--line)', marginTop: 18 }} />
                <span className="small" style={{ alignSelf: 'stretch', color: 'var(--ink-2)' }}>to Mom</span>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', background: '#fff', borderRadius: 14, padding: '16px 18px', fontFamily: 'var(--serif)', fontSize: 17, lineHeight: 1.45, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}><span>Dear Mom,</span><div style={{ flex: 1, minHeight: 0 }}><WrittenPage draft={draft} max={140} /></div></div>
          )}
          </div>
          {items.map((st) => {
            const lifted = dragId === st.id
            const sel = selected === st.id
            const sc = st.s || 1
            return (
              <div key={st.id} role="button" tabIndex={0} aria-label={`${stickerName(st)} sticker. Drag to move, tap for options.`}
                onPointerDown={(e) => down(e, st)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
                style={{ position: 'absolute', left: st.x - BASE / 2, top: st.y - BASE / 2, width: BASE, height: BASE, zIndex: lifted ? 6 : sel ? 5 : 2, cursor: lifted ? 'grabbing' : 'grab', touchAction: 'none', transform: `rotate(${st.r}deg) scale(${sc * (lifted && grab.current && grab.current.mode === 'move' ? 1.08 : 1)})`, transition: lifted ? 'none' : 'transform .18s ease' }}>
                {/* Lands like a sticker being pressed on: drops in, squashes, settles. */}
                <span style={{ display: 'block', animation: fresh.current.has(st.id) ? 'stickDrop .55s cubic-bezier(.3,.7,.3,1) both' : 'none' }}><StickerArt st={st} size={BASE} /></span>
                {/* Kept mounted while turning so the browser keeps tracking the drag on the handle. */}
                {sel ? (
                  <>
                    <span aria-hidden="true" style={{ position: 'absolute', inset: -4, borderRadius: 12, border: `${1.5 / sc}px dashed rgba(29,29,34,.35)`, pointerEvents: 'none', opacity: lifted ? 0.5 : 1 }} />
                    <span role="button" aria-label="Drag to resize and rotate" onPointerDown={(e) => downHandle(e, st)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
                      style={{ position: 'absolute', right: -13, bottom: -13, width: 24, height: 24, borderRadius: 12, background: '#fff', color: 'var(--ink)', boxShadow: '0 1px 4px rgba(29,29,34,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 / sc})`, cursor: 'nwse-resize', touchAction: 'none', opacity: lifted && !(grab.current && grab.current.mode === 'turn') ? 0 : 1 }}>
                      <Icon name="refresh" size={13} stroke={2} />
                    </span>
                  </>
                ) : null}
              </div>
            )
          })}
          {(() => {
            const st = items.find((x) => x.id === menu)
            if (!st) return null
            const half = (BASE / 2) * (st.s || 1)
            const below = st.y - half < 46
            return (
              <div role="menu" aria-label="Sticker options" onPointerDown={(e) => e.stopPropagation()} className="rise"
                style={{ position: 'absolute', left: Math.max(0, Math.min(st.x - 86, (area.current ? area.current.clientWidth : 342) - 172)), top: below ? st.y + half + 8 : st.y - half - 46, zIndex: 8, display: 'flex', gap: 4, padding: 4, background: '#fff', borderRadius: 14, boxShadow: '0 8px 24px rgba(29,29,34,.16)', animationDuration: '.25s' }}>
                <button role="menuitem" onClick={() => remove(st.id)} style={{ height: 32, padding: '0 14px', borderRadius: 10, border: 'none', background: '#fdecec', color: '#c2402f', fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="trash" size={14} />Delete</button>
                <button role="menuitem" onClick={() => setMenu(null)} style={{ height: 32, padding: '0 14px', borderRadius: 10, border: 'none', background: 'var(--fill)', color: 'var(--ink)', fontSize: 13, fontWeight: 500 }}>Cancel</button>
              </div>
            )
          })()}
        </div>

        <p className="small" style={{ textAlign: 'center' }}>Drag to move. Pinch or use the corner to resize and turn.</p>

        {/* Sticker drawer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <div className="scroll" role="tablist" aria-label="Sticker categories" style={{ display: 'flex', gap: 6, overflowX: 'auto', margin: '0 -24px', padding: '2px 24px' }}>
            {STICKER_CATS.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={(e) => { setCat(c.id); e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }) }}
                style={{ flexShrink: 0, height: 32, padding: '0 13px', borderRadius: 16, border: 'none', fontSize: 13, fontWeight: cat === c.id ? 500 : 400, background: cat === c.id ? 'var(--ink)' : 'var(--fill)', color: cat === c.id ? '#fff' : 'var(--ink-2)', transition: 'background .2s, color .2s' }}>{c.label}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
            {cat === 'mypet' ? (
              <>
                <label style={{ gridColumn: 'span 2', height: 52, borderRadius: 14, border: '1.5px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
                  <Icon name="plus" size={16} />Add photo
                  <input type="file" accept="image/*" onChange={addPet} style={{ display: 'none' }} />
                </label>
                {pets.map((v, i) => (
                  <button key={i} aria-label="Add your pet sticker" onClick={() => add({ kind: 'pet', v })} style={{ height: 52, borderRadius: 14, border: 'none', background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <StickerArt st={{ kind: 'pet', v }} size={40} />
                  </button>
                ))}
                {!pets.length ? <span className="small" style={{ gridColumn: 'span 4', alignSelf: 'center', color: 'var(--ink-3)' }}>Turn a photo of your pet into a sticker.</span> : null}
              </>
            ) : current.items.map((it, i) => (
              <button key={i} aria-label={`Add ${stickerName(it)} sticker`} onClick={() => add(it)} disabled={items.length >= MAX_STICKERS}
                style={{ height: 52, borderRadius: 14, border: 'none', background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, opacity: items.length >= MAX_STICKERS ? 0.4 : 1 }}>
                <StickerArt st={it} size={40} flat />
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dock><button className="pill block" onClick={() => go('caption')}>Choose a stamp</button></Dock>
    </Screen>
  )
}

/* ---------- Caption + stamp ---------- */
const kind0 = (d) => (d.handwriting ? 'A handwritten note' : 'A few words')
// A small look at what's going in the envelope: the photo as a postcard, the voice memo, or the note itself.
function InsidePreview({ draft, kind, to, onText }) {
  const serif = { fontFamily: 'var(--serif)', letterSpacing: '-0.01em' }
  const card = { background: '#fffdf9', borderRadius: 6, boxShadow: '0 1px 0 rgba(29,29,34,.04), 0 10px 24px rgba(29,29,34,.08)', marginBottom: 8 }
  if (kind === 'photo') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px' }}>
        <div style={{ ...card, background: '#fff', width: 210, padding: '8px 8px 12px', transform: 'rotate(-1.5deg)' }}>
          {draft.photo ? <img src={photoUrl(draft.photo)} alt="Your photo" style={{ display: 'block', width: '100%', height: 150, objectFit: 'cover', borderRadius: 2 }} />
            : <Placeholder style={{ height: 150, borderRadius: 2 }} />}
          <span style={{ ...serif, display: 'block', fontStyle: 'italic', fontSize: 14, lineHeight: 1.3, color: draft.caption ? 'var(--ink-2)' : 'var(--ink-3)', marginTop: 8, textAlign: 'center' }}>{draft.caption || 'Your caption goes here'}</span>
        </div>
      </div>
    )
  }
  if (kind === 'voice') {
    const secs = draft.seconds || 42
    return (
      <div style={{ ...card, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ ...serif, fontSize: 16 }}>Dear {to},</span>
        <span style={{ display: 'block', background: 'var(--fill)', borderRadius: 26, padding: '4px 14px 4px 4px' }}>
          <VoicePlayer src={draft.audio} seconds={secs} />
        </span>
        {draft.caption ? <span style={{ ...serif, fontStyle: 'italic', fontSize: 14, color: 'var(--ink-2)' }}>{draft.caption}</span> : null}
      </div>
    )
  }
  return (
    <div style={{ ...card, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 23px, #f0ece4 23px 24px)', backgroundPosition: '0 40px' }}>
      <span style={{ ...serif, fontSize: 16 }}>Dear {to},</span>
      {draft.handwriting ? <img src={draft.handwriting} alt="Your handwritten note" style={{ width: '100%', maxHeight: 110, objectFit: 'contain', objectPosition: 'left' }} />
        : onText
          ? <textarea aria-label="Your letter" className="inside-edit" value={draft.text || ''} placeholder="Write your note" rows={Math.max(2, (draft.text || '').split('\n').reduce((a, x) => a + Math.max(1, Math.ceil(x.length / 34)), 0))}
              onChange={(e) => onText(e.target.value)} style={{ ...serif, fontSize: 15, lineHeight: '24px', color: 'var(--ink-2)' }} />
          : <span style={{ ...serif, fontSize: 15, lineHeight: '24px', color: 'var(--ink-2)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{draft.text || 'Your note'}</span>}
    </div>
  )
}

const calmMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

export function Caption() {
  const { go, draft, setDraft, resetDraft, prompt, setLetters, setSentKind } = useApp()
  const { leave, sheet } = useDiscardGuard(true, { onDiscard: resetDraft })
  const { replyTo, to, replyPrompt } = useReply()
  const p = replyPrompt || PROMPTS.find((x) => x.id === draft.promptId) || (draft.promptId === null ? { title: kind0(draft) } : prompt)
  const kind = draft.kind || 'photo'
  const stamp = STAMPS.find((s) => s.id === draft.stamp) || STAMPS[0]

  const [sealing, setSealing] = useState(false)
  // The envelope shows the stamp only once the picked one has flown over and landed.
  const [landedId, setLandedId] = useState(stamp.id)
  const landed = STAMPS.find((x) => x.id === landedId) || stamp
  const stampLook = landed.look ? LOOKS[landed.look] : null
  const envBox = useRef(null)
  const [flight, setFlight] = useState(null)
  const flyer = useRef(null)
  const pickStamp = (s, e) => {
    if (s.id === stamp.id) return
    setDraft({ stamp: s.id })
    const tile = e.currentTarget.querySelector('.postage'), env = envBox.current, scr = env && env.closest('.screen')
    if (!s.look || !tile || !env || !scr || calmMotion()) { setLandedId(s.id); return }
    const sr = scr.getBoundingClientRect(), tr = tile.getBoundingClientRect(), er = env.getBoundingClientRect()
    const k = er.width / 202
    // Rects are in page pixels; the phone may be zoomed to fit the window, so convert back to the screen's own pixels.
    const z = sr.width / (scr.offsetWidth || sr.width) || 1
    const box = (r) => ({ x: r.x / z, y: r.y / z, w: r.w / z, h: r.h / z })
    setFlight({ n: Date.now(), s, from: box({ x: tr.left - sr.left, y: tr.top - sr.top, w: tr.width, h: tr.height }), to: box({ x: er.right - sr.left - 14 * k - 32 * k, y: er.bottom - sr.top - 12 * k - 38 * k, w: 32 * k, h: 38 * k }) })
  }
  useLayoutEffect(() => {
    if (!flight || !flyer.current) return
    const { from: a, to: b } = flight
    const mid = { x: (a.x + b.x) / 2 + 20, y: Math.min(a.y, b.y) - 60 }
    const box = (r, extra) => ({ left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px`, ...extra })
    flyer.current.animate([
      box(a, { transform: 'rotate(-4deg) scale(1)', filter: 'drop-shadow(0 2px 4px rgba(29,29,34,.15))', offset: 0 }),
      box({ x: mid.x, y: mid.y, w: (a.w + b.w) / 2, h: (a.h + b.h) / 2 }, { transform: 'rotate(-12deg) scale(1.25)', filter: 'drop-shadow(0 14px 18px rgba(29,29,34,.22))', offset: 0.5 }),
      box(b, { transform: 'rotate(3deg) scale(1.18)', filter: 'drop-shadow(0 6px 10px rgba(29,29,34,.2))', offset: 0.8 }),
      box(b, { transform: 'rotate(0deg) scale(.94)', filter: 'drop-shadow(0 1px 2px rgba(29,29,34,.15))', offset: 0.9 }),
      box(b, { transform: 'rotate(0deg) scale(1)', filter: 'drop-shadow(0 1px 2px rgba(29,29,34,.15))', offset: 1 }),
    ], { duration: 640, easing: 'cubic-bezier(.4,0,.3,1)', fill: 'forwards' })
    // the thud: the envelope gives a little under the stamp
    const t1 = setTimeout(() => envBox.current && envBox.current.animate([{ transform: 'scale(1)' }, { transform: 'scale(.975) translateY(2px)' }, { transform: 'scale(1.008)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' }), 520)
    const t2 = setTimeout(() => setLandedId(flight.s.id), 600)
    const t3 = setTimeout(() => setFlight((f) => (f && f.n === flight.n ? null : f)), 660)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [flight])
  // Changing envelope color washes the new color in from the swatch's side, over the old envelope.
  const [wash, setWash] = useState({ n: 0, from: null, x: '50%' })
  useEffect(() => {
    if (!wash.from) return
    const t = setTimeout(() => setWash((w) => ({ ...w, from: null })), 600)
    return () => clearTimeout(t)
  }, [wash.n])
  const pickEnvelope = (id, i) => {
    if (id === draft.envelope) return
    setWash((w) => ({ n: w.n + 1, from: draft.envelope, x: `${((i + 0.5) / ENVELOPES.length) * 100}%` }))
    setDraft({ envelope: id })
  }

  const send = () => {
    setLetters((ls) => [{ id: `me-${Date.now()}`, from: 'Me', mine: true, date: 'Today', kind, prompt: replyTo ? `Reply to “${replyTo.title}”` : p.title, title: draft.caption || (replyTo ? `Re: ${replyTo.title}` : p.title), body: draft.text || draft.caption || '', handwriting: kind === 'text' ? draft.handwriting : null, photo: kind === 'photo' ? draft.photo : undefined, audio: kind === 'voice' ? draft.audio || null : undefined, seconds: kind === 'voice' ? draft.seconds : undefined, caption: draft.caption || undefined, stamp: stamp.id, envelope: draft.envelope }, ...ls])
    setSentKind(replyTo ? 'reply' : 'letter')
    go('sent')
  }
  const sealT = useRef(0)
  const seal = () => {
    if (sealing) return
    if (calmMotion()) { send(); return }
    setSealing(true)
    sealT.current = setTimeout(send, 1300)
  }
  const skipSeal = () => { if (sealT.current) { clearTimeout(sealT.current); sealT.current = 0; send() } }

  return (
    <Screen>
      {sheet}
      {sealing ? <button className="skip-tap" aria-label="Skip to sent" onClick={skipSeal} /> : null}
      <div className="screen-body scroll" style={{ paddingBottom: 110 }}>
        <TopBar left={<IconButton icon="back" label="Back" onClick={() => go(kind === 'text' ? 'paper' : 'capture')} />} right={<button className="pill outline small" onClick={() => go(kind === 'text' ? 'paper' : 'capture')}>{kind === 'text' ? 'Edit' : 'Retake'}</button>} />
        <Display small sub="Pick an envelope and a stamp.">Seal it with a stamp</Display>
        {flight ? (
          <span ref={flyer} key={flight.n} aria-hidden="true" className="postage" style={{ position: 'absolute', zIndex: 40, pointerEvents: 'none', left: flight.from.x, top: flight.from.y, width: flight.from.w, height: flight.from.h, padding: 3, boxSizing: 'border-box', '--r': '2px' }}>
            {flight.s.art ? <img src={photoUrl(flight.s.art)} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}><Shape look={LOOKS[flight.s.look]} /></span>}
          </span>
        ) : null}

        <div style={{ position: 'relative', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: '-10px 10px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(201,184,245,.25), rgba(255,255,255,0))' }} />
          <div style={{ position: 'relative' }}>
            {wash.from && !sealing ? <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}><Envelope color={wash.from} stamp={stampLook} stampArt={landed.art ? photoUrl(landed.art) : null} width={262} /></div> : null}
            <div key={wash.n} ref={envBox} style={{ position: 'relative', '--wx': wash.x, animation: wash.n ? 'washIn .55s cubic-bezier(.4,0,.2,1) backwards' : 'none' }}>
              <Envelope key={sealing ? 'sealing' : 'open'} color={draft.envelope} stamp={stampLook} stampArt={landed.art ? photoUrl(landed.art) : null} sealing={sealing} width={262} style={{ transform: sealing ? 'scale(1.03)' : 'none', transition: 'transform .4s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <span className="label">Envelope</span>
          <div role="radiogroup" aria-label="Envelope color" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {ENVELOPES.map((e, i) => {
              const on = draft.envelope === e.id
              return (
                <button key={e.id} role="radio" aria-checked={on} aria-label={e.label} disabled={sealing} onClick={() => pickEnvelope(e.id, i)}
                  style={{ width: 44, height: 44, borderRadius: 22, border: 'none', padding: 0, background: '#fff', boxShadow: on ? `0 0 0 2px #fff, 0 0 0 4px var(--ink)` : 'inset 0 0 0 1.5px var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 16, background: `radial-gradient(circle at 30% 30%, ${e.c[0]}, ${e.c[1]} 60%, ${e.c[3]})` }} />
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <span className="label">Stamp</span>
          <div role="radiogroup" aria-label="Stamp" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {STAMPS.map((s) => {
              const on = s.id === stamp.id
              return (
                <button key={s.id} role="radio" aria-checked={on} disabled={sealing} onClick={(e) => pickStamp(s, e)}
                  style={{ border: 'none', background: 'var(--fill)', borderRadius: 16, padding: '8px 6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: on ? 'inset 0 0 0 2px var(--ink)' : 'none', color: 'var(--ink-2)' }}>
                  {s.look ? (
                    <span className="postage-wrap" style={{ display: 'block', transform: on ? 'rotate(-4deg)' : 'none', transition: 'transform .2s ease', filter: 'drop-shadow(0 2px 4px rgba(29,29,34,.12))' }}>
                      <span className="postage" style={{ display: 'block', width: 52, height: 60, padding: 4, '--r': '2.5px' }}>
                        {s.art ? <img src={photoUrl(s.art)} alt="" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}><Shape look={LOOKS[s.look]} /></span>}
                      </span>
                    </span>
                  ) : <span style={{ width: 52, height: 60, borderRadius: 4, border: '1.5px dashed var(--line)', boxSizing: 'border-box' }} />}
                  <span style={{ fontSize: 11, lineHeight: 1.2, textAlign: 'center' }}>{s.label}</span>
                </button>
              )
            })}
          </div>
          {stamp.cue && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--fill)', borderRadius: 16, padding: '10px 14px' }}>
              <Icon name="sparkle" size={16} />
              <span className="small" style={{ color: 'var(--ink-2)' }}>Mom will see a hint: “{stamp.cue}”</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="label">Inside</span>
            {kind === 'text' && !draft.handwriting ? <span className="small">Tap to edit</span> : null}
          </div>
          <InsidePreview draft={draft} kind={kind} to={to} onText={kind === 'text' ? (v) => setDraft({ text: v }) : undefined} />
          <textarea aria-label="Caption" className="field" rows="2" value={draft.caption} placeholder="Add a caption (optional)" onChange={(e) => setDraft({ caption: e.target.value })} />
        </div>
      </div>
      <Dock><button className="pill block" onClick={seal} disabled={sealing}><Icon name="envelope" size={18} />{sealing ? 'Sealing…' : 'Seal it'}</button></Dock>
    </Screen>
  )
}

/* ---------- Sent ---------- */
export const SENT_DOTS = [
  [38, 150, '#f7b8d2', 0], [60, 222, '#c9b8f5', 0.3], [52, 218, '#e6e0fa', 0.9], [44, 288, '#f7b8d2', 0.6], [56, 292, '#ecebf4', 1.2],
  [42, 362, '#f7b8d2', 0.2], [76, 360, '#c9b8f5', 0.8], [74, 434, '#c9b8f5', 1.1], [310, 186, '#c9b8f5', 0.4], [314, 182, '#fbd3e2', 1],
  [336, 254, '#e6e0fa', 0.5], [332, 258, '#fbd3e2', 0.1], [314, 324, '#c9b8f5', 0.7], [310, 328, '#e6e0fa', 1.3], [336, 398, '#c9b8f5', 0.35], [340, 394, '#fbd3e2', 0.95],
]

// Sparkles left behind along the envelope's flight path: [x from center, y, color, delay].
export const SENT_PATH = 'M100 120 C 150 110, 190 40, 220 -40 S 270 -200, 290 -240'
export const SENT_SPARKS = [
  [14, 112, '#f7b8d2', 1.0], [38, 100, '#c9b8f5', 1.08], [60, 82, '#fbd3e2', 1.16], [78, 58, '#e6e0fa', 1.24],
  [94, 32, '#c9b8f5', 1.32], [108, 6, '#f7b8d2', 1.4], [122, -24, '#c9b8f5', 1.48], [138, -58, '#fbd3e2', 1.56],
]

export function Sent() {
  const { go, draft, resetDraft, sentKind } = useApp()
  const { to } = useReply()
  const stamp = STAMPS.find((s) => s.id === draft.stamp)
  const line = sentKind === 'reply'
    ? `Your reply is on its way to ${to}. They’ll open it when they’re ready.`
    : `It’s on its way to ${to}. They’ll open it when they’re ready.`
  return (
    <Screen>
      {SENT_DOTS.map(([x, y, c, d], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: x, top: y, width: 5, height: 5, borderRadius: 3, background: c, animation: `twinkle 1.8s ease-in-out ${d}s infinite` }} />
      ))}
      <div className="screen-body" style={{ alignItems: 'center', paddingTop: 104 }}>
        <div style={{ position: 'relative', width: 'min(340px, 100%)', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(201,184,245,.22), rgba(255,255,255,0))' }} />
          {/* The path it flew: a dotted line that draws itself behind the envelope and stays as a trace. */}
          <svg aria-hidden="true" width="260" height="240" viewBox="0 0 260 240" style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -100, overflow: 'visible', pointerEvents: 'none' }}>
            <defs>
              <mask id="sent-trail" maskUnits="userSpaceOnUse" x="-50" y="-300" width="420" height="500">
                <path d={SENT_PATH} pathLength="1" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="1 1" style={{ strokeDashoffset: 0, animation: 'trailDraw 1s cubic-bezier(.5,0,.3,1) .95s backwards' }} />
              </mask>
            </defs>
            <path d={SENT_PATH} mask="url(#sent-trail)" fill="none" stroke="#c9b8f5" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.5 9" opacity=".85" />
          </svg>
          {SENT_SPARKS.map(([x, y, c, d], i) => (
            <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: y, width: 6, height: 6, borderRadius: 3, background: c, opacity: 0, animation: `sparkTrail .9s ease-out ${d}s both` }} />
          ))}
          <Envelope color={draft.envelope} stamp={stampFace(stamp)} width={202} style={{ animation: 'flyAway 2s cubic-bezier(.5,0,.3,1) both' }} />
        </div>
        <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--serif)', fontSize: 54, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, animation: 'settleIn .6s cubic-bezier(.2,.8,.2,1) 1.6s both' }}>Sent!</h1>
        <p className="body" style={{ textAlign: 'center', maxWidth: 270, marginTop: 8, fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.35, animation: 'settleIn .6s cubic-bezier(.2,.8,.2,1) 1.75s both' }}>{line}</p>
      </div>
      <Dock><button className="pill block" onClick={() => { resetDraft(); go('home') }}>Back home</button></Dock>
    </Screen>
  )
}

/* ---------- Write back (start of a reply) ---------- */
const REPLY_MODES = [
  { id: 'text', label: 'Words', icon: 'text', sub: 'Type it or write it by hand' },
  { id: 'voice', label: 'Voice memo', icon: 'voice', sub: 'Let them hear you' },
  { id: 'photo', label: 'Photo', icon: 'photo', sub: 'Show them a little of your day' },
]
// What to suggest first, based on what the sender asked for.
const SUGGEST_FOR = { listen: 'voice', cheer: 'text', advice: 'text', support: 'voice', space: 'text', distract: 'photo', home: 'photo' }

export function Reply() {
  const { go, openLetter: l, setDraft, resetDraft } = useApp()
  const stamp = STAMPS.find((s) => s.id === l.stamp)
  const look = stampFace(stamp)
  const suggested = (stamp && SUGGEST_FOR[stamp.id]) || 'text'
  // Soft tint of the sender's stamp colors, used to tie the suggestion to their need.
  const tint = look ? `linear-gradient(100deg, ${look.c[0]}38, ${look.c[1]}4d)` : 'var(--fill)'
  const edge = look ? `${look.c[0]}66` : 'transparent'

  const start = (mode) => {
    resetDraft()
    setDraft({ replyTo: l.id, promptId: null, kind: mode })
    go(mode === 'text' ? 'write' : 'capture')
  }

  return (
    <Screen>
      <div className="screen-body scroll" style={{ paddingBottom: 40 }}>
        <TopBar left={<IconButton icon="back" label="Back to the letter" onClick={() => go('read')} />} center={<span className="small">Reply to <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{l.from}</b></span>} />
        <Display small>Write back</Display>

        <div style={{ background: '#fffdf9', borderRadius: 8, padding: '14px 16px', boxShadow: '0 1px 0 rgba(29,29,34,.04), 0 12px 28px rgba(29,29,34,.08)', display: 'flex', gap: 14, alignItems: 'flex-start', transform: 'rotate(-.8deg)', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="label">{l.date} · from {l.from}</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.body}</span>
          </div>
          <span style={{ width: 38, height: 46, background: '#fff', padding: 3, boxSizing: 'border-box', borderRadius: 3, transform: 'rotate(4deg)', boxShadow: '0 2px 6px rgba(29,29,34,.12)', flexShrink: 0 }}>
            {look ? <span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 2 }}><Shape look={look} /></span> : null}
          </span>
        </div>

        {stamp && stamp.cue && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'transparent', border: `1.5px solid ${look ? `${look.c[0]}a6` : '#c3b2f3'}`, borderRadius: 16, padding: '11px 14px' }}>
            <Icon name="sparkle" size={16} style={{ marginTop: 2, flexShrink: 0, color: look ? look.c[0] : '#8f75e6' }} />
            <span className="small" style={{ color: 'var(--ink-2)' }}>{l.from} stamped this “{stamp.label.toLowerCase()}”. {stamp.cue}</span>
          </div>
        )}

        <span className="label" style={{ marginTop: 4 }}>Answer with</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...REPLY_MODES].sort((a, b) => (a.id === suggested ? -1 : b.id === suggested ? 1 : 0)).map((m) => (
            <button key={m.id} onClick={() => start(m.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 64, borderRadius: 20, border: 'none', padding: m.id === suggested ? '14px 12px 14px 16px' : '12px 14px 12px 16px', textAlign: 'left', background: m.id === suggested ? tint : 'var(--fill)', boxShadow: m.id === suggested ? `inset 0 0 0 1.5px ${edge}` : 'none', color: 'var(--ink)' }}>
              <Icon name={m.icon} size={22} />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap' }}>{m.label}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{m.sub}</span>
              </span>
              {m.id === suggested
                ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 500, background: 'rgba(255,255,255,.8)', borderRadius: 11, padding: '2px 8px 2px 2px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {look ? <span style={{ width: 16, height: 16, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}><Shape look={look} /></span> : null}
                    Suggested{stamp && stamp.look ? ` for ${stamp.label.toLowerCase()}` : ''}
                  </span>
                : <Icon name="arrow" size={18} />}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}
