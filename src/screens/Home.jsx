import { useState } from 'react'
import { useApp } from '../store.jsx'
import { STAMPS } from '../data.js'
import { Display, Hero, Screen, Segmented, TabBar, Tile } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

export default function Home() {
  const { go, letters, setOpenId } = useApp()
  const [filter, setFilter] = useState('All')
  const [pulsed, setPulsed] = useState(false)
  const unread = letters.filter((l) => !l.mine && l.unread && (filter === 'All' || l.from === filter.replace('From ', '')))
  const open = (l) => { setOpenId(l.id); go('mail') }

  return (
    <Screen>
      <div className="screen-body scroll" style={{ paddingBottom: 32 }}>
        <Display sub={unread.length ? `${unread.length} sealed letter${unread.length > 1 ? 's' : ''} waiting` : 'You’re all caught up'}>Good evening, Linh</Display>
        <Segmented label="Show letters" options={['All', 'From Mẹ', 'From Ba']} value={filter} onChange={setFilter} />

        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', margin: '0 -24px', padding: '0 24px', scrollPaddingLeft: 24, flexShrink: 0 }}>
          {unread.map((l) => {
            const stamp = STAMPS.find((s) => s.id === l.stamp)
            return (
              <div key={l.id} style={{ flex: `0 0 ${unread.length > 1 ? 'calc(100% - 28px)' : '100%'}`, scrollSnapAlign: 'start' }}>
                <Hero look={stamp.look} title={`A letter from ${l.from}`} sub={`Sealed · ${l.date}`} checks={[`Stamped “${stamp.label.toLowerCase()}”`, 'Opens only when you do']}>
                  <button className="pill small" style={{ alignSelf: 'flex-start', marginTop: 16 }} onClick={() => open(l)}>
                    <Icon name="envelope" size={16} />Read me
                  </button>
                </Hero>
              </div>
            )
          })}
          {!unread.length && <div style={{ flex: '0 0 100%' }}><Hero title="No sealed letters" sub="New ones show up here." /></div>}
        </div>

        <div className="tiles">
          <Tile look="ribbon" caption="Start a letter from a small prompt" onClick={() => go('prompt')} />
          <Tile look="silk" caption={pulsed ? 'Sent to Mẹ: “I’m thinking of you”' : 'Send a pulse: “I’m thinking of you”'} pressed={pulsed} onClick={() => setPulsed(true)} />
          <Tile look="dusk" caption="Every letter between you" onClick={() => go('history')} />
          <Tile look="lime" caption="Your fall recap book" onClick={() => go('recap')} />
        </div>
      </div>
      <TabBar active="home" />
    </Screen>
  )
}
