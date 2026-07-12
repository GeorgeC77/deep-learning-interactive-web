import { useState, useMemo } from 'react';
import { contours as d3Contours } from 'd3-contour';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import InteractiveDemo from '@/components/InteractiveDemo';
import { loss, analyticalGrad, stationaryPoint, hessianEigen, type Optimizer, type Landscape, step, type OptState } from '@/lib/math/optimizers';

const GRID = 80; // contour resolution
const W = 520, H = 420, ML = { t: 15, r: 15, b: 40, l: 55 };
const PW = W - ML.l - ML.r, PH = H - ML.t - ML.b;

type StartPreset = { key: string; label: string; x: number; y: number };

const START_PRESETS: StartPreset[] = [
  { key: 'ordinary', label: '常规起点 (1.5, 1.5)', x: 1.5, y: 1.5 },
  { key: 'nearSaddle', label: '鞍点附近 (0.02, 0.02)', x: 0.02, y: 0.02 },
  { key: 'exactSaddle', label: '精确鞍点 (0, 0)', x: 0, y: 0 },
];

const PRESETS = [
  { key: 'good', label: '✅ 恰当步长', lr: 0.05, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'tiny', label: '🐌 步长过小', lr: 0.003, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'oneStep', label: '🎯 一步到最优', lr: 0.5, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'critical', label: '〰️ 临界振荡', lr: 1.0, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'diverge', label: '💥 GD 发散', lr: 1.2, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'illcond', label: '🦴 病态曲率', lr: 0.02, b1: 0.9, b2: 0.999, landscape: 'illcond' as Landscape },
  { key: 'saddle', label: '⛰️ 鞍点', lr: 0.03, b1: 0.9, b2: 0.999, landscape: 'saddle' as Landscape },
  { key: 'rosenbrock', label: '🍌 Rosenbrock', lr: 0.003, b1: 0.9, b2: 0.999, landscape: 'rosenbrock' as Landscape },
];

const LANDSCAPE_LEVELS: Record<Landscape, number[]> = {
  quadratic: [0.2, 0.5, 1, 2, 4, 8],
  illcond: [0.5, 1, 2, 5, 10, 20],
  saddle: [-3, -2, -1, 0, 1, 2, 3],
  rosenbrock: [1, 5, 25, 125, 625, 3125],
};

const ALL_OPTS: Optimizer[] = ['GD', 'Momentum', 'RMSProp', 'Adam'];
const OPT_COLORS: Record<Optimizer, string> = { GD: '#3b82f6', Momentum: '#f59e0b', RMSProp: '#10b981', Adam: '#ef4444' };

export default function OptimizationLandscapeLab() {
  const [landscape, setLandscape] = useState<Landscape>('quadratic');
  const [lr, setLr] = useState(0.05);
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);
  const [startPreset, setStartPreset] = useState<StartPreset>(START_PRESETS[0]);
  const [noiseEnabled, setNoiseEnabled] = useState(false);
  const [noiseScale, setNoiseScale] = useState(0.05);
  const steps = 30;

  const startX = startPreset.x;
  const startY = startPreset.y;
  const effectiveNoise = noiseEnabled ? noiseScale : 0;

  const results = useMemo(() => {
    const r: Record<string, { path: [number, number][]; lossPath: number[] }> = {};
    for (const opt of ALL_OPTS) {
      let st: OptState = { x: startX, y: startY, vx: 0, vy: 0, sx: 0, sy: 0, t: 0 };
      const path: [number, number][] = [[st.x, st.y]];
      const lossPath: number[] = [loss(st.x, st.y, landscape)];
      for (let i = 0; i < steps; i++) {
        const { newState } = step(st, landscape, opt, lr, beta1, beta2, effectiveNoise);
        st = newState;
        path.push([st.x, st.y]);
        lossPath.push(loss(st.x, st.y, landscape));
      }
      r[opt] = { path, lossPath };
    }
    return r;
  }, [landscape, lr, beta1, beta2, startX, startY, effectiveNoise]);

  // Real contour grid computed with d3-contour (marching squares).
  const contourData = useMemo(() => {
    const xMin = -2.2, xMax = 2.2, yMin = -2.2, yMax = 2.2;
    const xs = Array.from({ length: GRID }, (_, i) => xMin + (i / (GRID - 1)) * (xMax - xMin));
    const ys = Array.from({ length: GRID }, (_, i) => yMin + (i / (GRID - 1)) * (yMax - yMin));

    // d3-contour expects values in row-major order: values[y * width + x].
    const values: number[] = new Array(GRID * GRID);
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        values[j * GRID + i] = loss(xs[i], ys[j], landscape);
      }
    }

    const levels = LANDSCAPE_LEVELS[landscape];
    const cont = d3Contours().size([GRID, GRID]).smooth(true).thresholds(levels)(values);

    return { cont, xMin, xMax, yMin, yMax };
  }, [landscape]);

  const toX = (v: number) => ML.l + ((v - contourData.xMin) / (contourData.xMax - contourData.xMin)) * PW;
  const toY = (v: number) => ML.t + PH - ((v - contourData.yMin) / (contourData.yMax - contourData.yMin)) * PH;

  const toSvgX = (gx: number) => toX(contourData.xMin + ((gx - 0.5) / (GRID - 1)) * (contourData.xMax - contourData.xMin));
  const toSvgY = (gy: number) => toY(contourData.yMin + ((gy - 0.5) / (GRID - 1)) * (contourData.yMax - contourData.yMin));

  const sp = stationaryPoint(landscape);
  const hessian = hessianEigen(landscape, sp[0], sp[1]);

  const saddleNote = landscape === 'saddle' ? (
    startPreset.key === 'exactSaddle' && !noiseEnabled
      ? '精确鞍点 (0,0) + 确定性 GD：梯度为 0，优化器静止不动。'
      : startPreset.key === 'exactSaddle' && noiseEnabled
        ? '精确鞍点 + 噪声：随机梯度提供逃离方向，优化器沿负曲率方向（y 轴）离开鞍点。'
        : startPreset.key === 'nearSaddle' && !noiseEnabled
          ? '鞍点附近 + 确定性 GD：微小扰动打破平衡，优化器沿负曲率方向（y 轴）逃离。'
          : '鞍点附近 + 噪声：梯度噪声与局部负曲率共同作用，逃离鞍点。'
  ) : null;

  return (
    <InteractiveDemo title="优化器对比实验室">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          {landscape === 'quadratic' && '二次函数，全局最小值在 (0,0)。'}
          {landscape === 'illcond' && '病态二次函数，全局最小值在 (0,0)，不同方向曲率差异大。'}
          {landscape === 'saddle' && '当前视图展示 (0,0) 附近的局部鞍点结构。'}
          {landscape === 'rosenbrock' && 'Rosenbrock 函数，全局最小值在 (1,1)。'}
          {' 四种优化器同屏对比。等高线由真实损失函数通过 marching squares 绘制；Momentum 使用经典定义 v = βv + g（不是 EMA）；相同学习率不代表相同有效步长。'}
          {landscape === 'saddle' && ` 鞍点 (0,0) 的 Hessian 特征值: ${hessian.vals[0].toFixed(2)}, ${hessian.vals[1].toFixed(2)}。`}
        </p>

        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => { setLandscape(p.landscape); setLr(p.lr); setBeta1(p.b1); setBeta2(p.b2); }}
              className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{p.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: '学习率', val: lr, set: setLr, min: 0.001, max: 1.5, step: 0.001 },
            { label: 'β₁ (Momentum/Adam)', val: beta1, set: setBeta1, min: 0, max: 0.999, step: 0.01 },
            { label: 'β₂ (RMSProp/Adam)', val: beta2, set: setBeta2, min: 0, max: 0.999, step: 0.01 },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-[10px] text-gray-600 mb-0.5">{c.label}<span className="font-mono">{c.val.toFixed(2)}</span></div>
              <Slider value={[c.val]} min={c.min} max={c.max} step={c.step} onValueChange={(v) => c.set(v[0])} />
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
          <div className="text-xs font-medium text-gray-700">起点选择</div>
          <div className="flex flex-wrap gap-1">
            {START_PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setStartPreset(p)}
                className={`px-2 py-1 text-[10px] rounded border ${startPreset.key === p.key ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="noise-toggle" checked={noiseEnabled} onCheckedChange={setNoiseEnabled} />
              <label htmlFor="noise-toggle" className="text-[10px] text-gray-700 cursor-pointer">mini-batch 梯度噪声</label>
            </div>
            <span className="text-[10px] font-mono text-gray-600">σ = {noiseScale.toFixed(3)}</span>
          </div>
          <Slider value={[noiseScale]} min={0.001} max={0.5} step={0.001} onValueChange={(v) => setNoiseScale(v[0])} disabled={!noiseEnabled} />
        </div>

        {saddleNote && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2">
            {saddleNote}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 440 }}>
            {/* Real contour lines */}
            {contourData.cont.map((c, ci) => (
              <g key={ci}>
                {c.coordinates.map((polygon, pi) =>
                  polygon.map((ring, ri) => {
                    const d = ring.map(([gx, gy], i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(gx)} ${toSvgY(gy)}`).join(' ') + ' Z';
                    return <path key={`${ci}-${pi}-${ri}`} d={d} fill="none" stroke="#94a3b8" strokeWidth={0.6} opacity={0.7} />;
                  })
                )}
              </g>
            ))}
            {/* Start + gradient vector */}
            <circle cx={toX(startX)} cy={toY(startY)} r={4} fill="#1f2937" />
            {(() => {
              const [gx, gy] = analyticalGrad(startX, startY, landscape);
              const scale = 0.3 / Math.max(Math.hypot(gx, gy), 1e-6);
              return <line x1={toX(startX)} y1={toY(startY)} x2={toX(startX - gx * scale)} y2={toY(startY - gy * scale)} stroke="#1f2937" strokeWidth={2} markerEnd="url(#arrow)" />;
            })()}
            {/* Paths */}
            {ALL_OPTS.map((o) => (
              <polyline key={o} points={results[o].path.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')} fill="none" stroke={OPT_COLORS[o]} strokeWidth={1.5} opacity={0.8} />
            ))}
            {ALL_OPTS.map((o) => {
              const last = results[o].path[results[o].path.length - 1];
              return <circle key={o} cx={toX(last[0])} cy={toY(last[1])} r={3.5} fill={OPT_COLORS[o]} />;
            })}
            {/* Stationary point — use eigenvalues to determine type */}
            <circle cx={toX(sp[0])} cy={toY(sp[1])} r={5} fill="none" stroke="#6b7280" strokeWidth={2} />
            <text x={toX(sp[0])} y={toY(sp[1]) - 8} textAnchor="middle" className="text-[10px]" fill="#6b7280">
              ★ {hessian.vals[0] > 0 && hessian.vals[1] > 0 ? 'minimum' : hessian.vals[0] < 0 && hessian.vals[1] < 0 ? 'maximum' : 'saddle'}
              {landscape === 'rosenbrock' ? ' @ (1,1)' : ''}
            </text>
            {/* Arrow marker */}
            <defs><marker id="arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" /></marker></defs>
            <rect x={ML.l} y={ML.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
          </svg>
          <div className="flex justify-center gap-3 pb-2 text-[10px]">
            {ALL_OPTS.map((o) => <span key={o}><span className="inline-block w-3 h-[2px] align-middle mr-1" style={{backgroundColor: OPT_COLORS[o]}} />{o}</span>)}
          </div>
        </div>

        {/* Loss curves — shared y-axis */}
        <div className="bg-white rounded-lg border p-3">
          <div className="text-xs font-medium text-gray-600 mb-2">Loss vs Iteration（共享纵轴）</div>
          <svg viewBox="0 0 480 160" className="w-full" style={{ maxHeight: 180 }}>
            {(() => {
              const allLosses = ALL_OPTS.flatMap((o) => results[o].lossPath);
              const globalMax = Math.max(...allLosses, 1);
              const globalMin = Math.min(...allLosses);
              const range = Math.max(globalMax - globalMin, 1e-6);
              return ALL_OPTS.map((o) => {
                const lp = results[o].lossPath;
                return <polyline key={o} points={lp.map((l, i) => `${10 + i / steps * 460},${150 - ((l - globalMin) / range) * 140}`).join(' ')} fill="none" stroke={OPT_COLORS[o]} strokeWidth={1.5} opacity={0.8} />;
              });
            })()}
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {ALL_OPTS.map((o) => {
            const last = results[o].lossPath[results[o].lossPath.length - 1];
            return <div key={o} className="rounded-lg p-2" style={{backgroundColor: OPT_COLORS[o] + '15'}}><div className="text-[10px] text-gray-600">{o}</div><div className="text-sm font-bold" style={{color: OPT_COLORS[o]}}>{last.toFixed(4)}</div></div>;
          })}
        </div>

        <div className="text-[10px] text-gray-400">
          {"Momentum: v_t = β·v_{t-1} + g_t（经典定义，非EMA）。Adam 中 β₁ 控制一阶矩估计衰减。相同 learning rate 在不同优化器中不代表相同有效步长。预设“GD 发散”仅指导 vanilla GD 在该学习率下发散；自适应与带动量的优化器行为不同。"}
        </div>
      </div>
    </InteractiveDemo>
  );
}
