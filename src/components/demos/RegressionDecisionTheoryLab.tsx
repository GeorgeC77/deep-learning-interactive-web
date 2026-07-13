import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  symmetricGaussian,
  skewedMixture,
  distributionWithOutliers,
  squaredLoss,
  absoluteLoss,
  asymmetricAbsoluteLoss,
  zeroOneIntervalLoss,
  expectedRisk,
  optimalY,
  posteriorMean,
  posteriorMedian,
  posteriorMode,
  type DensityFunction,
  type LossFunction,
} from '@/lib/math/decisionTheory';

/* -------------------------------------------------------------------------- */
/* Plotting constants                                                          */
/* -------------------------------------------------------------------------- */
const W = 420;
const H = 320;
const M = { t: 15, r: 15, b: 45, l: 55 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const T_MIN = -8;
const T_MAX = 8;
const PLOT_STEPS = 400;
const RISK_STEPS = 300;
const OPTIMAL_STEPS = 800;

/* -------------------------------------------------------------------------- */
/* SVG helpers                                                                 */
/* -------------------------------------------------------------------------- */
function toX(t: number): number {
  return M.l + ((t - T_MIN) / (T_MAX - T_MIN)) * PW;
}

function toYRelative(v: number, maxV: number): number {
  return M.t + PH - (v / maxV) * PH;
}

function pathFromFn(
  fn: (t: number) => number,
  tMin: number,
  tMax: number,
  steps: number,
): { points: string; maxV: number } {
  let maxV = -Infinity;
  const samples: { t: number; v: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + ((tMax - tMin) * i) / steps;
    const v = fn(t);
    samples.push({ t, v });
    if (v > maxV) maxV = v;
  }
  const points = samples
    .map(({ t, v }) => `${toX(t)},${toYRelative(v, maxV || 1)}`)
    .join(' ');
  return { points, maxV: maxV || 1 };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */
type PosteriorKey = 'gaussian' | 'mixture' | 'outliers';
type LossKey = 'squared' | 'absolute' | 'asymmetric' | 'zeroOne';

const POSTERIOR_LABELS: Record<PosteriorKey, string> = {
  gaussian: '对称高斯',
  mixture: '偏态混合',
  outliers: '含异常值',
};

const LOSS_LABELS: Record<LossKey, string> = {
  squared: '平方损失',
  absolute: '绝对损失',
  asymmetric: '非对称绝对损失',
  zeroOne: '区间 0-1 损失',
};

export default function RegressionDecisionTheoryLab() {
  const [posteriorKey, setPosteriorKey] = useState<PosteriorKey>('gaussian');
  const [lossKey, setLossKey] = useState<LossKey>('squared');
  const [alpha, setAlpha] = useState(2);
  const [delta, setDelta] = useState(0.5);

  const posteriorFn: DensityFunction = useMemo(() => {
    switch (posteriorKey) {
      case 'gaussian':
        return symmetricGaussian(0, 1.5).density;
      case 'mixture':
        return skewedMixture(-2.5, 0.9, 2.5, 1.4, 0.4).density;
      case 'outliers':
        return distributionWithOutliers(0, 1, 5, 0.6, 0.15).density;
    }
  }, [posteriorKey]);

  const lossFn: LossFunction = useMemo(() => {
    switch (lossKey) {
      case 'squared':
        return squaredLoss;
      case 'absolute':
        return absoluteLoss;
      case 'asymmetric':
        return (t: number, y: number) => asymmetricAbsoluteLoss(t, y, alpha);
      case 'zeroOne':
        return (t: number, y: number) => zeroOneIntervalLoss(t, y, delta);
    }
  }, [lossKey, alpha, delta]);

  const posteriorPath = useMemo(
    () => pathFromFn(posteriorFn, T_MIN, T_MAX, PLOT_STEPS),
    [posteriorFn],
  );

  const riskPath = useMemo(() => {
    const samples: { y: number; risk: number }[] = [];
    let maxRisk = -Infinity;
    for (let i = 0; i <= RISK_STEPS; i++) {
      const y = T_MIN + ((T_MAX - T_MIN) * i) / RISK_STEPS;
      const risk = expectedRisk(posteriorFn, y, lossFn, T_MIN, T_MAX);
      samples.push({ y, risk });
      if (risk > maxRisk) maxRisk = risk;
    }
    const points = samples
      .map(({ y, risk }) => `${toX(y)},${toYRelative(risk, maxRisk || 1)}`)
      .join(' ');
    return { points, maxRisk: maxRisk || 1, samples };
  }, [posteriorFn, lossFn]);

  const optimal = useMemo(
    () => optimalY(posteriorFn, lossFn, T_MIN, T_MAX, T_MIN, T_MAX, OPTIMAL_STEPS),
    [posteriorFn, lossFn],
  );
  const mean = useMemo(
    () => posteriorMean(posteriorFn, T_MIN, T_MAX),
    [posteriorFn],
  );
  const median = useMemo(
    () => posteriorMedian(posteriorFn, T_MIN, T_MAX),
    [posteriorFn],
  );
  const mode = useMemo(
    () => posteriorMode(posteriorFn, T_MIN, T_MAX),
    [posteriorFn],
  );

  const optimalRisk = useMemo(
    () => expectedRisk(posteriorFn, optimal, lossFn, T_MIN, T_MAX),
    [posteriorFn, lossFn, optimal],
  );

  return (
    <InteractiveDemo title="回归决策理论实验：损失函数决定最优预测">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          选择后验分布与损失函数，观察最小期望风险对应的预测{' '}
          <KaTeX math="y^*" /> 如何变化。平方损失对应后验均值，绝对损失对应后验中位数，
          非对称损失会把最优预测拉向惩罚更大的一侧。
        </p>

        {/* Controls */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">后验分布</label>
            <Select
              value={posteriorKey}
              onValueChange={(v) => setPosteriorKey(v as PosteriorKey)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择后验分布" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(POSTERIOR_LABELS) as PosteriorKey[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {POSTERIOR_LABELS[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">损失函数</label>
            <Select
              value={lossKey}
              onValueChange={(v) => setLossKey(v as LossKey)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择损失函数" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LOSS_LABELS) as LossKey[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {LOSS_LABELS[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loss-specific sliders */}
        {lossKey === 'asymmetric' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>
                非对称系数 <KaTeX math="\alpha" />
              </span>
              <span className="font-mono">{alpha.toFixed(2)}</span>
            </div>
            <Slider
              value={[alpha]}
              min={0.2}
              max={5}
              step={0.1}
              onValueChange={(v) => setAlpha(v[0])}
            />
            <p className="text-xs text-gray-500 mt-0.5">
              <KaTeX math="\alpha > 1" /> 时低估（<KaTeX math="y < t" />）被更重惩罚
            </p>
          </div>
        )}

        {lossKey === 'zeroOne' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>
                容忍区间 <KaTeX math="\delta" />
              </span>
              <span className="font-mono">{delta.toFixed(2)}</span>
            </div>
            <Slider
              value={[delta]}
              min={0.05}
              max={2}
              step={0.05}
              onValueChange={(v) => setDelta(v[0])}
            />
            <p className="text-xs text-gray-500 mt-0.5">
              <KaTeX math="|t - y| \le \delta" /> 时不计损失
            </p>
          </div>
        )}

        {/* Plots */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Posterior density */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
              <polyline
                points={posteriorPath.points}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <line
                x1={M.l}
                y1={H - M.b}
                x2={W - M.r}
                y2={H - M.b}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={toX(0)}
                y1={M.t}
                x2={toX(0)}
                y2={H - M.b}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={M.l + PW / 2}
                y={H - 8}
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
              >
                t
              </text>
              <text
                x={12}
                y={M.t + PH / 2}
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
                transform={`rotate(-90,12,${M.t + PH / 2})`}
              >
                p(t)
              </text>
              <rect
                x={M.l}
                y={M.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth={1}
              />
            </svg>
            <div className="text-center pb-1 text-sm font-medium text-blue-700">
              后验密度
            </div>
          </div>

          {/* Expected risk */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 320 }}>
              <polyline
                points={riskPath.points}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={2}
              />
              <line
                x1={toX(optimal)}
                y1={M.t}
                x2={toX(optimal)}
                y2={H - M.b}
                stroke="#1f2937"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <text
                x={toX(optimal)}
                y={M.t + 12}
                textAnchor="middle"
                className="text-[9px]"
                fill="#1f2937"
              >
                y*
              </text>
              <line
                x1={M.l}
                y1={H - M.b}
                x2={W - M.r}
                y2={H - M.b}
                stroke="#9ca3af"
                strokeWidth={1}
              />
              <line
                x1={toX(0)}
                y1={M.t}
                x2={toX(0)}
                y2={H - M.b}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={M.l + PW / 2}
                y={H - 8}
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
              >
                预测 y
              </text>
              <text
                x={12}
                y={M.t + PH / 2}
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
                transform={`rotate(-90,12,${M.t + PH / 2})`}
              >
                R(y)
              </text>
              <rect
                x={M.l}
                y={M.t}
                width={PW}
                height={PH}
                fill="none"
                stroke="#d1d5db"
                strokeWidth={1}
              />
            </svg>
            <div className="text-center pb-1 text-sm font-medium text-purple-700">
              期望风险 R(y) 在 y* = {optimal.toFixed(2)} 处最小
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
          {[
            {
              label: '最优预测 y*',
              value: optimal.toFixed(3),
              color: 'text-indigo-700',
              bg: 'bg-indigo-50',
            },
            {
              label: '最小风险 R(y*)',
              value: optimalRisk.toFixed(3),
              color: 'text-purple-700',
              bg: 'bg-purple-50',
            },
            {
              label: '后验均值',
              value: mean.toFixed(3),
              color: 'text-emerald-700',
              bg: 'bg-emerald-50',
            },
            {
              label: '后验中位数',
              value: median.toFixed(3),
              color: 'text-amber-700',
              bg: 'bg-amber-50',
            },
            {
              label: '后验众数',
              value: mode.toFixed(3),
              color: 'text-rose-700',
              bg: 'bg-rose-50',
            },
          ].map((m) => (
            <div key={m.label} className={`rounded-lg p-2 ${m.bg}`}>
              <div className="text-xs text-gray-600">{m.label}</div>
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p>
            <strong>🎯 核心洞察：</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>平方损失</strong>：最优预测等于后验均值，因为它对大偏差施加二次惩罚
            </li>
            <li>
              <strong>绝对损失</strong>：最优预测等于后验中位数，对异常值更鲁棒
            </li>
            <li>
              <strong>非对称绝对损失</strong>：当 <KaTeX math="\alpha > 1" /> 时，低估（
              <KaTeX math="y < t" />）代价更高，最优预测会向右侧移动
            </li>
            <li>
              <strong>区间 0-1 损失</strong>：只要在 <KaTeX math="\delta" /> 区间内就不惩罚，
              最优预测倾向于后验密度最高的区域
            </li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
