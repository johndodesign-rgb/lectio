# Lectio — Natural Language Reader

A personal audiobook player for PDF, EPUB, and DOCX files with TTS playback.

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
