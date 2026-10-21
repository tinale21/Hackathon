# Checkpoint 09 — Status icons on the right at phone width
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked in a 390px frame: the icons sit at the right edge (306–376px of 390).

---

## 1. Context

Builds on checkpoint 08. At phone width (≤760px, which includes the website's 390px demo frame), the mock status bar hides the "9:41" time. `.status svg { display: block }` outranks `.status > * { display: none }`, so the signal/wifi/battery icons stay visible. With the time gone, `space-between` pushed them to the left, unlike iOS.

**What changed (`src/styles.css`):**
- Added at the end of the file, so it wins over the base `.status` rule:
  `@media (max-width: 760px) { .status { justify-content: flex-end; } }`
- The icons now sit on the right. In the website's iPhone frame they clear the Dynamic Island.

---

## 2. Human Directions

1. "this should be on the right not left", with a screenshot of the icons left of the Dynamic Island in the website demo.

---

## 3. Records of Resistance

- None.

---

## 4. Successes

- The demo's top edge now reads like an iPhone: island in the middle, status icons on the right.
