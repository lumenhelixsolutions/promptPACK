# Test Output

```txt

> promptpack@0.1.3 ci
> npm run lint:manifest && npm test


> promptpack@0.1.3 lint:manifest
> node tests/manifest-smoke.test.js

manifest smoke test passed

> promptpack@0.1.3 test
> node tests/preset-smoke.test.js

┌─────────┬───────────────┬────────┬────────────┬─────────┬────────┬─────────────────────────────────────┬───────┐
│ (index) │ title         │ status │ objective  │ verdict │ net    │ route                               │ notes │
├─────────┼───────────────┼────────┼────────────┼─────────┼────────┼─────────────────────────────────────┼───────┤
│ 0       │ [32m'Compression'[39m │ [32m'PASS'[39m │ [32m'compress'[39m │ [32m'PASS'[39m  │ [33m54.2[39m   │ [32m'INTERNAL CANDIDATE / HUMAN INSERT'[39m │ [32m'—'[39m   │
│ 1       │ [32m'Short no-op'[39m │ [32m'PASS'[39m │ [32m'clarity'[39m  │ [32m'NO-OP'[39m │ [33m0[39m      │ [32m'INTERNAL'[39m                          │ [32m'—'[39m   │
│ 2       │ [32m'Coding'[39m      │ [32m'PASS'[39m │ [32m'coding'[39m   │ [32m'PASS'[39m  │ [33m-129.2[39m │ [32m'HUMAN-IN-THE-LOOP'[39m                 │ [32m'—'[39m   │
│ 3       │ [32m'Audit'[39m       │ [32m'PASS'[39m │ [32m'audit'[39m    │ [32m'NO-OP'[39m │ [33m0[39m      │ [32m'INTERNAL NO-OP / HUMAN REVIEW'[39m     │ [32m'—'[39m   │
│ 4       │ [32m'Research'[39m    │ [32m'PASS'[39m │ [32m'research'[39m │ [32m'PASS'[39m  │ [33m-84.6[39m  │ [32m'HUMAN-IN-THE-LOOP'[39m                 │ [32m'—'[39m   │
│ 5       │ [32m'Local model'[39m │ [32m'PASS'[39m │ [32m'local'[39m    │ [32m'PASS'[39m  │ [33m-26.7[39m  │ [32m'HUMAN-IN-THE-LOOP'[39m                 │ [32m'—'[39m   │
└─────────┴───────────────┴────────┴────────────┴─────────┴────────┴─────────────────────────────────────┴───────┘
Preset gate passed: 6/6


```
