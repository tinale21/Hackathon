# Checkpoint 08 — Recap book runs under the tab bar
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked in Chrome on a photo/video letter slide, with no console errors.
- Pending push to update the website's demo.

---

## 1. Context

Builds on checkpoint 07. The Recap book feed stopped 96px above the bottom, and a solid white strip filled the space behind the floating tab bar. On dark photo letters this showed as a white band around the nav, instead of the content bleeding behind it like the rest of the app.

**What changed (`src/screens/Receive.jsx`):**
- **Feed:** the scroll feed now fills the whole screen (`inset: 0` instead of `bottom: 96`).
- **White strip:** removed.
- **New `NAV_H = 96` constant:** each slide keeps its content that far above the bottom, so nothing hides behind the nav.
  - **Letter slides:** the caption block (`bottom: 40 + NAV_H`) and the Write back / Save rail (`bottom: 120 + NAV_H`).
  - **Text and voice letters:** bottom padding plus `NAV_H`.
  - **Cover, chapter, quote and "To be continued…" slides:** bottom padding of `NAV_H`, so they stay centered in the visible area.

---

## 2. Human Directions

1. "i think i have to fix this on both of my prototype but there should be that white space around the nav, it should bleed in", with a screenshot of the Recap letter slide and the white band around the tab bar.

---

## 3. Records of Resistance

- None.

---

## 4. Successes

- On a dark letter slide, the background runs to the bottom edge behind the nav pill.
- The caption and buttons stay in the same place relative to the visible area.
