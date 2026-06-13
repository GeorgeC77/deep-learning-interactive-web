import { useState, useMemo } from 'react';
import { ShieldAlert, Brain, CheckCircle2 } from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';

const EXAMPLE_EMAILS = [
  { text: '恭喜您中奖了！请点击链接领取奖金', label: '垃圾邮件' as const },
  { text: '今晚开会讨论项目进度', label: '正常邮件' as const },
  { text: '限时优惠，立即购买享受折扣', label: '垃圾邮件' as const },
  { text: '明天下午三点交报告', label: '正常邮件' as const },
];

const TRAIN_SPAM = [
  '中奖 奖金 点击 链接 领取 免费 优惠 立即 购买',
  '限时 优惠 抢购 特价 免费 赠送 点击 查看',
  '恭喜 您 中奖 了 请 尽快 联系 客服 领取',
  '免费 获得 iphone 点击 链接 填写 信息',
];

const TRAIN_HAM = [
  '明天 下午 开会 讨论 项目 进度',
  '报告 已经 提交 请 查收 附件',
  '今晚 三点 交 报告 记得 按时',
  '会议 记录 已经 发送 请 确认',
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function buildVocabAndCounts(docs: string[]) {
  const counts: Record<string, number> = {};
  let total = 0;
  docs.forEach((doc) => {
    tokenize(doc).forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
      total += 1;
    });
  });
  return { counts, total };
}

export default function NaiveBayesPage() {
  const [input, setInput] = useState('限时优惠，点击链接领取免费奖品');

  const spamData = useMemo(() => buildVocabAndCounts(TRAIN_SPAM), []);
  const hamData = useMemo(() => buildVocabAndCounts(TRAIN_HAM), []);
  const vocab = useMemo(() => {
    const set = new Set<string>();
    Object.keys(spamData.counts).forEach((w) => set.add(w));
    Object.keys(hamData.counts).forEach((w) => set.add(w));
    return set;
  }, [spamData, hamData]);

  const result = useMemo(() => {
    const words = tokenize(input);
    if (words.length === 0) return null;

    const priorSpam = TRAIN_SPAM.length / (TRAIN_SPAM.length + TRAIN_HAM.length);
    const priorHam = TRAIN_HAM.length / (TRAIN_SPAM.length + TRAIN_HAM.length);

    let logSpam = Math.log(priorSpam);
    let logHam = Math.log(priorHam);

    words.forEach((word) => {
      const spamProb = ((spamData.counts[word] || 0) + 1) / (spamData.total + vocab.size);
      const hamProb = ((hamData.counts[word] || 0) + 1) / (hamData.total + vocab.size);
      logSpam += Math.log(spamProb);
      logHam += Math.log(hamProb);
    });

    const spamScore = Math.exp(logSpam);
    const hamScore = Math.exp(logHam);
    const total = spamScore + hamScore;
    return {
      spamProb: total > 0 ? spamScore / total : 0.5,
      words,
    };
  }, [input, spamData, hamData, vocab]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第四章 · 生成学习算法
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">朴素贝叶斯</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          朴素贝叶斯假设给定类别后，各个特征条件独立。虽然这个假设很"朴素"，
          但它在文本分类等任务上往往效果出奇地好。
        </p>

        {/* Copyright Notice */}
        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-5 py-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">
            © 版权声明：本课程内容仅供个人学习交流使用，采用 CC BY-NC 4.0 许可。未经授权，严禁以任何形式用于商业用途。
          </span>
        </div>
      </section>

      {/* Naive assumption */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-violet-600" />
          <h2 className="text-2xl font-bold text-gray-900">朴素贝叶斯假设</h2>
        </div>
        <p className="text-gray-700 mb-4">
          假设特征向量 <KaTeX math={String.raw`x = (x_1, x_2, \dots, x_n)`} />，朴素贝叶斯假设：
        </p>

        <FormulaCard
          title="条件独立性假设"
          formula={
            <KaTeX
              math={String.raw`p(x \mid y) = p(x_1 \mid y) \, p(x_2 \mid y) \cdots p(x_n \mid y) = \prod_{j=1}^{n} p(x_j \mid y)`}
              display
            />
          }
          description="给定类别 y 后，所有特征相互独立。"
        />

        <p className="text-gray-700 mb-4">
          结合贝叶斯定理，得到分类规则：
        </p>

        <FormulaCard
          title="朴素贝叶斯分类器"
          formula={
            <KaTeX
              math={String.raw`p(y \mid x) \propto p(y) \prod_{j=1}^{n} p(x_j \mid y)`}
              display
            />
          }
          description="预测时选择使上式最大的类别 y。"
        />
      </section>

      {/* Laplace smoothing */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">拉普拉斯平滑</h2>
        <p className="text-gray-700 mb-4">
          如果某个词在训练集中从未出现在某个类别里，直接相乘会得到 0 概率。拉普拉斯平滑为每个特征计数加 1：
        </p>

        <FormulaCard
          title="平滑后的条件概率"
          formula={
            <KaTeX
              math={String.raw`p(x_j \mid y) = \frac{\text{count}(x_j, y) + 1}{\text{count}(y) + |V|}`}
              display
            />
          }
          description="|V| 是词汇表大小。这样即使某个词未出现，概率也不会为 0。"
        />
      </section>

      {/* Interactive demo */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：垃圾邮件分类器</h2>
        <p className="text-gray-700 mb-4">
          下面是一个用 4 封垃圾邮件和 4 封正常邮件训练的小型朴素贝叶斯分类器。
          输入一段中文文本，观察模型如何判断它是垃圾邮件还是正常邮件。
        </p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium text-gray-700">输入邮件内容</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="输入一段中文文本..."
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_EMAILS.map((ex) => (
              <button
                key={ex.text}
                onClick={() => setInput(ex.text)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
              >
                {ex.label === '垃圾邮件' ? '🚫' : '✉️'} {ex.text.slice(0, 12)}...
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">识别结果</span>
              <span className={`font-bold ${result.spamProb > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {result.spamProb > 0.5 ? '垃圾邮件' : '正常邮件'}（{(Math.max(result.spamProb, 1 - result.spamProb) * 100).toFixed(1)}%）
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-600">垃圾邮件概率</span>
                  <span className="font-mono">{(result.spamProb * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-rose-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${result.spamProb * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-600">正常邮件概率</span>
                  <span className="font-mono">{((1 - result.spamProb) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(1 - result.spamProb) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              分词结果：{result.words.join(' · ') || '（无有效词汇）'}
            </div>
          </div>
        )}
      </section>

      {/* When to use */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">适用场景</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">文本分类</h3>
            <p className="text-sm text-gray-700">垃圾邮件过滤、情感分析、新闻分类等。词袋特征天然适合条件独立性假设。</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
            <h3 className="font-semibold text-violet-800 mb-2">小数据集</h3>
            <p className="text-sm text-gray-700">参数少、训练快，在数据量不大时也能给出合理的概率估计。</p>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-violet-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-violet-800">
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>朴素贝叶斯假设给定类别后特征条件独立。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>拉普拉斯平滑避免零概率问题。</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">●</span>
            <span>文本分类是朴素贝叶斯最经典的应用场景之一。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
