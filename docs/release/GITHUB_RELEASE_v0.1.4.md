# promptPACK v0.1.4 — Release Candidate Packaging

This release adds clean packaging for GitHub release and Chrome extension testing.

## Added

- Extension-only package staging
- Release checklist
- Package integrity checks
- Checksums
- Source ZIP and extension-only ZIP separation

## Included in extension-only ZIP

- `manifest.json`
- `src/service_worker.js`
- `src/content_script.js`
- `src/sidepanel.html`
- `src/sidepanel.js`
- `assets/icons/icon-16.png`
- `assets/icons/icon-32.png`
- `assets/icons/icon-48.png`
- `assets/icons/icon-128.png`
- `PACKAGE_README.txt`

## Test status

- `npm run ci` passed
- manifest smoke test passed
- preset gate passed 6/6
- package validation passed
- static network scan passed

## Safety boundaries

- No network calls
- No remote code
- No auto-insert
- No auto-send
- User-triggered selected-text import only
- User-triggered insertion only
