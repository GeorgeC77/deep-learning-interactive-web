import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { eStep, mStep, logLikelihood, elbo, klResponsibilities, eigen2x2, type GMMParams } from '@/lib/math/em';

/* -------------------------------------------------------------------------- */
/* 固定真值参数                                                               */
/* -------------------------------------------------------------------------- */
const TRUE_MEANS = [[0, 0], [3, 3], [-2, 2]];
const TRUE_COVS = [
  [[1.2, 0.3], [0.3, 0.8]],
  [[0.8, -0.2], [-0.2, 1.0]],
  [[1.0, 0], [0, 1.0]],
];
const TRUE_PIS = [0.4, 0.35, 0.25];

/* -------------------------------------------------------------------------- */
/* 从真值生成数据                                                             */
/* -------------------------------------------------------------------------- */
function generateData(N: number, seed: number): number[][] {
  const rng = mulberry32(seed);
  const pts: number[][] = [];
  for (let i = 0; i < N; i++) {
    const u = rng();
    let cum = 0, k = 0;
    for (; k < TRUE_PIS.length; k++) { cum += TRUE_PIS[k]; if (u < cum) break; }
    const [mx, my] = TRUE_MEANS[k];
    const [[sx, sxy], [_, sy]] = TRUE_COVS[k];
    const bm1 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.cos(2 * Math.PI * rng());
    const bm2 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.sin(2 * Math.PI * rng());
    pts.push([mx + Math.sqrt(sx) * bm1, my + sxy / Math.sqrt(Math.max(sx, 1e-10)) * bm1 + Math.sqrt(Math.max(sy - sxy * sxy / sx, 0)) * bm2]);
  }
  return pts;
}

/* -------------------------------------------------------------------------- */
/* 坏初始化                                                                   */
/* -------------------------------------------------------------------------- */
function badInit(): GMMParams {
  return {
    means: [[1, 1], [2, 2], [-1, -1]],
    covs: [[[0.5, 0], [0, 0.5]], [[0.5, 0], [0, 0.5]], [[0.5, 0], [0, 0.5]]],
    pis: [1 / 3, 1 / 3, 1 / 3],
  };
}

/* -------------------------------------------------------------------------- */
/* SVG                                                                        */
/* -------------------------------------------------------------------------- */
const W = 420, H = 380, MG = { t: 10, r: 10, b: 35, l: 45 };
const PW = W - MG.l - MG.r, PH = H - MG.t - MG.b;
const clusterColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

function ellipsePts(mx: number, my: number, cov: number[][], n: number): string {
  const { vals, vecs } = eigen2x2(cov);
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    const u = Math.cos(angle) * vals[1] * 3, v = Math.sin(angle) * vals[0] * 3;
    const x = mx + vecs[0][0] * u + vecs[1][0] * v;
    const y = my + vecs[0][1] * u + vecs[1][1] * v;
    pts.push(`${toX(x)},${toY(y)}`);
  }
  return pts.join(' ');
}

function toX(v: number) { return MG.l + ((v + 4) / 8) * PW; }
function toY(v: number) { return MG.t + PH - ((v + 4) / 8) * PH; }

export default function EMELBOLab() {
  const dataSeed = 42;
  const K = 3;

  // Data generated from TRUE params, never changes
  const data = useMemo(() => generateData(200, dataSeed), []);

  // Estimated parameters — independent of data generation
  const [estMeans, setEstMeans] = useState<number[][]>(() => badInit().means);
  const [estCovs, setEstCovs] = useState<number[][][]>(() => badInit().covs);
  const [estPis, setEstPis] = useState<number[]>(() => badInit().pis);
  const [responsibilities, setResponsibilities] = useState<number[][] | null>(null);
  const [iteration, setIteration] = useState(0);
  const [logLikHistory, setLogLikHistory] = useState<number[]>([]);

  // ELBO interactive state
  const [selectedPt, setSelectedPt] = useState<number | null>(null);
  const [manualQ, setManualQ] = useState<[number, number, number]>([1/3, 1/3, 1/3]);

  const currentParams: GMMParams = useMemo(() => ({ means: estMeans, covs: estCovs, pis: estPis }), [estMeans, estCovs, estPis]);

  const doEStep = () => {
    const resp = eStep(data, currentParams);
    setResponsibilities(resp);
  };

  const doMStep = () => {
    if (!responsibilities) return;
    const np = mStep(data, responsibilities);
    setEstMeans(np.means); setEstCovs(np.covs); setEstPis(np.pis);
    setIteration(iteration + 1);
    setLogLikHistory([...logLikHistory, logLikelihood(data, np)]);
  };

  const doFullEM = () => {
    const resp = eStep(data, currentParams);
    const np = mStep(data, resp);
    setEstMeans(np.means); setEstCovs(np.covs); setEstPis(np.pis);
    setResponsibilities(resp);
    setIteration(iteration + 1);
    setLogLikHistory([...logLikHistory, logLikelihood(data, np)]);
  };

  const resetBad = () => {
    const bad = badInit();
    setEstMeans(bad.means);
    setEstCovs(bad.covs);
    setEstPis(bad.pis);
    setResponsibilities(null);
    setIteration(0);
    setLogLikHistory([]);
  };

  const llMin = logLikHistory.length ? Math.min(...logLikHistory) : 0;
  const llMax = logLikHistory.length ? Math.max(...logLikHistory) : 1;
  const llRange = Math.max(llMax - llMin, 1);

  // ELBO calculation for selected point
  const elboInfo = useMemo(() => {
    if (selectedPt === null) return null;
    const x = data[selectedPt];
    const q = [manualQ] as number[][];
    const posterior = eStep([x], currentParams)[0];
    const e = elbo([x], currentParams, q);
    const kl = klResponsibilities(q, [posterior]);
    const logP = logLikelihood([x], currentParams);
    return { x, elbo: e, kl, logP, posterior };
  }, [selectedPt, data, currentParams, manualQ]);

  return (
    <InteractiveDemo title="EM 算法与 ELBO：高斯混合模型交互实验">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          数据由固定真值参数生成。观察 EM 通过 E-step（计算 responsibility）和 M-step（更新均值和协方差）优化对数似然。
          椭圆表示协方差矩阵的等高线。
        </p>

        <div className="flex flex-wrap gap-2">
          <button onClick={doEStep} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">▶ E-step</button>
          <button onClick={doMStep} className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">▶ M-step</button>
          <button onClick={doFullEM} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">▶ E+M（一次迭代）</button>
          <button onClick={resetBad} className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">♻ 坏初始化</button>
          <span className="text-xs text-gray-500 self-center ml-2">迭代 #{iteration}</span>
        </div>

        {/* SVG */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
            {data.map(([x, y], i) => {
              const resp = responsibilities?.[i];
              const maxK = resp ? resp.indexOf(Math.max(...resp)) : -1;
              const color = maxK >= 0 ? clusterColors[maxK] : '#9ca3af';
              const opacity = maxK >= 0 ? Math.max(...resp!) * 0.8 + 0.2 : 0.3;
              return <circle key={i} cx={toX(x)} cy={toY(y)} r={2.5} fill={color} opacity={opacity} />;
            })}
            {/* Covariance ellipses */}
            {estCovs.map((cov, i) => (
              <polygon key={`ec-${i}`} points={ellipsePts(estMeans[i][0], estMeans[i][1], cov, 60)} fill="none" stroke={clusterColors[i]} strokeWidth={1} opacity={0.4} />
            ))}
            {/* Cluster centers */}
            {estMeans.map(([mx, my], i) => (
              <g key={i}>
                <circle cx={toX(mx)} cy={toY(my)} r={8} fill="none" stroke={clusterColors[i]} strokeWidth={3} />
                <text x={toX(mx)} y={toY(my) + 4} textAnchor="middle" className="text-[10px] font-bold" fill={clusterColors[i]}>{i + 1}</text>
              </g>
            ))}
            {/* True means */}
            {TRUE_MEANS.map(([mx, my], i) => (
              <text key={`tm-${i}`} x={toX(mx)} y={toY(my) - 8} textAnchor="middle" className="text-[8px]" fill="#6b7280">★</text>
            ))}
            <rect x={MG.l} y={MG.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
          </svg>
          <div className="flex justify-center gap-2 pb-1 text-[10px] text-gray-500">
            <span>★ = 真值中心</span>
            <span>椭圆 = 估计协方差</span>
          </div>
        </div>

        {/* Log-likelihood */}
        {logLikHistory.length > 0 && (
          <div className="bg-white rounded-lg border p-3">
            <div className="text-xs font-medium text-gray-600 mb-1">对数似然 (min={llMin.toFixed(0)}, max={llMax.toFixed(0)})</div>
            <svg viewBox="0 0 400 80" className="w-full" style={{ maxHeight: 100 }}>
              <polyline
                points={logLikHistory.map((l, i) => `${10 + i / Math.max(1, logLikHistory.length - 1) * 380},${70 - ((l - llMin) / llRange) * 60}`).join(' ')}
                fill="none" stroke="#8b5cf6" strokeWidth={2} />
            </svg>
            <div className="text-[10px] text-gray-500 text-right font-mono">当前: {logLikHistory[logLikHistory.length - 1]?.toFixed(1)}</div>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs">
          <p><strong>💡 EM 与 ELBO：</strong></p>
          <p className="mt-1">
            在 E 步中 q(z|x,θ) = p(z|x,θ)，KL(q||p) = 0，ELBO 恰好接触 log p(x|θ)。
            M 步优化完整协方差 Σ_k = (1/Nk) Σ γ_nk (x_n−μ_k)(x_n−μ_k)ᵀ。
            点击"坏初始化"观察 EM 从远离真值的位置如何通过迭代逐步逼近。
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
