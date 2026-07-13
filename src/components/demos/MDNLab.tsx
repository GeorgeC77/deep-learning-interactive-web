import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import KaTeX from '@/components/KaTeX';
import {
  gaussianPdf,
  mixturePdf,
  mixtureMean,
  mixtureModes,
  generateForwardDataset,
  generateInverseDataset,
  type MixtureComponent,
  type DataPoint,
} from '@/lib/math/mdn';

const SCATTER_W = 360;
const SCATTER_H = 320;
const DENSITY_W = 360;
const DENSITY_H = 320;
const MARGIN = { top: 16, right: 16, bottom: 36, left: 44 };
const PLOT_W = SCATTER_W - MARGIN.left - MARGIN.right;
const PLOT_H = SCATTER_H - MARGIN.top - MARGIN.bottom;

const X_MIN = -2.2;
const X_MAX = 2.2;
const T_MIN = -2.2;
const T_MAX = 2.2;

const DATA_SEED = 42;
const N_POINTS = 400;

function gInverse(t: number): number {
  return t + 0.3 * Math.sin(2 * Math.PI * t);
}

/** Find all t in [tMin, tMax] such that gInverse(t) = x via bisection. */
function findInverseBranches(x: number, tMin: number, tMax: number): number[] {
  const n = 300;
  const dt = (tMax - tMin) / n;
  const roots: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = tMin + i * dt;
    const b = a + dt;
    let fa = gInverse(a) - x;
    let fb = gInverse(b) - x;
    if (fa === 0) {
      roots.push(a);
      continue;
    }
    if (fa * fb >= 0) continue;
    let lo = a;
    let hi = b;
    for (let k = 0; k < 30; k++) {
      const mid = (lo + hi) / 2;
      const fm = gInverse(mid) - x;
      if (fa * fm <= 0) {
        hi = mid;
        fb = fm;
      } else {
        lo = mid;
        fa = fm;
      }
    }
    roots.push((lo + hi) / 2);
  }
  // Deduplicate close roots that can appear near critical points.
  return roots.filter((r, i) => i === 0 || Math.abs(r - roots[i - 1]) > 1e-3);
}

function forwardComponents(x: number): MixtureComponent[] {
  return [{ weight: 1, mean: Math.sin(x), sigma: 0.15 }];
}

function inverseComponents(x: number): MixtureComponent[] {
  const roots = findInverseBranches(x, -2.2, 2.2);
  if (roots.length === 0) {
    // Fallback to a simple symmetric bimodal model.
    return [
      { weight: 0.5, mean: x - 0.5, sigma: 0.2 },
      { weight: 0.5, mean: x + 0.5, sigma: 0.2 },
    ];
  }
  const weight = 1 / roots.length;
  return roots.map((t) => ({ weight, mean: t, sigma: 0.12 }));
}

function conditionalComponents(x: number, inverse: boolean): MixtureComponent[] {
  return inverse ? inverseComponents(x) : forwardComponents(x);
}

function toScatterX(x: number): number {
  return MARGIN.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}

function toScatterY(t: number): number {
  return MARGIN.top + PLOT_H - ((t - T_MIN) / (T_MAX - T_MIN)) * PLOT_H;
}

function densityRange(components: MixtureComponent[]): { tMin: number; tMax: number } {
  if (components.length === 0) return { tMin: T_MIN, tMax: T_MAX };
  const means = components.map((c) => c.mean);
  const sigmas = components.map((c) => c.sigma);
  const center = means.reduce((s, m) => s + m, 0) / means.length;
  const spread = Math.max(
    1.2,
    Math.max(...means) - Math.min(...means) + 3 * Math.max(...sigmas),
  );
  return { tMin: center - spread, tMax: center + spread };
}

export default function MDNLab() {
  const [inverse, setInverse] = useState(false);
  const [xValue, setXValue] = useState(0.5);

  const data: DataPoint[] = useMemo(
    () => (inverse ? generateInverseDataset(DATA_SEED, N_POINTS) : generateForwardDataset(DATA_SEED, N_POINTS)),
    [inverse],
  );

  const components = useMemo(
    () => conditionalComponents(xValue, inverse),
    [xValue, inverse],
  );

  const condMean = useMemo(() => mixtureMean(components), [components]);
  const modes = useMemo(
    () => mixtureModes(components, T_MIN, T_MAX, 400),
    [components],
  );

  // MSE regression line: conditional mean evaluated on a fine x-grid.
  const meanLine = useMemo(() => {
    const n = 120;
    return Array.from({ length: n + 1 }, (_, i) => {
      const x = X_MIN + (i / n) * (X_MAX - X_MIN);
      const comps = conditionalComponents(x, inverse);
      return { x, t: mixtureMean(comps) };
    });
  }, [inverse]);

  // Density plot path for p(t|x).
  const densityPlot = useMemo(() => {
    const { tMin, tMax } = densityRange(components);
    const n = 250;
    const tVals = Array.from({ length: n + 1 }, (_, i) => tMin + (i / n) * (tMax - tMin));
    const pVals = tVals.map((t) => mixturePdf(t, components));
    const maxP = Math.max(...pVals, 1e-12);
    const toDx = (t: number) => MARGIN.left + ((t - tMin) / (tMax - tMin)) * PLOT_W;
    const toDy = (p: number) => MARGIN.top + PLOT_H - (p / maxP) * PLOT_H;
    const path = tVals.map((t, i) => `${i === 0 ? 'M' : 'L'} ${toDx(t)} ${toDy(pVals[i])}`).join(' ');
    return { tMin, tMax, maxP, toDx, toDy, path };
  }, [components]);

  // Individual component curves.
  const componentPaths = useMemo(() => {
    const { tMin, tMax } = densityRange(components);
    const n = 120;
    const tVals = Array.from({ length: n + 1 }, (_, i) => tMin + (i / n) * (tMax - tMin));
    return components.map((c) =>
      tVals.map((t, i) => {
        const p = c.weight * gaussianPdf(t, c.mean, c.sigma);
        const x = MARGIN.left + ((t - tMin) / (tMax - tMin)) * PLOT_W;
        const y = densityPlot.toDy(p);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' '),
    );
  }, [components, densityPlot]);

  const xTicks = [-2, -1, 0, 1, 2];
  const yTicks = [-2, -1, 0, 1, 2];

  return (
    <InteractiveDemo title="混合密度网络实验：从 MSE 到条件分布">
      <div className="space-y-5">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch id="mode-toggle" checked={inverse} onCheckedChange={setInverse} />
            <label htmlFor="mode-toggle" className="text-sm font-medium text-gray-700">
              {inverse ? '逆问题（多模态）' : '正问题（单值）'}
            </label>
          </div>
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>选定的 x 值</span>
              <span>{xValue.toFixed(2)}</span>
            </div>
            <Slider
              value={[xValue]}
              min={-2}
              max={2}
              step={0.01}
              onValueChange={(v) => setXValue(v[0])}
            />
          </div>
        </div>

        {/* Plots */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Scatter plot */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="text-xs text-gray-500 px-3 pt-2">数据集 (x, t)</div>
            <svg viewBox={`0 0 ${SCATTER_W} ${SCATTER_H}`} className="w-full" style={{ maxHeight: 340 }}>
              {/* Grid lines */}
              {xTicks.map((x) => (
                <g key={`xg-${x}`}>
                  <line
                    x1={toScatterX(x)}
                    y1={MARGIN.top}
                    x2={toScatterX(x)}
                    y2={MARGIN.top + PLOT_H}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                  />
                  <text x={toScatterX(x)} y={MARGIN.top + PLOT_H + 14} textAnchor="middle" fontSize={10} fill="#9ca3af">
                    {x}
                  </text>
                </g>
              ))}
              {yTicks.map((t) => (
                <g key={`yg-${t}`}>
                  <line
                    x1={MARGIN.left}
                    y1={toScatterY(t)}
                    x2={MARGIN.left + PLOT_W}
                    y2={toScatterY(t)}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                  />
                  <text x={MARGIN.left - 6} y={toScatterY(t) + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                    {t}
                  </text>
                </g>
              ))}
              {/* Data points */}
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={toScatterX(d.x)}
                  cy={toScatterY(d.t)}
                  r={1.8}
                  fill={inverse ? 'rgba(220, 38, 38, 0.45)' : 'rgba(37, 99, 235, 0.45)'}
                />
              ))}
              {/* Conditional mean / MSE regression line */}
              <polyline
                points={meanLine.map((p) => `${toScatterX(p.x)},${toScatterY(p.t)}`).join(' ')}
                fill="none"
                stroke="#059669"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {/* Vertical slice at selected x */}
              <line
                x1={toScatterX(xValue)}
                y1={MARGIN.top}
                x2={toScatterX(xValue)}
                y2={MARGIN.top + PLOT_H}
                stroke="#7c3aed"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <rect
                x={MARGIN.left}
                y={MARGIN.top}
                width={PLOT_W}
                height={PLOT_H}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={1}
              />
            </svg>
          </div>

          {/* Density plot */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="text-xs text-gray-500 px-3 pt-2">
              条件密度
              {' '}
              <KaTeX math="p(t\mid x)" />
            </div>
            <svg viewBox={`0 0 ${DENSITY_W} ${DENSITY_H}`} className="w-full" style={{ maxHeight: 340 }}>
              {/* Axes labels */}
              {[-2, -1, 0, 1, 2].map((t) => {
                const x = densityPlot.toDx(t);
                if (x < MARGIN.left || x > MARGIN.left + PLOT_W) return null;
                return (
                  <g key={`dx-${t}`}>
                    <line x1={x} y1={MARGIN.top} x2={x} y2={MARGIN.top + PLOT_H} stroke="#e5e7eb" strokeWidth={0.5} />
                    <text x={x} y={MARGIN.top + PLOT_H + 14} textAnchor="middle" fontSize={10} fill="#9ca3af">
                      {t}
                    </text>
                  </g>
                );
              })}
              {[0, 0.5, 1].map((ratio) => {
                const y = MARGIN.top + PLOT_H - ratio * PLOT_H;
                const p = ratio * densityPlot.maxP;
                return (
                  <g key={`dy-${ratio}`}>
                    <line x1={MARGIN.left} y1={y} x2={MARGIN.left + PLOT_W} y2={y} stroke="#e5e7eb" strokeWidth={0.5} />
                    <text x={MARGIN.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                      {p.toFixed(1)}
                    </text>
                  </g>
                );
              })}
              {/* Individual component densities */}
              {componentPaths.map((d, i) => (
                <path
                  key={`comp-${i}`}
                  d={d}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                />
              ))}
              {/* Mixture density */}
              <path d={densityPlot.path} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" />
              {/* Conditional mean */}
              <line
                x1={densityPlot.toDx(condMean)}
                y1={MARGIN.top}
                x2={densityPlot.toDx(condMean)}
                y2={MARGIN.top + PLOT_H}
                stroke="#059669"
                strokeWidth={2}
                strokeDasharray="6 3"
              />
              {/* Modes */}
              {modes.map((m, i) => (
                <circle
                  key={`mode-${i}`}
                  cx={densityPlot.toDx(m)}
                  cy={MARGIN.top + PLOT_H - 6}
                  r={4}
                  fill="#dc2626"
                />
              ))}
              <rect
                x={MARGIN.left}
                y={MARGIN.top}
                width={PLOT_W}
                height={PLOT_H}
                fill="none"
                stroke="#9ca3af"
                strokeWidth={1}
              />
            </svg>
          </div>
        </div>

        {/* Metrics and explanation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-indigo-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">混合分量数 K</div>
            <div className="text-lg font-bold text-indigo-700">{components.length}</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">条件均值 E[t|x]（MSE 预测）</div>
            <div className="text-lg font-bold text-emerald-700">{condMean.toFixed(3)}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">条件模态</div>
            <div className="text-lg font-bold text-red-700">
              {modes.length > 0 ? modes.map((m) => m.toFixed(2)).join(', ') : '—'}
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-xs text-gray-600">当前 x</div>
            <div className="text-lg font-bold text-amber-700">{xValue.toFixed(2)}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">分量 k</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  <KaTeX math="\pi_k" />
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  <KaTeX math="\mu_k" />
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  <KaTeX math="\sigma_k" />
                </th>
              </tr>
            </thead>
            <tbody>
              {components.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{c.weight.toFixed(3)}</td>
                  <td className="px-3 py-2">{c.mean.toFixed(3)}</td>
                  <td className="px-3 py-2">{c.sigma.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <KaTeX
            display
            math={String.raw`p(t\mid x)=\sum_{k=1}^{K}\pi_k(x)\,\mathcal N\!\bigl(t\mid \mu_k(x),\sigma_k^2(x)\bigr)`}
          />
          <p>
            <strong>正问题</strong>：
            <KaTeX math="t=\sin(x)+\varepsilon" />
            ，条件分布是单峰的，MSE 回归线（绿色）准确地穿过数据云中心。
          </p>
          <p>
            <strong>逆问题</strong>：
            <KaTeX math="x=t+0.3\sin(2\pi t)+\varepsilon" />
            ，交换坐标后同一 x 可能对应多个 t。此时条件密度呈多峰（紫色曲线），
            而 MSE 给出的条件均值往往落在两个模态之间（红色圆点），无法代表任何一个真实解。
          </p>
          <p>
            <strong>观察</strong>：在逆问题中拖动 x，绿色虚线（MSE 预测）通常位于两个红色圆点（模态）之间——这正是混合密度网络要解决的问题。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
