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
  fitGaussianMixture2D,
  gaussianMixtureScore,
  gaussianMixtureDensity,
  epsilonFromScore,
  clampPointCloud,
  sampleMeanVector,
  sampleCovarianceMatrix,
  frobeniusDiff,
  mmdSquaredGaussian,
  wasserstein2GaussianApprox,
  makeSharedHistogram,
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

const VIEW_MIN = -2.5, VIEW_RANGE = 5;

type Mode = 'closed-forward' | 'incremental-forward' | 'reverse' | 'forward-compare' | 'conditional-compare';
type ReverseDenoiser = 'oracle' | 'generation';

export default function DiffusionTimelineLab() {
  const T = 1000;
  const DISPLAY_STEPS = 10;
  const N = 100;
  const GMM_K = 5;
  const COMPARE_SAMPLES = 120;
  const CONDITIONAL_SAMPLES = 1000;

  const [mode, setMode] = useState<Mode>('closed-forward');
  const [displayT, setDisplayT] = useState(0);
  const [cloudType, setCloudType] = useState<'circle' | 'swiss' | 'moons'>('circle');
  const [dataSeed, setDataSeed] = useState(42);
  const [forwardNoiseSeed, setForwardNoiseSeed] = useState(42);
  const [reverseNoiseSeed, setReverseNoiseSeed] = useState(42);
  const [compareSeed, setCompareSeed] = useState(1234);
  const [predictionError, setPredictionError] = useState(false);
  const [stochasticReverse, setStochasticReverse] = useState(true);
  const [reverseDenoiser, setReverseDenoiser] = useState<ReverseDenoiser>('oracle');
  const [fixedZ0Index, setFixedZ0Index] = useState(0);

  // Slider step 0..DISPLAY_STEPS-1 maps to progress 0..T.
  // In forward modes this progress is the diffusion time t; in reverse mode it is the reverse progress s.
  const progress = Math.round((displayT / (DISPLAY_STEPS - 1)) * T);
  const realT = mode === 'reverse' ? T - progress : progress;
  const reverseS = mode === 'reverse' ? progress : T - realT;
  const betas = useMemo(() => makeBetaSchedule(T, 1e-4, 0.02), []);
  const abT = useMemo(() => alphaBar(T, betas), [betas]);

  const z0 = useMemo(() => generatePointCloud(cloudType, N, dataSeed), [cloudType, N, dataSeed]);
  const epsilon = useMemo(() => generateGaussianNoise(N, 2, forwardNoiseSeed), [N, forwardNoiseSeed]);
  const gmm = useMemo(() => fitGaussianMixture2D(z0, GMM_K), [z0]);

  // epsilon_hat: optional prediction error added to the true noise (used in forward modes).
  const epsilonHat = useMemo(() => {
    const err = predictionError ? 0.3 : 0;
    const rng = mulberry32(forwardNoiseSeed + 999);
    return epsilon.map(([ex, ey]) => [ex + (rng() - 0.5) * err, ey + (rng() - 0.5) * err] as [number, number]);
  }, [epsilon, forwardNoiseSeed, predictionError]);

  // Closed-form forward: alphaBar(0) = 1 ⇒ displayT=0 gives exactly z0.
  const ztClosed = useMemo(() => forwardClosed(z0, epsilon, alphaBar(realT, betas)), [z0, epsilon, betas, realT]);

  // Incremental forward: execute exactly realT transitions; realT=0 ⇒ z0.
  const ztIncremental = useMemo(() => {
    let z: number[][] = z0.map(([x, y]) => [x, y]);
    for (let t = 0; t < realT; t++) {
      const epsT = generateGaussianNoise(N, 2, forwardNoiseSeed + t * 200);
      z = forwardIncremental(z, epsT, betas[t]);
    }
    return z;
  }, [z0, betas, realT, forwardNoiseSeed]);

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
      return reverseChain(zT, T, betas, oraclePredictNoise, stochasticReverse, reverseNoiseSeed);
    }

    // Generation mode: start from fresh noise and use the analytic score of the fitted GMM.
    const zTGen = generateGaussianNoise(N, 2, reverseNoiseSeed + 999999);
    const gmmPredictNoise = (z: number[][], t: number) => {
      const ab = alphaBar(t, betas);
      return z.map((row) => epsilonFromScore(gaussianMixtureScore(row, t, betas, gmm), ab));
    };
    const rawPath = reverseChain(zTGen, T, betas, gmmPredictNoise, stochasticReverse, reverseNoiseSeed);
    return rawPath.map((step) => clampPointCloud(step, 25));
  }, [reverseDenoiser, z0, epsilon, betas, T, N, reverseNoiseSeed, stochasticReverse, gmm]);

  // Reverse time-axis mapping: reverseIndex equals reverse progress s and points into reversePath.
  const reverseIndex = reverseS;
  const displayPtsRaw = mode === 'closed-forward'
    ? ztClosed
    : mode === 'incremental-forward'
      ? ztIncremental
      : mode === 'reverse'
        ? (reversePath[reverseIndex] ?? z0)
        : [];
  const displayPts = clampPointCloud(displayPtsRaw, 25);

  // x0 prediction (clean-sample estimate) at time realT.
  const x0Pred = useMemo(() => {
    if (mode === 'forward-compare' || mode === 'conditional-compare') return null;
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

  /* -------------------------------------------------------------------------- */
  /* Conditional distribution consistency experiment (single fixed z0)          */
  /* -------------------------------------------------------------------------- */
  const conditionalCompare = useMemo(() => {
    if (mode !== 'conditional-compare') return null;
    const fixedZ0 = z0[Math.min(Math.max(0, fixedZ0Index), z0.length - 1)];
    const ab = alphaBar(realT, betas);
    const sqrtAb = Math.sqrt(Math.max(ab, 0));
    const theoreticalMean = [sqrtAb * fixedZ0[0], sqrtAb * fixedZ0[1]];
    const theoreticalCov = [[1 - ab, 0], [0, 1 - ab]];

    // Closed-form: sample epsilon 1000 times for the same z0.
    const closed: number[][] = [];
    for (let s = 0; s < CONDITIONAL_SAMPLES; s++) {
      const eps = generateGaussianNoise(1, 2, compareSeed + s * 3 + 1);
      closed.push(forwardClosed([fixedZ0], eps, ab)[0]);
    }

    // Incremental: run 1000 independent chains from the same z0.
    const incremental: number[][] = [];
    for (let s = 0; s < CONDITIONAL_SAMPLES; s++) {
      let z: number[] = [...fixedZ0];
      for (let t = 0; t < realT; t++) {
        const epsT = generateGaussianNoise(1, 2, compareSeed + s * 7 + t + 10000);
        z = forwardIncremental([z], epsT, betas[t])[0];
      }
      incremental.push(z);
    }

    const empiricalMeanClosed = sampleMeanVector(closed);
    const empiricalMeanInc = sampleMeanVector(incremental);
    const meanErrClosed = Math.sqrt(empiricalMeanClosed.map((v, i) => (v - theoreticalMean[i]) ** 2).reduce((a, b) => a + b, 0));
    const meanErrInc = Math.sqrt(empiricalMeanInc.map((v, i) => (v - theoreticalMean[i]) ** 2).reduce((a, b) => a + b, 0));

    const empiricalCovClosed = sampleCovarianceMatrix(closed);
    const empiricalCovInc = sampleCovarianceMatrix(incremental);
    const covErrClosed = frobeniusDiff(empiricalCovClosed, theoreticalCov);
    const covErrInc = frobeniusDiff(empiricalCovInc, theoreticalCov);

    const xShared = makeSharedHistogram(closed.map((p) => p[0]), incremental.map((p) => p[0]), 24);
    const yShared = makeSharedHistogram(closed.map((p) => p[1]), incremental.map((p) => p[1]), 24);

    return {
      fixedZ0,
      theoreticalMean,
      theoreticalCov,
      empiricalMeanClosed,
      empiricalMeanInc,
      meanErrClosed,
      meanErrInc,
      empiricalCovClosed,
      empiricalCovInc,
      covErrClosed,
      covErrInc,
      closed,
      incremental,
      xShared,
      yShared,
    };
  }, [mode, z0, fixedZ0Index, realT, betas, compareSeed]);

  /* -------------------------------------------------------------------------- */
  /* Overall marginal distribution comparison (multiple different z0)           */
  /* -------------------------------------------------------------------------- */
  const compare = useMemo(() => {
    if (mode !== 'forward-compare') return null;
    const compareZ0 = generatePointCloud(cloudType, COMPARE_SAMPLES, compareSeed);
    const epsClosed = generateGaussianNoise(COMPARE_SAMPLES, 2, compareSeed + 1);
    const ab = alphaBar(realT, betas);
    const closed = forwardClosed(compareZ0, epsClosed, ab);

    let incremental: number[][] = compareZ0.map(([x, y]) => [x, y]);
    for (let t = 0; t < realT; t++) {
      const epsT = generateGaussianNoise(COMPARE_SAMPLES, 2, compareSeed + 10 + t);
      incremental = forwardIncremental(incremental, epsT, betas[t]);
    }

    const meanClosed = sampleMeanVector(closed);
    const meanInc = sampleMeanVector(incremental);
    const meanDiff = Math.sqrt(meanClosed.map((v, i) => (v - meanInc[i]) ** 2).reduce((a, b) => a + b, 0));
    const covClosed = sampleCovarianceMatrix(closed);
    const covInc = sampleCovarianceMatrix(incremental);
    const covDiff = frobeniusDiff(covClosed, covInc);
    const mmd = Math.sqrt(Math.max(0, mmdSquaredGaussian(closed, incremental)));
    const w2 = Math.sqrt(Math.max(0, wasserstein2GaussianApprox(closed, incremental)));

    const xShared = makeSharedHistogram(closed.map((p) => p[0]), incremental.map((p) => p[0]), 16);
    const yShared = makeSharedHistogram(closed.map((p) => p[1]), incremental.map((p) => p[1]), 16);

    return {
      closed,
      incremental,
      meanDiff,
      covDiff,
      mmd,
      w2,
      xShared,
      yShared,
    };
  }, [mode, cloudType, compareSeed, realT, betas]);

  /* -------------------------------------------------------------------------- */
  /* Score / density grid for generation reverse mode                           */
  /* -------------------------------------------------------------------------- */
  const scoreGrid = useMemo(() => {
    if (mode !== 'reverse' || reverseDenoiser !== 'generation') return null;
    const cols = 18;
    const rows = 16;
    const cells: { x: number; y: number; density: number; score: number[] }[] = [];
    let maxDensity = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = VIEW_MIN + (c + 0.5) * (VIEW_RANGE / cols);
        const y = VIEW_MIN + (r + 0.5) * (VIEW_RANGE / rows);
        const density = gaussianMixtureDensity([x, y], realT, betas, gmm);
        const score = gaussianMixtureScore([x, y], realT, betas, gmm);
        if (Number.isFinite(density)) maxDensity = Math.max(maxDensity, density);
        cells.push({ x, y, density: Number.isFinite(density) ? density : 0, score });
      }
    }
    return { cells, maxDensity };
  }, [mode, reverseDenoiser, realT, betas, gmm]);

  /* -------------------------------------------------------------------------- */
  /* Render helpers                                                             */
  /* -------------------------------------------------------------------------- */
  const renderArrow = (x0: number, y0: number, x1: number, y1: number, color: string, key: string, width = 1.5) => {
    const sx = toX(x0) / 2;
    const sy = toY(y0) / 2;
    const ex = toX(x1) / 2;
    const ey = toY(y1) / 2;
    return (
      <g key={key}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} markerEnd={`url(#arrow-${color.replace('#', '')})`} />
      </g>
    );
  };

  const maxAbs = (v: number) => Math.max(Math.abs(v), 1e-6);

  const views: { label: string; pts: number[][]; color: string }[] = [
    { label: 'z₀（原始数据）', pts: z0, color: '#3b82f6' },
    {
      label: mode === 'reverse'
        ? `z_t reverse (s=${reverseS}, t=${realT})`
        : mode === 'forward-compare'
          ? '总体边缘分布比较'
          : mode === 'conditional-compare'
            ? '条件分布比较'
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

  const highlightedIndex = 0;

  const renderSharedHistogram = (
    title: string,
    shared: { sharedEdges: number[]; countsA: number[]; countsB: number[] },
  ) => {
    const maxCount = Math.max(...shared.countsA, ...shared.countsB, 1);
    const bins = shared.countsA.length;
    const binW = PW / 2 / bins;
    const chartH = H / 4;
    return (
      <div className="bg-white rounded border p-2">
        <div className="text-[10px] text-gray-500 mb-1">{title}</div>
        <svg viewBox={`0 0 ${W / 2} ${chartH}`} className="w-full" style={{ maxHeight: 120 }}>
          {shared.countsA.map((c, i) => (
            <rect key={`c-${i}`} x={i * binW} y={chartH * (1 - c / maxCount)} width={binW * 0.45} height={chartH * (c / maxCount)} fill="#3b82f6" opacity={0.7} />
          ))}
          {shared.countsB.map((c, i) => (
            <rect key={`i-${i}`} x={i * binW + binW * 0.45} y={chartH * (1 - c / maxCount)} width={binW * 0.45} height={chartH * (c / maxCount)} fill="#f59e0b" opacity={0.7} />
          ))}
        </svg>
        <div className="flex justify-between text-[9px] text-gray-500 mt-0.5">
          <span>{shared.sharedEdges[0].toFixed(2)}</span>
          <span>{shared.sharedEdges[shared.sharedEdges.length - 1].toFixed(2)}</span>
        </div>
      </div>
    );
  };

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
          <button onClick={() => setDataSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 重新生成数据</button>
          <button onClick={() => setForwardNoiseSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 重采样前向 ε</button>
          <button onClick={() => setReverseNoiseSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 重采样反向随机项</button>
          {(mode === 'forward-compare' || mode === 'conditional-compare') && (
            <button onClick={() => setCompareSeed(Math.floor(Math.random() * 10000))} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">🔄 重采样统计实验</button>
          )}
          <label className="flex items-center gap-1 text-xs text-gray-600">
            <input type="checkbox" checked={predictionError} onChange={() => setPredictionError(!predictionError)} /> prediction error
          </label>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap gap-1 items-center">
          {(['closed-forward', 'incremental-forward', 'reverse', 'forward-compare', 'conditional-compare'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setDisplayT(0); }}
              className={`px-3 py-1 text-xs rounded-lg ${mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              {m === 'closed-forward' ? '闭式前向'
                : m === 'incremental-forward' ? '增量前向'
                  : m === 'reverse' ? '反向采样'
                    : m === 'forward-compare' ? '总体边缘分布比较'
                      : '条件分布一致性'}
            </button>
          ))}
          {mode === 'reverse' && (
            <label className="flex items-center gap-1 text-xs text-gray-600 ml-2">
              <input type="checkbox" checked={stochasticReverse} onChange={() => setStochasticReverse(!stochasticReverse)} /> 反向随机项：开/关
            </label>
          )}
        </div>
        {mode === 'reverse' && !stochasticReverse && (
          <p className="text-[10px] text-amber-600">
            仅显示 mean-only reverse trajectory，不等同于 DDIM。
          </p>
        )}

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
                  {d === 'oracle' ? 'Oracle 反演（已知 z₀）' : '生成式采样（GMM 解析 score）'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 max-w-md">
              {reverseDenoiser === 'oracle'
                ? '教学用 oracle：可访问真实 z₀，仅用于演示反向公式，不是生成模型。'
                : 'GMM 解析 score：从点云拟合高斯混合，计算 score_t(z)=∇log p_t(z)，再转 ε̂=-√(1-ᾱ_t)·score。不访问 z₀。'}
            </p>
          </div>
        )}

        {mode === 'conditional-compare' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>固定 z₀ 索引</span>
              <span>{fixedZ0Index} / {N - 1}</span>
            </div>
            <Slider value={[fixedZ0Index]} min={0} max={N - 1} step={1} onValueChange={(v) => setFixedZ0Index(v[0])} />
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

        {mode === 'conditional-compare' && conditionalCompare && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-3">
            <p><strong>🎓 条件分布一致性实验：</strong>固定单个 z₀，比较闭式与增量前向得到的 q(z_t | z₀)。same distribution, not same realization。</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">mean err 闭式</div><div>{conditionalCompare.meanErrClosed.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">mean err 增量</div><div>{conditionalCompare.meanErrInc.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">cov err 闭式</div><div>{conditionalCompare.covErrClosed.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">cov err 增量</div><div>{conditionalCompare.covErrInc.toFixed(4)}</div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-gray-600">
              <div className="bg-white rounded p-2">
                <div className="font-medium mb-1">理论 mean</div>
                <div>[{conditionalCompare.theoreticalMean.map((v) => v.toFixed(4)).join(', ')}]</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="font-medium mb-1">理论 cov</div>
                <div>[[{conditionalCompare.theoreticalCov[0].map((v) => v.toFixed(4)).join(', ')}], [{conditionalCompare.theoreticalCov[1].map((v) => v.toFixed(4)).join(', ')}]]</div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: `闭式前向 t=${realT}`, pts: conditionalCompare.closed, color: '#3b82f6' },
                { label: `增量前向 t=${realT}`, pts: conditionalCompare.incremental, color: '#f59e0b' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderSharedHistogram('x 边缘分布', conditionalCompare.xShared)}
              {renderSharedHistogram('y 边缘分布', conditionalCompare.yShared)}
            </div>
          </div>
        )}

        {mode === 'forward-compare' && compare && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-3">
            <p><strong>🎓 总体边缘分布比较：</strong>same distribution, not the same realization。</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">mean diff (L2)</div><div>{compare.meanDiff.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">cov diff (Frob)</div><div>{compare.covDiff.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">MMD</div><div>{compare.mmd.toFixed(4)}</div></div>
              <div className="bg-white rounded p-2"><div className="text-[10px] text-gray-500">W₂ (高斯近似)</div><div>{compare.w2.toFixed(4)}</div></div>
            </div>
            <div className={`grid gap-3 ${compare ? 'md:grid-cols-2' : ''}`}>
              {[
                { label: `闭式前向 t=${realT}`, pts: compare.closed, color: '#3b82f6' },
                { label: `增量前向 t=${realT}`, pts: compare.incremental, color: '#f59e0b' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderSharedHistogram('x 边缘分布', compare.xShared)}
              {renderSharedHistogram('y 边缘分布', compare.yShared)}
            </div>
          </div>
        )}

        {mode !== 'forward-compare' && mode !== 'conditional-compare' && (
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
        )}

        {/* Generation-mode score visualization */}
        {mode === 'reverse' && reverseDenoiser === 'generation' && scoreGrid && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs space-y-2">
            <p><strong>🎓 解析 score 可视化：</strong>heatmap = p_t(z)；绿箭头 = score_t(z)；紫箭头 = ε̂；红箭头 = 当前 reverse 均值转移。</p>
            <svg viewBox={`0 0 ${W / 2} ${H / 2}`} className="w-full" style={{ maxHeight: 180 }}>
              <defs>
                <marker id="arrow-000000" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L1.5,3 z" fill="#000000" />
                </marker>
                <marker id="arrow-10b981" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L1.5,3 z" fill="#10b981" />
                </marker>
                <marker id="arrow-8b5cf6" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L1.5,3 z" fill="#8b5cf6" />
                </marker>
                <marker id="arrow-ef4444" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 L1.5,3 z" fill="#ef4444" />
                </marker>
              </defs>
              {/* Heatmap cells */}
              {scoreGrid.cells.map((cell, i) => {
                const cols = 18;
                const cellW = (PW / 2) / cols;
                const rows = 16;
                const cellH = (PH / 2) / rows;
                const cx = toX(cell.x) / 2 - cellW / 2;
                const cy = toY(cell.y) / 2 - cellH / 2;
                const intensity = scoreGrid.maxDensity > 0 ? cell.density / scoreGrid.maxDensity : 0;
                const opacity = Math.min(0.7, intensity * 3);
                return <rect key={`h-${i}`} x={cx} y={cy} width={cellW} height={cellH} fill="#f59e0b" opacity={opacity} />;
              })}
              <rect x={MG.l / 2} y={MG.t / 2} width={PW / 2} height={PH / 2} fill="none" stroke="#d1d5db" strokeWidth={1} />
              {/* Score field (subsample) */}
              {scoreGrid.cells.filter((_, i) => i % 4 === 0).map((cell, i) => {
                const scale = 0.15;
                return renderArrow(cell.x, cell.y, cell.x + cell.score[0] * scale, cell.y + cell.score[1] * scale, '#10b981', `score-${i}`, 1);
              })}
              {/* Epsilon-hat arrows on point cloud */}
              {displayPts.map((pt, i) => {
                if (i % 4 !== 0) return null;
                const ab = currentAb;
                const score = gaussianMixtureScore(pt, realT, betas, gmm);
                const eps = epsilonFromScore(score, ab);
                const scale = 0.3 / maxAbs(Math.max(Math.abs(eps[0]), Math.abs(eps[1]), 0.1));
                return renderArrow(pt[0], pt[1], pt[0] + eps[0] * scale, pt[1] + eps[1] * scale, '#8b5cf6', `eps-${i}`, 1);
              })}
              {/* Current reverse transition for highlighted point */}
              {(() => {
                const pt = displayPts[highlightedIndex];
                const next = reversePath[reverseIndex + 1]?.[highlightedIndex];
                if (!pt || !next) return null;
                return renderArrow(pt[0], pt[1], next[0], next[1], '#ef4444', 'reverse-trans', 1.5);
              })()}
              {/* Highlighted point */}
              {displayPts[highlightedIndex] && (
                <circle cx={toX(displayPts[highlightedIndex][0]) / 2} cy={toY(displayPts[highlightedIndex][1]) / 2} r={2.5} fill="#ef4444" />
              )}
            </svg>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs space-y-2">
          <p><strong>🎓 关键公式：</strong></p>
          <p className="font-mono">z_t = √ᾱ_t · z_0 + √(1-ᾱ_t) · ε,  ε ~ N(0,I)</p>
          <p className="font-mono">x̂₀ = (z_t − √(1-ᾱ_t) · ε̂) / √ᾱ_t</p>
          <p className="font-mono">z_{'{t-1}'} = (z_t − β_t/√(1-ᾱ_t)·ε̂) / √(1-β_t) + σ_t·ε'</p>
          {mode === 'reverse' && reverseDenoiser === 'generation' && (
            <p className="font-mono">score_t(z)=∇_z log p_t(z)； ε̂ = -√(1-ᾱ_t)·score_t(z)</p>
          )}
          <p className="text-gray-500 mt-1">
            alphaBar(0)={alphaBar(0, betas).toFixed(1)}, alphaBar(T)={abT.toFixed(6)}。
            反向链 path[0]=z_T、path[T]=z₀；反向模式下滑块从左到右表示反向进度 s=0→T（扩散时间 t=T→0）。
          </p>
        </div>
      </div>
    </InteractiveDemo>
  );
}
