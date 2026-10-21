# Checkpoint 07 — No confetti, no heartbeat
**Date:** 2026-10-21
**Branch:** main
**Status:** Both changes checked in Chrome, with no console errors.

---

## 1. Context

Builds on checkpoint 06. The judges' site (`Hackathon-Website`) embeds this app's GitHub Pages build as its Demo, so once this is pushed, the change shows up there too.

**What changed:**
- **"Welcome, Audrey!" screen (`Celebrate` in `src/screens/Onboarding.jsx`):**
  - Removed the confetti: the canvas, the particle simulation, the timed bursts and the tap-to-burst.
  - Only the oval glow, lockup, title, subtitle and Let's go button remain.
  - The `.confetti-canvas` CSS rules are gone.
- **Home "Send a pulse" tile (`pulse` in `src/components/sceneArt.js`):**
  - The heart no longer has the `pa-beat` animation.
  - The unused `.pa-beat` rule and its keyframes are gone.
  - The soft rings behind the heart still animate.
  - The hold-to-send heart on the Pulse screen itself is unchanged.

---

## 2. Human Directions

1. "can you move the coffefi on this screen", with a screenshot of the "Welcome, Audrey!" screen. Read as *remove* the confetti.
2. "can you also not make the heart beat here", with a screenshot of the Home "Send a pulse" tile.
3. Change it in the Hackathon repo so the website's demo updates too.

---

## 3. Records of Resistance

- None.

---

## 4. Successes

- The celebrate screen renders with no canvas.
- On Home, both copies of the pulse heart have `animation-name: none`.
