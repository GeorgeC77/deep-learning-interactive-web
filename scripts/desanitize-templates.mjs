import fs from 'node:fs';
import path from 'node:path';

const generatedDir = 'src/pages/generated';
const files = fs.readdirSync(generatedDir).filter((f) => f.endsWith('.tsx'));

const replacements = [
  {
    old: '把不同小节的概念混为一谈，忽视它们的假设与适用范围。',
    new: '混淆本节核心概念与相邻小节的前提假设，导致错误套用。',
  },
  {
    old: '只看公式形式而不验证推导条件或数值实例。',
    new: '只记忆公式形式，而不验证其成立条件与具体数值。',
  },
  {
    old: '的结果与直觉相反，首先应该检查什么？',
    new: '的结果违背直觉，应优先排查哪些前提假设？',
  },
  {
    old: '写出本节一个核心公式的具体形式并解释每个符号。',
    new: '推导本节核心公式的展开形式并说明每个符号含义。',
  },
  {
    old: '比较本节结论与前面一节结论的适用场景差异。',
    new: '对比本节结论与先前章节结论的适用条件差异。',
  },
];

for (const file of files) {
  const fullPath = path.join(generatedDir, file);
  let text = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  for (const { old, new: replacement } of replacements) {
    if (text.includes(old)) {
      text = text.split(old).join(replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(fullPath, text, 'utf8');
    console.log(`Updated ${fullPath}`);
  }
}
