// 24px line icons, 1.6 stroke, currentColor. Paths match the Pastel design system set.
const P = {
  home: <><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></>,
  back: <path d="M15 5l-7 7 7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M5 8h14M5 12h14M5 16h14" />,
  photo: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  voice: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  text: <path d="M5 6h14M5 12h14M5 18h9" />,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5h.01M15 9.5h.01" /></>,
  envelope: <><path d="M3 6h18v12H3z" /><path d="M3 6l9 7 9-7" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  pen: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 7l3 3" /></>,
  keyboard: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  listen: <><path d="M6 9a6 6 0 0 1 12 0c0 4-3 5-3 8a3 3 0 0 1-6 0" /><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0" /></>,
  star: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />,
  advice: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  book: <><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z" /><path d="M12 6v14" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  frame: <><path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></>,
  sparkle: <path d="M12 3c.6 4 2 5.4 6 6-4 .6-5.4 2-6 6-.6-4-2-5.4-6-6 4-.6 5.4-2 6-6z" />,
  refresh: <><path d="M20 11a8 8 0 0 0-14.5-4.5M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.5 4.5M20 20v-4h-4" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>,
  undo: <><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></>,
  eraser: <><path d="M8 20h12" /><path d="M5.5 15.5l9-9a2 2 0 0 1 2.8 0l1.7 1.7a2 2 0 0 1 0 2.8L11 19H8.5z" /><path d="M10 11l4.5 4.5" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  play: <path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none" />,
  pause: <><rect x="6.5" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none" /><rect x="13.5" y="5" width="4" height="14" rx="1.5" fill="currentColor" stroke="none" /></>,
  stop: <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" />,
}

export default function Icon({ name, size = 20, stroke = 1.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      {P[name]}
    </svg>
  )
}
