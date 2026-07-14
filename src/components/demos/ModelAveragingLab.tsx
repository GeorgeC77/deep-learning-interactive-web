import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import KaTeX from '@/components/KaTeX';
import {
  ensembleVariance,
  marginalGain,
  limitingVariance,
  minimumFeasibleCorrelation,
} from '@/lib/math/modelAveraging';

const MAX_M = 50;

const PLOT_W = 560;
const PLOT_H = 280;
const MARGIN = { t: 10, r: 20, b: 40, l: 50 };
const INNER_W = PLOT_W - MARGIN.l - MARGIN.r;
const INNER_H = PLOT_H - MARGIN.t - MARGIN.b;

type RhoMode = 'fixed' | 'scaled';

interface Preset {
  label: string;
  mode: RhoMode;
  rho?: number;
  gamma?: number;
  description: string;
}

const PRESETS: Preset[] = [
  { label: '独立', mode: 'fixed', rho: 0, description: 'ρ = 0：模型误差互不相关' },
  { label: '中等相关', mode: 'fixed', rho: 0.5, description: 'ρ = 0.5' },
  { label: '完全相同', mode: 'fixed', rho: 1, description: 'ρ = 1：所有模型犯同样的错误' },
  {
    label: '负相关',
    mode: 'scaled',
    gamma: 0.8,
    description: 'ρ_M = -0.8/(M-1)，随 M 缩放保证可行',
  },
];

interface MetricCardProps {
  label: React.ReactNode;
  value: string;
  color: string;
  bg: string;
}

function MetricCard({ label, value, color, bg }: MetricCardProps) {
  return (
    <div className={`rounded-lg p-2 ${bg}`}>
      <div className="text-xs text-gray-600">{label}</div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function formatFinite(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(digits);
}

export default function ModelAveragingLab() {
  const [sigma, setSigma] = useState(1.0);
  const [M, setM] = useState(10);
  const [mode, setMode] = useState<RhoMode>('fixed');
  const [rho, setRho] = useState(0.0);
  const [gamma, setGamma] = useState(0.8);

  const rhoMin = minimumFeasibleCorrelation(M);

  // Effective rho for the currently selected M.
  const effectiveRho = useMemo(() => {
    if (mode === 'scaled') {
      return M <= 1 ? 0 : -gamma / (M - 1);
    }
    return clamp(rho, 0, 1);
  }, [mode, M, gamma, rho]);

  // When M changes, make sure the fixed rho remains feasible (it is always >=0).
  // When switching to scaled mode, keep gamma.
  const handleModeChange = (next: RhoMode) => {
    setMode(next);
    if (next === 'fixed') {
      setRho(clamp(effectiveRho, 0, 1));
    }
  };

  const variance = Math.max(0, ensembleVariance(sigma, M, effectiveRho));
  const std = Math.sqrt(variance);
  const gain = Math.max(0, marginalGain(sigma, M, effectiveRho));
  const limit = Math.max(0, limitingVariance(sigma, effectiveRho));

  const curve = useMemo(() => {
    const points: { m: number; std: number }[] = [];
    for (let m = 1; m <= MAX_M; m++) {
      const r = mode === 'scaled' ? (m <= 1 ? 0 : -gamma / (m - 1)) : clamp(rho, 0, 1);
      const v = Math.max(0, ensembleVariance(sigma, m, r));
      points.push({ m, std: Math.sqrt(v) });
    }
    return points;
  }, [sigma, rho, gamma, mode]);

  const yMax = Math.max(sigma, ...curve.map((p) => p.std), 0.1);

  const xScale = (m: number): number => {
    return MARGIN.l + ((m - 1) / (MAX_M - 1)) * INNER_W;
  };

  const yScale = (s: number): number => {
    return MARGIN.t + INNER_H - (s / yMax) * INNER_H;
  };

  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.m)} ${yScale(p.std)}`)
    .join(' ');

  const currentX = xScale(M);
  const currentY = yScale(std);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <InteractiveDemo title="模型平均：相关误差的方差缩减">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          假设每个模型的误差标准差为 <KaTeX math="\sigma" />，
          模型间两两误差相关系数为 <KaTeX math="\rho" />。
          模型平均后的误差方差为{' '}
          <KaTeX math="\sigma^2\bigl(\rho + \frac{1-\rho}{M}\bigr)" />。
          当 <KaTeX math="M\to\infty" /> 时，方差收敛到{' '}
          <KaTeX math="\sigma^2\rho" />，说明正相关误差保留共同方差成分；即使误差均值为零，相关性也不等同于 bias。
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
              <span>
                单模型误差标准差 <KaTeX math="\sigma" />
              </span>
              <span className="font-mono">{sigma.toFixed(1)}</span>
            </div>
            <Slider
              value={[sigma]}
              min={0.1}
              max={5.0}
              step={0.1}
              onValueChange={(v) => setSigma(v[0])}
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              控制每个模型单独犯错时的波动幅度
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
              <span>
                模型数量 <KaTeX math="M" />
              </span>
              <span className="font-mono">{M}</span>
            </div>
            <Slider
              value={[M]}
              min={1}
              max={MAX_M}
              step={1}
              onValueChange={(v) => setM(Math.round(v[0]))}
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              参与平均的模型数量（1 到 50）
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
              <span>ρ 模式</span>
              <span className="font-mono">
                {mode === 'fixed' ? '固定非负 ρ' : '按 M 缩放负相关'}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('fixed')}
                className={`flex-1 px-2 py-1 text-xs rounded-lg border transition-colors ${
                  mode === 'fixed'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                固定 ρ ≥ 0
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('scaled')}
                className={`flex-1 px-2 py-1 text-xs rounded-lg border transition-colors ${
                  mode === 'scaled'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ρ_M = -γ/(M-1)
              </button>
            </div>
          </div>
        </div>

        {mode === 'fixed' ? (
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
              <span>
                固定两两相关系数 <KaTeX math="\rho" />
              </span>
              <span className="font-mono">{rho.toFixed(2)}</span>
            </div>
            <Slider
              value={[rho]}
              min={0}
              max={1.0}
              step={0.05}
              onValueChange={(v) => setRho(Math.round(v[0] * 20) / 20)}
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              固定模式下 ρ 被限制为非负，防止 M 增大时方差变负。
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-700 mb-0.5">
              <span>
                负相关强度 <KaTeX math="\gamma" /> (ρ_M = -γ/(M-1))
              </span>
              <span className="font-mono">{gamma.toFixed(2)}</span>
            </div>
            <Slider
              value={[gamma]}
              min={0}
              max={1.0}
              step={0.05}
              onValueChange={(v) => setGamma(Math.round(v[0] * 20) / 20)}
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              缩放模式保证任意 M &gt; 1 下 ρ_M 都可下界 -1/(M-1)。
            </p>
          </div>
        )}

        <div className="text-xs text-gray-600 bg-slate-50 rounded p-2">
          当前 <KaTeX math={`M=${M}`} /> 的可行下界：
          <KaTeX math={`\\rho_{\\min}=${rhoMin.toFixed(3)}`} />；
          当前有效 <KaTeX math={`\\rho=${effectiveRho.toFixed(3)}`} />。
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active =
              mode === preset.mode &&
              (preset.rho !== undefined
                ? Math.abs(rho - preset.rho) < 1e-6
                : Math.abs(gamma - (preset.gamma ?? 0)) < 1e-6);
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setMode(preset.mode);
                  if (preset.rho !== undefined) setRho(preset.rho);
                  if (preset.gamma !== undefined) setGamma(preset.gamma);
                }}
                title={preset.description}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <MetricCard
            label={<KaTeX math="\text{Ensemble Variance}" />}
            value={formatFinite(variance)}
            color="text-blue-700"
            bg="bg-blue-50"
          />
          <MetricCard
            label={<KaTeX math="\text{Ensemble Std}" />}
            value={formatFinite(std)}
            color="text-emerald-700"
            bg="bg-emerald-50"
          />
          <MetricCard
            label={<KaTeX math="\text{Marginal Gain}(M\to M+1)" />}
            value={formatFinite(gain)}
            color="text-purple-700"
            bg="bg-purple-50"
          />
          <MetricCard
            label={<KaTeX math="\lim_{M\to\infty}\text{Variance}" />}
            value={formatFinite(limit)}
            color="text-amber-700"
            bg="bg-amber-50"
          />
        </div>

        {/* Plot */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 bg-white">
            <span className="text-sm font-medium text-gray-700">
              集成标准差随模型数量的变化（当前 <KaTeX math="\rho" />）
            </span>
          </div>
          <svg
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            className="w-full"
            style={{ maxHeight: PLOT_H }}
          >
            {/* Grid lines */}
            {[1, 10, 20, 30, 40, 50].map((m) => (
              <line
                key={`gx-${m}`}
                x1={xScale(m)}
                y1={MARGIN.t}
                x2={xScale(m)}
                y2={MARGIN.t + INNER_H}
                stroke="#e5e7eb"
                strokeWidth={0.5}
              />
            ))}
            {yTicks.map((t) => {
              const y = yScale(t * yMax);
              return (
                <line
                  key={`gy-${t}`}
                  x1={MARGIN.l}
                  y1={y}
                  x2={MARGIN.l + INNER_W}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                />
              );
            })}

            {/* Axes */}
            <line
              x1={MARGIN.l}
              y1={MARGIN.t + INNER_H}
              x2={MARGIN.l + INNER_W}
              y2={MARGIN.t + INNER_H}
              stroke="#9ca3af"
              strokeWidth={1}
            />
            <line
              x1={MARGIN.l}
              y1={MARGIN.t}
              x2={MARGIN.l}
              y2={MARGIN.t + INNER_H}
              stroke="#9ca3af"
              strokeWidth={1}
            />

            {/* X-axis labels */}
            {[1, 10, 20, 30, 40, 50].map((m) => (
              <text
                key={`xl-${m}`}
                x={xScale(m)}
                y={MARGIN.t + INNER_H + 18}
                textAnchor="middle"
                className="text-[10px]"
                fill="#6b7280"
              >
                {m}
              </text>
            ))}
            <text
              x={MARGIN.l + INNER_W / 2}
              y={PLOT_H - 4}
              textAnchor="middle"
              className="text-[10px]"
              fill="#4b5563"
            >
              模型数量 M
            </text>

            {/* Y-axis labels */}
            {yTicks.map((t) => (
              <text
                key={`yl-${t}`}
                x={MARGIN.l - 8}
                y={yScale(t * yMax) + 3}
                textAnchor="end"
                className="text-[10px]"
                fill="#6b7280"
              >
                {(t * yMax).toFixed(1)}
              </text>
            ))}
            <text
              x={14}
              y={MARGIN.t + INNER_H / 2}
              textAnchor="middle"
              transform={`rotate(-90, 14, ${MARGIN.t + INNER_H / 2})`}
              className="text-[10px]"
              fill="#4b5563"
            >
              Ensemble Std
            </text>

            {/* Plot frame */}
            <rect
              x={MARGIN.l}
              y={MARGIN.t}
              width={INNER_W}
              height={INNER_H}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={1}
            />

            {/* Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Current point */}
            <line
              x1={currentX}
              y1={MARGIN.t}
              x2={currentX}
              y2={MARGIN.t + INNER_H}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="4,3"
              opacity={0.7}
            />
            <circle cx={currentX} cy={currentY} r={5} fill="#ef4444" />
            <text
              x={currentX + 8}
              y={currentY - 8}
              className="text-[10px] font-bold"
              fill="#ef4444"
            >
              M={M}
            </text>
          </svg>
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-700 space-y-2 bg-slate-50 p-4 rounded-lg border">
          <p>
            <strong>🎯 观察要点：</strong>
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              当 <KaTeX math="\rho=0" /> 时，误差独立，集成标准差以{' '}
              <KaTeX math="1/\sqrt{M}" /> 的速度下降。
            </li>
            <li>
              当 <KaTeX math="\rho=1" /> 时，所有模型错误完全一致，
              增加模型数量不会降低误差。
            </li>
            <li>
              边际增益（增加一个模型带来的方差下降）随着 <KaTeX math="M" /> 增大而递减，
              且在 <KaTeX math="\rho&lt;1" /> 时始终非负。
            </li>
            <li>
              负相关（<KaTeX math="\rho&lt;0" />）可以让集成方差低于{' '}
              <KaTeX math="\sigma^2/M" />，但必须满足{' '}
              <KaTeX math="\rho\ge -1/(M-1)" /> 以保证方差非负。
            </li>
          </ul>
        </div>
      </div>
    </InteractiveDemo>
  );
}
