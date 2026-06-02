# Chrome Web Store Submission Notes

## Use this upload artifact

Use the extension-only ZIP:

```txt
promptpack-extension-only-v0.1.5.zip
```

This ZIP has `manifest.json` at the root and excludes repo docs/tests.

## Listing files

Use:

- `docs/chrome-web-store/STORE_LISTING.md`
- `docs/chrome-web-store/PRIVACY_POLICY.md`
- `docs/chrome-web-store/PERMISSIONS_EXPLANATION.md`
- `docs/chrome-web-store/SCREENSHOT_PLAN.md`

## Manual QA before submission

Complete:

- `docs/release/MANUAL_BROWSER_SMOKE_TEST.md`
- `docs/release/NETWORK_VERIFICATION.md`

## Recommended status

Submit as an early developer preview only after screenshots and manual QA are complete.

## Notes for reviewer

promptPACK:
- processes text locally
- has no network calls
- does not collect data
- does not use remote code
- reads selected text only after user action
- inserts text only after user action
