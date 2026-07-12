# promptPACK

<p align="center">
  <a href="https://lumenhelix.com">
    <img src="docs/assets/lumenhelix-logo.svg" alt="LumenHelix Solutions" width="180">
  </a>
</p>

<h3 align="center">Chrome extension for objective-aware prompt compression and human-in-the-loop handoff</h3>

<p align="center">
  <a href="https://lumenhelixsolutions.github.io/promptPACK/">
    <img src="https://img.shields.io/badge/Launch_Page-promptPACK-00D4FF?style=flat-square&logo=githubpages&logoColor=white" alt="Launch Page">
  </a>
  <a href="https://lumenhelix.com">
    <img src="https://img.shields.io/badge/Built_by-LumenHelix-7C3AED?style=flat-square" alt="Built by LumenHelix">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-8A95A8?style=flat-square" alt="License">
</p>

---

**promptPACK** is part of the [LumenHelix Solutions](https://lumenhelix.com) portfolio — applied symbolic dynamics & reversible computation for deterministic, traceable AI systems.

promptPACK is a local-first Chrome extension by LumenHelix for objective-aware prompt compression. It inspects what the user is trying to accomplish, then compresses the prompt, leaves it untouched, or converts it into a structured handoff packet — always preserving must-facts and keeping the human in the loop.

## Why this exists

- **Stay accurate.** No-op and preservation gates prevent rewrite-induced information loss.
- **Stay private.** Everything runs locally; no data leaves your machine.
- **Stay in control.** Insertion and compression happen only after explicit user action.

## Quick start

Install and run promptPACK in under two minutes.

### macOS / Linux

```bash
# Clone
git clone https://github.com/lumenhelixsolutions/promptPACK.git
cd promptPACK

# Install & run
# Install test dependencies
npm install

# Verify the extension passes its own gates
npm run ci

# Load in Chrome
# 1. Open Chrome and go to chrome://extensions
# 2. Enable Developer mode (toggle top-right)
# 3. Click Load unpacked
# 4. Select the promptPACK repository folder
# 5. Open the promptPACK side panel and run Preset Tests → Run all
# Expected: PASS 6 / WARN 0 / FAIL 0
```

### Windows (PowerShell)

```powershell
# Clone
git clone https://github.com/lumenhelixsolutions/promptPACK.git
Set-Location promptPACK

# Install & run
# Install test dependencies
npm install

# Verify the extension passes its own gates
npm run ci

# Load in Chrome
# 1. Open Chrome and go to chrome://extensions
# 2. Enable Developer mode (toggle top-right)
# 3. Click Load unpacked
# 4. Select the promptPACK repository folder
# 5. Open the promptPACK side panel and run Preset Tests → Run all
# Expected: PASS 6 / WARN 0 / FAIL 0
```

### Windows (Git Bash / WSL)

```bash
git clone https://github.com/lumenhelixsolutions/promptPACK.git
cd promptPACK
# Install test dependencies
npm install

# Verify the extension passes its own gates
npm run ci

# Load in Chrome
# 1. Open Chrome and go to chrome://extensions
# 2. Enable Developer mode (toggle top-right)
# 3. Click Load unpacked
# 4. Select the promptPACK repository folder
# 5. Open the promptPACK side panel and run Preset Tests → Run all
# Expected: PASS 6 / WARN 0 / FAIL 0
```

> **Device note:** promptPACK is tested on Windows 11, macOS Sonoma, Ubuntu 22.04/24.04, and modern mobile browsers.

## Full documentation

Visit the launch page for architecture, API reference, and deployment guides:  
**https://lumenhelixsolutions.github.io/promptPACK/**

## Features

| Feature | What it gives you |
|---------|-------------------|
| Objective-aware compression | Detects intent and picks token compression, no-op, or structured handoff accordingly. |
| Must-fact preservation | Locks critical facts so rewrites never drop the context that matters. |
| Local-first privacy | No network calls, no analytics, no remote code — your prompts stay in the browser. |
| Human-in-the-loop handoff | Builds compact coding, research, or local-LLM packets only when you approve. |

## Architecture at a glance

```
promptPACK/
├── manifest.json         MV3 manifest
├── src/
│   ├── sidepanel.html    Main UI
│   ├── sidepanel.js      Compression + handoff logic
│   ├── service_worker.js Background events
│   ├── content_script.js Page text selection
│   ├── options.html/js   Extension options
│   └── theme.css         UI styling
├── assets/               Icons, screenshots, logo
├── tests/                Preset and manifest smoke tests
└── scripts/              Packaging and audit tools
```

## Development

```bash
npm install
npm run commercial:gate
```

## Roadmap

- [ ] Chrome Web Store production release
- [ ] Custom compression presets
- [ ] Export/import handoff packets

## Support & consulting

Need deterministic AI systems with full traceability? LumenHelix builds reversible computation kernels, governance layers, and end-to-end AI integrations.

- **Website:** https://lumenhelix.com
- **Services:** AI diagnostics, B.Y.O. support packages, governance audits
- **Research:** TEN² kernel, R.U.B.I.C. boundary discipline, C.O.R.E. constraint lens

## License

Released under the MIT License.

---

<p align="center">
  <sub>Engineered by <a href="https://lumenhelix.com">LumenHelix Solutions</a> — Applied Symbolic Dynamics & Reversible Computation.</sub>
</p>
