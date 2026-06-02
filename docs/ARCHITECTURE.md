# Architecture

promptPACK is a local-first Manifest V3 Chrome extension.

## Files

```txt
manifest.json
src/
  service_worker.js
  content_script.js
  sidepanel.html
  sidepanel.js
tests/
  manifest-smoke.test.js
  preset-smoke.test.js
```

## Flow

```txt
User action
  ↓
Side panel
  ↓
Objective detection
  ↓
Compact packet / no-op / compression candidate
  ↓
Decision route
  ↓
Copy or user-confirmed insert
```

## Chrome APIs

- `sidePanel`
- `activeTab`
- `scripting`
- content script messaging

## Privacy

The prototype makes no network calls. Text stays local in the browser runtime.
