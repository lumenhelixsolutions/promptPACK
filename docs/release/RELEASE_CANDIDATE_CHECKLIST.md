# Release Candidate Checklist

## Before publishing GitHub release

- [ ] Run `npm run release:check`
- [ ] Confirm preset gate 6/6
- [ ] Confirm no static network scan hits
- [ ] Confirm extension-only ZIP has manifest at root
- [ ] Confirm source ZIP includes docs/tests/assets
- [ ] Upload release notes
- [ ] Attach extension-only ZIP
- [ ] Attach source ZIP

## Manual browser smoke test

- [ ] Load unpacked extension from extension-only ZIP
- [ ] Open side panel
- [ ] Run Preset Tests → Run all
- [ ] Confirm PASS 6 / WARN 0 / FAIL 0
- [ ] Use selected text
- [ ] Copy output
- [ ] Insert into active field
- [ ] Confirm no auto-submit/send behavior

## Chrome Web Store readiness

- [ ] Use extension-only ZIP
- [ ] Add screenshots
- [ ] Add privacy policy
- [ ] Add permissions explanation
- [ ] Mark as developer preview if not publicly polished yet
