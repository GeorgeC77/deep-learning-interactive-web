import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  generatePPCAData,
  sampleMean,
  sampleCovariance,
  eig2x2,
  ppcaClosedFormML,
  posteriorReconstruction,
  posteriorMean,
  pcaOrthogonalProjection,
  ppcaLogLikelihood,
  ppcaCovariance,
  rotationMatrix,
  rotateW,
} from '@/lib/math/ppca';

const N = 80;
const SEED = 123;
const TRUE_SIGMA = 0.4;
const TRUE_W = [[2], [1]]; // D x M

export default function PPCAELBODemo({ initialM = 1 }: { initialM?: number } = {}) {
  const [M, setM] = useState(initialM);
  const [userSigma2, setUserSigma2] = useState(0.5);
  const [rotationPhi, setRotationPhi] = useState(0);

  const data = useMemo(
    () => generatePPCAData(N, SEED, TRUE_W, TRUE_SIGMA),
    [],
  );

  const {
    mean,
    ml,
    ppcaRecons,
    pcaRecons,
    msePPCA,
    msePCA,
    llUser,
    llML,
    covarianceDiff,
    zBase,
    zRot,
  } = useMemo(() => {
    const mean = sampleMean(data);
    const centered = data.map((row) => row.map((v, i) => v - mean[i]));
    const S = sampleCovariance(centered);
    const { eigenvalues, eigenvectors } = eig2x2(S);

    const ml = ppcaClosedFormML(S, M);

    // Base W evaluated at the user-chosen σ² (for comparison with the ML solution).
    const D = TRUE_W.length;
    const baseW: number[][] = Array.from({ length: D }, () => []);
    for (let i = 0; i < M; i++) {
      const scale = Math.sqrt(Math.max(0, eigenvalues[i] - userSigma2));
      for (let d = 0; d < D; d++) {
        baseW[d][i] = eigenvectors[i][d] * scale;
      }
    }

    // Apply an arbitrary orthogonal rotation R to demonstrate non-identifiability.
    const R = rotationMatrix(M, rotationPhi);
    const userW = rotateW(baseW, R);

    const ppcaRecons = data.map((x) =>
      posteriorReconstruction(x, userW, userSigma2, mean),
    );
    const pcaRecons = data.map((x) =>
      pcaOrthogonalProjection(x, eigenvectors, M, mean),
    );

    const msePPCA =
      data.reduce((sum, x, i) => {
        const r = ppcaRecons[i];
        const dx = x[0] - r[0];
        const dy = x[1] - r[1];
        return sum + dx * dx + dy * dy;
      }, 0) / N;

    const msePCA =
      data.reduce((sum, x, i) => {
        const r = pcaRecons[i];
        const dx = x[0] - r[0];
        const dy = x[1] - r[1];
        return sum + dx * dx + dy * dy;
      }, 0) / N;

    const llUser = ppcaLogLikelihood(S, userW, userSigma2, N);
    const llML = ml.boundary
      ? NaN
      : ppcaLogLikelihood(S, ml.Wml, ml.sigma2ml, N);

    // Invariants under orthogonal rotation of W.
    const Cbase = ppcaCovariance(baseW, userSigma2);
    const Crot = ppcaCovariance(userW, userSigma2);
    const covarianceDiff = Math.abs(Cbase[0][0] - Crot[0][0]) + Math.abs(Cbase[0][1] - Crot[0][1]) + Math.abs(Cbase[1][1] - Crot[1][1]);

    // Latent coordinate of the first sample before and after rotation.
    const firstCentered = [data[0][0] - mean[0], data[0][1] - mean[1]];
    const zBase = posteriorMean(firstCentered, baseW, userSigma2);
    const zRot = posteriorMean(firstCentered, userW, userSigma2);

    return {
      mean,
      ml,
      userW,
      baseW,
      R,
      ppcaRecons,
      pcaRecons,
      msePPCA,
      msePCA,
      llUser,
      llML,
      covarianceDiff,
      zBase,
      zRot,
    };
  }, [data, M, userSigma2, rotationPhi]);

  const reset = () => {
    setM(initialM);
    setUserSigma2(0.5);
    setRotationPhi(0);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">
          ML
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          PPCA 闭式最大似然解与后验投影
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            潜在维度 M：{M}
          </label>
          <Slider
            value={[M]}
            min={0}
            max={2}
            step={1}
            onValueChange={([v]) => setM(v)}
            className="mt-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            用户噪声方差 σ²：{userSigma2.toFixed(2)}
          </label>
          <Slider
            value={[userSigma2]}
            min={0.02}
            max={1.2}
            step={0.02}
            onValueChange={([v]) => setUserSigma2(v)}
            className="mt-2"
          />
        </div>
        {M >= 1 && (
          <div>
            <label className="text-sm font-medium text-gray-700">
              正交旋转角 φ：{(rotationPhi * 180 / Math.PI).toFixed(0)}°
            </label>
            <Slider
              value={[rotationPhi]}
              min={-Math.PI}
              max={Math.PI}
              step={Math.PI / 36}
              onValueChange={([v]) => setRotationPhi(v)}
              className="mt-2"
            />
          </div>
        )}
        <div className="flex justify-end">
          <Button variant="outline" onClick={reset}>
            重置
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricBox label="用户 σ²" value={userSigma2} />
        <MetricBox
          label="ML σ²"
          value={ml.sigma2ml}
          fallback={ml.boundary ? '边界' : undefined}
        />
        <MetricBox label="PPCA 重构 MSE" value={msePPCA} />
        <MetricBox label="PCA 重构 MSE" value={msePCA} />
        <MetricBox label="当前对数似然" value={llUser} />
        <MetricBox
          label="ML 对数似然"
          value={llML}
          fallback={ml.boundary ? '不适用' : undefined}
        />
      </div>

      <div className="h-64 relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <ScatterPlot
          data={data}
          ppcaRecons={ppcaRecons}
          pcaRecons={pcaRecons}
          mean={mean}
        />
      </div>

      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <span className="font-medium">闭式 ML 解：</span>
          对样本协方差 <span className="font-mono">S</span> 做特征分解{' '}
          <span className="font-mono">S = U Λ Uᵀ</span>，取前 M 个特征向量{' '}
          <span className="font-mono">U_M</span> 与特征值{' '}
          <span className="font-mono">Λ_M</span>，有
        </p>
        <p className="font-mono bg-gray-50 rounded p-2">
          W_ML = U_M (Λ_M − σ²_ML I)^{1/2} R
          <br />
          σ²_ML = (λ_{M+1} + … + λ_D) / (D − M)
        </p>
        <p>
          其中 <span className="font-mono">R</span> 是任意{' '}
          <span className="font-mono">M × M</span> 正交矩阵。本页默认取{' '}
          <span className="font-mono">R = I</span> 作为代表；当 M = 1 时仍有 ±
          符号不确定性，当 M ≥ 2 时还存在潜在空间的旋转不确定性。这种不可辨识性在{' '}
          <span className="font-mono">M &lt; D</span> 时就已经存在，不只在 M = D 边界。
        </p>
        <p>
          这里 <span className="font-mono">σ²_ML</span> 是被丢弃方向的平均方差。
          后验均值在隐空间为
          <span className="font-mono">
            E[z|x] = (WᵀW + σ²I)^{-1} Wᵀ (x − x̄)
          </span>
          ，重构样本为
          <span className="font-mono">
            x̂_post = μ + W E[z|x]
          </span>
          （等价于 <span className="font-mono">E[μ + Wz | x]</span>）。
          当 σ² → 0 时，PPCA 的后验均值退化为标准 PCA 的正交投影。
        </p>
        {M === 0 && (
          <p className="text-blue-700 bg-blue-50 rounded p-2">
            <span className="font-medium">M = 0 基准：</span>
            潜在维度为 0 时，模型退化为零因子的各向同性高斯{' '}
            <span className="font-mono">x ~ N(μ, σ²I)</span>。此时后验没有隐变量，
            重构退化为数据均值 <span className="font-mono">μ</span>，可作为降维前的基准。
          </p>
        )}
        {M === 1 && (
          <p className="text-green-700 bg-green-50 rounded p-2">
            <span className="font-medium">M = 1：</span>
            标准的二维 → 一维 PPCA 降维。后验均值给出沿主方向的收缩投影，
            与 PCA 正交投影略有不同（σ² 越大收缩越明显）。此时 W 只有 ± 两种符号选择，
            旋转角 φ 用来演示这一符号不确定性。
          </p>
        )}
        {M >= 1 && (
          <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-900 space-y-1">
            <p className="font-medium">旋转不变量实验</p>
            <p>
              改变 φ 会让 W 旋转，但以下量保持不变：
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <span className="font-mono">W Wᵀ</span> 差异：{covarianceDiff.toExponential(2)}
              </li>
              <li>
                <span className="font-mono">C = W Wᵀ + σ²I</span> 不变 ⇒ 对数似然不变（当前：{llUser.toFixed(3)}）
              </li>
              <li>
                观测空间重构不变（见上图绿色点）
              </li>
              <li>
                隐空间坐标反向旋转：Rᵀ E[z|x] 保持一致
                （示例点 z_base = [{zBase.map((v) => v.toFixed(2)).join(', ')}]，
                z_rot = [{zRot.map((v) => v.toFixed(2)).join(', ')}]）
              </li>
            </ul>
          </div>
        )}
        {ml.boundary && (
          <p className="text-amber-700 bg-amber-50 rounded p-2">
            <span className="font-medium">M = D 边界情形：</span>
            标准 PPCA 要求 M &lt; D；此时没有“被丢弃特征值”，σ²_ML
            的闭式公式不适用。若仍令 σ² &gt; 0，后验均值仍存在收缩（shrinkage），但因子分解不再唯一。
          </p>
        )}
      </div>
    </section>
  );
}

function MetricBox({
  label,
  value,
  fallback,
}: {
  label: string;
  value: number;
  fallback?: string;
}) {
  const display = Number.isFinite(value)
    ? value.toFixed(3)
    : fallback ?? '—';
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold text-blue-700">{display}</div>
    </div>
  );
}

function ScatterPlot({
  data,
  ppcaRecons,
  pcaRecons,
  mean,
}: {
  data: number[][];
  ppcaRecons: number[][];
  pcaRecons: number[][];
  mean: number[];
}) {
  const all = [...data, ...ppcaRecons, ...pcaRecons];
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

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.map(([x, y], i) => {
        const { sx, sy } = toSvg(x, y);
        const { sx: rx, sy: ry } = toSvg(ppcaRecons[i][0], ppcaRecons[i][1]);
        const { sx: px, sy: py } = toSvg(pcaRecons[i][0], pcaRecons[i][1]);
        return (
          <g key={i}>
            <line
              x1={sx}
              y1={sy}
              x2={rx}
              y2={ry}
              stroke="#86efac"
              strokeWidth={0.3}
            />
            <line
              x1={sx}
              y1={sy}
              x2={px}
              y2={py}
              stroke="#fdba74"
              strokeWidth={0.3}
              strokeDasharray="1,1"
            />
            <circle cx={sx} cy={sy} r={1.2} fill="#2563eb" />
            <circle cx={rx} cy={ry} r={1} fill="#16a34a" />
            <circle
              cx={px}
              cy={py}
              r={1}
              fill="#f97316"
              stroke="#c2410c"
              strokeWidth={0.4}
              strokeDasharray="1,1"
            />
          </g>
        );
      })}
      {/* Mean marker */}
      {(() => {
        const { sx, sy } = toSvg(mean[0], mean[1]);
        return <circle cx={sx} cy={sy} r={1.5} fill="#dc2626" />;
      })()}
      <text x={5} y={8} fontSize={3.5} fill="#4b5563">
        蓝=原始点，绿=PPCA 后验均值重构，橙虚=PCA 正交投影
      </text>
    </svg>
  );
}
