# Chrome Web Store Submission Checklist — PromptPack v1.0.0

## Pre-submission Verification

- [x] `manifest.json` valid (V3)
- [x] `promptpack-extension-only-v1.0.0-preview.zip` generated (< 50 MB)
- [x] Source code zip (`promptpack-source-v1.0.0-preview.zip`) ready for review
- [x] Icons: 16×16, 32×32, 48×48, 128×128 present in `assets/icons/`
- [x] No external code obfuscation (review requirement)
- [x] No remote-hosted code (all JS bundled)
- [x] Privacy policy drafted (see below)

## Assets Needed

| Asset | Status | Path / Action |
|-------|--------|---------------|
| Screenshot 1280×800 | ⬜ **TODO** | Capture extension popup in Chrome |
| Screenshot 1280×800 (2nd) | ⬜ **TODO** | Capture preset library view |
| Small promo tile 440×280 | ⬜ **TODO** | Design in Figma / Canva |
| Marquee promo tile 1400×560 | ⬜ **TODO** | Optional, for feature consideration |
| Privacy policy HTML | ⬜ **TODO** | Host on GitHub Pages or lumenhelix.com |

## Store Listing Copy

**Name**: PromptPack — AI Prompt Presets for Chrome  
**Summary**: One-click prompt presets for ChatGPT, Claude, Gemini, and Copilot.  
**Description**:  
PromptPack injects curated prompt templates directly into the web UI of major AI chat services. Organize by project, tag by intent, and never retype your best prompts. Built for researchers, developers, and prompt engineers who treat prompts as reusable assets.

**Category**: Productivity  
**Language**: English (primary)  
**Website**: https://github.com/lumenhelixsolutions/promptPACK  
**Support email**: (add if available)

## Privacy Policy (Draft)

```text
PromptPack Privacy Policy

PromptPack does not collect, transmit, or store any personal data.
All prompt presets are stored locally in the browser via Chrome's
storage.sync API. No analytics, no tracking, no server communication.

Contact: (support email or GitHub Issues)
```

Host this as a minimal HTML page and provide the URL in the CWS developer dashboard.

## Submission Steps

1. Pay $5 one-time developer registration fee at https://chrome.google.com/webstore/devconsole
2. Create new item → upload `promptpack-extension-only-v1.0.0-preview.zip`
3. Fill store listing (copy above)
4. Upload screenshots + promo tiles
5. Provide privacy policy URL
6. Set price: Free
7. Set visibility: Public (or Trusted Tester first)
8. Submit for review

## Post-Submission

- Typical review time: 1–3 business days
- Monitor `chrome://extensions` and email for rejection feedback
- On approval, announce on portfolio channels

## Quick-Capture Script (Windows)

```powershell
# Open Chrome with PromptPack pinned, press F11, then:
# Win+Shift+S → select popup area → save as screenshot-1.png
# Repeat for library view → screenshot-2.png
# Resize to 1280×800 via Paint or ImageMagick:
magick screenshot-1.png -resize 1280x800! assets/cws/screenshot-1.png
```
