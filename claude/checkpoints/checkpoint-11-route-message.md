# Checkpoint 11 — Prototype announces its screen when embedded
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked from the website: Home, Capture, Read, Recap and q2 each highlighted the right step.

---

## 1. Context

Builds on checkpoint 10. The hackathon website's Demo has five jump-to steps beside the embedded prototype. They should follow along when someone taps through the phone themselves. The website can't read the prototype's location across origins (localhost in dev), so the prototype now says where it is.

**What changed (`src/App.jsx`):**
- An effect on `route` calls `window.parent.postMessage({ lumenRoute: route }, '*')`, but only when the app is inside a frame.
- The message carries just the route id.

---

## 2. Human Directions

1. "do Demo steps show which screen you're on …" (from the microinteraction suggestions).

---

## 3. Records of Resistance

- None.

---

## 4. Successes

- The website's step list now tracks the phone in real time.
