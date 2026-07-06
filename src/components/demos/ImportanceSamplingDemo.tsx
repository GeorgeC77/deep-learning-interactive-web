import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';

function gaussian(x: number, mu: number, sigma: number) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

export default function ImportanceSamplingDemo() {
  const [muQ, setMuQ] = useState(1.5);
  const [nSamples, setNSamples] = useState(200);

  const p = (x: number) => gaussian(x, 0, 1);
  const q = (x: number) => gaussian(x, muQ, 1);
  const w = (x: number) => p(x) / q(x);

  // Fixed seeded-ish samples for stability (deterministic pseudo-random)
  const samples = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < nSamples; i++) {
      // Box-Muller from deterministic uniform
      const u1 = ((i * 9301 + 49297) % 233280) / 233280;
      const u2 = ((i * 49297 + 9301) % 233280) / 233280;
      const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
      arr.push(muQ + z);
    }
    return arr;
  }, [muQ, nSamples]);

  const weights = samples.map(w);
  const sumW = weights.reduce((a, b) => a + b, 0);
  const sumW2 = weights.reduce((a, b) => a + b * b, 0);
  const ess = sumW * sumW / (sumW2 || 1);

  // SVG path for p and q densities
  const xs = Array.from({ length: 200 }, (_, i) => -5 + (i / 199) * 10);
  const maxY = Math.max(...xs.map((x) => Math.max(p(x), q(x))));
  const pathP = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${20 + (x + 5) * 35} ${180 - (p(x) / maxY) * 140}`).join(' ');
  const pathQ = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${20 + (x + 5) * 35} ${180 - (q(x) / maxY) * 140}`).join(' ');

  return (
    <InteractiveDemo title="重要性采样：p=N(0,1), q=N(μ,1)">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>q 的均值 μ</span>
              <span>{muQ.toFixed(2)}</span>
            </div>
            <Slider value={[muQ]} min={-3} max={3} step={0.1} onValueChange={(v) => setMuQ(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>样本数 N</span>
              <span>{nSamples}</span>
            </div>
            <Slider value={[nSamples]} min={50} max={1000} step={50} onValueChange={(v) => setNSamples(v[0])} />
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">w(0) = p(0)/q(0)</div>
            <div className="text-2xl font-bold text-blue-700">{w(0).toFixed(3)}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">有效样本量 ESS</div>
            <div className="text-2xl font-bold text-emerald-700">{ess.toFixed(1)} / {nSamples}</div>
          </div>
        </div>

        <div className="space-y-4">
          <svg viewBox="0 0 370 200" className="w-full h-56 bg-gray-50 border rounded-lg">
            <path d={pathP} fill="none" stroke="#2563eb" strokeWidth={2} />
            <path d={pathQ} fill="none" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 2" />
            <text x="340" y="30" fontSize={12} fill="#2563eb">p</text>
            <text x="340" y="50" fontSize={12} fill="#dc2626">q</text>
            {samples.slice(0, 80).map((x, i) => (
              <circle
                key={i}
                cx={20 + (x + 5) * 35}
                cy={180 - (q(x) / maxY) * 140}
                r={1.5}
                fill="rgba(220,38,38,0.4)"
              />
            ))}
          </svg>
          <div className="text-sm text-gray-700 space-y-2">
            <KaTeX math={String.raw`w(x)=\frac{p(x)}{q(x)}=\frac{\exp(-x^2/2)}{\exp(-(x-\mu)^2/2)}=\exp\left(\frac{2\mu x - \mu^2}{2}\right)`} />
            <p>在 x=0 处，权重为 exp(μ²/2)。当 μ 远离 0 时，少数样本权重极大，ESS 下降，估计方差增大。</p>
            <p>
              <strong>加权估计：</strong>用样本均值估计 E_p[f(X)] 时，应使用加权平均
              <KaTeX math={String.raw`\hat{\mu}=\frac{\sum_i w(x_i)f(x_i)}{\sum_i w(x_i)}`} />
              。
            </p>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
