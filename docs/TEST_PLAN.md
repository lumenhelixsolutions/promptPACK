# Test Plan

## Automated

```bash
npm run ci
```

Automated checks:

- Manifest smoke test
- Preset gate smoke test

## Extension preset gate

Run inside the side panel:

```txt
Preset Tests → Run all
```

Expected:

```txt
PASS 6 / WARN 0 / FAIL 0
```

## Manual browser tests

1. Use selected text.
2. Copy output.
3. Insert into active field.
4. Confirm no automatic insertion occurs.
5. Confirm no network calls are added.

## Regression cases

- Short prompt should no-op.
- Audit prompt should no-op or route to human review.
- Coding prompt should preserve exact error and handoff requirements.
- Research prompt should preserve citation/source requirements.
- Local model prompt should preserve Ollama/local LLM/VRAM constraints.
