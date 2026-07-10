const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../src/course/manifest.ts');
let s = fs.readFileSync(manifestPath, 'utf8');

const updates = [
  ['/ch07/convolutional-filters', 'teaching-ready'],
  ['/ch07/object-detection', 'teaching-ready'],
  ['/ch07/image-segmentation', 'teaching-ready'],
  ['/ch09/natural-language', 'content-reviewed'],
  ['/ch09/transformer-language-models', 'teaching-ready'],
  ['/ch10/neural-message-passing', 'teaching-ready'],
  ['/ch11/basic-sampling-algorithms', 'teaching-ready'],
  ['/ch11/markov-chain-monte-carlo', 'teaching-ready'],
  ['/ch15/coupling-flows', 'teaching-ready'],
];

for (const [p, status] of updates) {
  const marker = `path: "${p}"`;
  const idx = s.indexOf(marker);
  if (idx === -1) {
    console.log('not found', p);
    continue;
  }
  const statusIdx = s.indexOf('status: "', idx);
  const endIdx = s.indexOf('"', statusIdx + 9);
  s = s.slice(0, statusIdx + 9) + status + s.slice(endIdx);
}

fs.writeFileSync(manifestPath, s, 'utf8');
console.log('Updated', updates.length, 'statuses.');
