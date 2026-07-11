import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import InteractiveDemo from '@/components/InteractiveDemo';
import {
  makeBetaSchedule,
  alphaBar,
  generateGaussianNoise,
  forwardClosed,
  forwardIncremental,
  reverseChain,
  mulberry32,
} from '@/lib/math/diffusion';

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
type ReverseDenoiser = 'oracle' | 'generation';

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
  const [reverseDenoiser, setReverseDenoiser] = useState<ReverseDenoiser>('oracle');

  // Slider step 0..DISPLAY_STEPS-1 maps to progress 0..T.
  // In forward modes this progress is the diffusion time t; in reverse mode it is the reverse progress s.
  const progress = Math.round((displayT / (DISPLAY_STEPS - 1)) * T);
  const realT = mode === 'reverse' ? T - progress : progress;
  const reverseS = mode === 'reverse' ? progress : T - realT;
  const betas = useMemo(() => makeBetaSchedule(T, 1e-4, 0.02), []);
  const abT = useMemo(() => alphaBar(T, betas), [betas]);

  const z0 = useMemo(() => generatePointCloud(cloudType, N, seed), [cloudType, N, seed]);
  const epsilon = useMemo(() => generateGaussianNoise(N, 2, seed), [N, seed]);

  // epsilon_hat: optional prediction error added to the true noise (used in forward modes).
  const epsilonHat = useMemo(() => {
    const err = predictionError ? 0.3 : 0;
    const rng = mulberry32(seed + 999);
    return epsilon.map(([ex, ey]) => [ex + (rng() - 0.5) * err, ey + (rng() - 0.5) * err] as [number, number]);
  }, [epsilon, seed, predictionError]);

  // Closed-form forward: alphaBar(0) = 1 ⇒ displayT=0 gives exactly z0.
  const ztClosed = useMemo(() => forwardClosed(z0, epsilon, alphaBar(realT, betas)), [z0, epsilon, betas, realT]);

  // Incremental forward: execute exactly realT transitions; realT=0 ⇒ z0.
  const ztIncremental = useMemo(() => {
    let z: number[][] = z0.map(([x, y]) => [x, y]);
    for (let t = 0; t < realT; t++) {
      const epsT = generateGaussianNoise(N, 2, seed + t * 200);
      z = forwardIncremental(z, epsT, betas[t]);
    }
    return z;
  }, [z0, betas, realT, seed]);

  // Reverse chain: path[0] = z_T, path[T] = z_0.
  const reversePath = useMemo(() => {
    if (reverseDenoiser === 'oracle') {
      const zT = forwardClosed(z0, epsilon, alphaBar(T, betas));
      const oraclePredictNoise = (z: number[][], t: number) => {
        const ab = alphaBar(t, betas);
        const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
        const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
        if (sqrt1mAb < 1e-10) {
          return z.map((row) => row.map(() => 0));
        }
        return z.map((row, i) =>
          row.map((v, j) => (v - sqrtAb * z0[i][j]) / sqrt1mAb),
        );
      };
      return reverseChain(zT, T, betas, oraclePredictNoise, stochasticReverse);
    }

    // Generation mode: start from fresh noise and use a toy denoiser that does NOT see z0.
    const zTGen = generateGaussianNoise(N, 2, seed + 999999);
    const toyPredictNoise = (z: number[][]) => {
      // Toy hand-written denoiser: a small bias toward the origin.
      // This is intentionally imperfect (it is not an oracle) and only demonstrates
      // that a non-oracle reverse trajectory can run without accessing z0.
      return z.map((row) => row.map((v) => -0.1 * v));
    };
    return reverseChain(zTGen, T, betas, toyPredictNoise, stochasticReverse);
  }, [reverseDenoiser, z0, epsilon, betas, T, N, seed, stochasticReverse]);

  // Reverse time-axis mapping: reverseIndex equals reverse progress s and points into reversePath.
  const reverseIndex = reverseS;
  const displayPts = mode === 'closed-forward'
    ? ztClosed
    : mode === 'incremental-forward'
      ? ztIncremental
      : (reversePath[reverseIndex] ?? z0);

  // x0 prediction (clean-sample estimate) at time realT.
  const x0Pred = useMemo(() => {
    if (mode !== 'reverse') {
      const ab = alphaBar(realT, betas);
      const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
      const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
      return ztClosed.map(([x, y], i) => [(x - sqrt1mAb * epsilonHat[i][0]) / sqrtAb, (y - sqrt1mAb * epsilonHat[i][1]) / sqrtAb] as [number, number]);
    }

    // In reverse mode, base the estimate on the currently displayed reverse state.
    if (reverseDenoiser === 'oracle') {
      const ab = alphaBar(realT, betas);
      const sqrtAb = Math.sqrt(Math.max(ab, 1e-10));
      const sqrt1mAb = Math.sqrt(Math.max(1 - ab, 1e-10));
      if (sqrt1mAb < 1e-10 || sqrtAb < 1e-10) {
        return displayPts.map(([x, y]) => [x, y] as [number, number]);
      }
      return displayPts.map(([x, y], i) => {
        const ex = (x - sqrtAb * z0[i][0]) / sqrt1mAb;
        const ey = (y - sqrtAb * z0[i][1]) / sqrt1mAb;
        return [(x - sqrt1mAb * ex) / sqrtAb, (y - sqrt1mAb * ey) / sqrtAb] as [number, number];
      });
    }

    // Generation mode cannot compute a meaningful x0 estimate without z0.
    return null;
  }, [mode, reverseDenoiser, ztClosed, epsilonHat, betas, realT, displayPts, z0]);

  const currentAb = alphaBar(realT, betas);

  const views: { label: string; pts: number[][]; color: string }[] = [
    { label: 'z₀（原始数据）', pts: z0, color: '#3b82f6' },
    {
      label: mode === 'reverse'
        ? `z_t reverse (s=${reverseS}, t=${realT})`
        : `z_t（t=${realT}）`,
      pts: displayPts,
      color: '#f59e0b',
    },
  ];
  if (x0Pred) {
    views.push({
      label: mode === 'reverse'
        ? '基于当前 z_t 的 clean-sample estimate（oracle）'
        : '基于 ε̂ 的 clean-sample estimate',
      pts: x0Pred,
      color: '#10b981',
    });
  }

  return (
    <InteractiveDemo title="扩散模型时间线实验：forward + reverse">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          T={T} 步线性 beta 调度。ᾱ(T) = {abT.toFixed(6)} {abT < 0.01 ? '✅ < 0.01' : '⚠️ >= 0.01'}。
          ε 使用 Box-Muller 生成标准高斯 N(0,I)。ᾱ(0)=1，因此 t=0 时 z_t 严格等于 z₀。
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
        <div className="flex flex-wrap gap-1 items-center">
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

        {/* Reverse denoiser selector */}
        {mode === 'reverse' && (
          <div className="flex flex-wrap gap-2 items-start">
            <div className="flex gap-1">
              {(['oracle', 'generation'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setReverseDenoiser(d)}
                  className={`px-3 py-1 text-xs rounded-lg ${reverseDenoiser === d ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {d === 'oracle' ? 'Oracle 反演（已知 z₀）' : '生成式采样（toy denoiser）'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 max-w-md">
              {reverseDenoiser === 'oracle'
                ? '教学用 oracle：可访问真实 z₀，仅用于演示反向公式，不是生成模型。'
                : 'Toy denoiser：使用手写的小偏向原点偏置，不访问 z₀，结果不完美，仅演示无 oracle 的反向链。'}
            </p>
          </div>
        )}

        <div>
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>{mode === 'reverse' ? '反向进度 s' : '扩散时间 t'}</span>
            <span>
              {mode === 'reverse'
                ? `s=${reverseS} / ${T}, t=${realT}`
                : `t=${realT} / ${T}`} (显示 {displayT + 1}/{DISPLAY_STEPS})
            </span>
          </div>
          <Slider value={[displayT]} min={0} max={DISPLAY_STEPS - 1} step={1} onValueChange={(v) => setDisplayT(v[0])} />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>z₀</span><span>ᾱ_t = {currentAb.toFixed(4)}</span>
            <span>ᾱ_T = {abT.toFixed(6)}</span>
          </div>
        </div>

        <div className={`grid gap-3 ${x0Pred ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {views.map((view, vi) => (
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
          <p className="font-mono">x̂₀ = (z_t − √(1-ᾱ_t) · ε̂) / √ᾱ_t</p>
          <p className="font-mono">z_{'{t-1}'} = (z_t − β_t/√(1-ᾱ_t)·ε̂) / √(1-β_t) + σ_t·ε'</p>
          <p className="text-gray-500 mt-1">
            alphaBar(0)={alphaBar(0, betas).toFixed(1)}, alphaBar(T)={abT.toFixed(6)}。
            反向链 path[0]=z_T、path[T]=z₀；反向模式下滑块从左到右表示反向进度 s=0→T（扩散时间 t=T→0）。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
