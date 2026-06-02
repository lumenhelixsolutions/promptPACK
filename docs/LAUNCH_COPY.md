# Launch Copy

## GitHub description, <= 350 characters

Local-first Chrome extension for objective-aware prompt compression, no-op detection, must-fact preservation, and human-in-the-loop prompt handoff.

## Short launch post

I built promptPACK: a local-first Chrome extension that tests whether your prompt should be compressed, left alone, or turned into a handoff packet.

It is not a generic summarizer. It preserves must-facts, no-ops when compression is unsafe, and routes high-risk decisions back to the human.

Preset gate: 6/6 passing.

## Longer launch post

Most prompt tools try to rewrite everything.

promptPACK takes a different approach:

- compress when safe
- no-op when the original is already best
- preserve must-facts
- transform coding/research/local-model requests into handoff packets
- route high-consequence decisions to human review
- insert only after user action

It is a local-first Manifest V3 Chrome extension prototype with no network calls and a built-in preset gate.

Tagline:

Compress the prompt. Preserve the point.
