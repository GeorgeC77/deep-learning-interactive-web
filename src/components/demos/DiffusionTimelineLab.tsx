import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 扩散参数                                                                    */
/* -------------------------------------------------------------------------- */
function makeBetaSchedule(T: number, betaStart: number, betaEnd: number): number[] {
  return Array.from({ length: T }, (_, t) => betaStart + (t / (T - 1)) * (betaEnd - betaStart));
}

function alphaBar(t: number, betas: number[]): number {
  let prod = 1;
  for (let i = 0; i <= t; i++) prod *= (1 - betas[i]);
  return prod;
}

/* -------------------------------------------------------------------------- */
/* 生成二维点云                                                               */
/* -------------------------------------------------------------------------- */
function generatePointCloud(type: 'circle' | 'swiss' | 'moons', N: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    let x: number, y: number;
    const a = (i / N) * Math.PI * 2;
    switch (type) {
      case 'circle':
        x = Math.cos(a) * 1.2; y = Math.sin(a) * 1.2;
        break;
      case 'swiss':
        x = a / Math.PI - 1; y = Math.sin(a * 3) * 0.8 + (Math.random() - 0.5) * 0.3;
        break;
      case 'moons':
        const h = i < N / 2 ? 0 : 1;
        const angle = (i % (N / 2)) / (N / 2) * Math.PI;
        x = Math.cos(angle) * 1.0 + h * 0.6 - 0.3;
        y = Math.sin(angle) * 1.0 - h * 0.3;
        break;
      default: x = 0; y = 0;
    }
    pts.push([x + (Math.random() - 0.5) * 0.15, y + (Math.random() - 0.5) * 0.15]);
  }
  return pts;
}

const W = 420, H = 380, M = { t: 15, r: 15, b: 40, l: 45 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;
const toX = (v: number) => M.l + ((v + 2.5) / 5) * PW;
const toY = (v: number) => M.t + PH - ((v + 2.5) / 5) * PH;

export default function DiffusionTimelineLab() {
  const T = 10;
  const N = 100;
  const betaStart = 0.0001;
  const betaEnd = 0.02;
  const [currentT, setCurrentT] = useState(0);
  const [cloudType, setCloudType] = useState<'circle' | 'swiss' | 'moons'>('circle');
  const [seed, setSeed] = useState(42);
  const [stochastic, setStochastic] = useState(false);

  const betas = useMemo(() => makeBetaSchedule(T, betaStart, betaEnd), [T, betaStart, betaEnd]);
  const z0 = useMemo(() => generatePointCloud(cloudType, N), [cloudType, N]);

  // Forward: z_t = sqrt(alpha_bar_t) * z_0 + sqrt(1 - alpha_bar_t) * epsilon
  const epsilon = useMemo(() => {
    const rng = mulberry32(seed);
    return z0.map(() => [rng() * 2 - 1, rng() * 2 - 1] as [number, number]);
  }, [z0, seed]);

  const zt = useMemo(() => {
    const ab = alphaBar(currentT, betas);
    const sqrtAb = Math.sqrt(ab);
    const sqrt1mAb = Math.sqrt(1 - ab);
    return z0.map(([x, y], i) => [
      sqrtAb * x + sqrt1mAb * epsilon[i][0],
      sqrtAb * y + sqrt1mAb * epsilon[i][1],
    ] as [number, number]);
  }, [z0, epsilon, betas, currentT]);

  // Simulated reverse: z_0_hat = (z_t - sqrt(1-ab)*epsilon_hat) / sqrt(ab)
  // epsilon_hat = epsilon + noise * scale (simulate imperfect prediction)
  const epsilonHat = useMemo(() => {
    const noise = stochastic ? 0.3 : 0;
    const rng = mulberry32(seed + 999);
    return epsilon.map(([ex, ey]) => [
      ex + (rng() - 0.5) * noise,
      ey + (rng() - 0.5) * noise,
    ] as [number, number]);
  }, [epsilon, seed, stochastic]);

  const z0hat = useMemo(() => {
    const ab = alphaBar(currentT, betas);
    const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
    const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
    return zt.map(([x, y], i) => [
      (x - sqrt1mAb * epsilonHat[i][0]) / sqrtAb,
      (y - sqrt1mAb * epsilonHat[i][1]) / sqrtAb,
    ] as [number, number]);
  }, [zt, epsilonHat, betas, currentT]);

  // Loss at current t
  const lossT = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < N; i++) {
      sum += (epsilon[i][0] - epsilonHat[i][0]) ** 2 + (epsilon[i][1] - epsilonHat[i][1]) ** 2;
    }
    return sum / N;
  }, [epsilon, epsilonHat, N]);

  return (
    <InteractiveDemo title="扩散模型时间线实验：从正向加噪到反向去噪">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          选择一个二维点云（如圆形），观察正向扩散过程（逐步加噪到纯高斯）和反向去噪过程。
          ε 在所有时间步都服从标准高斯 N(0,I)，因此目标尺度统一；但 z_t 由 z_0 和 ε 构造，网络需从 z_t 和 t 推断 ε。
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {(['circle', 'swiss', 'moons'] as const).map((t) => (
            <button key={t} onClick={() => setCloudType(t)}
              className={`px-3 py-1 text-xs rounded-lg ${cloudType === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {t === 'circle' ? '⭕ 圆' : t === 'swiss' ? '🥐 Swiss Roll' : '🌙 Moons'}
            </button>
          ))}
          <button onClick={() => setSeed(Math.floor(Math.random() * 10000))}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 ε 重采样</button>
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={stochastic} onChange={() => setStochastic(!stochastic)} />
            ε̂ 含噪声（模拟不完美预测）
          </label>
        </div>

        {/* Timeline slider */}
        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>时间步 t</span>
            <span>{currentT} / {T - 1}</span>
          </div>
          <Slider value={[currentT]} min={0} max={T - 1} step={1} onValueChange={(v) => setCurrentT(v[0])} />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>z₀（数据）</span>
            <span>ᾱ_t = {alphaBar(currentT, betas).toFixed(4)}</span>
            <span>z_T（噪声）</span>
          </div>
        </div>

        {/* Three views */}
        <div className="grid md:grid-cols-3 gap-3">
          {/* z_0 (original) */}
          <div className="bg-gray-50 rounded-lg border overflow-hidden">
            <div className="text-center text-[10px] font-medium text-gray-600 pt-1">z₀（原始数据）</div>
            <svg viewBox={`0 0 ${W / 2} ${H / 2}`} className="w-full" style={{ maxHeight: 180 }}>
              {z0.map(([x, y], i) => (
                <circle key={i} cx={toX(x) / 2} cy={toY(y) / 2} r={1.5} fill="#3b82f6" opacity={0.7} />
              ))}
              <rect x={M.l / 2} y={M.t / 2} width={PW / 2} height={PH / 2} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>
          {/* z_t (current noisy) */}
          <div className="bg-gray-50 rounded-lg border overflow-hidden">
            <div className="text-center text-[10px] font-medium text-gray-600 pt-1">z_t（t={currentT}，含噪声）</div>
            <svg viewBox={`0 0 ${W / 2} ${H / 2}`} className="w-full" style={{ maxHeight: 180 }}>
              {zt.map(([x, y], i) => (
                <circle key={i} cx={toX(x) / 2} cy={toY(y) / 2} r={1.5} fill={currentT < T / 3 ? '#3b82f6' : currentT < 2 * T / 3 ? '#f59e0b' : '#ef4444'} opacity={0.6} />
              ))}
              <rect x={M.l / 2} y={M.t / 2} width={PW / 2} height={PH / 2} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>
          {/* z_0_hat (reconstructed) */}
          <div className="bg-gray-50 rounded-lg border overflow-hidden">
            <div className="text-center text-[10px] font-medium text-gray-600 pt-1">ẑ₀（从 z_t 反推）</div>
            <svg viewBox={`0 0 ${W / 2} ${H / 2}`} className="w-full" style={{ maxHeight: 180 }}>
              {z0hat.map(([x, y], i) => (
                <circle key={i} cx={toX(x) / 2} cy={toY(y) / 2} r={1.5} fill="#10b981" opacity={0.7} />
              ))}
              <rect x={M.l / 2} y={M.t / 2} width={PW / 2} height={PH / 2} fill="none" stroke="#d1d5db" strokeWidth={1} />
            </svg>
          </div>
        </div>

        {/* Epsilon display */}
        <div className="grid grid-cols-3 gap-3">
          {['ε (真实噪声)', 'ε̂ (预测噪声)', `MSE: ${lossT.toFixed(4)}`].map((label, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg border p-2 text-center">
              <div className="text-[9px] text-gray-500 mb-1">{label}</div>
              <svg viewBox={`0 0 160 120`} className="w-full" style={{ maxHeight: 120 }}>
                {epsilon.slice(0, 50).map(([x, y], i) => {
                  const [ex, ey] = idx === 0 ? epsilon[i] : epsilonHat[i];
                  return (
                    <g key={i}>
                      <line x1={40 + x * 20} y1={30 + y * 20} x2={40} y2={30}
                        stroke={idx === 0 ? '#ef4444' : '#f59e0b'} strokeWidth={1} opacity={0.5} />
                      <circle cx={40 + ex * 20} cy={30 + ey * 20} r={1.5}
                        fill={idx === 0 ? '#ef4444' : '#f59e0b'} opacity={0.6} />
                    </g>
                  );
                })}
              </svg>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs space-y-2">
          <p><strong>🎓 关键公式：</strong></p>
          <p className="font-mono">z_t = √ᾱ_t · z_0 + √(1-ᾱ_t) · ε,  ε ~ N(0,I)</p>
          <p className="font-mono">ẑ_0 = (z_t - √(1-ᾱ_t) · ε̂) / √ᾱ_t</p>
          <p className="mt-2">
            <strong>重要理解：</strong>ε 在所有时间步都服从标准高斯分布 N(0,I)，因此损失目标的尺度统一。
            但 z_t 是由 z_0 和 ε 共同构造的——网络需要根据 z_t 和当前时间步 t 来估计其中隐藏的 ε。
            通过调节 "ε̂ 含噪声" 开关，可以看到当 ε̂ ≠ ε 时，反推出的 ẑ_0 会偏离原始数据。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
