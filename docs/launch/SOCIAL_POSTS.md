# promptPACK Social Posts

## Short post

I built promptPACK — a local-first Chrome extension that checks whether a prompt should be compressed, left alone, or converted into a handoff packet.

It preserves must-facts, no-ops when rewriting is unsafe, and routes coding/research/audit tasks back to the human.

Preset gate: 6/6 passing.
No network calls.
No auto-insert.

Compress the prompt. Preserve the point.

## Technical post

Most prompt tools rewrite everything.

promptPACK treats prompt optimization more like a compiler/compression system:
- preserve declared facts
- no-op when compression is unsafe
- route coding/research/audit tasks to human review
- insert only after user action

It is a local-first Chrome MV3 side-panel prototype.

## Hacker News / Reddit style

I made a small Chrome extension prototype for prompt compression, but the main design goal is restraint.

Instead of blindly shortening every prompt, it first classifies the objective:
- compression
- short no-op
- coding handoff
- audit/high-stakes no-op
- research handoff
- local-model handoff

The current spike is local-first, has no network calls, and includes a preset gate that passes 6/6.

I’m looking for feedback on the decision-routing model and whether editable “must-preserve facts” are the right UX primitive.
