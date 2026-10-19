# Checkpoint 05 — Merge of the friend's "Lumen" app
**Date:** 2026-10-19
**Branch:** main
**Status:**
- The whole of the friend's app has been merged in: onboarding, prompt cards, the new Home, tab bar, languages, pulse, her letters and media.
- Every route was checked in Chrome with no console errors, and compared against her screenshots.
- Video playback and mic recording have **not** been tested on a real phone. Chrome's background test tab won't play media.

Share link: https://claude.ai/artifact/1nnWfTKHAN6M3XC7ehygd1 (Version 98)

---

## 1. Context

Builds on checkpoint 04. A friend forked the app at commit 6ecc1a0 and redesigned onboarding and more, published as a separate artifact. Her bundle was pretty-printed with esbuild. It was then token-diffed component by component against a build of 6ecc1a0, so only her real edits were ported.

**What changed:**
- **Branding:** the page title is now "Lumen Prototype". `public/i18n.js` is her translator, and the page loads it unbundled.
- **Onboarding (`src/screens/Onboarding.jsx`, rewritten):**
  - Splash tile ring and the Lumen lockup.
  - Welcome screen, and four questions with a video flood and a pick glow.
  - Confetti celebration and the env-stack opening.
- **Prompt cards (`src/screens/Swipe.jsx`):**
  - Painted image cards with drifting paint and blur bands.
  - Home button, "swipe right to answer, left to skip" line, and her "That's all for this week" end card.
- **Home (`src/screens/Home.jsx`, rewritten):**
  - Greeting, new-letters pill, Prompt of the Day, View History and a row of prompts.
  - Bell and avatar sheets: profile, 7-language switcher, notifications.
  - New `Pulse` hold-to-send heart screen.
- **Navigation:**
  - `AppNav` tab bar (Home / Write / Letters / Recap) in `ui.jsx` replaces TabBar.
  - Forward, back and tab screen transitions.
  - Browser history (pushState/hashchange).
  - Back from Read and the Recap returns to where you came from.
  - The app always starts at the splash, and the side screen list is removed.
- **Data (`src/data.js`):**
  - The family is Audrey & Mom, with her 9 letters, recap quotes, photos, two videos and avatars.
  - Painted stamp looks via `stampLook`.
  - Scene art lives in the new `src/components/sceneArt.js`.
- **Letters:**
  - Video in Read, Every letter and the Recap.
  - Stamps sit in the envelope's bottom corner. My stamp fly-on now targets that slot, with a zoom correction.
  - Skip taps for the opening and sealing animations.
  - Editable words on the stamp screen, a pastel paper backdrop and a serif "Sent!".
  - Recap count-ups and a loading skeleton.
- **Media:** about 70 MB of images and videos added to `public/stamps/`.
- **Phone fit:** `--fit` scales the phone frame to short desktop windows (`src/main.jsx`).

**Not done:**
- On-device test of the videos and mic recording.
- The "Taste of home" stamp art, the README, and compressing the large videos.

---

## 2. Human Directions

1. "take the onboarding section and the cards for the pick your prompt that she designed and combine it to mine".
2. "make sure all of it is now", meaning merge everything from her app, not just the selected parts.
3. When asked which demo family to keep, chose hers: Audrey & Mom.
4. "push".

---

## 3. Records of Resistance

- **Reduce motion:** her version turned off the system "reduce motion" setting in several places. It was **not** ported, so accessibility is kept, and this was flagged to Tina.
- **Unused code:** her LocCard (never rendered), calendar CSS and old pulse-button styles were left out as dead code.
- **Conflicting features:** my voice recording and stamp fly-on were kept over her older mock versions. The fly-on was retargeted to her new stamp slot instead of being dropped.

---

## 4. Successes

- The first selective merge (onboarding and cards) landed as asked, and the full merge followed.
- Stamp flight lands on her slot within 2px.
- The language switch to Tiếng Việt and back works, and letters stay untranslated.
