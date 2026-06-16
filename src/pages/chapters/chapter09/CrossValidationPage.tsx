import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, SplitSquareHorizontal, CheckCircle2 , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';

/* -------------------------------------------------------------------------- */
/* 数值工具                                                                   */
/* -------------------------------------------------------------------------- */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let j = i; j <= n; j++) M[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k][i];
      for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
    }
  }

  return M.map((row) => row[n]);
}

function designMatrix(xs: number[], degree: number): number[][] {
  return xs.map((x) => Array.from({ length: degree + 1 }, (_, j) => Math.pow(x, j)));
}

function polyFit(xs: number[], ys: number[], degree: number): number[] {
  const effectiveDegree = Math.max(0, Math.min(degree, xs.length - 1));
  if (xs.length < effectiveDegree + 1) return new Array(effectiveDegree + 1).fill(0);
  const X = designMatrix(xs, effectiveDegree);
  const Xt = X[0].map((_, col) => X.map((row) => row[col]));
  const XtX = Xt.map((row) => row.map((_, j) => row.reduce((sum, v, i) => sum + v * X[i][j], 0)));
  const Xty = Xt.map((row) => row.reduce((sum, v, i) => sum + v * ys[i], 0));
  return solveLinearSystem(XtX, Xty);
}

function predict(xs: number[], weights: number[]): number[] {
  return xs.map((x) => weights.reduce((sum, w, j) => sum + w * Math.pow(x, j), 0));
}

function mse(pred: number[], actual: number[]): number {
  return pred.reduce((sum, p, i) => sum + Math.pow(p - actual[i], 2), 0) / pred.length;
}

function trueFunction(x: number): number {
  return 4 * Math.pow(x - 0.5, 2);
}

function generateUniform(n: number, seed: number): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(s / 233280);
  }
  return out;
}

function generateGaussian(n: number, seed: number): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const u = Math.max(1e-10, s / 233280);
    s = (s * 9301 + 49297) % 233280;
    const v = s / 233280;
    out.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  return out;
}

function generateData(n: number, noise: number, seed: number): { x: number[]; y: number[] } {
  const x = generateUniform(n, seed);
  const noiseValues = generateGaussian(n, seed + 1000000);
  const y = x.map((xi, i) => trueFunction(xi) + noise * noiseValues[i]);
  return { x, y };
}

/* -------------------------------------------------------------------------- */
/* SVG 参数                                                                   */
/* -------------------------------------------------------------------------- */
const WIDTH = 720;
const HEIGHT = 360;
const PADDING = { top: 20, right: 30, bottom: 50, left: 60 };
const X_MIN = 0;
const X_MAX = 1;
const Y_MIN = -0.8;
const Y_MAX = 1.6;

function scaleX(x: number): number {
  return PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - PADDING.left - PADDING.right);
}

function scaleY(y: number): number {
  return HEIGHT - PADDING.bottom - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (HEIGHT - PADDING.top - PADDING.bottom);
}

function pathFromPoints(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
}

function ChartFrame() {
  const gridX = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const gridY = [-0.5, 0, 0.5, 1.0, 1.5];
  return (
    <>
      <rect x={PADDING.left} y={PADDING.top} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT - PADDING.top - PADDING.bottom} fill="#f9fafb" />
      {gridX.map((x) => (
        <line key={`vx-${x}`} x1={scaleX(x)} y1={PADDING.top} x2={scaleX(x)} y2={HEIGHT - PADDING.bottom} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {gridY.map((y) => (
        <line key={`hy-${y}`} x1={PADDING.left} y1={scaleY(y)} x2={WIDTH - PADDING.right} y2={scaleY(y)} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      <line x1={PADDING.left} y1={HEIGHT - PADDING.bottom} x2={WIDTH - PADDING.right} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={HEIGHT - PADDING.bottom} stroke="#374151" strokeWidth={2} />
      {gridX.map((x) => (
        <text key={`lx-${x}`} x={scaleX(x)} y={HEIGHT - PADDING.bottom + 20} textAnchor="middle" fontSize={12} fill="#4b5563">{x.toFixed(1)}</text>
      ))}
      {gridY.map((y) => (
        <text key={`ly-${y}`} x={PADDING.left - 10} y={scaleY(y) + 4} textAnchor="end" fontSize={12} fill="#4b5563">{y.toFixed(1)}</text>
      ))}
      <text x={WIDTH / 2} y={HEIGHT - 10} textAnchor="middle" fontSize={13} fill="#374151">x</text>
      <text x={20} y={HEIGHT / 2} textAnchor="middle" fontSize={13} fill="#374151" transform={`rotate(-90, 20, ${HEIGHT / 2})`}>y</text>
    </>
  );
}

export default function CrossValidationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第九章 · 正则化与模型选择
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">交叉验证与模型选择</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          模型选择的目标是在偏差与方差之间找到最佳平衡。交叉验证通过把数据分成训练集和验证集，
          用验证集上的误差来估计模型的泛化性能，从而选择最合适的模型复杂度。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <SplitSquareHorizontal className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">为什么不能用训练误差选模型？</h2>
        </div>
        <p className="text-gray-700 mb-4">
          更复杂的模型几乎总是能在训练集上取得更小的误差。如果仅凭训练误差选择模型，
          我们总会倾向于选择最复杂的模型，导致过拟合。因此，我们需要一个模型没有“见过”的数据集来估计其真实泛化能力。
        </p>

        <FormulaCard
          title="留出交叉验证"
          formula={
            <KaTeX
              math={String.raw`\hat{\varepsilon}_{\text{cv}}(h) = \frac{1}{|S_{\text{cv}}|}\sum_{(x,y)\in S_{\text{cv}}} \bigl(y - h(x)\bigr)^2`}
              display
            />
          }
          description="将数据随机分为训练集与验证集，用训练集训练模型，用验证集估计泛化误差。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：k 折交叉验证</h2>
        <p className="text-gray-700 mb-4">
          数据集被均分为 k 份。每次取其中一份作为验证集，其余作为训练集，最后把 k 次验证误差平均。
          调整多项式次数，观察训练误差、平均验证误差和独立测试误差的变化。
        </p>
        <CrossValidationDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>训练误差不能用于选择模型复杂度，因为它总是偏向复杂模型。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>留出法简单但浪费数据；k 折交叉验证更充分地利用数据。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>验证误差最小的模型通常最接近真实泛化误差。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 交互演示                                                                   */
/* -------------------------------------------------------------------------- */
function CrossValidationDemo() {
  const [degree, setDegree] = useState(5);
  const [k, setK] = useState(5);
  const [nTrain, setNTrain] = useState(30);
  const [noise, setNoise] = useState(0.2);
  const [seed, setSeed] = useState(42);

  const { fullData, foldResults, trainError, valError, testError, predPoints, truePoints } = useMemo(() => {
    const data = generateData(nTrain, noise, seed);
    const testData = generateData(100, noise, seed + 2000);

    // 按顺序分成 k 份（示例数据已随机打乱，这里按索引顺序分即可）
    const foldSize = Math.floor(data.x.length / k);
    const folds = Array.from({ length: k }, (_, f) => ({
      indices: Array.from({ length: foldSize }, (_, i) => f * foldSize + i),
    }));

    const results = folds.map((fold) => {
      const trainIndices = data.x.map((_, i) => i).filter((i) => !fold.indices.includes(i));
      const trainX = trainIndices.map((i) => data.x[i]);
      const trainY = trainIndices.map((i) => data.y[i]);
      const valX = fold.indices.map((i) => data.x[i]);
      const valY = fold.indices.map((i) => data.y[i]);

      const w = polyFit(trainX, trainY, degree);
      const trainErr = mse(predict(trainX, w), trainY);
      const valErr = mse(predict(valX, w), valY);
      return { trainErr, valErr, valIndices: fold.indices };
    });

    const avgTrain = results.reduce((sum, r) => sum + r.trainErr, 0) / results.length;
    const avgVal = results.reduce((sum, r) => sum + r.valErr, 0) / results.length;

    // 在全训练集上重新训练并评估测试集
    const finalW = polyFit(data.x, data.y, degree);
    const testErr = mse(predict(testData.x, finalW), testData.y);

    const curvePoints = Array.from({ length: 200 }, (_, i) => (i / 199) * (X_MAX - X_MIN) + X_MIN);
    return {
      fullData: data,
      foldResults: results,
      trainError: avgTrain,
      valError: avgVal,
      testError: testErr,
      predPoints: curvePoints.map((x) => ({ x, y: predict([x], finalW)[0] })),
      truePoints: curvePoints.map((x) => ({ x, y: trueFunction(x) })),
    };
  }, [degree, k, nTrain, noise, seed]);

  const colors = ['#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#84cc16', '#6366f1', '#14b8a6', '#d946ef'];
  const pointFold = fullData.x.map((_, i) => {
    const f = foldResults.findIndex((r) => r.valIndices.includes(i));
    return f >= 0 ? f : -1;
  });

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ControlRow label={`多项式次数: ${degree}`}>
            <Slider value={[degree]} min={1} max={12} step={1} onValueChange={(v) => setDegree(v[0])} />
          </ControlRow>
          <ControlRow label={`折数 k: ${k}`}>
            <Slider value={[k]} min={2} max={10} step={1} onValueChange={(v) => setK(v[0])} />
          </ControlRow>
          <ControlRow label={`训练样本数: ${nTrain}`}>
            <Slider value={[nTrain]} min={20} max={100} step={5} onValueChange={(v) => setNTrain(v[0])} />
          </ControlRow>
          <ControlRow label={`噪声标准差: ${noise.toFixed(2)}`}>
            <Slider value={[noise]} min={0} max={0.5} step={0.01} onValueChange={(v) => setNoise(v[0])} />
          </ControlRow>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新采样
          </button>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">平均训练误差:</span>
              <span className="font-mono font-medium text-blue-700">{trainError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均验证误差:</span>
              <span className="font-mono font-medium text-violet-700">{valError.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">测试误差:</span>
              <span className="font-mono font-medium text-emerald-700">{testError.toFixed(6)}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full min-w-[360px]" style={{ maxHeight: 360 }}>
            <ChartFrame />
            <path d={pathFromPoints(truePoints)} fill="none" stroke="#374151" strokeWidth={2} strokeDasharray="6 4" />
            <path d={pathFromPoints(predPoints)} fill="none" stroke="#2563eb" strokeWidth={3} />
            {fullData.x.map((x, i) => {
              const f = pointFold[i];
              const color = f >= 0 ? colors[f % colors.length] : '#9ca3af';
              return (
                <circle key={`tr-${i}`} cx={scaleX(x)} cy={scaleY(fullData.y[i])} r={5} fill={color} opacity={0.8} stroke="white" strokeWidth={1} />
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-3 justify-center mt-2 text-xs text-gray-600">
            {Array.from({ length: k }, (_, f) => (
              <span key={f} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[f % colors.length] }} />
                第 {f + 1} 折验证集
              </span>
            ))}
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-blue-600" /> 拟合曲线</span>
            <span className="flex items-center gap-1"><span className="w-6 h-0.5 border-b-2 border-dashed border-gray-700" /> 真实函数</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
