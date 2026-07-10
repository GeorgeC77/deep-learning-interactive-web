import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 损失函数                                                                    */
/* -------------------------------------------------------------------------- */
type Landscape = 'quadratic' | 'illcond' | 'saddle' | 'rosenbrock';

function loss(x: number, y: number, landscape: Landscape): number {
  switch (landscape) {
    case 'quadratic': return x * x + y * y;
    case 'illcond': return 0.05 * x * x + 5 * y * y;
    case 'saddle': return x * x - y * y + 0.1 * x * x * x * x + 0.1 * y * y * y * y;
    case 'rosenbrock': return Math.pow(1 - x, 2) + 100 * Math.pow(y - x * x, 2);
  }
}

function grad(x: number, y: number, landscape: Landscape): [number, number] {
  const h = 1e-5;
  return [
    (loss(x + h, y, landscape) - loss(x - h, y, landscape)) / (2 * h),
    (loss(x, y + h, landscape) - loss(x, y - h, landscape)) / (2 * h),
  ];
}

/* -------------------------------------------------------------------------- */
/* 优化器                                                                     */
/* -------------------------------------------------------------------------- */
type Optimizer = 'GD' | 'Momentum' | 'RMSProp' | 'Adam';

function step(
  x: number, y: number, vx: number, vy: number, sx: number, sy: number, t: number,
  landscape: Landscape, opt: Optimizer,
  lr: number, momentum: number, beta1: number, beta2: number,
): { x: number; y: number; vx: number; vy: number; sx: number; sy: number } {
  const [gx, gy] = grad(x, y, landscape);
  let dx = 0, dy = 0;
  switch (opt) {
    case 'GD': dx = -lr * gx; dy = -lr * gy; break;
    case 'Momentum': {
      const nvx = momentum * vx + (1 - momentum) * gx;
      const nvy = momentum * vy + (1 - momentum) * gy;
      dx = -lr * nvx; dy = -lr * nvy;
      return { x: x + dx, y: y + dy, vx: nvx, vy: nvy, sx, sy };
    }
    case 'RMSProp': {
      const nsx = beta2 * sx + (1 - beta2) * gx * gx;
      const nsy = beta2 * sy + (1 - beta2) * gy * gy;
      dx = -(lr / (Math.sqrt(nsx) + 1e-8)) * gx;
      dy = -(lr / (Math.sqrt(nsy) + 1e-8)) * gy;
      return { x: x + dx, y: y + dy, vx, vy, sx: nsx, sy: nsy };
    }
    case 'Adam': {
      const nvx = beta1 * vx + (1 - beta1) * gx;
      const nvy = beta1 * vy + (1 - beta1) * gy;
      const nsx = beta2 * sx + (1 - beta2) * gx * gx;
      const nsy = beta2 * sy + (1 - beta2) * gy * gy;
      const vxc = nvx / (1 - Math.pow(beta1, t + 1));
      const vyc = nvy / (1 - Math.pow(beta1, t + 1));
      const sxc = nsx / (1 - Math.pow(beta2, t + 1));
      const syc = nsy / (1 - Math.pow(beta2, t + 1));
      dx = -(lr / (Math.sqrt(sxc) + 1e-8)) * vxc;
      dy = -(lr / (Math.sqrt(syc) + 1e-8)) * vyc;
      return { x: x + dx, y: y + dy, vx: nvx, vy: nvy, sx: nsx, sy: nsy };
    }
  }
  return { x: x + dx, y: y + dy, vx: 0, vy: 0, sx, sy };
}

/* -------------------------------------------------------------------------- */
/* 预设                                                                       */
/* -------------------------------------------------------------------------- */
const PRESETS = [
  { key: 'good', label: '✅ 恰当步长', lr: 0.05, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'tiny', label: '🐌 步长过小', lr: 0.003, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'diverge', label: '💥 发散', lr: 0.5, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'quadratic' as Landscape },
  { key: 'illcond', label: '🦴 病态曲率', lr: 0.02, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'illcond' as Landscape },
  { key: 'saddle', label: '⛰️ 鞍点', lr: 0.03, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'saddle' as Landscape },
  { key: 'rosenbrock', label: '🍌 Rosenbrock', lr: 0.003, mom: 0.9, b1: 0.9, b2: 0.999, landscape: 'rosenbrock' as Landscape },
];

/* -------------------------------------------------------------------------- */
/* SVG                                                                        */
/* -------------------------------------------------------------------------- */
const W = 520, H = 420, M = { t: 15, r: 15, b: 40, l: 55 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;

export default function OptimizationLandscapeLab() {
  const [landscape, setLandscape] = useState<Landscape>('quadratic');
  const [lr, setLr] = useState(0.05);
  const [momentum, setMomentum] = useState(0.9);
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);
  const startX = 1.5, startY = 1.5, steps = 30;

  // Run all 4 optimizers
  const runOpt = (optName: Optimizer) => {
    let x = startX, y = startY, vx = 0, vy = 0, sx = 0, sy = 0;
    const path: [number, number][] = [[x, y]];
    const lossPath: number[] = [loss(x, y, landscape)];
    for (let t = 0; t < steps; t++) {
      const r = step(x, y, vx, vy, sx, sy, t, landscape, optName, lr, momentum, beta1, beta2);
      x = r.x; y = r.y; vx = r.vx; vy = r.vy; sx = r.sx; sy = r.sy;
      path.push([x, y]);
      lossPath.push(loss(x, y, landscape));
    }
    return { path, lossPath };
  };

  const allOpts: Optimizer[] = ['GD', 'Momentum', 'RMSProp', 'Adam'];
  const results = useMemo(() => {
    const r: Record<Optimizer, { path: [number, number][]; lossPath: number[] }> = {} as any;
    allOpts.forEach((o) => { r[o] = runOpt(o); });
    return r;
  }, [landscape, lr, momentum, beta1, beta2, startX, startY, steps]);

  const optColors: Record<Optimizer, string> = {
    GD: '#3b82f6', Momentum: '#f59e0b', RMSProp: '#10b981', Adam: '#ef4444',
  };

  // Contour data
  const contourLines = useMemo(() => {
    const lines: { lvl: number; pts: string }[] = [];
    for (let l = -1; l <= 3; l += 0.5) {
      const lvl = Math.pow(10, l);
      // Simple: just draw some circles/ellipses
      const pts: string[] = [];
      for (let a = 0; a <= 360; a += 5) {
        const rad = a * Math.PI / 180;
        let cx = Math.cos(rad), cy = Math.sin(rad);
        if (landscape === 'illcond') { cx *= Math.sqrt(lvl / 0.05); cy *= Math.sqrt(lvl / 5); }
        else { cx *= Math.sqrt(lvl); cy *= Math.sqrt(lvl); }
        const sx = M.l + (cx + 2) / 4 * PW;
        const sy = M.t + PH - (cy + 2) / 4 * PH;
        if (sx >= M.l && sx <= W - M.r && sy >= M.t && sy <= H - M.b) pts.push(`${sx},${sy}`);
      }
      if (pts.length > 0) lines.push({ lvl, pts: pts.join(' ') });
    }
    return lines;
  }, [landscape]);

  const toX = (v: number) => M.l + ((v + 2) / 4) * PW;
  const toY = (v: number) => M.t + PH - ((v + 2) / 4) * PH;

  return (
    <InteractiveDemo title="优化器对比实验室：四种优化器同屏竞技">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          同一个起点、同一个损失函数下，四种优化器（<span style={{color: optColors.GD}}>GD</span>、<span style={{color: optColors.Momentum}}>Momentum</span>、<span style={{color: optColors.RMSProp}}>RMSProp</span>、<span style={{color: optColors.Adam}}>Adam</span>）分别如何走向最优点？
        </p>

        {/* Presets */}
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button key={p.key} onClick={() => { setLandscape(p.landscape); setLr(p.lr); setMomentum(p.mom); setBeta1(p.b1); setBeta2(p.b2); }}
              className="px-2 py-1 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{p.label}</button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: '学习率', val: lr, set: setLr, min: 0.001, max: 1, step: 0.001, fmt: (v: number) => v.toFixed(3) },
            { label: '动量 β', val: momentum, set: setMomentum, min: 0, max: 0.999, step: 0.01, fmt: (v: number) => v.toFixed(2) },
            { label: 'β₁ (Adam)', val: beta1, set: setBeta1, min: 0, max: 0.999, step: 0.01, fmt: (v: number) => v.toFixed(2) },
            { label: 'β₂ (RMS/Adam)', val: beta2, set: setBeta2, min: 0, max: 0.999, step: 0.01, fmt: (v: number) => v.toFixed(2) },
          ].map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-[10px] text-gray-600 mb-0.5">{c.label}<span className="font-mono">{c.fmt(c.val)}</span></div>
              <Slider value={[c.val]} min={c.min} max={c.max} step={c.step} onValueChange={(v) => c.set(v[0])} />
            </div>
          ))}
        </div>

        {/* SVG */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 440 }}>
            {/* Contours */}
            {contourLines.map((cl, i) => (
              <polygon key={i} points={cl.pts} fill="none" stroke="#e5e7eb" strokeWidth={0.5} />
            ))}
            {/* Start point */}
            <circle cx={toX(startX)} cy={toY(startY)} r={4} fill="#1f2937" />
            {/* Paths */}
            {allOpts.map((o) => (
              <polyline key={o}
                points={results[o].path.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')}
                fill="none" stroke={optColors[o]} strokeWidth={1.5} opacity={0.8} />
            ))}
            {/* End points */}
            {allOpts.map((o) => {
              const last = results[o].path[results[o].path.length - 1];
              return <circle key={o} cx={toX(last[0])} cy={toY(last[1])} r={3.5} fill={optColors[o]} />;
            })}
            {/* Minimum marker */}
            <text x={toX(0)} y={toY(0) - 8} textAnchor="middle" className="text-[10px]" fill="#6b7280">★ min</text>
            <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
          </svg>
          {/* Legend */}
          <div className="flex justify-center gap-3 pb-2 text-[10px]">
            {allOpts.map((o) => (
              <span key={o}><span className="inline-block w-3 h-[2px] align-middle mr-1" style={{ backgroundColor: optColors[o] }} />{o}</span>
            ))}
          </div>
        </div>

        {/* Loss curves */}
        <div className="bg-white rounded-lg border p-3">
          <div className="text-xs font-medium text-gray-600 mb-2">Loss vs Iteration</div>
          <svg viewBox="0 0 480 160" className="w-full" style={{ maxHeight: 180 }}>
            {allOpts.map((o) => {
              const lp = results[o].lossPath;
              const maxL = Math.max(...lp, 1);
              return (
                <polyline key={o}
                  points={lp.map((l, i) => `${10 + i / steps * 460},${150 - (l / maxL) * 140}`).join(' ')}
                  fill="none" stroke={optColors[o]} strokeWidth={1.5} opacity={0.8} />
              );
            })}
          </svg>
        </div>

        {/* Final loss comparison */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {allOpts.map((o) => {
            const final = results[o].lossPath[results[o].lossPath.length - 1];
            return (
              <div key={o} className="rounded-lg p-2" style={{ backgroundColor: optColors[o] + '15' }}>
                <div className="text-[10px] text-gray-600">{o}</div>
                <div className="text-sm font-bold" style={{ color: optColors[o] }}>{final.toFixed(4)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </InteractiveDemo>
  );
}
