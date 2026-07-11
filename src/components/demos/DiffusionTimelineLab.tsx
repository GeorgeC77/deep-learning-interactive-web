import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import { makeBetaSchedule, alphaBar, generateGaussianNoise, forwardClosed, forwardIncremental } from '@/lib/math/diffusion';

/* -------------------------------------------------------------------------- */
/* reverseStep: z_{t-1} = mu_theta(z_t, t) + sigma_t * epsilon               */
/* mu_theta = (z_t - beta_t/sqrt(1-alphaBar_t) * epsilon_hat) / sqrt(1-beta_t) */
/* sigma_t = sqrt(beta_t * (1 - alphaBar_{t-1}) / (1 - alphaBar_t))           */
/* -------------------------------------------------------------------------- */
function reverseStep(
  zt: number[][], t: number, betas: number[], epsilonHat: number[][],
  stochastic: boolean, seed: number
): number[][] {
  const betaT = betas[t];
  const abT = alphaBar(t + 1, betas);
  const abTminus1 = alphaBar(t, betas);
  const sqrt1mAbT = Math.sqrt(Math.max(1 - abT, 1e-10));
  const sqrt1mBetaT = Math.sqrt(1 - betaT);
  const coef = betaT / sqrt1mAbT;
  const sigmaT = Math.sqrt(betaT * (1 - abTminus1) / Math.max(1 - abT, 1e-10));

  const rng = mulberry32(seed + t * 1000);
  return zt.map((row, i) => {
    const mu0 = (row[0] - coef * epsilonHat[i][0]) / sqrt1mBetaT;
    const mu1 = (row[1] - coef * epsilonHat[i][1]) / sqrt1mBetaT;
    const noise0 = stochastic ? sigmaT * boxMuller(rng) : 0;
    const noise1 = stochastic ? sigmaT * boxMuller(rng) : 0;
    return [mu0 + noise0, mu1 + noise1] as [number, number];
  });
}

/* -------------------------------------------------------------------------- */
/* Point cloud generators                                                     */
/* -------------------------------------------------------------------------- */
function generatePointCloud(type: 'circle' | 'swiss' | 'moons', N: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  return Array.from({ length: N }, (_, i) => {
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
    return [x + (rng() - 0.5) * 0.15, y + (rng() - 0.5) * 0.15] as [number, number];
  });
}

const W = 420, H = 380, MG = { t: 15, r: 15, b: 40, l: 45 };
const PW = W - MG.l - MG.r, PH = H - MG.t - MG.b;
const toX = (v: number) => MG.l + ((v + 2.5) / 5) * PW;
const toY = (v: number) => MG.t + PH - ((v + 2.5) / 5) * PH;

type Mode = 'closed-forward' | 'incremental-forward' | 'reverse';

export default function DiffusionTimelineLab() {
  const T = 1000;
  const DISPLAY_STEPS = 10;
  const N = 100;

  const [mode, setMode] = useState<Mode>('closed-forward');
  const [displayT, setDisplayT] = useState(0);
  const [cloudType, setCloudType] = useState<'circle' | 'swiss' | 'moons'>('circle');
  const [seed, setSeed] = useState(42);
  const [predictionError, setPredictionError] = useState(false);
  const [stochasticReverse, setStochasticReverse] = useState(true);

  const realT = Math.round((displayT / (DISPLAY_STEPS - 1)) * (T - 1));
  const betas = useMemo(() => makeBetaSchedule(T, 1e-4, 0.02), []);
  const abT = useMemo(() => alphaBar(T, betas), [betas]);

  const z0 = useMemo(() => generatePointCloud(cloudType, N, seed), [cloudType, N, seed]);
  const epsilon = useMemo(() => generateGaussianNoise(N, 2, seed), [N, seed]);

  // epsilon_hat
  const epsilonHat = useMemo(() => {
    const err = predictionError ? 0.3 : 0;
    const rng = mulberry32(seed + 999);
    return epsilon.map(([ex, ey]) => [ex + (rng() - 0.5) * err, ey + (rng() - 0.5) * err] as [number, number]);
  }, [epsilon, seed, predictionError]);

  // Closed-form forward
  const ztClosed = useMemo(() => forwardClosed(z0, epsilon, alphaBar(realT + 1, betas)), [z0, epsilon, betas, realT]);

  // Incremental forward
  const ztIncremental = useMemo(() => {
    let z: number[][] = z0.map(([x, y]) => [x, y]);
    for (let t = 0; t <= realT; t++) {
      const epsT = generateGaussianNoise(N, 2, seed + t * 200);
      z = forwardIncremental(z, epsT, betas[t]);
    }
    return z;
  }, [z0, betas, realT, seed]);

  // Reverse sampling
  const reversePath = useMemo(() => {
    const steps = DISPLAY_STEPS;
    const interval = Math.max(1, Math.floor((T - 1) / (steps - 1)));
    const path: number[][][] = [];
    let z: number[][] = ztClosed.map(([x, y]) => [x, y]);
    for (let s = 0; s < steps; s++) {
      const tReal = Math.max(0, (T - 1) - s * interval);
      if (tReal <= 0) { path.push(z0); break; }
      const tIndex = tReal - 1; // betas[tIndex] corresponds to transition tIndex→tIndex+1
      if (tIndex < 0) { path.push(z0); break; }
      path.push(z.map(row => [...row]));
      z = reverseStep(z, tIndex, betas, epsilonHat, stochasticReverse, seed);
    }
    // Last step: no noise (t=0)
    path.push(z0);
    return path;
  }, [ztClosed, betas, T, DISPLAY_STEPS, epsilonHat, stochasticReverse, seed, z0]);

  // x0 prediction (clean-sample estimate)
  const x0Pred = useMemo(() => {
    const ab = alphaBar(realT + 1, betas);
    const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
    const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
    return ztClosed.map(([x, y], i) => [(x - sqrt1mAb * epsilonHat[i][0]) / sqrtAb, (y - sqrt1mAb * epsilonHat[i][1]) / sqrtAb] as [number, number]);
  }, [ztClosed, epsilonHat, betas, realT]);

  const currentAb = alphaBar(realT + 1, betas);

  const displayPts = mode === 'closed-forward' ? ztClosed : mode === 'incremental-forward' ? ztIncremental : (reversePath[displayT] ?? z0);

  return (
    <InteractiveDemo title="扩散模型时间线实验：forward + reverse">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          T={T} 步线性 beta 调度。ᾱ(T) = {abT.toFixed(6)} {abT < 0.01 ? '✅ < 0.01' : '⚠️ >= 0.01'}。
          ε 使用 Box-Muller 生成标准高斯 N(0,I)。
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

        {/* Mode selector */}
        <div className="flex gap-1">
          {(['closed-forward', 'incremental-forward', 'reverse'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setDisplayT(0); }}
              className={`px-3 py-1 text-xs rounded-lg ${mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {m === 'closed-forward' ? '闭式前向' : m === 'incremental-forward' ? '增量前向' : '反向采样'}
            </button>
          ))}
          {mode === 'reverse' && (
            <label className="flex items-center gap-1 text-xs text-gray-600 ml-2">
              <input type="checkbox" checked={stochasticReverse} onChange={() => setStochasticReverse(!stochasticReverse)} /> 随机（关闭则确定性反向）
            </label>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>时间步</span><span>t={realT} / {T - 1} (显示 {displayT + 1}/{DISPLAY_STEPS})</span>
          </div>
          <Slider value={[displayT]} min={0} max={DISPLAY_STEPS - 1} step={1} onValueChange={(v) => setDisplayT(v[0])} />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>z₀</span><span>ᾱ_t = {currentAb.toFixed(4)}</span>
            <span>ᾱ_T = {abT.toFixed(6)}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: 'z₀（原始数据）', pts: z0, color: '#3b82f6' },
            { label: mode === 'reverse' ? `z_t reverse (step ${displayT})` : `z_t（t=${realT}）`, pts: displayPts, color: '#f59e0b' },
            { label: '基于 ε̂ 的 clean-sample estimate', pts: x0Pred, color: '#10b981' },
          ].map((view, vi) => (
            <div key={vi} className="bg-gray-50 rounded-lg border overflow-hidden">
              <div className="text-center text-[9px] font-medium text-gray-600 pt-1">{view.label}</div>
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
          <p className="font-mono">z_t = √ᾱ_t · z_0 + √(1-ᾱ_t) · ε,  ε ~ N(0,I)</p>
          <p className="font-mono">x̂₀ = (z_t − √(1-ᾱ_t) · ε̂) / √ᾱ_t （基于 epsilon_hat 的 clean-sample estimate，不是完整反向扩散）</p>
          <p className="font-mono">z_{'{t-1}'} = (z_t − β_t/√(1-ᾱ_t)·ε̂) / √(1-β_t) + σ_t·ε', reverseStep(t, stochastic={stochasticReverse ? 'true' : 'false'})</p>
          <p className="text-gray-500 mt-1">alphaBar(0)={alphaBar(0, betas).toFixed(1)}, alphaBar(T)={abT.toFixed(6)}. 最终一步(t=0)不加噪声。</p>
        </div>
      </div>
    </InteractiveDemo>
  );
}

function mulberry32(a: number) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function boxMuller(rng: () => number): number { const u1 = Math.max(rng(), 1e-12), u2 = rng(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }
