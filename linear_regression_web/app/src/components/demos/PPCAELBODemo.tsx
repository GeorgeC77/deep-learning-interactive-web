import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';

const N = 80;
const SEED = 123;
const TRUE_SIGMA = 0.4;

export default function PPCAELBODemo() {
  const [M, setM] = useState(1);
  const [sigma2, setSigma2] = useState(0.5);
  const [sampleIdx, setSampleIdx] = useState(0);

  const data = useMemo(() => generatePPCAData(N, SEED), []);
  const mean = useMemo(() => {
    const m = [0, 0];
    for (const [x, y] of data) {
      m[0] += x;
      m[1] += y;
    }
    return [m[0] / data.length, m[1] / data.length];
  }, [data]);
  const centered = useMemo(() => data.map(([x, y]) => [x - mean[0], y - mean[1]]), [data, mean]);

  const { eigenvalues, eigenvectors, W, Minv, reconstructions, mse, logLikelihood } = useMemo(() => {
    const S = covariance(centered);
    const { values, vectors } = eig2x2(S);
    const sortedIdx = values.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
    const sortedValues = sortedIdx.map(([v]) => v);
    const sortedVectors = sortedIdx.map(([, i]) => vectors[i]);

    // PPCA W for chosen M and sigma2 (D x M)
    const Wt: number[][] = [[], []];
    for (let i = 0; i < M; i++) {
      const lambda = sortedValues[i];
      const scale = Math.sqrt(Math.max(0, lambda - sigma2));
      for (let d = 0; d < 2; d++) {
        Wt[d].push(sortedVectors[i][d] * scale);
      }
    }

    // M = W^T W + sigma^2 I (M x M)
    const Mmat: number[][] = [];
    for (let i = 0; i < M; i++) {
      const row: number[] = [];
      for (let j = 0; j < M; j++) {
        const wi = [Wt[0][i], Wt[1][i]];
        const wj = [Wt[0][j], Wt[1][j]];
        row.push(dot(wi, wj) + (i === j ? sigma2 : 0));
      }
      Mmat.push(row);
    }
    const invM = invertMxM(Mmat);

    const reconstructions: number[][] = [];
    let sqErr = 0;
    for (const x of centered) {
      // E[z|x] = M^{-1} W^T x
      const wtX: number[] = [];
      for (let i = 0; i < M; i++) {
        wtX.push(dot([Wt[0][i], Wt[1][i]], x));
      }
      const z = invM ? matVecMul(invM, wtX) : Array(M).fill(0);
      const xHat = [0, 0];
      for (let i = 0; i < M; i++) {
        xHat[0] += Wt[0][i] * z[i];
        xHat[1] += Wt[1][i] * z[i];
      }
      reconstructions.push([xHat[0] + mean[0], xHat[1] + mean[1]]);
      const dx = x[0] - xHat[0];
      const dy = x[1] - xHat[1];
      sqErr += dx * dx + dy * dy;
    }

    // log-likelihood under C = W W^T + sigma2 I
    // Actually compute C from model parameters
    const Cmodel = [[sigma2, 0], [0, sigma2]];
    for (let i = 0; i < M; i++) {
      const w = Wt.map((row) => row[i]);
      Cmodel[0][0] += w[0] * w[0];
      Cmodel[0][1] += w[0] * w[1];
      Cmodel[1][0] += w[1] * w[0];
      Cmodel[1][1] += w[1] * w[1];
    }
    const det = Cmodel[0][0] * Cmodel[1][1] - Cmodel[0][1] * Cmodel[1][0];
    const invC = [
      [Cmodel[1][1] / det, -Cmodel[0][1] / det],
      [-Cmodel[1][0] / det, Cmodel[0][0] / det],
    ];
    const traceTerm = S[0][0] * invC[0][0] + S[0][1] * invC[1][0] + S[1][0] * invC[0][1] + S[1][1] * invC[1][1];
    const ll = -0.5 * N * (2 * Math.log(2 * Math.PI) + Math.log(det) + traceTerm);

    return {
      eigenvalues: sortedValues,
      eigenvectors: sortedVectors,
      W: Wt,
      Minv: invM,
      reconstructions,
      mse: sqErr / N,
      logLikelihood: ll,
    };
  }, [centered, M, sigma2]);

  const selected = centered[sampleIdx];
  const wtX: number[] = [];
  for (let i = 0; i < M; i++) {
    wtX.push(dot([W[0][i], W[1][i]], selected));
  }
  const ez = Minv ? matVecMul(Minv, wtX) : Array(M).fill(0);
  const posteriorCov = Minv ? Minv.map((row) => row.map((v) => v * sigma2)) : Array(M).fill(0).map(() => Array(M).fill(0));
  const ezzT: number[][] = [];
  for (let i = 0; i < M; i++) {
    const row: number[] = [];
    for (let j = 0; j < M; j++) {
      row.push(posteriorCov[i][j] + ez[i] * ez[j]);
    }
    ezzT.push(row);
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">EM</div>
        <h2 className="text-2xl font-bold text-gray-900">连续隐变量：PPCA 的 E-step / M-step 演示</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">潜在维度 M：{M}</label>
          <Slider value={[M]} min={1} max={2} step={1} onValueChange={([v]) => setM(v)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">噪声方差 σ²：{sigma2.toFixed(2)}</label>
          <Slider value={[sigma2]} min={0.05} max={1.5} step={0.05} onValueChange={([v]) => setSigma2(v)} className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox label="重构 MSE" value={mse} />
        <MetricBox label="对数似然" value={logLikelihood} />
        <MetricBox label="特征值 λ₁" value={eigenvalues[0]} />
        <MetricBox label="特征值 λ₂" value={eigenvalues[1]} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">选择样本查看 E-step 统计量：索引 {sampleIdx}</label>
        <Slider
          value={[sampleIdx]}
          min={0}
          max={N - 1}
          step={1}
          onValueChange={([v]) => setSampleIdx(v)}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-2">E-step：充分统计量</p>
          <p>
            <span className="text-gray-600">E[z|x] = [{ez.map((v) => v.toFixed(3)).join(', ')}]</span>
          </p>
          <p className="mt-1">
            <span className="text-gray-600">E[zzᵀ|x] =</span>
          </p>
          <div className="font-mono text-gray-700">
            {ezzT.map((row, i) => (
              <div key={i}>[{row.map((v) => v.toFixed(3)).join(', ')}]</div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-gray-700 mb-2">M-step：当前参数</p>
          <p>
            <span className="text-gray-600">σ² = {sigma2.toFixed(3)}</span>
          </p>
          <p className="mt-1">
            <span className="text-gray-600">W =</span>
          </p>
          <div className="font-mono text-gray-700">
            [{W[0].map((v) => v.toFixed(3)).join(', ')}]
            <br />
            [{W[1].map((v) => v.toFixed(3)).join(', ')}]
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">E-step：</span>
          <span className="font-mono">E[z|x] = M^{-1} Wᵀ x</span>，其中 M = WᵀW + σ²I；
          <span className="font-mono">E[zzᵀ|x] = σ² M^{-1} + E[z|x]E[z|x]ᵀ</span>。
        </p>
        <p>
          <span className="font-medium">M-step：</span>
          用所有样本的充分统计量更新 W 和 σ²。
        </p>
        <p className="text-gray-500">
          提示：σ²→0 且 M=1 时，PPCA 退化为标准 PCA；M=2 时模型能完全拟合二维数据。
        </p>
      </div>

      <div className="h-64 relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <ScatterPlot
          data={data}
          reconstructions={reconstructions}
          principalAxis={eigenvectors[0]}
          mean={mean}
        />
      </div>
    </section>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold text-blue-700">{Number.isFinite(value) ? value.toFixed(3) : '—'}</div>
    </div>
  );
}

function ScatterPlot({
  data,
  reconstructions,
  principalAxis,
  mean,
}: {
  data: number[][];
  reconstructions: number[][];
  principalAxis: number[];
  mean: number[];
}) {
  const all = [...data, ...reconstructions];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(...xs) - 0.5;
  const maxX = Math.max(...xs) + 0.5;
  const minY = Math.min(...ys) - 0.5;
  const maxY = Math.max(...ys) + 0.5;

  const toSvg = (x: number, y: number) => ({
    sx: 5 + ((x - minX) / (maxX - minX)) * 90,
    sy: 95 - ((y - minY) / (maxY - minY)) * 90,
  });

  const lineLen = Math.max(maxX - minX, maxY - minY);
  const p1 = toSvg(mean[0] - principalAxis[0] * lineLen, mean[1] - principalAxis[1] * lineLen);
  const p2 = toSvg(mean[0] + principalAxis[0] * lineLen, mean[1] + principalAxis[1] * lineLen);

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Principal axis */}
      <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="3,3" />
      {/* Data points */}
      {data.map(([x, y], i) => {
        const { sx, sy } = toSvg(x, y);
        const { sx: rx, sy: ry } = toSvg(reconstructions[i][0], reconstructions[i][1]);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={rx} y2={ry} stroke="#93c5fd" strokeWidth={0.3} />
            <circle cx={sx} cy={sy} r={1} fill="#2563eb" />
            <circle cx={rx} cy={ry} r={1} fill="#16a34a" />
          </g>
        );
      })}
      <text x={5} y={8} fontSize={4} fill="#4b5563">
        蓝=原始点，绿=重构点，红=第一主方向
      </text>
    </svg>
  );
}

function generatePPCAData(n: number, seed: number) {
  const rng = mulberry32(seed);
  const out: number[][] = [];
  const W = [2, 1];
  for (let i = 0; i < n; i++) {
    const z = randn(rng);
    const epsX = randn(rng) * TRUE_SIGMA;
    const epsY = randn(rng) * TRUE_SIGMA;
    out.push([W[0] * z + epsX, W[1] * z + epsY]);
  }
  return out;
}

function covariance(points: number[][]) {
  const n = points.length;
  const S = [
    [0, 0],
    [0, 0],
  ];
  for (const [x, y] of points) {
    S[0][0] += x * x;
    S[0][1] += x * y;
    S[1][0] += y * x;
    S[1][1] += y * y;
  }
  return S.map((row) => row.map((v) => v / n));
}

function eig2x2(A: number[][]) {
  const a = A[0][0];
  const b = A[0][1];
  const c = A[1][0];
  const d = A[1][1];
  const trace = a + d;
  const det = a * d - b * c;
  const disc = Math.sqrt(trace * trace - 4 * det);
  const l1 = (trace + disc) / 2;
  const l2 = (trace - disc) / 2;

  // Eigenvectors
  const v1 = [l1 - d, c];
  const v2 = [l2 - d, c];
  const n1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]) || 1;
  const n2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]) || 1;
  return {
    values: [l1, l2],
    vectors: [
      [v1[0] / n1, v1[1] / n1],
      [v2[0] / n2, v2[1] / n2],
    ],
  };
}

function dot(a: number[], b: number[]) {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

function matVecMul(M: number[][], v: number[]) {
  return M.map((row) => dot(row, v));
}

function invertMxM(M: number[][]) {
  const n = M.length;
  if (n === 0) return null;
  if (n === 1) {
    const det = M[0][0];
    if (Math.abs(det) < 1e-12) return null;
    return [[1 / det]];
  }
  if (n === 2) {
    const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    if (Math.abs(det) < 1e-12) return null;
    return [
      [M[1][1] / det, -M[0][1] / det],
      [-M[1][0] / det, M[0][0] / det],
    ];
  }
  return null;
}

function randn(rng: () => number) {
  const u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
