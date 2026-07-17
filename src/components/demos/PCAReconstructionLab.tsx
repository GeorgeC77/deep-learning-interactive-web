import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';

const D = 16; // signal length = number of principal components available
const SAMPLES = 120; // points used to draw the curves

/**
 * Pedagogical PCA reconstruction demo.
 * A 1-D signal is decomposed onto an orthonormal (cosine) principal basis.
 * Component energies (eigenvalues) decay, mimicking natural data.
 * Keeping the top-k components and reconstructing shows that the
 * reconstruction error equals the energy of the discarded components.
 */
export default function PCAReconstructionLab() {
  const [k, setK] = useState(3); // retained dimensions

  const { ts, original, reconstructed, energies, error, totalEnergy } = useMemo(() => {
    // Cosine basis functions phi_i(t), t in [0,1]
    const basis = (i: number, t: number) => (i === 0 ? 1 : Math.sqrt(2) * Math.cos(Math.PI * i * t));
    // Decaying coefficients -> component energies (eigenvalues)
    const coeffs = Array.from({ length: D }, (_, i) => 1 / (i + 1) ** 1.4);
    const energies = coeffs.map((c) => c * c);
    const totalEnergy = energies.reduce((a, b) => a + b, 0);

    const ts = Array.from({ length: SAMPLES }, (_, s) => s / (SAMPLES - 1));
    const original = ts.map((t) => coeffs.reduce((acc, c, i) => acc + c * basis(i, t), 0));
    const reconstructed = ts.map((t) => coeffs.slice(0, k).reduce((acc, c, i) => acc + c * basis(i, t), 0));
    const error = energies.slice(k).reduce((a, b) => a + b, 0);

    return { ts, original, reconstructed, energies, error, totalEnergy };
  }, [k]);

  const W = 560;
  const H = 180;
  const pad = 28;
  const allVals = [...original, ...reconstructed];
  const vMin = Math.min(...allVals);
  const vMax = Math.max(...allVals);
  const xOf = (t: number) => pad + t * (W - 2 * pad);
  const yOf = (v: number) => H - pad - ((v - vMin) / (vMax - vMin || 1)) * (H - 2 * pad);
  const pathFor = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(ts[i]).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');

  const maxEnergy = Math.max(...energies);
  const barW = (W - 2 * pad) / D;
  const retainedRatio = totalEnergy > 0 ? (totalEnergy - error) / totalEnergy : 1;

  return (
    <InteractiveDemo title="PCA 重构：保留维度 vs 重构误差">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          把信号投影到主成分上（Projection），再只用前 k 个主成分重建（Reconstruction）。
          拖动“保留维度”，立刻看到重构误差与被丢弃特征值的变化。
        </p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">保留维度 k</label>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{k} / {D}</span>
          </div>
          <Slider value={[k]} min={0} max={D} step={1} onValueChange={(v) => setK(v[0])} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Original vs reconstruction */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">Original vs Reconstruction</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#cbd5e1" />
              <path d={pathFor(original)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              <path d={pathFor(reconstructed)} fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x={W - pad - 120} y={pad + 4} fontSize="10" fill="#3b82f6">Original</text>
              <text x={W - pad - 120} y={pad + 18} fontSize="10" fill="#10b981">Reconstruction (k={k})</text>
            </svg>
          </div>

          {/* Eigenvalue spectrum */}
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2">特征值（保留=蓝，丢弃=灰）</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#cbd5e1" />
              {energies.map((e, i) => {
                const h = (e / maxEnergy) * (H - 2 * pad);
                return (
                  <rect
                    key={i}
                    x={pad + i * barW + 1}
                    y={H - pad - h}
                    width={barW - 2}
                    height={h}
                    fill={i < k ? '#6366f1' : '#cbd5e1'}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
            <div className="text-xs text-gray-500">Reconstruction Error</div>
            <div className="font-mono font-bold text-red-700">{error.toFixed(4)}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
            <div className="text-xs text-gray-500">Discarded Eigenvalues</div>
            <div className="font-mono font-bold text-gray-700">{D - k}</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
            <div className="text-xs text-gray-500">保留方差比例</div>
            <div className="font-mono font-bold text-emerald-700">{(retainedRatio * 100).toFixed(1)}%</div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>强调：</strong>PCA 的真正目标是 <strong>Min Reconstruction Error</strong>，降维只是结果——
          留下的特征值越大、丢掉的越小，重构就越接近原信号。
        </div>
      </div>
    </InteractiveDemo>
  );
}
