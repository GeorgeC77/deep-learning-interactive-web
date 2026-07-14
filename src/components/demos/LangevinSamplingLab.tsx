import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import { gaussianScore, langevinChain, chainStats } from '@/lib/math/langevin';

const W = 560;
const H = 240;
const M = { t: 10, r: 10, b: 40, l: 50 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

function toX(x: number, min: number, max: number): number {
  return M.l + ((x - min) / (max - min)) * PW;
}
function toY(y: number, maxY: number): number {
  return M.t + PH - (y / maxY) * PH;
}

function gaussianPDF(x: number, mean = 0, sigma = 1): number {
  const z = (x - mean) / sigma;
  return (Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI)));
}

export default function LangevinSamplingLab() {
  const [start, setStart] = useState(5);
  const [eta, setEta] = useState(0.02);
  const [steps, setSteps] = useState(1000);
  const [seed, setSeed] = useState(1);

  const traj = useMemo(
    () => langevinChain(start, (x) => gaussianScore(x, 0, 1), eta, steps, seed),
    [start, eta, steps, seed],
  );
  const { mean, variance } = chainStats(traj);

  const trajMin = Math.min(...traj, -6);
  const trajMax = Math.max(...traj, 6);

  const trajPath = useMemo(() => {
    return traj
      .map((x, i) => `${toX(i, 0, traj.length - 1)},${toX(x, trajMin, trajMax)}`)
      .join(' ');
  }, [traj, trajMin, trajMax]);

  // Histogram of the last half of the chain
  const hist = useMemo(() => {
    const bins = 30;
    const counts = new Array(bins).fill(0);
    const samples = traj.slice(Math.floor(traj.length / 2));
    const binWidth = (trajMax - trajMin) / bins;
    for (const x of samples) {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((x - trajMin) / binWidth)));
      counts[idx]++;
    }
    const maxCount = Math.max(...counts, 1);
    return { counts, maxCount, binWidth };
  }, [traj, trajMin, trajMax]);

  const densityPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = trajMin + ((trajMax - trajMin) * i) / 100;
      const y = gaussianPDF(x, 0, 1);
      pts.push(`${toX(x, trajMin, trajMax)},${toY(y, 0.45)}`);
    }
    return pts.join(' ');
  }, [trajMin, trajMax]);

  return (
    <InteractiveDemo title="Langevin 动力学实验：步长与稳定性">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          该更新式是 Euler–Maruyama 离散化。步长 <KaTeX math="\\eta" /> 足够小时链可近似目标分布；
          步长过大则离散化误差占主导，导致样本偏离甚至发散。
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">起始点 x₀ = {start.toFixed(1)}</label>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={start}
              onChange={(e) => setStart(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">步长 η = {eta.toFixed(3)}</label>
            <input
              type="range"
              min={0.001}
              max={0.5}
              step={0.001}
              value={eta}
              onChange={(e) => setEta(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">迭代步数 = {steps}</label>
            <input
              type="range"
              min={100}
              max={3000}
              step={100}
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              重新采样噪声
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">轨迹 x^τ</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
              <line x1={M.l} y1={toX(0, trajMin, trajMax)} x2={W - M.r} y2={toX(0, trajMin, trajMax)} stroke="#e5e7eb" strokeWidth={1} />
              <polyline points={trajPath} fill="none" stroke="#2563eb" strokeWidth={1.5} />
              <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">后一半样本直方图 vs 目标 N(0,1)</div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 240 }}>
              <polyline points={densityPath} fill="none" stroke="#ef4444" strokeWidth={2} strokeDasharray="4,2" />
              {hist.counts.map((count, i) => {
                const x0 = trajMin + i * hist.binWidth;
                const x1 = trajMin + (i + 1) * hist.binWidth;
                const sx0 = toX(x0, trajMin, trajMax);
                const sx1 = toX(x1, trajMin, trajMax);
                const height = (count / hist.maxCount) * PH;
                return (
                  <rect
                    key={i}
                    x={sx0}
                    y={M.t + PH - height}
                    width={Math.max(1, sx1 - sx0 - 1)}
                    height={height}
                    fill="#3b82f6"
                    opacity={0.5}
                  />
                );
              })}
              <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-slate-50 rounded p-2 border">
            <div className="text-gray-500">样本均值</div>
            <div className="font-mono font-semibold">{mean.toFixed(3)}</div>
          </div>
          <div className="bg-slate-50 rounded p-2 border">
            <div className="text-gray-500">样本方差</div>
            <div className="font-mono font-semibold">{variance.toFixed(3)}</div>
          </div>
          <div className="bg-slate-50 rounded p-2 border">
            <div className="text-gray-500">终点 x^τ</div>
            <div className="font-mono font-semibold">{traj[traj.length - 1].toFixed(3)}</div>
          </div>
          <div className="bg-slate-50 rounded p-2 border">
            <div className="text-gray-500">稳定性</div>
            <div className={`font-semibold ${Number.isFinite(variance) && variance < 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {Number.isFinite(variance) && variance < 100 ? '稳定' : '发散'}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border">
          <strong>关键提醒：</strong>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>有限步长 <KaTeX math="\\eta" /> 的 Langevin 链只是近似采样，不是目标分布的精确样本。</li>
            <li>只有满足正则性条件并配合足够小（或衰减）的步长，链才会收敛到目标分布。</li>
            <li>过大的 <KaTeX math="\\eta" /> 会放大噪声项，导致样本方差爆炸。</li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
