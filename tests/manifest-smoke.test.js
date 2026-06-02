const fs = require("fs");

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

const required = [
  ["manifest_version", 3],
  ["name", "promptPACK"],
];

for (const [key, value] of required) {
  if (manifest[key] !== value) {
    throw new Error(`manifest.${key} expected ${value}, got ${manifest[key]}`);
  }
}

if (!manifest.side_panel?.default_path) {
  throw new Error("Missing side_panel.default_path");
}

if (!manifest.content_scripts?.length) {
  throw new Error("Missing content script registration");
}

if ((manifest.host_permissions || []).length !== 0) {
  throw new Error("Expected no broad host_permissions in this local-first spike.");
}

console.log("manifest smoke test passed");
