# Network Verification Guide

promptPACK is designed to make no network calls.

## Static check

Run:

```bash
npm run release:final-check
```

The package script scans source files for obvious network and remote-code patterns.

## Browser DevTools check

1. Load the extension unpacked.
2. Open the side panel.
3. Open Chrome DevTools for the side panel.
4. Go to the Network tab.
5. Run:
   - Preset Tests → Run all
   - Use selected text
   - Compress / Optimize
   - Copy output
   - Insert into active field
6. Expected: no external network requests from promptPACK.

## What should be considered a blocker

- `fetch`
- `XMLHttpRequest`
- remote script loading
- analytics
- telemetry
- remote model calls
- prompt text leaving the browser
