import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';
import {
  gaussian,
  sampleProposal,
  importanceEstimate,
  effectiveSampleSize,
  maxWeightShare,
  analyticTruth,
  INTEGRANDS,
  type Integrand,
} from '@/lib/math/importanceSampling';

const FIXED_SEED = 123;
const VIEW_W = 400;
const VIEW_H = 200;
const PAD_LEFT = 30;
const PAD_RIGHT = 30;
const PLOT_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const PLOT_BOTTOM = 180;
const PLOT_TOP = 20;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

export default function ImportanceSamplingDemo() {
  const [muQ, setMuQ] = useState(1.5);
  const [sigmaQ, setSigmaQ] = useState(1.0);
  const [nSamples, setNSamples] = useState(200);
  const [selectedId, setSelectedId] = useState<string>('x2');

  const integrand = useMemo<Integrand>(
    () => INTEGRANDS.find((i) => i.id === selectedId) ?? INTEGRANDS[0],
    [selectedId],
  );

  const p = useMemo(() => (x: number) => gaussian(x, 0, 1), []);
  const q = useMemo(() => (x: number) => gaussian(x, muQ, sigmaQ), [muQ, sigmaQ]);

  const samples = useMemo(
    () => sampleProposal(muQ, sigmaQ, nSamples, FIXED_SEED),
    [muQ, sigmaQ, nSamples],
  );

  const { estimate, weights } = useMemo(
    () => importanceEstimate(samples, integrand.fn, p, q),
    [samples, integrand, p, q],
  );

  const truth = useMemo(() => analyticTruth(integrand), [integrand]);
  const naive = useMemo(
    () => samples.reduce((acc, x) => acc + integrand.fn(x), 0) / samples.length,
    [samples, integrand],
  );
  const error = Math.abs(estimate - truth);
  const ess = effectiveSampleSize(weights);
  const maxShare = maxWeightShare(weights);

  const { xs, pathP, pathQ, maxY } = useMemo(() => {
    const xMin = Math.min(-4, muQ - 4 * sigmaQ);
    const xMax = Math.max(4, muQ + 4 * sigmaQ);
    const points = 200;
    const xsArr = Array.from({ length: points }, (_, i) => xMin + (i / (points - 1)) * (xMax - xMin));
    const my = Math.max(...xsArr.map((x) => Math.max(p(x), q(x))));
    const toCx = (x: number) => PAD_LEFT + ((x - xMin) / (xMax - xMin)) * PLOT_W;
    const toCy = (y: number) => PLOT_BOTTOM - (y / my) * PLOT_H;
    const pathP = xsArr.map((x, i) => `${i === 0 ? 'M' : 'L'} ${toCx(x)} ${toCy(p(x))}`).join(' ');
    const pathQ = xsArr.map((x, i) => `${i === 0 ? 'M' : 'L'} ${toCx(x)} ${toCy(q(x))}`).join(' ');
    return { xs: xsArr, pathP, pathQ, maxY: my };
  }, [muQ, sigmaQ, p, q]);

  const xMin = xs[0];
  const xMax = xs[xs.length - 1];
  const toCx = (x: number) => PAD_LEFT + ((x - xMin) / (xMax - xMin)) * PLOT_W;
  const toCy = (y: number) => PLOT_BOTTOM - (y / maxY) * PLOT_H;

  return (
    <InteractiveDemo title="重要性采样：p=N(0,1), q=N(μ,σ)">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>q 的均值 μ</span>
              <span>{muQ.toFixed(2)}</span>
            </div>
            <Slider value={[muQ]} min={-4} max={4} step={0.1} onValueChange={(v) => setMuQ(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>q 的标准差 σ</span>
              <span>{sigmaQ.toFixed(2)}</span>
            </div>
            <Slider
              value={[sigmaQ]}
              min={0.3}
              max={3.0}
              step={0.1}
              onValueChange={(v) => setSigmaQ(v[0])}
            />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>样本数 N</span>
              <span>{nSamples}</span>
            </div>
            <Slider
              value={[nSamples]}
              min={50}
              max={2000}
              step={50}
              onValueChange={(v) => setNSamples(v[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">被积函数 f</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              {INTEGRANDS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">解析真值 E_p[f]</div>
              <div className="text-xl font-bold text-blue-700">{truth.toFixed(4)}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">q-样本平均（有偏）</div>
              <div className="text-xl font-bold text-red-700">{naive.toFixed(4)}</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">归一化重要性估计</div>
              <div className="text-xl font-bold text-emerald-700">{estimate.toFixed(4)}</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">估计误差 |estimate - truth|</div>
              <div className="text-xl font-bold text-amber-700">{error.toFixed(4)}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">有效样本量 ESS</div>
              <div className="text-xl font-bold text-purple-700">
                {ess.toFixed(1)} / {nSamples}
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-xs text-gray-600">最大权重占比</div>
              <div className="text-xl font-bold text-gray-700">{maxShare.toFixed(3)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-56 bg-gray-50 border rounded-lg">
            <path d={pathP} fill="none" stroke="#2563eb" strokeWidth={2} />
            <path d={pathQ} fill="none" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 2" />
            <text x={VIEW_W - 40} y={PLOT_TOP + 10} fontSize={12} fill="#2563eb">
              p
            </text>
            <text x={VIEW_W - 40} y={PLOT_TOP + 30} fontSize={12} fill="#dc2626">
              q
            </text>
            {samples.slice(0, 80).map((x, i) => (
              <circle
                key={i}
                cx={toCx(x)}
                cy={toCy(q(x))}
                r={1.5}
                fill="rgba(220,38,38,0.4)"
              />
            ))}
          </svg>

          <div className="text-sm text-gray-700 space-y-2">
            <KaTeX
              math={String.raw`w(x)=\frac{p(x)}{q(x)}=\frac{N(x\mid 0,1)}{N(x\mid \mu,\sigma)}`}
            />
            <p>
              当 q 的尾部不足（例如 μ 远离 0 且 σ 很小）时，p 中的事件难以被采样到，权重集中在少数样本上，
              ESS 下降、估计误差增大。尝试选择 <strong>𝟙&#123;x&gt;2&#125;</strong> 并把 μ 调到 3 附近。
            </p>
            <p>
              <strong>加权估计：</strong>用 q 的样本估计 E_p[f(X)] 时应使用归一化权重平均：
              <KaTeX math={String.raw`\hat{\mu}=\frac{\sum_i w(x_i)\,f(x_i)}{\sum_i w(x_i)}`} />
            </p>
          </div>
        </div>
      </div>
    </InteractiveDemo>
  );
}
