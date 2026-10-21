# Checkpoint 13 — Real camera on computers too
**Date:** 2026-10-21
**Branch:** main
**Status:**
- Checked in Chrome with the camera API stubbed, so no real webcam prompt was triggered.
  - Allowed: a fake feed showed mirrored in the camera view, and the shutter saved a 640×480 photo the right way round.
  - Blocked: the shutter falls back to the sample photo, with an explaining line.
- No console errors.

---

## 1. Context

Builds on checkpoint 12. The Capture screen's Photo mode already used the real camera on phones, but computers deliberately showed the "Camera view" placeholder and used a sample photo. The user wants the actual camera on every device.

**What changed (`Capture` in `src/screens/Create.jsx`):**
- **Live view everywhere:** it starts on computers too, not just phones. Phones default to the back camera; computers use the webcam (`facingMode: 'user'`), mirrored in the preview.
- **Switch camera button:** shows only on phones, since a laptop has one webcam.
- **Camera blocked or denied:** this includes the claude.ai viewer, which doesn't allow camera access. A new `camOff` state swaps the line under the camera to "The camera is off, so the shutter uses a sample photo. Allow the camera for this site to use your own." On a computer the shutter uses the sample photo; phones still open their own camera app.
- **Saved photos are no longer mirrored,** on phones and computers alike, matching iPhone's default. Text in a selfie now reads correctly; the preview stays mirrored.
- **The website's Demo iframe** already grants `allow="camera"`, so it works there.

---

## 2. Human Directions

1. "for the camera on prototype, can you make it so it access users actual camera", with a screenshot of the Capture screen showing the "Camera view" placeholder.

---

## 3. Records of Resistance

- **Mirrored photos:** the first pass saved selfie photos mirrored (text came out backwards), as the phone path always had. It now saves the true image.

---

## 4. Successes

- Judges on laptops can now take a real photo for their letter.
