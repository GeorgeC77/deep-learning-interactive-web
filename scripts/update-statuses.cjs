const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_TS = path.join(ROOT, 'src', 'course', 'manifest.ts');
const APP_TSX = path.join(ROOT, 'src', 'App.tsx');

const WRONG_MAPPINGS = new Set([
  '/ch01/decision-theory',
  '/ch02/discriminant-functions',
  '/ch02/decision-theory',
  '/ch09/overview',
  '/ch09/natural-language',
  '/ch09/transformer-language-models',
  '/ch09/multimodal-transformers',
  '/ch12/evidence-lower-bound',
  '/ch13/overview',
  '/ch13/probabilistic-latent-variables',
]);

const TEACHING_READY = new Set(['/ch01/bias-variance', '/ch09/attention']);

function extractSectionComponents(source) {
  const match = source.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\};/);
  if (!match) throw new Error('Could not find sectionComponents');
  const block = match[1];
  const map = {};
  const regex = /'([^']+)':\s*(\w+),/g;
  let m;
  while ((m = regex.exec(block)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

function parseManifestSections(source) {
  const sections = [];
  const regex = /\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*path:\s*"([^"]+)",\s*status:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(source)) !== null) {
    sections.push({ id: m[1], title: m[2], path: m[3], status: m[4] });
  }
  return sections;
}

function inferStatus(section, componentName) {
  if (!componentName || WRONG_MAPPINGS.has(section.path)) return 'draft';
  if (TEACHING_READY.has(section.path)) return 'teaching-ready';
  if (componentName.startsWith('Ch') || /Page$/.test(componentName)) {
    // Generated pages live in pages/generated and their component names
    // are derived from path (e.g. Ch04OverviewPage). Old manual pages
    // are also Page-suffixed; treat all mapped pages as content-reviewed
    // unless explicitly marked wrong or teaching-ready.
    return 'content-reviewed';
  }
  return 'draft';
}

function main() {
  const manifestSource = fs.readFileSync(MANIFEST_TS, 'utf8');
  const appSource = fs.readFileSync(APP_TSX, 'utf8');
  const components = extractSectionComponents(appSource);
  const sections = parseManifestSections(manifestSource);

  let updated = manifestSource;
  for (const section of sections) {
    const componentName = components[section.path];
    const newStatus = inferStatus(section, componentName);
    if (newStatus === section.status) continue;
    updated = updated.replace(
      new RegExp(`(path: "${section.path.replace(/\//g, '\\/')}",\\s*)status: "${section.status}"`, 'g'),
      `$1status: "${newStatus}"`
    );
  }

  fs.writeFileSync(MANIFEST_TS, updated, 'utf8');
  console.log(`Updated statuses in ${path.relative(ROOT, MANIFEST_TS)}`);
}

main();
