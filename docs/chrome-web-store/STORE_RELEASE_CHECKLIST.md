# Chrome Web Store Readiness Checklist

## Assets

- [x] 16x16 icon
- [x] 32x32 icon
- [x] 48x48 icon
- [x] 128x128 icon
- [ ] Store screenshots
- [ ] Promo tile if needed
- [ ] Demo GIF or short video

## Copy

- [x] Short description
- [x] Detailed description
- [x] Permissions explanation
- [x] Privacy policy draft

## Testing

- [x] `npm run ci`
- [x] Manifest smoke test
- [x] Preset gate 6/6
- [ ] Manual selected-text import
- [ ] Manual copy output
- [ ] Manual insert into active field
- [ ] Verify no network calls

## Release

- [x] `npm run release:check` produces dist ZIP
- [x] Portfolio pack script: `D:/projects/scripts/package-cws-extensions.ps1`
- [ ] Capture screenshots per `SCREENSHOT_PLAN.md`
- [ ] Create GitHub release v1.0.0
- [ ] Submit ZIP to Chrome Web Store developer dashboard ($5 fee)
