# Checkpoint 03 — Sliding pen-size pill, photo zoom, filter reshuffle
**Date:** 2026-10-18
**Branch:** main
**Status:**
- Three more microinteractions are built.
- They were checked in Chrome with animations paused at mid frames; live playback wasn't watched because background tabs freeze animations.
- Photo viewer open and close was verified end to end.

Share link: https://claude.ai/artifact/1nnWfTKHAN6M3XC7ehygd1

---

## 1. Context

Builds on checkpoint 02 (seven microinteractions).

**What changed:**
- **Write (`src/screens/Create.jsx`):** pen size picker has a white pill that slides to the chosen size. It is one absolutely positioned span, `translateX(index * 34px)`, with a springy transition. Buttons are transparent now.
- **Read (`src/screens/Receive.jsx`):** tapping the letter's photo opens `PhotoViewer`.
  - **Opening:** the photo box animates from the thumbnail's rect to a centered, full-aspect rect using WAAPI on left/top/width/height. A dark backdrop and the italic caption fade in, and the thumbnail is hidden while the viewer is open.
  - **Closing:** tap anywhere, the ✕, or Escape. The photo shrinks back, then the viewer unmounts after a timer. The timer replaced `onfinish`, which didn't fire reliably in hidden tabs.
  - **Accessibility:** the photo is a keyboard-focusable button (Enter or Space).
  - **Reduce motion:** durations drop to 0.
- **Every letter (History):** FLIP animation on filter or search change.
  - Each card sits in a `data-card` wrapper.
  - A layout effect keyed on the shown ids compares old and new positions relative to the grid: cards that moved glide (480ms), new cards fade up, and removed cards disappear.
  - It is skipped on first render and under reduce motion.

**Not done:**
- The remaining proposed microinteractions.
- The "Taste of home" stamp art.
- The README.

---

## 2. Human Directions

1. On Write, ask for the pen size selector to slide between sizes.
2. From the microinteraction list, pick "Photo tap" and "Filter change".
3. Build, then check at http://localhost:5180/Hackathon/#/read (tap the photo) and #/history (switch filters).

---

## 3. Records of Resistance

None this round. Both features were built as proposed.

---

## 4. Successes

- "make this a sliding animination when users select a different size" → sliding pill, matching the sliding segmented control used elsewhere.
