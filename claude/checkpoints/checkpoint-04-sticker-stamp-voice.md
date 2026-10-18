# Checkpoint 04 — Sticker drop, stamp fly-on, real voice memos
**Date:** 2026-10-18
**Branch:** main
**Status:**
- Two more microinteractions are built and were checked in Chrome at paused mid frames.
- Voice memos now really record and play. The flow was verified in Chrome with a stubbed recorder (Capture → preview → Seal it → Read) and with a blocked mic.
- Real recording and playback have **not** been heard on a phone. Chrome's background test tab won't run audio.

Share link: https://claude.ai/artifact/1nnWfTKHAN6M3XC7ehygd1 (Version 95)

---

## 1. Context

Builds on checkpoint 03.

**What changed:**
- **Pick your paper (`src/screens/Create.jsx`):** a newly added sticker drops onto the paper with a small squash (`stickDrop`). Only new stickers animate; they're tracked in a `fresh` ref set.
- **Seal it with a stamp:**
  - The tapped stamp flies from its tile to the envelope's stamp corner on a 5-keyframe WAAPI arc (640ms).
  - The envelope gives a small thud when it lands.
  - The envelope shows the new stamp only once it has landed (`landedId`).
- **Voice memo (new `src/components/Voice.jsx`):**
  - **Recording:**
    - `startVoice()` unlocks one shared AudioContext inside the tap (needed for iOS).
    - It opens the mic and records with MediaRecorder: `audio/mp4` where supported (iPhone), webm/Opus otherwise.
    - Recording runs in 250ms slices, and the clip comes back as a blob URL.
  - **Orb:** `VoiceOrb` now reads the recorder's analyser instead of opening a second mic stream, which can mute the first on iOS.
  - **Capture screen:**
    - The timer starts once the mic is live and shows m:ss.
    - Recording stops at 3 minutes or when the page is hidden.
    - Leaving the screen discards the clip and releases the mic.
    - With no mic or permission denied, it continues as a pretend recording and says so in the hint line.
  - **Playback:**
    - `VoicePlayer` (play/pause, waveform fills as it plays, real length) is used in the caption preview and on Read.
    - Sent letters carry `audio` and `seconds`.
    - In the Recap, a slide with a real clip autoplays in view; if the phone blocks autoplay it waits paused for a tap, and the tap starts play directly.
  - Sample voice letters (Ba) have no audio file, so their player runs progress only. `seconds` was added to them in `src/data.js`.
- **Icons:** added `pause`.

**Not done:**
- A real sample audio file for Ba's memos.
- On-device test of recording and playback on iPhone and Android.
- Unknown whether the claude.ai artifact frame allows the microphone; if not, it falls back to the pretend recording with the hint.
- The remaining microinteraction ideas, the "Taste of home" stamp art, and the README.

---

## 2. Human Directions

1. From the remaining microinteraction list, pick "Sticker drop" and "Stamp fly-on".
2. Ask for a style guide covering fonts, colors, gradients and motion (published separately as a private artifact, not in the repo).
3. Ask for four user-testing questions with tasks based on the PRD, then ask that the questions and script be natural and unbiased.
4. Ask to "make sure voice memo work for mobile users".

---

## 3. Records of Resistance

- **Testing script bias:** the first version of the user-testing questions led participants (for example "something harder than it looked", "Does this show more than you'd usually tell them?"). Tina asked for natural, unbiased wording. The script was rewritten with neutral tasks, open follow-ups, no feature names before the tester uses them, and moderator rules.
- **Voice memo was a mock:** on inspection, the voice memo only animated the orb and showed static play buttons. "Make sure it works" turned into building real recording and playback rather than polishing the visuals.

---

## 4. Successes

- "do the Sticker drop, Stamp fly-on" → both built as proposed, no revisions.
- "make sure the questions and script is natural and not bias" → rewritten script with opening, four tasks, neutral probes and closing.
