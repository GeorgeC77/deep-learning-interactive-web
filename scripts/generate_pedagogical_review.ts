/**
 * Generate reports/pedagogical_review.md
 *
 * For every teaching-ready route we check six pedagogical dimensions:
 *   What          — does the page state what the concept is?
 *   Why           — is there a formula-free "为什么？" motivation card?
 *   How           — are concepts / core intuition / formulas present?
 *   Counterexample— is there at least one 反例 that breaks a wrong intuition?
 *   Interactive   — is there an interactive experiment (demo / lab)?
 *   Real-world    — is there real-world intuition (核心直觉)?
 *
 * The goal is 100% pedagogical coverage for all core chapters.
 */
import fs from 'node:fs';
import { getAllSections } from '../src/course/manifest.ts';

const appText = fs.readFileSync('src/App.tsx', 'utf8');

const importMap: Record<string, string> = {};
for (const m of appText.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g)) {
  importMap[m[1]] = m[2];
}

const routeComponentMap: Record<string, string> = {};
const scMatch = appText.match(/const sectionComponents: Record<string, React\.ComponentType> = \{([\s\S]*?)\n\};/);
if (scMatch) {
  for (const m of scMatch[1].matchAll(/['"]([^'"]+)['"]\s*:\s*(\w+),?/g)) {
    routeComponentMap[m[1]] = m[2];
  }
}

function resolveComponentFile(importSource: string): string {
  if (!importSource) return '';
  const rel = importSource.replace(/^\.\//, '');
  return `src/${rel}.tsx`;
}

type Dim = { key: string; label: string; test: (text: string) => boolean };

const DIMS: Dim[] = [
  { key: 'what', label: 'What', test: (t) => /summary=\{/.test(t) || /text-lg text-gray-600/.test(t) },
  { key: 'why', label: 'Why', test: (t) => /whyCards=\{/.test(t) || /为什么？/.test(t) || /MessageCircleQuestion/.test(t) },
  { key: 'how', label: 'How', test: (t) => /concepts=\{/.test(t) || /coreIntuition=\{/.test(t) || /ConceptCard/.test(t) || /核心概念/.test(t) },
  { key: 'counterexample', label: 'Counterexample', test: (t) => /counterexamples=\{/.test(t) || /反例/.test(t) || /FlaskConical/.test(t) },
  { key: 'interactive', label: 'Interactive', test: (t) => /interactiveDemo=\{/.test(t) || /extraContent=\{/.test(t) || /demo=\{\{/.test(t) || /InteractiveDemo/.test(t) || /components\/demos\//.test(t) },
  { key: 'realWorld', label: 'Real-world Intuition', test: (t) => /coreIntuition=\{/.test(t) || /核心直觉/.test(t) },
];

type Row = {
  path: string;
  title: string;
  file: string;
  present: boolean[];
  coverage: number;
};

const rows: Row[] = [];
const dimHits = new Array(DIMS.length).fill(0);

for (const sec of getAllSections()) {
  const componentName = routeComponentMap[sec.path] ?? '';
  const file = resolveComponentFile(importMap[componentName] ?? '');
  if (!file || !fs.existsSync(file)) continue;
  // Only audit real generated content pages (skip legacy chapter pages).
  if (!file.includes('src/pages/generated/')) continue;
  const text = fs.readFileSync(file, 'utf8');
  const present = DIMS.map((d) => d.test(text));
  present.forEach((p, i) => { if (p) dimHits[i]++; });
  const coverage = Math.round((present.filter(Boolean).length / DIMS.length) * 100);
  rows.push({ path: sec.path, title: sec.title, file, present, coverage });
}

const totalCoverage = rows.length
  ? Math.round(rows.reduce((a, r) => a + r.coverage, 0) / rows.length)
  : 0;

const md: string[] = [
  '# Pedagogical Review Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '目标：让第一次学习这门课的学生能够真正形成正确直觉，而不仅仅是公式正确。',
  '',
  '## 检查维度（Pedagogical Dimensions）',
  '',
  '| 维度 | 学生是否…… |',
  '|------|--------------|',
  '| **What** | 知道这个概念“是什么” |',
  '| **Why** | 知道“为什么需要它”（不用公式的动机卡片） |',
  '| **How** | 知道“怎么工作”（概念 / 直觉 / 公式） |',
  '| **Counterexample** | 见过至少一个打破错误直觉的反例 |',
  '| **Interactive** | 能通过交互实验自己动手验证 |',
  '| **Real-world Intuition** | 能联系到真实世界直觉（核心直觉） |',
  '',
  '## 逐页检查（generated content pages）',
  '',
  `| 页面 | ${DIMS.map((d) => d.label).join(' | ')} | 覆盖率 |`,
  `|------|${DIMS.map(() => '---').join('|')}|---|`,
  ...rows.map((r) => {
    const marks = r.present.map((p) => (p ? '✅' : '❌')).join(' | ');
    return `| ${r.title}（\`${r.path}\`） | ${marks} | ${r.coverage}% |`;
  }),
  '',
  '## 覆盖率统计（Coverage）',
  '',
  `- 检查页面数：${rows.length}`,
  `- **总体 Pedagogical Coverage：${totalCoverage}%**`,
  '',
  '### 各维度覆盖页面数',
  '',
  ...DIMS.map((d, i) => `- **${d.label}**：${dimHits[i]} / ${rows.length} 页`),
  '',
  rows.some((r) => r.coverage < 100)
    ? `> ⚠️ 仍有 ${rows.filter((r) => r.coverage < 100).length} 个页面未达到 100% 覆盖，见上表 ❌ 项。`
    : '> ✅ 所有核心页面已达到 100% Pedagogical Coverage。',
  '',
];

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/pedagogical_review.md', md.join('\n'), 'utf8');

console.log(`Pedagogical review written: ${rows.length} generated pages, overall coverage ${totalCoverage}%.`);
