import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

const target = (x: number) => 0.5 * Math.exp(-0.5 * (x - 2) * (x - 2)) + 0.5 * Math.exp(-0.5 * (x + 2) * (x + 2));

export default function MetropolisHastingsDemo() {
  const [proposalWidth, setProposalWidth] = useState(1.0);
  const [asymBias, setAsymBias] = useState(0.3);
  const [steps, setSteps] = useState(500);
  const [mode, setMode] = useState<'symmetric' | 'asymmetric'>('symmetric');
  const [seed, setSeed] = useState(0);

  const chain = useMemo(() => {
    const samples: number[] = [];
    let x = 0;
    let accepted = 0;
    for (let i = 0; i < steps; i++) {
      const u1 = Math.sin(i * 12.9898 + seed) * 43758.5453 % 1;
      const u2 = Math.sin(i * 78.233 + seed) * 43758.5453 % 1;
      const z = Math.sqrt(-2 * Math.log(Math.abs(u1) + 1e-10)) * Math.cos(2 * Math.PI * Math.abs(u2));
      const xp = mode === 'symmetric' ? x + proposalWidth * z : x + asymBias + proposalWidth * z;
      const pX = target(x);
      const pXp = target(xp);
      let alpha = 1;
      if (mode === 'symmetric') {
        alpha = Math.min(1, pXp / pX);
      } else {
        // q(x'|x) ~ N(x + bias, sigma^2); q(x|x') ~ N(x' - bias, sigma^2)
        // ratio q(x|x')/q(x'|x) = exp(-((x - (x'-bias))^2 - (xp - (x+bias))^2)/(2 sigma^2))
        const sigma2 = proposalWidth * proposalWidth;
        const logRatio = -0.5 * ((x - (xp - asymBias)) ** 2 - (xp - (x + asymBias)) ** 2) / sigma2;
        alpha = Math.min(1, (pXp / pX) * Math.exp(logRatio));
      }
      if (Math.abs(u2) < alpha) {
        x = xp;
        accepted++;
      }
      samples.push(x);
    }
    return { samples, accepted };
  }, [proposalWidth, asymBias, steps, mode, seed]);

  const histogram = useMemo(() => {
    const bins = Array(40).fill(0);
    chain.samples.forEach((x) => {
      const idx = Math.floor(((x + 6) / 12) * 40);
      if (idx >= 0 && idx < 40) bins[idx]++;
    });
    const max = Math.max(...bins, 1);
    return bins.map((c) => c / max);
  }, [chain.samples]);

  return (
    <InteractiveDemo title="Metropolis-Hastings 接受率对比">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['symmetric', 'asymmetric'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-sm border ${mode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {m === 'symmetric' ? '对称提议 (Metropolis)' : '非对称提议 (M-H)'}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>提议标准差 σ</span>
                <span>{proposalWidth.toFixed(2)}</span>
              </div>
              <Slider value={[proposalWidth]} min={0.1} max={3} step={0.1} onValueChange={(v) => setProposalWidth(v[0])} />
            </div>
            {mode === 'asymmetric' && (
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>提议偏置 b</span>
                  <span>{asymBias.toFixed(2)}</span>
                </div>
                <Slider value={[asymBias]} min={-1} max={1} step={0.05} onValueChange={(v) => setAsymBias(v[0])} />
              </div>
            )}
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>迭代步数</span>
                <span>{steps}</span>
              </div>
              <Slider value={[steps]} min={100} max={2000} step={100} onValueChange={(v) => setSteps(v[0])} />
            </div>
            <button type="button" onClick={() => setSeed((s) => s + 1)} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              重新采样
            </button>
            <p className="text-sm text-gray-700">接受率：{((chain.accepted / steps) * 100).toFixed(1)}%</p>
          </div>

          <div className="space-y-4">
            <svg viewBox="0 0 400 160" className="w-full h-48 bg-gray-50 border rounded-lg">
              {/* target density */}
              {Array.from({ length: 200 }, (_, i) => {
                const x = -6 + (i / 199) * 12;
                const y = target(x);
                const x2 = -6 + ((i + 1) / 199) * 12;
                const y2 = target(x2);
                return (
                  <line
                    key={i}
                    x1={20 + (x + 6) * 30}
                    y1={140 - y * 120}
                    x2={20 + (x2 + 6) * 30}
                    y2={140 - y2 * 120}
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                );
              })}
              {/* histogram */}
              {histogram.map((h, i) => (
                <rect
                  key={i}
                  x={20 + i * 9}
                  y={140 - h * 100}
                  width={8}
                  height={h * 100}
                  fill="rgba(16,185,129,0.5)"
                />
              ))}
            </svg>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>对称提议（Metropolis）：</strong>q(x'|x)=q(x|x')，接受率简化为 min(1, p(x')/p(x))。</p>
              <p><strong>非对称提议（Metropolis-Hastings）：</strong>必须引入提议比例修正：</p>
              <KaTeX math={String.raw`A(x\to x')=\min\!\left(1,\frac{p(x')\,q(x\mid x')}{p(x)\,q(x'\mid x)}\right)`} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
