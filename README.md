# Lectio — Natural Language Reader

A personal audiobook player for PDF, EPUB, and DOCX files with TTS playback.

---

## Changelog

### Current
- Switched Azure TTS from REST API to Speech SDK for real word boundary events and accurate highlighting
- Added real SSML prosody for questions (+12% pitch) and exclamations (+8% pitch, louder)
- Added narration-professional speaking style for Ryan voice

### Previous versions
- **Azure TTS** — Added Azure Cognitive Services TTS with API key setup, voice picker, and fallback to browser TTS
- **Click to seek** — Click any word to start reading from there; click progress bar to scrub to position
- **Auto-advance** — Automatically continues to next chapter/section when one finishes
- **Wake Lock** — Prevents screen sleep and CPU throttling during playback
- **Lazy parsing** — EPUBs and PDFs show first chapters immediately, rest loads in background
- **Instant restore** — Parsed chapters stored in IndexedDB so reopening is instant, no re-parsing
- **Resume prompt** — On reopen shows "Continue reading?" prompt with book title
- **Pronunciation dictionary** — Pre-seeded with Vietnamese, Teochew, Malay vocabulary; fully editable; persists across sessions
- **Text cleaning** — Strips asterisks, markdown formatting, scene break symbols before TTS
- **Prosody nudges** — Comma hints before ? and ! for browser TTS inflection
- **Word highlighting** — Amber highlight tracks current word being spoken
- **Voice picker** — Tiered quality ranking (Premium/Enhanced/Local/Network), live preview, remembers choice
- **Chrome/Mac tip** — One-time banner suggesting Edge for better voice quality
- **DOCX support** — Added Word document parsing via mammoth.js
- **Mobile fixes** — iOS chunking, TTS unlock, screen wake/visibility handling
- **PWA** — Installable as Mac/Android app via GitHub Pages, service worker for offline/auto-update
- **PDF, EPUB support** — Core file parsing via PDF.js and JSZip
- **Speed control** — Playback rate slider (0.5×–2×)
- **Chapter navigation** — Section dropdown, prev/next buttons, progress bar
- **Auto-save position** — Saves chapter and word index every 5 seconds

---

## Running as a PWA (Recommended)

To install Lectio as a proper Mac app with its own Dock icon:

### 1. Make sure Node.js is installed
If you don't have it: https://nodejs.org (download the LTS version)

### 2. Open Terminal and navigate to this folder
```bash
cd path/to/lectio
```
(You can also drag the lectio folder onto the Terminal icon to open it there.)

### 3. Start the local server
```bash
npx serve .
```
The first time it may ask to install `serve` — just press Enter to confirm.

### 4. Open in Microsoft Edge
Go to: **http://localhost:3000**

### 5. Install as an app
In Edge, click the **install icon** in the address bar (looks like a computer with a down arrow), then click **Install**.

Lectio will now appear in your Applications folder and Dock like a native app.

---

## Stopping the server
Press `Ctrl+C` in Terminal. The app icon stays in your Dock but needs the server running to open.

## Auto-start tip
To avoid running the Terminal command every time, you can use a tool like **Anvil** (free) or **LaunchAgent** to auto-start the server on login.

---

## Best voice quality
Use **Microsoft Edge** and download Premium voices in:
**System Settings → Accessibility → Spoken Content → System Voice → Manage Voices**

Look for: Ava (Premium), Allison (Premium), Tom (Premium)

Or set up **Azure TTS** for the best quality on any browser — tap ⚙ in the player.

---

## Azure TTS Setup
1. Go to portal.azure.com
2. Search "Speech" → Create a Speech resource
3. Choose **Free F0 tier** (500k characters/month free forever)
4. Go to Keys and Endpoint → copy Key 1
5. In Lectio tap ⚙ → paste key → Save & Enable

---

## Files
```
lectio/
  index.html     — the app
  manifest.json  — PWA config
  sw.js          — service worker (offline support)
  icon-192.png   — app icon
  icon-512.png   — app icon (large)
  icon.svg       — source icon
  README.md      — this file
```
