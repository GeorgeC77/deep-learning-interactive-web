import { useState, useMemo, useRef, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 数值工具                                                                   */
/* -------------------------------------------------------------------------- */
function generateData(N: number, noise: number, rng: () => number = Math.random) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * Math.PI * 2;
    const y = Math.sin(x) + (rng() - 0.5) * 2 * noise;
    xs.push(x);
    ys.push(y);
  }
  return { xs, ys };
}

function polyFeatures(x: number, degree: number): number[] {
  const phi: number[] = [];
  for (let d = 0; d <= degree; d++) phi.push(Math.pow(x, d));
  return phi;
}

function fitPolynomial(xs: number[], ys: number[], degree: number, lambda: number) {
  const N = xs.length;
  const M = degree + 1;
  // Build design matrix Phi: N x M
  const Phi: number[][] = [];
  for (let i = 0; i < N; i++) {
    Phi.push(polyFeatures(xs[i], degree));
  }
  // Phi^T * Phi + lambda * I (but don't regularize w0)
  const PhiTPhi: number[][] = Array.from({ length: M }, () => Array(M).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      for (let k = 0; k < M; k++) {
        PhiTPhi[j][k] += Phi[i][j] * Phi[i][k];
      }
    }
  }
  // Regularize (skip bias w0)
  for (let j = 1; j < M; j++) PhiTPhi[j][j] += lambda;
  // Phi^T * t
  const PhiTt = Array(M).fill(0);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      PhiTt[j] += Phi[i][j] * ys[i];
    }
  }
  // Solve via Gaussian elimination
  const aug = PhiTPhi.map((row, i) => [...row, PhiTt[i]]);
  for (let col = 0; col < M; col++) {
    let maxRow = col;
    for (let row = col + 1; row < M; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-12) continue;
    for (let row = col + 1; row < M; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let k = col; k <= M; k++) aug[row][k] -= factor * aug[col][k];
    }
  }
  const w = Array(M).fill(0);
  for (let i = M - 1; i >= 0; i--) {
    let sum = aug[i][M];
    for (let j = i + 1; j < M; j++) sum -= aug[i][j] * w[j];
    w[i] = Math.abs(aug[i][i]) < 1e-12 ? 0 : sum / aug[i][i];
  }
  return w;
}

function predict(x: number, w: number[], degree: number): number {
  let y = 0;
  for (let d = 0; d <= degree; d++) y += w[d] * Math.pow(x, d);
  return y;
}

function mse(xs: number[], ys: number[], w: number[], degree: number): number {
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    const err = ys[i] - predict(xs[i], w, degree);
    sum += err * err;
  }
  return sum / xs.length;
}

/* -------------------------------------------------------------------------- */
/* SVG 尺寸                                                                   */
/* -------------------------------------------------------------------------- */
const W = 500;
const H = 300;
const MARGIN = { top: 20, right: 20, bottom: 40, left: 50 };
const PW = W - MARGIN.left - MARGIN.right;
const PH = H - MARGIN.top - MARGIN.bottom;
const Y_MIN = -2.5;
const Y_MAX = 2.5;

export default function PolynomialRegressionDemo() {
  const [N, setN] = useState(30);
  const [degree, setDegree] = useState(5);
  const [noise, setNoise] = useState(0.4);
  const [lambda, setLambda] = useState(0);
  const [seed, setSeed] = useState(42);

  // Keep data stable per seed via useMemo
  const { train, test } = useMemo(() => {
    const rng = mulberry32(seed);
    const train = generateData(N, noise, rng);
    const test = generateData(50, noise, rng);
    return { train, test };
  }, [N, noise, seed]);

  const w = useMemo(() => fitPolynomial(train.xs, train.ys, degree, lambda), [train, degree, lambda]);
  const trainErr = useMemo(() => mse(train.xs, train.ys, w, degree), [train, w, degree]);
  const testErr = useMemo(() => mse(test.xs, test.ys, w, degree), [test, w, degree]);

  // Scales
  const allX = [...train.xs, ...test.xs];
  const xMin = Math.min(...allX) - 0.3;
  const xMax = Math.max(...allX) + 0.3;

  const toX = useCallback((x: number) => MARGIN.left + ((x - xMin) / (xMax - xMin)) * PW, [xMin, xMax]);
  const toY = useCallback((y: number) => MARGIN.top + PH - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * PH, []);

  // Generate SVG paths
  const curvePoints = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (xMax - xMin) * i / 200;
      pts.push({ x: toX(x), y: toY(predict(x, w, degree)) });
    }
    return pts.map((p) => `${p.x},${p.y}`).join(' ');
  }, [w, degree, xMin, xMax, toX, toY]);

  const svgRef = useRef<SVGSVGElement>(null);

  const pointRadius = 3.5;

  return (
    <InteractiveDemo title="交互式多项式回归：偏差与方差的直观体验">
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>多项式次数</span>
              <span className={degree > 10 ? 'text-red-600 font-bold' : ''}>{degree}{degree > 10 ? ' ⚠️ 高方差' : ''}</span>
            </div>
            <Slider value={[degree]} min={0} max={15} step={1} onValueChange={(v) => setDegree(v[0])} />
            <p className="text-xs text-gray-500 mt-0.5">
              {degree === 0 ? '常数模型，严重欠拟合（高偏差）' : degree <= 2 ? '低复杂度，高偏差、低方差' : degree <= 6 ? '中等复杂度，通常是最佳平衡区' : '高复杂度，低偏差但方差急剧增大'}
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>数据噪声</span>
              <span>{noise.toFixed(1)}</span>
            </div>
            <Slider value={[noise]} min={0} max={1.0} step={0.05} onValueChange={(v) => setNoise(v[0])} />
            <p className="text-xs text-gray-500 mt-0.5">
              噪声 = 0 时偏差-方差分解最清晰；增大噪声观察不可约误差 σ² 的影响
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>正则化 λ</span>
              <span>{lambda.toFixed(1)}</span>
            </div>
            <Slider value={[lambda]} min={0} max={5} step={0.1} onValueChange={(v) => setLambda(v[0])} />
            <p className="text-xs text-gray-500 mt-0.5">
              λ=0 无正则（高方差）；λ 越大权重越被压缩，等价于降低模型复杂度
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
            🔄 重新采样
          </button>
          <button onClick={() => setN(N <= 15 ? 30 : N - 10)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            {N <= 15 ? `↑ 恢复样本数` : `样本数 -10 → ${N - 10}`}
          </button>
          <button onClick={() => setN(Math.min(N + 10, 80))} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            样本数 +10 → {Math.min(N + 10, 80)}
          </button>
        </div>

        {/* SVG Plot */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = Y_MIN + (Y_MAX - Y_MIN) * t;
              return (
                <g key={`grid-${t}`}>
                  <line x1={MARGIN.left} y1={toY(y)} x2={W - MARGIN.right} y2={toY(y)} stroke="#e5e7eb" strokeWidth={0.5} />
                  <text x={MARGIN.left - 6} y={toY(y) + 4} textAnchor="end" className="text-[10px]" fill="#9ca3af">{y.toFixed(1)}</text>
                </g>
              );
            })}
            {/* True sin(x) */}
            <polyline
              points={Array.from({ length: 201 }, (_, i) => {
                const x = xMin + (xMax - xMin) * i / 200;
                return `${toX(x)},${toY(Math.sin(x))}`;
              }).join(' ')}
              fill="none" stroke="#d1d5db" strokeWidth={2} strokeDasharray="6,3" opacity={0.7}
            />
            {/* Training data */}
            {train.xs.map((x, i) => (
              <circle key={`t-${i}`} cx={toX(x)} cy={toY(train.ys[i])} r={pointRadius} fill="#3b82f6" opacity={0.8} />
            ))}
            {/* Fitted curve */}
            <polyline points={curvePoints} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
            {/* Test data */}
            {test.xs.map((x, i) => (
              <circle key={`v-${i}`} cx={toX(x)} cy={toY(test.ys[i])} r={2.5} fill="#f59e0b" opacity={0.4} />
            ))}
            {/* Legend inline */}
            <text x={W - MARGIN.right - 4} y={MARGIN.top + 12} textAnchor="end" className="text-[11px]" fill="#6b7280">
              <tspan fill="#d1d5db">—</tspan> 真实 sin(x)
            </text>
            <text x={W - MARGIN.right - 4} y={MARGIN.top + 26} textAnchor="end" className="text-[11px]" fill="#6b7280">
              <tspan fill="#ef4444">—</tspan> 拟合曲线
            </text>
            <rect x={MARGIN.left} y={MARGIN.top} width={PW} height={PH} fill="none" stroke="#9ca3af" strokeWidth={1} />
          </svg>
          <div className="flex justify-center gap-1 pb-1">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" />训练数据</span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 ml-2"><span className="w-2 h-2 rounded-full bg-amber-500" />测试数据</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-5 gap-3 text-center">
          {[
            { label: '训练 MSE', value: trainErr.toFixed(4), color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: '测试 MSE', value: testErr.toFixed(4), color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: '差距', value: (testErr - trainErr).toFixed(4), color: testErr - trainErr > 0.01 ? 'text-red-700' : 'text-emerald-700', bg: testErr - trainErr > 0.01 ? 'bg-red-50' : 'bg-emerald-50' },
            { label: '样本数', value: String(N), color: 'text-gray-700', bg: 'bg-gray-50' },
            { label: '权重量级‖w‖²', value: w.reduce((s, v) => s + v * v, 0).toFixed(1), color: lambda > 0 ? 'text-purple-700' : 'text-gray-700', bg: lambda > 0 ? 'bg-purple-50' : 'bg-gray-50' },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Educational explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p><strong>🎯 试试看：</strong></p>
          <ul className="space-y-1 list-disc list-inside">
            <li>把 <strong>多项式次数调到 0–2</strong>：曲线几乎直线，训练和测试误差都高 → <span className="text-red-600 font-medium">高偏差（欠拟合）</span></li>
            <li>把 <strong>次数调到 12–15</strong>：曲线剧烈摆动，训练误差极低但测试误差很高 → <span className="text-red-600 font-medium">高方差（过拟合）</span></li>
            <li>在大次数下<strong>逐渐增加 λ</strong>：权重被压缩，曲线变平滑，测试误差下降 → 正则化在抑制方差</li>
            <li><strong>减小样本数</strong>（点击 −10）：方差急剧增大，因为数据少时模型更不稳定</li>
            <li><strong>调到噪声=0</strong>：看到最纯粹的偏差-方差权衡，因为没有不可约噪声</li>
          </ul>
          <p className="mt-2">
            最优模型（最小测试误差）通常在 <strong>中等次数 3–7</strong> 附近，这就是 U 形曲线的谷底。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}

/* Simple seeded PRNG */
function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
