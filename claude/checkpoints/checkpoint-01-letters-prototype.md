# Checkpoint 01 — Letters prototype, first full build
**Date:** 2026-10-18
**Branch:** main
**Status:** Full clickable iPhone-style prototype of every screen, responsive across phone sizes. Built and verified in Chrome at 320×568 through 430×932 (emulated, not on real devices). Shared as a claude.ai artifact: https://claude.ai/artifact/1nnWfTKHAN6M3XC7ehygd1

---

## 1. Context

"Letters" (app name still a placeholder, shown as `[App name]`) is a prototype where immigrant and international art students and their families exchange sealed letters, postcards, voice memos and photos. The product brief is `claude/docs/PRD Letters Between Student and Parent.pdf`.

**Stack:** Vite 5 + React 18, plain JS. Inline styles plus `src/styles.css` (CSS variables, keyframes). Fonts: Newsreader (`--serif`), Geist, Inter. Hash routing with a state-first `go()` in `src/store.jsx` (`useApp`). GitHub Pages deploy via `.github/workflows/deploy.yml`; `vite.config.js` base is `/Hackathon/`.

**Run:** `npm install`, then `npm run dev -- --port 5180 --strictPort` → http://localhost:5180/Hackathon/ (port 5173 is used by another project).

**Screens (src/screens):**
- **Onboarding:** splash (painted stamps), name reveal, two questions, Home with a shared TabBar (home / + / letters).
- **Create a letter:** Pick your prompt (Swipe.jsx: Tinder-style deck with ghost fly-out, flick velocity, nudge hint, ambient card motion) → Capture (photo with live camera / file picker fallback, voice with a pastel VoiceOrb that reacts to the mic, words) → Write (pens, color wheel) → Pick your paper (postcard / letter, 123 custom pastel sticker illustrations in `StickerArt.jsx`, drag / pinch / rotate, pet-photo stickers) → Caption + stamp (inside preview, envelope colors, six illustrated stamps) → Sent.
- **Receive and look back:** New mail (break the seal), Read, Write back (stamp-colored hint, suggested answer mode), Every letter (History: segmented filter with sliding pill, cards with Save), Recap book (TikTok-style snap feed, Spotify-Wrapped-style mask reveals, drifting pastel glows, autoplaying voice notes).

**Responsive:** on screens ≤760px the phone frame and fake status bar disappear, safe-area insets apply (`.safe-bottom`), the swipe deck flexes to available height, and recap cards scale using container query units.

**Assets:** `public/stamps/` holds paintings, caption-matched photos and stamp illustrations, with sources in `public/stamps/CREDITS.md` (CC BY / public domain).

**Not done yet:**
- "Taste of home" stamp still uses the old graphic: the illustration provided was a duplicate of "Distract me".
- No README yet (Design Argument, AI Direction Log, Five Questions, etc.).
- Microinteraction ideas were listed (stamp flying onto envelope, Sent departure, drag-to-break seal, sticker drop, swipe commit feedback) but not built.
- No real backend; all data is in `src/data.js`.

---

## 2. Human Directions

1. Scaffold Vite + React (JS), set `base: '/Hackathon/'`, add CC0 LICENSE and the GitHub Pages workflow from the sibling SCAD projects.
2. Build the screens above from the PRD, one flow at a time (onboarding → create → receive).
3. Iterate visually screen by screen in the browser, giving direct feedback on spacing, copy, color and motion (see Records of Resistance for the major reversals).
4. Replace emoji stickers with a custom illustrated pastel set; supply stamp illustrations by hand.
5. Make the app responsive: hide the device frame on phones, use safe areas, make fixed-height layouts flex (Swipe deck, Recap cards).
6. Verify at 320×568, 360×640, 375×667, 390×760 and 430×932.

---

## 3. Records of Resistance

- **Recap book format:** AI built an endless scrapbook, then a feed with stats cards, a Love button, and bouncy animations. Rejected: stats and "Linh & Mẹ" framing removed because the recap should collect letters from everyone; bounces felt "too much", so motion was redirected to Spotify Wrapped-style reveals.
- **Stickers:** AI offered standard emoji, then Fluent-style emoji with grain. Rejected as "standard emoji"; redirected toward pastel, kaomoji-blob illustrations in the app's own style. Result: 123 hand-drawn SVG stickers.
- **Photos:** AI sourced pastel landscape paintings for letter photos. Revised: letters now use real photos that match their captions; paintings stay only on the splash and recap cover.
- **Answer-mode icons:** AI made illustrated app-icon-style icons for photo / voice / words. Reverted to the original line icons.
- **Voice visual:** AI's first gradient circle didn't match; redirected to the faded pastel circle used across the design.
- **Every letter background:** frosted controls tried, reverted to grey.
- **Swipe instructions:** text "swipe right to answer, left to skip" replaced with a card nudge animation (Hinge/Tinder reference).
- **Suggested badge on Write back:** a responsive fix moved it under the text; rejected as too tall, moved back to the right and made smaller.

---

## 4. Successes

- "for the recap book can you actually do the doomscrolling like how insta reels or tiktok work" → snap feed kept through all later iterations.
- "it feels a bit too much. can you reference spotify recap and its use of animination" → mask-reveal, expo-eased motion that stayed.
- "for the voice memo … make it the gradient circle and then when users go to record their voice it animinates and pulses as they talk" → VoiceOrb, reused in Recap.
- "can you make the cards behind the active pick your prompt card a bit tinted" → after two retunes, "thats better" with a white tint.
- "for the save, i think the icon should turn yellow and the circle a lighter tinted yellow" → final pale-yellow Save button.
