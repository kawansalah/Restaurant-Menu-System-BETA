#!/usr/bin/env node
// Obfuscate JS files in the Vite `dist` folder using javascript-obfuscator
// This script is intended to be run after `vite build` (postbuild).

const fs = require('fs');
const path = require('path');
const { obfuscate } = require('javascript-obfuscator');

const DIST_DIR = path.join(__dirname, '..', 'dist');

// Only run in production environment to avoid slowing local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  console.log('Skipping obfuscation: not in production or VERCEL environment');
  process.exit(0);
}

function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const obfuscated = obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      renameGlobals: false,
      reservedNames: [],
      seed: 12345,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscated, 'utf8');
    console.log('Obfuscated:', filePath);
  } catch (err) {
    console.error('Failed to obfuscate', filePath, err);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((f) => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full);
    } else if (stat.isFile() && full.endsWith('.js')) {
      // skip source maps
      if (full.endsWith('.map.js')) return;
      obfuscateFile(full);
    }
  });
}

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist directory not found. Run `npm run build` first.');
  process.exit(1);
}

console.log('Starting obfuscation in', DIST_DIR);
walkDir(DIST_DIR);
console.log('Obfuscation complete.');
