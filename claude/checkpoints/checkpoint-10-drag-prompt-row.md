# Checkpoint 10 — Drag the Home prompts row with a mouse
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked in Chrome with a real mouse drag and a click. No console errors.

---

## 1. Context

Builds on checkpoint 09. The Home "Prompts" row (`.qp-row`) already had `overflow-x: auto` with snap, and it does overflow (8 tiles, 1188px wide in 390px). It scrolled fine with touch or a sideways trackpad swipe. With a mouse, though, which is how judges use the website demo, dragging did nothing, so the row looked stuck.

**What changed:**
- **`src/screens/Home.jsx`:** a new `useDragScroll()` hook on the row, for mouse pointers only, so touch keeps native swiping.
  - After 5px of movement, a drag scrolls the row and pauses `scroll-snap`.
  - On release, snap comes back, so it settles onto the nearest card.
  - A drag swallows the click that follows it, so it doesn't open a prompt. A plain click still opens one.
- **`src/styles.css`:** `.qp-row` gets `cursor: grab` (`grabbing` while dragging).

---

## 2. Human Directions

1. "i need to fix this for both prototype but this part should be able to scroll horizontally", with a screenshot of the Home Prompts row.

---

## 3. Records of Resistance

- **Mouse wheel:** turning vertical wheel scroll into horizontal scroll was ruled out. It would hijack the Home screen's own vertical scroll.

---

## 4. Successes

- A 240px mouse drag moved the row two cards (`scrollLeft` 288) and stayed on Home.
- Clicking a tile afterwards opened that prompt.
