#!/usr/bin/env node
/**
 * PromptPack — Chrome Web Store Packaging Script
 * Usage: node scripts/package-for-cws.js
 * Output: dist/cws/ + dist/cws.zip + SHA256
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist', 'cws');
const ZIP = path.join(ROOT, 'dist', 'cws.zip');

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

function validateManifest() {
  const manifestPath = path.join(ROOT, 'manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('manifest.json not found');
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (m.manifest_version !== 3) throw new Error('Must be Manifest V3');
  if (!m.name || !m.version) throw new Error('Manifest missing name/version');

  const requiredIcons = ['16', '32', '48', '128'];
  for (const size of requiredIcons) {
    const iconPath = path.join(ROOT, m.icons[size]);
    if (!fs.existsSync(iconPath)) throw new Error(`Missing icon ${size}: ${m.icons[size]}`);
  }
  console.log('[Validate] manifest.json OK');
}

function main() {
  console.log('[PromptPack] Packaging for Chrome Web Store...');

  validateManifest();

  // Clean and recreate dist
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  ensureDir(DIST);

  // Copy required files
  copyFile(path.join(ROOT, 'manifest.json'), path.join(DIST, 'manifest.json'));
  copyFile(path.join(ROOT, 'package.json'), path.join(DIST, 'package.json'));
  copyDir(path.join(ROOT, 'src'), path.join(DIST, 'src'));
  copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  // Create ZIP
  if (fs.existsSync(ZIP)) fs.unlinkSync(ZIP);
  const isWin = process.platform === 'win32';
  const cmd = isWin
    ? `powershell -command "Compress-Archive -Path '${DIST}\\*' -DestinationPath '${ZIP}' -Force"`
    : `cd "${DIST}" && zip -r "${ZIP}" .`;
  execSync(cmd, { stdio: 'inherit' });

  const hash = crypto.createHash('sha256').update(fs.readFileSync(ZIP)).digest('hex');
  fs.writeFileSync(ZIP + '.sha256', `${hash}  cws.zip\n`);

  const stats = fs.statSync(ZIP);
  console.log(`[Build] cws.zip — ${(stats.size/1024).toFixed(1)} KB`);
  console.log(`[Build] SHA256: ${hash}`);
  console.log(`[Build] Done.`);
}

main();
