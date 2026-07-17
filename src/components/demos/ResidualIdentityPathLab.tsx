import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';

const LAYERS = 8;

/**
 * Pedagogical signal-propagation model.
 * Plain deep network: each layer multiplies the signal by a factor w (<1),
 * so magnitude decays like w^depth.
 * Residual network: y = x + alpha * F(x). The identity path keeps the signal
 * close to the input when the residual branch alpha is small.
 */
export default function ResidualIdentityPathLab() {
  const [alpha, setAlpha] = useState(0.9); // residual branch strength
  const w = 0.72; // per-layer shrink factor for the plain network

  const data = useMemo(() => {
    const depths = Array.from({ length: LAYERS + 1 }, (_, i) => i);
    const plain = depths.map((d) => Math.pow(w, d));
    // Residual: signal magnitude stays near input; the residual branch only
    // adds a small bounded perturbation proportional to alpha.
    const residual = depths.map((d) => 1 + alpha * 0.08 * (1 - Math.pow(w, d)));
    return { depths, plain, residual };
  }, [alpha, w]);

  const plainOut = data.plain[LAYERS];
  const residualOut = data.residual[LAYERS];

  const W = 560;
  const H = 220;
  const pad = 30;
  const xOf = (d: number) => pad + (d / LAYERS) * (W - 2 * pad);
  const yOf = (v: number) => H - pad - Math.min(1.2, v) * (H - 2 * pad);

  const pathFor = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');

  return (
    <InteractiveDemo title="Identity Path：残差如何保住信号">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          普通深层网络每层都会把信号乘上一个小于 1 的因子，层数越深信号越小；残差网络多了一条
          <strong> 恒等直连（identity path）</strong>，让信号可以绕过变换直接传到后面。
        </p>

        {/* Network diagrams */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">普通网络</div>
            <svg viewBox="0 0 200 130" className="w-full">
              <text x="10" y="18" fontSize="11" fill="#334155">x</text>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <line x1={28 + i * 54} y1="14" x2={52 + i * 54} y2="14" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrP)" />
                  <rect x={52 + i * 54} y="4" width="46" height="20" rx="4" fill="#fee2e2" stroke="#ef4444" />
                  <text x={75 + i * 54} y="18" fontSize="10" fill="#b91c1c" textAnchor="middle">Layer</text>
                </g>
              ))}
              <line x1="176" y1="14" x2="196" y2="14" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="160" y="40" fontSize="11" fill="#334155">输出</text>
              <defs>
                <marker id="arrP" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">Residual（含恒等直连）</div>
            <svg viewBox="0 0 220 130" className="w-full">
              <text x="8" y="70" fontSize="11" fill="#334155">x</text>
              {/* identity skip arc */}
              <path d="M24,66 C70,10 150,10 178,62" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
              <text x="100" y="22" fontSize="10" fill="#059669" textAnchor="middle">identity</text>
              <line x1="24" y1="70" x2="44" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="44" y="58" width="48" height="24" rx="4" fill="#dbeafe" stroke="#3b82f6" />
              <text x="68" y="73" fontSize="10" fill="#1d4ed8" textAnchor="middle">Layer</text>
              <line x1="92" y1="70" x2="112" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="112" y="58" width="48" height="24" rx="4" fill="#dbeafe" stroke="#3b82f6" />
              <text x="136" y="73" fontSize="10" fill="#1d4ed8" textAnchor="middle">Layer</text>
              <line x1="160" y1="70" x2="178" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="186" cy="70" r="9" fill="#fff" stroke="#10b981" strokeWidth="2" />
              <text x="186" y="74" fontSize="11" fill="#059669" textAnchor="middle">+</text>
              <line x1="195" y1="70" x2="214" y2="70" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="200" y="92" fontSize="11" fill="#334155">输出</text>
            </svg>
          </div>
        </div>

        {/* Residual strength slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Residual Branch 强度（α）</label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{alpha.toFixed(2)}</span>
          </div>
          <Slider value={[alpha]} min={0} max={1} step={0.05} onValueChange={(v) => setAlpha(v[0])} />
          <p className="text-xs text-gray-500 mt-1">把 α 拖到 0：残差分支关闭，输出退化为恒等映射。</p>
        </div>

        {/* Signal magnitude vs depth */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">信号幅度随深度变化</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#cbd5e1" />
            <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#cbd5e1" />
            <line x1={pad} y1={yOf(1)} x2={W - pad} y2={yOf(1)} stroke="#e2e8f0" strokeDasharray="3 3" />
            <text x={pad + 2} y={yOf(1) - 4} fontSize="10" fill="#94a3b8">输入幅度 = 1</text>
            <path d={pathFor(data.plain)} fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <path d={pathFor(data.residual)} fill="none" stroke="#10b981" strokeWidth="2.5" />
            <text x={W - pad - 70} y={yOf(data.plain[LAYERS]) - 6} fontSize="10" fill="#ef4444">普通网络</text>
            <text x={W - pad - 70} y={yOf(data.residual[LAYERS]) + 14} fontSize="10" fill="#10b981">Residual</text>
            <text x={W / 2} y={H - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">深度（层数）</text>
          </svg>
          <div className="grid grid-cols-2 gap-3 mt-2 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <div className="text-xs text-gray-500">普通网络输出</div>
              <div className="font-mono font-bold text-red-700">{plainOut.toFixed(3)}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="text-xs text-gray-500">Residual 输出</div>
              <div className="font-mono font-bold text-emerald-700">{residualOut.toFixed(3)}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>总结：</strong>ResNet 的核心不是“更复杂”，而是
          <strong>最坏情况下还能学习 Identity Mapping</strong>——即使残差分支学到接近 0，信息仍能原样通过。
        </div>
      </div>
    </InteractiveDemo>
  );
}
