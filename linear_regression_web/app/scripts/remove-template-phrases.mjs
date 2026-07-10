import fs from 'node:fs';
import path from 'node:path';

const replacements = [
  { from: '与本节讨论的问题完全无关', to: '只是术语，没有独立建模意义' },
  { from: '在任何情况下都不需要额外假设即可使用', to: '不需要任何分布假设即可直接使用' },
  { from: '只要样本量足够大，前提假设就不重要', to: '只要模型足够复杂，数据分布的形状就不重要' },
  { from: '结果与直觉相反时首先应该检查假设', to: '结果与直觉相反时应重新审视模型假设' },
  { from: '复述本节核心公式并说明每个符号含义', to: '写出本节一个核心公式的具体形式并解释每个符号' },
  { from: '找出本节结论与相邻小节结论的异同', to: '比较本节结论与前面一节结论的适用场景差异' },
];

const dir = 'src/pages/generated';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));

let totalReplacements = 0;

for (const file of files) {
  const fullPath = path.join(dir, file);
  let text = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const { from, to } of replacements) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const count = (text.match(re) || []).length;
    if (count > 0) {
      text = text.replace(re, to);
      totalReplacements += count;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log(`Total template phrase replacements: ${totalReplacements}`);
