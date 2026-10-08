const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
const missingAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(id => !ids.includes(id));
const assetRefs = [...html.matchAll(/(?:src|href|poster)="(assets\/[^"]+)"/g)].map(m => m[1]);
const missingAssets = assetRefs.filter(ref => !fs.existsSync(path.join(root, ref)));
const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const issues = {duplicateIds, missingAnchors, missingAssets, h1Count:(html.match(/<h1\b/g)||[]).length, jsonLdBlocks:jsonLd.length};
if (duplicateIds.length || missingAnchors.length || missingAssets.length || issues.h1Count !== 1 || !jsonLd.length) {
  console.error(issues);
  process.exitCode = 1;
} else console.log('Static audit passed:', issues);
