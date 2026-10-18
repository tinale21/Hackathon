# Checkpoint 02 — Microinteractions and compact suggested badge
**Date:** 2026-10-18
**Branch:** main
**Status:** Seven microinteractions added across Create a letter and Receive. Each was checked in Chrome by pausing animations at key frames (background tabs freeze live playback). The seal drag was tested with synthetic pointer events, not on a real phone. Share link: https://claude.ai/artifact/1nnWfTKHAN6M3XC7ehygd1

---

## 1. Context

Builds on checkpoint 01 (full prototype, responsive pass). Tina audited Create a letter and Receive and look back for microinteractions. From a proposed list of 23, she picked seven.

**What changed:**
- **Pick your prompt (`src/screens/Swipe.jsx`):**
  - The refresh (undo skip) icon spins once (`spinBack`).
  - The returned card drops onto the deck (`dealIn`).
  - "Shuffle again" deals all three cards back to front with a stagger.
  - `deal` state `{ n, all, on }` turns itself off after 800ms so normal swipes don't replay it. Every card now sits in a wrapper div keyed by prompt id.
- **Capture (`src/screens/Create.jsx`):**
  - The mic button morphs into a coral rounded stop square, with a pulsing red ring (`recRing`).
  - The timer turns red with a blinking dot (`recDot`).
- **Write:**
  - Selected colors, the color wheel and pen sizes bounce (`selBounce`).
  - The eraser icon tilts when active.
  - Undo and Clear shake the writing area via the Web Animations API, skipped when reduce motion is on.
- **Pick your paper:** switching Postcard ⇄ Letter flips the paper (`flipIn`, wrapper keyed by `paper`, runs only after the first switch via a `flips` counter).
- **Seal it with a stamp:** the new envelope color washes in with a clip-path circle from the tapped swatch's side (`washIn`), over a copy of the old envelope that is removed after 600ms.
- **Sent:**
  - The envelope lifts in, dips, then flies up and right (`flyAway`).
  - Sparkles follow along `SENT_SPARKS`.
  - A dotted trail draws itself through an SVG mask (`trailDraw`) and stays.
  - "Sent!" and the line settle in afterwards (`settleIn`).
- **New mail (`src/screens/Receive.jsx`):**
  - `OpeningEnvelope` takes `pull` (0–1) and `sealProps`.
  - Dragging the seal down moves it, splits the halves, draws the crack and tips the envelope.
  - More than 49px, or a quick flick past 20px, opens the letter; less springs back.
  - The seal bobs as a hint.
  - The copy now reads "pull the seal down to open". The "Break the seal" button stays as an accessible fallback.
- **Write back:** "Suggested for listen" is back on the right of the row as a smaller pill (11px text, 16px icon); the row is shorter.

All new keyframes are at the bottom of `src/styles.css` under "Microinteractions".

**Not done:** the other 16 proposed microinteractions; the "Taste of home" stamp art; the README.

---

## 2. Human Directions

1. Ask for a microinteraction audit of the Create and Receive sections, then pick: Shuffle spin, Recording state, Pen feedback, Postcard ⇄ Letter, Envelope color change, Envelope departure, Tap to tear.
2. Add keyframes to `src/styles.css`, then wire each into its screen as described above.
3. Run `npm run build`, then check each screen at http://localhost:5180/Hackathon/ (pausing animations with `document.getAnimations()` to inspect mid-frames).

---

## 3. Records of Resistance

- **Suggested badge on Write back:** the responsive pass in checkpoint 01 wrapped the badge under the title, which made the suggested row tall. Tina rejected it: "put the suggested for listen on the right and not make it so big in height." It is back on the right and smaller.
- **Microinteraction scope:** AI proposed 23 ideas and recommended five (stamp fly-on, Sent departure, drag-to-break seal, sticker drop, swipe commit feedback). Tina chose her own seven instead, keeping only two of the recommended five (Sent departure, drag-to-break seal).

---

## 4. Successes

- "auditing the create a letter and recieve and look back section, is there any microinteractions we could add" → a per-screen list Tina picked seven items from directly.
