import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import { makeBetaSchedule, alphaBar, generateGaussianNoise, forwardClosed, boxMuller } from '@/lib/math/diffusion';

function generatePointCloud(type: 'circle' | 'swiss' | 'moons', N: number, seed: number): [number, number][] {
  const rng = mulberry32(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    let x: number, y: number;
    const a = (i / N) * Math.PI * 2;
    switch (type) {
      case 'circle': x = Math.cos(a) * 1.2; y = Math.sin(a) * 1.2; break;
      case 'swiss': x = a / Math.PI - 1; y = Math.sin(a * 3) * 0.8 + (rng() - 0.5) * 0.3; break;
      case 'moons': {
        const h = i < N / 2 ? 0 : 1;
        const angle = (i % (N / 2)) / (N / 2) * Math.PI;
        x = Math.cos(angle) * 1.0 + h * 0.6 - 0.3;
        y = Math.sin(angle) * 1.0 - h * 0.3;
        break;
      }
      default: x = 0; y = 0;
    }
    pts.push([x + (rng() - 0.5) * 0.15, y + (rng() - 0.5) * 0.15]);
  }
  return pts;
}

const W = 420, H = 380, MG = { t: 15, r: 15, b: 40, l: 45 };
const PW = W - MG.l - MG.r, PH = H - MG.t - MG.b;
const toX = (v: number) => MG.l + ((v + 2.5) / 5) * PW;
const toY = (v: number) => MG.t + PH - ((v + 2.5) / 5) * PH;

export default function DiffusionTimelineLab() {
  const T_INTERNAL = 100;  // internal schedule
  const DISPLAY_STEPS = 10;
  const N = 100;

  const [displayT, setDisplayT] = useState(0); // 0..DISPLAY_STEPS-1
  const [cloudType, setCloudType] = useState<'circle' | 'swiss' | 'moons'>('circle');
  const [seed, setSeed] = useState(42);
  const [predictionError, setPredictionError] = useState(false);
  const [stochasticReverse, setStochasticReverse] = useState(false);

  const realT = Math.round((displayT / (DISPLAY_STEPS - 1)) * (T_INTERNAL - 1));
  const betas = useMemo(() => makeBetaSchedule(T_INTERNAL, 1e-4, 0.02), []);

  const z0 = useMemo(() => generatePointCloud(cloudType, N, seed), [cloudType, N, seed]);

  // Box-Muller Gaussian noise
  const epsilon = useMemo(() => generateGaussianNoise(N, 2, seed), [N, seed]);

  // Closed-form forward
  const zt = useMemo(() => {
    const ab = alphaBar(realT, betas);
    return forwardClosed(z0, epsilon, ab);
  }, [z0, epsilon, betas, realT]);

  // epsilon_hat = epsilon + (prediction error)
  const epsilonHat = useMemo(() => {
    const err = predictionError ? 0.3 : 0;
    const rng = mulberry32(seed + 999);
    return epsilon.map(([ex, ey]) => [ex + (rng() - 0.5) * err, ey + (rng() - 0.5) * err] as [number, number]);
  }, [epsilon, seed, predictionError]);

  // x0 prediction
  const x0Pred = useMemo(() => {
    const ab = alphaBar(realT, betas);
    const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
    const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
    return zt.map(([x, y], i) => [(x - sqrt1mAb * epsilonHat[i][0]) / sqrtAb, (y - sqrt1mAb * epsilonHat[i][1]) / sqrtAb] as [number, number]);
  }, [zt, epsilonHat, betas, realT]);

  const currentAb = alphaBar(realT, betas);

  return (
    <InteractiveDemo title="扩散模型时间线实验">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          内部 T={T_INTERNAL} 步调度，显示 {DISPLAY_STEPS} 个节点。ε 使用 Box-Muller 生成标准高斯 N(0,I)。
          z₀ 在 t=0 时等于原始数据；alphaBar(T)≈0，z_T 接近 N(0,I)。
        </p>

        <div className="flex flex-wrap gap-2">
          {(['circle', 'swiss', 'moons'] as const).map((t) => (
            <button key={t} onClick={() => setCloudType(t)} className={`px-3 py-1 text-xs rounded-lg ${cloudType === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {t === 'circle' ? '⭕ 圆' : t === 'swiss' ? '🥐 Swiss Roll' : '🌙 Moons'}
            </button>
          ))}
          <button onClick={() => setSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 ε 重采样</button>
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={predictionError} onChange={() => setPredictionError(!predictionError)} /> prediction error
          </label>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>时间步</span><span>t={realT} / {T_INTERNAL - 1} (显示 {displayT + 1}/{DISPLAY_STEPS})</span>
          </div>
          <Slider value={[displayT]} min={0} max={DISPLAY_STEPS - 1} step={1} onValueChange={(v) => setDisplayT(v[0])} />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>z₀</span><span>ᾱ_t = {currentAb.toFixed(4)}</span><span>z_T ≈ N(0,I)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: 'z₀（原始数据）', pts: z0, color: '#3b82f6' },
            { label: `z_t（t=${realT}）`, pts: zt, color: realT < T_INTERNAL / 3 ? '#3b82f6' : realT < 2 * T_INTERNAL / 3 ? '#f59e0b' : '#ef4444' },
            { label: 'x₀ prediction', pts: x0Pred, color: '#10b981' },
          ].map((view, vi) => (
            <div key={vi} className="bg-gray-50 rounded-lg border overflow-hidden">
              <div className="text-center text-[10px] font-medium text-gray-600 pt-1">{view.label}</div>
              <svg viewBox={`0 0 ${W / 2} ${H / 2}`} className="w-full" style={{ maxHeight: 180 }}>
                {view.pts.map(([x, y], i) => (
                  <circle key={i} cx={toX(x) / 2} cy={toY(y) / 2} r={1.5} fill={view.color} opacity={0.6} />
                ))}
                <rect x={MG.l / 2} y={MG.t / 2} width={PW / 2} height={PH / 2} fill="none" stroke="#d1d5db" strokeWidth={1} />
              </svg>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs space-y-2">
          <p><strong>🎓 关键公式：</strong></p>
          <p className="font-mono">z_t = √ᾱ_t · z_0 + √(1-ᾱ_t) · ε,  ε ~ N(0,I) (Box-Muller)</p>
          <p className="font-mono">x̂₀ = (z_t − √(1-ᾱ_t) · ε̂) / √ᾱ_t</p>
          <p className="mt-2">
            ε 在所有时间步都服从标准高斯 N(0,I)，因此损失目标的尺度统一。
            但 z_t 是由 z_0 和 ε 构造的——网络需要根据 z_t 和 t 来估计 ε。
            预测误差开关模拟 ε̂ ≠ ε 时的重建偏差。
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
