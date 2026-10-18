import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

/* ---------- Recording ---------- */
// One audio context for the whole app. Phones (iOS Safari especially) only let it run if it is
// created or resumed during a tap, so startVoice() must be called straight from the tap handler.
let shared = null
function audioContext() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!shared || shared.state === 'closed') shared = new AC()
  if (shared.state === 'suspended') shared.resume().catch(() => {})
  return shared
}

// iPhone records mp4 (AAC); Chrome and Firefox prefer webm (Opus). Use the first one this browser can make.
const TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
function recordType() {
  if (!window.MediaRecorder) return null
  if (!MediaRecorder.isTypeSupported) return ''
  return TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? ''
}

export const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)

/**
 * Starts the microphone and a recorder. Resolves to { analyser, stop, cancel }:
 * stop() resolves to { url, type } for the clip, cancel() throws it away.
 * Rejects when there is no microphone, permission is denied, or the browser can't record.
 */
export async function startVoice() {
  const ctx = audioContext() // before any await, so it counts as part of the tap
  if (!canRecord()) throw new Error('unsupported')
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
  let analyser = null
  if (ctx) {
    analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    ctx.createMediaStreamSource(stream).connect(analyser) // never to the speakers, so there's no feedback
  }
  const type = recordType()
  let mr
  try { mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined) } catch (e) { stream.getTracks().forEach((t) => t.stop()); throw e }
  const chunks = []
  mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data) }
  mr.start(250) // small slices so iOS hands over data even for very short clips
  const release = () => stream.getTracks().forEach((t) => t.stop())
  return {
    analyser,
    stop: () => new Promise((resolve) => {
      if (mr.state === 'inactive') { release(); resolve(null); return }
      mr.onstop = () => {
        release()
        if (!chunks.length) { resolve(null); return }
        const blob = new Blob(chunks, { type: mr.mimeType || type || 'audio/mp4' })
        resolve({ url: URL.createObjectURL(blob), type: blob.type })
      }
      mr.stop()
    }),
    cancel: () => { mr.onstop = null; if (mr.state !== 'inactive') mr.stop(); release() },
  }
}

export const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/* ---------- Playback ---------- */
// Play button, waveform that fills as it plays, and the time.
// With a recorded clip (src) it plays the sound; sample letters without one just run the progress.
export function VoicePlayer({ src, seconds = 42, n = 30, dark = true }) {
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const total = Math.max(1, seconds)

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const t0 = performance.now() - t * 1000
    const tick = () => {
      const now = audio.current && src ? audio.current.currentTime : (performance.now() - t0) / 1000
      if (!src && now >= total) { setT(0); setPlaying(false); return }
      setT(now)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, src]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (audio.current) audio.current.pause() }, [])

  const toggle = () => {
    if (playing) { if (audio.current) audio.current.pause(); setPlaying(false); return }
    if (src && audio.current) {
      // play() has to start inside the tap on phones.
      audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else setPlaying(true)
  }
  const shown = playing || t > 0 ? t : total
  const done = Math.min(1, t / total)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
      {src ? <audio ref={audio} src={src} preload="auto" playsInline onEnded={() => { setPlaying(false); setT(0) }} onPause={() => setPlaying(false)} /> : null}
      <button type="button" className="icon-btn" aria-label={playing ? 'Pause voice memo' : 'Play voice memo'} onClick={toggle}
        style={{ flexShrink: 0, border: 'none', background: dark ? 'var(--ink)' : '#fff', color: dark ? '#fff' : 'var(--ink)' }}>
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
      <svg viewBox={`0 0 ${n * 5} 30`} preserveAspectRatio="none" aria-hidden="true" style={{ flex: 1, minWidth: 0, height: 30 }}>
        {Array.from({ length: n }, (_, i) => { const h = 5 + ((i * 7) % 11); return <rect key={i} x={i * 5} y={15 - h} width="2.6" height={h * 2} rx="1.3" fill={i / n < done ? 'var(--ink)' : 'rgba(29,29,34,.3)'} /> })}
      </svg>
      <span className="small" style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{clock(shown)}</span>
    </div>
  )
}
