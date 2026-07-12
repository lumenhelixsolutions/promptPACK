# Chrome Web Store Assets — promptPACK v1.0.0

## Store listing title (50 chars max)

promptPACK — Prompt Compression & Handoff

## Store listing description (1000 chars max)

promptPACK is a local-first Chrome side-panel extension for safer LLM prompt optimization.

It helps you decide whether a prompt should be compressed, left alone, or converted into a structured handoff packet for coding, research, audit-sensitive work, or local-model workflows.

Features:
- Objective-aware prompt compression (compress, clarity, coding, local, research, audit)
- No-op detection when rewriting is not useful or safe
- Editable locked phrases and must-preserve facts
- Target platform selector (ChatGPT, Claude, Gemini, Codex, Ollama, DeepSeek)
- Aggression level selector (conservative, balanced, aggressive)
- Human-in-the-loop decision routing
- Built-in preset test gate for regression checks
- Local session history with export
- Mode comparison across all objectives
- Copy output, copy report, and user-confirmed insertion into active fields

Privacy-first:
- No network calls
- No remote code
- No account required
- No analytics
- No automatic scraping or insertion
- Text is processed locally in the browser extension runtime

promptPACK is not a generic summarizer. It is designed to preserve what matters.

## 5 screenshot descriptions

1. **Side panel main view** — The promptPACK side panel showing input area, objective selector, target platform, aggression level, preservation controls, and the compress button.
2. **Preset test gate passing** — All 6 preset tests passing (compression, short no-op, coding, audit, research, local model) with status table and objective detection results.
3. **Compression result with metrics** — A successful compression showing original tokens, output tokens, net saved, percent reduction, verdict badge, and decision route.
4. **History and export** — The history panel displaying past sessions with timestamps, objectives, token savings, and one-click restore/delete/export actions.
5. **Mode comparison table** — Running the same input through all 6 objectives side-by-side with previews, token counts, net saved/expanded, verdicts, and decision routes.

## Promo tile text

- **Small promo tile:** promptPACK — Compress prompts. Preserve the point.
- **Large promo tile:** promptPACK — Local-first, objective-aware prompt compression with preservation controls and human-in-the-loop routing.

## Privacy policy summary

promptPACK processes all text locally within the browser extension runtime. No user text, selections, or generated output is transmitted to any remote server. The extension does not perform network requests, use remote code, or collect analytics. Session history is stored locally using chrome.storage.local and never leaves the device. The content script reads selected text only after explicit user action ("Use selected text") and inserts output only after explicit user action ("Insert into active field").

## Permission justifications

| Permission | Justification |
|---|---|
| `sidePanel` | Required to display the promptPACK side-panel interface. |
| `activeTab` | Used only after user action so promptPACK can interact with the current active tab for reading selections or inserting output. |
| `scripting` | Required for Chrome extension content-script injection mechanics to enable user-triggered text insertion into page fields. |
| `storage` | Required to persist local session history, user preferences, and compression results within the browser. No cloud sync. |
