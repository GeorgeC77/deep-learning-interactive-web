import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

const VOCAB = ['猫', '坐', '在', '垫', '子', '上', '跑', '跳', '追', '球', '。'];

function softmax(logits: number[]) {
  const max = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function nextLogits(context: string[]) {
  // Toy deterministic logits based on last token
  const last = context[context.length - 1] ?? '';
  const idx = VOCAB.indexOf(last);
  const base = VOCAB.map((_, i) => Math.sin((i + 1) * (idx + 2)) + 0.5 * Math.cos(i * 3));
  if (last === '猫') base[VOCAB.indexOf('坐')] += 2;
  if (last === '坐') base[VOCAB.indexOf('在')] += 2;
  if (last === '在') base[VOCAB.indexOf('垫')] += 1.5;
  if (last === '垫') base[VOCAB.indexOf('子')] += 2;
  if (last === '子') base[VOCAB.indexOf('上')] += 1.5;
  if (last === '上') base[VOCAB.indexOf('。')] += 2;
  if (last === '。') base[VOCAB.indexOf('猫')] += 1;
  return base;
}

export default function AutoregressiveSamplingDemo() {
  const [mode, setMode] = useState<'greedy' | 'topk' | 'nucleus'>('greedy');
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.7);
  const [sequence, setSequence] = useState<string[]>(['猫', '坐']);
  const [lastProbs, setLastProbs] = useState<number[] | null>(null);

  const step = () => {
    const logits = nextLogits(sequence);
    const probs = softmax(logits);
    setLastProbs(probs);
    let chosen: number;
    if (mode === 'greedy') {
      chosen = probs.indexOf(Math.max(...probs));
    } else if (mode === 'topk') {
      const indexed = probs.map((pr, i) => ({ pr, i })).sort((a, b) => b.pr - a.pr);
      const top = indexed.slice(0, k);
      const mass = top.reduce((s, t) => s + t.pr, 0);
      const r = Math.random() * mass;
      let cum = 0;
      chosen = top[0].i;
      for (const t of top) {
        cum += t.pr;
        if (r <= cum) {
          chosen = t.i;
          break;
        }
      }
    } else {
      const indexed = probs.map((pr, i) => ({ pr, i })).sort((a, b) => b.pr - a.pr);
      let cum = 0;
      const nucleus: { pr: number; i: number }[] = [];
      for (const t of indexed) {
        cum += t.pr;
        nucleus.push(t);
        if (cum >= p) break;
      }
      const mass = nucleus.reduce((s, t) => s + t.pr, 0);
      const r = Math.random() * mass;
      let c = 0;
      chosen = nucleus[0].i;
      for (const t of nucleus) {
        c += t.pr;
        if (r <= c) {
          chosen = t.i;
          break;
        }
      }
    }
    setSequence((s) => [...s, VOCAB[chosen]]);
  };

  const reset = () => {
    setSequence(['猫', '坐']);
    setLastProbs(null);
  };

  return (
    <InteractiveDemo title="自回归文本生成与采样策略">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['greedy', 'topk', 'nucleus'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-sm border ${mode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {m === 'greedy' ? 'Greedy' : m === 'topk' ? `Top-k (k=${k})` : `Nucleus (p=${p.toFixed(2)})`}
            </button>
          ))}
        </div>

        {mode === 'topk' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>k</span>
              <span>{k}</span>
            </div>
            <Slider value={[k]} min={1} max={VOCAB.length} step={1} onValueChange={(v) => setK(v[0])} />
          </div>
        )}
        {mode === 'nucleus' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>p</span>
              <span>{p.toFixed(2)}</span>
            </div>
            <Slider value={[p]} min={0.1} max={1} step={0.05} onValueChange={(v) => setP(v[0])} />
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 font-mono text-lg min-h-[3rem]">
          {sequence.join('')}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={step} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            生成下一个 token
          </button>
          <button type="button" onClick={reset} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
            重置
          </button>
        </div>

        {lastProbs && (
          <div className="grid grid-cols-11 gap-1 text-center text-xs">
            {VOCAB.map((t, i) => (
              <div key={t} className="bg-white border rounded p-1">
                <div className="font-bold">{t}</div>
                <div className="text-gray-600">{(lastProbs[i] * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Greedy：</strong>每步选概率最大 token，确定性最高，容易重复。</p>
          <p><strong>Top-k：</strong>只在概率最高的 k 个候选中按相对概率采样。</p>
          <p><strong>Nucleus (top-p)：</strong>从最小累积概率 ≥ p 的集合中采样，动态调整候选数量。</p>
          <KaTeX math={String.raw`p(x_t \mid x_{<t}) = \frac{\exp(z_t / \tau)}{\sum_{t'} \exp(z_{t'} / \tau)}`} />
        </div>
      </div>
    </InteractiveDemo>
  );
}
