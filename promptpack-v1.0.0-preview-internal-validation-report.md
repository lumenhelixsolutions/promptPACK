# promptPACK v1.0.0-preview Internal Validation Report

## Summary

Commercial gate passed: **true**  
Extension ZIP root manifest: **true**

## Artifacts

| Artifact | SHA-256 |
|---|---|
| `promptpack-extension-only-v1.0.0-preview.zip` | `bb2f544254d85ebf36e44eee621de19d29af2193d59fb33a36f35fcb50e418df` |
| `promptpack-source-v1.0.0-preview.zip` | `47b67f47e90ad48f03e29120fc875b1a608c2dd1bc09e5e9681a797e0043645e` |

## Gate output

```txt

> promptpack@1.0.0-preview commercial:gate
> npm run ci && npm run package:extension && npm run qa:manual-note && npm run audit:static


> promptpack@1.0.0-preview ci
> npm run lint:manifest && npm test


> promptpack@1.0.0-preview lint:manifest
> node tests/manifest-smoke.test.js

manifest smoke test passed

> promptpack@1.0.0-preview test
> node tests/preset-smoke.test.js

┌─────────┬───────────────┬────────┬────────────┬─────────┬────────┬─────────────────────────────────────┬───────┐
│ (index) │ title         │ status │ objective  │ verdict │ net    │ route                               │ notes │
├─────────┼───────────────┼────────┼────────────┼─────────┼────────┼─────────────────────────────────────┼───────┤
│ 0       │ 'Compression' │ 'PASS' │ 'compress' │ 'PASS'  │ 54.2   │ 'INTERNAL CANDIDATE / HUMAN INSERT' │ '—'   │
│ 1       │ 'Short no-op' │ 'PASS' │ 'clarity'  │ 'NO-OP' │ 0      │ 'INTERNAL'                          │ '—'   │
│ 2       │ 'Coding'      │ 'PASS' │ 'coding'   │ 'PASS'  │ -129.2 │ 'HUMAN-IN-THE-LOOP'                 │ '—'   │
│ 3       │ 'Audit'       │ 'PASS' │ 'audit'    │ 'NO-OP' │ 0      │ 'INTERNAL NO-OP / HUMAN REVIEW'     │ '—'   │
│ 4       │ 'Research'    │ 'PASS' │ 'research' │ 'PASS'  │ -84.6  │ 'HUMAN-IN-THE-LOOP'                 │ '—'   │
│ 5       │ 'Local model' │ 'PASS' │ 'local'    │ 'PASS'  │ -26.7  │ 'HUMAN-IN-THE-LOOP'                 │ '—'   │
└─────────┴───────────────┴────────┴────────────┴─────────┴────────┴─────────────────────────────────────┴───────┘
Preset gate passed: 6/6

> promptpack@1.0.0-preview package:extension
> node scripts/package-extension.js

Extension package staged in dist/
Version: 1.0.0
Files: 10

> promptpack@1.0.0-preview qa:manual-note
> node scripts/manual-qa-summary.js

manual QA artifacts present
Manual browser tests still require Chrome.

> promptpack@1.0.0-preview audit:static
> node scripts/static-safety-audit.js

static safety audit passed


```

## Scope

This validates the repo stack, automated tests, static safety audit, and package staging. Manual Chrome browser testing is still recommended before public release.
