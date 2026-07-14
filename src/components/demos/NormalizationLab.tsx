import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { standardize, batchNorm, layerNorm } from '@/lib/math/normalization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

// Data normalization: 2-D correlated samples
function generateSamples(seed: number): number[][] {
  let s = seed;
  const pts: number[][] = [];
  for (let i = 0; i < 60; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u1 = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const u2 = s / 233280;
    const r = Math.sqrt(-2 * Math.log(Math.max(1e-10, u1)));
    const z1 = r * Math.cos(2 * Math.PI * u2);
    const z2 = r * Math.sin(2 * Math.PI * u2);
    pts.push([3 + 1.5 * z1, 8 + 0.8 * z2]);
  }
  return pts;
}

const SCALE = 28;
const OFFSET_X = 150;
const OFFSET_Y = 150;

function toSvg(x: number, y: number): { cx: number; cy: number } {
  return { cx: OFFSET_X + x * SCALE, cy: OFFSET_Y - y * SCALE };
}

export default function NormalizationLab() {
  const [tab, setTab] = useState('data');

  // Data normalization state
  const [dataSeed, setDataSeed] = useState(1);
  const rawData = useMemo(() => generateSamples(dataSeed), [dataSeed]);
  const dim0 = rawData.map((p) => p[0]);
  const dim1 = rawData.map((p) => p[1]);
  const std0 = standardize(dim0);
  const std1 = standardize(dim1);
  const standardized = dim0.map((_, i) => [std0.normalized[i], std1.normalized[i]]);

  // BatchNorm state
  const bnRaw: number[][] = [
    [1, 10, 100],
    [2, 20, 200],
    [3, 30, 300],
    [4, 40, 400],
  ];
  const [gamma, setGamma] = useState([1, 1, 1]);
  const [beta, setBeta] = useState([0, 0, 0]);
  const bn = batchNorm(bnRaw, gamma, beta);

  // LayerNorm state
  const [lnInput, setLnInput] = useState([1, 2, -1, 0, 3]);
  const [lnGamma, setLnGamma] = useState([1, 1, 1, 1, 1]);
  const [lnBeta, setLnBeta] = useState([0, 0, 0, 0, 0]);
  const ln = layerNorm(lnInput, lnGamma, lnBeta);

  return (
    <InteractiveDemo title="归一化实验：数据 / BatchNorm / LayerNorm">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="data">数据归一化</TabsTrigger>
          <TabsTrigger value="batchnorm">BatchNorm</TabsTrigger>
          <TabsTrigger value="layernorm">LayerNorm</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <p className="text-sm text-gray-600">
            数据归一化将每个特征缩放到零均值、单位方差。注意它只改变尺度，不改变特征间的相关性。
          </p>
          <button
            onClick={() => setDataSeed((s) => s + 1)}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            重新采样
          </button>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs font-medium text-gray-600 mb-2">原始数据</div>
              <svg viewBox="0 0 320 320" className="w-full" style={{ maxHeight: 280 }}>
                <rect x={0} y={0} width={320} height={320} fill="#f9fafb" />
                {rawData.map((p, i) => {
                  const { cx, cy } = toSvg(p[0], p[1]);
                  return <circle key={i} cx={cx} cy={cy} r={3} fill="#2563eb" opacity={0.6} />;
                })}
              </svg>
              <div className="text-xs text-gray-500 mt-1">
                均值: ({std0.mean.toFixed(2)}, {std1.mean.toFixed(2)}) · 标准差: ({std0.std.toFixed(2)}, {std1.std.toFixed(2)})
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-xs font-medium text-gray-600 mb-2">标准化后</div>
              <svg viewBox="0 0 320 320" className="w-full" style={{ maxHeight: 280 }}>
                <rect x={0} y={0} width={320} height={320} fill="#f9fafb" />
                {standardized.map((p, i) => {
                  const { cx, cy } = toSvg(p[0], p[1]);
                  return <circle key={i} cx={cx} cy={cy} r={3} fill="#10b981" opacity={0.6} />;
                })}
              </svg>
              <div className="text-xs text-gray-500 mt-1">均值 ≈ 0, 标准差 ≈ 1</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batchnorm" className="space-y-4">
          <p className="text-sm text-gray-600">
            BatchNorm 对每个 mini-batch 的每个特征维度计算均值与标准差，然后通过可学习的 γ、β 进行缩放和平移。
            推理时通常使用训练阶段的移动统计量。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">γ（缩放）</div>
              {gamma.map((g, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>特征 {i + 1}</span>
                    <span>{g.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[g]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={(v) => {
                      const next = [...gamma];
                      next[i] = v[0];
                      setGamma(next);
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">β（平移）</div>
              {beta.map((b, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>特征 {i + 1}</span>
                    <span>{b.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[b]}
                    min={-2}
                    max={2}
                    step={0.1}
                    onValueChange={(v) => {
                      const next = [...beta];
                      next[i] = v[0];
                      setBeta(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-2 py-1">样本</th>
                  {bn.mean.map((_, i) => (
                    <th key={i} className="border px-2 py-1">特征 {i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bn.out.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{i + 1}</td>
                    {row.map((v, j) => (
                      <td key={j} className="border px-2 py-1 font-mono">{v.toFixed(3)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-slate-50">
                  <td className="border px-2 py-1 font-medium">batch μ</td>
                  {bn.mean.map((m, i) => (
                    <td key={i} className="border px-2 py-1 font-mono">{m.toFixed(3)}</td>
                  ))}
                </tr>
                <tr className="bg-slate-50">
                  <td className="border px-2 py-1 font-medium">batch σ</td>
                  {bn.std.map((s, i) => (
                    <td key={i} className="border px-2 py-1 font-mono">{s.toFixed(3)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="layernorm" className="space-y-4">
          <p className="text-sm text-gray-600">
            LayerNorm 沿特征维度归一化单个样本，不依赖 batch 大小。对每个位置都有可学习的 γ、β。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">输入 z</div>
              {lnInput.map((v, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>z_{i + 1}</span>
                    <span>{v.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[v]}
                    min={-5}
                    max={5}
                    step={0.1}
                    onValueChange={(val) => {
                      const next = [...lnInput];
                      next[i] = val[0];
                      setLnInput(next);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-sm space-y-2">
              <div>μ̂ = {ln.mean.toFixed(4)}</div>
              <div>σ̂ = {ln.std.toFixed(4)}</div>
              <div>输出 LN(z):</div>
              <div className="font-mono">[{ln.out.map((v) => v.toFixed(3)).join(', ')}]</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">γ</div>
              {lnGamma.map((g, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>γ_{i + 1}</span>
                    <span>{g.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[g]}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onValueChange={(v) => {
                      const next = [...lnGamma];
                      next[i] = v[0];
                      setLnGamma(next);
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">β</div>
              {lnBeta.map((b, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>β_{i + 1}</span>
                    <span>{b.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[b]}
                    min={-2}
                    max={2}
                    step={0.1}
                    onValueChange={(v) => {
                      const next = [...lnBeta];
                      next[i] = v[0];
                      setLnBeta(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border mt-4">
        <strong>注意事项：</strong>
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>归一化有助于训练，但不是万能的；效果依赖于网络结构、任务与批量大小。</li>
          <li>BatchNorm 在推理时使用移动统计量，小批量时估计可能不准。</li>
          <li>LayerNorm 的稳定性假设是“特征维度上的统计量有意义”，在序列模型中通常成立。</li>
        </ul>
      </div>
    </InteractiveDemo>
  );
}
