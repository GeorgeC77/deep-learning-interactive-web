import { useState, useMemo } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';

/* -------------------------------------------------------------------------- */
/* 高斯密度                                                                    */
/* -------------------------------------------------------------------------- */
function gaussianPdf(x: number, y: number, mx: number, my: number, sx: number, sy: number, rho: number): number {
  const dx = x - mx, dy = y - my;
  const det = sx * sy - rho * rho;
  const inv00 = sy / det, inv11 = sx / det, inv01 = -rho / det;
  const quad = inv00 * dx * dx + 2 * inv01 * dx * dy + inv11 * dy * dy;
  return Math.exp(-0.5 * quad) / (2 * Math.PI * Math.sqrt(Math.max(det, 1e-10)));
}

/* -------------------------------------------------------------------------- */
/* 生成二维数据                                                               */
/* -------------------------------------------------------------------------- */
function generateGMMData(N: number, means: [number, number][], covs: [number, number, number][], pis: number[], seed: number) {
  const rng = mulberry32(seed);
  const points: { x: number; y: number; cluster: number }[] = [];
  for (let i = 0; i < N; i++) {
    const u = rng();
    let cum = 0, k = 0;
    for (; k < pis.length; k++) { cum += pis[k]; if (u < cum) break; }
    const [mx, my] = means[k];
    const [sx, sy, rho] = covs[k];
    // Box-Muller for correlated 2D
    const bm1 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.cos(2 * Math.PI * rng());
    const bm2 = Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-10))) * Math.sin(2 * Math.PI * rng());
    const x = mx + Math.sqrt(sx) * bm1;
    const y = my + (rho / Math.sqrt(sx)) * bm1 + Math.sqrt(sy - rho * rho / sx) * bm2;
    points.push({ x, y, cluster: k });
  }
  return points;
}

/* -------------------------------------------------------------------------- */
/* EM 算法                                                                   */
/* -------------------------------------------------------------------------- */
function emStep(
  points: { x: number; y: number }[],
  means: [number, number][],
  covs: [number, number, number][],
  pis: number[],
): { resp: number[][]; newMeans: [number, number][]; newCovs: [number, number, number][]; newPis: number[]; logLik: number } {
  const K = means.length, N = points.length;
  const resp: number[][] = Array.from({ length: N }, () => Array(K).fill(0));
  let logLik = 0;

  // E-step
  for (let i = 0; i < N; i++) {
    const { x, y } = points[i];
    let total = 0;
    for (let k = 0; k < K; k++) {
      resp[i][k] = pis[k] * gaussianPdf(x, y, means[k][0], means[k][1], covs[k][0], covs[k][1], covs[k][2]);
      total += resp[i][k];
    }
    logLik += Math.log(Math.max(total, 1e-12));
    if (total > 1e-12) for (let k = 0; k < K; k++) resp[i][k] /= total;
  }

  // M-step
  const Nk = resp.reduce((sum, r) => { for (let k = 0; k < K; k++) sum[k] += r[k]; return sum; }, Array(K).fill(0));
  const newMeans: [number, number][] = Array.from({ length: K }, (_, k) => [0, 0]);
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < K; k++) {
      newMeans[k][0] += resp[i][k] * points[i].x / Nk[k];
      newMeans[k][1] += resp[i][k] * points[i].y / Nk[k];
    }
  }
  // Simplified cov: spherical
  const newCovs: [number, number, number][] = means.map(([_, __]) => [0.5, 0.5, 0] as [number, number, number]);
  const newPis = Nk.map((n) => n / N);

  return { resp, newMeans, newCovs, newPis, logLik };
}

/* -------------------------------------------------------------------------- */
/* K-means hard assignment                                                    */
/* -------------------------------------------------------------------------- */
function kmeansAssign(points: { x: number; y: number }[], means: [number, number][]): number[][] {
  const resp: number[][] = points.map((p) => {
    const dists = means.map(([mx, my]) => (p.x - mx) ** 2 + (p.y - my) ** 2);
    const minIdx = dists.indexOf(Math.min(...dists));
    return Array(means.length).fill(0).map((_, k) => k === minIdx ? 1 : 0);
  });
  return resp;
}

const W = 420, H = 380, M = { t: 10, r: 10, b: 35, l: 45 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;

export default function EMELBOLab() {
  const [k, setK] = useState(3);
  const [N] = useState(200);
  const [seed, setSeed] = useState(42);
  const [means, setMeans] = useState<[number, number][]>([[0, 0], [2, 2], [-2, 1]]);
  const [covs, setCovs] = useState<[number, number, number][]>([[0.8, 0.8, 0], [0.5, 0.5, 0], [0.6, 0.6, 0]]);
  const [pis, setPis] = useState([0.4, 0.35, 0.25]);
  const [iteration, setIteration] = useState(0);
  const [mode, setMode] = useState<'soft' | 'hard'>('soft');
  const [logLikHistory, setLogLikHistory] = useState<number[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [showELBO, setShowELBO] = useState(false);
  const [currentResp, setCurrentResp] = useState<number[][] | null>(null);

  const data = useMemo(() => generateGMMData(N, means, covs, pis, seed), [N, seed]);

  const currentMeans = useMemo(() => {
    if (iteration === 0) return means;
    let m = means;
    let c = covs;
    let p = pis;
    const lh: number[] = [];
    for (let t = 0; t < iteration; t++) {
      const { newMeans, newCovs, newPis, logLik, resp } = emStep(data, m, c, p);
      m = newMeans; c = newCovs; p = newPis;
      lh.push(logLik);
      if (t === iteration - 1) setCurrentResp(resp);
    }
    return m;
  }, [iteration, means, data]);

  const singleStep = () => {
    const { newMeans, newCovs, newPis, logLik, resp } = emStep(
      data,
      iteration === 0 ? means : currentMeans,
      iteration === 0 ? covs : currentMeans.map(() => [0.5, 0.5, 0] as [number, number, number]),
      iteration === 0 ? pis : Array(k).fill(1 / k),
    );
    setMeans(newMeans);
    setPis(newPis);
    setCurrentResp(resp);
    setIteration(iteration + 1);
    setLogLikHistory([...logLikHistory, logLik]);
  };

  const resetAll = () => {
    const initMeans: [number, number][] = Array.from({ length: k }, (_, i) => [
      (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4,
    ]);
    setMeans(initMeans);
    setPis(Array(k).fill(1 / k));
    setIteration(0);
    setLogLikHistory([]);
    setCurrentResp(null);
  };

  const kmeansStep = () => {
    const resp = kmeansAssign(data, means);
    setCurrentResp(resp);
    // Update means
    const Nk = Array(k).fill(0);
    const newMeans: [number, number][] = Array.from({ length: k }, () => [0, 0]);
    for (let i = 0; i < N; i++) {
      const ci = resp[i].indexOf(1);
      Nk[ci]++;
      newMeans[ci][0] += data[i].x;
      newMeans[ci][1] += data[i].y;
    }
    for (let ci = 0; ci < k; ci++) {
      if (Nk[ci] > 0) { newMeans[ci][0] /= Nk[ci]; newMeans[ci][1] /= Nk[ci]; }
    }
    setMeans(newMeans);
    setIteration(iteration + 1);
  };

  const toX = (v: number) => M.l + ((v + 3.5) / 7) * PW;
  const toY = (v: number) => M.t + PH - ((v + 3.5) / 7) * PH;

  const clusterColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <InteractiveDemo title="EM 算法与 ELBO：高斯混合模型交互实验">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          观察 EM 算法如何通过交替 E-step（计算责任度 responsibility）和
          M-step（更新均值和混合系数）来优化 GMM 的对数似然。
          拖拽 cluster 中心改变初始条件，对比 soft EM 与 hard K-means。
        </p>

        <div className="flex flex-wrap gap-2">
          <button onClick={mode === 'soft' ? singleStep : kmeansStep}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            {mode === 'soft' ? '▶ 执行一次 EM 迭代 (E+M)' : '▶ 执行一次 K-means 迭代'}
          </button>
          <button onClick={resetAll}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            ↺ 随机重置
          </button>
          <button onClick={() => { setMode(mode === 'soft' ? 'hard' : 'soft'); resetAll(); }}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            {mode === 'soft' ? '切换到 K-means (hard)' : '切换到 EM (soft)'}
          </button>
          <span className="text-xs text-gray-500 self-center ml-2">迭代 #{iteration}</span>
        </div>

        {/* SVG */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 400 }}>
            {/* Grid */}
            {[-2, 0, 2].map((v) => (
              <g key={v}>
                <line x1={toX(v)} y1={M.t} x2={toX(v)} y2={H - M.b} stroke="#f3f4f6" strokeWidth={0.5} />
                <line x1={M.l} y1={toY(v)} x2={W - M.r} y2={toY(v)} stroke="#f3f4f6" strokeWidth={0.5} />
              </g>
            ))}
            {/* Data points */}
            {data.map((p, i) => {
              const resp = currentResp?.[i];
              const color = resp ? clusterColors[resp.indexOf(Math.max(...resp))] : '#9ca3af';
              const opacity = resp ? Math.max(...resp) * 0.8 + 0.2 : 0.3;
              return <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={2.5} fill={color} opacity={opacity} />;
            })}
            {/* Cluster centers */}
            {currentMeans.map(([mx, my], i) => (
              <g key={i}>
                <circle cx={toX(mx)} cy={toY(my)} r={8} fill="none" stroke={clusterColors[i]} strokeWidth={3} />
                <text x={toX(mx)} y={toY(my) + 4} textAnchor="middle" className="text-[10px] font-bold" fill={clusterColors[i]}>{i + 1}</text>
              </g>
            ))}
            <rect x={M.l} y={M.t} width={PW} height={PH} fill="none" stroke="#d1d5db" strokeWidth={1} />
          </svg>
        </div>

        {/* Log-likelihood */}
        {logLikHistory.length > 0 && (
          <div className="bg-white rounded-lg border p-3">
            <div className="text-xs font-medium text-gray-600 mb-1">对数似然变化</div>
            <svg viewBox="0 0 400 80" className="w-full" style={{ maxHeight: 100 }}>
              <polyline
                points={logLikHistory.map((l, i) => `${10 + i / Math.max(1, logLikHistory.length - 1) * 380},${70 - (Math.abs(l % 100)) / 3}`).join(' ')}
                fill="none" stroke="#8b5cf6" strokeWidth={2} />
            </svg>
            <div className="text-[10px] text-gray-500 text-right font-mono">
              当前: {logLikHistory[logLikHistory.length - 1]?.toFixed(1) ?? '-'}
            </div>
          </div>
        )}

        {/* ELBO explanation */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs">
          <p><strong>💡 EM 与 ELBO：</strong></p>
          <p className="mt-1">
            在 E 步中，后验 q(z|x,θ) = p(z|x,θ)，此时 KL(q||p) = 0，ELBO 恰好接触对数似然 log p(x|θ)。
            M 步优化 ELBO（即 Q 函数），间接提升对数似然。
            与 K-means（hard assignment）相比，EM 的 soft assignment 考虑了不确定性，
            避免了将边界点强行分配给单一聚类的错误。
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
