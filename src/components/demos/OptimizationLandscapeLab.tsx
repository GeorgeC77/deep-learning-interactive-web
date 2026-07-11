import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import { loss, analyticalGrad, stationaryPoint, hessianEigen, type Optimizer, type Landscape, step, type OptState } from '@/lib/math/optimizers';

const GRID = 100; // contour resolution
const W = 520, H = 420, ML = { t: 15, r: 15, b: 40, l: 55 };
const PW = W - ML.l - ML.r, PH = H - ML.t - ML.b;

const PRESETS = [
  { key: 'good', label: '✅ 恰当步长', lr: 0.05, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'tiny', label: '🐌 步长过小', lr: 0.003, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'diverge', label: '💥 发散', lr: 0.5, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'illcond', label: '🦴 病态曲率', lr: 0.02, b1: 0.9, b2: 0.999, landscape: 'illcond' as Landscape },
  { key: 'saddle', label: '⛰️ 鞍点', lr: 0.03, b1: 0.9, b2: 0.999, landscape: 'saddle' as Landscape },
  { key: 'rosenbrock', label: '🍌 Rosenbrock', lr: 0.003, b1: 0.9, b2: 0.999, landscape: 'rosenbrock' as Landscape },
];

export default function OptimizationLandscapeLab() {
  const [landscape, setLandscape] = useState<Landscape>('quadratic');
  const [lr, setLr] = useState(0.05);
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);
  const startX = 1.5, startY = 1.5, steps = 30;

  const allOpts: Optimizer[] = ['GD', 'Momentum', 'RMSProp', 'Adam'];
  const optColors: Record<Optimizer, string> = { GD: '#3b82f6', Momentum: '#f59e0b', RMSProp: '#10b981', Adam: '#ef4444' };

  const results = useMemo(() => {
    const r: Record<string, { path: [number, number][]; lossPath: number[] }> = {};
    for (const opt of allOpts) {
      let st: OptState = { x: startX, y: startY, vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };
      const path: [number, number][] = [[st.x, st.y]];
      const lossPath: number[] = [loss(st.x, st.y, landscape)];
      for (let i = 0; i < steps; i++) {
        const { newState } = step(st, landscape, opt, lr, beta1, beta2);
        st = newState;
        path.push([st.x, st.y]);
        lossPath.push(loss(st.x, st.y, landscape));
      }
      r[opt] = { path, lossPath };
    }
    return r;
  }, [landscape, lr, beta1, beta2]);

  // Real contour grid
  const contours = useMemo(() => {
    const xMin = -2.2, xMax = 2.2, yMin = -2.2, yMax = 2.2;
    const xs = Array.from({ length: GRID }, (_, i) => xMin + (i / (GRID - 1)) * (xMax - xMin));
    const ys = Array.from({ length: GRID }, (_, i) => yMin + (i / (GRID - 1)) * (yMax - yMin));
    const grid = xs.map((x) => ys.map((y) => loss(x, y, landscape)));
    const minL = Math.min(...grid.flat());
    const maxL = Math.max(...grid.flat());
    const levels = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 200].filter((l) => l >= minL && l <= maxL);
    return { levels, grid, minL, maxL, xs, ys, xMin, xMax, yMin, yMax };
  }, [landscape]);

  const toX = (v: number) => ML.l + ((v - contours.xMin) / (contours.xMax - contours.xMin)) * PW;
  const toY = (v: number) => ML.t + PH - ((v - contours.yMin) / (contours.yMax - contours.yMin)) * PH;

  const sp = stationaryPoint(landscape);
  const hessian = hessianEigen(landscape, sp[0], sp[1]);

  return (
    <InteractiveDemo title="优化器对比实验室">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          四种优化器同屏对比。Momentum 使用经典定义 v = βv + g（不是 EMA）；相同学习率不代表相同有效步长。
          梯度向量显示在起点处。鞍点 (0,0) 的 Hessian 特征值: {hessian.vals[0].toFixed(2)}, {hessian.vals[1].toFixed(2)}。
        </p>

        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => { setLandscape(p.landscape); setLr(p.lr); setBeta1(p.b1); setBeta2(p.b2); }}
              className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{p.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: '学习率', val: lr, set: setLr, min: 0.001, max: 1, step: 0.001 },
            { label: 'β₁ (Momentum/Adam)', val: beta1, set: setBeta1, min: 0, max: 0.999, step: 0.01 },
            { label: 'β₂ (RMSProp/Adam)', val: beta2, set: setBeta2, min: 0, max: 0.999, step: 0.01 },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-[10px] text-gray-600 mb-0.5">{c.label}<span className="font-mono">{c.val.toFixed(2)}</span></div>
              <Slider value={[c.val]} min={c.min} max={c.max} step={c.step} onValueChange={(v) => c.set(v[0])} />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 440 }}>
            {/* Contour heatmap — simplified: just level lines */}
            {contours.levels.map((lvl, li) => {
              const paths: string[] = [];
              for (let i = 1; i < GRID; i++) for (let j = 1; j < GRID; j++) {
                const corners = [contours.grid[i - 1][j - 1], contours.grid[i][j - 1], contours.grid[i][j], contours.grid[i - 1][j]];
                const above = corners.filter((v) => v <= lvl);
                if (above.length > 0 && above.length < 4) {
                  const x = toX(contours.xs[i - 1] + (contours.xs[i] - contours.xs[i - 1]) / 2);
                  const y = toY(contours.ys[j - 1] + (contours.ys[j] - contours.ys[j - 1]) / 2);
                  paths.push(`${x},${y}`);
                }
              }
              return paths.length > 0 ? <polygon key={li} points={paths.join(' ')} fill="none" stroke="#e5e7eb" strokeWidth={0.3} /> : null;
            })}
            {/* Start + gradient vector */}
            <circle cx={toX(startX)} cy={toY(startY)} r={4} fill="#1f2937" />
            {(() => {
              const [gx, gy] = analyticalGrad(startX, startY, landscape);
              const scale = 0.3 / Math.max(Math.hypot(gx, gy), 1e-6);
              return <line x1={toX(startX)} y1={toY(startY)} x2={toX(startX - gx * scale)} y2={toY(startY - gy * scale)} stroke="#1f2937" strokeWidth={2} markerEnd="url(#arrow)" />;
            })()}
            {/* Paths */}
            {allOpts.map((o) => (
              <polyline key={o} points={results[o].path.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke={optColors[o]} strokeWidth={1.5} opacity={0.8} />
            ))}
            {allOpts.map((o) => {
              const last = results[o].path[results[o].path.length - 1];
              return <circle key={o} cx={toX(last[0])} cy={toY(last[1])} r={3.5} fill={optColors[o]} />;
            })}
            {/* Stationary point — use eigenvalues to determine type */}
            <circle cx={toX(sp[0])} cy={toY(sp[1])} r={5} fill="none" stroke="#6b7280" strokeWidth={2} />
            <text x={toX(sp[0])} y={toY(sp[1]) - 8} textAnchor="middle" className="text-[10px]" fill="#6b7280">
              ★ {hessian.vals[0] > 0 && hessian.vals[1] > 0 ? 'minimum' : hessian.vals[0] < 0 && hessian.vals[1] < 0 ? 'maximum' : 'saddle'}
              {landscape === 'rosenbrock' ? ' @ (1,1)' : ''}
            </text>
            {/* Arnold arrow marker */}
            <defs><marker id="arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" /></marker></defs>
            <rect x={ML.l} y={ML.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
          </svg>
          <div className="flex justify-center gap-3 pb-2 text-[10px]">
            {allOpts.map((o) => <span key={o}><span className="inline-block w-3 h-[2px] align-middle mr-1" style={{backgroundColor: optColors[o]}} />{o}</span>)}
          </div>
        </div>

        {/* Loss curves — shared y-axis */}
        <div className="bg-white rounded-lg border p-3">
          <div className="text-xs font-medium text-gray-600 mb-2">Loss vs Iteration（共享纵轴）</div>
          <svg viewBox="0 0 480 160" className="w-full" style={{ maxHeight: 180 }}>
            {(() => {
              const allLosses = allOpts.flatMap((o) => results[o].lossPath);
              const globalMax = Math.max(...allLosses, 1);
              const globalMin = Math.max(0, Math.min(...allLosses));
              const range = Math.max(globalMax - globalMin, 1e-6);
              return allOpts.map((o) => {
                const lp = results[o].lossPath;
                return <polyline key={o} points={lp.map((l, i) => `${10 + i / steps * 460},${150 - ((l - globalMin) / range) * 140}`).join(' ')} fill="none" stroke={optColors[o]} strokeWidth={1.5} opacity={0.8} />;
              });
            })()}
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {allOpts.map((o) => {
            const last = results[o].lossPath[results[o].lossPath.length - 1];
            return <div key={o} className="rounded-lg p-2" style={{backgroundColor: optColors[o] + '15'}}><div className="text-[10px] text-gray-600">{o}</div><div className="text-sm font-bold" style={{color: optColors[o]}}>{last.toFixed(4)}</div></div>;
          })}
        </div>

        <div className="text-[10px] text-gray-400">
          {"Momentum: v_t = β·v_{t-1} + g_t（经典定义，非EMA）。Adam 中 β₁ 控制一阶矩估计衰减。相同 learning rate 在不同优化器中不代表相同有效步长。"}
        </div>
      </div>
    </InteractiveDemo>
  );
}
