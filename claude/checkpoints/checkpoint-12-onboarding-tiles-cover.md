# Checkpoint 12 — Onboarding tile pictures reach the edges
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked all 22 onboarding tiles (q1–q4) in Chrome: every picture now covers its tile on all four sides.
- No console errors.

---

## 1. Context

Builds on checkpoint 11. The user saw that "the blur doesn't reach the end for some cards on the onboarding". The frosted caption band was fine. Three looks in `LOOKS` (`src/data.js`) shift their picture further than their zoom allows, so it stopped short of the tile and a flat strip of background showed at the bottom.

**What changed (`tf` values in `src/data.js`):** a shift only covers the tile while `|shift| ≤ 50% × (scale − 1)`.

| Look | Tile | Before | Problem | After |
|---|---|---|---|---|
| `street` | "Time Zones and Timing" | `translate(-8%,-49%) scale(1.6)` | 32px short at the bottom | `translate(-8%,-28%) scale(1.6)` |
| `book` | "It Feels Like a Report" | `translate(-43%,-60%) scale(1.8)` | short at the bottom and 5px on the right | `translate(-38%,-38%) scale(1.8)` |
| `path` | "Friends and New People" | `translateY(-80%) scale(2.2)` | short at the bottom | `translateY(-58%) scale(2.2)` |

- Each keeps its zoom and moves its framing only as far as it needs to.
- A comment on `LOOKS` records the rule.
- The full-screen video after a pick (`video` / `vpos`) is unchanged.

---

## 2. Human Directions

1. "for some of these on the prototype it seems like the blur doesn't reach the end for some cards on the onboarding", with a screenshot of the "Timing" and "It Feels Like a Report" tiles.

---

## 3. Records of Resistance

- None. The cause turned out to be the picture's framing, not the blur.

---

## 4. Successes

- Every tile's frosted band now sits over the picture, edge to edge.
