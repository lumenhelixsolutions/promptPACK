# Manual Browser Smoke Test

Use this checklist after `npm run release:final-check`.

## Load extension

1. Unzip `promptpack-extension-only-v0.1.5.zip`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the unzipped extension folder.

## Preset gate

1. Open promptPACK side panel.
2. Click Preset Tests → Run all.
3. Expected: PASS 6 / WARN 0 / FAIL 0.

## Selected-text import

1. Open `tests/manual-smoke-page.html` in Chrome.
2. Highlight the sample text.
3. In promptPACK, click Use selected text.
4. Expected: selected text appears in the input box.

## Copy output

1. Click Compress / Optimize.
2. Click Copy output.
3. Paste into the textarea.
4. Expected: output is copied exactly.

## Insert into active field

1. Click inside the textarea.
2. In promptPACK, click Insert into active field.
3. Expected: output appears in the textarea.
4. Repeat for the input field and contenteditable box.

## Failure conditions

- Extension inserts without user clicking Insert.
- Extension sends/submits/publishes anything.
- Selected text is imported without user clicking Use selected text.
- Preset gate fails.
- Any network call appears during normal use.
