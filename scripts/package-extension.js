const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const root = process.cwd();
const dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const required = [
  "manifest.json",
  "src/service_worker.js",
  "src/content_script.js",
  "src/sidepanel.html",
  "src/sidepanel.js",
  "assets/icons/icon-16.png",
  "assets/icons/icon-32.png",
  "assets/icons/icon-48.png",
  "assets/icons/icon-128.png"
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required extension file: ${file}`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

if ((manifest.host_permissions || []).length !== 0) {
  throw new Error("Expected no host_permissions for this release candidate.");
}

const srcText = [
  "src/service_worker.js",
  "src/content_script.js",
  "src/sidepanel.js",
  "src/sidepanel.html"
].map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n");

const forbidden = ["fetch(", "XMLHttpRequest", "navigator.sendBeacon", "http://", "https://", "<script src=\"http", "<script src='http"];
for (const item of forbidden) {
  if (srcText.includes(item)) {
    throw new Error(`Forbidden network/remote-code pattern found: ${item}`);
  }
}

function copyFile(file) {
  const src = path.join(root, file);
  const dst = path.join(dist, file);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

for (const file of required) copyFile(file);

fs.writeFileSync(path.join(dist, "PACKAGE_README.txt"), `promptPACK ${manifest.version}

This is the extension-only package for Chrome Developer Mode or Chrome Web Store upload.

Install locally:
1. Unzip this folder.
2. Go to chrome://extensions.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select this unzipped folder.

Safety:
- No network calls
- No auto-insert
- No auto-send
- User-triggered selected-text import only
- User-triggered insertion only
`);

console.log(`Extension package staged in dist/`);
console.log(`Version: ${manifest.version}`);
console.log(`Files: ${required.length + 1}`);
