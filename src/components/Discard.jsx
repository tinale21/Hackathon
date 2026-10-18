import { useState } from 'react'
import { useApp } from '../store.jsx'

/**
 * Ask before leaving a screen that holds unsaved work.
 *   const { leave, sheet } = useDiscardGuard(dirty, { onDiscard })
 *   <button onClick={() => leave('home')}> … {sheet}
 * When `dirty` is false, leave() just navigates.
 */
export function useDiscardGuard(dirty, {
  onDiscard,
  title = 'Discard this letter?',
  body = 'If you leave now, what you’ve written won’t be saved.',
  keep = 'Keep writing',
} = {}) {
  const { go } = useApp()
  const [to, setTo] = useState(null)

  const leave = (route) => (dirty ? setTo(route) : go(route))
  const discard = () => {
    const route = to
    setTo(null)
    if (onDiscard) onDiscard()
    go(route)
  }

  const sheet = to ? (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'flex-end' }}>
      <button aria-label={keep} onClick={() => setTo(null)} style={{ position: 'absolute', inset: 0, border: 'none', background: 'rgba(29,29,34,.32)' }} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="discard-title" aria-describedby="discard-body" className="rise"
        style={{ position: 'relative', width: '100%', background: '#fff', borderRadius: '28px 28px 0 0', padding: '22px 24px 30px', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
        <span style={{ alignSelf: 'center', width: 40, height: 4, borderRadius: 2, background: '#e2e3e8' }} />
        <h2 id="discard-title" className="serif" style={{ margin: '8px 0 0', fontSize: 28, lineHeight: 1.1 }}>{title}</h2>
        <p id="discard-body" className="body" style={{ margin: '0 0 10px' }}>{body}</p>
        <button className="pill block" autoFocus onClick={() => setTo(null)}>{keep}</button>
        <button className="pill outline block" onClick={discard} style={{ color: '#c2410c' }}>Discard</button>
      </div>
    </div>
  ) : null

  return { leave, sheet }
}
